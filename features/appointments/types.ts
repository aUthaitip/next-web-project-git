export interface Appointment {
  id: number;
  petName: string;
  petType: string;
  service: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  doctorName?: string;
  owner: string;
  phone: string;
}
export type BookingInput = Pick<Appointment, 'owner' | 'phone' | 'petName' | 'petType' | 'service' | 'date' | 'time' | 'notes'>;
export type AppointmentChange = Partial<Pick<Appointment, 'status' | 'date' | 'time' | 'petName' | 'petType' | 'service' | 'notes'>>;
