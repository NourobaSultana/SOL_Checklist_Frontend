"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Question } from "@/types/question";
import { ChecklistAnswer } from "@/types/checklist";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { submitChecklist } from "@/services/checklist";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import jsPDF from "jspdf";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/question";
import { FiCheck, FiDownload, FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ChecklistPage() {
  const { dictionary, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [loading, setLoading] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [question, setQuestion] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);

  const [newQuestion, setNewQuestion] = useState("");

  const [editingId, setEditingId] = useState("");

  const [editingText, setEditingText] = useState("");

  async function handleAddQuestion() {
    if (!newQuestion.trim()) return;

    await createQuestion(newQuestion);

    setNewQuestion("");

    loadQuestions();

    toast.success("Question added");
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Delete Question?",
      text: "Are you sure you want to delete this question?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      // Same ID — nothing changed
      await deleteQuestion(id);

      // Same existing function
      loadQuestions();

      await Swal.fire({
        title: "Deleted!",
        text: "Question deleted successfully.",
        icon: "success",
        confirmButtonColor: "#ACC822",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        title: "Failed!",
        text: "Failed to delete question.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  }

  async function handleUpdate() {
    await updateQuestion(editingId, editingText);

    setEditingId("");

    setEditingText("");

    loadQuestions();

    toast.success("Question updated");
  }

  const [DailyExpanse, setDailyExpanse] = useState("");

 const [answers, setAnswers] = useState<ChecklistAnswer[]>([]);

  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    setQuestion(question.question);
  };

  const [lockedAnswers, setLockedAnswers] = useState<boolean[]>(
    questions.map(() => false),
  );

  const completedCount = answers.filter((i) => i.answer === "Yes").length;
  const totalCount = answers.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const changeAnswer = (index: number, answer: "Yes" | "No") => {
    if (lockedAnswers[index]) {
      return;
    }

    toast.custom(
      (t) => (
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-5 shadow-xl">
          <div>
            <h3 className="font-semibold text-slate-800">Are you sure?</h3>

            <p className="mt-1 text-sm text-slate-500">
              You selected <b>{answer}</b>. You cannot change this answer later.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            {/* Cancel */}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              No
            </button>

            {/* Confirm */}
            <button
              onClick={() => {
                // Change answer
                setAnswers((prev) => {
                  const updated = [...prev];

                  updated[index] = {
                    ...updated[index],
                    answer: answer,
                  };

                  return updated;
                });

                // LOCK THIS QUESTION
                setLockedAnswers((prev) => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });

                toast.dismiss(t.id);

                toast.success(`${answer} selected and locked.`);
              }}
              className="rounded-xl bg-[#ACC822] px-4 py-2 text-sm font-semibold text-white"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const marginX = 14;
    let y = 18;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Onboarding Checklist", marginX, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    y += 7;
    doc.text(
      `Completed: ${completedCount}/${totalCount} (${progress}%)`,
      marginX,
      y,
    );

    y += 5;
    doc.text(`Generated: ${new Date().toLocaleString()}`, marginX, y);

    y += 10;
    doc.setDrawColor(200);
    doc.line(marginX, y, 196, y);

    y += 8;

    doc.setFontSize(11);

    answers.forEach((item, index) => {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }

      doc.text(`${index + 1}.`, marginX, y);
      doc.text(item.question, marginX + 8, y);
      doc.text(item.answer, 180, y);

      y += 8;
    });

    doc.save("onboarding-checklist.pdf");
  };

  async function handleSaveQuestion() {
    try {
      if (!question.trim()) return;

      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, question);

        toast.success("Question updated successfully.");
      } else {
        await createQuestion(question);

        toast.success("Question added successfully.");
      }

      setQuestion("");
      setEditingQuestion(null);

      loadQuestions();
    } catch (error) {
      toast.error("Operation failed.");
    }
  }

  const handleSubmit = async () => {
    const unanswered = answers.some((item) => !item.answer);

    if (unanswered) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    try {
      setLoading(false);

      await submitChecklist({
       answers,
      });

      toast.success("Checklist submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit checklist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    const data = await getQuestions();

    // Save questions for admin
    setQuestions(data);

    // Create answers for users
    setAnswers(
    data.map((item): ChecklistAnswer => ({
      question: item.question,
      answer: "No",
    })),
);
  }

  return (
    <div className="rounded-3xl  p-5 sm:p-6">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-lime-50 p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Icon */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#ACC822]/15 shadow-sm sm:h-14 sm:w-14">
              <HiOutlineClipboardDocumentCheck
                className="text-[#ACC822]"
                size={26}
              />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">
                {dictionary.checklist.title}
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {completedCount} {dictionary.checklist.middleText} {totalCount}{" "}
                {dictionary.checklist.tasksCompleted}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center xl:w-auto">
            {/* Progress */}
            <div className="flex w-full items-center gap-3 lg:w-[400px]">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ACC822] via-lime-500 to-green-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="w-12 text-right text-sm font-bold text-slate-700">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-slate-800 sm:text-2xl">
                {dictionary.checklist.manageQuestion}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {dictionary.checklist.manageQuestionsDescription}
              </p>
            </div>

            <div className="w-fit rounded-xl bg-[#ACC822]/10 px-4 py-2 text-sm font-semibold text-[#ACC822]">
              {dictionary.checklist.total}: {questions.length}
            </div>
          </div>

          {/* Add Question */}
          <div className="mb-8 flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={dictionary.checklist.questionPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[#ACC822] focus:bg-white focus:ring-4 focus:ring-[#ACC822]/20"
            />

            <button
              onClick={handleSaveQuestion}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ACC822] px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96B51D] hover:shadow-lg md:w-auto"
            >
              <FiPlus size={18} />

              {editingQuestion
                ? dictionary.checklist.updateQuestion
                : dictionary.checklist.addQuestion}
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {questions.map((item, index) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-[#ACC822]/30 hover:bg-white hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Number */}
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#ACC822]/15 font-bold  text-[#ACC822]">
                      {index + 1}
                    </div>

                    {/* Question */}
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium leading-7 text-slate-700 sm:text-base">
                        {item.question}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-500 hover:text-white sm:flex-none"
                    >
                      <FiEdit size={16} />
                      {dictionary.checklist.edit}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-500 hover:text-white sm:flex-none"
                    >
                      <FiTrash2 size={16} />
                      {dictionary.checklist.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {questions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                📋
              </div>

              <h4 className="text-lg font-semibold text-slate-700">
                {dictionary.checklist.noQuestionsFound}
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                {dictionary.checklist.addFirstQuestion}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {answers.map((item, index) => (
          <div
            key={index}
            className={`group rounded-3xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5 lg:p-6 ${
              item.answer === "Yes"
                ? "border-[#ACC822]/30 bg-[#ACC822]/5"
                : item.answer === "No"
                  ? "border-red-200 bg-red-50/40"
                  : "border-slate-200 bg-white hover:border-[#ACC822]/30"
            }`}
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              {/* Left */}
              <div className="flex min-w-0 items-start gap-4">
                {/* Status Icon */}
                {/* number */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white sm:h-11 sm:w-11">
                  <span className="text-base font-semibold text-slate-700 ">
                    {index + 1}
                  </span>
                </div>

                {/* Question */}
                <div className="min-w-0 flex-1">
                  <h3
                    className={`break-words mt-2 text-sm font-semibold leading-6 text-slate-800 sm:text-base lg:text-lg ${
                      item.answer === "Yes" ? "line-through" : ""
                    }`}
                  >
                    {item.question}
                  </h3>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                {/* YES */}
                <button
                  disabled={lockedAnswers[index]}
                  onClick={() => changeAnswer(index, "Yes")}
                  className={`flex h-11 flex-1 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all duration-300 sm:h-12 sm:flex-none ${
                    item.answer === "Yes"
                      ? "bg-[#ACC822] text-white shadow-lg"
                      : lockedAnswers[index]
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : "border border-slate-300 bg-white text-slate-600 hover:border-[#ACC822] hover:bg-[#ACC822]/10 hover:text-[#ACC822]"
                  }`}
                >
                  {dictionary.checklist.yes}
                </button>

                {/* NO */}
                <button
                  disabled={lockedAnswers[index]}
                  onClick={() => changeAnswer(index, "No")}
                  className={`flex h-11 flex-1 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all duration-300 sm:h-12 sm:flex-none ${
                    item.answer === "No"
                      ? "bg-red-500 text-white shadow-lg"
                      : lockedAnswers[index]
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : "border border-slate-300 bg-white text-slate-600 hover:border-red-400 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  {dictionary.checklist.no}
                </button>
              </div>
            </div>
          </div>
        ))}

        {answers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-lime-50 px-5 py-10 text-center shadow-sm sm:rounded-3xl sm:px-8 sm:py-14">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#ACC822]/10 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
              <FiCheck className="h-6 w-6 text-[#ACC822] sm:h-7 sm:w-7 lg:h-9 lg:w-9" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">
              🎉 {dictionary.checklist.allTasksCompleted}
            </h3>

            {/* Description */}
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              {dictionary.checklist.completedDescription}
            </p>

            {/* Optional Badge */}
            <div className="mt-6 inline-flex items-center rounded-full bg-[#ACC822]/10 px-4 py-2 text-sm font-semibold text-[#7E9E18]">
              ✔ 100% {dictionary.checklist.completed}
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-lime-50 p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:rounded-3xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">
                {dictionary.checklist.readyToSubmit}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                {dictionary.checklist.submitDescription}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-[#ACC822] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96B51D] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:py-4 sm:text-base lg:w-auto lg:min-w-[220px]"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  {dictionary.checklist.submitting}
                </>
              ) : (
                dictionary.checklist.submitChecklist
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
