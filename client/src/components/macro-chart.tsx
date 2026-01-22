import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroChart({ protein, carbs, fat }: MacroChartProps) {
  const data = [
    { name: "Protein", value: protein, color: "#22c55e" }, // primary
    { name: "Carbs", value: carbs, color: "#f97316" }, // accent
    { name: "Fat", value: fat, color: "#fbbf24" }, // amber-400
  ];

  if (protein === 0 && carbs === 0 && fat === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-full aspect-square mx-auto">
        No Data
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-gray-800">{Math.round(protein + carbs + fat)}g</span>
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Macros</span>
      </div>
    </div>
  );
}
