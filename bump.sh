#!/usr/bin/env bash
# Sobe a versão nos DOIS arquivos de uma vez. Uso: ./bump.sh 1.4.0
set -e
[ -z "$1" ] && { echo "uso: ./bump.sh <versao>   ex: ./bump.sh 1.4.0"; exit 1; }
V="$1"
D=$(date +%d/%m/%Y)
sed -i.bak -E "s/const APP_VERSION='[^']*'/const APP_VERSION='$V'/; s#const APP_DATE='[^']*'#const APP_DATE='$D'#" index.html
sed -i.bak -E "s/const V = '[^']*'/const V = '$V'/" sw.js
rm -f index.html.bak sw.js.bak
echo "versão $V ($D) aplicada em index.html e sw.js"
grep -n "APP_VERSION=" index.html | head -1
grep -n "^const V = " sw.js
echo
echo "agora: git add -A && git commit -m \"v$V\" && git push"
