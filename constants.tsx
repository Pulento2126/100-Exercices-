
import { CatalogueItem, HistoriqueEntry } from './types';

export const INITIAL_CATALOGUE: CatalogueItem[] = [
  {
    id: 'mat-001',
    nom: 'Perceuse sans fil',
    photo: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop',
    dateStockage: '2024-01-15',
    quantiteDisponible: 3,
    seuilAlerte: 2,
  },
  {
    id: 'mat-002',
    nom: 'Marteau piqueur',
    photo: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop',
    dateStockage: '2024-02-10',
    quantiteDisponible: 1,
    seuilAlerte: 2,
  },
  {
    id: 'mat-003',
    nom: 'Sacs de ciment (50kg)',
    photo: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=300&h=300&fit=crop',
    dateStockage: '2024-03-05',
    quantiteDisponible: 25,
    seuilAlerte: 10,
  },
  {
    id: 'mat-004',
    nom: 'Casques de chantier',
    photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop',
    dateStockage: '2024-01-20',
    quantiteDisponible: 8,
    seuilAlerte: 5,
  },
  {
    id: 'mat-005',
    nom: 'Echafaudage tubulaire',
    photo: 'https://images.unsplash.com/photo-1590644365607-1c5e64559e32?w=300&h=300&fit=crop',
    dateStockage: '2024-04-01',
    quantiteDisponible: 2,
    seuilAlerte: 3,
  },
  {
    id: 'mat-006',
    nom: 'Niveau laser',
    photo: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=300&h=300&fit=crop',
    dateStockage: '2024-03-15',
    quantiteDisponible: 4,
    seuilAlerte: 2,
  },
  {
    id: 'mat-007',
    nom: 'Brouette de chantier',
    photo: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
    dateStockage: '2024-02-28',
    quantiteDisponible: 5,
    seuilAlerte: 3,
  },
  {
    id: 'mat-008',
    nom: 'Disqueuse 230mm',
    photo: 'https://images.unsplash.com/photo-1530124566582-a45a7e3f2039?w=300&h=300&fit=crop',
    dateStockage: '2024-05-10',
    quantiteDisponible: 1,
    seuilAlerte: 2,
  },
];

export const INITIAL_HISTORIQUE: HistoriqueEntry[] = [
  {
    id: 'hist-001',
    materielId: 'mat-002',
    typeAction: 'Sortie chantier',
    quantite: 1,
    dateHeure: '2024-06-10T08:30:00',
    nomEmprunteur: 'Jean Dupont',
  },
  {
    id: 'hist-002',
    materielId: 'mat-003',
    typeAction: 'Sortie chantier',
    quantite: 10,
    dateHeure: '2024-06-11T09:00:00',
    nomEmprunteur: 'Marie Martin',
  },
  {
    id: 'hist-003',
    materielId: 'mat-005',
    typeAction: 'Sortie chantier',
    quantite: 1,
    dateHeure: '2024-06-12T07:45:00',
    nomEmprunteur: 'Pierre Lefevre',
  },
];

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STORAGE_KEY_CATALOGUE = 'gestostock_catalogue';
const STORAGE_KEY_HISTORIQUE = 'gestostock_historique';

export function loadCatalogue(): CatalogueItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CATALOGUE);
    if (data) return JSON.parse(data);
  } catch {}
  return INITIAL_CATALOGUE;
}

export function saveCatalogue(items: CatalogueItem[]): void {
  localStorage.setItem(STORAGE_KEY_CATALOGUE, JSON.stringify(items));
}

export function loadHistorique(): HistoriqueEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_HISTORIQUE);
    if (data) return JSON.parse(data);
  } catch {}
  return INITIAL_HISTORIQUE;
}

export function saveHistorique(entries: HistoriqueEntry[]): void {
  localStorage.setItem(STORAGE_KEY_HISTORIQUE, JSON.stringify(entries));
}
