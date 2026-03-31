
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    initCurrentNavHighlight(currentPage);
    initToastContainer();
    initFloatingButtons();
    initPianoCarousel();
    initLightbox();
    initPageTitleFade(currentPage);
    initAboutFadeIn(currentPage);
    initHomeFadeIn(currentPage);
    initTimelineAnimation();
    initHeaderShadow();
    initBlankAreaHearts();

    if (currentPage === 'products.html') {
        initProductInteractions();
        initSectionCardFade('.products-grid', '.product-card');
    }

    if (currentPage === 'gallery.html') {
        initGalleryInteractions();
        initGalleryCardFade();
    }
});

function initCurrentNavHighlight(currentPage) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.opacity = '0.7';
        }
    });
}

function initToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message) {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

function initFloatingButtons() {
    const wrapper = document.createElement('div');
    wrapper.className = 'floating-actions';

    const hiBtn = document.createElement('button');
    hiBtn.className = 'floating-btn floating-logo-btn';
    hiBtn.type = 'button';
    hiBtn.title = 'Say hi';

    const hiLogo = document.createElement('img');
    hiLogo.src = 'images/logo.png';
    hiLogo.alt = 'My Melody Logo';
    hiBtn.appendChild(hiLogo);

    hiBtn.addEventListener('click', function (event) {
        showToast('My Melody says hi!');
        createEmojiBurst(event.clientX, event.clientY);
    });

    const homeBtn = document.createElement('button');
    homeBtn.className = 'floating-btn';
    homeBtn.type = 'button';
    homeBtn.title = 'Back to home';
    homeBtn.innerHTML = '⌂';
    homeBtn.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    const topBtn = document.createElement('button');
    topBtn.className = 'floating-btn is-hidden';
    topBtn.type = 'button';
    topBtn.title = 'Back to top';
    topBtn.innerHTML = '↑';
    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    wrapper.appendChild(hiBtn);
    wrapper.appendChild(homeBtn);
    wrapper.appendChild(topBtn);
    document.body.appendChild(wrapper);

    const toggleTopBtn = () => {
        if (window.scrollY > 220) {
            topBtn.classList.remove('is-hidden');
        } else {
            topBtn.classList.add('is-hidden');
        }
    };

    window.addEventListener('scroll', toggleTopBtn);
    toggleTopBtn();
}

function initPianoCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    function goToSlide(index) {
        if (!carouselTrack) return;
        currentSlide = index;
        carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    if (carouselTrack && totalSlides > 1) {
        setInterval(() => {
            goToSlide((currentSlide + 1) % totalSlides);
        }, 4000);
    }
}

function cleanCaptionText(altText) {
    const text = (altText || '').trim();
    if (!text) return '';
    if (/^My Melody Photo\s*\d+$/i.test(text)) return '';
    return text;
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImg) return;

    let currentItems = [];
    let currentIndex = 0;

    const controls = document.createElement('div');
    controls.className = 'lightbox-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav lightbox-prev';
    prevBtn.type = 'button';
    prevBtn.innerHTML = '&#10094;';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav lightbox-next';
    nextBtn.type = 'button';
    nextBtn.innerHTML = '&#10095;';

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    lightbox.appendChild(controls);

    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    lightbox.appendChild(caption);

    function renderLightbox() {
        if (!currentItems.length) return;
        const item = currentItems[currentIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt || 'Preview image';
        const captionText = cleanCaptionText(item.alt);
        caption.textContent = captionText;
        caption.style.display = captionText ? 'block' : 'none';
        const hasMultiple = currentItems.length > 1;
        prevBtn.style.display = hasMultiple ? 'block' : 'none';
        nextBtn.style.display = hasMultiple ? 'block' : 'none';
    }

    function openLightbox(items, index) {
        currentItems = items;
        currentIndex = index;
        renderLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function go(delta) {
        if (!currentItems.length) return;
        currentIndex = (currentIndex + delta + currentItems.length) % currentItems.length;
        renderLightbox();
    }

    const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
    galleryItems.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(galleryItems, index));
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const productItems = Array.from(document.querySelectorAll('.product-card img'));
    productItems.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            if (currentPage === 'products.html') {
                openLightbox([img], 0);
            } else {
                openLightbox(productItems, index);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', e => {
        e.stopPropagation();
        go(-1);
    });

    nextBtn.addEventListener('click', e => {
        e.stopPropagation();
        go(1);
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
    });
}

function initPageTitleFade(currentPage) {
    if (!['products.html', 'gallery.html', 'history.html'].includes(currentPage)) return;

    const title = document.querySelector('.section-title');
    if (!title) return;

    title.classList.add('page-title-fade');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => title.classList.add('visible'));
    });
}

function initAboutFadeIn(currentPage) {
    if (currentPage !== 'about.html') return;

    const aboutContent = document.querySelector('.about-content');
    if (!aboutContent) return;

    const fadeTargets = aboutContent.querySelectorAll('.about-image img, .about-text h3, .about-text p');
    fadeTargets.forEach(item => item.classList.add('fade-item'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            fadeTargets.forEach((item, idx) => {
                setTimeout(() => item.classList.add('visible'), idx * 140);
            });
            observer.disconnect();
        });
    }, { threshold: 0.25 });

    observer.observe(aboutContent);
}

function initHomeFadeIn(currentPage) {
    if (currentPage !== 'index.html') return;

    const groups = [
        {
            container: document.querySelector('.welcome-section'),
            targets: Array.from(document.querySelectorAll('.welcome-title, .welcome-content p'))
        },
        {
            container: document.querySelector('.piano-section'),
            targets: Array.from(document.querySelectorAll('.piano-section .section-title, .piano-carousel, .piano-text h3, .piano-text p'))
        },
        {
            container: document.querySelector('.featured-sections'),
            targets: Array.from(document.querySelectorAll('.feature-card'))
        }
    ];

    groups.forEach(group => {
        const { container, targets } = group;
        if (!container || !targets.length) return;
        targets.forEach(item => item.classList.add('fade-item'));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                targets.forEach((item, idx) => {
                    setTimeout(() => item.classList.add('visible'), idx * 140);
                });
                observer.unobserve(container);
            });
        }, { threshold: 0.2 });

        observer.observe(container);
    });
}

function initSectionCardFade(containerSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    const items = Array.from(document.querySelectorAll(itemSelector));
    if (!container || !items.length) return;

    items.forEach(item => item.classList.add('fade-item'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            items.forEach((item, idx) => {
                setTimeout(() => item.classList.add('visible'), idx * 120);
            });
            observer.unobserve(container);
        });
    }, { threshold: 0.12 });

    observer.observe(container);
}

function initGalleryCardFade() {
    const container = document.querySelector('.gallery-grid');
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    if (!container || !items.length) return;

    items.forEach(item => item.classList.add('fade-item', 'gallery-fade-item'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            items.forEach((item, idx) => {
                setTimeout(() => item.classList.add('visible'), 70 + idx * 95);
            });
            observer.unobserve(container);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    observer.observe(container);
}

function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.15 });

    timelineItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
        observer.observe(item);
    });
}

function initHeaderShadow() {
    const header = document.querySelector('header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
}

function initBlankAreaHearts() {
    document.addEventListener('click', function (event) {
        const ignored = event.target.closest('a, button, img, .gallery-item, .product-card, .lightbox, .timeline-content, .carousel-dots');
        if (ignored) return;
        createPageHeart(event.clientX, event.clientY, '💗');
    });
}

function createPageHeart(x, y, emoji) {
    const heart = document.createElement('span');
    heart.className = 'page-heart';
    heart.textContent = emoji;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

function createEmojiBurst(x, y) {
    const emojis = ['💖', '🌸', '✨', '🎀', '💕', '🐰'];
    const count = 6;

    for (let i = 0; i < count; i += 1) {
        const node = document.createElement('span');
        node.className = 'click-burst-emoji';
        node.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const offsetX = Math.random() * 56 - 28;
        const offsetY = Math.random() * 36 - 18;
        const driftX = Math.random() * 70 - 35;
        const driftY = -(48 + Math.random() * 42);

        node.style.left = `${x + offsetX}px`;
        node.style.top = `${y + offsetY}px`;
        node.style.setProperty('--drift-x', `${driftX}px`);
        node.style.setProperty('--drift-y', `${driftY}px`);

        document.body.appendChild(node);
        setTimeout(() => node.remove(), 1200);
    }
}

function createFloatingEmoji(container, emoji) {
    const node = document.createElement('span');
    node.className = 'floating-emoji';
    node.textContent = emoji;
    container.appendChild(node);
    setTimeout(() => node.remove(), 1000);
}

function initProductInteractions() {
    const cards = Array.from(document.querySelectorAll('.product-card'));
    if (!cards.length) return;

    cards.forEach(card => {
        const img = card.querySelector('img');
        const info = card.querySelector('.product-info');
        if (!img || !info) return;

        const originalSrc = img.getAttribute('src');

        let imageShell = card.querySelector('.product-image-shell');
        if (!imageShell) {
            imageShell = document.createElement('div');
            imageShell.className = 'product-image-shell';
            card.insertBefore(imageShell, img);
            imageShell.appendChild(img);
        }

        const prevBtn = document.createElement('button');
        prevBtn.className = 'image-nav-btn image-nav-prev';
        prevBtn.type = 'button';
        prevBtn.setAttribute('aria-label', 'Previous image');
        prevBtn.innerHTML = '&#10094;';

        const nextBtn = document.createElement('button');
        nextBtn.className = 'image-nav-btn image-nav-next';
        nextBtn.type = 'button';
        nextBtn.setAttribute('aria-label', 'Next image');
        nextBtn.innerHTML = '&#10095;';

        function triggerFlip(direction) {
            imageShell.classList.remove('flip-left', 'flip-right');
            void imageShell.offsetWidth;
            img.src = originalSrc;
            imageShell.classList.add(direction === 'left' ? 'flip-left' : 'flip-right');
        }

        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            triggerFlip('left');
        });

        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            triggerFlip('right');
        });

        imageShell.append(prevBtn, nextBtn);
    });
}

function initGalleryInteractions() {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    if (!items.length) return;
}
