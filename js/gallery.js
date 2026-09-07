// =====================================================
// INTERACTIVE IMAGE GALLERY
// =====================================================

class ImageGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.isSlideshow = false;
        this.slideshowInterval = null;
        this.init();
    }

    init() {
        // Get all gallery images
        const galleryImages = document.querySelectorAll(".artwork-card img, .exhibition-grid img");
        
        if (galleryImages.length === 0) return;

        this.images = Array.from(galleryImages).map(img => ({
            src: img.src,
            alt: img.alt
        }));

        // Add click handlers to make images clickable
        galleryImages.forEach((img, index) => {
            img.style.cursor = "pointer";
            img.addEventListener("click", () => this.openGallery(index));
        });

        // Also check for gallery thumbnails
        const thumbnails = document.querySelectorAll(".gallery-thumbnail");
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener("click", () => this.openGallery(index));
        });

        // Create lightbox HTML
        this.createLightbox();
    }

    createLightbox() {
        const lightbox = document.createElement("div");
        lightbox.id = "imageLightbox";
        lightbox.innerHTML = `
            <div class="lightbox-overlay" id="lightboxOverlay">
                <div class="lightbox-container">
                    <button class="lightbox-btn lightbox-prev" id="lightboxPrev">❮</button>
                    <div class="lightbox-image-wrapper">
                        <img id="lightboxImage" src="" alt="" class="lightbox-image">
                        <p class="lightbox-caption" id="lightboxCaption"></p>
                    </div>
                    <button class="lightbox-btn lightbox-next" id="lightboxNext">❯</button>
                    <button class="lightbox-btn lightbox-close" id="lightboxClose">×</button>
                    <div class="lightbox-controls">
                        <button class="lightbox-control-btn" id="slideshowBtn">Slideshow</button>
                        <button class="lightbox-control-btn" id="stopSlideshowBtn" style="display:none;">Stop</button>
                        <span class="lightbox-counter" id="lightboxCounter">1 / 1</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);

        // Add event listeners
        document.getElementById("lightboxPrev").addEventListener("click", () => this.prevImage());
        document.getElementById("lightboxNext").addEventListener("click", () => this.nextImage());
        document.getElementById("lightboxClose").addEventListener("click", () => this.closeLightbox());
        document.getElementById("slideshowBtn").addEventListener("click", () => this.startSlideshow());
        document.getElementById("stopSlideshowBtn").addEventListener("click", () => this.stopSlideshow());
        document.getElementById("lightboxOverlay").addEventListener("click", (e) => {
            if (e.target === document.getElementById("lightboxOverlay")) {
                this.closeLightbox();
            }
        });

        // Add keyboard controls
        document.addEventListener("keydown", (e) => {
            const lightbox = document.getElementById("imageLightbox");
            if (!lightbox || lightbox.style.display === "none") return;

            switch(e.key) {
                case "ArrowLeft":
                    this.prevImage();
                    break;
                case "ArrowRight":
                    this.nextImage();
                    break;
                case "Escape":
                    this.closeLightbox();
                    break;
            }
        });

        // Add styles
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement("style");
        style.textContent = `
            #imageLightbox {
                display: none;
            }

            .lightbox-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .lightbox-container {
                position: relative;
                max-width: 90vw;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .lightbox-image-wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                max-width: 100%;
                max-height: 70vh;
            }

            .lightbox-image {
                max-width: 100%;
                max-height: 70vh;
                object-fit: contain;
                animation: fadeIn 0.3s ease-in-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .lightbox-caption {
                color: #ED4B00;
                text-align: center;
                margin-top: 15px;
                font-size: 16px;
                font-weight: 600;
            }

            .lightbox-btn {
                position: absolute;
                background: none;
                border: none;
                color: #ED4B00;
                font-size: 36px;
                cursor: pointer;
                padding: 10px;
                transition: all 0.3s ease;
                z-index: 10001;
            }

            .lightbox-btn:hover {
                color: #F2F3F4;
                transform: scale(1.2);
            }

            .lightbox-prev {
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
            }

            .lightbox-next {
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
            }

            .lightbox-close {
                top: 10px;
                right: 10px;
                font-size: 42px;
            }

            .lightbox-controls {
                display: flex;
                gap: 15px;
                margin-top: 20px;
                align-items: center;
                flex-wrap: wrap;
                justify-content: center;
            }

            .lightbox-control-btn {
                background-color: #ED4B00;
                color: #F2F3F4;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                border-radius: 4px;
                font-weight: 600;
                transition: background-color 0.3s ease;
            }

            .lightbox-control-btn:hover {
                background-color: #F2F3F4;
                color: #020035;
            }

            .lightbox-counter {
                color: #ED4B00;
                font-weight: 600;
                font-size: 14px;
                white-space: nowrap;
            }

            @media (max-width: 768px) {
                .lightbox-btn {
                    font-size: 28px;
                }

                .lightbox-image {
                    max-height: 60vh;
                }

                .lightbox-close {
                    font-size: 36px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    openGallery(index) {
        this.currentIndex = index;
        const lightbox = document.getElementById("imageLightbox");
        lightbox.style.display = "flex";
        this.updateImage();
    }

    closeLightbox() {
        if (this.isSlideshow) {
            this.stopSlideshow();
        }
        const lightbox = document.getElementById("imageLightbox");
        lightbox.style.display = "none";
    }

    updateImage() {
        const image = this.images[this.currentIndex];
        const lightboxImage = document.getElementById("lightboxImage");
        const lightboxCaption = document.getElementById("lightboxCaption");
        const lightboxCounter = document.getElementById("lightboxCounter");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = image.alt;
        lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    startSlideshow() {
        this.isSlideshow = true;
        document.getElementById("slideshowBtn").style.display = "none";
        document.getElementById("stopSlideshowBtn").style.display = "inline-block";

        this.slideshowInterval = setInterval(() => {
            this.nextImage();
        }, 3000); // Change image every 3 seconds
    }

    stopSlideshow() {
        this.isSlideshow = false;
        clearInterval(this.slideshowInterval);
        document.getElementById("slideshowBtn").style.display = "inline-block";
        document.getElementById("stopSlideshowBtn").style.display = "none";
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new ImageGallery();
});
