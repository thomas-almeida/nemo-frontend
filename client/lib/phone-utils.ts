/**
 * Formats a phone number to the E.164 standard (e.g., +5511999999999)
 * @param phoneNumber - The phone number to format (can include spaces, dashes, etc.)
 * @returns Formatted phone number in E.164 format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // If the number starts with 0, remove it (assuming local format)
  const numberWithoutZero = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
  
  // If the number starts with 55 (Brazil country code), add the +
  if (numberWithoutZero.startsWith('55')) {
    return `+${numberWithoutZero}`;
  }
  
  // If the number is 11 digits long (Brazilian mobile number without country code)
  if (numberWithoutZero.length === 11) {
    return `55${numberWithoutZero}`;
  }
  
  // Default: assume the number is already in international format but missing the +
  return `+${numberWithoutZero}`;
}
