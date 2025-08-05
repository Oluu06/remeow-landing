@echo off
echo.
echo ==========================================
echo    🐱 ReMeow Quick Launch Update Tool 🚀
echo ==========================================
echo.

set /p CONTRACT_ADDRESS="Ingresa el contract address: "

if "%CONTRACT_ADDRESS%"=="" (
    echo ❌ Error: Debes ingresar un contract address
    pause
    exit /b 1
)

echo.
echo 🔄 Actualizando configuración...

:: Backup del config original
copy config.js config_backup.js >nul

:: Crear el nuevo config
(
echo // 🐱 ReMeow Configuration - UPDATED FOR LAUNCH
echo // Token is now LIVE!
echo.
echo const REMEOW_CONFIG = ^{
echo     // Token Contract Address - LIVE CONTRACT
echo     contractAddress: "%CONTRACT_ADDRESS%",
echo     
echo     // Token Details
echo     tokenName: "ReMeow",
echo     tokenSymbol: "$REMEOW",
echo     totalSupply: "420,690,000",
echo     
echo     // Network Information
echo     network: "Solana",
echo     decimals: 9,
echo     
echo     // Launch Status - NOW LIVE!
echo     isLaunched: true,
echo     launchDate: "%date%",
echo     
echo     // Marketing Messages
echo     messages: ^{
echo         prelaunch: "🚀 Launch Imminent - Stay Tuned!",
echo         postlaunch: "🎉 We're Live! Trade Now!",
echo         comingSoon: "Loading contract address..."
echo     ^},
echo     
echo     // Social Links
echo     social: ^{
echo         twitter: "",
echo         telegram: "",
echo         discord: "",
echo         github: "https://github.com/Oluu06/remeow-landing"
echo     ^}
echo ^};
echo.
echo // Export for use in other files
echo if ^^^(typeof module !== 'undefined' ^^^&^^^& module.exports^^^) ^^^{
echo     module.exports = REMEOW_CONFIG;
echo ^^^}
) > config.js

echo ✅ Configuración actualizada!
echo 📋 Contract Address: %CONTRACT_ADDRESS%
echo 🚀 Estado: LIVE
echo.
echo 📁 Archivos actualizados:
echo    - config.js (nuevo)
echo    - config_backup.js (respaldo)
echo.
echo 🌐 Ahora sube los archivos a tu hosting!
echo.
pause
