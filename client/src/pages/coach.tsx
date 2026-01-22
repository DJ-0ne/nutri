import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/hooks/use-nutrition";
import { Send, Bot, User, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Message = { role: "user" | "assistant"; content: string };

// Initialize Gemini (use your API key from .env)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
// Or hardcode for testing: const apiKey = "your_actual_key_here";
if (!apiKey) {
  console.error("Gemini API key is missing! Check your .env file.");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",  // Current stable fast model as of January 2026
  systemInstruction: `
    You are a friendly, expert Nutrition Coach AI for Kenyan users. 
    Always respond in a warm, encouraging tone. 
    Focus on Kenyan foods (ugali, sukuma wiki, githeri, nyama choma, chapati, mandazi, etc.) and local ingredients.
    Use Swahili greetings/phrases occasionally (e.g., Jambo, Habari, Asante).
    you can also generate pictures of food when asked
    Be practical, culturally relevant, and evidence-based.
    Keep responses concise but helpful (under 200 words unless asked for detail).
  `,
});

export default function Coach() {
  const { data: profile } = useProfile();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Welcome message on mount
  useEffect(() => {
    const welcome = `Jambo! 👋 I'm your AI Nutrition Coach. 
I see you're aiming to ${profile?.dietaryGoals?.replace('_', ' ') || 'improve your health'}. 
How can I help you today? Ask about meals, recipes, or nutrition tips!`;
    
    setMessages([{ role: "assistant", content: welcome }]);
  }, [profile]);

  // Test Gemini connection on mount (diagnostic)
  useEffect(() => {
    async function testGemini() {
      if (!apiKey) {
        console.warn("Skipping Gemini test due to missing API key.");
        return;
      }
      try {
        console.log("Testing Gemini API connection...");
        const result = await model.generateContent("Test query: Say hello.");
        console.log("Gemini test successful! Response:", result.response.text());
      } catch (error) {
        console.error("Gemini test failed:", error);
      }
    }
    testGemini();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Update messages synchronously for history building
    let updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);

    setIsLoading(true);

    // Add empty assistant message
    updatedMessages = [...updatedMessages, { role: "assistant", content: "" }];
    setMessages(updatedMessages);

    try {
      console.log("Building history for Gemini...");
      // Build history excluding the empty assistant message
      const history = updatedMessages.slice(0, -1).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));
      console.log("History built:", history);

      console.log("Calling Gemini API...");
      // Start streaming
      const result = await model.generateContentStream({
        contents: history,
      });
      console.log("Gemini stream started.");

      let assistantText = "";
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          assistantText += text;
          console.log("Received chunk:", text);
          // Update the last message
          setMessages(prevMessages => {
            const newMsgs = [...prevMessages];
            newMsgs[newMsgs.length - 1].content = assistantText;
            return newMsgs;
          });
        }
      }
      console.log("Streaming complete. Full response:", assistantText);
    } catch (error: any) {
      console.error("Gemini error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response ? error.response : null,
      });
      setMessages(prevMessages => {
        const newMsgs = [...prevMessages];
        newMsgs[newMsgs.length - 1].content = `Error: ${error.message || 'Unknown error'}. Check console for details.`;
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
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
          <p className="text-sm text-gray-500">Powered by Gemini • Ask about Kenyan foods & nutrition</p>
        </div>
        {profile?.subscriptionTier === 'premium' && (
          <div className="ml-auto px-3 py-1 bg-yellow-400 text-black rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-yellow-500/20">
            <Zap className="w-3 h-3" /> Premium AI Active
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user" ? "bg-accent text-white" : "bg-primary text-white"
              )}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl max-w-[80%] leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-accent text-white rounded-tr-none" 
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              )}>
                {msg.content || <span className="text-gray-400 italic">Thinking...</span>}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about healthy Ugali alternatives..."
            className="bg-white border-gray-200 focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}