type StatCardProps = {
  title: string;
  value: string | number;
  sub?: string;
  color?: "blue" | "green" | "purple" | "orange";
};

const colorMap = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  green: "bg-green-50 border-green-200 text-green-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  orange: "bg-orange-50 border-orange-200 text-orange-700",
};

export default function StatCard({ title, value, sub, color = "blue" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-70">{sub}</p>}
    </div>
  );
}
