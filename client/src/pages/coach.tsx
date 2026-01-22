import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/hooks/use-nutrition";
import { Send, Bot, User, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Using the provided chat integration API
// This is a customized interface for the nutrition context
export default function Coach() {
  const { data: profile } = useProfile();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Create a conversation on mount if not exists
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch existing conversations or create a new one
    // For this demo, we'll create one on the fly
    const initChat = async () => {
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ title: 'Nutrition Coach Session' })
        });
        const data = await res.json();
        setConversationId(data.id);
        
        // Add welcome message locally
        setMessages([{
          role: 'assistant',
          content: `Jambo! I'm your AI Nutrition Coach. I see you're aiming to ${profile?.dietaryGoals?.replace('_', ' ') || 'improve your health'}. How can I help you with your meals today?`
        }]);
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    };
    initChat();
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Use the SSE endpoint provided by the Replit integration
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: `Context: User is from Kenya. Goal: ${profile?.dietaryGoals}. 
                    Question: ${userMsg}` 
        }),
      });

      if (!res.ok) throw new Error('Failed to send');

      // Handle SSE response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";
      
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMsg += data.content;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = assistantMsg;
                  return newMsgs;
                });
              }
            } catch (e) {
              // Ignore parse errors on partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-8rem)] max-w-4xl mx-auto flex flex-col bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nutrition Coach AI</h2>
          <p className="text-sm text-gray-500">Ask about Kenyan foods, recipes, or diet advice.</p>
        </div>
        {profile?.subscriptionTier === 'premium' && (
          <div className="ml-auto px-3 py-1 bg-yellow-400 text-black rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-yellow-500/20">
            <Zap className="w-3 h-3" /> Premium AI Active
          </div>
        )}
        {profile?.subscriptionTier === 'free' && (
          <div className="ml-auto px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
            Basic Mode
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-accent text-white" : "bg-primary text-white"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl max-w-[80%] leading-relaxed",
                msg.role === 'user' 
                  ? "bg-accent text-white rounded-tr-none" 
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                 <Bot className="w-4 h-4" />
               </div>
               <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                 <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
               </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about healthy Ugali alternatives..."
            className="bg-white border-gray-200 focus-visible:ring-primary"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
