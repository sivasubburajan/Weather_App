import React, { useState } from 'react';
import {
  Activity,
  Shirt,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  Umbrella,
  Compass,
  Zap,
  Car,
  Footprints,
  Utensils,
  Sun,
  Wind,
} from 'lucide-react';
import {
  WeatherForecastResponse,
  UnitSystem,
  AiBriefingResponse,
  ChatMessage,
} from '../types';
import {
  calculateActivityScores,
  generateOutfitRecommendation,
} from '../utils/weatherUtils';

interface PlanningIntelligenceProps {
  weather: WeatherForecastResponse;
  unit: UnitSystem;
}

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({ weather, unit }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'outfit' | 'ai-brief' | 'ai-chat'>('activities');

  // Activity & Outfit Local Calculations
  const activities = calculateActivityScores(weather.current, weather.daily[0]);
  const outfit = generateOutfitRecommendation(weather.current);

  // AI Briefing State
  const [briefing, setBriefing] = useState<AiBriefingResponse | null>(null);
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! I am your Weather Intelligence AI assistant. Ask me anything about today's weather in ${weather.locationName}, such as "Is it good for a 5km run at 6 PM?" or "Should I take an umbrella to the park?"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Fetch AI Briefing
  const fetchBriefing = async () => {
    setIsLoadingBriefing(true);
    setBriefingError(null);
    try {
      const dailySummary = weather.daily.slice(0, 3).map((d) => ({
        date: d.date,
        tempMax: d.tempMax,
        tempMin: d.tempMin,
        rainSum: d.precipitationSum,
        windMax: d.windSpeedMax,
      }));

      const response = await fetch('/api/ai-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: weather.locationName,
          country: weather.country,
          current: weather.current,
          dailySummary,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not generate AI briefing.');
      }

      const data = await response.json();
      setBriefing(data);
    } catch (err: any) {
      console.error(err);
      setBriefingError(err.message || 'Failed to synthesize AI briefing.');
    } finally {
      setIsLoadingBriefing(false);
    }
  };

  // Handle AI Chat Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: userMsg.text,
          weatherContext: {
            locationName: weather.locationName,
            current: weather.current,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('AI Chat response failed.');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'I analyzed the weather conditions for you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered a temporary connection issue. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div id="planning-intelligence-section" className="bg-[#111827] border border-[#1E293B] rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-serif text-white tracking-wide">Intelligent Planning</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Smart activity scores, outfit guide, and AI weather insights</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#1E293B] rounded-full border border-[#334155]">
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              activeTab === 'activities'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Activity Scores
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outfit')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              activeTab === 'outfit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" /> Outfit Advisor
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('ai-brief');
              if (!briefing && !isLoadingBriefing) fetchBriefing();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              activeTab === 'ai-brief'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Executive Brief
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai-chat')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              activeTab === 'ai-chat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> AI Assistant
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div id="tab-activities" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Outdoor Sports */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-blue-500/20 flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <Footprints className="w-4 h-4 text-emerald-400" /> Outdoor Sports & Jogging
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activities.sports.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                  activities.sports.score >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {activities.sports.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2 font-medium">{activities.sports.verdict}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{activities.sports.tips}</p>
            </div>
            <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden mt-4">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${activities.sports.score}%` }} />
            </div>
          </div>

          {/* Picnic / Outdoor Dining */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-blue-500/20 flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <Utensils className="w-4 h-4 text-amber-400" /> Picnic & Outdoor Dining
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activities.picnic.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                  activities.picnic.score >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {activities.picnic.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2 font-medium">{activities.picnic.verdict}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{activities.picnic.tips}</p>
            </div>
            <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden mt-4">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${activities.picnic.score}%` }} />
            </div>
          </div>

          {/* Sightseeing */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-blue-500/20 flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <Compass className="w-4 h-4 text-blue-400" /> Sightseeing & Travel
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activities.sightseeing.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                  activities.sightseeing.score >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {activities.sightseeing.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2 font-medium">{activities.sightseeing.verdict}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{activities.sightseeing.tips}</p>
            </div>
            <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden mt-4">
              <div className="bg-blue-400 h-full rounded-full transition-all duration-500" style={{ width: `${activities.sightseeing.score}%` }} />
            </div>
          </div>

          {/* Driving Safety */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-blue-500/20 flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <Car className="w-4 h-4 text-indigo-400" /> Driving & Road Safety
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activities.driving.score >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                  activities.driving.score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {activities.driving.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2 font-medium">{activities.driving.verdict}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{activities.driving.tips}</p>
            </div>
            <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden mt-4">
              <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${activities.driving.score}%` }} />
            </div>
          </div>

          {/* Clothes Drying */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-blue-500/20 flex flex-col justify-between hover:border-blue-500/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <Wind className="w-4 h-4 text-teal-400" /> Clothes Outdoor Drying
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activities.drying.score >= 75 ? 'bg-emerald-500/20 text-emerald-400' :
                  activities.drying.score >= 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {activities.drying.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2 font-medium">{activities.drying.verdict}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{activities.drying.tips}</p>
            </div>
            <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden mt-4">
              <div className="bg-teal-400 h-full rounded-full transition-all duration-500" style={{ width: `${activities.drying.score}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OUTFIT ADVISOR */}
      {activeTab === 'outfit' && (
        <div id="tab-outfit" className="space-y-6">
          {outfit.headsup && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block mb-0.5">Heads Up</span>
                <p className="text-xs text-amber-200/90 leading-relaxed">{outfit.headsup}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clothing & Layering */}
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Shirt className="w-4 h-4" /> Recommended Apparel
              </h4>
              <p className="text-xs text-slate-300 font-medium italic">"{outfit.summary}"</p>

              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Inner & Mid Layers</span>
                  <ul className="space-y-1">
                    {outfit.layers.map((layer, idx) => (
                      <li key={idx} className="text-xs text-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{layer}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Outerwear</span>
                  <p className="text-xs text-slate-200 font-medium bg-[#1E293B] p-2.5 rounded-xl border border-[#334155]">
                    {outfit.outerwear}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Footwear</span>
                  <p className="text-xs text-slate-200 font-medium bg-[#1E293B] p-2.5 rounded-xl border border-[#334155]">
                    {outfit.footwear}
                  </p>
                </div>
              </div>
            </div>

            {/* Accessories Checklist */}
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Umbrella className="w-4 h-4" /> Essential Gear Checklist
              </h4>

              {outfit.accessories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {outfit.accessories.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="p-1 rounded bg-blue-500/20 text-blue-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No special accessories required for current conditions.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI EXECUTIVE BRIEFING */}
      {activeTab === 'ai-brief' && (
        <div id="tab-ai-brief" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Gemini Meteorological Intelligence</span>
            </div>
            <button
              type="button"
              onClick={fetchBriefing}
              disabled={isLoadingBriefing}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoadingBriefing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Re-synthesize Brief
                </>
              )}
            </button>
          </div>

          {isLoadingBriefing && (
            <div className="p-8 text-center bg-[#0F172A] rounded-2xl border border-[#1E293B] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-sm font-medium text-slate-300">Analyzing atmospheric conditions & generating AI brief...</p>
            </div>
          )}

          {briefingError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
              <span>{briefingError}</span>
              <button type="button" onClick={fetchBriefing} className="underline font-bold hover:text-white">Retry</button>
            </div>
          )}

          {!isLoadingBriefing && briefing && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-blue-500/20 shadow-lg">
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Executive Summary</h4>
                <p className="text-sm text-slate-100 font-medium leading-relaxed">{briefing.summary}</p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {briefing.highlights.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Outdoor Advice & Clothing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-xs font-bold text-blue-400 block mb-1">Outdoor & Event Strategy</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{briefing.outdoorAdvice}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-xs font-bold text-amber-400 block mb-1">AI Wardrobe Advice</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{briefing.clothingTip}</p>
                </div>
              </div>

              {briefing.travelWarning && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{briefing.travelWarning}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INTERACTIVE AI CHAT ASSISTANT */}
      {activeTab === 'ai-chat' && (
        <div id="tab-ai-chat" className="flex flex-col h-96 bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-[#1E293B] text-slate-200 border border-[#334155] rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{msg.timestamp}</span>
              </div>
            ))}

            {isSendingChat && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>AI evaluating weather conditions...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-3 bg-[#0A0C10] border-t border-[#1E293B] flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about clothing, sports, commute, or plans..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-full bg-[#1E293B] text-slate-100 placeholder-slate-400 border border-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isSendingChat}
              className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
