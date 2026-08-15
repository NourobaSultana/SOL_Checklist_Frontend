export interface DailyExpanse {
  _id: string;
  user: string;
  DailyExpanse: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDailyExpanseDto {
  DailyExpanse: string;
}
