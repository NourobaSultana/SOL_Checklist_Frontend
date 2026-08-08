"use client";

import { useEffect, useState } from "react";
import { Checklist } from "@/types/checklist";
import Loader from "@/components/ui/Loader";
import HistoryTable from "@/components/admin/HistoryTable";
import { getAllChecklistHistory } from "@/services/admin";
import { useLanguage } from "@/app/context/LanguageContext";

export default function AdminHistoryPage() {
  const { dictionary, language, setLanguage } = useLanguage();
  const [history, setHistory] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  async function loadHistory() {
    try {
      const data = await getAllChecklistHistory();
      console.log(data);
      setHistory(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return <Loader />;
  }
  // "history": {
  //   "description": "Review and manage all submitted checklists.",
  //   "total": "Total",
  //   "checklistDetails": "Checklist Details",
  //   "date": "Date",
  //   "appointment": "Appointment",
  //   "dailyExpense": "Daily Expense",
  //   "checklistItems": "Checklist Items"
  // }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            {dictionary.history.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {dictionary.history.description}
          </p>
        </div>

        <div className="w-fit rounded-xl bg-[#ACC822]/10 px-4 py-2 text-sm font-semibold text-[#ACC822]">
          {dictionary.history.total}: {history.length}
        </div>
      </div>

      {/* Table */}
      <HistoryTable
        history={history}
        onView={(item) => {
          setSelectedChecklist(item);
          setShowModal(true);
        }}
      />

      {/* Modal */}
      {showModal && selectedChecklist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-4 sm:p-6">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-800 sm:text-2xl">
                  {selectedChecklist.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {dictionary.history.checklistDetails}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="ml-4 flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100"
              >
                <span className="text-2xl text-slate-500">×</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Info */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    {dictionary.history.date}
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {new Date(selectedChecklist.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Appointment</p>

                  <p className="mt-1 break-words font-semibold text-slate-800">
                    {selectedChecklist.appointment || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Daily Expense</p>

                  <p className="mt-1 break-words font-semibold text-slate-800">
                    {selectedChecklist.DailyExpanse || "-"}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-bold text-slate-800">
                  Checklist Items
                </h3>

                <div className="space-y-3">
                  {selectedChecklist.answers?.map((answer, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#ACC822]/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="break-words font-medium text-slate-800">
                          {answer.question}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                          answer.answer === "Yes"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {answer.answer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
