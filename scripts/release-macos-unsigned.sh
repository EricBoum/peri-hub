#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_BUNDLE_PATH="$ROOT_DIR/src-tauri/target/aarch64-apple-darwin/release/bundle/macos/peri-hub.app"
OUT_DIR="$ROOT_DIR/release"
OUT_DMG="$OUT_DIR/peri-hub-macos-arm64.dmg"
VOLUME_NAME="peri-hub"

TMP_DIR="$(mktemp -d)"
RW_DMG="$TMP_DIR/peri-hub-rw.dmg"
APP_WORK="$TMP_DIR/peri-hub.app"
MOUNT_POINT=""

cleanup() {
  if [[ -n "$MOUNT_POINT" ]] && mount | rg -q "$MOUNT_POINT"; then
    hdiutil detach "$MOUNT_POINT" >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "[1/6] Building macOS app bundle (unsigned)..."
if [[ "${SKIP_BUILD:-0}" == "1" ]]; then
  echo "Skipping build because SKIP_BUILD=1"
else
  cd "$ROOT_DIR"
  pnpm tauri build --bundles app --target aarch64-apple-darwin --no-sign
fi

if [[ ! -d "$APP_BUNDLE_PATH" ]]; then
  echo "App bundle not found: $APP_BUNDLE_PATH"
  exit 1
fi

echo "[2/6] Preparing app bundle..."
ditto "$APP_BUNDLE_PATH" "$APP_WORK"

echo "[3/6] Applying ad-hoc signature..."
codesign --force --deep --sign - "$APP_WORK"
codesign --verify --deep --strict --verbose=2 "$APP_WORK"

echo "[4/6] Creating DMG staging volume..."
hdiutil create -size 200m -fs HFS+ -volname "$VOLUME_NAME" -ov "$RW_DMG" >/dev/null
# Ensure previous stale mount is gone before attaching the new RW image.
hdiutil detach "/Volumes/$VOLUME_NAME" >/dev/null 2>&1 || true
MOUNT_POINT="$(hdiutil attach -nobrowse -readwrite "$RW_DMG" | awk '/\/Volumes\//{print $3; exit}')"

ditto "$APP_WORK" "$MOUNT_POINT/peri-hub.app"
ln -s /Applications "$MOUNT_POINT/Applications"

# Verify signature is still valid inside mounted image before compression.
codesign --verify --deep --strict --verbose=2 "$MOUNT_POINT/peri-hub.app"

hdiutil detach "$MOUNT_POINT" >/dev/null
MOUNT_POINT=""

mkdir -p "$OUT_DIR"

echo "[5/6] Compressing final DMG..."
rm -f "$OUT_DMG"
hdiutil convert "$RW_DMG" -format UDZO -o "$OUT_DMG" >/dev/null

echo "[6/6] Done"
echo "Generated: $OUT_DMG"
