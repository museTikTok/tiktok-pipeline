#!/bin/bash
# speak-kokoro.sh — genere une voix off Kokoro (EN ou DE) + normalise a -24 dB + stereo.
# Usage: ./speak-kokoro.sh <en|de> <texte|@fichier.txt> <voix> <speed> <sortie.mp3>
#   en: bm_george | bm_lewis | bf_emma  (recommande: bm_george, speed 1.15)
#   de: martin  (recommande: speed 1.15 ; 1.0 = plus lent, legerement plus intelligible)
# Exemples:
#   ./speak-kokoro.sh en "An entire town lived on this rock." bm_george 1.15 vo-en.mp3
#   ./speak-kokoro.sh de @script-de.txt martin 1.15 vo-de.mp3
# La sortie est en STEREO (regle VO stereo avant Remotion : le mono perd 3 dB dans le mix).
set -e
cd "$(dirname "$0")" || exit 1
LANG="$1"; TEXT="$2"; VOICE="$3"; SPEED="$4"; OUT="$5"
if [ -z "$LANG" ] || [ -z "$TEXT" ] || [ -z "$VOICE" ] || [ -z "$SPEED" ] || [ -z "$OUT" ]; then
  echo "Usage: $0 <en|de> <texte|@fichier> <voix> <speed> <sortie.mp3>" >&2
  exit 1
fi
TMPBASE="/home/hatch/workspace/.tmp"
[ -d "$TMPBASE" ] || TMPBASE=".tmp"
mkdir -p "$TMPBASE"
TMPWAV="$(mktemp "$TMPBASE/kokoro-XXXXXX.wav)"
.venv/bin/python kokoro-test/speak_kokoro.py "$LANG" "$TEXT" "$VOICE" "$SPEED" "$TMPWAV"
# Normalisation -24 dB (normalize-audio.sh) puis stereo par duplication pleine amplitude
TMPNORM="$(mktemp "$TMPBASE/kokoro-norm-XXXXXX.mp3)"
./normalize-audio.sh "$TMPWAV" "$TMPNORM" -24
ffmpeg -y -v error -i "$TMPNORM" -af "pan=stereo|c0=c0|c1=c0" -c:a libmp3lame -b:a 192k "$OUT"
rm -f "$TMPWAV" "$TMPNORM"
echo "-> $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s, stereo, -24 dB)"
