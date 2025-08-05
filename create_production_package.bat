@echo off
echo.
echo ==========================================
echo    📦 ReMeow Production Package Creator 
echo ==========================================
echo.

:: Crear carpeta temporal para archivos de producción
if exist "production" rmdir /s /q "production"
mkdir production
mkdir production\assets

echo 🔄 Copiando archivos necesarios...

:: Copiar archivos principales
copy index.html production\ >nul
copy styles.css production\ >nul
copy script.js production\ >nul
copy config.js production\ >nul

:: Copiar assets
copy assets\*.* production\assets\ >nul

echo.
echo ✅ Archivos copiados a carpeta 'production':
echo    📄 index.html
echo    🎨 styles.css  
echo    ⚡ script.js
echo    ⚙️  config.js
echo    🖼️  assets/
echo.
echo 📦 Ahora puedes:
echo    1. Comprimir la carpeta 'production' en ZIP
echo    2. Subir el ZIP a Hostinger public_html
echo    3. Extraer en el servidor
echo.
echo 🌐 O simplemente arrastrar todos los archivos
echo    de la carpeta 'production' al File Manager
echo.
pause
