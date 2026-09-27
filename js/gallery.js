// =====================================================
// INTERACTIVE IMAGE GALLERY WITH SLIDESHOW & FILTERS
// =====================================================

class ImageGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.filteredImages = [];
        this.isSlideshowActive = false;
        this.slideshowTimer = null;
        this.currentCategory = "all";
        this.init();
    }

    init() {
        this.collectImages();
        if (this.images.length === 0) return;

        this.filteredImages = [...this.images];
        this.renderCategoryFilters();
        this.setupImageClickHandlers();
        this.createLightboxUI();
    }

    collectImages() {
        // Collect images from gallery cards & figures
        const galleryItems = document.querySelectorAll(".artwork-card, .exhibition-grid figure, .event-feature-card");
        
        let collected = [];

        galleryItems.forEach((card, index) => {
            const img = card.querySelector("img");
            const labelEl = card.querySelector(".artwork-label, figcaption, h3");
            if (img) {
                const alt = img.alt || labelEl?.textContent || `Event Photograph ${index + 1}`;
                const title = labelEl?.textContent || img.alt || `Photograph ${index + 1}`;
                
                // Determine category based on alt/title
                let category = "general";
                const text = (alt + " " + title).toLowerCase();
                if (text.includes("hack") || text.includes("code") || text.includes("cyber") || text.includes("ctf")) {
                    category = "hackathons";
                } else if (text.includes("workshop") || text.includes("ux") || text.includes("design")) {
                    category = "workshops";
                } else if (text.includes("stage") || text.includes("award") || text.includes("ceremony") || text.includes("main")) {
                    category = "stage";
                }

                const itemData = {
                    src: img.src,
                    alt: alt,
                    title: title,
                    category: category,
                    element: img
                };

                collected.push(itemData);
            }
        });

        this.images = collected;
    }

    renderCategoryFilters() {
        const header = document.querySelector(".exhibition-header .container") || document.querySelector(".promo-media-section .container");
        if (!header || document.getElementById("galleryCategoryFilters")) return;

        const filterContainer = document.createElement("div");
        filterContainer.id = "galleryCategoryFilters";
        filterContainer.style.cssText = `
            display: flex;
            gap: 12px;
            margin-top: 25px;
            margin-bottom: 25px;
            flex-wrap: wrap;
            justify-content: center;
        `;

        filterContainer.innerHTML = `
            <button class="gallery-filter-btn active" data-category="all">All Photos (${this.images.length})</button>
            <button class="gallery-filter-btn" data-category="hackathons">Hackathons & CTF</button>
            <button class="gallery-filter-btn" data-category="workshops">Workshops & Design</button>
            <button class="gallery-filter-btn" data-category="stage">Main Stage & Awards</button>
        `;

        header.appendChild(filterContainer);

        // Add filter button click handlers
        filterContainer.querySelectorAll(".gallery-filter-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                filterContainer.querySelectorAll(".gallery-filter-btn").forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                this.filterGallery(e.target.dataset.category);
            });
        });
    }

    filterGallery(category) {
        this.currentCategory = category;
        
        if (category === "all") {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = this.images.filter(img => img.category === category);
        }

        // Show/hide image elements in grid based on filter
        this.images.forEach(item => {
            const card = item.element.closest(".artwork-card, figure, article");
            if (card) {
                if (category === "all" || item.category === category) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            }
        });
    }

    setupImageClickHandlers() {
        this.images.forEach((item) => {
            item.element.style.cursor = "pointer";
            item.element.title = "Click to enlarge photograph";
            item.element.addEventListener("click", () => {
                // Find index within current filtered list
                const indexInFiltered = this.filteredImages.findIndex(img => img.src === item.src);
                this.openLightbox(indexInFiltered >= 0 ? indexInFiltered : 0);
            });
        });
    }

    createLightboxUI() {
        if (document.getElementById("imageLightboxModal")) return;

        const modal = document.createElement("div");
        modal.id = "imageLightboxModal";
        modal.className = "lightbox-overlay";
        modal.innerHTML = `
            <div class="lightbox-dialog">
                <button class="lightbox-close-btn" id="lightboxCloseBtn" title="Close (Esc)">&times;</button>
                <div class="lightbox-stage">
                    <button class="lightbox-nav-btn lightbox-prev-btn" id="lightboxPrevBtn" title="Previous Image (Left Arrow)">❮</button>
                    <div class="lightbox-media-wrapper">
                        <img id="lightboxMainImg" src="" alt="" class="lightbox-active-img">
                        <div class="lightbox-caption-bar">
                            <h4 id="lightboxTitle"></h4>
                            <p id="lightboxCaptionText"></p>
                        </div>
                    </div>
                    <button class="lightbox-nav-btn lightbox-next-btn" id="lightboxNextBtn" title="Next Image (Right Arrow)">❯</button>
                </div>
                <div class="lightbox-toolbar">
                    <button id="lightboxSlideshowBtn" class="lightbox-action-btn">▶ Play Slideshow</button>
                    <span id="lightboxCounter" class="lightbox-counter">1 / 1</span>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Attach event listeners
        document.getElementById("lightboxCloseBtn").addEventListener("click", () => this.closeLightbox());
        document.getElementById("lightboxPrevBtn").addEventListener("click", () => this.prevImage());
        document.getElementById("lightboxNextBtn").addEventListener("click", () => this.nextImage());
        document.getElementById("lightboxSlideshowBtn").addEventListener("click", () => this.toggleSlideshow());

        modal.addEventListener("click", (e) => {
            if (e.target === modal) this.closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (modal.style.display !== "flex") return;
            if (e.key === "ArrowLeft") this.prevImage();
            else if (e.key === "ArrowRight") this.nextImage();
            else if (e.key === "Escape") this.closeLightbox();
            else if (e.key === " ") {
                e.preventDefault();
                this.toggleSlideshow();
            }
        });
    }

    openLightbox(index) {
        if (this.filteredImages.length === 0) return;
        this.currentIndex = index;
        const modal = document.getElementById("imageLightboxModal");
        modal.style.display = "flex";
        this.updateLightboxContent();
    }

    closeLightbox() {
        this.stopSlideshow();
        const modal = document.getElementById("imageLightboxModal");
        if (modal) modal.style.display = "none";
    }

    updateLightboxContent() {
        const item = this.filteredImages[this.currentIndex];
        if (!item) return;

        const imgEl = document.getElementById("lightboxMainImg");
        const titleEl = document.getElementById("lightboxTitle");
        const captionEl = document.getElementById("lightboxCaptionText");
        const counterEl = document.getElementById("lightboxCounter");

        imgEl.src = item.src;
        imgEl.alt = item.alt;
        titleEl.textContent = item.title;
        captionEl.textContent = item.alt;
        counterEl.textContent = `${this.currentIndex + 1} / ${this.filteredImages.length}`;
    }

    nextImage() {
        if (this.filteredImages.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.filteredImages.length;
        this.updateLightboxContent();
    }

    prevImage() {
        if (this.filteredImages.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
        this.updateLightboxContent();
    }

    toggleSlideshow() {
        if (this.isSlideshowActive) {
            this.stopSlideshow();
        } else {
            this.startSlideshow();
        }
    }

    startSlideshow() {
        this.isSlideshowActive = true;
        const btn = document.getElementById("lightboxSlideshowBtn");
        if (btn) btn.textContent = "⏸ Pause Slideshow";

        this.slideshowTimer = setInterval(() => {
            this.nextImage();
        }, 2500);
    }

    stopSlideshow() {
        this.isSlideshowActive = false;
        clearInterval(this.slideshowTimer);
        const btn = document.getElementById("lightboxSlideshowBtn");
        if (btn) btn.textContent = "▶ Play Slideshow";
    }
}

// Initialize Gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.imageGallery = new ImageGallery();
});
