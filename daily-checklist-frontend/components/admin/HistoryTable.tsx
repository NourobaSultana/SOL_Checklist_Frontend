import { downloadChecklistPdf } from "@/app/utils/downloadChecklistPdf";

interface Props {
  history: any[];
  onView: (item: any) => void;
}

export default function HistoryTable({ history, onView }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 p-4 md:hidden">
        {history.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {/* User */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {item.user?.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {new Date(item.checklistDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Appointment */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Appointment
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {item.appointment || "-"}
              </p>
            </div>

            {/* Expense */}
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Daily Expense
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {item.DailyExpanse || "-"}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onView(item)}
                className="flex-1 rounded-xl bg-[#ACC822] py-3 text-sm font-semibold text-white transition hover:bg-[#96B51D]"
              >
                👁 View
              </button>

              <button
                onClick={() => downloadChecklistPdf(item)}
                className="flex-1 rounded-xl border border-[#ACC822] py-3 text-sm font-semibold text-[#ACC822] transition hover:bg-[#ACC822] hover:text-white"
              >
                📄 PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#ACC822] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                User
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Appointment
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Daily Expense
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item._id}
                className="border-b border-slate-200 transition hover:bg-slate-50"
              >
                {/* User */}
                <td className="px-6 py-5">
                  <div className="font-semibold text-slate-800">
                    {item.user?.name}
                  </div>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                  {new Date(item.checklistDate).toLocaleDateString()}
                </td>

                {/* Appointment */}
                <td className="max-w-xs px-6 py-5">
                  <p className="line-clamp-2 text-sm text-slate-600">
                    {item.appointment || "-"}
                  </p>
                </td>

                {/* Expense */}
                <td className="max-w-xs px-6 py-5">
                  <p className="line-clamp-2 text-sm text-slate-600">
                    {item.DailyExpanse || "-"}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onView(item)}
                      className="rounded-xl bg-[#ACC822] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#96B51D]"
                    >
                      👁 View
                    </button>

                    <button
                      onClick={() => downloadChecklistPdf(item)}
                      className="rounded-xl border border-[#ACC822] px-4 py-2 text-sm font-medium text-[#ACC822] transition hover:bg-[#ACC822] hover:text-white"
                    >
                      📄 PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
