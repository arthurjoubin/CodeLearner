import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { api } from '../services/api';
import { LanguageExercise, ChatMessage } from '../types';
import ReactMarkdown from '../pages/_ReactMarkdown';

interface CodeCraftChatProps {
  language: { id: string; name: string };
  exercise: LanguageExercise;
  code: string;
}

const MAX_MESSAGES = 10;

export default function CodeCraftChat({ language, exercise, code }: CodeCraftChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: userMessage,
      timestamp: Date.now() 
    };
    const newMessages: ChatMessage[] = [...messages, userMsg];
    
    // Keep only the last MAX_MESSAGES - 1 messages (will add assistant response)
    const trimmedMessages = newMessages.slice(-(MAX_MESSAGES - 1));
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const context = {
        topic: `${language.name} - ${exercise.title}`,
        lessonContent: `${exercise.instructions}\n\nCurrent code:\n${code}`,
      };

      const response = await api.chat(trimmedMessages, context);
      
      const assistantMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response,
        timestamp: Date.now() 
      };
      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        // Keep only MAX_MESSAGES messages
        return updated.slice(-MAX_MESSAGES);
      });
    } catch (error) {
      const errorMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: 'Sorry, I had trouble responding. Please try again.',
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 lg:bottom-4 z-40 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center border-2 border-primary-600 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-20 right-4 lg:bottom-4 z-40 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[70vh] lg:max-h-[500px] bg-white border-2 border-gray-300 rounded-lg shadow-xl flex flex-col transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-gray-300 bg-gray-50 rounded-t-lg">
          <div>
            <p className="text-xs font-bold uppercase text-gray-700">AI Tutor</p>
            <p className="text-xs text-gray-500 truncate">{language.name} - {exercise.title}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[300px]">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              <p className="mb-2">👋 Hi! I'm your AI tutor.</p>
              <p>Ask me anything about this exercise or your code!</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.role === 'user' ? msg.content : <ReactMarkdown content={msg.content} />}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader className="w-4 h-4 animate-spin text-gray-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Count Warning */}
        {messages.length >= MAX_MESSAGES - 2 && messages.length < MAX_MESSAGES && (
          <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
            <p className="text-xs text-yellow-700">⚠️ Approaching message limit ({messages.length}/{MAX_MESSAGES})</p>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t-2 border-gray-300 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading || messages.length >= MAX_MESSAGES}
              className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || messages.length >= MAX_MESSAGES}
              className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
