import { apiRequest } from '@/lib/api-client';
import type { Appointment, BookingInput, AppointmentChange } from './types';

export const getMyAppointments = () => apiRequest<Appointment[]>('/appointments/mine');
export const bookAppointment = (input: BookingInput) => apiRequest<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(input) });
export const updateAppointment = (id: number, input: AppointmentChange) => apiRequest<Appointment>(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(input) });

// Email remains an optional Next.js integration. Booking success is determined
// by the Go API; an email delivery failure must never create a duplicate booking.
export async function sendBookingEmail(appointment: Appointment): Promise<void> {
  await fetch('/api/appointments/confirm-email', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ petName: appointment.petName, service: appointment.service, date: appointment.date, time: appointment.time }),
  });
}
