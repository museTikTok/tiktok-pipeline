#!/usr/bin/env bash
# Pre-flight check: run on EVERY video before presenting it to Axel.
# Fails loudly if anything is wrong. Usage: ./preflight.sh <video.mp4> [min_duration_s]
set -euo pipefail
F="${1:?usage: preflight.sh <video.mp4> [min_duration_s] [WxH]}"
MIN_DUR="${2:-30}"
RES="${3:-1080x1920}"

echo "=== PREFLIGHT: $F ==="
[ -f "$F" ] || { echo "FAIL: file not found"; exit 1; }

# 1. Video stream: expected resolution, 30fps CFR
W="${RES%x*}"; H="${RES#*x}"
V=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,avg_frame_rate,duration,nb_frames -of csv=p=0 "$F")
echo "video: $V"
echo "$V" | grep -q "${W},${H},30/1,30/1" || { echo "FAIL: not ${RES} 30fps CFR"; exit 1; }

# 2. Audio stream MUST exist (this bit us on 2026-11-02: silent preview sent to Axel)
A=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$F" || true)
[ -n "$A" ] || { echo "FAIL: no audio stream"; exit 1; }
echo "audio: $A"

# 3. Audio must not be silent (mean volume above -60dB)
MEAN=$(ffmpeg -v info -i "$F" -af volumedetect -vn -f null - 2>&1 | grep "mean_volume" | awk '{print $5}')
echo "mean_volume: ${MEAN} dB"
python3 -c "import sys; v=float('${MEAN}'); sys.exit(0 if v > -60 else 1)" || { echo "FAIL: audio is silent"; exit 1; }

# 4. Duration >= minimum
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
python3 -c "import sys; sys.exit(0 if float('$DUR') >= $MIN_DUR else 1)" || { echo "FAIL: too short ($DUR < $MIN_DUR)"; exit 1; }
echo "duration: ${DUR}s (>= ${MIN_DUR}s OK)"

# 5. No duplicated frames (stutter check) on center crop
DUP_PCT=$(ffmpeg -v error -i "$F" -vf "scale=270:480,format=gray,crop=135:240:67:120" -f rawvideo -pix_fmt gray - 2>/dev/null | python3 -c "
import sys, numpy as np
data = sys.stdin.buffer.read(); n = len(data)//(135*240)
arr = np.frombuffer(data, dtype=np.uint8).reshape(n, 240, 135)
diffs = np.mean(np.abs(arr[1:].astype(np.int16)-arr[:-1].astype(np.int16)), axis=(1,2))
med = np.median(diffs); dups = np.sum(diffs < max(med*0.02, 0.05))
print(f'{100*dups/len(diffs):.1f}')")
echo "dup_frames: ${DUP_PCT}%"
python3 -c "import sys; sys.exit(0 if float('$DUP_PCT') < 2.0 else 1)" || { echo "FAIL: stutter detected"; exit 1; }

echo "=== PREFLIGHT OK ==="
