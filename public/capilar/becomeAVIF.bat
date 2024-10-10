@echo off
for %%i in (*.jpg *.jpeg *.png) do ffmpeg -i "%%i" "%%~ni.avif"
pause
