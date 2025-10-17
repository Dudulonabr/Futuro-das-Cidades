

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
    initFormValidation();
});


function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', debounce(() => clearFieldError(input), 300));
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    
    const isValid = validateForm(form);
    if (!isValid) {
        showFormMessage('Por favor, corrija os erros no formulário.', 'error');
        return;
    }
    
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        
        showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        
        form.reset();
        
        
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Formulário enviado com sucesso');
        }
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    
    clearFieldError(field);
    
    
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Este campo é obrigatório.';
        isValid = false;
    }
    
    
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Por favor, insira um e-mail válido.';
            isValid = false;
        }
    }
    
    
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Por favor, insira um telefone válido. Formato: (11) 99999-9999';
            isValid = false;
        }
    }
    
    
    if (fieldName === 'message' && value) {
        if (value.length < 10) {
            errorMessage = 'A mensagem deve ter pelo menos 10 caracteres.';
            isValid = false;
        }
        if (value.length > 1000) {
            errorMessage = 'A mensagem deve ter no máximo 1000 caracteres.';
            isValid = false;
        }
    }
    
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    field.removeAttribute('aria-invalid');
    field.classList.remove('error');
}

function showFormMessage(message, type) {
    
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageElement, form.nextSibling);
    
    
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
    
    
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => toggleFAQ(item));
        }
    });
}

function toggleFAQ(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    
    const allFAQItems = document.querySelectorAll('.faq-item');
    allFAQItems.forEach(faqItem => {
        if (faqItem !== item) {
            const otherQuestion = faqItem.querySelector('.faq-question');
            const otherAnswer = faqItem.querySelector('.faq-answer');
            
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.style.maxHeight = null;
            otherQuestion.classList.remove('active');
        }
    });
    
    
    if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
        question.classList.remove('active');
    } else {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.classList.add('active');
    }
}


function initFormValidation() {
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    
    const messageInput = document.getElementById('message');
    if (messageInput) {
        addCharacterCounter(messageInput, 1000);
    }
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length >= 10) {
        value = value.slice(0, 10) + '-' + value.slice(10, 14);
    }
    
    e.target.value = value;
}

function addCharacterCounter(input, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.innerHTML = `<span class="current">0</span> / ${maxLength} caracteres`;
    
    input.parentNode.appendChild(counter);
    
    const updateCounter = () => {
        const current = input.value.length;
        const currentSpan = counter.querySelector('.current');
        currentSpan.textContent = current;
        
        if (current > maxLength * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    };
    
    input.addEventListener('input', updateCounter);
    updateCounter();
}


const contactStyles = `
<style>
.contact-hero {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: var(--white);
    padding: var(--spacing-4xl) 0;
    text-align: center;
}

.contact-hero-content h1 {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-lg);
    color: var(--white);
}

.contact-hero-content p {
    font-size: var(--font-size-lg);
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
}

.contact-content {
    padding: var(--spacing-4xl) 0;
}

.contact-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-4xl);
}

@media (min-width: 1024px) {
    .contact-layout {
        grid-template-columns: 2fr 1fr;
    }
}

.contact-form-section h2,
.contact-info-section h2 {
    margin-bottom: var(--spacing-2xl);
    color: var(--gray-900);
}

.contact-form {
    background: var(--white);
    padding: var(--spacing-2xl);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--gray-200);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

@media (min-width: 768px) {
    .form-row {
        grid-template-columns: 1fr 1fr;
    }
}

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
    color: var(--gray-900);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--gray-200);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-fast);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: var(--error-color);
}

.error-message {
    color: var(--error-color);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
    display: none;
}

.help-text {
    color: var(--gray-500);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
}

.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    cursor: pointer;
    font-size: var(--font-size-sm);
    line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
}

.checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid var(--gray-300);
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    flex-shrink: 0;
    margin-top: 2px;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
    content: '✓';
    color: var(--white);
    font-size: var(--font-size-xs);
    font-weight: bold;
}

.form-message {
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    margin-bottom: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    font-weight: 500;
}

.form-message-success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(16, 185, 129, 0.2);
}

.form-message-error {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error-color);
    border: 1px solid rgba(239, 68, 68, 0.2);
}

.contact-info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
}

@media (min-width: 768px) {
    .contact-info-grid {
        grid-template-columns: 1fr 1fr;
    }
}

.contact-info-item {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--gray-200);
}

.contact-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    border-radius: var(--border-radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.contact-icon i {
    font-size: var(--font-size-lg);
    color: var(--white);
}

.contact-details h3 {
    color: var(--gray-900);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-lg);
}

.contact-details p {
    color: var(--gray-700);
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-sm);
}

.social-section {
    margin-bottom: var(--spacing-2xl);
}

.social-section h3 {
    color: var(--gray-900);
    margin-bottom: var(--spacing-lg);
}

.social-links {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.social-links a {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--gray-200);
    color: var(--gray-700);
    text-decoration: none;
    transition: all var(--transition-fast);
}

.social-links a:hover {
    background: var(--primary-color);
    color: var(--white);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.social-links a i {
    font-size: var(--font-size-lg);
    width: 20px;
    text-align: center;
}

.faq-section h3 {
    color: var(--gray-900);
    margin-bottom: var(--spacing-lg);
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.faq-item {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--gray-200);
    overflow: hidden;
}

.faq-question {
    width: 100%;
    padding: var(--spacing-lg);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--gray-900);
    transition: background-color var(--transition-fast);
}

.faq-question:hover {
    background: var(--gray-50);
}

.faq-question.active {
    background: var(--primary-color);
    color: var(--white);
}

.faq-question i {
    transition: transform var(--transition-fast);
}

.faq-question.active i {
    transform: rotate(180deg);
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-normal);
}

.faq-answer p {
    padding: 0 var(--spacing-lg) var(--spacing-lg);
    margin: 0;
    color: var(--gray-700);
    line-height: 1.6;
}

.character-counter {
    text-align: right;
    font-size: var(--font-size-sm);
    color: var(--gray-500);
    margin-top: var(--spacing-xs);
}

.character-counter.warning {
    color: var(--warning-color);
}

.character-counter .current {
    font-weight: 600;
}
</style>
`;


document.head.insertAdjacentHTML('beforeend', contactStyles);


function debounce(func, wait) {
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

