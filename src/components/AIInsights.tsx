import React, { useState } from 'react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/aiService';
import { Sparkles, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  transactions: Transaction[];
}

export const AIInsights: React.FC<Props> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(transactions, lang);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg text-white p-6 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-white opacity-10"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-white opacity-10"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Sparkles className="text-yellow-300" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Wise AI Advisor</h3>
              <p className="text-indigo-200 text-sm">Personalized financial wisdom</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
                onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all backdrop-blur-sm font-medium"
            >
                {lang === 'en' ? 'عربي' : 'English'}
            </button>
          </div>
        </div>

        {advice ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 text-sm leading-relaxed border border-white/10 shadow-inner min-h-[100px]">
            <div className="prose prose-invert prose-sm max-w-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-6 mb-4 text-center border border-white/10 border-dashed flex flex-col items-center justify-center min-h-[120px]">
             <Sparkles className="text-white/30 mb-2" size={32} />
             <p className="text-indigo-200">
                {lang === 'ar' ? "اضغط على زر التحليل للحصول على نصائح ذكية" : "Tap analyze to unlock financial wisdom"}
             </p>
          </div>
        )}

        <button 
          onClick={fetchAdvice} 
          disabled={loading}
          className="w-full bg-white text-indigo-700 font-bold py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? (
            <>
              <RefreshCcw className="animate-spin" size={20} />
              <span>{lang === 'ar' ? "جاري التفكير..." : "Thinking..."}</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>{lang === 'ar' ? "تحليل ميزانيتي" : "Analyze My Budget"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
