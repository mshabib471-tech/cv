import React from 'react';

export const AdminAnalytics: React.FC = () => {
  const bars = [
    { day: 'Monday', height: '55%', value: '11k' },
    { day: 'Tuesday', height: '62%', value: '12.5k' },
    { day: 'Wednesday', height: '48%', value: '9.6k' },
    { day: 'Thursday', height: '70%', value: '14k' },
    { day: 'Friday', height: '65%', value: '13k' },
    { day: 'Saturday', height: '85%', value: '17k' },
  ];

  const trafficSources = [
    { label: 'Direct', percentage: '45%' },
    { label: 'Social Media', percentage: '30%' },
    { label: 'Referral', percentage: '20%' },
    { label: 'Others', percentage: '15%' },
  ];

  const topProducts = [
    { product: 'Laptop', sales: '15', growth: '+ 6%' },
    { product: 'Headphones', sales: '20', growth: '+ 12%' },
    { product: 'Watch', sales: '80', growth: '+ 20%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Analytics
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
          Track your performance and growth.
        </p>
      </div>

      {/* 3 Metric Cards (Matches Screenshot 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#F5921E]/40 transition">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">
            Total Reveneu
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            $12,560
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
            <span>&uarr; 12%</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#F5921E]/40 transition">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">
            TotalOrders
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            $460
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
            <span>&uarr; 15%</span>
          </div>
        </div>

        {/* Card 3: Visitors */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#F5921E]/40 transition">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">
            Visitors
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            8,990
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
            <span>&uarr; 8%</span>
          </div>
        </div>
      </div>

      {/* Sales Overview Bar Chart (Matches Screenshot 3) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-6">
          Sales Overview
        </h2>

        <div className="relative h-60 w-full flex">
          {/* Y Axis labels */}
          <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 pr-4 pb-6 select-none">
            <span>20k</span>
            <span>15k</span>
            <span>10k</span>
            <span>5k</span>
            <span>0k</span>
          </div>

          {/* Bar Chart Area */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="relative flex-1 flex items-end justify-around border-b border-slate-100 pb-0">
              {/* Background horizontal guide lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="w-full border-b border-dashed border-slate-200" />
                <div className="w-full border-b border-dashed border-slate-200" />
                <div className="w-full border-b border-dashed border-slate-200" />
                <div className="w-full border-b border-dashed border-slate-200" />
              </div>

              {bars.map((bar, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center group w-10 sm:w-14">
                  <div
                    style={{ height: bar.height }}
                    className="w-7 sm:w-9 rounded-t-lg bg-[#F5921E] hover:bg-[#ea8615] transition-all duration-300 shadow-2xs group-hover:scale-y-105 origin-bottom"
                  />
                </div>
              ))}
            </div>

            {/* X Axis labels */}
            <div className="flex justify-around pt-3 text-[11px] font-medium text-slate-500">
              {bars.map((bar, idx) => (
                <span key={idx} className="w-10 sm:w-14 text-center">
                  {bar.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Traffic Source & Top Products (Matches Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card: Traffic Source */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-5">
            Traffic Source
          </h2>

          <div className="flex items-center justify-around gap-4 flex-wrap">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#FEEAD4"
                  strokeWidth="4.5"
                />
                {/* Direct 45% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#F5921E"
                  strokeWidth="4.5"
                  strokeDasharray="42.4 94.2"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Social Media 30% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#FB923C"
                  strokeWidth="4.5"
                  strokeDasharray="28.2 94.2"
                  strokeDashoffset="-42.4"
                />
                {/* Referral 20% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#FDBA74"
                  strokeWidth="4.5"
                  strokeDasharray="18.8 94.2"
                  strokeDashoffset="-70.6"
                />
              </svg>
            </div>

            {/* Traffic Legend */}
            <div className="space-y-2.5 min-w-[140px] text-xs">
              {trafficSources.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F5921E]" />
                    <span className="text-slate-600 font-medium">{source.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{source.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Top Products */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Top Products
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Sales</th>
                  <th className="pb-3 font-medium text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 font-medium text-slate-800">{prod.product}</td>
                    <td className="py-3.5 text-slate-600">{prod.sales}</td>
                    <td className="py-3.5 text-right font-bold text-emerald-600">
                      {prod.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
