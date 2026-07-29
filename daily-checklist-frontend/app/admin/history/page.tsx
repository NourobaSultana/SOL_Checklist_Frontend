'use client';

import { useEffect, useState } from 'react';
import { Checklist } from '@/types/checklist';
import Loader from '@/components/ui/Loader';
import HistoryTable from '@/components/admin/HistoryTable';
import { getAllChecklistHistory } from '@/services/admin';

export default function AdminHistoryPage() {
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

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        All Checklist History
      </h1>

      <HistoryTable
        history={history}
        onView={(item) => {
          setSelectedChecklist(item);
          setShowModal(true);
        }}
      />

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
                  {selectedChecklist.appointment || '-'}
                </p>
              </div>

              <div>
  <p className="text-gray-500">Daily Expense</p>
  <p className="font-semibold">
    {selectedChecklist.DailyExpanse || '-'}
  </p>
</div>
            </div>

            <hr className="my-6" />

            <h3 className="mb-4 text-lg font-semibold">
              Checklist Items
            </h3>

            <div className="max-h-80 space-y-3 overflow-y-auto">
              {selectedChecklist.answers?.map((answer: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <span>{answer.question}</span>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      answer.answer === 'Yes'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
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
  );
}