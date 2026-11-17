import React from 'react';

interface ServiceProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function ServiceCard({ title, description, icon }: ServiceProps) {
  return (
    <div className="service-card-modern">
      <div className="service-card-header">
        {icon && <div className="service-card-icon">{icon}</div>}
        <h3 className="service-card-title">{title}</h3>
      </div>
      <p className="service-card-description">{description}</p>
      <div className="service-card-accent"></div>
    </div>
  );
}
