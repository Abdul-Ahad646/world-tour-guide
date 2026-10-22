@echo off
cd /d "%~dp0"
echo ============================================
echo   World Tour Guide - Git Upload
echo ============================================
echo.
set /p DELOLD=Delete old bad files (plan.html, banner-plan.svg, explore.html, logo.svg)? (y/n):
if /i "%DELOLD%"=="y" (
  if exist plan.html del /q plan.html
  if exist banner-plan.svg del /q banner-plan.svg
  if exist explore.html del /q explore.html
  if exist logo.svg del /q logo.svg
  echo Old files deleted.
)
echo.
set "MSG="
set /p MSG=Commit message (Enter dile: World Tour Guide update):
if "%MSG%"=="" set "MSG=World Tour Guide update"
echo.
echo Git add hocche...
git add -A
echo Commit hocche...
git commit -m "%MSG%"
echo Push hocche...
git push
if errorlevel 1 git push -u origin HEAD
echo.
echo ============================================
echo   Hoye geche! Uporer lekha poro - error
echo   thakle screenshot niye Luna ke pathao.
echo ============================================
pause
