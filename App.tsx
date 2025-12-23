
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Pyramid from './components/Pyramid';
import AnalysisCharts from './components/AnalysisCharts';
import ExerciseTable from './components/ExerciseTable';
import AssistantAI from './components/AssistantAI';
import { ALL_EXERCISES, LEVELS } from './constants';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = useMemo(() => {
    if (!searchTerm.trim()) return ALL_EXERCISES;
    return ALL_EXERCISES.filter(ex => 
      ex.n.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const scrollToLevel = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-accent selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Pyramid & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <Pyramid onLevelClick={scrollToLevel} />
          </div>

          <div className="bg-secondary p-8 rounded-2xl shadow-2xl border border-gray-700 order-1 lg:order-2">
            <h3 className="text-3xl font-bold text-white mb-4 border-l-4 border-accent pl-4">Recherche & Navigation</h3>
            <p className="text-textMuted mb-6">
              Explorez les 100 exercices analysés scientifiquement. Filtrez par nom ou utilisez la pyramide pour accéder aux niveaux.
            </p>
            
            <div className="relative mb-8">
              <input 
                type="text" 
                placeholder="Chercher un exercice (ex: Rondo, Match...)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-primary border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <div className="absolute right-4 top-3.5 text-textMuted">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary p-4 rounded-xl text-center border border-gray-800">
                <span className="block text-3xl font-bold text-highlight">{filteredExercises.length}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">Résultats</span>
              </div>
              <div className="bg-primary p-4 rounded-xl text-center border border-gray-800">
                <span className="block text-3xl font-bold text-accent">5</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">Niveaux</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-20">
          <AnalysisCharts />
        </div>

        {/* Level Tables */}
        <div className="space-y-12">
          <h3 className="text-3xl font-bold text-white mb-10 border-l-4 border-danger pl-4">Catalogue Interactif</h3>
          
          {searchTerm.trim() ? (
            <div className="bg-secondary p-8 rounded-2xl border border-gray-700">
              <h4 className="text-xl font-bold text-white mb-6">Résultats de recherche pour "{searchTerm}"</h4>
              <div className="max-h-[600px] overflow-y-auto border border-gray-700 rounded-lg">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-primary text-gray-200 uppercase font-bold sticky top-0 z-10 shadow-md">
                    <tr>
                      <th className="px-4 py-3">Rang</th>
                      <th className="px-4 py-3">Exercice</th>
                      <th className="px-4 py-3">Niveau</th>
                      <th className="px-4 py-3">NE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredExercises.map((ex) => (
                      <tr key={ex.r} className="hover:bg-primary/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">#{ex.r}</td>
                        <td className="px-4 py-3 font-medium text-gray-300">{ex.n}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${LEVELS[ex.l-1].color}`}>
                            N{ex.l}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-white">{ex.ne.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            LEVELS.map(level => (
              <ExerciseTable 
                key={level.id} 
                level={level} 
                exercises={ALL_EXERCISES.filter(ex => ex.l === level.id)} 
              />
            ))
          )}
        </div>
      </main>

      <footer className="py-12 text-center text-textMuted text-sm border-t border-gray-800 mt-20">
        <p className="mb-2">Généré pour l'analyse méthodologique du Football.</p>
        <p className="font-mono text-[10px] uppercase tracking-tighter opacity-50">© 2024 SEIRUL-LO METHODOLOGY ENGINE</p>
      </footer>

      {/* Floating AI Assistant */}
      <AssistantAI />
    </div>
  );
};

export default App;
