'use client';

import { useState , useEffect} from 'react';
import toast from 'react-hot-toast';
import { Question } from '@/types/question';
import { ChecklistAnswer } from '@/types/checklist';
import Button from '@/components/ui/Button';
import { useAuth } from "@/context/AuthContext";
import { submitChecklist } from '@/services/checklist';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import jsPDF from "jspdf";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/question";
import { FiCheck,FiDownload,  FiTrash2,FiEdit,FiPlus} from 'react-icons/fi';

export default function ChecklistPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [loading, setLoading] = useState(false);
  
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [question, setQuestion] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  

  const [newQuestion, setNewQuestion] =
  useState("");

  const [editingId, setEditingId] =
    useState("");

  const [editingText, setEditingText] =
    useState("");

  


    async function handleAddQuestion() {
  if (!newQuestion.trim()) return;

  await createQuestion(newQuestion);

  setNewQuestion("");

  loadQuestions();

  toast.success("Question added");
}


async function handleDelete(id: string) {
  await deleteQuestion(id);

  loadQuestions();

  toast.success("Question deleted");
}



async function handleUpdate() {
  await updateQuestion(
    editingId,
    editingText,
  );

  setEditingId("");

  setEditingText("");

  loadQuestions();

  toast.success("Question updated");
}

  const [appointment, setAppointment] =
    useState('');

  const [DailyExpanse, setDailyExpanse] = useState('');


  const [answers, setAnswers] =
  useState<ChecklistAnswer[]>([]);

  const handleEdit = (question: any) => {
  setEditingQuestion(question);
  setQuestion(question.question);
};

    const completedCount = answers.filter((i) => i.answer === 'Yes').length;
    const totalCount = answers.length;
    const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  function changeAnswer(
    index: number,
    value: 'Yes' | 'No',
  ) {
    const updated = [...answers];

    updated[index].answer = value;

    setAnswers(updated);
  }

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
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      marginX,
      y
    );

    y += 10;
    doc.setDrawColor(200);
    doc.line(marginX, y, 196, y);
    y += 8;

    doc.setFontSize(11);
    answers.forEach((answer, index) => {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }
      answers.forEach((item, index) => {
      const status = item.answer;

      doc.text(`${index + 1}.`, marginX, y);
      doc.text(item.question, marginX + 8, y);
      doc.text(status, 180, y);

      y += 8;
    });

    doc.save("onboarding-checklist.pdf");

  });}



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

  async function handleSubmit() {
    try {
      setLoading(true);

      await submitChecklist({
        answers,
        appointment,
        DailyExpanse,
      });

      toast.success(
        'Checklist submitted successfully.'
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          'Submission failed.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  loadQuestions();
  }, []);


async function loadQuestions() {
  const data = await getQuestions();

  // Save questions for admin
  setQuestions(data);

  // Create answers for users
  setAnswers(
    data.map((item) => ({
      question: item.question,
      answer: "No",
    }))
  );
}


  return (
    <div className="rounded-3xl border p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ACC822]/15">
          <HiOutlineClipboardDocumentCheck
            size={22}
            className="text-[#ACC822]"
          />
        </div>

        <div>
          <h2 className="text-[18px] font-semibold">
            Onboarding Checklist
          </h2>

          <p className="text-[13px] text-gray-500">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-32 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#ACC822] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[13px] font-semibold">
          {progress}%
        </span>

        <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 rounded-xl bg-[#ACC822] px-3 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#96b31d]"
              >
                <FiDownload size={15} />
                PDF
              </button>
      </div>
    </div>


    {isAdmin && (
  <div className="mb-6 rounded-xl border bg-white p-4">
    <h3 className="mb-4 text-lg font-semibold">
      Manage Questions
    </h3>

    <div className="flex gap-3">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter question..."
        className="flex-1 rounded-lg border px-4 py-2"
      />

      <button
        onClick={handleSaveQuestion}
        className="flex items-center gap-2 rounded-lg bg-[#ACC822] px-4 py-2 text-white hover:bg-[#96B51D]"
      >
        <FiPlus size={16} />
        {editingQuestion ? "Update" : "Add"}
      </button>
    </div>

    <div className="mt-4 space-y-2">
    {questions.map((item) => (
      <div
        key={item._id}
        className="flex items-center justify-between rounded-lg border p-3"
      >
        <span>{item.question}</span>

        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600"
          >
            <FiEdit size={15} />
            Edit
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-white hover:bg-red-600"
          >
            <FiTrash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
  </div>
  
)}
        
      
  <div className="space-y-2.5">
  {answers.map((item, index) => (
    <div
      key={index}
      className="group flex items-center gap-3 rounded-2xl border border-[#F0F0F0] px-4 py-3 transition-all duration-200 hover:bg-[#ACC822]/15 hover:text-[#ACC822]"
    >
      {/* Checkmark */}
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
          item.answer === "Yes"
            ? "border-[#ACC822] bg-[#ACC822]"
            : "border-gray-300"
        }`}
      >
        {item.answer === "Yes" && (
          <FiCheck
            size={15}
            className="text-white"
            strokeWidth={3}
          />
        )}
      </div>

      {/* Question */}
      <p
        className={`flex-1 min-w-[140px] text-[15px] transition-all duration-200 ${
          item.answer === "Yes"
            ? "text-gray-400"
            : "text-gray-700"
        }`}
      >
        {item.question}
      </p>

      {/* Right Side */}
      <div className="flex shrink-0 items-center gap-2">

        {/* Yes / No */}
        <button
          onClick={() => changeAnswer(index, "Yes")}
          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
            item.answer === "Yes"
              ? "border-[#ACC822] bg-[#ACC822] text-white"
              : "border-gray-300 text-gray-500 hover:border-[#ACC822] hover:text-[#ACC822]"
          }`}
        >
          Yes
        </button>

        <button
          onClick={() => changeAnswer(index, "No")}
          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
            item.answer === "No"
              ? "border-red-500 bg-red-500 text-white"
              : "border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500"
          }`}
        >
          No
        </button>
      </div>
    </div>
  ))}

    {answers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-[14px]">
              🎉 All tasks completed — great job!
            </p>
          </div>
        )}

        <div>
          <label className="mb-2 block font-semibold">
            Today's Appointment
          </label>

          <textarea
            value={appointment}
            onChange={(e) =>
              setAppointment(e.target.value)
            }
             className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#ACC822]"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Today's Expense
          </label>

          <textarea
            value={DailyExpanse}
            onChange={(e) =>
              setDailyExpanse(e.target.value)
            }
            className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#ACC822]"
             rows={2}
            
            
          />
        </div>

        <div className="flex justify-end">
        <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-[#ACC822] hover:bg-[#96B51D] text-white px-4 py-2 text-sm"
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
      </div>
     </div>
    </div>
   
  );
}
