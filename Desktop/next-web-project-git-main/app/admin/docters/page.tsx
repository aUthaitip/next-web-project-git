'use client';
import React, { useState } from 'react';
import HideHeader from '@/components/HideHeader';

type Doctor = {
  id: number;
  name: string;
  specialty?: string;
  email?: string;
  status?: 'Admin' | 'Active' | 'Disable'; 
};

const mockDoctors: Doctor[] = [
  { id: 1, name: 'นพ. สมชาย ใจดี', specialty: 'อายุรกรรม', email: 'somchai@example.com', status: 'Admin' }, 
  { id: 2, name: 'นพ. สมหมาย สุขสบาย', specialty: 'จักษุแพทย์', email: 'somm@exam.com', status: 'Active' },
  { id: 3, name: 'พนง. ทดสอบ', specialty: 'บริการ', email: 'staff@example.com', status: 'Disable' },
];

export default function DoctorsAdminPage() {
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const openCreate = () => {
    setSelected(null);
    setEditing(true);
  };

  const openEdit = (d: Doctor) => {
    setSelected(d);
    setEditing(true);
  };

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call API to save
    alert('บันทึกเรียบร้อย (จำลอง)');
    setEditing(false);
  };

  const getStatusBadgeClass = (status: Doctor['status']) => {
    if (status === 'Admin') return 'badge admin';
    if (status === 'Active') return 'badge active';
    return 'badge disable';
  };

  return (
    <div className="admin-page-wrapper theme-fakaow">
      <HideHeader />
      {/* HEADER + SEARCH + ADD BUTTON */}
      <div className="page-header-controls">
        <div>
          <h1 className="accent">จัดการบัญชีผู้ใช้</h1>
          <p className="muted">เพิ่ม แก้ไข หรือลบข้อมูลแพทย์และพนักงาน</p>
        </div>
        <div className="control-group">
          <input
            type="search" 
            placeholder="ค้นหา ชื่อ/สาขา..."
            aria-label="ค้นหา"
          />
          
          {/* ✨ ปุ่มที่ปรับปรุง: สร้างบัญชีใหม่ ✨ */}
          <button
            onClick={openCreate}
            className="btn-primary create-new-user-btn" 
          >
            <span style={{ marginRight: '8px' }}>➕</span> เพิ่มผู้ใช้งาน
          </button>
        </div>
      </div>

      {/* MAIN CONTENT: LIST + DETAIL (Card Style) */}
      <div className="main-panel card">
        <div className="detail-panel-layout">
          
          {/* ASIDE: LIST VIEW */}
          <aside className="list-panel">
            <ul className="list-items-container">
              {doctors.map((d) => (
                <li
                  key={d.id}
                  className={`list-item-card ${selected?.id === d.id ? 'is-selected' : 'hover-effect'}`}
                  onClick={() => setSelected(d)}
                >
                  <div className="avatar w-10 h-10"> 
                    {d.name.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase()}
                  </div>
                  <div className="list-item-text-area">
                    <div style={{ fontWeight: 600 }}>{d.name}</div>
                    <div className="muted">{d.specialty ?? '-'}</div>
                  </div>
                  <div className="text-xs">
                    <span className={getStatusBadgeClass(d.status)}>
                      {d.status?.split('')[0].toUpperCase() ?? '-'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* MAIN: DETAIL / FORM VIEW */}
          <main className="detail-panel">
            
            {/* 1. NO SELECTION / NO EDITING */}
            {!selected && !editing && (
              <div className="no-selection-placeholder">
                <p className="muted">เลือกผู้ใช้งานจากด้านซ้าย หรือกด "เพิ่มแพทย์ใหม่" เพื่อสร้างรายการใหม่</p>
              </div>
            )}

            {/* 2. DETAIL VIEW (Selected, Not Editing) */}
            {(selected && !editing) && (
              <div className="detail-card-view">
                <div className="detail-header">
                  <div>
                    <h2 className="accent">{selected.name}</h2>
                    <p className="muted">{selected.specialty}</p>
                    <p className="muted">{selected.email}</p>
                  </div>
                  <div className="control-group">
                    <button
                      onClick={() => openEdit(selected)}
                      className="btn-secondary"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => { if (confirm('ลบผู้ใช้งานนี้หรือไม่?')) alert('ลบแล้ว (จำลอง)'); }}
                      className="btn-secondary danger-button" 
                    >
                      ลบ
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: '25px' }}>
                  <dl className="info-grid">
                    <div>
                      <dt style={{ fontWeight: 600 }}>อีเมล</dt>
                      <dd className="muted">{selected.email ?? '-'}</dd>
                    </div>
                    <div>
                      <dt style={{ fontWeight: 600 }}>สถานะ</dt>
                      <dd className="muted">
                        <span className={getStatusBadgeClass(selected.status)}>
                          {selected.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* 3. EDIT/CREATE FORM VIEW */}
            {editing && (
              <div className="form-view-panel">
                <h3 className="accent">{selected ? 'แก้ไขผู้ใช้งาน' : 'สร้างผู้ใช้งานใหม่'}</h3>
                <form onSubmit={save} className="form-layout-group">
                  <div>
                    <label className="muted">ชื่อ - ตำแหน่ง</label>
                    <input defaultValue={selected?.name ?? ''} required />
                  </div>

                  <div>
                    <label className="muted">สาขา</label>
                    <input defaultValue={selected?.specialty ?? ''} />
                  </div>

                  <div>
                    <label className="muted">อีเมล</label>
                    <input type="email" defaultValue={selected?.email ?? ''} />
                  </div>

                  <div className="select-group">
                    <label className="muted">สถานะ</label>
                    <select defaultValue={selected?.status ?? 'Active'}>
                      <option value="Admin">Admin</option>
                      <option value="Active">Active</option>
                      <option value="Disable">Disable</option>
                    </select>
                  </div>

                  <div className="control-group">
                    <button type="submit" className="btn-primary">บันทึก</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn-secondary">ยกเลิก</button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}