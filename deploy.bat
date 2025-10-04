@echo off
REM PM Standards Hub - Windows Deployment Script
REM This script helps deploy the application to various platforms

echo.
echo 🚀 PM Standards Hub Deployment Script
echo =====================================
echo.

REM Check if required files exist
echo [INFO] Checking required files...
if not exist "index.html" (
    echo [ERROR] Missing index.html
    goto :error
)
if not exist "styles.css" (
    echo [ERROR] Missing styles.css
    goto :error
)
if not exist "script.js" (
    echo [ERROR] Missing script.js
    goto :error
)
if not exist "README.md" (
    echo [ERROR] Missing README.md
    goto :error
)
if not exist "package.json" (
    echo [ERROR] Missing package.json
    goto :error
)
echo [SUCCESS] All required files present

REM Validate HTML structure
echo [INFO] Validating HTML structure...
findstr /C:"<!DOCTYPE html>" index.html >nul
if errorlevel 1 (
    echo [ERROR] HTML structure is invalid
    goto :error
)
findstr /C:"</html>" index.html >nul
if errorlevel 1 (
    echo [ERROR] HTML structure is invalid
    goto :error
)
echo [SUCCESS] HTML structure is valid

REM Check for common issues
echo [INFO] Checking for common issues...
findstr /C:"href=\"#\"" index.html >nul
if not errorlevel 1 (
    echo [WARNING] Found placeholder links (href='#')
)
findstr /C:"console.log" script.js >nul
if not errorlevel 1 (
    echo [WARNING] Found console.log statements in production code
)

REM Create deployment package
echo [INFO] Creating deployment package...
set package_name=pm-standards-hub-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.zip
set package_name=%package_name: =0%
powershell Compress-Archive -Path "index.html","styles.css","script.js","README.md","package.json","LICENSE" -DestinationPath "%package_name%"
echo [SUCCESS] Deployment package created: %package_name%

REM Create Netlify configuration
echo [INFO] Preparing for Netlify deployment...
(
echo [build]
echo   publish = "."
echo   command = "echo 'No build process needed'"
echo.
echo [[redirects]]
echo   from = "/*"
echo   to = "/index.html"
echo   status = 200
echo.
echo [build.environment]
echo   NODE_VERSION = "18"
) > netlify.toml
echo [SUCCESS] netlify.toml created

REM Create Vercel configuration
echo [INFO] Preparing for Vercel deployment...
(
echo {
echo   "version": 2,
echo   "builds": [
echo     {
echo       "src": "index.html",
echo       "use": "@vercel/static"
echo     }
echo   ],
echo   "routes": [
echo     {
echo       "src": "/(.*)",
echo       "dest": "/index.html"
echo     }
echo   ]
echo }
) > vercel.json
echo [SUCCESS] vercel.json created

REM Check for Git repository
echo [INFO] Checking for GitHub Pages deployment...
if exist ".git" (
    echo [INFO] Git repository detected
    echo [WARNING] To deploy to GitHub Pages:
    echo   1. Push your changes to GitHub
    echo   2. Go to repository Settings ^> Pages
    echo   3. Select 'Deploy from a branch'
    echo   4. Choose 'main' branch and '/ (root)' folder
) else (
    echo [WARNING] Not a git repository
)

echo.
echo [SUCCESS] Deployment preparation complete!
echo.
echo [INFO] Next steps:
echo   1. Test the application locally
echo   2. Choose your deployment platform
echo   3. Follow the platform-specific instructions above
echo   4. Update your README.md with deployment URLs
echo.
echo [INFO] Files created:
echo   - Deployment package (.zip)
echo   - netlify.toml (for Netlify)
echo   - vercel.json (for Vercel)
echo.
goto :end

:error
echo.
echo [ERROR] Deployment aborted due to errors
exit /b 1

:end
pause
