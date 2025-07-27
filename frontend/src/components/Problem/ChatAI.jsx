import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../utils/axiosClient";
import { Send, Bot, User, Sparkles, MessageCircle, Zap, Brain, Code2, Lightbulb } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        {
            role: 'model',
            parts: [{ text: "Hi! I'm your IndieCode AI assistant. I'm here to help you solve coding problems, explain algorithms, and guide you through your programming journey. What would you like to know about this problem?", displayText: "" }],
            isComplete: false
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Auto-scroll only when enabled and not manually scrolled
    useEffect(() => {
        if (autoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, autoScroll]);

    // Handle manual scrolling to disable auto-scroll
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        setAutoScroll(isAtBottom);
    };

    // Typing animation effect
    useEffect(() => {
        if (currentTypingIndex >= 0 && currentTypingIndex < messages.length) {
            const message = messages[currentTypingIndex];
            if (message.role === 'model' && !message.isComplete) {
                const fullText = message.parts[0].text;
                const currentText = message.parts[0].displayText || '';

                if (currentText.length < fullText.length) {
                    const timeoutId = setTimeout(() => {
                        setMessages(prev =>
                            prev.map((msg, index) => {
                                if (index === currentTypingIndex) {
                                    return {
                                        ...msg,
                                        parts: [{
                                            ...msg.parts[0],
                                            displayText: fullText.slice(0, currentText.length + 1)
                                        }]
                                    };
                                }
                                return msg;
                            })
                        );
                    }, 25);

                    return () => clearTimeout(timeoutId);
                } else {
                    setMessages(prev =>
                        prev.map((msg, index) => {
                            if (index === currentTypingIndex) {
                                return {
                                    ...msg,
                                    isComplete: true,
                                    parts: [{
                                        ...msg.parts[0],
                                        displayText: fullText
                                    }]
                                };
                            }
                            return msg;
                        })
                    );
                    setCurrentTypingIndex(-1);
                    setIsTyping(false);
                    setIsAiGenerating(false);
                    setAutoScroll(true); // Re-enable auto-scroll when AI finishes
                }
            }
        }
    }, [messages, currentTypingIndex]);

    const onSubmit = async (data) => {
        if (!data.message.trim() || isAiGenerating) return;

        setMessages(prev => [...prev, {
            role: 'user',
            parts: [{ text: data.message }],
            isComplete: true
        }]);
        reset();
        setIsTyping(true);
        setIsAiGenerating(true);
        setAutoScroll(true); // Enable auto-scroll for new AI response

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            const newMessage = {
                role: 'model',
                parts: [{ text: response.data.message, displayText: '' }],
                isComplete: false
            };

            setMessages(prev => [...prev, newMessage]);
            setCurrentTypingIndex(messages.length + 1);
        } catch (error) {
            const errorMessage = {
                role: 'model',
                parts: [{
                    text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
                    displayText: ''
                }],
                isComplete: false
            };

            setMessages(prev => [...prev, errorMessage]);
            setCurrentTypingIndex(messages.length + 1);
        }
    };

    const quickPrompts = [
        { icon: Lightbulb, text: "Give me a hint", prompt: "Can you give me a hint to solve this problem?" },
        { icon: Code2, text: "Explain approach", prompt: "What's the best approach to solve this problem?" },
        { icon: Brain, text: "Time complexity", prompt: "What's the time and space complexity of the optimal solution?" },
        { icon: Zap, text: "Debug my code", prompt: "Help me debug my current code implementation" }
    ];

    const handleQuickPrompt = (prompt) => {
        if (!isAiGenerating) {
            onSubmit({ message: prompt });
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[85vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-orange-500/20 overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-5">
                <div 
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </div>

            {/* Floating Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400/10 rounded-full blur-lg animate-pulse delay-500"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 px-6 py-5 bg-black/40 backdrop-blur-md border-b border-orange-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                                isAiGenerating ? 'bg-orange-400 animate-pulse' : 'bg-green-400 animate-ping'
                            }`}></div>
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                                isAiGenerating ? 'bg-orange-400' : 'bg-green-400'
                            }`}></div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-xl bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                                IndieCode AI Assistant
                            </h3>
                            <p className="text-sm text-gray-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-orange-400" />
                                {isAiGenerating ? 'Generating response...' : 'Ready to solve your coding challenges'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && !isAiGenerating && (
                <div className="relative z-10 px-6 py-4 bg-black/20 backdrop-blur-sm border-b border-orange-500/10">
                    <p className="text-gray-400 text-sm mb-3">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickPrompt(prompt.prompt)}
                                disabled={isAiGenerating}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs transition-all duration-200 ${
                                    isAiGenerating 
                                        ? 'bg-gray-500/10 border-gray-500/30 text-gray-500 cursor-not-allowed' 
                                        : 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-300 hover:scale-105'
                                }`}
                            >
                                <prompt.icon className="w-3 h-3" />
                                {prompt.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-orange-500/50 scrollbar-track-transparent"
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start space-x-4 ${
                            msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                            msg.role === "user" 
                                ? "bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/25" 
                                : "bg-gradient-to-br from-gray-700 to-gray-800 border border-orange-500/30 shadow-orange-500/10"
                        }`}>
                            {msg.role === "user" ? (
                                <User className="text-white w-5 h-5" />
                            ) : (
                                <Bot className="text-orange-400 w-5 h-5" />
                            )}
                        </div>
                        <div className="max-w-[75%] relative group">
                            <div className={`px-5 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
                                msg.role === "user"
                                    ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/20"
                                    : "bg-black/40 backdrop-blur-md text-gray-100 border border-orange-500/20 shadow-orange-500/5"
                            }`}>
                                {/* Message background pattern for AI */}
                                {msg.role === 'model' && (
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-transparent"></div>
                                    </div>
                                )}
                                
                                <p className="text-sm whitespace-pre-wrap leading-relaxed relative z-10">
                                    {msg.role === 'model' ? (msg.parts[0].displayText || msg.parts[0].text) : msg.parts[0].text}
                                    {msg.role === 'model' && !msg.isComplete && (
                                        <span className="inline-block w-0.5 h-4 bg-orange-400 ml-1 animate-pulse"></span>
                                    )}
                                </p>
                                
                                {/* Subtle glow effect */}
                                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                                    msg.role === "user" 
                                        ? "bg-gradient-to-br from-orange-400/20 to-amber-500/20 opacity-0 group-hover:opacity-100"
                                        : "bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100"
                                }`}></div>
                            </div>
                            
                            {/* Message timestamp */}
                            <div className={`text-xs text-gray-500 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && currentTypingIndex === -1 && (
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-orange-500/30">
                            <Bot className="text-orange-400 w-5 h-5" />
                        </div>
                        <div className="bg-black/40 backdrop-blur-md px-5 py-4 rounded-2xl border border-orange-500/20">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                                <span className="text-orange-300 text-xs ml-2">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {!autoScroll && (
                <div className="absolute bottom-24 right-6 z-20">
                    <button
                        onClick={() => {
                            setAutoScroll(true);
                            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                        ↓
                    </button>
                </div>
            )}

            {/* Input Section */}
            <div className="relative z-10 bg-black/60 backdrop-blur-md p-4 border-t border-orange-500/20">
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
                    <div className="relative flex-1">
                        <div className="absolute left-4 bottom-4 text-orange-400">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <textarea
                            className={`w-full bg-black/40 border pl-12 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 resize-none min-h-[48px] max-h-32 scrollbar-thin scrollbar-thumb-orange-500/50 scrollbar-track-transparent ${
                                isAiGenerating 
                                    ? 'border-gray-500/30 bg-gray-500/10 cursor-not-allowed' 
                                    : 'border-orange-500/30'
                            }`}
                            placeholder={isAiGenerating ? "Please wait for AI to finish..." : "Ask me anything about this problem..."}
                            rows="1"
                            disabled={isAiGenerating}
                            {...register("message", { required: true })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey && !isAiGenerating) {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)();
                                }
                            }}
                            style={{ 
                                backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundBlendMode: 'overlay'
                            }}
                        />
                        
                        {/* Input glow effect */}
                        <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
                            isAiGenerating 
                                ? 'bg-gradient-to-r from-gray-500/10 to-gray-500/10 opacity-100' 
                                : 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 focus-within:opacity-100'
                        }`}></div>
                    </div>
                    
                    <button
                        type="submit"
                        className={`group relative w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden ${
                            isAiGenerating 
                                ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                                : 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95'
                        }`}
                        disabled={errors.message || isAiGenerating}
                    >
                        {/* Button background animation */}
                        {!isAiGenerating && (
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                        
                        {isAiGenerating ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Send className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
                        )}
                        
                        {/* Ripple effect */}
                        {!isAiGenerating && (
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-xl"></div>
                        )}
                    </button>
                </form>
                
                {errors.message && !isAiGenerating && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        Please enter a message
                    </p>
                )}
                
                {isAiGenerating && (
                    <p className="text-orange-400 text-xs mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></span>
                        AI is generating response, please wait...
                    </p>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #f97316, #f59e0b);
                    border-radius: 2px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                /* Custom animations */
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
                    50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.5); }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }
                
                /* Textarea auto-resize */
                textarea {
                    field-sizing: content;
                }
            `}</style>
        </div>
    );
}

export default ChatAi;
