import api from "./api";
import { DailyExpanse, CreateDailyExpanseDto } from "@/types/dailyexpanse";

export async function createDailyExpanse(
  data: CreateDailyExpanseDto,
): Promise<DailyExpanse> {
  const response = await api.post<DailyExpanse>("/dailyexpanse", data);

  return response.data;
}

export async function getMyDailyExpanseHistory(): Promise<DailyExpanse[]> {
  const response = await api.get<DailyExpanse[]>("/dailyexpanse/my-history");

  return response.data;
}
