import React, { useState } from 'react';
import {
  ChevronDown,
  TrendingUp,
  ArrowUpRight,
  Eye,
  ShoppingBag,
  Users,
  DollarSign,
  Percent,
} from 'lucide-react';

interface AdminHomeProps {
  adminName: string;
}

export const AdminHome: React.FC<AdminHomeProps> = ({ adminName }) => {
  const [dateRange, setDateRange] = useState('Last 6 days');

  const orders = [
    { customer: 'Ayesha Khan', product: 'Laptop', amount: '$450', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800' },
    { customer: 'Hina ali', product: 'Headphones', amount: '$89', status: 'Shipped', statusColor: 'bg-sky-100 text-sky-800' },
    { customer: 'Mujeeb akhtar', product: 'Watch', amount: '$50', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Good Morning, {adminName || 'Immi'}!
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* 4 Key Metric Cards (Matches Screenshot 4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Total Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#F5921E]/40 transition">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">
            Total Sales
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            $12,560
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 mt-1">
            <span>&uarr; 12%</span>
          </div>
        </div>

        {/* Card 2: Total Users */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#F5921E]/40 transition">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">
            Total Users
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            8600
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 mt-1">
            <span>&uarr; 8%</span>
          </div>
        </div>

        {/* Card 3: New Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#F5921E]/40 transition">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">
            New Orders
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            480
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 mt-1">
            <span>&uarr; 15%</span>
          </div>
        </div>

        {/* Card 4: Conversion rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#F5921E]/40 transition">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block">
            Conversion rate
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            4.8%
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 mt-1">
            <span>&uarr; 2%</span>
          </div>
        </div>
      </div>

      {/* Sales Overview Area Chart (Matches Screenshot 4) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Sales Overview
          </h2>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-7 focus:outline-none cursor-pointer hover:bg-slate-100 transition"
            >
              <option>Last 6 days</option>
              <option>Last 14 days</option>
              <option>Last 30 days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Responsive Custom Vector Chart */}
        <div className="relative h-56 sm:h-64 w-full">
          {/* Y Axis Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-slate-400 font-medium pointer-events-none pb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">20k</span>
              <div className="flex-1 border-b border-slate-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">15k</span>
              <div className="flex-1 border-b border-slate-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">10k</span>
              <div className="flex-1 border-b border-slate-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">5k</span>
              <div className="flex-1 border-b border-slate-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right">0k</span>
              <div className="flex-1 border-b border-slate-100" />
            </div>
          </div>

          {/* SVG Smooth Area Curve */}
          <div className="absolute inset-0 pl-8 pb-6 pt-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="sales-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5921E" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#FB923C" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FFF9F3" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Gradient Area */}
              <path
                d="M 10 140 Q 60 120, 100 135 T 200 130 T 260 100 T 320 130 T 400 110 T 490 60 L 490 150 L 10 150 Z"
                fill="url(#sales-gradient)"
              />
              {/* Main Line */}
              <path
                d="M 10 140 Q 60 120, 100 135 T 200 130 T 260 100 T 320 130 T 400 110 T 490 60"
                fill="none"
                stroke="#F5921E"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Data points */}
              <circle cx="10" cy="140" r="3.5" fill="#F5921E" />
              <circle cx="100" cy="135" r="3.5" fill="#F5921E" />
              <circle cx="200" cy="130" r="3.5" fill="#F5921E" />
              <circle cx="260" cy="100" r="3.5" fill="#F5921E" />
              <circle cx="320" cy="130" r="3.5" fill="#F5921E" />
              <circle cx="400" cy="110" r="3.5" fill="#F5921E" />
              <circle cx="490" cy="60" r="4.5" fill="#F5921E" />
            </svg>
          </div>

          {/* X Axis Day Labels */}
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[11px] font-medium text-slate-500 pt-2">
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table (Matches Screenshot 4) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Recent Orders
          </h2>
          <button className="text-xs font-semibold text-slate-400 hover:text-[#F5921E] transition">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 font-medium text-slate-800">{ord.customer}</td>
                  <td className="py-3.5 text-slate-600">{ord.product}</td>
                  <td className="py-3.5 font-bold text-slate-800">{ord.amount}</td>
                  <td className="py-3.5 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${ord.statusColor}`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
