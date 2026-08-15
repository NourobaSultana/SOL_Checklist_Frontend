interface Props {
  title: string;
  value: string | number;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-gray-500">{title}</h2>

      <p className="mt-4 text-4xl font-bold">{value}</p>
    </div>
  );
}
