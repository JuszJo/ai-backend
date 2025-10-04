import { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import ChatInput from './components/ChatInput';
import { ChatGreeting, ChatLoading, ChatMessage, Message } from './components/Chat';
import { ChatAPI } from './api/chat.api';

type AIMessage = {
  role: string,
  content: string,
}

type ChatCompletion = {
  choices: Array<{ message: AIMessage }>
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); */

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
  }

  async function handleSubmit(e: React.FormEvent) {
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

    const response = await ChatAPI.send(userMessage.content)

    const completion = response.data as ChatCompletion;

    console.log(completion.choices);

    if (completion.choices.length) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: completion.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">ChatGPT</span>
          </div>
        </header> */}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {
            messages.length === 0 ? (<ChatGreeting />) : (
              <div className="max-w-3xl mx-auto px-4 py-8">
                {
                  messages.map(message => <ChatMessage message={message} key={message.id} />)
                }
                {
                  isLoading && <ChatLoading />
                }
                <div ref={messagesEndRef} />
              </div>
            )
          }
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          <div className='max-w-[800px] mx-auto'>
            <ChatInput
              disabled={false}
              handleSubmit={handleSubmit}
              input={input}
              isLoading={false}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              textareaRef={textareaRef}
            />
          </div>
          <p className="text-xs text-center text-white/40 mt-3">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
