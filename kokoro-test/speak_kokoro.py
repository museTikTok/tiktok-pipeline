#!/usr/bin/env python3
"""Generateur VO Kokoro — anglais (kokoro-onnx) ou allemand (kokoro PyTorch + kikiri Martin).
Usage: speak_kokoro.py <en|de> <texte|@fichier> <voix> <speed> <sortie.wav>
  en: voix bm_george | bm_lewis | bf_emma (ou toute voix du voices-v1.0.bin)
  de: voix martin (kikiri dm_martin, checkpoint converti)
Sortie: WAV 24 kHz mono. Normalisation + stereo via speak-kokoro.sh.
"""
import sys
import numpy as np
import soundfile as sf

BASE = "/home/hatch/workspace/tiktok-pipeline/kokoro-test"


def read_text(arg):
    if arg.startswith("@"):
        with open(arg[1:], encoding="utf-8") as f:
            return f.read().strip()
    return arg


def gen_en(text, voice, speed):
    from kokoro_onnx import Kokoro
    kokoro = Kokoro(f"{BASE}/kokoro-v1.0.onnx", f"{BASE}/voices-v1.0.bin")
    samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-gb")
    return samples, sr


def gen_de(text, voice, speed):
    import torch
    from kokoro import KModel, KPipeline
    from misaki import espeak
    kmodel = KModel(repo_id="hexgrad/Kokoro-82M",
                    config=f"{BASE}/config.json",
                    model=f"{BASE}/kikiri_german_martin_ep10_converted.pth").to("cpu").eval()
    pipeline = KPipeline(lang_code="f", model=kmodel)
    pipeline.g2p = espeak.EspeakG2P(language="de")
    pack = torch.load(f"{BASE}/martin.pt", map_location="cpu", weights_only=True)
    chunks = []
    for result in pipeline(text, voice=pack, speed=speed):
        if result.output is not None and result.output.audio is not None:
            chunks.append(result.output.audio)
    return np.concatenate(chunks), 24000


if __name__ == "__main__":
    lang, text_arg, voice, speed, out = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5]
    text = read_text(text_arg)
    import time
    t0 = time.time()
    samples, sr = gen_en(text, voice, speed) if lang == "en" else gen_de(text, voice, speed)
    dur = len(samples) / sr
    sf.write(out, samples, sr)
    print(f"{lang}/{voice} speed={speed}: {dur:.1f}s audio en {time.time()-t0:.0f}s (RTF {dur/(time.time()-t0):.2f}x) -> {out}")
