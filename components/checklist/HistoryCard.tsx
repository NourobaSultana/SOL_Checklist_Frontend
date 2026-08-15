import { Checklist } from '@/types/checklist';

interface Props {
  checklist: Checklist;
}

export default function HistoryCard({
  checklist,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {new Date(
            checklist.checklistDate,
          ).toLocaleDateString()}
        </h2>

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          Submitted
        </span>
      </div>

      <div className="space-y-3">
        {checklist.answers.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-2"
            >
              <span>{item.question}</span>

              <span
                className={`font-semibold ${
                  item.answer === 'Yes'
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {item.answer}
              </span>
            </div>
          ),
        )}
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p>
          <strong>Appointment:</strong>{' '}
          {checklist.appointment || 'N/A'}
        </p>

        <p className="mt-2">
          <strong>Total Expense:</strong>{' '}
          {checklist.DailyExpanse || 'N/A'}
        </p>
      </div>
    </div>
  );
}