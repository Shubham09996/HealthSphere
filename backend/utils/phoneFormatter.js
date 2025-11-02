/**
 * Format phone number to E.164 format required by Twilio
 * E.164 format: +[country code][number] (no spaces, dashes, or other characters)
 * 
 * @param {string} phoneNumber - Phone number to format
 * @param {string} defaultCountryCode - Default country code (default: '91' for India)
 * @returns {string|null} - Formatted phone number in E.164 format or null if invalid
 */
export const formatPhoneNumber = (phoneNumber, defaultCountryCode = '91') => {
  if (!phoneNumber) {
    return null;
  }

  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, '');

  // If number already starts with country code, use it
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    // Already has country code
    return `+${cleaned}`;
  } else if (cleaned.length === 10) {
    // Indian mobile number (10 digits) - add country code
    return `+${defaultCountryCode}${cleaned}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    // Number with country code already included (12 digits starting with 91)
    return `+${cleaned}`;
  } else if (cleaned.length > 10 && cleaned.length <= 15) {
    // Assume it's already in international format, just add +
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    return cleaned;
  }

  // Invalid phone number format
  console.warn(`Invalid phone number format: ${phoneNumber} (cleaned: ${cleaned})`);
  return null;
};

/**
 * Validate if a phone number is in a valid format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return false;
  }
  
  const formatted = formatPhoneNumber(phoneNumber);
  return formatted !== null && formatted.length >= 10 && formatted.length <= 16;
};

