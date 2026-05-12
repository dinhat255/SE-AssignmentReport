@echo off
setlocal

set "DOC=%~1"
if "%DOC%"=="" set "DOC=main.tex"

for %%I in ("%DOC%") do (
    set "DOC_DIR=%%~dpI"
    set "DOC_FILE=%%~nxI"
)

if not defined DOC_DIR set "DOC_DIR=%CD%\"
if not defined DOC_FILE set "DOC_FILE=main.tex"

pushd "%DOC_DIR%" >nul 2>&1
if errorlevel 1 exit /b 1

pdflatex -synctex=1 -halt-on-error -interaction=nonstopmode -file-line-error "%DOC_FILE%"
if errorlevel 1 goto :fail

pdflatex -synctex=1 -halt-on-error -interaction=nonstopmode -file-line-error "%DOC_FILE%"
if errorlevel 1 goto :fail

popd >nul
exit /b 0

:fail
set "ERR=%ERRORLEVEL%"
popd >nul
exit /b %ERR%
