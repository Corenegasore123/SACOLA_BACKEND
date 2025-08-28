import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private hbs: any;
  private templatesEnabled = false;
  private templatesViewDir: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeTransporter();
  }

 
private async initializeTransporter() {
  const mailService = this.configService.get<string>('MAIL_SERVICE');
  const envUser = this.configService.get<string>('MAIL_USER') || this.configService.get<string>('GMAIL_USER');
  const envPass = this.configService.get<string>('MAIL_PASSWORD') || this.configService.get<string>('GMAIL_APP_PASSWORD');
  const mailConfig = {
    host: this.configService.get<string>('MAIL_HOST'),
    port: this.configService.get<number>('MAIL_PORT'),
    secure: this.configService.get<boolean>('MAIL_SECURE'),
    auth: {
      user: envUser,
      pass: envPass,
    },
  } as any;

  const wantsGmail = (!!mailService && mailService.toLowerCase() === 'gmail') || !!this.configService.get<string>('GMAIL_USER');

  if (wantsGmail) {
    if (envUser && envPass) {
      try {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: envUser, pass: envPass },
        });
        this.logger.log('Using Gmail SMTP transport');
      } catch (e) {
        this.logger.error('Failed to initialize Gmail transport. Email functionality disabled.', e);
        return;
      }
    } else {
      this.logger.error('MAIL_SERVICE=gmail set (or Gmail env detected) but GMAIL_USER/APP PASSWORD (or MAIL_USER/PASSWORD) are missing. Email disabled.');
      return;
    }
  } else if (mailConfig.host && mailConfig.auth.user && mailConfig.auth.pass) {
    this.transporter = nodemailer.createTransport(mailConfig);
  } else {
    // Fallback only when Gmail is not explicitly requested
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.warn('MAIL_* env not fully configured. Using Ethereal test SMTP account as fallback.');
    } catch (e) {
      this.logger.error('Failed to create Ethereal test account. Email functionality disabled.', e);
      return;
    }
  }

  // Skip template engine initialization unless explicitly enabled
  const templatesEnv = this.configService.get<string>('MAIL_TEMPLATES_ENABLED');
  const templatesAllowed = templatesEnv === 'true' || this.configService.get<boolean>('MAIL_TEMPLATES_ENABLED') === true;
  if (!templatesAllowed) {
    this.templatesEnabled = false;
    this.templatesViewDir = null;
    this.logger.log('Email template engine disabled by configuration; using inline templates.');
    return;
  }

  try {
    // Use native dynamic import for ESM module without TS downleveling to require()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const hbsModule = await (Function("return import('nodemailer-express-handlebars')"))();
    this.hbs = hbsModule.default || hbsModule;

    // Resolve templates directory (prefer dist, fallback to src)
    const viewDir = this.resolveTemplatesViewDir();
    const partialsDir = viewDir ? path.join(path.dirname(viewDir), 'partials') : null;

    if (viewDir && fs.existsSync(viewDir)) {
      // Create a simple adapter function that works with the ESM module
      const hbsOptions = {
        viewEngine: {
          extname: '.hbs',
          layoutsDir: viewDir,
          partialsDir: partialsDir || undefined,
          defaultLayout: false,
        },
        viewPath: viewDir,
        extName: '.hbs',
      };

      // Apply the plugin using the ESM-compatible approach
      this.transporter.use('compile', this.hbs(hbsOptions));
      this.templatesEnabled = true;
      this.templatesViewDir = viewDir;
      this.logger.log(`Email templates initialized. Using views at: ${viewDir}`);
    } else {
      this.templatesEnabled = false;
      this.templatesViewDir = null;
      this.logger.warn('Email templates directory not found. Falling back to inline templates.');
    }
  } catch (error) {
    this.logger.error('Failed to initialize email templates', error);
    // Continue without handlebars templates; inline templates will be used
    this.templatesEnabled = false;
    this.logger.warn('Email template engine disabled. Falling back to inline templates.');
  }
}

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any> = {},
  ): Promise<boolean> {
    // If transporter initialization failed, log a warning and return false
    if (!this.transporter) {
      this.logger.warn('Mail transporter not initialized. Email not sent.');
      return false;
    }

    try {
      const baseContext = {
        ...context,
        appName: this.configService.get<string>('APP_NAME', 'SACOLA'),
        appUrl: this.configService.get<string>('APP_URL', 'https://sacola.rw'),
      };

      const mailOptions: any = {
        from:
          this.configService.get<string>('MAIL_FROM') ||
          this.configService.get<string>('GMAIL_USER') ||
          this.configService.get<string>('MAIL_USER') ||
          'no-reply@sacola.local',
        to,
        subject,
      };

      const templatesAllowed = Boolean(this.configService.get<string>('MAIL_TEMPLATES_ENABLED'))
        ? this.configService.get<string>('MAIL_TEMPLATES_ENABLED') === 'true'
        : this.configService.get<boolean>('MAIL_TEMPLATES_ENABLED') === true;

      if (templatesAllowed && this.templatesEnabled && this.hasTemplateFile(template)) {
        mailOptions.template = template;
        mailOptions.context = baseContext;
      } else {
        const { html, text } = this.buildInlineTemplate(template, baseContext);
        mailOptions.html = html;
        mailOptions.text = text;
      }

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      const preview = (nodemailer as any).getTestMessageUrl?.(info);
      if (preview) {
        this.logger.log(`Preview URL: ${preview}`);
      }
      return true;
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`, error.stack);
      // Retry once using inline template fallback if templates were enabled
      if (this.templatesEnabled) {
        try {
          const baseContext = {
            ...context,
            appName: this.configService.get<string>('APP_NAME', 'SACOLA'),
            appUrl: this.configService.get<string>('APP_URL', 'https://sacola.rw'),
          };
          const { html, text } = this.buildInlineTemplate(template, baseContext);
          const retryInfo = await this.transporter.sendMail({
            from:
              this.configService.get<string>('MAIL_FROM') ||
              this.configService.get<string>('GMAIL_USER') ||
              this.configService.get<string>('MAIL_USER') ||
              'no-reply@sacola.local',
            to,
            subject,
            html,
            text,
          });
          this.logger.log(`Email sent on retry without templates: ${retryInfo.messageId}`);
          const preview = (nodemailer as any).getTestMessageUrl?.(retryInfo);
          if (preview) {
            this.logger.log(`Preview URL: ${preview}`);
          }
          return true;
        } catch (retryError) {
          this.logger.error(`Retry without templates failed: ${retryError.message}`, retryError.stack);
        }
      }
      return false;
    }
  }

  private resolveTemplatesViewDir(): string | null {
    const distViews = path.join(process.cwd(), 'dist/mail/templates/views');
    const srcViews = path.join(process.cwd(), 'src/mail/templates/views');
    if (fs.existsSync(distViews)) {
      return distViews;
    }
    if (fs.existsSync(srcViews)) {
      return srcViews;
    }
    return null;
  }

  private hasTemplateFile(templateName: string): boolean {
    const viewDir = this.templatesViewDir || this.resolveTemplatesViewDir();
    if (!viewDir) {
      return false;
    }
    const templatePath = path.join(viewDir, `${templateName}.hbs`);
    return fs.existsSync(templatePath);
  }

  private buildInlineTemplate(
    template: string,
    context: Record<string, any>,
  ): { html: string; text: string } {
    const appName = context.appName || 'SACOLA';
    const supportEmail = context.supportEmail || 'support@sacola.rw';

    switch (template) {
      case 'email-verification': {
        const name = context.name || 'there';
        const url = context.verificationUrl || context.appUrl || '';
        const expiry = context.expiryHours || 24;
        const text = `Hello ${name},\n\nPlease verify your email address by clicking the link below:\n${url}\n\nThis link expires in ${expiry} hours.\n\n— ${appName}`;
        const html = this.wrapHtml(
          appName,
          `<p>Hello ${name},</p><p>Please verify your email address by clicking the button below.</p><p><a href="${url}" style="display:inline-block;padding:10px 16px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:6px">Verify Email</a></p><p>This link expires in <strong>${expiry} hours</strong>.</p><p>— ${appName}</p>`,
        );
        return { html, text };
      }
      case 'password-reset': {
        const name = context.name || 'there';
        const url = context.resetUrl || '';
        const expiry = context.expiryHours || 1;
        const text = `Hello ${name},\n\nReset your password using the link below:\n${url}\n\nThis link expires in ${expiry} hour(s).\n\n— ${appName}`;
        const html = this.wrapHtml(
          appName,
          `<p>Hello ${name},</p><p>Reset your password using the button below.</p><p><a href="${url}" style="display:inline-block;padding:10px 16px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px">Reset Password</a></p><p>This link expires in <strong>${expiry} hour(s)</strong>.</p><p>— ${appName}</p>`,
        );
        return { html, text };
      }
      case 'welcome': {
        const name = context.name || 'there';
        const text = `Welcome ${name} to ${appName}! If you need help, contact us at ${supportEmail}.`;
        const html = this.wrapHtml(
          appName,
          `<p>Hello ${name},</p><p>Welcome to <strong>${appName}</strong>! We're glad you're here.</p><p>If you need help, contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>`,
        );
        return { html, text };
      }
      case 'otp-login':
      case 'otp-password-reset': {
        const otp = context.otp || '';
        const minutes = context.expiryMinutes || 10;
        const purpose = template === 'otp-login' ? 'login' : 'password reset';
        const text = `Your ${appName} ${purpose} OTP is: ${otp}. It expires in ${minutes} minutes.`;
        const html = this.wrapHtml(
          appName,
          `<p>Your ${appName} ${purpose} OTP is:</p><p style="font-size:24px;letter-spacing:4px;font-weight:700">${otp}</p><p>This code expires in <strong>${minutes} minutes</strong>.</p>`,
        );
        return { html, text };
      }
      default: {
        const text = `Message from ${appName}.`;
        const html = this.wrapHtml(appName, `<p>Message from ${appName}.</p>`);
        return { html, text };
      }
    }
  }

  private wrapHtml(appName: string, inner: string): string {
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${appName}</title></head><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f9fafb;padding:24px"><div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:24px"><h2 style="margin:0 0 12px 0;color:#111827">${appName}</h2>${inner}</div><p style="color:#6b7280;font-size:12px;margin-top:12px">This is an automated message. Please do not reply.</p></body></html>`;
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const verificationUrl = `${this.configService.get<string>('APP_URL')}/auth/verify-email?token=${token}`;
    
    return this.sendMail(
      email,
      'Verify Your Email Address',
      'email-verification',
      {
        name,
        verificationUrl,
        expiryHours: 24,
      },
    );
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('APP_URL')}/auth/reset-password?token=${token}`;
    
    return this.sendMail(
      email,
      'Reset Your Password',
      'password-reset',
      {
        name,
        resetUrl,
        expiryHours: 1,
      },
    );
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendMail(
      email,
      'Welcome to SACOLA',
      'welcome',
      {
        name,
        supportEmail: this.configService.get<string>('MAIL_SUPPORT', 'support@sacola.rw'),
      },
    );
  }

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    return this.sendMail(
      email,
      'Your Login OTP',
      'otp-login',
      {
        otp,
        expiryMinutes: 10,
        supportEmail: this.configService.get<string>('MAIL_SUPPORT', 'support@sacola.rw'),
      },
    );
  }

  async sendPasswordResetOtpEmail(email: string, otp: string): Promise<boolean> {
    return this.sendMail(
      email,
      'Password Reset OTP',
      'otp-password-reset',
      {
        otp,
        expiryMinutes: 15,
        supportEmail: this.configService.get<string>('MAIL_SUPPORT', 'support@sacola.rw'),
      },
    );
  }
}
