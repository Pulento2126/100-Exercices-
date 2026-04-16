
import React from 'react';
import { CatalogueItem, HistoriqueEntry } from '../types';
import { formatDate, formatDateTime } from '../constants';

interface DashboardProps {
  catalogue: CatalogueItem[];
  historique: HistoriqueEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ catalogue, historique }) => {
  const alertItems = catalogue.filter(item => item.quantiteDisponible <= item.seuilAlerte);
  const totalItems = catalogue.reduce((sum, item) => sum + item.quantiteDisponible, 0);
  const recentActions = [...historique].sort(
    (a, b) => new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime()
  ).slice(0, 5);

  const getMaterielNom = (id: string) => catalogue.find(m => m.id === id)?.nom ?? 'Inconnu';

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-secondary rounded-xl p-5 border border-cardBorder">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-info/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <span className="text-textMuted text-sm">Total Matériels</span>
          </div>
          <span className="text-3xl font-bold text-white">{catalogue.length}</span>
        </div>

        <div className="bg-secondary rounded-xl p-5 border border-cardBorder">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-textMuted text-sm">Stock Total</span>
          </div>
          <span className="text-3xl font-bold text-white">{totalItems}</span>
        </div>

        <div className="bg-secondary rounded-xl p-5 border border-cardBorder">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-danger/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <span className="text-textMuted text-sm">Alertes Stock</span>
          </div>
          <span className="text-3xl font-bold text-danger">{alertItems.length}</span>
        </div>

        <div className="bg-secondary rounded-xl p-5 border border-cardBorder">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-textMuted text-sm">Mouvements</span>
          </div>
          <span className="text-3xl font-bold text-white">{historique.length}</span>
        </div>
      </div>

      {/* Alert Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          Alertes de Stock Bas
        </h2>

        {alertItems.length === 0 ? (
          <div className="bg-success/10 border border-success/30 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-success mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-success font-semibold text-lg">Tout est en ordre !</p>
            <p className="text-textMuted text-sm mt-1">Aucun matériel en dessous du seuil d'alerte.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertItems.map(item => (
              <div
                key={item.id}
                className="bg-danger/10 border border-danger/40 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-danger/15"
              >
                <img
                  src={item.photo}
                  alt={item.nom}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border-2 border-danger/50"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="%23475569"><rect width="64" height="64" rx="8"/><text x="32" y="36" text-anchor="middle" fill="%2394a3b8" font-size="10">Photo</text></svg>'; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg truncate">{item.nom}</h3>
                  <p className="text-sm text-textMuted">Stocké le {formatDate(item.dateStockage)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-danger">{item.quantiteDisponible}</div>
                  <div className="text-xs text-textMuted">Seuil : {item.seuilAlerte}</div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1 bg-danger text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    ALERTE
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Activité Récente
        </h2>

        {recentActions.length === 0 ? (
          <div className="bg-secondary border border-cardBorder rounded-xl p-6 text-center">
            <p className="text-textMuted">Aucune activité enregistrée.</p>
          </div>
        ) : (
          <div className="bg-secondary border border-cardBorder rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/50 text-textMuted uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3">Matériel</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Quantité</th>
                  <th className="px-4 py-3">Emprunteur</th>
                  <th className="px-4 py-3">Date / Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {recentActions.map(entry => (
                  <tr key={entry.id} className="hover:bg-primary/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{getMaterielNom(entry.materielId)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        entry.typeAction === 'Sortie chantier'
                          ? 'bg-danger/20 text-dangerLight'
                          : 'bg-success/20 text-successLight'
                      }`}>
                        {entry.typeAction === 'Sortie chantier' ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        )}
                        {entry.typeAction}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{entry.quantite}</td>
                    <td className="px-4 py-3 text-textMuted">{entry.nomEmprunteur}</td>
                    <td className="px-4 py-3 text-textMuted text-xs">{formatDateTime(entry.dateHeure)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
