'use client';

import Image from 'next/image';

interface DoctorProps {
  id?: number;
  name: string;
  role?: string;
  specialty?: string;
  expertise?: string;
  imageUrl?: string;
  bio?: string;
  availableDays?: string[];
}

const DAY_LABELS: Record<string, string> = {
  Mon: 'จ', Tue: 'อ', Wed: 'พ', Thu: 'พฤ', Fri: 'ศ', Sat: 'ส', Sun: 'อา',
};

export default function DoctorCard({ name, role, specialty, expertise, imageUrl, bio, availableDays }: DoctorProps) {
  const displayRole = specialty || expertise || role || '';
  const days = availableDays || [];
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const TODAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const isOnline = days.includes(TODAY);

  return (
    <article className="dr-card">
      {/* Image */}
      <div className="dr-card__img-wrap">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="dr-card__img"
            sizes="(max-width: 768px) 100vw, 340px"
          />
        ) : (
          <div className="dr-card__img-placeholder">
            <span>👨‍⚕️</span>
          </div>
        )}
        <div className="dr-card__img-gradient" />
        {isOnline && <span className="dr-card__online-badge">● พร้อมให้บริการ</span>}
        <div className="dr-card__img-name">
          <h3>{name}</h3>
          {displayRole && <p>{displayRole}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="dr-card__body">
        {bio && <p className="dr-card__bio">{bio}</p>}

        {/* Available days */}
        {days.length > 0 && (
          <div className="dr-card__days-section">
            <span className="dr-card__days-label">📅 วันให้บริการ</span>
            <div className="dr-card__days">
              {allDays.map((d) => (
                <span key={d} className={`dr-card__day ${days.includes(d) ? 'active' : ''} ${d === TODAY && days.includes(d) ? 'today' : ''}`}>
                  {DAY_LABELS[d]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <a href="/appointment" className="dr-card__btn">
          นัดหมาย
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  );
}
