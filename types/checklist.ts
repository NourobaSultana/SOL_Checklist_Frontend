export interface ChecklistAnswer {
  question: string;
  answer: "Yes" | "No";
}

export interface CreateChecklistDto {
  answers: ChecklistAnswer[];
}

export interface Checklist {
  _id: string;

  user: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "sub_admin" | "user";
  };

  checklistDate: string;

  answers: ChecklistAnswer[];

  createdAt: string;
}
