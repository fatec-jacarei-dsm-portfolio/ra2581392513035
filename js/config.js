/**
 * Arquivo de configuração do portfólio
 * Seguindo princípios de Single Responsibility e Open/Closed
 */

class PortfolioConfig {
    constructor() {
        this.animations = {
            enabled: true,
            duration: 300,
            easing: 'ease-in-out'
        };
        
        this.scroll = {
            smooth: true,
            offset: 80
        };
        
        this.theme = {
            darkModeEnabled: false,
            primaryColor: '#3498db',
            secondaryColor: '#2ecc71'
        };
        
        this.sections = {
            hero: { enabled: true, animationDelay: 100 },
            projects: { enabled: true, animationDelay: 200 },
            skills: { enabled: true, animationDelay: 300 }
        };
    }
    
    /**
     * Obtém configuração de uma seção específica
     * @param {string} sectionName - Nome da seção
     * @returns {object} Configuração da seção
     */
    getSectionConfig(sectionName) {
        return this.sections[sectionName] || {};
    }
    
    /**
     * Atualiza configuração de animações
     * @param {object} newConfig - Nova configuração
     */
    updateAnimationConfig(newConfig) {
        this.animations = { ...this.animations, ...newConfig };
    }
    
    /**
     * Verifica se animações estão habilitadas
     * @returns {boolean}
     */
    areAnimationsEnabled() {
        return this.animations.enabled && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

// Exporta instância singleton
const portfolioConfig = new PortfolioConfig();
export default portfolioConfig;

