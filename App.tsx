
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventaire from './components/Inventaire';
import MouvementForm from './components/MouvementForm';
import AjouterMateriel from './components/AjouterMateriel';
import { ViewType, CatalogueItem, HistoriqueEntry } from './types';
import { loadCatalogue, saveCatalogue, loadHistorique, saveHistorique } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>(loadCatalogue);
  const [historique, setHistorique] = useState<HistoriqueEntry[]>(loadHistorique);

  const alertCount = catalogue.filter(item => item.quantiteDisponible <= item.seuilAlerte).length;

  const handleMouvement = useCallback((entry: HistoriqueEntry) => {
    // Add to historique
    const newHistorique = [entry, ...historique];
    setHistorique(newHistorique);
    saveHistorique(newHistorique);

    // Update catalogue quantity
    const newCatalogue = catalogue.map(item => {
      if (item.id === entry.materielId) {
        const newQty = entry.typeAction === 'Sortie chantier'
          ? item.quantiteDisponible - entry.quantite
          : item.quantiteDisponible + entry.quantite;
        return { ...item, quantiteDisponible: Math.max(0, newQty) };
      }
      return item;
    });
    setCatalogue(newCatalogue);
    saveCatalogue(newCatalogue);
  }, [catalogue, historique]);

  const handleAjouterMateriel = useCallback((item: CatalogueItem) => {
    const newCatalogue = [...catalogue, item];
    setCatalogue(newCatalogue);
    saveCatalogue(newCatalogue);
  }, [catalogue]);

  return (
    <div className="min-h-screen font-sans">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        alertCount={alertCount}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard catalogue={catalogue} historique={historique} />
        )}
        {currentView === 'inventaire' && (
          <Inventaire catalogue={catalogue} />
        )}
        {currentView === 'mouvement' && (
          <MouvementForm catalogue={catalogue} onSubmit={handleMouvement} />
        )}
        {currentView === 'ajouter' && (
          <AjouterMateriel onSubmit={handleAjouterMateriel} />
        )}
      </main>

      <footer className="py-8 text-center text-textMuted text-sm border-t border-gray-800 mt-12">
        <p>GestoStock - Gestion de Matériel de Bâtiment</p>
      </footer>
    </div>
  );
};

export default App;
