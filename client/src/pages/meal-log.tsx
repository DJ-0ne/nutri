import { useState } from "react";
import { useFoods, useMealLogs, useCreateMealLog, useDeleteMealLog } from "@/hooks/use-nutrition";
import { format } from "date-fns";
import { Search, Plus, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function MealLog() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  
  // Cart state for new meal
  const [cart, setCart] = useState<{ food: any, quantity: number }[]>([]);

  const { data: foods } = useFoods(searchQuery);
  const { data: dailyLogs } = useMealLogs(selectedDate);
  const createLog = useCreateMealLog();
  const deleteLog = useDeleteMealLog();
  const { toast } = useToast();

  const handleAddToCart = (food: any) => {
    setCart([...cart, { food, quantity: 100 }]); // Default 100g
    toast({ title: "Added to meal", description: `${food.name} added.` });
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleSaveMeal = async () => {
    if (cart.length === 0) return;

    const totalCalories = cart.reduce((sum, item) => sum + (item.food.calories * item.quantity / 100), 0);
    const foodItems = cart.map(item => ({
      foodId: item.food.id,
      name: item.food.name,
      quantity_g: item.quantity,
      macros: {
        protein: item.food.protein * item.quantity / 100,
        carbs: item.food.carbs * item.quantity / 100,
        fat: item.food.fat * item.quantity / 100,
      }
    }));

    try {
      await createLog.mutateAsync({
        date: selectedDate, // Pass the string directly as Zod expects it for the date transformation or we handle it in schema
        mealType: selectedMealType,
        totalCalories: Math.round(totalCalories),
        foodItems: foodItems as any
      });
      setCart([]);
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Meal logged successfully!" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to log meal.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Meal Log</h1>
          <p className="text-gray-500 mt-1">Track your nutrition with local precision.</p>
        </div>
        <div className="flex gap-4 items-center">
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white rounded-full px-6">
                <Plus className="w-4 h-4 mr-2" /> Log Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden rounded-3xl">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <DialogTitle className="text-xl font-bold mb-4">Log a New Meal</DialogTitle>
                <div className="flex gap-2 mb-4">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedMealType(type)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium capitalize transition-all",
                        selectedMealType === type 
                          ? "bg-primary text-white shadow-md shadow-primary/20" 
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search foods (e.g. Ugali, Tilapia)..." 
                    className="pl-9 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-3">Food Database</h3>
                  {foods?.map(food => (
                    <div key={food.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors group">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{food.name}</p>
                          {food.isKenyaSpecific && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">KE</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{food.calories} kcal / 100g</p>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(food)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {searchQuery && foods?.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No foods found.</p>
                  )}
                </div>
                
                <div className="border-l pl-6 border-gray-100">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-3">Selected Items</h3>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <p className="text-sm">Your plate is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item, idx) => (
                        <div key={idx} className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold">{item.food.name}</span>
                            <button onClick={() => handleRemoveFromCart(idx)} className="text-red-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Input 
                              type="number" 
                              className="h-8 w-20 bg-white text-xs" 
                              value={item.quantity}
                              onChange={(e) => {
                                const newCart = [...cart];
                                newCart[idx].quantity = Number(e.target.value);
                                setCart(newCart);
                              }}
                            />
                            <span className="text-xs text-gray-500">grams</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveMeal} disabled={cart.length === 0} className="bg-primary hover:bg-primary/90">
                  Save Meal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {dailyLogs?.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
               <Utensils className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-xl font-bold text-gray-900">No meals logged</h3>
             <p className="text-gray-500 mt-2">Tap "Log Meal" to start tracking your nutrition.</p>
           </div>
        ) : (
          dailyLogs?.map(log => (
            <div key={log.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                    {log.mealType === 'breakfast' ? '🍳' : log.mealType === 'lunch' ? '🥗' : '🍲'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold capitalize text-gray-900">{log.mealType}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-md">
                        {log.totalCalories} kcal
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        {(log.foodItems as any[]).length} items
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteLog.mutate(log.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-50 grid gap-2">
                {(log.foodItems as any[]).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-400">{item.quantity_g}g</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Minimal icon component needed inside the file to avoid import error if I missed it
function Utensils({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
