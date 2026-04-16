
import React, { useState } from 'react';
import { CatalogueItem } from '../types';
import { generateId } from '../constants';

interface AjouterMaterielProps {
  onSubmit: (item: CatalogueItem) => void;
}

const AjouterMateriel: React.FC<AjouterMaterielProps> = ({ onSubmit }) => {
  const [nom, setNom] = useState('');
  const [photo, setPhoto] = useState('');
  const [dateStockage, setDateStockage] = useState(new Date().toISOString().split('T')[0]);
  const [quantite, setQuantite] = useState('');
  const [seuil, setSeuil] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('La taille de la photo ne doit pas dépasser 2 Mo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nom.trim()) {
      setError('Veuillez entrer le nom du matériel.');
      return;
    }
    const qty = parseInt(quantite, 10);
    if (isNaN(qty) || qty < 0) {
      setError('Veuillez entrer une quantité valide.');
      return;
    }
    const threshold = parseInt(seuil, 10);
    if (isNaN(threshold) || threshold < 0) {
      setError("Veuillez entrer un seuil d'alerte valide.");
      return;
    }

    const newItem: CatalogueItem = {
      id: generateId(),
      nom: nom.trim(),
      photo: photo || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="176" fill="%231e293b"><rect width="300" height="176"/><text x="150" y="92" text-anchor="middle" fill="%2394a3b8" font-size="14">Pas de photo</text></svg>',
      dateStockage,
      quantiteDisponible: qty,
      seuilAlerte: threshold,
    };

    onSubmit(newItem);
    setSuccess(`"${nom.trim()}" ajouté au catalogue avec succès !`);
    setNom('');
    setPhoto('');
    setDateStockage(new Date().toISOString().split('T')[0]);
    setQuantite('');
    setSeuil('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Ajouter un Matériel
      </h2>

      <form onSubmit={handleSubmit} className="bg-secondary rounded-xl border border-cardBorder p-6 space-y-5">
        {/* Nom */}
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Nom du matériel</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Perceuse sans fil"
            className="w-full bg-primary border border-cardBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Photo</label>
          <div className="flex items-center gap-4">
            {photo && (
              <img src={photo} alt="Aperçu" className="w-20 h-20 rounded-lg object-cover border border-cardBorder" />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full text-sm text-textMuted"
              />
              <p className="text-xs text-textMuted mt-1">Max 2 Mo. Formats : JPG, PNG, WEBP</p>
            </div>
          </div>
        </div>

        {/* Date de stockage */}
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Date de stockage</label>
          <input
            type="date"
            value={dateStockage}
            onChange={(e) => setDateStockage(e.target.value)}
            className="w-full bg-primary border border-cardBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Quantité et seuil */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Quantité disponible</label>
            <input
              type="number"
              min="0"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              placeholder="Ex: 10"
              className="w-full bg-primary border border-cardBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Seuil d'alerte</label>
            <input
              type="number"
              min="0"
              value={seuil}
              onChange={(e) => setSeuil(e.target.value)}
              placeholder="Ex: 3"
              className="w-full bg-primary border border-cardBorder rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
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
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Ajouter au catalogue
        </button>
      </form>
    </div>
  );
};

export default AjouterMateriel;
