// Contact Page Translations
const contactTranslations = {
    'pt-BR': {
        contactTitle: 'Fale Conosco',
        name: 'Nome',
        namePlaceholder: 'Digite seu nome aqui',
        email: 'Email',
        emailPlaceholder: 'Digite seu email aqui',
        message: 'Mensagem',
        messagePlaceholder: 'Digite sua mensagem aqui',
        sendMessage: 'Enviar Mensagem',
        thankYou: 'Obrigado!',
        appreciate: 'Agradecemos sua mensagem e entraremos em contato o mais breve possível.',
        backToHome: 'Voltar para o Início',
        directEmail: 'Ou envie um email diretamente para <a href="mailto:contact@risingflow.com.br">contact@risingflow.com.br</a>',
        invalidName: 'Por favor, insira seu nome.',
        invalidEmail: 'Por favor, insira um email válido.',
        invalidMessage: 'Por favor, insira sua mensagem.'
    },
    'en-GB': {
        contactTitle: 'Contact Us',
        name: 'Name',
        namePlaceholder: 'Type your name here',
        email: 'Email',
        emailPlaceholder: 'Type your email here',
        message: 'Message',
        messagePlaceholder: 'Type your message here',
        sendMessage: 'Send Message',
        thankYou: 'Thank You!',
        appreciate: 'We appreciate your message and will get in touch as soon as possible.',
        backToHome: 'Back to Home',
        directEmail: 'Or email us directly at <a href="mailto:contact@risingflow.com.br">contact@risingflow.com.br</a>',
        invalidName: 'Please enter your name.',
        invalidEmail: 'Please enter a valid email.',
        invalidMessage: 'Please enter your message.'
    }
};
// Only keep translation data and updateContactPageUI
// Remove custom event listeners and flag logic
// The global script.js will handle the language switching and flag
// Optionally, expose updateContactPageUI for the global switcher
window.updateContactPageUI = function() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'pt-BR';
    const t = contactTranslations[lang];
    document.title = lang === 'pt-BR' ? 'Rising Flow - Contato' : 'Rising Flow - Contact';
    document.getElementById('contact-title').textContent = t.contactTitle;
    document.getElementById('label-name').textContent = t.name;
    document.getElementById('name').placeholder = t.namePlaceholder;
    document.getElementById('invalid-name').textContent = t.invalidName;
    document.getElementById('label-email').textContent = t.email;
    document.getElementById('email').placeholder = t.emailPlaceholder;
    document.getElementById('invalid-email').textContent = t.invalidEmail;
    document.getElementById('label-message').textContent = t.message;
    document.getElementById('message').placeholder = t.messagePlaceholder;
    document.getElementById('invalid-message').textContent = t.invalidMessage;
    document.getElementById('send-btn').innerHTML = '<i class="fas fa-paper-plane"></i> ' + t.sendMessage;
    document.getElementById('modal-title').textContent = t.thankYou;
    document.getElementById('modal-message').textContent = t.appreciate;
    document.getElementById('closeModalBtn').textContent = t.backToHome;
    document.getElementById('direct-email').innerHTML = t.directEmail;
    // Update email link title
    document.getElementById('email-link').title = t.sendMessage;
};

document.addEventListener('DOMContentLoaded', () => {
    window.updateContactPageUI();
    // AJAX form submission and modal logic
    const form = document.getElementById('contactForm');
    const modalEl = document.getElementById('thankYouModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    let bsModal = null;
    if (window.bootstrap && window.bootstrap.Modal) {
        bsModal = new bootstrap.Modal(modalEl);
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        const formData = new FormData(form);
        fetch('https://formspree.io/f/xvgqapob', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                form.reset();
                form.classList.remove('was-validated');
                if (bsModal) {
                    bsModal.show();
                } else {
                    modalEl.style.display = 'flex';
                }
            } else {
                response.json().then(data => {
                    alert(data.error || 'There was a problem sending your message. Please try again later.');
                });
            }
        })
        .catch(() => {
            alert('There was a problem sending your message. Please try again later.');
        });
    });
    // Redirect to home after modal closes
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', function () {
            window.location.href = 'https://risingflow.com.br/';
        });
    }
    // Fallback for manual close button (if modal API fails)
    closeModalBtn.addEventListener('click', function() {
        if (!window.bootstrap || !window.bootstrap.Modal) {
            window.location.href = 'https://risingflow.com.br/';
        }
    });
}); 