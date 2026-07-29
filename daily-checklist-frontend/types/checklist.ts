export interface ChecklistAnswer {
  question: string;
  answer: 'Yes' | 'No';
}

export interface CreateChecklistDto {
  answers: ChecklistAnswer[];
  appointment: string;
  DailyExpanse: string;
}

export interface Checklist {
  _id: string;

  user: {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'sub_admin' | 'user';
  };

  checklistDate: string;

  answers: ChecklistAnswer[];

  appointment: string;

  DailyExpanse: string;

  createdAt: string;

  updatedAt: string;
}