export type MarkFace = 'serif' | 'sans'

export type Film = {
  slug: string
  house: string
  /** Sub-brand line shown under the mark, e.g. N°5. Empty when the house name stands alone. */
  line: string
  product: string
  category: string
  location: string
  /** What this shot was actually built to prove. Written for a director, not a buyer. */
  craft: string
  face: MarkFace
  /** Extra letter-spacing in em for houses whose wordmark needs air. */
  track: number
  monogram?: 'chanel' | 'lv'
}

export const FILMS: Film[] = [
  {
    slug: 'chanel-n5',
    house: 'CHANEL',
    line: 'N°5',
    product: 'N°5 Eau de Parfum, 50 ml',
    category: 'Fragrance',
    location: 'Seoul · high-rise, rain, night',
    craft: 'Mist in motion, crystal geometry, and a departure two people actually cause.',
    face: 'sans',
    track: 0.26,
    monogram: 'chanel',
  },
  {
    slug: 'hermes-rouge',
    house: 'HERMÈS',
    line: 'Rouge',
    product: 'Rouge Hermès Satin, 21 Rose Épicé',
    category: 'Beauty',
    location: 'Studio · warm key, single source',
    craft: 'Satin colour on the lip and lacquered metal holding its edge in close.',
    face: 'serif',
    track: 0.14,
  },
  {
    slug: 'dior-lady',
    house: 'DIOR',
    line: 'Lady Dior',
    product: 'Medium Lady Dior, black Cannage lambskin',
    category: 'Leather goods',
    location: 'Seoul · hotel arrival',
    craft: 'Bag weight in the hand, Cannage geometry, charms that swing on their own.',
    face: 'serif',
    track: 0.2,
  },
  {
    slug: 'lv-ombres',
    house: 'LOUIS VUITTON',
    line: 'LV Ombres',
    product: 'LV Ombres eyeshadow palette',
    category: 'Beauty',
    location: 'Backstage · stage door, call time',
    craft: 'Eye detail at close range while the room runs on a real deadline.',
    face: 'sans',
    track: 0.14,
    monogram: 'lv',
  },
  {
    slug: 'maxmara-101801',
    house: 'MAX MARA',
    line: '101801',
    product: '101801 Icon Coat, camel',
    category: 'Ready-to-wear',
    location: 'Gallery · installation day',
    craft: 'Long-coat motion and silhouette held through a full walk.',
    face: 'sans',
    track: 0.18,
  },
  {
    slug: 'chanel-1112',
    house: 'CHANEL',
    line: '11.12',
    product: 'Classic 11.12, black lambskin, gold-tone metal',
    category: 'Leather goods',
    location: 'Conservatory · print archive',
    craft: 'Quilting, chain weight, and emotion that arrives from the task, not the camera.',
    face: 'sans',
    track: 0.26,
    monogram: 'chanel',
  },
  {
    slug: 'dior-lipglow',
    house: 'DIOR',
    line: 'Addict',
    product: 'Dior Addict Lip Glow, 001 Pink',
    category: 'Beauty',
    location: 'Penthouse · dusk, glass line',
    craft: 'Natural lip colour and a reflective case that survives the close-up.',
    face: 'serif',
    track: 0.2,
  },
  {
    slug: 'lamer-cream',
    house: 'LA MER',
    line: '',
    product: 'The Moisturizing Soft Cream',
    category: 'Skincare',
    location: 'Jeju · seaside suite',
    craft: 'Cream texture, white-jar typography, and light motivated by water.',
    face: 'serif',
    track: 0.22,
  },
  {
    slug: 'laprairie-caviar',
    house: 'LA PRAIRIE',
    line: 'Skin Caviar',
    product: 'Skin Caviar',
    category: 'Skincare',
    location: 'Studio · cyclorama, soft top light',
    craft: 'A still face carrying the shot, and cobalt glass reading clean against white.',
    face: 'serif',
    track: 0.16,
  },
  {
    slug: 'kerastase-elixir',
    house: 'KÉRASTASE',
    line: 'Elixir Ultime',
    product: "Elixir Ultime L'Huile Original, 75 ml",
    category: 'Hair',
    location: 'Hotel · mirror wall, pre-service',
    craft: 'Hair moving on its own weight, measured application, glass at true scale.',
    face: 'sans',
    track: 0.16,
  },
  {
    slug: 'sulwhasoo-firstcare',
    house: 'SULWHASOO',
    line: '설화수',
    product: 'First Care Activating Serum, 60 ml',
    category: 'Skincare',
    location: 'Hanok · rain on the eaves',
    craft: 'Moon-jar package fidelity, two-pump physics, a palm press that lands on beat.',
    face: 'serif',
    track: 0.2,
  },
]

export const REEL_SECONDS = 15.09
export const TOTAL_SECONDS = Math.round(FILMS.length * REEL_SECONDS)

export const src = {
  hi: (s: string) => `/media/v/${s}.mp4`,
  lo: (s: string) => `/media/s/${s}.mp4`,
  poster: (s: string) => `/media/p/${s}.jpg`,
}

/** Phones take the 720p cut: a quarter of the bytes at a resolution the screen cannot exceed anyway. */
export function clip(slug: string, small: boolean) {
  return small ? src.lo(slug) : src.hi(slug)
}

export function timecode(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
