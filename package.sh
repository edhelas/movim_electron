#!/bin/bash
set -e

npm run build:debian:x64
npm run build:debian:i386
npm run build:mac
npm run build:windows:x64
npm run build:windows:i386
cp build/*.deb dist/

VERSION=`npm run --silent version`

cd dist
zip --symlinks -9r movim-desktop_${VERSION}_macos.zip Movim-darwin-x64
tar czvf movim-desktop_${VERSION}_linux_i386.tar.gz Movim-linux-ia32
tar czvf movim-desktop_${VERSION}_linux_amd64.tar.gz Movim-linux-x64
zip -9r movim-desktop_${VERSION}_win32.zip Movim-win32-ia32
zip -9r movim-desktop_${VERSION}_win64.zip Movim-win32-x64

for file in *.{deb,zip,tar.gz}; do
  gpg -b $file
  sha256sum -b $file > $file.sha256
done
