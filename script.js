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
const partnerMediaCards = document.querySelectorAll('.partner-media');
const partnerLogoImages = document.querySelectorAll('.partner-logo-image');
const partnerGalleryModal = document.querySelector('#partnerGalleryModal');
const closePartnerGalleryModalButton = document.querySelector('#closePartnerGalleryModal');
const partnerGalleryTitle = document.querySelector('#partnerGalleryTitle');
const partnerGalleryGrid = document.querySelector('#partnerGalleryGrid');
const backToTopButton = document.querySelector('.back-to-top');
const backToTopThreshold = 180;

let currentPartnerGalleryImages = [];

function syncBodyModalState() {
    const hasOpenModal = document.querySelector('.cv-modal.open');
    document.body.classList.toggle('modal-open', Boolean(hasOpenModal));
}

function getPlaceholderImageDataUrl(labelText) {
    const safeLabel = String(labelText || 'Gallery Image').replace(/[<>&"']/g, '');
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">` +
        `<defs>` +
        `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0%" stop-color="#f1f1f1" />` +
        `<stop offset="100%" stop-color="#dcdcdc" />` +
        `</linearGradient>` +
        `</defs>` +
        `<rect width="1400" height="900" fill="url(#g)" />` +
        `<rect x="32" y="32" width="1336" height="836" fill="none" stroke="#111111" stroke-width="8" />` +
        `<text x="700" y="430" text-anchor="middle" fill="#111111" font-size="54" font-family="Arial, sans-serif" font-weight="700">${safeLabel}</text>` +
        `<text x="700" y="500" text-anchor="middle" fill="#3c3c3c" font-size="34" font-family="Arial, sans-serif">Replace with your brand image file</text>` +
        `</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function openCvModal() {
    if (!cvModal) {
        return;
    }

    cvModal.classList.add('open');
    cvModal.setAttribute('aria-hidden', 'false');
    syncBodyModalState();
}

function closeCvModal() {
    if (!cvModal) {
        return;
    }

    cvModal.classList.remove('open');
    cvModal.setAttribute('aria-hidden', 'true');
    syncBodyModalState();
}

function renderPartnerGalleryGrid() {
    if (!partnerGalleryGrid) {
        return;
    }

    partnerGalleryGrid.innerHTML = '';

    currentPartnerGalleryImages.forEach((imageData, index) => {
        const galleryItem = document.createElement('figure');
        galleryItem.className = 'partner-gallery-item';
        galleryItem.setAttribute('role', 'listitem');

        const galleryImage = document.createElement('img');
        galleryImage.src = imageData.src;
        galleryImage.alt = imageData.alt;
        galleryImage.loading = 'lazy';
        galleryImage.addEventListener('error', () => {
            galleryImage.src = getPlaceholderImageDataUrl(imageData.alt);
        });

        galleryItem.appendChild(galleryImage);
        partnerGalleryGrid.appendChild(galleryItem);
    });
}

function openPartnerGallery(title, images) {
    if (!partnerGalleryModal || !partnerGalleryTitle || !partnerGalleryGrid || images.length === 0) {
        return;
    }

    currentPartnerGalleryImages = images;
    partnerGalleryTitle.textContent = `${title} Gallery`;
    renderPartnerGalleryGrid();

    partnerGalleryModal.classList.add('open');
    partnerGalleryModal.setAttribute('aria-hidden', 'false');
    syncBodyModalState();
}

function closePartnerGallery() {
    if (!partnerGalleryModal) {
        return;
    }

    partnerGalleryModal.classList.remove('open');
    partnerGalleryModal.setAttribute('aria-hidden', 'true');
    syncBodyModalState();
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

if (partnerMediaCards.length > 0) {
    partnerMediaCards.forEach((card) => {
        const button = card.querySelector('.partner-view-btn');
        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            const title = card.dataset.galleryTitle || 'Brand';
            const fileNames = (card.dataset.galleryImages || '')
                .split(',')
                .map((fileName) => fileName.trim())
                .filter(Boolean);

            const images = fileNames.map((fileName, index) => ({
                src: fileName,
                alt: `${title} image ${index + 1}`
            }));

            openPartnerGallery(title, images);
        });
    });
}

if (partnerLogoImages.length > 0) {
    partnerLogoImages.forEach((logoImage) => {
        logoImage.addEventListener('error', () => {
            logoImage.src = getPlaceholderImageDataUrl(logoImage.alt || 'Brand logo');
        });
    });
}

if (closePartnerGalleryModalButton) {
    closePartnerGalleryModalButton.addEventListener('click', closePartnerGallery);
}

if (partnerGalleryModal) {
    partnerGalleryModal.addEventListener('click', (event) => {
        if (event.target === partnerGalleryModal) {
            closePartnerGallery();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCvModal();
        closePartnerGallery();
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
