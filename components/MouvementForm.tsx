
import React, { useState } from 'react';
import { CatalogueItem, HistoriqueEntry } from '../types';
import { generateId } from '../constants';

interface MouvementFormProps {
  catalogue: CatalogueItem[];
  onSubmit: (entry: HistoriqueEntry) => void;
}

const MouvementForm: React.FC<MouvementFormProps> = ({ catalogue, onSubmit }) => {
  const [materielId, setMaterielId] = useState('');
  const [typeAction, setTypeAction] = useState<'Sortie chantier' | 'Retour stock'>('Sortie chantier');
  const [quantite, setQuantite] = useState('');
  const [nomEmprunteur, setNomEmprunteur] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedMateriel = catalogue.find(m => m.id === materielId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!materielId) {
      setError('Veuillez sélectionner un matériel.');
      return;
    }
    const qty = parseInt(quantite, 10);
    if (!qty || qty <= 0) {
      setError('Veuillez entrer une quantité valide (supérieure à 0).');
      return;
    }
    if (!nomEmprunteur.trim()) {
      setError("Veuillez entrer le nom de l'emprunteur.");
      return;
    }

    if (typeAction === 'Sortie chantier' && selectedMateriel && qty > selectedMateriel.quantiteDisponible) {
      setError(`Stock insuffisant. Seulement ${selectedMateriel.quantiteDisponible} disponible(s).`);
      return;
    }

    const entry: HistoriqueEntry = {
      id: generateId(),
      materielId,
      typeAction,
      quantite: qty,
      dateHeure: new Date().toISOString(),
      nomEmprunteur: nomEmprunteur.trim(),
    };

    onSubmit(entry);
    setSuccess(`Mouvement enregistré : ${typeAction} de ${qty} x "${selectedMateriel?.nom}"`);
    setMaterielId('');
    setQuantite('');
    setNomEmprunteur('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        Enregistrer un Mouvement
      </h2>

      <form onSubmit={handleSubmit} className="bg-secondary rounded-xl border border-cardBorder p-6 space-y-5">
        {/* Type d'action */}
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Type d'action</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTypeAction('Sortie chantier')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                typeAction === 'Sortie chantier'
                  ? 'bg-danger/20 border-danger text-danger'
                  : 'bg-primary border-cardBorder text-textMuted hover:border-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sortie chantier
            </button>
            <button
              type="button"
              onClick={() => setTypeAction('Retour stock')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                typeAction === 'Retour stock'
                  ? 'bg-success/20 border-success text-success'
                  : 'bg-primary border-cardBorder text-textMuted hover:border-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              Retour stock
            </button>
          </div>
        </div>

        {/* Matériel */}
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Matériel</label>
          <select
            value={materielId}
            onChange={(e) => setMaterielId(e.target.value)}
            className="w-full bg-primary border border-cardBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">-- Sélectionner un matériel --</option>
            {catalogue.map(item => (
              <option key={item.id} value={item.id}>
                {item.nom} (Stock: {item.quantiteDisponible})
              </option>
            ))}
          </select>
        </div>

        {/* Quantité */}
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Quantité</label>
          <input
            type="number"
            min="1"
            max={typeAction === 'Sortie chantier' && selectedMateriel ? selectedMateriel.quantiteDisponible : undefined}
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            placeholder="Ex: 5"
            className="w-full bg-primary border border-cardBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {typeAction === 'Sortie chantier' && selectedMateriel && (
            <p className="text-xs text-textMuted mt-1">
              Maximum disponible : {selectedMateriel.quantiteDisponible}
            </p>
          )}
        </div>

        {/* Nom emprunteur */}
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Nom de l'emprunteur</label>
          <input
            type="text"
            value={nomEmprunteur}
            onChange={(e) => setNomEmprunteur(e.target.value)}
            placeholder="Ex: Jean Dupont"
            className="w-full bg-primary border border-cardBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-danger/10 border border-danger/40 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-danger flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <span className="text-danger text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-success/10 border border-success/40 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="text-success text-sm">{success}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-accent hover:bg-accentDark text-primary font-bold py-3 px-6 rounded-xl transition-all text-base flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Enregistrer le mouvement
        </button>
      </form>
    </div>
  );
};

export default MouvementForm;
