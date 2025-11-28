/**
 * Utilitários gerais do portfólio
 * Seguindo princípio de Single Responsibility
 */

class DOMUtils {
    /**
     * Seleciona elemento do DOM com tratamento de erro
     * @param {string} selector - Seletor CSS
     * @returns {Element|null}
     */
    static querySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Erro ao selecionar elemento: ${selector}`, error);
            return null;
        }
    }
    
    /**
     * Seleciona múltiplos elementos do DOM
     * @param {string} selector - Seletor CSS
     * @returns {NodeList}
     */
    static querySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Erro ao selecionar elementos: ${selector}`, error);
            return [];
        }
    }
    
    /**
     * Adiciona classe com verificação
     * @param {Element} element - Elemento DOM
     * @param {string} className - Nome da classe
     */
    static addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    }
    
    /**
     * Remove classe com verificação
     * @param {Element} element - Elemento DOM
     * @param {string} className - Nome da classe
     */
    static removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    }
    
    /**
     * Verifica se elemento possui classe
     * @param {Element} element - Elemento DOM
     * @param {string} className - Nome da classe
     * @returns {boolean}
     */
    static hasClass(element, className) {
        return element && className && element.classList.contains(className);
    }
}

class AnimationUtils {
    /**
     * Aplica animação de fade in
     * @param {Element} element - Elemento a ser animado
     * @param {number} delay - Delay da animação em ms
     */
    static fadeIn(element, delay = 0) {
        if (!element) return;
        
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, delay);
    }
    
    /**
     * Observa elementos para animação no scroll
     * @param {string} selector - Seletor dos elementos
     * @param {function} callback - Função de callback
     */
    static observeElements(selector, callback) {
        const elements = DOMUtils.querySelectorAll(selector);
        
        if (!elements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => observer.observe(element));
    }
}

class ScrollUtils {
    /**
     * Scroll suave para elemento
     * @param {string} selector - Seletor do elemento
     * @param {number} offset - Offset do scroll
     */
    static smoothScrollTo(selector, offset = 0) {
        const element = DOMUtils.querySelector(selector);
        if (!element) return;
        
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
    
    /**
     * Obtém posição atual do scroll
     * @returns {number}
     */
    static getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
    
    /**
     * Verifica se elemento está visível na viewport
     * @param {Element} element - Elemento a verificar
     * @returns {boolean}
     */
    static isElementVisible(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

class ValidationUtils {
    /**
     * Valida se string não está vazia
     * @param {string} value - Valor a validar
     * @returns {boolean}
     */
    static isNotEmpty(value) {
        return typeof value === 'string' && value.trim().length > 0;
    }
    
    /**
     * Valida URL
     * @param {string} url - URL a validar
     * @returns {boolean}
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Valida email
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Exporta as classes utilitárias
export { DOMUtils, AnimationUtils, ScrollUtils, ValidationUtils };