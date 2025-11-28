import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Terminal, Loader } from 'lucide-react';

export function AgentChat({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'ai', text: 'Hi! I am the BotHost SRE. I can debug logs and restart your bots. How can I help?' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      // Point to the Python ADK Server
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: userText })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I am offline right now. Check if the Python agent is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-violet-600 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:bg-violet-500 transition-all hover:scale-110 z-50 group"
      >
        <Bot className="w-8 h-8 text-white group-hover:animate-pulse" />
        <span className="absolute -top-10 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask AI Ops
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
      
      {/* Header */}
      <div className="p-4 bg-violet-600 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white leading-none">BotHost AI</h3>
            <p className="text-violet-200 text-xs mt-1"></p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50" ref={scrollRef}>
        {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                {m.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center mr-2 border border-violet-500/30">
                        <Terminal className="w-4 h-4 text-violet-400" />
                    </div>
                )}
                <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    m.role === 'ai' 
                    ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                    : 'bg-violet-600 text-white rounded-tr-none'
                }`}>
                    {m.text}
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="p-3 bg-slate-800 rounded-2xl rounded-tl-none border border-slate-700">
                    <Loader className="w-4 h-4 text-violet-400 animate-spin" />
                </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative flex items-center">
            <input 
                className="w-full bg-slate-950 text-white rounded-xl py-3 pl-4 pr-12 border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type 'check my bots'..."
                autoFocus
            />
            <button 
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-violet-600 rounded-lg hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors"
            >
                <Send className="w-4 h-4 text-white" />
            </button>
        </div>
      </div>
    </div>
  );
}