'use client';
import { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { contactFormData } from '@/data/home/ContactForm';

export default function ContactForm() {
  const { lang } = useLanguage();
  const data = contactFormData[lang];
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(data.sendError);

      alert(data.sendSuccess);
      setForm({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: '',
      });
    } catch (err) {
      alert(data.sendError);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-card-wrapper">
          <div className="contact-info-panel">
            <div className="info-content">
              <h2>{data.contactTitle}</h2>
              <p className="subtitle">{data.contactSubtitle}</p>
              <div className="meta-info-list">
                <div className="info-item">
                  <div className="icon-box"><Mail size={20} /></div>
                  <span>pawplan@gmail.com</span>
                </div>
                <div className="info-item">
                  <div className="icon-box"><MessageSquare size={20} /></div>
                  <span>@pawplanclinic</span>
                </div>
              </div>
            </div>
            <div className="decoration-circle"></div>
          </div>

          <form className="modern-form-body" onSubmit={handleSubmit}>
            <div className="form-input-grid">
              <div className="input-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder={data.namePlaceholder}
                  required 
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder={data.phonePlaceholder}
                  required 
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group full-width">
                <input 
                  type="email" 
                  name="email" 
                  placeholder={data.emailPlaceholder}
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group full-width">
                <select name="service" defaultValue="" onChange={handleChange} required>
                  <option value="" disabled>
                    {data.selectService}
                  </option>
                  <option value="checkup">{data.svcCheckup}</option>
                  <option value="emergency">{data.svcEmergency}</option>
                  <option value="grooming">{data.svcGrooming}</option>
                </select>
              </div>
              <div className="input-group full-width">
                <textarea 
                  name="message" 
                  placeholder={data.notesPlaceholder}
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn-send-now">
              <span>{data.sendBtn}</span>
              <Send size={16} className="send-icon" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
