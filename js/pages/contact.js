/**
 * Contact Page Entry Point
 * Handles contact form functionality and interactions
 */

import UIManager from '../components/UIManager.js';

class ContactPage {
    constructor() {
        this.uiManager = new UIManager();
        this.init();
    }

    init() {
        this.setupContactForm();
        this.updateUI();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Add validation feedback
        const inputs = contactForm?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldErrors(input));
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        if (this.validateForm(data)) {
            this.submitForm(data);
        }
    }

    validateForm(data) {
        let isValid = true;
        
        // Validate required fields
        if (!data.name?.trim()) {
            this.showFieldError('name', 'Nome é obrigatório');
            isValid = false;
        }
        
        if (!data.email?.trim()) {
            this.showFieldError('email', 'Email é obrigatório');
            isValid = false;
        } else if (!this.uiManager.isValidEmail(data.email)) {
            this.showFieldError('email', 'Email inválido');
            isValid = false;
        }
        
        if (!data.message?.trim()) {
            this.showFieldError('message', 'Mensagem é obrigatória');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        
        switch (field.name) {
            case 'name':
                if (!value) {
                    this.showFieldError('name', 'Nome é obrigatório');
                    return false;
                }
                break;
            case 'email':
                if (!value) {
                    this.showFieldError('email', 'Email é obrigatório');
                    return false;
                } else if (!this.uiManager.isValidEmail(value)) {
                    this.showFieldError('email', 'Email inválido');
                    return false;
                }
                break;
            case 'message':
                if (!value) {
                    this.showFieldError('message', 'Mensagem é obrigatória');
                    return false;
                }
                break;
        }
        
        this.clearFieldErrors(field);
        return true;
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        field.classList.add('is-invalid');
        
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }

    clearFieldErrors(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }

    async submitForm(data) {
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        const originalText = submitBtn?.textContent;
        
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.uiManager.showModal(
                'successModal',
                'Mensagem Enviada!',
                '<p>Obrigado pelo seu contato! Responderemos em breve.</p>',
                {
                    footer: '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>'
                }
            );
            
            // Reset form
            document.getElementById('contact-form').reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.uiManager.showModal(
                'errorModal',
                'Erro',
                '<p>Ocorreu um erro ao enviar sua mensagem. Tente novamente.</p>',
                {
                    footer: '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
                }
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    }

    updateUI() {
        const currentLang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
        const translations = {
            'pt-BR': {
                pageTitle: 'Rising Flow - Contato',
                contactTitle: 'Entre em Contato',
                nameLabel: 'Nome',
                emailLabel: 'Email',
                subjectLabel: 'Assunto',
                messageLabel: 'Mensagem',
                submitButton: 'Enviar Mensagem',
                namePlaceholder: 'Seu nome',
                emailPlaceholder: 'seu.email@exemplo.com',
                subjectPlaceholder: 'Assunto da mensagem',
                messagePlaceholder: 'Escreva sua mensagem aqui...'
            },
            'en-GB': {
                pageTitle: 'Rising Flow - Contact',
                contactTitle: 'Get in Touch',
                nameLabel: 'Name',
                emailLabel: 'Email',
                subjectLabel: 'Subject',
                messageLabel: 'Message',
                submitButton: 'Send Message',
                namePlaceholder: 'Your name',
                emailPlaceholder: 'your.email@example.com',
                subjectPlaceholder: 'Message subject',
                messagePlaceholder: 'Write your message here...'
            }
        };

        const t = translations[currentLang];
        if (!t) return;

        document.title = t.pageTitle;

        // Update labels and placeholders
        const contactTitle = document.getElementById('contact-title');
        if (contactTitle) contactTitle.textContent = t.contactTitle;

        const nameLabel = document.querySelector('label[for="name"]');
        if (nameLabel) nameLabel.textContent = t.nameLabel;

        const emailLabel = document.querySelector('label[for="email"]');
        if (emailLabel) emailLabel.textContent = t.emailLabel;

        const subjectLabel = document.querySelector('label[for="subject"]');
        if (subjectLabel) subjectLabel.textContent = t.subjectLabel;

        const messageLabel = document.querySelector('label[for="message"]');
        if (messageLabel) messageLabel.textContent = t.messageLabel;

        const nameField = document.getElementById('name');
        if (nameField) nameField.placeholder = t.namePlaceholder;

        const emailField = document.getElementById('email');
        if (emailField) emailField.placeholder = t.emailPlaceholder;

        const subjectField = document.getElementById('subject');
        if (subjectField) subjectField.placeholder = t.subjectPlaceholder;

        const messageField = document.getElementById('message');
        if (messageField) messageField.placeholder = t.messagePlaceholder;

        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        if (submitBtn) submitBtn.textContent = t.submitButton;
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactPage = new ContactPage();
    
    // Make update function available globally for language switcher
    window.updateContactPageUI = () => contactPage.updateUI();
});