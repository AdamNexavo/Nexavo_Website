#!/usr/bin/env python3
"""Convert partner logo sources to clean black PNGs with soft anti-aliased alpha."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path(
    "/Users/adam/.cursor/projects/Users-adam-Desktop-Nexavo-Websites-Apps-Nexavo-nextsavo-launchpad-main/assets"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "partners"

CONFIG: dict[str, tuple[str, int, str]] = {
    "veta-network.png": (
        "Scherm_afbeelding_2026-06-23_om_20.09.10-22f88a61-4400-4cba-85e0-b7de0d0a1ca0.png",
        80,
        "light_on_dark",
    ),
    "ruby-asset-finance.png": (
        "Scherm_afbeelding_2026-06-23_om_20.10.59-4d6ffae6-f76d-4ce5-8548-a8640e7b0ec0.png",
        80,
        "checkerboard",
    ),
    "bibi.png": (
        "Ontwerp_zonder_titel__2_-dbcec764-8b18-425b-ae6d-d19a02adb112.png",
        56,
        "dark_on_light",
    ),
    "crewstar.png": (
        "/Users/adam/Desktop/Crewstars/Branding/Logos/Logos CS PNG/logo_horizontaal_zwart.png",
        48,
        "crewstar_official",
    ),
    "tap.png": (
        "paars_wit-f23b1c24-9176-4e10-acb9-3f709bf81590.png",
        80,
        "light_on_dark",
    ),
    "akoudad.png": (
        "logos_bg-wit_vierkant-604c11e1-3f07-4ff0-880f-063f3f8bc55f.png",
        96,
        "dark_on_dark",
    ),
}


def lum(rgb: np.ndarray) -> np.ndarray:
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]


def bg_color(arr: np.ndarray) -> np.ndarray:
    h, w = arr.shape[:2]
    pts = [
        (0, 0),
        (0, w - 1),
        (h - 1, 0),
        (h - 1, w - 1),
        (0, w // 2),
        (h - 1, w // 2),
    ]
    return np.median([arr[y, x, :3] for y, x in pts], axis=0)


def build_alpha(arr: np.ndarray, mode: str) -> np.ndarray:
    rgb = arr[..., :3].astype(np.float32)
    src_a = arr[..., 3].astype(np.float32)
    L = lum(rgb)
    mx = np.max(rgb, axis=-1)
    mn = np.min(rgb, axis=-1)
    chroma = mx - mn
    bg = bg_color(arr)
    dist = np.linalg.norm(rgb - bg, axis=-1)
    bg_lum = float(lum(bg.reshape(1, 1, 3))[0, 0])

    strength = np.zeros(arr.shape[:2], dtype=np.float32)

    if mode == "light_on_dark":
        strength = ((L - bg_lum + 4.0) / max(255.0 - bg_lum, 1.0)) * 255.0
        strength = np.clip(strength, 0, 255)
        strength[L < 10] = 0
    elif mode == "dark_on_light":
        strength = np.clip((255.0 - L) * 1.2, 0, 255)
        strength[L > 246] = 0
    elif mode == "dark_on_dark":
        strength = np.maximum.reduce(
            [mx * 1.65, dist * 2.2, np.clip((L - bg_lum + 6.0) * 10.0, 0, 255)]
        )
        strength = np.clip(strength, 0, 255)
        strength[(mx < 14) & (dist < 18)] = 0
    elif mode == "colored_bg":
        is_mint = dist < 38
        is_text = L < 95
        is_leaf = (
            (rgb[..., 1] > rgb[..., 0] + 10)
            & (rgb[..., 1] > rgb[..., 2] + 5)
            & (rgb[..., 1] > 85)
            & (~is_mint)
        )
        mask = (~is_mint) & (is_text | is_leaf)
        strength = np.zeros(arr.shape[:2], dtype=np.float32)
        strength[mask] = np.clip(
            np.maximum((95 - L[mask]) * 3, chroma[mask] * 4, dist[mask] * 2),
            0,
            255,
        )
    elif mode == "checkerboard":
        is_checker = (chroma < 22) & (mn > 145)
        fg = np.maximum.reduce([chroma * 2.4, dist * 1.8, (255.0 - L) * 0.55])
        strength = np.where(~is_checker, np.clip(fg, 0, 255), 0)
        strength[L < 12] = 0
    else:
        raise ValueError(mode)

    strength = strength * (src_a / 255.0)
    alpha = np.where(strength > 6, np.round(strength), 0).astype(np.uint8)
    return alpha


def export_clean(alpha: np.ndarray, target_h: int, out_path: Path) -> None:
    ys, xs = np.where(alpha > 12)
    if len(xs) == 0:
        raise RuntimeError(f"No foreground for {out_path.name}")

    pad = max(2, int(round(min(alpha.shape) * 0.02)))
    y0, y1 = max(0, ys.min() - pad), min(alpha.shape[0], ys.max() + pad + 1)
    x0, x1 = max(0, xs.min() - pad), min(alpha.shape[1], xs.max() + pad + 1)
    crop_a = alpha[y0:y1, x0:x1]

    h, w = crop_a.shape
    target_w = max(1, int(round(w * (target_h / h))))

    alpha_img = Image.fromarray(crop_a, mode="L").resize(
        (target_w, target_h), Image.Resampling.LANCZOS
    )
    alpha_resized = np.array(alpha_img, dtype=np.float32)
    fg = alpha_resized[alpha_resized > 12]
    if fg.size:
        ref = float(np.percentile(fg, 90))
        alpha_resized = np.clip(alpha_resized / ref * 255.0, 0, 255)

    out = np.zeros((target_h, target_w, 4), dtype=np.uint8)
    out[..., 3] = alpha_resized.astype(np.uint8)

    Image.fromarray(out, mode="RGBA").save(out_path, optimize=True)

    soft = len(np.unique(alpha_resized[(alpha_resized > 0) & (alpha_resized < 255)]))
    opaque = int((alpha_resized > 200).sum())
    total = int((alpha_resized > 12).sum())
    print(
        f"{out_path.name:26} {target_w}x{target_h}  "
        f"fg={total:5d}  solid={opaque:5d}  soft-edge={soft:3d} levels"
    )


def export_crewstar_official(src_path: Path, out_path: Path, target_h: int) -> None:
    """Official crewstars horizontal logo — white bg, black text + icon → black on transparent."""
    arr = np.array(Image.open(src_path).convert("RGBA"))
    rgb = arr[..., :3].astype(np.float32)
    L = lum(rgb)
    mx = np.max(rgb, axis=-1)
    mn = np.min(rgb, axis=-1)
    chroma = mx - mn
    src_a = arr[..., 3].astype(np.float32)

    is_bg = L > 246
    is_dark = L < 110
    is_colored = (chroma > 12) & (~is_bg) & (L < 246)
    mask = (is_dark | is_colored) & (~is_bg)

    strength = np.zeros_like(L)
    strength[is_dark] = np.clip((255 - L[is_dark]) * 1.05, 0, 255)
    strength[is_colored] = np.clip(
        np.maximum(chroma[is_colored] * 2.8, (255 - L[is_colored]) * 0.6, mx[is_colored] * 0.9),
        0,
        255,
    )
    strength = strength * (src_a / 255.0)
    strength[~mask] = 0
    alpha = np.where(strength > 8, np.round(strength), 0).astype(np.uint8)
    export_clean(alpha, target_h, out_path)


def resolve_src(src: str) -> Path:
    path = Path(src)
    return path if path.is_absolute() else ASSETS / src


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for out_name, (src, height, mode) in CONFIG.items():
        src_path = resolve_src(src)
        out_path = OUT / out_name
        if mode == "crewstar_official":
            export_crewstar_official(src_path, out_path, height)
            continue
        arr = np.array(Image.open(src_path).convert("RGBA"))
        alpha = build_alpha(arr, mode)
        export_clean(alpha, height, out_path)


if __name__ == "__main__":
    main()
