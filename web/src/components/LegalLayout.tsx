import React from 'react';

export default function LegalLayout({ 
  title, 
  lastUpdated, 
  children 
}: { 
  title: string; 
  lastUpdated: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-[#05050A] text-white p-6 md:p-20 font-light leading-relaxed">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4 border-b border-white/10 pb-12">
          <div className="text-[#FFB300] text-xs font-bold tracking-[0.3em] uppercase">Legal Documentation</div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">{title}</h1>
          <p className="text-white/40 text-sm italic">Last Updated: {lastUpdated}</p>
        </header>
        
        <div className="prose prose-invert prose-amber max-w-none">
          {children}
        </div>

        <footer className="pt-20 border-t border-white/5 text-center">
            <a href="/" className="text-[#FFB300] hover:underline text-sm uppercase tracking-widest font-bold">Return to Main Site</a>
        </footer>
      </div>
    </div>
  );
}
