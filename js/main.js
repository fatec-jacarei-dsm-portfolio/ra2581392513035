import { HeroSection, ProjectsSection, SkillsSection } from './sections.js';
import { DOMUtils, ScrollUtils } from './utils.js';
import portfolioConfig from './config.js';

/**
 * Classe principal do aplicativo (Single Responsibility Principle)
 */
class PortfolioApp {
    constructor() {
        this.sections = new Map();
        this.isInitialized = false;
    }
    
    /**
     * Inicializa o aplicativo
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.waitForDOM();
            this.initializeSections();
            this.setupGlobalEventListeners();
            this.setupScrollBehavior();
            this.isInitialized = true;
            
            console.log('Portfólio inicializado com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar portfólio:', error);
        }
    }
    
    /**
     * Aguarda o DOM estar pronto
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    /**
     * Inicializa todas as seções
     */
    initializeSections() {
        // Dependency Injection Pattern
        const sectionClasses = [
            { name: 'hero', class: HeroSection },
            { name: 'projects', class: ProjectsSection },
            { name: 'skills', class: SkillsSection }
        ];
        
        sectionClasses.forEach(({ name, class: SectionClass }) => {
            try {
                const section = new SectionClass();
                section.init();
                this.sections.set(name, section);
            } catch (error) {
                console.warn(`Erro ao inicializar seção ${name}:`, error);
            }
        });
    }
    
    /**
     * Configura event listeners globais
     */
    setupGlobalEventListeners() {
        // Listener para redimensionamento da janela
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));
        
        // Listener para scroll
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16)); // ~60fps
        
        // Listener para mudanças de preferência de movimento
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', () => {
            this.handleMotionPreferenceChange(mediaQuery.matches);
        });
    }
    
    /**
     * Configura comportamento de scroll
     */
    setupScrollBehavior() {
        if (portfolioConfig.scroll.smooth) {
            // Adiciona scroll suave para links internos
            const internalLinks = DOMUtils.querySelectorAll('a[href^="#"]');
            internalLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    ScrollUtils.smoothScrollTo(`#${targetId}`, portfolioConfig.scroll.offset);
                });
            });
        }
    }
    
    /**
     * Manipula redimensionamento da janela
     */
    handleWindowResize() {
        // Atualiza configurações responsivas se necessário
        console.log('Janela redimensionada');
    }
    
    /**
     * Manipula scroll da página
     */
    handleScroll() {
        const scrollPosition = ScrollUtils.getScrollPosition();
        
        // Adiciona classe para header fixo se necessário
        const header = DOMUtils.querySelector('header');
        if (header) {
            if (scrollPosition > 100) {
                DOMUtils.addClass(header, 'scrolled');
            } else {
                DOMUtils.removeClass(header, 'scrolled');
            }
        }
    }
    
    /**
     * Manipula mudança de preferência de movimento
     * @param {boolean} prefersReducedMotion - Se prefere movimento reduzido
     */
    handleMotionPreferenceChange(prefersReducedMotion) {
        portfolioConfig.updateAnimationConfig({
            enabled: !prefersReducedMotion
        });
    }
    
    /**
     * Obtém seção específica
     * @param {string} sectionName - Nome da seção
     * @returns {BaseSection|null}
     */
    getSection(sectionName) {
        return this.sections.get(sectionName) || null;
    }
    
    /**
     * Atualiza dados do usuário
     * @param {object} userData - Dados do usuário
     */
    updateUserData(userData) {
        const heroSection = this.getSection('hero');
        if (heroSection && userData) {
            heroSection.updateUserInfo(userData);
        }
    }
    
    /**
     * Adiciona novo projeto
     * @param {object} projectData - Dados do projeto
     */
    addProject(projectData) {
        const projectsSection = this.getSection('projects');
        if (projectsSection && projectData) {
            projectsSection.addProject(projectData);
        }
    }
    
    /**
     * Adiciona nova habilidade
     * @param {string} skillName - Nome da habilidade
     */
    addSkill(skillName) {
        const skillsSection = this.getSection('skills');
        if (skillsSection && skillName) {
            skillsSection.addSkill(skillName);
        }
    }
    
    /**
     * Função debounce para otimizar performance
     * @param {Function} func - Função a ser executada
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Função throttle para otimizar performance
     * @param {Function} func - Função a ser executada
     * @param {number} limit - Limite de tempo em ms
     * @returns {Function}
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Inicializa o aplicativo
const app = new PortfolioApp();
app.init();

// Expõe o app globalmente para facilitar debugging e extensões
window.PortfolioApp = app;

// Exemplo de como usar as funcionalidades (pode ser removido em produção)
window.addEventListener('load', () => {
    // atualização de dados do usuário
    app.updateUserData({
         name: 'Matheus Sales',
         summary: 'Sou Analista Clínico em transição de carreira para Desenvolvedor de Sistemas. Tenho experiência com análise de dados, atenção aos detalhes e resolução de problemas — habilidades que agora aplico na programação. Estudo tecnologias como HTML, CSS, JavaScript e Node.js, com foco em desenvolvimento web e APIs. Busco minha primeira oportunidade na área tech para aplicar meu conhecimento, crescer profissionalmente e contribuir com soluções eficientes e bem estruturadas.'
     });
    
    // adição de projeto
     app.addProject({
         title: 'Sistema web acadêmico',
         description: 'Desenvolver um sistema web para que a comunidade acadêmica possa consultar os horários das aulas',
         link: 'https://github.com/prjDevflow/prj_1sem_client'
     });
    
    // Exemplo de adição de habilidade
    // app.addSkill('Vue.js');
});

export default app;


