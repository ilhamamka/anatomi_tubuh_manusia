#!/usr/bin/env bash
# Auto-push script for Anatomi Tubuh Manusia repository
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

MESSAGE="${1:-"Update: $(date '+%Y-%m-%d %H:%M:%S')"}"

git add -A
if git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "ℹ️ Tidak ada perubahan baru untuk di-commit."
else
  git commit -m "$MESSAGE"
  echo "✅ Commit berhasil: $MESSAGE"
fi

echo "🚀 Melakukan push ke origin main..."
git push origin main
echo "🎉 Push ke GitHub berhasil!"
