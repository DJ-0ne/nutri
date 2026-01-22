import { useProfile, useMealLogs, useFoods } from "@/hooks/use-nutrition";
import { useState } from "react";
import { Coffee, Plus, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Recipes() {
  const { data: profile } = useProfile();
  const { data: foods } = useFoods();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);

  const generateRecipes = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/analysis/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      // Mocking recipe extraction from Gemini analysis for demo
      // In a real app, you'd have a specific recipe endpoint
      setRecipes([
        {
          name: "High-Protein Githeri",
          description: "A nutritious twist on the classic Kenyan dish, packed with extra protein from lean beef and spinach.",
          calories: 450,
          protein: "35g",
          carbs: "45g",
          fat: "12g",
          time: "40 mins",
          emoji: "🥣"
        },
        {
          name: "Tilapia with Brown Ugali",
          description: "Grilled tilapia served with fiber-rich brown ugali and a side of fresh kachumbari.",
          calories: 520,
          protein: "42g",
          carbs: "60g",
          fat: "8g",
          time: "30 mins",
          emoji: "🐟"
        }
      ]);
      toast({ title: "New recipes ready!", description: "AI has tailored these for your goals." });
    } catch (e) {
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">AI Smart Recipes</h1>
          <p className="text-gray-500 mt-1">Personalized Kenyan dishes based on your health goals.</p>
        </div>
        <Button 
          onClick={generateRecipes} 
          disabled={isGenerating}
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 h-auto text-lg shadow-xl shadow-primary/20"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
          Generate Recipes
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {recipes.length > 0 ? (
          recipes.map((recipe, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                  {recipe.emoji}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{recipe.calories}</span>
                  <span className="text-sm text-gray-400 block uppercase tracking-wider font-bold">kcal</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{recipe.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold">Protein</span>
                  <span className="font-bold text-gray-900">{recipe.protein}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold">Carbs</span>
                  <span className="font-bold text-gray-900">{recipe.carbs}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold">Fat</span>
                  <span className="font-bold text-gray-900">{recipe.fat}</span>
                </div>
              </div>

              <Button className="w-full bg-gray-900 hover:bg-black text-white rounded-2xl py-6 h-auto font-bold">
                View Instructions <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          ))
        ) : (
          <div className="md:col-span-2 py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-6">
              <Coffee className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Hungry for something new?</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">Click "Generate Recipes" to get AI-powered, Kenyan-style meal suggestions tailored just for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}
