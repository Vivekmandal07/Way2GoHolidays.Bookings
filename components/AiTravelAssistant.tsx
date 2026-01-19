import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AiTravelAssistantProps {
  onBookNow: (destination?: string) => void;
}

const AiTravelAssistant: React.FC<AiTravelAssistantProps> = ({ onBookNow }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const generateTripSuggestions = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSuggestion(null);
    setFeedback(null);

    try {
      // Fix: Create the GoogleGenAI instance right before the API call to ensure use of the most up-to-date environment config.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Fix: Use 'gemini-3-pro-preview' for complex text tasks such as generating detailed travel itineraries.
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', //  'gemini-3-flash-preview'
        contents: `I want to plan a holiday. My requirements are: ${query}. 
        As a travel expert from Way2GoHolidays, suggest 2 detailed itinerary options. 
        Format the response with clear headings for each day. 
        Include estimated costs in INR and special highlights.
        End with a friendly closing inviting them to book with Way2GoHolidays.`,
        config: {
          systemInstruction: "You are the lead travel consultant for Way2GoHolidays, a luxury travel agency in New Delhi. You are professional, enthusiastic, and provide high-value travel advice. Always prioritize safety and premium experiences.",
          temperature: 0.7,
        },
      });

      // Fix: Direct access to response.text as per modern SDK guidelines.
      setSuggestion(response.text || "I couldn't generate a suggestion right now. Please try again with more details!");
    } catch (error) {
      console.error("AI Error:", error);
      setSuggestion("Oops! Our AI assistant is taking a short break. Please contact our experts directly using the 'Contact Travel Expert' button above.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    // In a real app, you would send this to your backend/analytics
    console.log(`Feedback received: ${type}`);
  };

  return (
    <section id="ai-planner" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl hidden md:block"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl hidden md:block"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs md:sm font-bold mb-4 animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.335 16.511a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM17.511 13.335a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM4.343 14.343a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707z" /></svg>
            <span>NEW: Way2GoHolidays AI MAGIC PLANNER</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight px-2">
            Where to <span className="text-blue-600 italic underline decoration-blue-200">Next?</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Describe your dream vacation. Our Way2GoHolidays AI handles the research, you handle the packing!
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl p-5 md:p-10 border border-gray-100 mx-auto">
          <div className="flex flex-col space-y-4">
            <textarea
              className="w-full p-5 md:p-6 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base md:text-lg min-h-[160px] bg-gray-50/50 placeholder:text-gray-400"
              placeholder="e.g., I want a 10-day trip to Europe for a family of 4, focusing on history and kid-friendly museums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                disabled={loading}
                onClick={generateTripSuggestions}
                className={`w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-100 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Designing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>Plan My Trip</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {suggestion && (
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-blue-50/50 rounded-3xl p-6 md:p-10 border border-blue-100 relative">
                {/* Feedback Buttons */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                   <button 
                    onClick={() => handleFeedback('up')}
                    className={`p-2 rounded-lg transition-all ${feedback === 'up' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-400 hover:text-green-500'}`}
                    title="This is helpful"
                   >
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                   </button>
                   <button 
                    onClick={() => handleFeedback('down')}
                    className={`p-2 rounded-lg transition-all ${feedback === 'down' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-400 hover:text-red-500'}`}
                    title="Not what I was looking for"
                   >
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" /></svg>
                   </button>
                </div>

                <div className="prose prose-blue prose-sm md:prose-lg max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed font-medium pt-4">
                  {suggestion}
                </div>
                
                <div className="mt-10 pt-8 border-t border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-blue-700 font-bold italic text-center md:text-left text-lg">
                    Ready to turn this plan into a reality?
                  </p>
                  <button
                    onClick={() => onBookNow()}
                    className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-full font-black shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 text-center"
                  >
                    Confirm & Book Trip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiTravelAssistant;
