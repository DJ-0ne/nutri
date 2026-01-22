import { useAuth } from "@/hooks/use-auth";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Utensils, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <Redirect to="/dashboard" />;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              NutriKenya
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/login">
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Eat Smart.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Live Better.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-lg leading-relaxed">
                Your personal AI nutrition coach tailored for Kenyan lifestyles. Track local foods, get personalized advice, and build healthier habits.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/api/login">
                  <Button size="xl" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-primary/20">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50" />
              {/* Healthy food bowl image from Unsplash */}
              {/* bowl of healthy salad with avocado and grains */}
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80" 
                alt="Healthy Bowl" 
                className="relative rounded-[2.5rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 w-full object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Utensils className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kenya Food DB</h3>
              <p className="text-gray-600">
                Detailed nutritional data for local favorites like Ugali, Sukuma Wiki, Githeri, and more.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Nutrition Coach</h3>
              <p className="text-gray-600">
                Get personalized meal plans and advice from an AI that understands your goals and local cuisine.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Tracking</h3>
              <p className="text-gray-600">
                Log meals, track macros, and set daily reminders to stay on top of your health goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
