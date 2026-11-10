#!/usr/bin/env python3
"""Convertit le checkpoint kikiri (StyleTTS2, torch parametrizations weight_norm)
vers le format attendu par kokoro 0.9.4 (ancien weight_norm : weight_g / weight_v).
Mapping verifie empiriquement sur torch 2.15 :
  parametrizations.weight.original0 (shape out,1,1) -> weight_g
  parametrizations.weight.original1 (shape out,in,k) -> weight_v
Les cles .norm.weight/.norm.bias absentes du checkpoint correspondent a des
LayerNorm sans parametres apprenables (affine=False) dans StyleTTS2 : les
valeurs par defaut (weight=1, bias=0) du modele kokoro sont donc correctes.
Verifie le chargement strict (a part ces .norm) et sauve le checkpoint converti.
"""
import os
import torch

# Chemins relatifs au script (même dossier sur la VM et en CI).
_HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(_HERE, "kikiri_german_martin_ep10.pth")
DST = os.path.join(_HERE, "kikiri_german_martin_ep10_converted.pth")

sd = torch.load(SRC, map_location="cpu", weights_only=True)
out = {}
n_remap = 0
for top, state in sd.items():
    new_state = {}
    for k, v in state.items():
        k2 = k[7:] if k.startswith("module.") else k  # strip 'module.'
        if k2.endswith("parametrizations.weight.original0"):
            k2 = k2.replace("parametrizations.weight.original0", "weight_g")
            n_remap += 1
        elif k2.endswith("parametrizations.weight.original1"):
            k2 = k2.replace("parametrizations.weight.original1", "weight_v")
            n_remap += 1
        new_state[k2] = v
    out[top] = new_state

torch.save(out, DST)
print(f"cles remappees: {n_remap} -> {DST}")

# Verification : chargement strict dans un KModel vierge
import json
from kokoro import KModel
import torch.nn as nn
from kokoro.model import CustomAlbert, AlbertConfig, ProsodyPredictor, TextEncoder, Decoder

cfg = json.load(open(os.path.join(_HERE, "config.json")))
model = KModel.__new__(KModel)
nn.Module.__init__(model)
model.repo_id = "hexgrad/Kokoro-82M"
model.vocab = cfg["vocab"]
model.bert = CustomAlbert(AlbertConfig(vocab_size=cfg["n_token"], **cfg["plbert"]))
model.bert_encoder = torch.nn.Linear(model.bert.config.hidden_size, cfg["hidden_dim"])
model.context_length = model.bert.config.max_position_embeddings
model.predictor = ProsodyPredictor(style_dim=cfg["style_dim"], d_hid=cfg["hidden_dim"],
                                   nlayers=cfg["n_layer"], max_dur=cfg["max_dur"], dropout=cfg["dropout"])
model.text_encoder = TextEncoder(channels=cfg["hidden_dim"], kernel_size=cfg["text_encoder_kernel_size"],
                                 depth=cfg["n_layer"], n_symbols=cfg["n_token"])
model.decoder = Decoder(dim_in=cfg["hidden_dim"], style_dim=cfg["style_dim"],
                        dim_out=cfg["n_mels"], **cfg["istftnet"])
total_missing, total_unexpected = [], []
for key, state in out.items():
    res = getattr(model, key).load_state_dict(state, strict=False)
    total_missing += [f"{key}.{m}" for m in res.missing_keys]
    total_unexpected += [f"{key}.{u}" for u in res.unexpected_keys]
non_norm_missing = [m for m in total_missing if ".norm.weight" not in m and ".norm.bias" not in m]
print(f"missing total={len(total_missing)} (dont .norm={len(total_missing)-len(non_norm_missing)})")
print(f"missing hors .norm: {non_norm_missing}")
print(f"unexpected total={len(total_unexpected)}: {total_unexpected[:5]}")
print("CONVERSION_OK" if not non_norm_missing and not total_unexpected else "CONVERSION_A_VERIFIER")
