'use client';

import { useEffect, useState } from 'react';

import { getMyHistory } from '@/services/checklist';

import { downloadChecklistPdf } from '@/app/utils/downloadChecklistPdf';

import Loader from '@/components/ui/Loader';


export default function HistoryPage() {

  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState<
    any[]
  >([]);



  

  const [loading, setLoading] =
    useState(true);
    

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getMyHistory();

        setHistory(data);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
  <div className="rounded-3xl border bg-white p-5 sm:p-6">
    
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Checklist History
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View all your submitted checklists.
        </p>
      </div>

      {/* History */}
      <div className="max-h-[600px] space-y-3 overflow-y-auto">
        {history.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              No History Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Submit your first checklist.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-gray-200 p-4 transition hover:border-[#ACC822] hover:shadow-md"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.title || "Checklist"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    ID: {item._id}
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-3">
              {/* <button
                onClick={() => downloadChecklistPdf(item)}
                className="rounded-lg border border-[#ACC822] px-4 py-2 text-sm font-medium text-[#ACC822] hover:bg-[#ACC822] hover:text-white"
              >
              📄 Download PDF      
              </button> */}

              <button
                onClick={() => {
                  setSelectedChecklist(item);
                  setShowModal(true);
                }}
                className="rounded-lg bg-[#ACC822] px-4 py-2 text-sm font-medium text-white hover:bg-[#96B51D]"
              > 
                👁 View Details
              </button>
            </div>
            </div>
          ))
        )}
      </div>
    
    {showModal && selectedChecklist && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setShowModal(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedChecklist.title}
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-2xl text-gray-500 hover:text-black"
        >
          ×
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-semibold">
            {new Date(selectedChecklist.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Appointment</p>
          <p className="font-semibold">
            {selectedChecklist.appointment || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Daily Expense</p>
          <p className="font-semibold">
            {selectedChecklist.dailyExpense}
          </p>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="mb-4 text-lg font-semibold">
        Checklist Items
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {selectedChecklist.answers.map(
  (answer: any, index: number) => (
    <div
      key={index}
      className="flex items-center justify-between rounded-lg border p-4"
    >
      <span>{answer.question}</span>

      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
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
)}
  </div>
);}