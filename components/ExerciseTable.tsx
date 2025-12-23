
import React from 'react';
import { LevelMetadata, Exercise } from '../types';

interface ExerciseTableProps {
  level: LevelMetadata;
  exercises: Exercise[];
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({ level, exercises }) => {
  const borderClass = level.color.replace('bg-', 'border-t-4 border-');
  const textClass = level.color.replace('bg-', 'text-');

  return (
    <div id={`level-${level.id}`} className={`bg-secondary rounded-xl overflow-hidden shadow-xl ${borderClass} scroll-mt-24`}>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h4 className={`text-2xl font-bold ${textClass}`}>{level.id}. {level.name} ({exercises.length} Ex)</h4>
          <span className={`px-3 py-1 bg-opacity-20 ${level.color} ${textClass} rounded-full text-sm font-bold`}>
            NE: {level.range}
          </span>
        </div>
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
          {level.description}
        </p>
        
        <div className="max-h-96 overflow-y-auto border border-gray-700 rounded-lg">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-primary text-gray-200 uppercase font-bold sticky top-0 z-10 shadow-md">
              <tr>
                <th className="px-4 py-3">Rang</th>
                <th className="px-4 py-3">Exercice</th>
                <th className="px-4 py-3">NE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {exercises.map((ex) => (
                <tr key={ex.r} className="hover:bg-primary/50 transition-colors group">
                  <td className="px-4 py-3 border-b border-gray-800 text-gray-500 font-mono text-xs">#{ex.r}</td>
                  <td className="px-4 py-3 border-b border-gray-800 font-medium text-gray-300 group-hover:text-white">{ex.n}</td>
                  <td className="px-4 py-3 border-b border-gray-800 font-bold text-white">{ex.ne.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTable;
