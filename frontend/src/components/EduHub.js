import React, { useState, useEffect } from 'react';
import { PlayCircle, WifiOff, BookOpen } from 'lucide-react';

const EduHub = () => {
  const [content, setContent] = useState([]);
  const [lowDataMode, setLowDataMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/education?lowDataMode=${lowDataMode}`)
      .then(res => res.json())
      .then(data => {
        // Map backend fields to what the UI expects
        const mapped = data.map(item => ({
          ...item,
          description: item.content, // backend stores it as 'content'
          type: item.type || 'article'
        }));
        setContent(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load educational content', err);
        setLoading(false);
      });
  }, [lowDataMode]);

  const displayedContent = lowDataMode ? content.filter(c => c.isLowData) : content;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-surface-200 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Education Hub</h2>
          <p className="text-slate-500 text-sm mt-1">Learn how to master your metabolism</p>
        </div>
        <div className="flex items-center space-x-3 bg-surface-50 px-4 py-2 rounded-xl border border-surface-200">
          <WifiOff size={18} className={lowDataMode ? 'text-brand' : 'text-slate-400'} />
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={lowDataMode}
                onChange={() => setLowDataMode(!lowDataMode)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${lowDataMode ? 'bg-brand' : 'bg-slate-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${lowDataMode ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-semibold text-slate-700">Low Data Mode</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="p-5 border border-surface-200 rounded-xl bg-surface-50 animate-pulse">
              <div className="h-5 bg-surface-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedContent.map(item => (
            <div key={item.id} className="group p-5 border border-surface-200 rounded-xl hover:shadow-md hover:border-brand/30 transition-all duration-300 bg-white">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 p-2 bg-brand-light text-brand rounded-lg group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  {item.type === 'video' ? <PlayCircle size={20} /> : <BookOpen size={20} />}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand transition-colors">{item.title}</h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
          {displayedContent.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 bg-surface-50 rounded-xl border border-dashed border-surface-300">
              No content available for the selected mode.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EduHub;
