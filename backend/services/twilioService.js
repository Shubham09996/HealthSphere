import twilio from 'twilio';
import config from '../config/config.js';
import { formatPhoneNumber } from '../utils/phoneFormatter.js';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

/**
 * Send SMS via Twilio
 * @param {string} to - Phone number (will be formatted automatically)
 * @param {string} message - Message to send
 * @param {boolean} throwOnError - Whether to throw error or just log (default: false)
 * @returns {Promise<object|null>} - Twilio result or null if failed
 */
const sendSms = async (to, message, throwOnError = false) => {
  if (!to || !message) {
    console.warn('SMS not sent: Missing phone number or message');
    return null;
  }

  // Format phone number to E.164 format
  const formattedNumber = formatPhoneNumber(to);
  
  if (!formattedNumber) {
    const errorMsg = `Invalid phone number format: ${to}. SMS not sent.`;
    console.error(errorMsg);
    if (throwOnError) {
      throw new Error(errorMsg);
    }
    return null;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to: formattedNumber,
    });
    console.log(`SMS sent successfully to ${formattedNumber}: ${result.sid}`);
    return result;
  } catch (error) {
    const errorMsg = `Error sending SMS to ${formattedNumber} (original: ${to}): ${error.message}`;
    console.error(errorMsg);
    
    // Log Twilio error details for debugging
    if (error.code) {
      console.error(`Twilio Error Code: ${error.code} - ${error.moreInfo || ''}`);
    }
    
    if (throwOnError) {
      throw error;
    }
    
    // Return null instead of throwing to prevent app crashes
    return null;
  }
};

/**
 * Make a call via Twilio
 * @param {string} to - Phone number (will be formatted automatically)
 * @param {string} twimlUrl - TwiML URL for call instructions
 * @param {boolean} throwOnError - Whether to throw error or just log (default: false)
 * @returns {Promise<object|null>} - Twilio result or null if failed
 */
const makeCall = async (to, twimlUrl, throwOnError = false) => {
  if (!to || !twimlUrl) {
    console.warn('Call not initiated: Missing phone number or TwiML URL');
    return null;
  }

  // Format phone number to E.164 format
  const formattedNumber = formatPhoneNumber(to);
  
  if (!formattedNumber) {
    const errorMsg = `Invalid phone number format: ${to}. Call not initiated.`;
    console.error(errorMsg);
    if (throwOnError) {
      throw new Error(errorMsg);
    }
    return null;
  }

  try {
    const result = await client.calls.create({
      url: twimlUrl,
      to: formattedNumber,
      from: config.twilio.phoneNumber,
    });
    console.log(`Call initiated successfully to ${formattedNumber}: ${result.sid}`);
    return result;
  } catch (error) {
    const errorMsg = `Error initiating call to ${formattedNumber} (original: ${to}): ${error.message}`;
    console.error(errorMsg);
    
    // Log Twilio error details for debugging
    if (error.code) {
      console.error(`Twilio Error Code: ${error.code} - ${error.moreInfo || ''}`);
    }
    
    if (throwOnError) {
      throw error;
    }
    
    // Return null instead of throwing to prevent app crashes
    return null;
  }
};

export { sendSms, makeCall };
