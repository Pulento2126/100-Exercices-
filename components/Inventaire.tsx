
import React, { useState } from 'react';
import { CatalogueItem } from '../types';
import { formatDate } from '../constants';

interface InventaireProps {
  catalogue: CatalogueItem[];
}

const Inventaire: React.FC<InventaireProps> = ({ catalogue }) => {
  const [search, setSearch] = useState('');

  const filtered = catalogue.filter(item =>
    item.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Inventaire ({filtered.length} matériel{filtered.length > 1 ? 's' : ''})
        </h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Rechercher un matériel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-cardBorder rounded-xl px-4 py-2.5 text-white placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
          <svg className="absolute right-3 top-3 w-4 h-4 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-secondary border border-cardBorder rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-textMuted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          <p className="text-textMuted text-lg">Aucun matériel trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(item => {
            const isAlert = item.quantiteDisponible <= item.seuilAlerte;
            return (
              <div
                key={item.id}
                className={`bg-secondary rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] ${
                  isAlert ? 'border-danger/60 shadow-danger/20 shadow-md' : 'border-cardBorder'
                }`}
              >
                <div className="relative">
                  <img
                    src={item.photo}
                    alt={item.nom}
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="176" fill="%231e293b"><rect width="300" height="176"/><text x="150" y="92" text-anchor="middle" fill="%2394a3b8" font-size="14">Pas de photo</text></svg>';
                    }}
                  />
                  {isAlert && (
                    <div className="absolute top-2 right-2 bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                      STOCK BAS
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-white text-base truncate mb-2">{item.nom}</h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-textMuted text-xs">Stocké le {formatDate(item.dateStockage)}</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-textMuted text-xs block">Disponible</span>
                      <span className={`text-2xl font-bold ${isAlert ? 'text-danger' : 'text-success'}`}>
                        {item.quantiteDisponible}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-textMuted text-xs block">Seuil</span>
                      <span className="text-lg font-semibold text-textMuted">{item.seuilAlerte}</span>
                    </div>
                  </div>

                  {isAlert && (
                    <div className="mt-3 bg-danger/10 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-danger flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        <span className="text-danger text-xs font-semibold">
                          Réapprovisionner !
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inventaire;
