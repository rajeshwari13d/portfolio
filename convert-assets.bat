@echo off
echo Converting HTML placeholders to images...
echo.

REM Check if Chrome is available
where chrome >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Chrome not found in PATH. Please install Chrome or add it to PATH.
    echo Alternative: Use online tools like html-to-image converters
    pause
    exit /b
)

REM Create screenshots using Chrome headless mode
echo Converting client avatars...
chrome --headless --disable-gpu --screenshot="assets\client-1.jpg" --window-size=100,100 "assets\client-1.html"
chrome --headless --disable-gpu --screenshot="assets\client-2.jpg" --window-size=100,100 "assets\client-2.html"  
chrome --headless --disable-gpu --screenshot="assets\client-3.jpg" --window-size=100,100 "assets\client-3.html"

echo Converting blog images...
chrome --headless --disable-gpu --screenshot="assets\blog-1.jpg" --window-size=400,250 "assets\blog-1.html"
chrome --headless --disable-gpu --screenshot="assets\blog-2.jpg" --window-size=400,250 "assets\blog-2.html"
chrome --headless --disable-gpu --screenshot="assets\blog-3.jpg" --window-size=400,250 "assets\blog-3.html"

echo.
echo Conversion completed! Check the assets folder for new images.
echo.
echo Next steps:
echo 1. Replace profile picture.jpeg with your actual photo if needed
echo 2. Verify all project screenshots and assets
echo.
pause
