/**
 * Classes para gerenciar seções do portfólio
 * Seguindo princípios SOLID e DDD
 */

import { DOMUtils, AnimationUtils, ScrollUtils } from './utils.js';
import portfolioConfig from './config.js';

/**
 * Classe base para seções (Interface Segregation Principle)
 */
class BaseSection {
    constructor(sectionId) {
        this.sectionId = sectionId;
        this.element = DOMUtils.querySelector(`#${sectionId}`);
        this.config = portfolioConfig.getSectionConfig(sectionId);
        this.isInitialized = false;
    }
    
    /**
     * Inicializa a seção
     */
    init() {
        if (!this.element || this.isInitialized) return;
        
        this.setupEventListeners();
        this.setupAnimations();
        this.isInitialized = true;
    }
    
    /**
     * Configura event listeners (deve ser implementado pelas subclasses)
     */
    setupEventListeners() {
        // Implementação padrão vazia
    }
    
    /**
     * Configura animações (deve ser implementado pelas subclasses)
     */
    setupAnimations() {
        if (portfolioConfig.areAnimationsEnabled()) {
            AnimationUtils.observeElements(`#${this.sectionId}`, (element) => {
                AnimationUtils.fadeIn(element, this.config.animationDelay || 0);
            });
        }
    }
}

/**
 * Gerenciador da seção Hero
 */
class HeroSection extends BaseSection {
    constructor() {
        super('hero');
        this.profilePicture = DOMUtils.querySelector('.profile-picture-container');
    }
    
    setupEventListeners() {
        if (this.profilePicture) {
            this.profilePicture.addEventListener('click', () => {
                this.handleProfileClick();
            });
        }
    }
    
    setupAnimations() {
        super.setupAnimations();
        
        if (portfolioConfig.areAnimationsEnabled()) {
            // Animação especial para a foto de perfil
            AnimationUtils.observeElements('.profile-picture-container', (element) => {
                setTimeout(() => {
                    element.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 200);
                }, 500);
            });
        }
    }
    
    /**
     * Manipula clique na foto de perfil
     */
    handleProfileClick() {
        if (portfolioConfig.areAnimationsEnabled()) {
            this.profilePicture.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.profilePicture.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    /**
     * Atualiza informações do usuário
     * @param {object} userInfo - Informações do usuário
     */
    updateUserInfo(userInfo) {
        const nameElement = DOMUtils.querySelector('.hero-content h1');
        const taglineElement = DOMUtils.querySelector('.tagline');
        const summaryElement = DOMUtils.querySelector('.summary-text');
        
        if (nameElement && userInfo.name) {
            nameElement.textContent = `Olá, eu sou ${userInfo.name}`;
        }
        
        if (taglineElement && userInfo.tagline) {
            taglineElement.textContent = userInfo.tagline;
        }
        
        if (summaryElement && userInfo.summary) {
            summaryElement.textContent = userInfo.summary;
        }
    }
}

/**
 * Gerenciador da seção de Projetos
 */
class ProjectsSection extends BaseSection {
    constructor() {
        super('projects');
        this.projectCards = DOMUtils.querySelectorAll('.project-card');
    }
    
    setupEventListeners() {
        this.projectCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.handleCardHover(card, false);
            });
            
            const link = card.querySelector('.project-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    this.handleProjectClick(e, index);
                });
            }
        });
    }
    
    setupAnimations() {
        super.setupAnimations();
        
        if (portfolioConfig.areAnimationsEnabled()) {
            AnimationUtils.observeElements('.project-card', (element) => {
                const index = Array.from(this.projectCards).indexOf(element);
                AnimationUtils.fadeIn(element, index * 100);
            });
        }
    }
    
    /**
     * Manipula hover nos cards de projeto
     * @param {Element} card - Card do projeto
     * @param {boolean} isHovering - Se está em hover
     */
    handleCardHover(card, isHovering) {
        if (!portfolioConfig.areAnimationsEnabled()) return;
        
        if (isHovering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    }
    
    /**
     * Manipula clique em projeto
     * @param {Event} event - Evento de clique
     * @param {number} projectIndex - Índice do projeto
     */
    handleProjectClick(event, projectIndex) {
        const link = event.target;
        const href = link.getAttribute('href');
        
        // Se for um link placeholder (#), previne navegação
        if (href === '#') {
            event.preventDefault();
            console.log(`Projeto ${projectIndex + 1} clicado - Configure o link real`);
        }
    }
    
    /**
     * Adiciona novo projeto
     * @param {object} projectData - Dados do projeto
     */
    addProject(projectData) {
        const projectsGrid = DOMUtils.querySelector('.projects-grid');
        if (!projectsGrid) return;
        
        const projectCard = document.createElement('article');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${projectData.title}</h3>
            <p class="project-description">${projectData.description}</p>
            <a href="${projectData.link}" class="project-link">Ver Projeto</a>
        `;
        
        projectsGrid.appendChild(projectCard);
        this.setupProjectCard(projectCard);
    }
    
    /**
     * Configura um card de projeto específico
     * @param {Element} card - Card do projeto
     */
    setupProjectCard(card) {
        card.addEventListener('mouseenter', () => {
            this.handleCardHover(card, true);
        });
        
        card.addEventListener('mouseleave', () => {
            this.handleCardHover(card, false);
        });
    }
}

/**
 * Gerenciador da seção de Habilidades
 */
class SkillsSection extends BaseSection {
    constructor() {
        super('skills');
        this.skillTags = DOMUtils.querySelectorAll('.skill-tag');
    }
    
    setupEventListeners() {
        this.skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.handleSkillClick(tag);
            });
        });
    }
    
    setupAnimations() {
        super.setupAnimations();
        
        if (portfolioConfig.areAnimationsEnabled()) {
            AnimationUtils.observeElements('.skill-tag', (element) => {
                const index = Array.from(this.skillTags).indexOf(element);
                AnimationUtils.fadeIn(element, index * 50);
            });
        }
    }
    
    /**
     * Manipula clique em habilidade
     * @param {Element} tag - Tag da habilidade
     */
    handleSkillClick(tag) {
        const skillName = tag.textContent;
        console.log(`Habilidade clicada: ${skillName}`);
        
        if (portfolioConfig.areAnimationsEnabled()) {
            tag.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    /**
     * Adiciona nova habilidade
     * @param {string} skillName - Nome da habilidade
     */
    addSkill(skillName) {
        const skillsGrid = DOMUtils.querySelector('.skills-grid');
        if (!skillsGrid) return;
        
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skillName;
        
        skillsGrid.appendChild(skillTag);
        this.setupSkillTag(skillTag);
    }
    
    /**
     * Configura uma tag de habilidade específica
     * @param {Element} tag - Tag da habilidade
     */
    setupSkillTag(tag) {
        tag.addEventListener('click', () => {
            this.handleSkillClick(tag);
        });
    }
}

export { HeroSection, ProjectsSection, SkillsSection };

