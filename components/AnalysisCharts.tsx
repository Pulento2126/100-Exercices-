
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Area, AreaChart 
} from 'recharts';
import { ALL_EXERCISES, LEVELS } from '../constants';

const AnalysisCharts: React.FC = () => {
  const distributionData = LEVELS.map(level => ({
    name: level.name.replace('Niveau ', ''),
    count: ALL_EXERCISES.filter(ex => ex.l === level.id).length,
    color: level.color.includes('bg-danger') ? '#f43f5e' : 
           level.color.includes('bg-orange') ? '#f97316' :
           level.color.includes('bg-yellow') ? '#eab308' :
           level.color.includes('bg-accent') ? '#06b6d4' : '#64748b'
  }));

  const curveData = ALL_EXERCISES.map(ex => ({
    rank: ex.r,
    ne: ex.ne,
    name: ex.n
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-secondary p-3 border border-gray-700 rounded shadow-xl text-xs">
          <p className="font-bold text-white mb-1">{payload[0].payload.name || label}</p>
          <p className="text-accent">Valeur: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-white mb-4 border-l-4 border-highlight pl-4">Analyse Quantitative</h3>
          <p className="text-textMuted">Distribution des exercices par niveau et courbe de spécificité.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-secondary p-6 rounded-xl border border-gray-700 h-[400px]">
            <h4 className="text-lg font-bold text-white mb-6">Volume par Niveau</h4>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <circle key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-secondary p-6 rounded-xl border border-gray-700 h-[400px]">
            <h4 className="text-lg font-bold text-white mb-6">Courbe de Spécificité (100 Points)</h4>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={curveData}>
                <defs>
                  <linearGradient id="colorNe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="rank" stroke="#94a3b8" fontSize={10} hide />
                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ne" stroke="#06b6d4" fillOpacity={1} fill="url(#colorNe)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisCharts;
