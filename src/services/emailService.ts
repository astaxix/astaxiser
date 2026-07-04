
/**
 * Email Service
 * Handles sending booking confirmations to the owner and customer
 */

import { BookingDetails } from '@/types';

export async function sendBookingEmailToOwner(details: BookingDetails, distance: number | null): Promise<boolean> {
  console.log('Sending booking email to owner:', details, 'Distance:', distance);
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'booking-owner',
        details,
        distance
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending owner email:', error);
    return false;
  }
}

export async function sendBookingEmailToCustomer(details: BookingDetails): Promise<boolean> {
  console.log('Sending booking confirmation to customer:', details.email);
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'booking-customer',
        details
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending customer email:', error);
    return false;
  }
}

export async function sendContactEmail(data: { name: string, email: string, subject: string, message: string }): Promise<boolean> {
  console.log('Sending contact form email:', data);
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'contact',
        data
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}
