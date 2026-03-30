
/**
 * Booking Service
 * Handles route calculations, pricing, availability checks, and Firestore persistence
 */

import { BookingDetails } from '@/types';
import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

// Konstanten für Preisberechnung (Beispielwerte basierend auf Tarif)
const BASE_PRICE = 3.70;
const PRICE_PER_KM = 2.50;
const LARGE_VEHICLE_SURCHARGE = 10.00; // Zuschlag für Großraumbus (ab 5 Personen)
const TRAILER_SURCHARGE = 15.00; // Zuschlag für Anhänger

/**
 * Berechnet die Route zwischen zwei Punkten (OSRM API)
 */
export async function calculateRoute(coords: { lat: number, lon: number }[]): Promise<{ distanceKm: number, durationMin: number }> {
  if (coords.length < 2) return { distanceKm: 0, durationMin: 0 };

  try {
    const coordString = coords.map(c => `${c.lon},${c.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=false`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code !== 'Ok') throw new Error('OSRM route calculation failed');
    
    const distance = data.routes[0].distance / 1000; // Meter in Kilometer
    const duration = data.routes[0].duration / 60; // Sekunden in Minuten
    
    return {
      distanceKm: distance,
      durationMin: Math.ceil(duration)
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    // Fallback: Luftlinie * 1.3 (grobe Schätzung)
    const dist = calculateHaversineDistance(coords[0].lat, coords[0].lon, coords[1].lat, coords[1].lon) * 1.3;
    return {
      distanceKm: dist,
      durationMin: Math.ceil(dist * 2) // Annahme: 30 km/h Durchschnitt
    };
  }
}

/**
 * Berechnet die volle Fahrtmetrik (Home -> Pickup -> Destination -> Home)
 * Home ist hier als Bingen (Zentrale) angenommen
 */
export async function calculateFullTripMetrics(pickup: { lat: number, lon: number }, destination: { lat: number, lon: number }): Promise<{ arrivalDistanceKm: number, rideDistanceKm: number, durationMin: number }> {
  // Zentrale Koordinaten (Bingen am Rhein)
  const home = { lat: 49.967, lon: 7.898 };
  
  // 1. Anfahrt (Home -> Pickup)
  const arrival = await calculateRoute([home, pickup]);
  
  // 2. Fahrt (Pickup -> Destination)
  const ride = await calculateRoute([pickup, destination]);
  
  return {
    arrivalDistanceKm: arrival.distanceKm,
    rideDistanceKm: ride.distanceKm,
    durationMin: arrival.durationMin + ride.durationMin
  };
}

/**
 * Berechnet den Preis basierend auf Distanz und Fahrzeugtyp
 */
export function calculatePrice(rideKm: number, arrivalKm: number, isLargeGroup: boolean) {
  let total = BASE_PRICE + (rideKm * PRICE_PER_KM);
  
  // Anfahrtspauschale (wenn außerhalb von Bingen)
  if (arrivalKm > 5) {
    total += (arrivalKm - 5) * 1.00; // Beispiel: 1€ pro km Anfahrt über 5km
  }
  
  if (isLargeGroup) {
    total += LARGE_VEHICLE_SURCHARGE;
  }
  
  return {
    total: Math.max(total, 10.00), // Mindestpreis 10€
    breakdown: {
      base: BASE_PRICE,
      distance: rideKm * PRICE_PER_KM,
      surcharge: isLargeGroup ? LARGE_VEHICLE_SURCHARGE : 0
    }
  };
}

/**
 * Prüft die Verfügbarkeit von Fahrzeugen für ein Zeitfenster
 */
export async function checkAvailability(date: string, start: Date, end: Date, isLargeGroup: boolean, hasTrailer: boolean): Promise<any[]> {
  try {
    // In einer echten App würden wir hier die 'bookings' Kollektion in Firestore abfragen
    // und prüfen, ob Fahrzeuge im Zeitfenster [start, end] frei sind.
    
    // Simulierter Check:
    // Wir haben 5 normale Taxis und 2 Großraumbusse
    const totalTaxis = 5;
    const totalBuses = 2;
    
    const bookingsRef = collection(db, 'bookings');
    // Wir fragen alle Buchungen für den Tag ab
    const q = query(bookingsRef, where('date', '==', date));
    const snapshot = await getDocs(q);
    
    const existingBookings = snapshot.docs.map(doc => doc.data());
    
    // Zähle belegte Fahrzeuge im Zeitfenster
    let occupiedTaxis = 0;
    let occupiedBuses = 0;
    
    existingBookings.forEach((b: any) => {
      const bStart = b.startTime.toDate();
      const bEnd = b.endTime.toDate();
      
      // Überlappungsprüfung
      if (start < bEnd && end > bStart) {
        if (b.vehicleType === 'bus' || b.passengers >= 5) {
          occupiedBuses++;
        } else {
          occupiedTaxis++;
        }
      }
    });
    
    const available: any[] = [];
    
    if (isLargeGroup) {
      if (occupiedBuses < totalBuses) {
        available.push({ id: `bus-${occupiedBuses + 1}`, type: 'bus' });
      }
    } else {
      if (occupiedTaxis < totalTaxis) {
        available.push({ id: `taxi-${occupiedTaxis + 1}`, type: 'standard' });
      } else if (occupiedBuses < totalBuses) {
        // Wenn kein Taxi frei, aber ein Bus
        available.push({ id: `bus-${occupiedBuses + 1}`, type: 'bus' });
      }
    }
    
    return available;
  } catch (error) {
    console.error('Error checking availability:', error);
    // Fallback: Immer verfügbar im Demo-Modus
    return [{ id: 'demo-taxi-1', type: 'standard' }];
  }
}

/**
 * Speichert eine Buchung in Firestore
 */
export async function saveBooking(
  details: BookingDetails, 
  pickupCoords: { lat: number, lon: number }, 
  destCoords: { lat: number, lon: number },
  distanceKm: number,
  durationMin: number,
  vehicleId: string,
  startTime: Date,
  endTime: Date
) {
  try {
    const bookingData = {
      ...details,
      pickupCoords,
      destCoords,
      distanceKm,
      durationMin,
      vehicleId,
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
      status: 'confirmed',
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
}

/**
 * Storniert eine Buchung
 */
export async function cancelBooking(id: string, reason: string): Promise<boolean> {
  try {
    const bookingRef = doc(db, 'bookings', id);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: serverTimestamp()
    });
    
    // In einer echten App würde hier auch eine E-Mail an den Kunden gesendet werden
    console.log(`Booking ${id} cancelled. Reason: ${reason}`);
    
    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
}

/**
 * Hilfsfunktion: Haversine Distanz (Luftlinie)
 */
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Erdradius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
