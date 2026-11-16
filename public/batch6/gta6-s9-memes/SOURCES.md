# Memes — GTA 6 Script 9 (« He typed his code live. A viewer stole it. »)

Sourcés le 2026-11-16. Tous vérifiés image par image, AUCUN watermark.
Audio supprimé (-an) : l'edit est musical, les memes sont des overlays visuels.

## Constat Vlipsy (priorité demandée par Axel)
Vlipsy a bien un clip pour chaque slot, MAIS en accès anonyme il ne sert que des
aperçus `*-watermark.mp4` avec le logo « VLIPSY » incrusté en bas à gauche
(vérifié sur le clip Star Trek Facepalm : 480p, 2 s, watermark permanent ;
la version propre sans watermark répond 403 sans compte). Le téléchargement
propre exige un compte Vlipsy. → Fallback YouTube (templates green-screen
faits pour le montage, sans watermark), comme autorisé par la consigne.

## Fichiers livrés (pleine résolution, 30 fps CFR H.264, < 40 Mo)
Tous en 16:9 natif (ou 4:3 pour Fry / iShowSpeed) : ce sont des overlays
green-screen à incruster (chroma-key), pas du plein écran vertical — les
forcer en 1080x1920 déformerait ou rognerait le sujet. Le build les
positionne/scale ; meme-scam est une scène réelle 16:9 (pas de fond vert).

| Fichier | Slot / usage | Durée | Rés. | Segment source |
|---|---|---|---|---|
| meme-crying.mp4 | SLOT 0 — 3-7 s, fail (remplace l'overlay visage qui pleure) | 1,93 s | 1280x720 | 1,0-3,0 s |
| meme-facepalm.mp4 | SLOT 1 — 0-10 s, facepalm au message d'erreur | 2,43 s | 1920x1080 | 3,8-6,3 s |
| meme-bruh.mp4 | SLOT 2 — 0-10 s, réaction choquée ~7-8 s | 2,00 s | 1440x1080 | 4,5-6,5 s |
| meme-sideeye.mp4 | SLOT 3 — 10-15 s, carte « STAGED? MAYBE » | 2,00 s | 1440x1080 | 0,5-2,5 s |
| meme-doubt.mp4 | SLOT 4 — 15-22 s, faux clips (« ouais, bien sûr… ») | 1,43 s | 1920x1080 | 10,0-11,5 s |
| meme-scam.mp4 | SLOT 5 — 22-28 s, « NO EARLY ACCESS » (optionnel) | 3,03 s | 1280x720 | 0,3-3,3 s |
| meme-crying-alt.mp4 | BONUS — alt. slot 0 : Homelander « fake crying » | 1,93 s | 1920x816 | 3,8-5,8 s |

Versions légères (720p de haut, CRF 22, +faststart) dans
`~/workspace/tiktok/gta6-script9/assets-preview/memes-light/` :
meme-crying-light.mp4, meme-facepalm-light.mp4, meme-bruh-light.mp4,
meme-sideeye-light.mp4, meme-doubt-light.mp4, meme-scam-light.mp4,
meme-crying-alt-light.mp4.

## Sources
- meme-crying : « Black man crying meme greenscreen (free to use) », Zega Memes,
  https://www.youtube.com/watch?v=wN0cn3BHFlo
  Vlipsy visé : « Michael Jordan — Crying at the podium » (10 s),
  https://vlipsy.com/search/cry (watermark → non utilisé).
- meme-facepalm : « Picard's Epic Facepalm (Green Screen Footage) », LANCUSTER,
  https://www.youtube.com/watch?v=CrkFAGhK6-A
  Vlipsy visé : « Star Trek — Facepalm », https://vlipsy.com/vlip/star-trek-facepalm-bEI5jSUK
  (watermark + plan large 2 s, pas le gros plan facepalm → non utilisé).
- meme-bruh : « iShowSpeed Shocking - Green Screen », Cacky Wacky,
  https://www.youtube.com/watch?v=4D0o8exrcAk
  Vlipsy visé : « Bruh — Greenscreen Meme », https://vlipsy.com/vlip/meme-bruh-lLFmAjoV
  (watermark → non utilisé).
- meme-sideeye : « Futurama (Fry) - Not Sure If... [Green Screen] », Feadds Designs,
  https://www.youtube.com/watch?v=Eu-fmUZ5Drk — fond vert FONCÉ (pas vert fluo),
  régler le chroma-key en conséquence.
  Vlipsy visé : « Futurama — Not sure if... » (9 s), https://vlipsy.com/search/small-fry
  (watermark → non utilisé).
- meme-doubt : « Tim Robinson "You Sure About That" Green Screen », Green Screens by CreatorSet,
  https://www.youtube.com/watch?v=2ZOIpsxfzxw
  Vlipsy visé : « I Think You Should Leave — You sure about that? » (16 s),
  https://vlipsy.com/search/you-sure (watermark → non utilisé).
  Note : petit logo « CARBER VAC » sur la chemise (costume d'origine, pas un watermark) ;
  léger ghosting de blend sur le mouvement de tête (minterpolate) — lisible comme motion blur.
- meme-scam : « Hacker Meme », The Big E, https://www.youtube.com/watch?v=qbWqXKN3m3c
  (mec cagoulé qui tape au clavier devant 2 écrans ; sujet à gauche, écrans à droite —
  un crop 9:16 centré couperait le mec OU les écrans : crop gauche ou overlay réduit).
  Vlipsy visé : « Kung Fury — Hackerman », https://vlipsy.com/vlip/kung-fury-hackerman-qOVV5m5h
  (watermark → non utilisé).
- meme-crying-alt : « Homelander Fake Crying meme - The Boys - Green Screen »,
  https://www.youtube.com/watch?v=p6I6ttSivis

## Rejets (vérifiés puis écartés)
- « Bruh » green screen (EgrDQ289GrE) : tête Moaï statique, pas un visage choqué.
- « Sure Buddy (original meme) » (zYaaaeMGPa8) : vidéo FNAF horreur, titre mensonger.
- « You Sure About That » (ti9bzNWWTDY) : logo « CARBER VAC » incrusté bas-gauche sur toutes les frames.
- « Hackerman » titre chrome (uxa73zOXAG4 / 3mYJZp7icrI) : que le carton-titre + logo chaîne en coin (scam2).
- YouTube bot-check intermittent sur 3 vidéos (zVTLTQtkLG0, DFlPYD14xAA, Bw2-qn0XnJc) : contournées via d'autres uploads du même template.
