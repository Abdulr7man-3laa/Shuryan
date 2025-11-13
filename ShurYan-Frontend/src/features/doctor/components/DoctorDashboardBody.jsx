import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

/**
 * Doctor Dashboard Body Component
 * Displays statistics cards with trends and interactive elements
 * @component
 */
const DoctorDashboardBody = ({ stats, onStatClick }) => (
  <section className="mb-12" aria-labelledby="stats-heading">
    {/* Header */}
    <header className="text-center mb-8 sm:mb-10">
      <h1
        id="stats-heading"
        className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-3 sm:mb-4"
      >
        لوحة التحكم الطبية
      </h1>
      <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        نظرة شاملة على أداء عيادتك وإحصائيات المرضى اليومية
      </p>
    </header>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats?.map((stat) => (
        <article
          key={stat.id}
          className={`group relative bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-2xl ${stat.glowColor || ''} transition-all duration-500 cursor-pointer overflow-hidden`}
          onClick={() => onStatClick?.(stat)}
          role="button"
          tabIndex={0}
          aria-label={`${stat.label}: ${stat.value}${stat.unit || ''}`}
          onKeyDown={(e) => e.key === 'Enter' && onStatClick?.(stat)}
        >
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradientFrom || ''} ${stat.gradientTo || ''} rounded-full blur-3xl`}></div>
          </div>

          {/* Glossy overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          {/* Content */}
          <div className="relative">
            {/* Icon and Trend */}
            <div className="flex items-start justify-between mb-8">
              <div className={`relative p-4 bg-gradient-to-br ${stat.gradientFrom || ''} ${stat.gradientTo || ''} rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                {stat.icon && <stat.icon className="w-7 h-7 text-white relative z-10" />}
                {/* Icon glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradientFrom || ''} ${stat.gradientTo || ''} rounded-2xl blur-md opacity-50`}></div>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm ${
                stat.trendUp
                  ? 'bg-emerald-50/80 text-emerald-600 border border-emerald-100'
                  : 'bg-red-50/80 text-red-600 border border-red-100'
              }`}>
                {stat.trendUp ? (
                  <FaArrowUp className="w-3 h-3" />
                ) : (
                  <FaArrowDown className="w-3 h-3" />
                )}
                <span>{stat.trend}</span>
              </div>
            </div>

            {/* Value */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-800 tracking-tight">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-xl font-semibold text-slate-500">
                    {stat.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Label and Description */}
            <div className="space-y-1">
              <h3 className="text-slate-800 font-bold text-base">
                {stat.label}
              </h3>
              <p className="text-slate-500 text-sm">
                {stat.description}
              </p>
            </div>
          </div>

          {/* Premium bottom accent */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradientFrom || ''} ${stat.gradientTo || ''} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        </article>
      ))}
    </div>
  </section>
);

export default DoctorDashboardBody;
