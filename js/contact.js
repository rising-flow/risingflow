// Contact Page Translations
const contactTranslations = {
    'pt-BR': {
        contactTitle: 'Fale Conosco',
        name: 'Nome',
        namePlaceholder: 'Digite seu nome aqui',
        email: 'Email',
        emailPlaceholder: 'seu email aqui',
        message: 'Mensagem',
        messagePlaceholder: 'sua mensagem aqui',
        sendMessage: 'Enviar Mensagem',
        thankYou: 'Obrigado!',
        appreciate: 'Agradecemos sua mensagem e entraremos em contato o mais breve possível.',
        backToHome: 'Voltar para o Início',
        directEmail: 'Ou envie um email diretamente para <a href="mailto:contact@risingflow.com.br">contact@risingflow.com.br</a>'
    },
    'en-GB': {
        contactTitle: 'Contact Us',
        name: 'Name',
        namePlaceholder: 'Type your name here',
        email: 'Email',
        emailPlaceholder: 'your email here',
        message: 'Message',
        messagePlaceholder: 'your message here',
        sendMessage: 'Send Message',
        thankYou: 'Thank You!',
        appreciate: 'We appreciate your message and will get in touch as soon as possible.',
        backToHome: 'Back to Home',
        directEmail: 'Or email us directly at <a href="mailto:contact@risingflow.com.br">contact@risingflow.com.br</a>'
    }
};
function getCurrentLang() {
    if (window.getCurrentLang) return window.getCurrentLang();
    const btn = document.getElementById('language-flag');
    if (btn && btn.dataset.lang) {
        return btn.dataset.lang === 'en-GB' ? 'en-GB' : 'pt-BR';
    }
    return 'pt-BR';
}
function updateContactPageUI() {
    const lang = getCurrentLang();
    const t = contactTranslations[lang];
    document.title = lang === 'pt-BR' ? 'Rising Flow - Contato' : 'Rising Flow - Contact';
    document.getElementById('contact-title').textContent = t.contactTitle;
    document.getElementById('label-name').textContent = t.name;
    document.getElementById('name').placeholder = t.namePlaceholder;
    document.getElementById('label-email').textContent = t.email;
    document.getElementById('email').placeholder = t.emailPlaceholder;
    document.getElementById('label-message').textContent = t.message;
    document.getElementById('message').placeholder = t.messagePlaceholder;
    document.getElementById('send-btn').innerHTML = '<i class="fas fa-paper-plane"></i> ' + t.sendMessage;
    document.getElementById('modal-title').textContent = t.thankYou;
    document.getElementById('modal-message').textContent = t.appreciate;
    document.getElementById('closeModalBtn').textContent = t.backToHome;
    document.getElementById('direct-email').innerHTML = t.directEmail;
    // Update email link title
    document.getElementById('email-link').title = t.sendMessage;
}
// Listen for language changes
const contactLanguageFlagButton = document.getElementById('language-flag');
if (contactLanguageFlagButton) {
    contactLanguageFlagButton.addEventListener('click', () => {
        setTimeout(() => {
            updateContactPageUI();
        }, 0);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    updateContactPageUI();
    // AJAX form submission and modal logic
    const form = document.getElementById('contactForm');
    const modalEl = document.getElementById('thankYouModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    let bsModal = null;
    if (window.bootstrap && window.bootstrap.Modal) {
        bsModal = new bootstrap.Modal(modalEl);
    }
    // Bootstrap validation
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