'use client';

export default function NewsModal({ onClose, children }: { onClose: () => void, children: React.ReactNode }) {
    return (
        <div className="modal is-visible">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
}
