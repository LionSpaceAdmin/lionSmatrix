"use client";

import { useState } from 'react';
import { callGeminiWithBackoff } from '@/lib/api';

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export default function InvestigationTab() {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { role: 'model', parts: [{ text: "I am your OSINT assistant. What would you like to investigate today?" }] }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChatSubmit = async () => {
        if (!chatInput) return;

        const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', parts: [{ text: chatInput }] }];
        setChatHistory(newHistory);
        setChatInput('');
        setIsLoading(true);

        const systemPrompt = "You are a helpful and concise OSINT assistant named 'Lion'. Use the provided search tool to answer the user's questions based on the most up-to-date information available. Keep your answers focused and directly address the user's query.";
        const payload = { contents: newHistory, tools: [{ "google_search": {} }], systemInstruction: { parts: [{ text: systemPrompt }] }, };

        try {
            const result = await callGeminiWithBackoff(payload);
            const candidate = result.candidates?.[0];
            if (candidate && candidate.content?.parts?.[0]?.text) {
                const modelText = candidate.content.parts[0].text;
                setChatHistory([...newHistory, { role: 'model', parts: [{ text: modelText }] }]);
            } else {
                setChatHistory([...newHistory, { role: 'model', parts: [{ text: "An error occurred. Please try your query again." }] }]);
            }
        } catch (error) {
            setChatHistory([...newHistory, { role: 'model', parts: [{ text: "An error occurred. Please try your query again." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="investigation-content" className="tab-content">
            <h2 data-i18n-key="investigation_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Conversational Investigation</h2>
            <p data-i18n-key="investigation_subtitle" className="text-center text-gray-400 mb-6">Start an investigation. Ask your AI analyst questions and get answers based on real-time information.</p>
            <div id="chat-history" className="w-full h-80 overflow-y-auto p-4 bg-black bg-opacity-20 rounded-md border border-gray-800 flex flex-col mb-4">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.role}`}>
                        <p>{msg.parts[0].text}</p>
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <input type="text" id="chat-input" className="flex-grow p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="investigation_placeholder" placeholder="Ask a follow-up question..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleChatSubmit(); }} />
                <button id="chat-send-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-6 rounded-md" data-i18n-key="investigation_button_send" onClick={handleChatSubmit} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
}
