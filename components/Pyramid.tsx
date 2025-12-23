
import React from 'react';
import { LEVELS } from '../constants';
import { LevelMetadata } from '../types';

interface PyramidProps {
  onLevelClick: (id: string) => void;
}

const Pyramid: React.FC<PyramidProps> = ({ onLevelClick }) => {
  const widths = ['w-1/3', 'w-1/2', 'w-2/3', 'w-5/6', 'w-full'];

  return (
    <div className="flex flex-col items-center justify-center space-y-2 w-full max-w-md mx-auto">
      {LEVELS.map((level, idx) => (
        <button
          key={level.id}
          onClick={() => onLevelClick(`level-${level.id}`)}
          className={`${widths[idx]} h-16 ${level.color} flex items-center justify-center text-white font-bold shadow-lg rounded-sm pyramid-level relative group transition-transform hover:scale-105 active:scale-95`}
        >
          {level.id}. {level.name.split(' ')[1]}
          <span className="absolute right-[-140px] opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-textMuted font-mono whitespace-nowrap hidden md:block">
            NE: {level.range}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Pyramid;
