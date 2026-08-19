export type MarkFace = 'serif' | 'sans'

export type Film = {
  slug: string
  house: string
  /** Sub-brand line shown under the mark, e.g. N°5. Kept in Latin, as Korean luxury sites do. Empty when the house name stands alone. */
  line: string
  product: string
  category: string
  location: string
  /** What this shot was actually built to prove. Korean copy, written for a director, not a buyer. */
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
    product: 'N°5 오 드 퍼퓸 50ml',
    category: '향수',
    location: '서울 · 고층 빌딩, 비, 밤',
    craft: '흩날리는 미스트, 크리스털의 각, 두 사람이 실제로 만든 이별.',
    face: 'sans',
    track: 0.26,
    monogram: 'chanel',
  },
  {
    slug: 'hermes-rouge',
    house: 'HERMÈS',
    line: 'Rouge',
    product: '루쥬 에르메스 사틴, 21 로즈 에피세',
    category: '뷰티',
    location: '스튜디오 · 웜 키 라이트, 단일 광원',
    craft: '입술 위의 사틴 발색, 클로즈업에서도 각이 사는 래커 메탈.',
    face: 'serif',
    track: 0.14,
  },
  {
    slug: 'dior-lady',
    house: 'DIOR',
    line: 'Lady Dior',
    product: '레이디 디올 미디엄, 블랙 카나주 램스킨',
    category: '가죽 제품',
    location: '서울 · 호텔 도착',
    craft: '손에 걸리는 백의 무게, 카나주의 결, 스스로 흔들리는 참 장식.',
    face: 'serif',
    track: 0.2,
  },
  {
    slug: 'lv-ombres',
    house: 'LOUIS VUITTON',
    line: 'LV Ombres',
    product: 'LV Ombres 아이섀도 팔레트',
    category: '뷰티',
    location: '백스테이지 · 무대 출입구, 콜타임',
    craft: '실제 시간에 쫓기는 현장에서 잡아낸 근접 아이 디테일.',
    face: 'sans',
    track: 0.14,
    monogram: 'lv',
  },
  {
    slug: 'maxmara-101801',
    house: 'MAX MARA',
    line: '101801',
    product: '101801 아이콘 코트, 카멜',
    category: '기성복',
    location: '갤러리 · 설치 작업일',
    craft: '워킹 내내 무너지지 않는 롱코트의 흐름과 실루엣.',
    face: 'sans',
    track: 0.18,
  },
  {
    slug: 'chanel-1112',
    house: 'CHANEL',
    line: '11.12',
    product: '클래식 11.12, 블랙 램스킨, 골드 메탈',
    category: '가죽 제품',
    location: '온실 · 프린트 아카이브',
    craft: '퀼팅과 체인의 무게, 카메라가 아니라 동작에서 나오는 감정.',
    face: 'sans',
    track: 0.26,
    monogram: 'chanel',
  },
  {
    slug: 'dior-lipglow',
    house: 'DIOR',
    line: 'Addict',
    product: '디올 어딕트 립 글로우 001 핑크',
    category: '뷰티',
    location: '펜트하우스 · 해질녘, 유리 라인',
    craft: '자연스러운 입술 발색, 클로즈업을 견디는 반사 케이스.',
    face: 'serif',
    track: 0.2,
  },
  {
    slug: 'lamer-cream',
    house: 'LA MER',
    line: '',
    product: '더 모이스처라이징 소프트 크림',
    category: '스킨케어',
    location: '제주 · 오션뷰 스위트',
    craft: '크림의 질감, 화이트 자의 타이포, 물에서 비롯된 빛.',
    face: 'serif',
    track: 0.22,
  },
  {
    slug: 'laprairie-caviar',
    house: 'LA PRAIRIE',
    line: 'Skin Caviar',
    product: '스킨 캐비어',
    category: '스킨케어',
    location: '스튜디오 · 호리존, 소프트 탑 라이트',
    craft: '움직임 없는 얼굴이 끌고 가는 컷, 화이트 위에서 선명한 코발트 글라스.',
    face: 'serif',
    track: 0.16,
  },
  {
    slug: 'kerastase-elixir',
    house: 'KÉRASTASE',
    line: 'Elixir Ultime',
    product: '엘릭서 얼팀 오일 오리지날 75ml',
    category: '헤어',
    location: '호텔 · 미러 월, 준비 시간',
    craft: '제 무게로 움직이는 머릿결, 절제된 도포, 실제 크기로 잡힌 글라스.',
    face: 'sans',
    track: 0.16,
  },
  {
    slug: 'sulwhasoo-firstcare',
    house: 'SULWHASOO',
    line: '설화수',
    product: '윤조에센스 60ml',
    category: '스킨케어',
    location: '한옥 · 처마 끝 빗줄기',
    craft: '달항아리 용기의 재현, 두 번의 펌핑, 박자에 맞아떨어지는 손바닥 프레스.',
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
