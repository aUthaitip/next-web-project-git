// components/DoctorCard.tsx
import React from 'react';
import Image from 'next/image';

interface DoctorProps {
  name: string;
  nickname: string;
  role: string;
  expertise: string;
  quote: string;
  imageSrc: string;
}

export default function DoctorCard({ name, nickname, role, expertise, quote, imageSrc }: DoctorProps) {
  return (
    <article className="doctor-card">
      <div className="doctor-card__image-wrapper">
        <Image 
          src={imageSrc}
          alt={`${nickname} - ${role}`}
          width={300}
          height={300}
          className="doctor-card__image"
          priority
        />
      </div>
      
      <div className="doctor-card__content">
        <header className="doctor-card__header">
          <h3 className="doctor-card__name">{name}</h3>
          <span className="doctor-card__nickname">{nickname}</span>
        </header>
        
        <div className="doctor-card__details">
          <p className="doctor-card__role">{role}</p>
          <p className="doctor-card__expertise">
            <span className="label">ความเชี่ยวชาญ:</span>
            <span className="text">{expertise}</span>
          </p>
          <blockquote className="doctor-card__quote">
            {quote}
          </blockquote>
        </div>
      </div>
    </article>
  );
}