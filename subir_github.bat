@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo  Enviando Gestão Célula para o GitHub
echo ==========================================
echo.

git init
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/matheusaug2007/gestao-celula-wave.git

echo Adicionando todos os arquivos e pastas...
git add .

echo Criando commit...
git commit -m "Upload completo do projeto Gestao Celula Wave"

echo.
echo Enviando para o GitHub (branch main)...
git push -u origin main --force

echo.
echo ==========================================
echo  Concluido com sucesso!
echo ==========================================
pause
