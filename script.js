const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const brandLink = document.querySelector('.brand');

const brandTopText = "Hi, I'm Simon";
const brandScrolledText = 'Back to top';
const scrollTextThreshold = 140;

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!isExpanded));
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    }
);

document.querySelectorAll('.reveal').forEach((section) => {
    revealObserver.observe(section);
});

const sections = document.querySelectorAll('section[id], header[id]');

function setActiveLink() {
    let current = '';

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (window.scrollY >= top - 140 && window.scrollY < top + height - 140) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

function updateBrandTextOnScroll() {
    if (!brandLink) {
        return;
    }

    if (window.scrollY > scrollTextThreshold) {
        brandLink.textContent = brandScrolledText;
    } else {
        brandLink.textContent = brandTopText;
    }
}

window.addEventListener('scroll', setActiveLink);
window.addEventListener('scroll', updateBrandTextOnScroll);
window.addEventListener('load', setActiveLink);
window.addEventListener('load', updateBrandTextOnScroll);
