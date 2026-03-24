#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src-tauri/target/release/bundle/dmg"
OUT_DIR="$ROOT_DIR/release"

mkdir -p "$OUT_DIR"

LATEST_DMG="$(ls -t "$SRC_DIR"/*.dmg 2>/dev/null | head -n 1 || true)"

if [[ -z "$LATEST_DMG" ]]; then
  echo "No DMG found in: $SRC_DIR"
  echo "Run: pnpm build:mac"
  exit 1
fi

DMG_BASENAME="$(basename "$LATEST_DMG")"
if [[ "$DMG_BASENAME" == *"_aarch64.dmg" ]]; then
  OUT_FILE="$OUT_DIR/peri-hub-macos-arm64.dmg"
elif [[ "$DMG_BASENAME" == *"_x64.dmg" ]] || [[ "$DMG_BASENAME" == *"_x86_64.dmg" ]]; then
  OUT_FILE="$OUT_DIR/peri-hub-macos-x64.dmg"
else
  OUT_FILE="$OUT_DIR/peri-hub-macos.dmg"
fi

cp "$LATEST_DMG" "$OUT_FILE"

echo "Exported DMG: $OUT_FILE"
