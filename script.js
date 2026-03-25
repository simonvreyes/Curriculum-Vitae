const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const brandLink = document.querySelector('.brand');
const brandMiniVideo = document.querySelector('.brand-mini-video');
const heroProfileMedia = document.querySelector('.hero-photo');
const profileVideo = document.querySelector('#profileVideo');
const openCvModalButton = document.querySelector('#openCvModal');
const closeCvModalButton = document.querySelector('#closeCvModal');
const cvModal = document.querySelector('#cvModal');
const backToTopButton = document.querySelector('.back-to-top');
const backToTopThreshold = 180;

function openCvModal() {
    if (!cvModal) {
        return;
    }

    cvModal.classList.add('open');
    cvModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeCvModal() {
    if (!cvModal) {
        return;
    }

    cvModal.classList.remove('open');
    cvModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function ensureProfileVideoAutoplay() {
    if (!profileVideo) {
        return;
    }

    // These properties increase autoplay reliability across browsers.
    profileVideo.muted = true;
    profileVideo.defaultMuted = true;
    profileVideo.playsInline = true;
    profileVideo.autoplay = true;

    const playPromise = profileVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
            // Ignore autoplay rejections silently to avoid console noise in strict browsers.
        });
    }
}

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

function updateBackToTopButton() {
    if (!backToTopButton) {
        return;
    }

    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

    if (scrollY > backToTopThreshold) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

function updateBrandMiniVideoVisibility() {
    if (!brandLink || !brandMiniVideo || !heroProfileMedia) {
        return;
    }

    const heroRect = heroProfileMedia.getBoundingClientRect();
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    const hasPassedProfile = heroRect.bottom <= navbarHeight;
    const isShowing = brandLink.classList.contains('show-mini-video');

    if (hasPassedProfile === isShowing) {
        return;
    }

    brandLink.classList.toggle('show-mini-video', hasPassedProfile);

    if (hasPassedProfile) {
        const playPromise = brandMiniVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // Ignore autoplay rejection for stricter browsers.
            });
        }
    } else {
        brandMiniVideo.pause();
    }
}

if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

if (openCvModalButton) {
    openCvModalButton.addEventListener('click', openCvModal);
}

if (closeCvModalButton) {
    closeCvModalButton.addEventListener('click', closeCvModal);
}

if (cvModal) {
    cvModal.addEventListener('click', (event) => {
        if (event.target === cvModal) {
            closeCvModal();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCvModal();
    }
});

window.addEventListener('scroll', setActiveLink);
window.addEventListener('scroll', updateBackToTopButton);
window.addEventListener('scroll', updateBrandMiniVideoVisibility);
window.addEventListener('load', setActiveLink);
window.addEventListener('load', updateBackToTopButton);
window.addEventListener('load', updateBrandMiniVideoVisibility);
window.addEventListener('resize', updateBrandMiniVideoVisibility);

window.addEventListener('DOMContentLoaded', ensureProfileVideoAutoplay);
window.addEventListener('load', ensureProfileVideoAutoplay);

if (profileVideo) {
    profileVideo.addEventListener('loadeddata', ensureProfileVideoAutoplay);
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        ensureProfileVideoAutoplay();
    }
});

updateBackToTopButton();
ensureProfileVideoAutoplay();
updateBrandMiniVideoVisibility();
