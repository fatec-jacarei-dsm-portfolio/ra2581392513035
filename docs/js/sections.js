/**
 * Classes para gerenciar seções do portfólio
 *
 * O conteúdo do portfólio vive no HTML estático. Estas classes cuidam apenas
 * do comportamento: revelar blocos conforme entram na viewport e oferecer uma
 * API para acrescentar itens dinamicamente. Efeitos de hover são
 * responsabilidade exclusiva do CSS, para que as duas camadas não disputem as
 * mesmas propriedades.
 */

import { DOMUtils, AnimationUtils } from './utils.js';
import portfolioConfig from './config.js';

/**
 * Classe base para seções
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
     * Configura event listeners (sobrescrito pelas subclasses quando preciso)
     */
    setupEventListeners() {
        // Implementação padrão vazia
    }

    /**
     * Revela a seção inteira quando ela entra na viewport
     */
    setupAnimations() {
        this.revealOnScroll(`#${this.sectionId}`);
    }

    /**
     * Revela os elementos de um seletor, escalonando o atraso entre eles.
     * @param {string} selector - Seletor dos elementos
     * @param {number} step - Atraso adicional por elemento, em ms
     */
    revealOnScroll(selector, step = 0) {
        if (!portfolioConfig.areAnimationsEnabled()) return;

        const baseDelay = this.config.animationDelay || 0;
        const maxStaggered = 3;
        let revealed = 0;

        AnimationUtils.observeElements(selector, (element) => {
            // O escalonamento tem teto de propósito: sem ele, um item que só
            // aparece no fim da página acumularia centenas de milissegundos de
            // atraso e ficaria invisível depois que o leitor já rolou até ele.
            const delay = baseDelay + Math.min(revealed, maxStaggered) * step;
            AnimationUtils.fadeIn(element, delay);
            revealed += 1;
        });
    }
}

/**
 * Gerenciador da seção Hero
 */
class HeroSection extends BaseSection {
    constructor() {
        super('hero');
    }

    /**
     * Atualiza informações do usuário
     * @param {object} userInfo - Informações do usuário
     */
    updateUserInfo(userInfo) {
        if (!userInfo) return;

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
    }

    setupAnimations() {
        this.revealOnScroll('.project-card', 100);
    }

    /**
     * Acrescenta um projeto a um dos grupos da seção.
     * Monta o cartão pela API do DOM (e não por innerHTML) para que qualquer
     * texto recebido seja tratado como texto, nunca como marcação.
     * @param {object} projectData - Dados do projeto
     * @param {string} [groupSelector] - Grade de destino
     */
    addProject(projectData, groupSelector = '.projects-grid') {
        const projectsGrid = DOMUtils.querySelector(groupSelector);
        if (!projectsGrid || !projectData) return;

        const card = document.createElement('article');
        card.className = 'project-card';

        if (projectData.semester) {
            const semester = document.createElement('p');
            semester.className = 'project-semester';
            semester.textContent = projectData.semester;
            card.appendChild(semester);
        }

        const title = document.createElement('h4');
        title.textContent = projectData.title || '';
        card.appendChild(title);

        const description = document.createElement('p');
        description.className = 'project-description';
        description.textContent = projectData.description || '';
        card.appendChild(description);

        if (projectData.technologies && projectData.technologies.length) {
            const technologies = document.createElement('div');
            technologies.className = 'project-technologies';

            projectData.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                technologies.appendChild(tag);
            });

            card.appendChild(technologies);
        }

        if (projectData.contributions && projectData.contributions.length) {
            const contributions = document.createElement('div');
            contributions.className = 'project-contributions';

            const heading = document.createElement('h5');
            heading.textContent = 'Contribuição pessoal';
            contributions.appendChild(heading);

            const list = document.createElement('ul');
            projectData.contributions.forEach(contribution => {
                const item = document.createElement('li');
                item.textContent = contribution;
                list.appendChild(item);
            });

            contributions.appendChild(list);
            card.appendChild(contributions);
        }

        if (projectData.link) {
            const links = document.createElement('p');
            links.className = 'project-links';

            const link = document.createElement('a');
            link.className = 'project-link';
            link.href = projectData.link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Ver repositório';

            links.appendChild(link);
            card.appendChild(links);
        }

        projectsGrid.appendChild(card);
    }
}

/**
 * Gerenciador da seção de Habilidades
 */
class SkillsSection extends BaseSection {
    constructor() {
        super('skills');
    }

    setupAnimations() {
        this.revealOnScroll('.skills-group', 80);
    }

    /**
     * Adiciona nova habilidade
     * @param {string} skillName - Nome da habilidade
     * @param {string} [groupSelector] - Grupo de destino
     */
    addSkill(skillName, groupSelector = '.skills-grid') {
        const skillsGrid = DOMUtils.querySelector(groupSelector);
        if (!skillsGrid || !skillName) return;

        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skillName;

        skillsGrid.appendChild(skillTag);
    }
}

/**
 * Gerenciador da seção de Informações Adicionais
 */
class AdditionalInfoSection extends BaseSection {
    constructor() {
        super('additional-info');
    }

    setupAnimations() {
        this.revealOnScroll('.info-card', 100);
    }
}

/**
 * Gerenciador da seção de Contatos
 */
class ContactSection extends BaseSection {
    constructor() {
        super('contact');
    }

    setupAnimations() {
        this.revealOnScroll('.contact-link', 100);
    }
}

export { HeroSection, ProjectsSection, SkillsSection, AdditionalInfoSection, ContactSection };
