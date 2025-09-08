export interface MakeupItem {
  id: string;
  name: string;
  brand: string;
  type: string;
  shade: string;
  purchaseDate: string;
  price: number;
  acquisitionPrice: number;
  wasGift: boolean;
  notes: string;
}

export const MAKEUP_TYPES = [
  'Base',
  'Corretivo',
  'Pó',
  'Blush',
  'Bronzer',
  'Highlighter',
  'Batom',
  'Gloss',
  'Lápis de Boca',
  'Rímel',
  'Delineador',
  'Lápis de Olho',
  'Sombra',
  'Primer',
  'Fixador',
  'Outros'
] as const;