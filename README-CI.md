# TikTok pipeline — CI rendering (GitHub Actions test)

Renders Remotion videos on GitHub-hosted runners (`ubuntu-latest`, 4 vCPU,
16 GB RAM) instead of the VM. Two compositions can render **in parallel**
(matrix, one runner each).

## Trigger a render

GitHub → Actions → **Render video** → Run workflow:

| Input | Meaning |
|---|---|
| `videos` | `v7-both` (default: EN + DE in parallel), `v7-en-only`, `v7-de-only` |
| `clips` | `committed` (default: pre-converted clips in the repo) or `download` (fetch sources from `scripts/clips-v7.json` and pre-convert them) |
| `generate_vo` | `false` (default: use the committed VO mp3) or `true` (regenerate the VO with Kokoro in CI — first run downloads ~1.5 GB of pip packages + models, cached afterwards) |

## Outputs

- One mp4 artifact per composition (`video-AntikytheraVideoEn`, `video-AntikytheraVideoDe`),
  retention **7 days**. Download them quickly: the GitHub Free plan only
  includes **500 MB** of shared artifact storage — delete the artifacts
  after downloading.
- One frames artifact per composition (`frames-...`, 6 JPEGs at t=2/25/50/62/70/79 s)
  to check subtitles and shots without downloading the full mp4.
- The workflow runs `scripts/preflight.sh` on the rendered mp4 in CI
  (1080×1920, 30 fps, audio non-silent, <2% duplicated frames).
  Run preflight again on the VM after downloading, before presenting.

## What is in this repo (test scope: video 7 Antikythera)

- `src/` — all Remotion components (`Root.tsx` registers every composition).
- `remotion.config.ts` — browser executable only set when the VM path exists;
  on CI, Remotion uses the browser from `npx remotion browser install`.
- `public/batch6/v7-clips/` — 23 pre-converted clips (30 fps CFR, 143 MB).
- `public/batch6/v7-en/` — EN voiceover + words JSON + script text.
- `public/batch6/v7-de/` — DE voiceover+music mix + words JSON + script text.
- `public/sfx/` — sound effects used by the components.
- `assets/fonts/` — Titan One + Monoton (OFL); Anton is downloaded from
  Google Fonts in CI (subtitle fallback).
- `scripts/` — `preflight.sh`, `download-clips-v7.sh` + `clips-v7.json`
  (clip sources + time windows for the `download` path).
- `kokoro-test/speak_kokoro.py`, `kokoro-test/convert_kikiri.py`,
  `speak-kokoro.sh`, `normalize-audio.sh`, `requirements-ci.txt` —
  only used when `generate_vo: true`.

## What is NOT in this repo (stays on the VM for now)

- `node_modules/`, `.venv/`, `.browser/` — rebuilt/installed in CI.
- Other videos' clips (`public/batch3/`, `batch4/`, `batch5/`, rest of `batch6/`)
  and rendered mp4s — add them per video when CI grows to cover them.
- Helper scripts (transcription, VAD check, WhisperX re-alignment, SigLIP clip
  search, OPUS-MT translation, Real-ESRGAN upscale) — still VM-only.
- Kokoro model files (~680 MB) — downloaded in CI when `generate_vo: true`,
  cached with `actions/cache` (10 GB per repo on the Free plan).

## Known limits (see `../tiktok/github-actions-test.md` for details)

- A single render takes ~20 min on a 4-vCPU runner (same as the VM);
  the gain is **parallelism**, not speed per render.
- YouTube downloads from CI are untested: the web client may hit YouTube's
  bot check on runner IPs (the script falls back to the Android client,
  360p only). Default `clips: committed` avoids this entirely.
- Public repo = unlimited Actions minutes. Private repo (Free plan) =
  2,000 min/month. Artifact storage is 500 MB on the Free plan either way.
