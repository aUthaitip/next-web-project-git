interface Appointment {
  id: number;
  petName: string;
  petType: string;
  service: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  doctorName?: string;
  owner: string;
  phone: string;
}

interface StatusLabelInfo {
  text: string;
  color: string;
  bg: string;
}

interface AppointmentCardProps {
  appt: Appointment;
  statusLabel: Record<string, StatusLabelInfo>;
  notesLabel: string;
  editText: string;
  rescheduleText: string;
  cancelText: string;
  confirmThisAppt?: string;
  onEdit?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onConfirmSuggested?: () => void;
  showActions: boolean;
  actionLoading?: boolean;
}

export default function AppointmentCard({
  appt,
  statusLabel,
  notesLabel,
  editText,
  rescheduleText,
  cancelText,
  confirmThisAppt,
  onEdit,
  onCancel,
  onReschedule,
  onConfirmSuggested,
  showActions,
  actionLoading,
}: AppointmentCardProps) {
  const s = statusLabel[appt.status] || statusLabel.pending;

  return (
    <div className={`my-appt-card ${appt.status}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>
              {(appt.petType === 'แมว' || appt.petType === 'Cat') ? '🐱' : (appt.petType === 'สุนัข' || appt.petType === 'Dog') ? '🐶' : '🐾'}
            </span>
            <strong style={{ fontSize: 16, color: '#111827' }}>{appt.petName}</strong>
            <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.text}</span>
          </div>
          <div style={{ color: '#6b7280', fontSize: 14, display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
            <span>🏥 {appt.service}</span>
            {appt.doctorName && <span>👩‍⚕️ {appt.doctorName}</span>}
            <span>📅 {appt.date}</span>
            <span>🕐 {appt.time}</span>
          </div>
          {appt.notes && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#9ca3af' }}>{notesLabel} {appt.notes}</p>}
        </div>
        {showActions && appt.status !== 'cancelled' && appt.status !== 'completed' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {appt.status === 'suggested' && (
              <button
                onClick={onConfirmSuggested}
                disabled={actionLoading}
                className="btn-appt-edit"
                style={{ background: '#e0e7ff', color: '#4338ca', borderColor: '#c7d2fe', opacity: actionLoading ? 0.6 : 1 }}
              >
                {confirmThisAppt}
              </button>
            )}
            {appt.status !== 'suggested' && (
              <button onClick={onEdit} disabled={actionLoading} className="btn-appt-edit" style={{ opacity: actionLoading ? 0.6 : 1 }}>
                {editText}
              </button>
            )}
            <button onClick={onReschedule} disabled={actionLoading} className="btn-appt-reschedule" style={{ opacity: actionLoading ? 0.6 : 1 }}>
              {rescheduleText}
            </button>
            <button onClick={onCancel} disabled={actionLoading} className="btn-appt-cancel" style={{ opacity: actionLoading ? 0.6 : 1 }}>
              {actionLoading ? '...' : cancelText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export type { Appointment, StatusLabelInfo };
