// 🐱 ReMeow Configuration
// Cambiar estos valores cuando el token esté listo

const REMEOW_CONFIG = {
    // Token Contract Address - CAMBIAR CUANDO DESPLIEGUES
    contractAddress: "COMING_SOON_-_LAUNCH_IMMINENT",
    
    // Token Details
    tokenName: "ReMeow",
    tokenSymbol: "$REMEOW",
    totalSupply: "420,690,000",
    
    // Network Information
    network: "Solana", // Cambiado a Solana
    decimals: 9, // Solana usa 9 decimals por defecto
    
    // Links sociales (agregar cuando estén listos)
    social: {
        twitter: "",
        telegram: "",
        discord: "",
        github: "https://github.com/Oluu06/remeow-landing"
    },
    
    // Exchange Links (agregar cuando listen)
    exchanges: {
        uniswap: "",
        dextools: "",
        coinmarketcap: "",
        coingecko: ""
    },
    
    // Launch Status
    isLaunched: false,
    launchDate: "TBA", // To Be Announced
    
    // Marketing Messages
    messages: {
        prelaunch: "🚀 Launch Imminent - Stay Tuned!",
        postlaunch: "🎉 We're Live! Trade Now!",
        comingSoon: "Contract address will be revealed at launch"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = REMEOW_CONFIG;
}
