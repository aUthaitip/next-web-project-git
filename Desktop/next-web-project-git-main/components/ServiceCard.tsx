// components/ServiceCard.tsx
import React from 'react';

interface ServiceProps {
  title: string;
  description: string;
  icon?: string; // สำหรับใส่ Emoji/Icon นำหน้า
}

export default function ServiceCard({ title, description, icon }: ServiceProps) {
  return (
    <div className="service-card">
      <h3>{icon} {title}</h3>
      <p>{description}</p>
    </div>
  );
}