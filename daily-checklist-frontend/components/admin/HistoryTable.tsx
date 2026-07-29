import { downloadChecklistPdf } from "@/app/utils/downloadChecklistPdf";

interface Props {
  history: any[];
  onView: (item: any) => void;
}

export default function HistoryTable({
  history,
  onView,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-lime-500">
          <tr>
            <th className="p-4 text-left">
              User
            </th>

            <th className="text-left">
              Date
            </th>

            <th className="text-left">
              Appointment
            </th>

            <th className="text-left">
              Daily Expanse
            </th>

            <th className="text-left">
              Checklist
            </th>
          </tr>
        </thead>

        <tbody>
          {history.map((item) => (
            <tr
              key={item._id}
              className="border-b align-top"
            >
            <td className="p-4">
              <div className="font-semibold">
                {item.user?.name}
              </div>
            </td>

              <td>
                {new Date(
                  item.checklistDate,
                ).toLocaleDateString()}
              </td>

              <td>
                {item.appointment || '-'}
              </td>

              <td>
                {item.DailyExpanse || '-'}
              </td>

             <td>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(item)}
                  className="rounded-lg bg-[#ACC822] px-3 py-2 text-sm font-medium text-white hover:bg-[#96B51D]"
                >
                  👁 View
                </button>

                <button
                  onClick={() => downloadChecklistPdf(item)}
                  className="rounded-lg border border-[#ACC822] px-3 py-2 text-sm font-medium text-[#ACC822] hover:bg-[#ACC822] hover:text-white"
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
  );
}