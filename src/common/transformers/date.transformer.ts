import { Transform } from 'class-transformer';

/**
 * Parse incoming value into a Date or null, throwing for invalid inputs
 */
function parseDateValue(value: unknown): Date | null | undefined {
  // If value is already a Date object, return it
  if (value instanceof Date) {
    return value;
  }

  // If value is null or undefined, return it (for optional fields)
  if (value === null || value === undefined) {
    return value as null | undefined;
  }

  // If value is a string, try to parse it
  if (typeof value === 'string') {
    // Handle empty string as null
    if (value.trim() === '') {
      return null;
    }

    // Try to parse the date string
    const date = new Date(value);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${value}. Please use YYYY-MM-DD or ISO format.`);
    }

    return date;
  }

  // If value is a number (timestamp), convert to Date
  if (typeof value === 'number') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid timestamp: ${value}`);
    }
    return date;
  }

  throw new Error(`Cannot convert ${typeof value} to Date. Expected string (YYYY-MM-DD/ISO), number (timestamp), Date, null or undefined.`);
}

/**
 * Custom transformer for date fields that handles various input formats
 * and converts them to proper Date objects for the database
 */
export function TransformDate() {
  return Transform(({ value }) => parseDateValue(value));
}

/**
 * Transformer for date fields that should not be in the future
 */
export function TransformDateNotFuture() {
  return Transform(({ value }) => {
    const date = parseDateValue(value);

    if (date instanceof Date) {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      if (date > today) {
        throw new Error('Date cannot be in the future.');
      }
    }

    return date as Date | null | undefined;
  });
}

/**
 * Transformer for date fields that should be in the past
 */
export function TransformDatePast() {
  return Transform(({ value }) => {
    const date = parseDateValue(value);

    if (date instanceof Date) {
      const now = new Date();

      if (date >= now) {
        throw new Error('Date must be in the past.');
      }
    }

    return date as Date | null | undefined;
  });
}

/**
 * Transformer for date fields that should be in the future
 */
export function TransformDateFuture() {
  return Transform(({ value }) => {
    const date = parseDateValue(value);

    if (date instanceof Date) {
      const now = new Date();

      if (date <= now) {
        throw new Error('Date must be in the future.');
      }
    }

    return date as Date | null | undefined;
  });
}
