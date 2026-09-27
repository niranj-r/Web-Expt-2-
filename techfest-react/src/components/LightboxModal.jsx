import React, { useState, useEffect } from 'react';

const LightboxModal = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev + 1) % images.length);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  if (!images || images.length === 0) return null;

  const currentImg = images[currentIndex];

  return (
    <div className="lightbox-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div className="lightbox-dialog" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close-btn" onClick={onClose} title="Close (Esc)">&times;</button>
        
        <div className="lightbox-stage">
          <button
            type="button"
            className="lightbox-nav-btn"
            onClick={() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)}
          >
            ❮
          </button>

          <div className="lightbox-media-wrapper">
            <img src={currentImg.src} alt={currentImg.alt} className="lightbox-active-img" />
            <div className="lightbox-caption-bar">
              <h4>{currentImg.title || currentImg.alt}</h4>
              <p>{currentImg.alt}</p>
            </div>
          </div>

          <button
            type="button"
            className="lightbox-nav-btn"
            onClick={() => setCurrentIndex(prev => (prev + 1) % images.length)}
          >
            ❯
          </button>
        </div>

        <div className="lightbox-toolbar">
          <button
            type="button"
            className="lightbox-action-btn"
            onClick={() => setIsPlaying(prev => !prev)}
          >
            {isPlaying ? '⏸ Pause Slideshow' : '▶ Play Slideshow'}
          </button>
          <span className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
