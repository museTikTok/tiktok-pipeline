#!/bin/bash
# download-clips-v7.sh — download the v7 Antikythera clip sources and pre-convert
# them to 30fps CFR (same pipeline as the VM: minterpolate blend, libx264 CRF 16,
# no audio, sources wider than 1920px downscaled to 1920).
# Reads scripts/clips-v7.json (URLs + time windows).
# Usage: bash scripts/download-clips-v7.sh
# Idempotent: clips already present in public/batch6/v7-clips/ are skipped.
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1

MANIFEST="scripts/clips-v7.json"
OUT="public/batch6/v7-clips"
WORK="${TMPDIR:-/tmp}/v7dl"
mkdir -p "$OUT" "$WORK"

command -v ffmpeg >/dev/null || { echo "ffmpeg missing" >&2; exit 1; }
command -v yt-dlp >/dev/null || {
  echo "Installing yt-dlp..."
  if command -v pipx >/dev/null; then pipx install yt-dlp
  else python3 -m pip install --break-system-packages --user yt-dlp; fi
}

# --- Parse the manifest into TSV: file | source_key | kind | url | start | end ---
python3 - "$MANIFEST" <<'EOF' > "$WORK/list.tsv"
import json, sys
m = json.load(open(sys.argv[1]))
for c in m["clips"]:
    s = m["sources"][c["source"]]
    print("\t".join([c["file"], c["source"], s["kind"], s["url"], str(c["start"]), str(c["end"])]))
EOF

# --- Download each non-YouTube source file once, then cut/convert each window ---
download_source() {
  local key="$1" kind="$2" url="$3"
  local dest="$WORK/src_${key}"
  if [ -f "${dest}.mp4" ] || [ -f "${dest}.webm" ] || [ -f "${dest}.ogv" ]; then return 0; fi
  echo "== download source: $key ($kind) =="
  case "$kind" in
    pexels)
      yt-dlp --no-warnings --extractor-args "generic:impersonate" \
        -o "${dest}.%(ext)s" "$url"
      ;;
    wikimedia)
      curl -fsSL -o "${dest}.ogv" "$url"
      ;;
    *) echo "unknown kind: $kind" >&2; return 1 ;;
  esac
}

convert_window() {
  local src="$1" start="$2" end="$3" out="$4"
  # -ss/-to before -i = fast seek + exact cut; then scale (max 1920 wide)
  # + minterpolate to 30fps CFR, libx264 CRF 16, no audio (VM pipeline).
  ffmpeg -y -v error -ss "$start" -to "$end" -i "$src" \
    -vf "scale='min(1920,iw)':-2,minterpolate=fps=30:mi_mode=blend:scd=none" \
    -c:v libx264 -crf 16 -preset fast -an "$out"
  local dur
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")
  echo "   -> $out (${dur}s)"
}

while IFS=$'\t' read -r file key kind url start end; do
  target="$OUT/$file"
  if [ -f "$target" ]; then echo "skip (exists): $file"; continue; fi
  echo "== clip: $file [$start-$end] from $key =="
  if [ "$kind" = "youtube" ]; then
    # Download only this window (fast, no full-video download).
    secfile="$WORK/sec_${file%.*}.mp4"
    if [ ! -f "$secfile" ]; then
      if ! yt-dlp --no-warnings -f "bv[height<=720]+ba/b[height<=720]/b" \
          --download-sections "*${start}-${end}" --force-keyframes-at-cuts \
          -o "$secfile" "$url" 2>"$WORK/yt-sec-${file%.*}.log"; then
        echo "   web client blocked, retrying with android client (360p)..."
        yt-dlp --no-warnings --extractor-args "youtube:player_client=android" -f 18 \
          --download-sections "*${start}-${end}" --force-keyframes-at-cuts \
          -o "$secfile" "$url" || { cat "$WORK/yt-sec-${file%.*}.log"; exit 1; }
      fi
    fi
    convert_window "$secfile" 0 9999 "$target"
  else
    download_source "$key" "$kind" "$url"
    src=$(ls "$WORK/src_${key}".* | head -1)
    convert_window "$src" "$start" "$end" "$target"
  fi
done < "$WORK/list.tsv"

echo "=== All v7 clips ready in $OUT ==="
ls -la "$OUT" | head -30
