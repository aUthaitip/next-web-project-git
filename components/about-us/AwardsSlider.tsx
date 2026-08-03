'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Award } from '@/data/about-us/AwardsAccreditationsContent';

interface ApiEntry {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
}

interface AwardsSliderProps {
  slides: Award[][];
  apiEntries?: ApiEntry[];
}

export default function AwardsSlider({ slides, apiEntries = [] }: AwardsSliderProps) {
  const [activeGrid, setActiveGrid] = useState(0);

  const chunkSize = 3;
  const apiChunks: ApiEntry[][] = [];
  for (let i = 0; i < apiEntries.length; i += chunkSize) {
    apiChunks.push(apiEntries.slice(i, i + chunkSize));
  }

  const totalSlides = slides.length + apiChunks.length;

  return (
    <div className="slider-viewport">
      <div className="logo-scroll-container">
        <div
          className="slider-track"
          style={{
            display: 'flex',
            transform: `translateX(-${activeGrid * 100}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {/* Static slides จาก data file */}
          {slides.map((slideItems, slideIndex) => (
            <div key={slideIndex} className="slider-grid" style={{ width: '100%', flexShrink: 0 }}>
              <div className="awards-grid">
                {slideItems.map((award, itemIndex) => (
                  <div key={itemIndex} className="award-item">
                    <div className="award-image-box">
                      <Image
                        src={`/assets/${award.imageSrc}`}
                        alt={award.imageAlt}
                        width={400}
                        height={400}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                    <div className="award-text">
                      <h3>{award.title}</h3>
                      <p>{award.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Slides จาก API */}
          {apiChunks.map((chunk, chunkIndex) => (
            <div key={`api-${chunkIndex}`} className="slider-grid" style={{ width: '100%', flexShrink: 0 }}>
              <div className="awards-grid">
                {chunk.map((entry) => (
                  <div key={entry.id} className="award-item">
                    <div className="award-image-box">
                      <Image
                        src={entry.imageUrl || '/assets/รางวัล1.png'}
                        alt={entry.title}
                        width={400}
                        height={400}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                    <div className="award-text">
                      <h3>{entry.title}</h3>
                      <p>{entry.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="pagination-dots">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <span
            key={i}
            className={`dot ${activeGrid === i ? 'active' : ''}`}
            onClick={() => setActiveGrid(i)}
          />
        ))}
      </div>
    </div>
  );
}
