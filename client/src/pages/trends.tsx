import { useProfile, useMealLogs } from "@/hooks/use-nutrition";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Award, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";

export default function Trends() {
  const { data: profile } = useProfile();
  
  // Mock data for visualization
  const data = Array.from({ length: 7 }).map((_, i) => ({
    name: format(subDays(new Date(), 6 - i), 'EEE'),
    calories: 1800 + Math.random() * 400,
    protein: 80 + Math.random() * 20,
    carbs: 200 + Math.random() * 50,
    fat: 60 + Math.random() * 15,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Health Trends</h1>
        <p className="text-gray-500 mt-1">Deep analysis of your nutritional journey over time.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-500" /></div>
            <span className="text-sm font-bold text-gray-500">Average Cal</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,942 <span className="text-xs text-green-500">↑ 12%</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg"><Target className="w-5 h-5 text-blue-500" /></div>
            <span className="text-sm font-bold text-gray-500">Goal Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">84% <span className="text-xs text-gray-400">on track</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg"><Award className="w-5 h-5 text-orange-500" /></div>
            <span className="text-sm font-bold text-gray-500">Best Day</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Tuesday</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg"><Calendar className="w-5 h-5 text-purple-500" /></div>
            <span className="text-sm font-bold text-gray-500">Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">5 Days</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-8">Calorie Trend</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-8">Macro Distribution</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="protein" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbs" stackId="a" fill="#f97316" />
                <Bar dataKey="fat" stackId="a" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
