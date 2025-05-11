"use client";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

function getDemographicsData() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("skinstric-demographics");
    if (data) return JSON.parse(data);
  }
  return null;
}

export default function SummaryPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(getDemographicsData());
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-y-auto flex flex-col">
      <Header />
      {/* Top left info text */}
      <div className="absolute left-8 top-12 text-left z-20">
        <div className="text-black font-bold text-base mb-1">A.I. ANALYSIS</div>
        <div className="text-black font-black text-5xl leading-none mb-2 mt-2">DEMOGRAPHICS</div>
        <div className="text-gray-500 text-xs font-light leading-tight">PREDICTED RACE & AGE</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-start pt-48 pb-32">
        <div className="w-full flex items-center justify-center">
          <DemographicsSummary data={data} />
        </div>
      </div>
      {/* Bottom left BackButton */}
      <div className="fixed left-8 bottom-8 z-20">
        <BackButton />
      </div>
    </div>
  );
}

function DemographicsSummary({ data }: { data: any }) {
  const [selected, setSelected] = useState<'race' | 'age' | 'gender'>('race');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Reset selected item when category changes
  useEffect(() => {
    setSelectedItem(null);
  }, [selected]);

  if (!data || !data.race || !data.age || !data.gender) {
    return <div className="text-red-500">AI analysis data is missing or incomplete. Please try again.</div>;
  }

  // Helper to get primary value and confidence for a category
  function getPrimary(obj: Record<string, number>) {
    let maxKey = '';
    let maxVal = -Infinity;
    for (const k in obj) {
      if (obj[k] > maxVal) {
        maxKey = k;
        maxVal = obj[k];
      }
    }
    return { key: maxKey, value: maxVal };
  }

  const categories = {
    race: data.race,
    age: data.age,
    gender: data.gender,
  };
  const labels = {
    race: 'RACE',
    age: 'AGE',
    gender: 'SEX',
  };
  
  const primary = getPrimary(categories[selected]);
  const displayItem = selectedItem || primary.key;
  const displayValue = selectedItem ? categories[selected][selectedItem] : primary.value;

  return (
    <div className="w-[90%] max-w-[1400px] flex flex-row gap-8 h-[600px]">
      {/* Left: category selection */}
      <div className="flex flex-col gap-2 w-48">
        {(['race', 'age', 'gender'] as const).map(cat => {
          const p = getPrimary(categories[cat]);
          const isSelected = selected === cat;
          return (
            <button
              key={cat}
              className={`text-left p-4 border-t border-black focus:outline-none ${isSelected ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setSelected(cat)}
            >
              <div className="text-lg font-medium capitalize">{p.key}</div>
              <div className="text-xs font-light uppercase">{labels[cat]}</div>
            </button>
          );
        })}
      </div>
      {/* Middle: confidence circle */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 border-t border-black">
        <div className="text-2xl font-light mb-8 capitalize">{displayItem}</div>
        <div className="flex items-center justify-center">
          <ConfidenceCircle percent={Math.round(displayValue * 100)} />
        </div>
      </div>
      {/* Right: confidence list */}
      <div className="w-64 bg-gray-100 p-6 border-t border-black overflow-y-auto">
        <div className="flex justify-between mb-2 sticky top-0 bg-gray-100 py-2">
          <span className="text-xs font-semibold uppercase">{labels[selected]}</span>
          <span className="text-xs font-semibold uppercase">A.I. CONFIDENCE</span>
        </div>
        <div className="flex flex-col gap-1">
          {Object.entries(categories[selected] as Record<string, number>)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => (
              <button
                key={k}
                onClick={() => setSelectedItem(k === selectedItem ? null : k)}
                className={`flex justify-between items-center px-2 py-1 w-full text-left hover:bg-gray-200 transition-colors ${
                  k === displayItem ? 'bg-black text-white hover:bg-black' : ''
                }`}
              >
                <span className="capitalize">{k}</span>
                <span>{Math.round(v * 100)} %</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function ConfidenceCircle({ percent }: { percent: number }) {
  // Simple SVG circle for now
  const r = 140;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <svg width={320} height={320}>
      <circle cx={160} cy={160} r={r} stroke="#e5e5e5" strokeWidth={4} fill="none" />
      <circle
        cx={160}
        cy={160}
        r={r}
        stroke="#111"
        strokeWidth={4}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        style={{ transition: 'stroke-dashoffset 0.6s' }}
      />
      <text x="160" y="180" textAnchor="middle" fontSize="64" fill="#111">{pct}<tspan fontSize="32">%</tspan></text>
    </svg>
  );
}