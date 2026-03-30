
/**
 * Email Service
 * Handles sending booking confirmations to the owner and customer
 */

import { BookingDetails } from '@/types';

export async function sendBookingEmailToOwner(details: BookingDetails, distance: number | null): Promise<boolean> {
  console.log('Sending booking email to owner:', details, 'Distance:', distance);
  
  // In einer echten App würde hier ein API-Call an einen Backend-Service erfolgen
  // (z.B. SendGrid, Mailjet, oder ein eigener Express-Server mit Nodemailer)
  
  try {
    // Simulierter API-Call
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  } catch (error) {
    console.error('Error sending owner email:', error);
    return false;
  }
}

export async function sendBookingEmailToCustomer(details: BookingDetails): Promise<boolean> {
  console.log('Sending booking confirmation to customer:', details.email);
  
  try {
    // Simulierter API-Call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error sending customer email:', error);
    return false;
  }
}

export async function sendContactEmail(data: { name: string, email: string, subject: string, message: string }): Promise<boolean> {
  console.log('Sending contact form email:', data);
  
  try {
    // Simulierter API-Call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}
