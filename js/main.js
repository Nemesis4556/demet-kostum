
// Config
const CONFIG = {
    WHATSAPP_NUMBER: '905075292930',
    ANIMATION_DURATION: 1000,
    SCROLL_OFFSET: 100,
    GALLERY_ITEMS_PER_PAGE: 12
};

// Kostüm Veritabanı
const COSTUMES_DB = [
    { id: 1, image: 'images/efe.jpg', name: 'Zeybek Kostümü', category: 'milli' },
    { id: 2, image: 'images/halk-oyun.jpg', name: 'Halk Oyunları', category: 'milli' },
    { id: 3, image: 'images/kaptan.jpg', name: 'Kaptan', category: 'meslek' },
    { id: 4, image: 'images/asker.jpg', name: 'Asker', category: 'meslek' },
    { id: 5, image: 'images/pılot.jpg', name: 'Pilot', category: 'meslek' },
    { id: 6, image: 'images/polıs.jpg', name: 'Polis', category: 'meslek' },
    { id: 7, image: 'images/mezunıyet.jpg', name: 'Mezuniyet', category: 'okul' },
    { id: 8, image: 'images/sindirella.jpg', name: 'Sindirella', category: 'masal' },
    { id: 9, image: 'images/superman.jpg', name: 'Süperman', category: 'masal' },
    { id: 10, image: 'images/6-ay-kına.jpg', name: '6 Ay Kınası', category: 'bebek' },
    { id: 11, image: 'images/ataturk.jpg', name: '10 Kasım', category: 'okul' },
    { id: 12, image: 'images/pamuk.jpg', name: 'Pamuk Prenses', category: 'masal' },
    { id: 13, image: 'images/melek.jpg', name: 'Melek', category: 'masal' },
    { id: 14, image: 'images/hababam.jpg', name: 'Hababam Sınıfı', category: 'masal' },
    { id: 15, image: 'images/gocmen.jpg', name: 'Bindallı', category: 'bebek' },

]

let currentGalleryFilter = 'all';
let currentGalleryPage = 1;
let lightboxCurrentIndex = 0;
let filteredCostumes = [...COSTUMES_DB];

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    galleryGrid: document.getElementById('galleryGrid'),
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.getElementById('lightboxImage'),
    lightboxCaption: document.getElementById('lightboxCaption'),
    backToTop: document.getElementById('backToTop'),
    reservationBtn: document.getElementById('reservationBtn'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    toastContainer: document.getElementById('toastContainer'),
    currentYear: document.getElementById('currentYear')
};



const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};


const initLoadingScreen = () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('progressBar');
    const percentage = document.getElementById('loadingPercentage');
    
    if (!loadingScreen) return;
    
    let progress = 0;
    let loadingClosed = false;
    
    
    const simulateLoading = () => {
        const interval = setInterval(() => {
            const increment = Math.random() * 15 + 5;
            progress += increment;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(closeLoading, 400);
            }
            
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (percentage) percentage.textContent = `${Math.floor(progress)}%`;
            
        }, 200);
    };
    
    const closeLoading = () => {
        if (loadingClosed) return;
        loadingClosed = true;
        
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 600);
    };
    
    
    simulateLoading();
    

    setTimeout(closeLoading, 5000);
};



const initNavigation = () => {
    // Scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > CONFIG.SCROLL_OFFSET) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Mobile menu toggle
    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', () => {
            const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
            elements.navToggle.setAttribute('aria-expanded', !isExpanded);
            elements.navMenu.classList.toggle('active');
        });
    }
    
    // Close menu on link click
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            elements.navMenu.classList.remove('active');
            elements.navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};



const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.textContent === '0') {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
};



const initGallery = () => {
    const renderGallery = (filter = 'all', page = 1) => {
        if (!elements.galleryGrid) return;
        
        filteredCostumes = filter === 'all' 
            ? COSTUMES_DB 
            : COSTUMES_DB.filter(c => c.category === filter);
        
        const start = 0;
        const end = page * CONFIG.GALLERY_ITEMS_PER_PAGE;
        const costumesToShow = filteredCostumes.slice(start, end);
        
        elements.galleryGrid.innerHTML = costumesToShow.map((costume, index) => `
            <article class="gallery-item" 
                     data-index="${index}" 
                     data-aos="fade-up" 
                     data-aos-delay="${(index % 6) * 100}"
                     tabindex="0"
                     role="button"
                     aria-label="${costume.name} kostümünü görüntüle">
                <img src="${costume.image}" 
                     alt="${costume.name}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x500/1B3A5F/F5E6D3?text=${encodeURIComponent(costume.name)}'">
                <div class="gallery-overlay">
                    <h4>${costume.name}</h4>
                    <span class="gallery-category">${getCategoryName(costume.category)}</span>
                </div>
            </article>
        `).join('');
        
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.style.display = 
                end >= filteredCostumes.length ? 'none' : 'inline-flex';
        }
        
        // Reinitialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Add click handlers
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(parseInt(item.dataset.index));
                }
            });
        });
    };
    
    const getCategoryName = (cat) => {
        const names = {
            milli: 'Milli & Tarihi',
            meslek: 'Meslek',
            okul: 'Okul & Gösteri',
            masal: 'Masal & Kahraman',
            doga: 'Konsept & Doğa',
            bebek: 'Bebek & Özel Gün'
        };
        return names[cat] || cat;
    };
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            
            currentGalleryFilter = button.getAttribute('data-filter');
            currentGalleryPage = 1;
            renderGallery(currentGalleryFilter, currentGalleryPage);
        });
    });
    
    // Load more
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', () => {
            currentGalleryPage++;
            renderGallery(currentGalleryFilter, currentGalleryPage);
        });
    }
    
    // Category links
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
            if (filterBtn) {
                filterBtn.click();
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Initial render
    renderGallery();
};


const openLightbox = (index) => {
    lightboxCurrentIndex = index;
    updateLightbox();
    elements.lightbox.hidden = false;
    elements.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    elements.lightbox.classList.remove('active');
    setTimeout(() => {
        elements.lightbox.hidden = true;
    }, 300);
    document.body.style.overflow = '';
};

const updateLightbox = () => {
    const costume = filteredCostumes[lightboxCurrentIndex];
    if (!costume) return;
    
    elements.lightboxImage.src = costume.image;
    elements.lightboxImage.alt = costume.name;
    elements.lightboxCaption.textContent = costume.name;
};

const initLightbox = () => {
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxCurrentIndex = (lightboxCurrentIndex - 1 + filteredCostumes.length) % filteredCostumes.length;
        updateLightbox();
    });
    document.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxCurrentIndex = (lightboxCurrentIndex + 1) % filteredCostumes.length;
        updateLightbox();
    });
    
    // Keyboard navigation
    elements.lightbox?.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
        if (elements.lightbox.hidden) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                lightboxCurrentIndex = (lightboxCurrentIndex - 1 + filteredCostumes.length) % filteredCostumes.length;
                updateLightbox();
                break;
            case 'ArrowRight':
                lightboxCurrentIndex = (lightboxCurrentIndex + 1) % filteredCostumes.length;
                updateLightbox();
                break;
        }
    });
};



const initReservation = () => {
    if (!elements.reservationBtn) return;
    
    elements.reservationBtn.addEventListener('click', () => {
        const message = `

Merhaba, kostüm kiralama hakkında bilgi almak istiyorum.

Lütfen benimle iletişime geçin.

Teşekkürler!`.trim();
        
        const whatsappLink = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
        
        showToast('WhatsApp açılıyor...', 'info');
    });
};



const initBackToTop = () => {
    if (!elements.backToTop) return;
    
    const toggleVisibility = throttle(() => {
        if (window.scrollY > 500) {
            elements.backToTop.classList.add('visible');
            elements.backToTop.hidden = false;
        } else {
            elements.backToTop.classList.remove('visible');
        }
    }, 100);
    
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};



const showToast = (message, type = 'info', duration = 3000) => {
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type]}" aria-hidden="true"></i>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
};


const init = () => {
    // Set current year
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: CONFIG.ANIMATION_DURATION,
            once: true,
            offset: CONFIG.SCROLL_OFFSET,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }
    
    // Initialize all modules
    initLoadingScreen();
    initNavigation();
    initCounters();
    initGallery();
    initLightbox();
    initReservation();
    initBackToTop();
    
    // Console branding
    console.log('%c🎭 Demet Kostüm Evi', 'color: #F5E6D3; font-size: 24px; font-weight: bold; background: #1B3A5F; padding: 10px; border-radius: 8px;');
    console.log('%cDesigned by ÇAKIR DESIGN', 'color: #F5E6D3; font-size: 14px;');
    console.log('%c✅ Modern JavaScript aktif!', 'color: #10B981; font-size: 12px;');
};

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
const initScrollIndicator = () => {
    const scrollDown = document.querySelector('.scroll-down');
    const hero = document.querySelector('.hero');
    
    if (!scrollDown || !hero) return;
    
    // IntersectionObserver varsa kullan
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    scrollDown.classList.remove('hidden');
                } else {
                 
                    scrollDown.classList.add('hidden');
                }
            });
        }, { threshold: 0.8 });
        
        observer.observe(hero);
    } else {
        // Fallback: Scroll event (eski tarayıcılar için)
        window.addEventListener('scroll', () => {
            const heroBottom = hero.getBoundingClientRect().bottom;
            
            if (heroBottom > window.innerHeight * 0.5) {
                scrollDown.classList.remove('hidden');
            } else {
                scrollDown.classList.add('hidden');
            }
        }, { passive: true });
    }
    

    scrollDown.addEventListener('click', () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
};


document.addEventListener('DOMContentLoaded', () => {
   
    

    initScrollIndicator();
});
