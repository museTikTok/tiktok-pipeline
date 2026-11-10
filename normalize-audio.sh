#!/bin/bash
# Normalise le volume moyen d'un fichier audio/vidéo vers une cible (défaut : -24 dB, règle d'Axel).
# Méthode : mesure mean_volume (volumedetect), gain = cible - mesuré, puis volume + alimiter (anti-clip).
# Usage: ./normalize-audio.sh <entrée> <sortie> [cible_dB]  (cible par défaut : -24)
# Exemple: ./normalize-audio.sh mix.mp4 mix-norm.mp4 -24
# Codecs audio choisis selon l'extension de sortie : .mp3 -> libmp3lame, .wav -> pcm_s16le, sinon aac.
set -e
IN="$1"; OUT="$2"; TARGET="${3:--24}"
MEAN=$(ffmpeg -i "$IN" -af volumedetect -vn -sn -dn -f null /dev/null 2>&1 | grep mean_volume | sed 's/.*mean_volume: //;s/ dB//')
GAIN=$(python3 -c "print(round($TARGET - ($MEAN), 2))")
echo "mean_volume mesuré: ${MEAN} dB | cible: ${TARGET} dB | gain appliqué: ${GAIN} dB"
case "$OUT" in
  *.mp3) ACODEC="libmp3lame"; ABITRATE="192k";;
  *.wav) ACODEC="pcm_s16le"; ABITRATE="";;
  *)     ACODEC="aac"; ABITRATE="192k";;
esac
if [ -n "$ABITRATE" ]; then ABITRATE="-b:a $ABITRATE"; fi
HAS_VIDEO=$(ffprobe -v error -select_streams v -show_entries stream=codec_type -of csv=p=0 "$IN" | head -1)
if [ -n "$HAS_VIDEO" ]; then VOPT="-c:v copy"; else VOPT="-vn"; fi
# shellcheck disable=SC2086
ffmpeg -y -v error -i "$IN" -af "volume=${GAIN}dB,alimiter=limit=0.95:level=false" $VOPT -c:a "$ACODEC" $ABITRATE "$OUT"
echo "--- vérification ---"
ffmpeg -i "$OUT" -af volumedetect -vn -sn -dn -f null /dev/null 2>&1 | grep -E "mean_volume|max_volume"
