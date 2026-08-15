export interface Appointment {
  _id: string;
  user: string;
  appointment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentDto {
  appointment: string;
}
