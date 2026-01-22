import { useReminders, useCreateReminder, useDeleteReminder } from "@/hooks/use-nutrition";
import { useState } from "react";
import { Plus, Trash2, Bell, Clock, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Reminders() {
  const { data: reminders, isLoading } = useReminders();
  const createReminder = useCreateReminder();
  const deleteReminder = useDeleteReminder();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    time: "08:00",
    type: "water",
    message: ""
  });

  const handleSubmit = async () => {
    try {
      await createReminder.mutateAsync(formData);
      setIsDialogOpen(false);
      setFormData({ time: "08:00", type: "water", message: "" });
      toast({ title: "Reminder set!", description: "We'll nudge you at the right time." });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Daily Reminders</h1>
          <p className="text-gray-500 mt-1">Build healthy habits with timely nudges.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white rounded-full px-6">
              <Plus className="w-4 h-4 mr-2" /> Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogTitle className="text-xl font-bold">New Reminder</DialogTitle>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <Input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(val) => setFormData({...formData, type: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Drink Water</SelectItem>
                      <SelectItem value="meal">Meal</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Input 
                  placeholder="e.g., Time to hydrate!" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-primary mt-4">Create Reminder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reminders?.map((reminder, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={reminder.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{reminder.message}</h3>
                <div className="flex gap-2 items-center text-gray-500 text-sm mt-1">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">{reminder.time}</span>
                  <span className="capitalize text-xs border px-2 py-0.5 rounded-full">{reminder.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </div>
              <button 
                onClick={() => deleteReminder.mutate(reminder.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {reminders?.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No reminders set.
          </div>
        )}
      </div>
    </div>
  );
}
