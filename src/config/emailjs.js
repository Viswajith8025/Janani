// EmailJS Configuration
// =====================
/**
 * To set up EmailJS:
 * 1. Create a free account: https://www.emailjs.com/
 * 2. Add an Email Service (e.g., Gmail) and copy the SERVICE_ID.
 * 3. Create two templates:
 *    - 'contact_form': For general inquiries.
 *    - 'booking_form': For retreat reservations.
 * 4. Copy your PUBLIC_KEY from Account -> API Keys.
 */

export const EMAILJS_CONFIG = {
  publicKey: 'REPLACE_WITH_YOUR_EMAILJS_PUBLIC_KEY', // e.g., 'user_xxxxxxxxxxxx'
  serviceId: 'REPLACE_WITH_YOUR_EMAILJS_SERVICE_ID', // e.g., 'service_xxxxxxx'
  contactTemplateId: 'contact_form',
  bookingTemplateId: 'booking_form',
};
