import { useProfile, useUpdateProfile, useUpgradeProfile } from "@/hooks/use-nutrition";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Crown, Shield, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const upgradeProfile = useUpgradeProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    height: 170,
    weight: 70,
    age: 30,
    gender: "male",
    activityLevel: "moderate",
    dietaryGoals: "maintain",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        height: profile.height || 170,
        weight: profile.weight || 70,
        age: profile.age || 30,
        gender: profile.gender || "male",
        activityLevel: profile.activityLevel || "moderate",
        dietaryGoals: profile.dietaryGoals || "maintain",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      toast({ title: "Profile updated successfully" });
    } catch (e) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleUpgrade = async () => {
    try {
      await upgradeProfile.mutateAsync("premium");
      toast({ title: "Welcome to Premium!", description: "All features unlocked." });
    } catch (e) {
      toast({ title: "Failed to upgrade", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <UserCircle className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
          <p className="text-gray-500">{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {profile?.subscriptionTier === 'premium' ? 'Premium Member' : 'Free Plan'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Body Metrics & Goals
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Height (cm)</label>
              <Input 
                type="number" 
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <Input 
                type="number" 
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Age</label>
              <Input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <Select 
                value={formData.gender}
                onValueChange={(val) => setFormData({...formData, gender: val})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Activity Level</label>
              <Select 
                value={formData.activityLevel}
                onValueChange={(val) => setFormData({...formData, activityLevel: val})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (Office Job)</SelectItem>
                  <SelectItem value="light">Lightly Active</SelectItem>
                  <SelectItem value="moderate">Moderately Active</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Goal</label>
              <Select 
                value={formData.dietaryGoals}
                onValueChange={(val) => setFormData({...formData, dietaryGoals: val})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleSave} className="mt-8 w-full bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>

        {/* Subscription Card */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Crown className="w-40 h-40" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-display font-bold mb-2">Premium Plan</h2>
            <p className="text-gray-400 text-sm">Unlock the full potential of your nutrition journey.</p>
            
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-1 bg-green-500/20 rounded text-green-400"><Shield className="w-4 h-4" /></div>
                <span className="text-sm">Advanced AI Analysis</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 bg-green-500/20 rounded text-green-400"><Shield className="w-4 h-4" /></div>
                <span className="text-sm">Unlimited Meal Logs</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 bg-green-500/20 rounded text-green-400"><Shield className="w-4 h-4" /></div>
                <span className="text-sm">Priority Support</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 mt-8">
            {profile?.subscriptionTier === 'premium' ? (
              <Button disabled className="w-full bg-green-500/20 text-green-400 border border-green-500/50">
                Currently Active
              </Button>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold border-none shadow-lg shadow-yellow-500/20"
                >
                  Upgrade Now
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
