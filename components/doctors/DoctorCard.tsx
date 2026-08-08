import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface DoctorProps {
  id?: number;
  name: string;
  nameEn?: string | null;
  role?: string;
  specialty?: string;
  expertise?: string;
  expertiseEn?: string | null;
  imageUrl?: string;
  bio?: string;
  bioEn?: string | null;
  availableDays?: string[];
}

const DAY_LABELS_TH: Record<string, string> = {
  Mon: 'จ', Tue: 'อ', Wed: 'พ', Thu: 'พฤ', Fri: 'ศ', Sat: 'ส', Sun: 'อา',
};

const DAY_LABELS_EN: Record<string, string> = {
  Mon: 'M', Tue: 'T', Wed: 'W', Thu: 'T', Fri: 'F', Sat: 'S', Sun: 'S',
};

export default function DoctorCard({ name, nameEn, role, specialty, expertise, expertiseEn, imageUrl, bio, bioEn, availableDays }: DoctorProps) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  
  const displayName = (isEn && nameEn) ? nameEn : name;
  const rawExpertise = expertiseEn && isEn ? expertiseEn : (expertise || specialty || role || '');
  const displayRole = rawExpertise;
  const displayBio = (isEn && bioEn) ? bioEn : bio;

  const days = availableDays || [];
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const TODAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const isOnline = days.includes(TODAY);
  
  const dayLabels = isEn ? DAY_LABELS_EN : DAY_LABELS_TH;

  return (
    <article className="dr-card">
      {/* Image */}
      <div className="dr-card__img-wrap">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayName}
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
        {isOnline && <span className="dr-card__online-badge">● {isEn ? 'Available' : 'พร้อมให้บริการ'}</span>}
        <div className="dr-card__img-name">
          <h3>{displayName}</h3>
          {displayRole && <p>{displayRole}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="dr-card__body">
        {displayBio && <p className="dr-card__bio">{displayBio}</p>}

        {/* Available days */}
        {days.length > 0 && (
          <div className="dr-card__days-section">
            <span className="dr-card__days-label">📅 {isEn ? 'Available Days' : 'วันให้บริการ'}</span>
            <div className="dr-card__days">
              {allDays.map((d) => (
                <span key={d} className={`dr-card__day ${days.includes(d) ? 'active' : ''} ${d === TODAY && days.includes(d) ? 'today' : ''}`}>
                  {dayLabels[d]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <a href="/appointment" className="dr-card__btn">
          {isEn ? 'Book Now' : 'นัดหมาย'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  );
}
