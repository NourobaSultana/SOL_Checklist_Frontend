import api from "./api";
import { Appointment, CreateAppointmentDto } from "@/types/appointment";

export async function createAppointment(
  data: CreateAppointmentDto,
): Promise<Appointment> {
  const response = await api.post<Appointment>("/appointment", data);

  return response.data;
}

export async function getMyAppointmentHistory(): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>("/appointment/my-history");

  return response.data;
}
