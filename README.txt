# 24 MINUTES — the beauty of everyday

A cinematic single-page photography story for Mediathon 3.0 — theme: "Beauty of Everyday".

This version uses your team's real BPDC photographs, all shot on one evening walk
between 17:06 and 17:30. Instead of inventing a full fictional day, the site tells
the true story that's actually in the files: the last 24 real minutes of golden
light before dusk — arranged in the exact order they were taken.

## Structure

- Hero — the sun setting behind the residence blocks, seen through the trees.
- Act I (17:06) — the walk begins; two people caught mid-step in the gold light.
- Act II (17:09–17:12) — the ordinary keeps going: a bench, cars, an empty road.
- Act III (17:14–17:17) — low sun, long shadows, a fence catching light.
- Act IV (17:20–17:23) — a volleyball game behind a fence, someone else's ordinary.
- Absence / Compare — drag to compare the same kind of court, full vs. empty.
- Act V (17:25–17:29) — the campus quietly lets go: parking lots, a bus stop, blue hour.
- Ending (17:30) — the last frame, and the line that ties it together.

## Open it

Open `index.html` in a browser, or host the folder on GitHub Pages, Netlify,
Vercel, or your competition's required platform.

## If you want to adjust it

- All photographs live in `assets/`. Filenames are descriptive (e.g.
  `avenue-long-shadows.jpg`) rather than numbered, so you can swap any single
  image without renumbering the rest — just keep the same filename or update
  the matching `data-src` in `index.html`.
- Captions, chapter labels and the real 17:06–17:30 timeline live directly in
  `index.html`. The floating time marker and the sun/sky animation in
  `script.js` / `style.css` are driven by scroll position, tuned specifically
  for a sunset-into-blue-hour story (not a full day cycle).
- The "TODAY vs SOMEDAY" drag-to-compare section pairs the volleyball court
  full of players against the same kind of court empty at sunset — swap either
  image in `index.html` under `#compare` if you'd rather use a truer same-spot
  pair from your own shots.

## Photography note for future shoots

This version leans entirely on one continuous walk. If you shoot more before
the deadline, the strongest additions would be: one close portrait of a real
person (candid, not posed) to put a face into the story, and one exact
same-spot "full vs. empty" pair for the compare slider.
