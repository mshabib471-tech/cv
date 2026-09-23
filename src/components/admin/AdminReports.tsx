import React, { useState } from 'react';
import {
  Calendar,
  ArrowRight,
  Download,
  FileText,
  Users,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [fromDate, setFromDate] = useState('2026-09-15');
  const [toDate, setToDate] = useState('2026-09-22');
  const [thirdDate, setThirdDate] = useState('2026-09-22');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const reportItems = [
    { title: 'Sales report', subtitle: 'last 6 days', icon: TrendingUp },
    { title: 'User report', subtitle: 'last 6 days', icon: Users },
    { title: 'Sales report', subtitle: 'last 6 days', icon: FileText },
    { title: 'Sales report', subtitle: 'last 6 days', icon: BarChart2 },
  ];

  const handleDownloadQuickReport = (title: string) => {
    const csvContent =
      'Date,Category,Metric,Value\n' +
      '2026-09-17,Sales,Revenue,$2100\n' +
      '2026-09-18,Sales,Revenue,$2450\n' +
      '2026-09-19,Sales,Revenue,$1980\n' +
      '2026-09-20,Sales,Revenue,$2800\n' +
      '2026-09-21,Sales,Revenue,$3100\n' +
      '2026-09-22,Sales,Revenue,$3400\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_6days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessNotice(`${title} downloaded successfully!`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      handleDownloadQuickReport(`Business_Report_${fromDate}_to_${toDate}`);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Reports
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
          View and download your reports.
        </p>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Quick Reports Card (Matches Screenshot 2) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Quick Reports
          </h2>
          <button
            onClick={() => handleDownloadQuickReport('All_Quick_Reports')}
            className="px-4 py-1.5 rounded-full bg-[#F5921E] hover:bg-[#ea8615] text-white text-xs font-bold shadow-xs active:scale-95 transition"
          >
            Download
          </button>
        </div>

        {/* 2x2 Grid of Report items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {reportItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                onClick={() => handleDownloadQuickReport(item.title)}
                className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-[#F5921E]/60 hover:shadow-xs transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FEEAD4] flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-[#F5921E]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#F5921E] transition">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F5921E] group-hover:translate-x-0.5 transition" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Range Generator Card (Matches Screenshot 2) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-5">
          Quick Reports
        </h2>

        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* From Date */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                From
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-[#F5921E]/30 focus:border-[#F5921E]"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                To
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-[#F5921E]/30 focus:border-[#F5921E]"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Third Date Selector */}
          <div>
            <div className="relative">
              <input
                type="date"
                value={thirdDate}
                onChange={(e) => setThirdDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-[#F5921E]/30 focus:border-[#F5921E]"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-[#F5921E] hover:bg-[#ea8615] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#F5921E]/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating reports...</span>
              </>
            ) : (
              <span>Generate reports</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
