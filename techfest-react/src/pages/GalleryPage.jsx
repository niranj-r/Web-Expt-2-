import React, { useState } from 'react';
import LightboxModal from '../components/LightboxModal';

const GALLERY_IMAGES = [
  {
    id: 1,
    src: '/images/event1.jpg',
    title: 'Hackathon 2025',
    alt: 'Students coding intensely during a 24-hour hackathon',
    category: 'hackathons'
  },
  {
    id: 2,
    src: '/images/hero.webp',
    title: 'Main Stage Setup',
    alt: 'Abstract brutalist lighting design on main auditorium stage',
    category: 'stage'
  },
  {
    id: 3,
    src: '/images/event2.jpg',
    title: 'Code Red',
    alt: 'Close up of mechanical keyboard during competitive programming',
    category: 'hackathons'
  },
  {
    id: 4,
    src: '/images/event3.jpg',
    title: 'CTF Command Center',
    alt: 'Cyber security command center monitor displays',
    category: 'hackathons'
  },
  {
    id: 5,
    src: '/images/event4.webp',
    title: 'UX Workshop',
    alt: 'Design sprint wireframing workshop in progress',
    category: 'workshops'
  },
  {
    id: 6,
    src: '/images/event5.webp',
    title: 'Award Ceremony',
    alt: 'Winners holding trophies on stage at valedictory ceremony',
    category: 'stage'
  }
];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredImages = selectedCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  return (
    <main>
      <section className="exhibition-header">
        <div className="container">
          <h1>EXHIBITION<br />GALLERY</h1>
        </div>
      </section>

      {/* Promo Media Section */}
      <section className="promo-media-section">
        <div className="container">
          <h2 className="promo-media-title">PROMO MEDIA</h2>

          <div className="video-wrapper">
            <video controls poster="/images/hero.webp" style={{ aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'top' }}>
              <source src="/media/promo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="audio-wrapper">
            <h3>Festival Anthem</h3>
            <audio controls className="audio-player-control">
              <source src="/media/intro.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </section>

      {/* Event Photographs */}
      <section className="page-section">
        <div className="container">
          <h2 className="past-editions-title">EVENT PHOTOGRAPHS</h2>

          {/* Category Filter Tabs */}
          <div className="category-btn-group" style={{ justifyContent: 'center', marginBottom: '30px' }}>
            <button
              type="button"
              className={`gallery-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Photos ({GALLERY_IMAGES.length})
            </button>
            <button
              type="button"
              className={`gallery-filter-btn ${selectedCategory === 'hackathons' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('hackathons')}
            >
              Hackathons & CTF
            </button>
            <button
              type="button"
              className={`gallery-filter-btn ${selectedCategory === 'workshops' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('workshops')}
            >
              Workshops & UX
            </button>
            <button
              type="button"
              className={`gallery-filter-btn ${selectedCategory === 'stage' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('stage')}
            >
              Main Stage & Awards
            </button>
          </div>

          <div className="exhibition-grid">
            {filteredImages.map((img, idx) => (
              <figure
                key={img.id}
                className="artwork-card"
                onClick={() => setLightboxIndex(idx)}
                style={{ cursor: 'pointer' }}
              >
                <img src={img.src} alt={img.alt} />
                <figcaption className="artwork-label">{img.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={filteredImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
};

export default GalleryPage;
