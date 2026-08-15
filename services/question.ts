import api from "./api";
import { Question } from "@/types/question";

export async function getQuestions(): Promise<Question[]> {
  const { data } = await api.get("/questions");
  return data;
}

export async function createQuestion(question: string) {
  const { data } = await api.post("/questions", {
    question,
  });

  return data;
}

export async function updateQuestion(
  id: string,
  question: string,
) {
  const { data } = await api.patch(
    `/questions/${id}`,
    {
      question,
    },
  );

  return data;
}

export async function deleteQuestion(id: string) {
  const { data } = await api.delete(
    `/questions/${id}`,
  );

  return data;
}