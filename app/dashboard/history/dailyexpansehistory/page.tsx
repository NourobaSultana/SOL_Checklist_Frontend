"use client";

import { useEffect, useState } from "react";

import { getMyDailyExpanseHistory } from "@/services/dailyexpanse";

import Loader from "@/components/ui/Loader";

export default function DailyExpanseHistoryPage() {
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);

  const [history, setHistory] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getMyDailyExpanseHistory();

        setHistory(data);
      } catch (error) {
        console.error("Failed to load expense history:", error);
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl lg:text-3xl">
            Daily Expense History
          </h1>

          <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
            View, review and manage all your submitted daily expenses.
          </p>
        </div>

        <div className="w-fit rounded-xl bg-[#ACC822]/10 px-4 py-2 text-sm font-semibold text-[#ACC822]">
          Total: {history.length}
        </div>
      </div>

      {/* History */}
      <div className="max-h-[600px] space-y-3 overflow-y-auto">
        {history.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              No Expense History Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Save your first daily expense.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ACC822]/40 hover:shadow-lg sm:p-5 lg:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                      Daily Expense
                    </h3>

                    <span className="text-sm text-red-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {item.DailyExpanse}
                  </p>

                  <p className="mt-3 break-all text-xs text-slate-400 sm:text-sm">
                    ID: {item._id}
                  </p>
                </div>

                {/* Right */}
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                  <button
                    onClick={() => {
                      setSelectedExpense(item);
                      setShowModal(true);
                    }}
                    className="flex w-full items-center justify-center rounded-xl bg-[#ACC822] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96B51D] hover:shadow-lg sm:w-auto"
                  >
                    👁 View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && selectedExpense && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
          >
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Daily Expense Details
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-gray-500">Date</p>

              <p className="font-semibold text-slate-800">
                {new Date(selectedExpense.createdAt).toLocaleDateString()}
              </p>
            </div>

            <hr className="my-6" />

            {/* Expense */}
            <h3 className="mb-3 text-lg font-semibold text-slate-800">
              Today&apos;s Expense
            </h3>

            <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {selectedExpense.DailyExpanse}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
