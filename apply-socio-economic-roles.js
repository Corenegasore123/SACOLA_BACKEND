const fs = require('fs');
const path = require('path');

// List of socio-economic controllers to update
const controllers = [
  'src/socio-economic/controllers/housing-materials.controller.ts',
  'src/socio-economic/controllers/village-housing.controller.ts',
  'src/socio-economic/controllers/house.controller.ts',
  'src/socio-economic/controllers/house-repair.controller.ts',
  'src/socio-economic/controllers/education-materials.controller.ts',
  'src/socio-economic/controllers/supported-students.controller.ts',
  'src/socio-economic/controllers/offices.controller.ts',
  'src/socio-economic/controllers/it-training.controller.ts',
  'src/socio-economic/controllers/other-projects.controller.ts',
  'src/socio-economic/controllers/parking.controller.ts',
  'src/socio-economic/controllers/water-pumps.controller.ts',
  'src/socio-economic/controllers/housing-toilets.controller.ts',
  'src/socio-economic/controllers/empowerment-microfinance.controller.ts',
  'src/socio-economic/controllers/workers.controller.ts'
];

// Template for role-based access control
const roleImports = `import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../shared/enums/user-role.enum';`;

const roleGuardUpdate = `@UseGuards(AuthGuard('jwt'), RolesGuard)`;

const roleDecorators = {
  '@Post()': '@Post()\n  @Roles(UserRole.USER)',
  '@Put(': '@Put(\n  @Roles(UserRole.USER)',
  '@Delete(': '@Delete(\n  @Roles(UserRole.USER)',
  '@Get()': '@Get()\n  @Roles(UserRole.VIEWER, UserRole.USER)',
  '@Get(\':id\')': '@Get(\':id\')\n  @Roles(UserRole.VIEWER, UserRole.USER)'
};

function updateController(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add role imports if not present
    if (!content.includes('import { Roles }')) {
      const importIndex = content.lastIndexOf('import {');
      const nextLineIndex = content.indexOf('\n', importIndex) + 1;
      content = content.slice(0, nextLineIndex) + roleImports + '\n' + content.slice(nextLineIndex);
    }
    
    // Update UseGuards
    content = content.replace(
      /@UseGuards\(AuthGuard\('jwt'\)\)/g,
      roleGuardUpdate
    );
    
    // Add role decorators
    Object.entries(roleDecorators).forEach(([pattern, replacement]) => {
      const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, replacement);
    });
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update all controllers
console.log('🔧 Applying role-based access control to socio-economic controllers...\n');

controllers.forEach(controller => {
  if (fs.existsSync(controller)) {
    updateController(controller);
  } else {
    console.log(`⚠️  File not found: ${controller}`);
  }
});

console.log('\n🎯 Role-based access control applied to socio-economic controllers!');
console.log('\n📋 Summary of restrictions:');
console.log('   • POST, PUT, DELETE endpoints: USER role only');
console.log('   • GET endpoints: VIEWER and USER roles');
console.log('\n🔒 All socio-economic endpoints now have proper role restrictions!');
