
export interface CatalogueItem {
  id: string;
  nom: string;
  photo: string; // URL or base64 data URI
  dateStockage: string; // ISO date string (YYYY-MM-DD)
  quantiteDisponible: number;
  seuilAlerte: number;
}

export interface HistoriqueEntry {
  id: string;
  materielId: string; // Foreign key to CatalogueItem.id
  typeAction: 'Sortie chantier' | 'Retour stock';
  quantite: number;
  dateHeure: string; // ISO datetime string
  nomEmprunteur: string;
}

export type ViewType = 'dashboard' | 'inventaire' | 'mouvement' | 'ajouter';
