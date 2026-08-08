import prisma from '@/backend/prisma';
import Link from 'next/link';
import { CheckCircle2, Calendar, Clock, Award, ShieldCheck, Home } from 'lucide-react';

import { Metadata } from 'next';

export const runtime = 'nodejs';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `ยืนยันนัดหมาย #${resolvedParams.id} | Pawplan`,
    description: `ระบบรับทราบและยืนยันการเข้ารับบริการของสัตว์เลี้ยง หมายเลขนัดหมาย #${resolvedParams.id}`,
  };
}

export default async function AcknowledgePage({ params }: PageProps) {
  const resolvedParams = await params;
  const appointmentId = parseInt(resolvedParams.id);

  let success = false;
  let appointment: any = null;
  let errorMsg = '';

  if (isNaN(appointmentId)) {
    errorMsg = 'หมายเลขนัดหมายไม่ถูกต้อง';
  } else {
    try {
      // Find the appointment
      appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) {
        errorMsg = 'ไม่พบนัดหมายในระบบ';
      } else {
        // Update to acknowledged
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            acknowledged: true,
            acknowledgedAt: new Date(),
          },
        });
        success = true;
      }
    } catch (err) {
      console.error('Error acknowledging appointment:', err);
      errorMsg = 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล';
    }
  }

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #f0fdfa, #f9fafb)',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(13, 148, 136, 0.08)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Decorative Top Accent */}
        <div style={{
          height: '8px',
          background: success ? 'linear-gradient(90deg, #0d9488, #14b8a6)' : 'linear-gradient(90deg, #ef4444, #f87171)',
        }} />

        <div style={{ padding: '40px 32px' }}>
          {success ? (
            <>
              {/* Success Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#ccfbf1',
                color: '#0d9488',
                marginBottom: '24px',
              }}>
                <CheckCircle2 size={44} />
              </div>

              <h1 style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#1e293b',
                margin: '0 0 8px 0',
              }}>
                รับทราบการนัดหมายแล้ว!
              </h1>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                margin: '0 0 32px 0',
                lineHeight: 1.6,
              }}>
                ขอบคุณที่ยืนยันการรับทราบ ระบบได้บันทึกการยืนยันของคุณเรียบร้อยแล้ว หวังว่าจะได้พบคุณและสัตว์เลี้ยงในวันนัดหมายครับ 🐾
              </p>

              {/* Appointment Card */}
              {appointment && (
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '32px',
                  textAlign: 'left',
                  border: '1px solid #f1f5f9',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '12px',
                  }}>
                    <span style={{ fontSize: '24px' }}>🐶</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                        {appointment.petName}
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                        {appointment.petType}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Award size={18} color="#0d9488" />
                      <span style={{ fontSize: '14px', color: '#334155' }}>
                        บริการ: <strong>{appointment.service}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Calendar size={18} color="#0d9488" />
                      <span style={{ fontSize: '14px', color: '#334155' }}>
                        วันที่: <strong>{appointment.date}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Clock size={18} color="#0d9488" />
                      <span style={{ fontSize: '14px', color: '#334155' }}>
                        เวลา: <strong>{appointment.time} น.</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/" style={primaryBtnStyle}>
                  <Home size={18} />
                  กลับหน้าหลัก
                </Link>
                <Link href="/my-appointments" style={secondaryBtnStyle}>
                  ดูนัดหมายทั้งหมด
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Error State */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#ef4444',
                marginBottom: '24px',
              }}>
                <ShieldCheck size={44} />
              </div>

              <h1 style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#1e293b',
                margin: '0 0 8px 0',
              }}>
                ไม่สามารถยืนยันนัดหมายได้
              </h1>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                margin: '0 0 32px 0',
                lineHeight: 1.6,
              }}>
                {errorMsg || 'เกิดข้อผิดพลาดในการตรวจสอบนัดหมาย กรุณาลองใหม่อีกครั้ง หรือเข้าสู่ระบบเพื่อตรวจสอบในหน้านัดหมายของคุณ'}
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/login" style={primaryBtnStyle}>
                  เข้าสู่ระบบ PawPlan
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '14px',
  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  border: 'none',
  cursor: 'pointer',
};

const secondaryBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  background: '#f1f5f9',
  color: '#334155',
  textDecoration: 'none',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '14px',
  transition: 'background 0.2s',
  border: '1px solid #e2e8f0',
  cursor: 'pointer',
};
