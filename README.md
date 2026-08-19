# MANSU — commercial reel

Private demo site for eleven commercial films. White, type-led, three separate viewing designs.

**Live:** https://mansu-reel.vercel.app — public URL, but `noindex` + `robots.txt disallow`, so it is not findable. Anyone with the link can open it; nobody has to sign in.

## Run it

```
npm install
npm run dev      # http://localhost:4310
npm run build
vercel deploy --prod --yes
```

## Where things are

| What | Where |
|---|---|
| The eleven films, their copy and metadata | `src/lib/films.ts` |
| Motion engine (spring, wheel, drag, keys, ring wrap) | `src/lib/useFlick.ts` |
| House wordmarks and monograms | `src/components/HouseMark.tsx` |
| Demo 01, the flick reel | `src/components/Reel.tsx` |
| Demo 02, the marquee | `src/components/Marquee.tsx` |
| Demo 03, the continuous cut | `src/components/Cut.tsx` |
| Home | `src/components/Landing.tsx` |
| Design tokens, type roles | `src/app/globals.css` |
| Video, small video, posters | `public/media/{v,s,p}` |

## Changing the name

The site is titled `MANSU` in three places: the nav wordmark in `src/components/Nav.tsx`,
`metadata.title` in `src/app/layout.tsx`, and `metadata.title` in `src/app/about/page.tsx`.
Swap all three if a different credit name is wanted.

## Adding or swapping a film

1. Encode into `public/media`:
   ```
   ffmpeg -i SOURCE.mp4 -vf scale=1440:-2 -c:v libx264 -preset slow -crf 26 \
     -pix_fmt yuv420p -g 48 -c:a aac -b:a 96k -movflags +faststart public/media/v/SLUG.mp4
   ffmpeg -i SOURCE.mp4 -vf scale=720:-2  -c:v libx264 -preset slow -crf 30 \
     -pix_fmt yuv420p -an -movflags +faststart public/media/s/SLUG.mp4
   ffmpeg -ss 6 -i SOURCE.mp4 -vf scale=1200:-2 -frames:v 1 -q:v 4 public/media/p/SLUG.jpg
   ```
2. Add the entry to `FILMS` in `src/lib/films.ts`. All four pages read from that one array.
   `face` picks the serif or the sans wordmark, `track` is its letter-spacing, `monogram`
   adds the drawn mark above it.

Every clip is 15.09s, 21:9, 24 fps. Sources are the untouched renders in
`C:\Users\mredw\Desktop\ai-video\experiments\renders`.

## Note on the brands

Every film is generated and none of the houses were involved. The site says so on the home
page footer and in full on `/about`. Keep that language if the site is ever shared further.
