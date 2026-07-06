const fs = require('fs');
const path = '/Users/ice/Final-Project/app/(main)/book/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useLanguage } from '@/context/LanguageContext';");

content = content.replace("export default function BookPage() {", "export default function BookPage() {\n  const { t } = useLanguage();");

content = content.replace(/const SERVICES = \['ตรวจสุขภาพทั่วไป', 'ฉีดวัคซีน', 'ทำหมัน', 'ทันตกรรม', 'อื่นๆ'\];/g, 
`const SERVICES_ARR = ['ตรวจสุขภาพทั่วไป', 'ฉีดวัคซีน', 'ทำหมัน', 'ทันตกรรม', 'อื่นๆ'];`);

content = content.replace(/const PET_TYPES = \[\n.*?\];/s, `const PET_TYPES_ARR = ['สุนัข', 'แมว', 'กระต่าย', 'นก', 'อื่นๆ'];`);

content = content.replace("const today = new Date().toISOString().split('T')[0];", 
`const today = new Date().toISOString().split('T')[0];

  const SERVICES = [
    { label: t('book.svc1'), value: 'ตรวจสุขภาพทั่วไป' },
    { label: t('book.svc2'), value: 'ฉีดวัคซีน' },
    { label: t('book.svc3'), value: 'ทำหมัน' },
    { label: t('book.svc4'), value: 'ทันตกรรม' },
    { label: t('book.svc5'), value: 'อื่นๆ' },
  ];
  
  const PET_TYPES = [
    { label: t('book.petDog'), value: 'สุนัข' },
    { label: t('book.petCat'), value: 'แมว' },
    { label: t('book.petRabbit'), value: 'กระต่าย' },
    { label: t('book.petBird'), value: 'นก' },
    { label: t('book.petOther'), value: 'อื่นๆ' },
  ];
  
  const displayService = formData.service === 'อื่นๆ' ? formData.otherService : SERVICES.find(s => s.value === formData.service)?.label || formData.service;
  const displayPetType = formData.petType === 'อื่นๆ' ? formData.otherPetType : PET_TYPES.find(p => p.value === formData.petType)?.label || formData.petType;
`);

content = content.replace("<h2>📅 จองนัดหมาย</h2>", "<h2>{t('book.title')}</h2>");
content = content.replace("<p>กรอกรายละเอียดเพื่อนรักของคุณ ทีมงานจะยืนยันภายใน 24 ชั่วโมง</p>", "<p>{t('book.subtitle')}</p>");

content = content.replace("กรอกข้อมูล", "{t('book.step1')}");
content = content.replace("ตรวจสอบ", "{t('book.step2')}");

content = content.replace("🏥 บริการที่ต้องการ", "{t('book.serviceSectionTitle')}");
content = content.replace("ประเภทบริการ *", "{t('book.serviceLabel')}");
content = content.replace("กรุณาเลือกบริการ", "{t('book.serviceSelect')}");
content = content.replace(/{SERVICES\.map\(s => <option key={s} value={s}>{s}<\/option>\)}/g, "{SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}");

content = content.replace("ระบุบริการที่ต้องการ...", "{t('book.specifyPlaceholder')}");

content = content.replace("📅 วันที่นัดหมาย", "{t('book.dateSectionTitle')}");
content = content.replace("วันที่ *", "{t('book.dateLabel')}");
content = content.replace("<label className=\"book-label\">เวลา *</label>", "<label className=\"book-label\">{t('book.timeLabel')}</label>");

content = content.replace("👤 ข้อมูลเจ้าของ", "{t('book.ownerSectionTitle')}");
content = content.replace("ชื่อเจ้าของ *", "{t('book.ownerLabel')}");
content = content.replace("\"ชื่อ-นามสกุล\"", "{t('book.ownerPlaceholder')}");
content = content.replace("เบอร์โทรศัพท์ *", "{t('book.phoneLabel')}");

content = content.replace("🐾 ข้อมูลสัตว์เลี้ยง", "{t('book.petSectionTitle')}");
content = content.replace("ชื่อสัตว์เลี้ยง *", "{t('book.petNameLabel')}");
content = content.replace("\"ชื่อน้องหมา/แมว\"", "{t('book.petNamePlaceholder')}");
content = content.replace("ประเภทสัตว์เลี้ยง *", "{t('book.petTypeLabel')}");
content = content.replace(/{PET_TYPES\.map\(p => \([\s\S]*?<\/button>\n\s*\)\)}/m, 
`{PET_TYPES.map(p => (
                    <button key={p.value} type="button"
                      className={\`book-pet-pill \${formData.petType === p.value ? 'selected' : ''}\`}
                      onClick={() => set('petType', p.value)}>
                      {p.label}
                    </button>
                  ))}`);

content = content.replace("ระบุประเภทสัตว์เลี้ยง...", "{t('book.otherPetPlaceholder')}");

content = content.replace("รายละเอียดเพิ่มเติม", "{t('book.notesLabel')}");
content = content.replace("\"อาการ, ประวัติการรักษา, หรือข้อมูลอื่นๆ...\"", "{t('book.notesPlaceholder')}");

content = content.replace("ยกเลิก", "{t('book.cancelBtn')}");
content = content.replace("ตรวจสอบข้อมูล", "{t('book.nextBtn')}");

content = content.replace("<h3>🔍 ตรวจสอบรายละเอียด</h3>", "<h3>{t('book.summaryTitle')}</h3>");
content = content.replace("<p>กรุณาตรวจสอบข้อมูลก่อนยืนยันการจอง</p>", "<p>{t('book.summarySubtitle')}</p>");

content = content.replace(/\{ icon: '🏥', key: 'บริการ', val: resolvedService \}/g, "{ icon: '🏥', key: t('book.summaryService'), val: displayService }");
content = content.replace(/\{ icon: '📅', key: 'วันที่', val: formData\.date \}/g, "{ icon: '📅', key: t('book.summaryDate'), val: formData.date }");
content = content.replace(/\{ icon: '🕐', key: 'เวลา', val: `\$\{formData\.time\} น\.` \}/g, "{ icon: '🕐', key: t('book.summaryTime'), val: `${formData.time}` }");
content = content.replace(/\{ icon: '👤', key: 'ชื่อเจ้าของ', val: formData\.owner \}/g, "{ icon: '👤', key: t('book.summaryOwner'), val: formData.owner }");
content = content.replace(/\{ icon: '📞', key: 'เบอร์โทร', val: formData\.phone \}/g, "{ icon: '📞', key: t('book.summaryPhone'), val: formData.phone }");
content = content.replace(/\{ icon: '🐾', key: 'ชื่อสัตว์', val: formData\.petName \}/g, "{ icon: '🐾', key: t('book.summaryPet'), val: formData.petName }");
content = content.replace(/\{ icon: '🏷️', key: 'ประเภท', val: resolvedPetType \}/g, "{ icon: '🏷️', key: t('book.summaryType'), val: displayPetType }");
content = content.replace(/\{ icon: '📝', key: 'หมายเหตุ', val: formData\.notes \}/g, "{ icon: '📝', key: t('book.summaryNotes'), val: formData.notes }");

content = content.replace("แก้ไข", "{t('book.editBtn')}");
content = content.replace(/'กำลังบันทึก...' : '✅ ยืนยันการจอง'/g, "t('book.savingBtn') : t('book.confirmBtn')");

content = content.replace("จองนัดหมายสำเร็จ!", "{t('book.successTitle')}");
content = content.replace("ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียดภายใน 24 ชั่วโมง", "{t('book.successDesc')}");
content = content.replace("• ระบบส่ง email ยืนยันแล้ว", "• {t('book.successEmail')}");
content = content.replace("ดูนัดหมายของฉัน", "{t('book.viewApptBtn')}");
content = content.replace("กลับหน้าหลัก", "{t('book.homeBtn')}");
content = content.replace(">จองนัดใหม่<", ">{t('book.bookAgainBtn')}<");

fs.writeFileSync(path, content);
console.log('Fixed book page translations!');
