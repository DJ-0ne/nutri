import { useProfile, useMealLogs, useReminders } from "@/hooks/use-nutrition";
import { MacroChart } from "@/components/macro-chart";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Plus, 
  Droplets, 
  Flame, 
  TrendingUp, 
  ChevronRight,
  Clock,
  Bell
} from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: mealLogs, isLoading: loadingLogs } = useMealLogs(today);
  const { data: reminders, isLoading: loadingReminders } = useReminders();

  const totalCalories = mealLogs?.reduce((sum, log) => sum + log.totalCalories, 0) || 0;
  const targetCalories = profile?.dietaryGoals === 'lose_weight' ? 1800 : 2200; // Simplified logic
  
  // Calculate macros
  const macros = mealLogs?.reduce((acc, log) => {
    const items = log.foodItems as any[];
    items.forEach(item => {
      acc.protein += item.macros.protein;
      acc.carbs += item.macros.carbs;
      acc.fat += item.macros.fat;
    });
    return acc;
  }, { protein: 0, carbs: 0, fat: 0 }) || { protein: 0, carbs: 0, fat: 0 };

  if (loadingProfile || loadingLogs || loadingReminders) {
    return (
      <div className="space-y-6">
        <div className="h-32 w-full bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = profile?.userId ? "Champion" : "Guest"; // Fallback if no name

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            {greeting}, {firstName}
          </h1>
          <p className="text-gray-500 mt-1">Here's your nutritional summary for today.</p>
        </div>
        <Link href="/meals">
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all">
            <Plus className="w-5 h-5" />
            Log Meal
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Calories Card - Large */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="md:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Calorie Intake</h2>
              <p className="text-sm text-gray-500">Daily Goal: {targetCalories} kcal</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 shrink-0">
               {/* Radial Progress Logic handled by MacroChart visual roughly */}
               <div className="relative w-full h-full rounded-full border-8 border-gray-100 flex items-center justify-center">
                 <div 
                   className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent -rotate-90"
                   style={{ 
                     clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, 
                     transform: `rotate(${Math.min((totalCalories / targetCalories) * 360, 360)}deg)` 
                   }} 
                 />
                 <div className="text-center">
                   <span className="block text-3xl font-bold text-gray-900">{totalCalories}</span>
                   <span className="text-xs text-gray-500 uppercase font-medium">Consumed</span>
                 </div>
               </div>
            </div>
            
            <div className="flex-1 grid grid-cols-3 gap-4 w-full">
               <div className="bg-gray-50 p-4 rounded-2xl text-center">
                 <span className="block text-sm text-gray-500 mb-1">Protein</span>
                 <span className="block text-xl font-bold text-gray-900">{Math.round(macros.protein)}g</span>
                 <div className="h-1 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-green-500 w-1/2" />
                 </div>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl text-center">
                 <span className="block text-sm text-gray-500 mb-1">Carbs</span>
                 <span className="block text-xl font-bold text-gray-900">{Math.round(macros.carbs)}g</span>
                 <div className="h-1 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-orange-500 w-3/4" />
                 </div>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl text-center">
                 <span className="block text-sm text-gray-500 mb-1">Fat</span>
                 <span className="block text-xl font-bold text-gray-900">{Math.round(macros.fat)}g</span>
                 <div className="h-1 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-yellow-400 w-1/3" />
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Reminders Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 bg-primary text-white p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Bell className="w-32 h-32" />
          </div>
          
          <h2 className="text-xl font-bold mb-6 relative z-10">Up Next</h2>
          
          <div className="space-y-4 relative z-10">
            {reminders?.slice(0, 3).map((reminder, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{reminder.message}</p>
                  <p className="text-sm text-white/70">{reminder.time}</p>
                </div>
              </div>
            ))}
            {(!reminders || reminders.length === 0) && (
              <p className="text-white/70">No active reminders.</p>
            )}
          </div>
          
          <Link href="/reminders">
            <button className="mt-8 w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors">
              Manage Reminders
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Recent Meals */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-gray-900">Recent Meals</h2>
             <Link href="/meals" className="text-primary hover:underline text-sm font-medium flex items-center">
               View All <ChevronRight className="w-4 h-4" />
             </Link>
           </div>
           
           <div className="space-y-4">
             {mealLogs?.slice(0, 3).map((log, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-lg">
                     {log.mealType === 'breakfast' ? '🍳' : log.mealType === 'lunch' ? '🥗' : '🍲'}
                   </div>
                   <div>
                     <p className="font-bold text-gray-900 capitalize">{log.mealType}</p>
                     <p className="text-xs text-gray-500">{(log.foodItems as any[])?.length} items</p>
                   </div>
                 </div>
                 <span className="font-semibold text-gray-900">{log.totalCalories} kcal</span>
               </div>
             ))}
             {(!mealLogs || mealLogs.length === 0) && (
               <div className="text-center py-8 text-gray-500">
                 No meals logged today yet.
               </div>
             )}
           </div>
         </div>

         <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-3xl border border-orange-200">
           <div className="flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm">
               <TrendingUp className="w-6 h-6 text-orange-500" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-900">AI Insight</h2>
               <p className="text-sm text-gray-600 mt-1">
                 Based on your recent logs, you're slightly low on protein today. 
                 Try adding some lentils (Kamande) or lean chicken to your dinner.
               </p>
             </div>
           </div>
           <div className="mt-6 flex justify-end">
             <Link href="/coach">
               <button className="text-sm font-bold text-orange-600 hover:text-orange-700 bg-white px-4 py-2 rounded-lg shadow-sm">
                 Ask Coach
               </button>
             </Link>
           </div>
         </div>
      </div>
    </div>
  );
}
