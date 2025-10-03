import { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated response. Connect this to your preferred AI service to get real responses.'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">ChatGPT</span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 px-4">
                <h1 className="text-4xl font-semibold">How can I help you today?</h1>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`py-8 ${
                    message.role === 'assistant' ? 'bg-[#2f2f2f]' : ''
                  }`}
                >
                  <div className="max-w-3xl mx-auto px-4">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-semibold ${
                            message.role === 'user'
                              ? 'bg-[#19c37d] text-white'
                              : 'bg-[#19c37d] text-white'
                          }`}
                        >
                          {message.role === 'user' ? 'U' : 'AI'}
                        </div>
                      </div>
                      <div className="flex-1 space-y-4 pt-1">
                        <div className="prose prose-invert max-w-none">
                          <p className="text-[15px] leading-7 whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="py-8 bg-[#2f2f2f]">
                  <div className="max-w-3xl mx-auto px-4">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-sm flex items-center justify-center text-sm font-semibold bg-[#19c37d] text-white">
                          AI
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-end bg-[#2f2f2f] rounded-3xl border border-white/10 focus-within:border-white/20 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message ChatGPT"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 bg-transparent px-6 py-4 text-[15px] resize-none focus:outline-none placeholder:text-white/40 max-h-[200px] overflow-y-auto"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a4a4a #2f2f2f' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="m-2 p-2 rounded-full bg-white text-black disabled:bg-white/20 disabled:text-white/40 hover:bg-white/90 transition-all disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            <p className="text-xs text-center text-white/40 mt-3">
              ChatGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
