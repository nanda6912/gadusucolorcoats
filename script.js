// GADUSU EXPERT COLOR COATS - Professional Website JavaScript
console.log('GADUSU EXPERT COLOR COATS website loaded successfully!');

// Mobile menu toggle with accessibility
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Sticky navigation with active section highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.removeAttribute('aria-current'));
                navLink.setAttribute('aria-current', 'page');
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
                if (sectionId === 'home' && scrollY < 100) {
                    navLink.setAttribute('aria-current', 'page');
                    navLink.classList.add('active');
                }
            }
        }
    });
}

// Header scroll effect
function updateHeaderStyle() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(52, 52, 52, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = '#343434';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Observe service cards and contact items
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .about-text');
    animatedElements.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Set minimum date for appointment booking
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Initialize active navigation
    updateActiveNavLink();
    updateHeaderStyle();
});

// Scroll event listeners
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateHeaderStyle();
});

// Form submission handling
const appointmentForm = document.getElementById('appointmentForm');
const formMessage = document.getElementById('formMessage');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(appointmentForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            service: formData.get('service'),
            location: formData.get('location'),
            message: formData.get('message'),
            date: formData.get('date'),
            timestamp: new Date().toISOString()
        };
        
        // Validate required fields
        if (!data.name || !data.phone || !data.service || !data.location) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate phone number
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[^0-9]/g, ''))) {
            showMessage('Please enter a valid phone number.', 'error');
            return;
        }
        
        // Validate email if provided
        if (data.email && !isValidEmail(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        try {
            // Send appointment via WhatsApp
            await sendAppointmentWhatsApp(data);
            
            // Show success message
            showMessage('Appointment request sent via WhatsApp! We will contact you soon.', 'success');
            
            // Reset form
            appointmentForm.reset();
            
            // Store appointment locally (for demo purposes)
            storeAppointment(data);
            
        } catch (error) {
            console.error('Error submitting appointment:', error);
            showMessage('Error booking appointment. Please try again or call us directly.', 'error');
        }
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Send appointment via WhatsApp
async function sendAppointmentWhatsApp(data) {
    const whatsappNumber = "919032581154";
    
    const message = encodeURIComponent(
`🎨 *New Appointment Request - GADUSU EXPERT COLOR COATS*

👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email || 'Not provided'}
🏠 *Service:* ${getServiceName(data.service)}
📍 *Location:* ${data.location}
📅 *Preferred Date:* ${data.date || 'Not specified'}
💬 *Message:* ${data.message || 'No additional message'}
⏰ *Submitted:* ${new Date().toLocaleString()}

---
Please contact the customer to confirm the appointment.`
    );
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'WhatsApp message sent successfully' });
        }, 500);
    });
}

// Get service name from value
function getServiceName(serviceValue) {
    const services = {
        'interior': 'Interior Painting',
        'exterior': 'Exterior Painting',
        'commercial': 'Commercial Spaces',
        'all': 'All Services'
    };
    return services[serviceValue] || serviceValue;
}

// Store appointment locally (for demo purposes)
function storeAppointment(data) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(data);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    console.log('Appointment stored locally:', data);
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length > 15) {
                value = value.slice(0, 15);
            }
            e.target.value = value;
        });
    }
});

// Add loading state to form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const submitBtn = form?.querySelector('button[type="submit"]');
    
    if (form && submitBtn) {
        form.addEventListener('submit', function() {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Book Appointment';
            }, 5000);
        });
    }
});

// Gallery toggle function
function toggleGallery(galleryId) {
    const gallery = document.getElementById(galleryId + '-gallery');
    const button = event.target.closest('.gallery-toggle-btn');
    
    if (gallery.style.display === 'none') {
        gallery.style.display = 'block';
        button.innerHTML = '<i class="fas fa-times"></i> Close Gallery';
        button.style.background = '#FF6B6B';
        button.setAttribute('aria-expanded', 'true');
        gallery.setAttribute('aria-hidden', 'false');
        
        // Smooth scroll to gallery
        gallery.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        gallery.style.display = 'none';
        button.innerHTML = '<i class="fas fa-images"></i> View Our Work';
        button.style.background = '#343434';
        button.setAttribute('aria-expanded', 'false');
        gallery.setAttribute('aria-hidden', 'true');
    }
}

// Modal functions
let currentImageIndex = 0;
const interiorImages = [
    'images/interior-1.jpg', 'images/interior-2.jpg', 'images/interior-3.jpg', 'images/interior-4.jpg',
    'images/interior-5.jpg', 'images/interior-6.jpg'
];
const exteriorImages = [
    'images/exterior-1.jpg', 'images/exterior-2.jpg', 'images/exterior-3.jpg', 'images/exterior-4.jpg',
    'images/exterior-5.jpg', 'images/exterior-6.jpg'
];
const commercialImages = [
    'images/commercial-1.jpg', 'images/commercial-2.jpg', 'images/commercial-3.jpg', 'images/commercial-4.jpg',
    'images/commercial-5.jpg'
];
const allImages = [...interiorImages, ...exteriorImages, ...commercialImages];

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    currentImageIndex = allImages.indexOf(imageSrc);
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    updateModalCounter();
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    modalImg.focus();
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = allImages.length - 1;
    } else if (currentImageIndex >= allImages.length) {
        currentImageIndex = 0;
    }
    
    const modalImg = document.getElementById('modalImage');
    modalImg.src = allImages[currentImageIndex];
    updateModalCounter();
}

function updateModalCounter() {
    const counter = document.getElementById('modalCounter');
    if (counter) {
        counter.textContent = `${currentImageIndex + 1}/${allImages.length}`;
    }
}

// Modal event listeners
window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('imageModal');
    if (modal.style.display === 'block') {
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (event.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// Keyboard navigation for menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab' && hamburger.classList.contains('active')) {
        // Ensure focus stays within menu when it's open
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
});
