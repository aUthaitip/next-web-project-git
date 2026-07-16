'use client';

import { useState, useEffect } from 'react';
import HideHeader from '@/components/layout/HideHeader';
import HideFooter from '@/components/layout/HideFooter';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ArticleModal from '@/components/admin/ArticleModal';
import AboutUsModal from '@/components/admin/AboutUsModal';
import { useLanguage } from '@/context/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: number;
  title: string;
  category: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ArticleForm {
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  published: boolean;
}

interface AboutUsEntry {
  id: number;
  section: string;
  title: string;
  category?: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface AboutUsForm {
  section: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  published: boolean;
  sortOrder: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'General',
  'Health Tips',
  'Cat',
  'Dog',
];
const ABOUT_SECTIONS = [
  { value: 'awards_accreditation', label: '🏆 Awards & Accreditation' },
  { value: 'news_activities', label: '📰 News & Activities' },
];
const emptyArticleForm: ArticleForm = {
  title: '', category: 'General', content: '', imageUrl: '', published: false,
};

const emptyAboutForm: AboutUsForm = {
  section: 'awards_accreditation', title: '', category: '', content: '', imageUrl: '', published: false, sortOrder: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContentAdminPage() {
  const { lang } = useLanguage();
  // Tab state
  const [activeTab, setActiveTab] = useState<'articles' | 'about-us'>('articles');

  // ── Articles state (unchanged) ──────────────────────────────────────────────
  const [articles, setArticles] = useState<Article[]>([]);
  const [artLoading, setArtLoading] = useState(true);
  const [artSearch, setArtSearch] = useState('');
  const [artFilterCat, setArtFilterCat] = useState('all');
  const [artSelected, setArtSelected] = useState<Article | null>(null);
  const [artIsNew, setArtIsNew] = useState(false);
  const [artForm, setArtForm] = useState<ArticleForm>(emptyArticleForm);
  const [artSaving, setArtSaving] = useState(false);

  // ── About Us state ──────────────────────────────────────────────────────────
  const [aboutEntries, setAboutEntries] = useState<AboutUsEntry[]>([]);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [aboutSearch, setAboutSearch] = useState('');
  const [aboutFilterSection, setAboutFilterSection] = useState('all');
  const [aboutSelected, setAboutSelected] = useState<AboutUsEntry | null>(null);
  const [aboutIsNew, setAboutIsNew] = useState(false);
  const [aboutForm, setAboutForm] = useState<AboutUsForm>(emptyAboutForm);
  const [aboutSaving, setAboutSaving] = useState(false);

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => { fetchArticles(); }, []);
  useEffect(() => { fetchAboutUs(); }, []);

  // ── Articles API ────────────────────────────────────────────────────────────

  const fetchArticles = async () => {
    try {
      setArtLoading(true);
      const res = await fetch('/api/content');
      if (!res.ok) { setArticles([]); return; }
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchArticles error', err);
      setArticles([]);
    } finally {
      setArtLoading(false);
    }
  };

  const openArtNew = () => { setArtForm(emptyArticleForm); setArtSelected(null); setArtIsNew(true); };
  const openArtEdit = (a: Article) => {
    setArtForm({ title: a.title, category: a.category, content: a.content, imageUrl: a.imageUrl || '', published: a.published });
    setArtSelected(a); setArtIsNew(false);
  };
  const closeArtModal = () => { setArtSelected(null); setArtIsNew(false); };

  const handleArtSave = async (e: React.FormEvent) => {
    e.preventDefault(); setArtSaving(true);
    try {
      if (artIsNew) {
        await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(artForm) });
      } else if (artSelected) {
        await fetch(`/api/content/${artSelected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(artForm) });
      }
      closeArtModal(); fetchArticles();
    } catch (err) { console.error('art save error', err); }
    finally { setArtSaving(false); }
  };

  const handleArtDelete = async (a: Article) => {
    if (!confirm(lang === 'th' ? `ลบบทความ "${a.title}" หรือไม่?` : `Delete article "${a.title}"?`)) return;
    try { await fetch(`/api/content/${a.id}`, { method: 'DELETE' }); fetchArticles(); }
    catch (err) { console.error('art delete error', err); }
  };

  const handleArtToggle = async (a: Article) => {
    try {
      await fetch(`/api/content/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...a, published: !a.published }) });
      fetchArticles();
    } catch (err) { console.error('art toggle error', err); }
  };

  const artFiltered = articles.filter((a) => {
    const matchCat = artFilterCat === 'all' || a.category === artFilterCat;
    const matchSearch = a.title.toLowerCase().includes(artSearch.toLowerCase()) || a.category.toLowerCase().includes(artSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── About Us API ────────────────────────────────────────────────────────────

  const fetchAboutUs = async () => {
    try {
      setAboutLoading(true);
      const res = await fetch('/api/about-us');
      if (!res.ok) { setAboutEntries([]); return; }
      const data = await res.json();
      setAboutEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchAboutUs error', err);
      setAboutEntries([]);
    } finally {
      setAboutLoading(false);
    }
  };

  const openAboutNew = () => { setAboutForm(emptyAboutForm); setAboutSelected(null); setAboutIsNew(true); };
  const openAboutEdit = (e: AboutUsEntry) => {
    setAboutForm({ section: e.section, title: e.title, category: e.category || '', content: e.content, imageUrl: e.imageUrl || '', published: e.published, sortOrder: e.sortOrder });
    setAboutSelected(e); setAboutIsNew(false);
  };
  const closeAboutModal = () => { setAboutSelected(null); setAboutIsNew(false); };

  const handleAboutSave = async (e: React.FormEvent) => {
    e.preventDefault(); setAboutSaving(true);
    try {
      if (aboutIsNew) {
        await fetch('/api/about-us', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aboutForm) });
      } else if (aboutSelected) {
        await fetch(`/api/about-us/${aboutSelected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aboutForm) });
      }
      closeAboutModal(); fetchAboutUs();
    } catch (err) { console.error('about save error', err); }
    finally { setAboutSaving(false); }
  };

  const handleAboutDelete = async (entry: AboutUsEntry) => {
    if (!confirm(lang === 'th' ? `ลบ "${entry.title}" หรือไม่?` : `Delete "${entry.title}"?`)) return;
    try { await fetch(`/api/about-us/${entry.id}`, { method: 'DELETE' }); fetchAboutUs(); }
    catch (err) { console.error('about delete error', err); }
  };

  const handleAboutToggle = async (entry: AboutUsEntry) => {
    try {
      await fetch(`/api/about-us/${entry.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...entry, published: !entry.published }) });
      fetchAboutUs();
    } catch (err) { console.error('about toggle error', err); }
  };

  const aboutFiltered = aboutEntries.filter((e) => {
    const matchSection = aboutFilterSection === 'all' || e.section === aboutFilterSection;
    const matchSearch = e.title.toLowerCase().includes(aboutSearch.toLowerCase());
    return matchSection && matchSearch;
  });

  const getSectionLabel = (val: string) => ABOUT_SECTIONS.find((s) => s.value === val)?.label ?? val;

  // ── Stats ───────────────────────────────────────────────────────────────────

  const artPublished = articles.filter((a) => a.published).length;
  const aboutPublished = aboutEntries.filter((e) => e.published).length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="admin-layout">
      <HideHeader />
      <div className="admin-container-new">
        <AdminSidebar />

        <div className="admin-content-new">
          {/* Header */}
          <div className="admin-header-new">
            <div>
              <h1>Content Management</h1>
              <p>{lang === 'th' ? 'จัดการบทความและเนื้อหาของคลินิก' : 'Manage clinic articles and content'}</p>
            </div>
            <button
              className="admin-btn admin-btn-primary"
              onClick={activeTab === 'articles' ? openArtNew : openAboutNew}
            >
              + {activeTab === 'articles' ? (lang === 'th' ? 'เพิ่มบทความ' : 'Add Article') : (lang === 'th' ? 'เพิ่มเนื้อหา About Us' : 'Add About Us Content')}
            </button>
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
            {[
              { key: 'articles', label: lang === 'th' ? '📄 บทความ' : '📄 Articles' },
              { key: 'about-us', label: '🏢 About Us' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'articles' | 'about-us')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                  marginBottom: -2,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'articles' && (
            <>
              {/* Stats */}
              <div className="stats-grid-new">
                <div className="stat-card-new stat-blue">
                  <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'ทั้งหมด' : 'Total'}</div><div className="stat-icon-new">📄</div></div>
                  <div className="stat-value-new">{articles.length}</div>
                  <div className="stat-desc-new">{lang === 'th' ? 'บทความในระบบ' : 'Total articles'}</div>
                </div>
                <div className="stat-card-new stat-green">
                  <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'เผยแพร่แล้ว' : 'Published'}</div><div className="stat-icon-new">✅</div></div>
                  <div className="stat-value-new">{artPublished}</div>
                  <div className="stat-desc-new">Published</div>
                </div>
                <div className="stat-card-new stat-orange">
                  <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'แบบร่าง' : 'Draft'}</div><div className="stat-icon-new">📝</div></div>
                  <div className="stat-value-new">{articles.length - artPublished}</div>
                  <div className="stat-desc-new">Draft</div>
                </div>
                <div className="stat-card-new stat-blue">
                  <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'หมวดหมู่' : 'Categories'}</div><div className="stat-icon-new">🏷️</div></div>
                  <div className="stat-value-new">{CATEGORIES.length}</div>
                  <div className="stat-desc-new">{lang === 'th' ? 'ประเภทเนื้อหา' : 'Content types'}</div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="appointments-toolbar">
                <div className="search-box-new">
                  <span className="search-icon-new">🔍</span>
                  <input type="text" placeholder={lang === 'th' ? 'ค้นหาบทความ...' : 'Search articles...'} value={artSearch} onChange={(e) => setArtSearch(e.target.value)} className="search-input-new" />
                </div>
                <select value={artFilterCat} onChange={(e) => setArtFilterCat(e.target.value)} className="filter-select-new">
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Table */}
              <div className="table-container-new">
                {artLoading ? (
                  <div className="table-empty">⏳ {lang === 'th' ? 'กำลังโหลด...' : 'Loading...'}</div>
                ) : artFiltered.length === 0 ? (
                  <div className="table-empty">📭 {lang === 'th' ? 'ไม่พบบทความ' : 'No articles found'}</div>
                ) : (
                  <table className="appointments-table">
                    <thead>
                      <tr><th>{lang === 'th' ? 'บทความ' : 'Article'}</th><th>{lang === 'th' ? 'หมวดหมู่' : 'Category'}</th><th>{lang === 'th' ? 'สถานะ' : 'Status'}</th><th>{lang === 'th' ? 'วันที่สร้าง' : 'Created At'}</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {artFiltered.map((article) => (
                        <tr key={article.id} className="table-row-hover">
                          <td>
                            <div className="table-pet-cell">
                              {article.imageUrl
                                ? <img src={article.imageUrl} alt={article.title} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                : <div className="pet-avatar">📄</div>}
                              <div>
                                <div className="pet-name">{article.title}</div>
                                <div className="owner-name" style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {article.content.substring(0, 60)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td><span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>{article.category}</span></td>
                          <td>
                            <button onClick={() => handleArtToggle(article)} className="status-badge" style={{ backgroundColor: article.published ? '#d1fae520' : '#fef3c720', color: article.published ? '#10b981' : '#f59e0b', border: 'none', cursor: 'pointer' }}>
                              {article.published ? '✅ Published' : '📝 Draft'}
                            </button>
                          </td>
                          <td><div className="date-value">{new Date(article.createdAt).toLocaleDateString('th-TH')}</div></td>
                          <td className="actions-cell">
                            <button className="admin-btn admin-btn-secondary" style={{ marginRight: 8, padding: '4px 12px', fontSize: 13 }} onClick={() => openArtEdit(article)}>✏️ {lang === 'th' ? 'แก้ไข' : 'Edit'}</button>
                            <button className="doctor-card-admin__btn-delete" onClick={() => handleArtDelete(article)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB: About Us  (ใหม่)
          ════════════════════════════════════════════════════════════ */}
          {activeTab === 'about-us' && (
            <>
              {/* Stats */}
              <div className="stats-grid-new">
                <div className="stat-card-new stat-blue">
                  <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'ทั้งหมด' : 'Total'}</div><div className="stat-icon-new">🏢</div></div>
                  <div className="stat-value-new">{aboutEntries.length}</div>
                  <div className="stat-desc-new">{lang === 'th' ? 'เนื้อหา About Us' : 'About Us Content'}</div>
                </div>
                <div className="stat-card-new stat-green">
                  <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'เผยแพร่แล้ว' : 'Published'}</div><div className="stat-icon-new">✅</div></div>
                  <div className="stat-value-new">{aboutPublished}</div>
                  <div className="stat-desc-new">Published</div>
                </div>
                <div className="stat-card-new stat-orange">
                  <div className="stat-top"><div className="stat-label-text">{lang === 'th' ? 'แบบร่าง' : 'Draft'}</div><div className="stat-icon-new">📝</div></div>
                  <div className="stat-value-new">{aboutEntries.length - aboutPublished}</div>
                  <div className="stat-desc-new">Draft</div>
                </div>
                <div className="stat-card-new stat-blue">
                  <div className="stat-top"><div className="stat-label-text">Sections</div><div className="stat-icon-new">🗂️</div></div>
                  <div className="stat-value-new">{ABOUT_SECTIONS.length}</div>
                  <div className="stat-desc-new">{lang === 'th' ? 'หัวข้อ About Us' : 'About Us Sections'}</div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="appointments-toolbar">
                <div className="search-box-new">
                  <span className="search-icon-new">🔍</span>
                  <input type="text" placeholder={lang === 'th' ? 'ค้นหาเนื้อหา...' : 'Search content...'} value={aboutSearch} onChange={(e) => setAboutSearch(e.target.value)} className="search-input-new" />
                </div>
                <select value={aboutFilterSection} onChange={(e) => setAboutFilterSection(e.target.value)} className="filter-select-new">
                  <option value="all">All Sections</option>
                  {ABOUT_SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {/* Table */}
              <div className="table-container-new">
                {aboutLoading ? (
                  <div className="table-empty">⏳ {lang === 'th' ? 'กำลังโหลด...' : 'Loading...'}</div>
                ) : aboutFiltered.length === 0 ? (
                  <div className="table-empty">📭 {lang === 'th' ? 'ไม่พบเนื้อหา' : 'No content found'}</div>
                ) : (
                  <table className="appointments-table">
                    <thead>
                      <tr><th>{lang === 'th' ? 'เนื้อหา' : 'Content'}</th><th>Section</th><th>{lang === 'th' ? 'ลำดับ' : 'Order'}</th><th>{lang === 'th' ? 'สถานะ' : 'Status'}</th><th>{lang === 'th' ? 'วันที่สร้าง' : 'Created At'}</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {aboutFiltered.map((entry) => (
                        <tr key={entry.id} className="table-row-hover">
                          <td>
                            <div className="table-pet-cell">
                              {entry.imageUrl
                                ? <img src={entry.imageUrl} alt={entry.title} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                : <div className="pet-avatar">🏢</div>}
                              <div>
                                <div className="pet-name">{entry.title}</div>
                                <div className="owner-name" style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {entry.content.substring(0, 60)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td><span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>{getSectionLabel(entry.section)}</span></td>
                          <td>{entry.sortOrder}</td>
                          <td>
                            <button onClick={() => handleAboutToggle(entry)} className="status-badge" style={{ backgroundColor: entry.published ? '#d1fae520' : '#fef3c720', color: entry.published ? '#10b981' : '#f59e0b', border: 'none', cursor: 'pointer' }}>
                              {entry.published ? '✅ Published' : '📝 Draft'}
                            </button>
                          </td>
                          <td><div className="date-value">{new Date(entry.createdAt).toLocaleDateString('th-TH')}</div></td>
                          <td className="actions-cell">
                            <button className="admin-btn admin-btn-secondary" style={{ marginRight: 8, padding: '4px 12px', fontSize: 13 }} onClick={() => openAboutEdit(entry)}>✏️ {lang === 'th' ? 'แก้ไข' : 'Edit'}</button>
                            <button className="doctor-card-admin__btn-delete" onClick={() => handleAboutDelete(entry)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      <HideFooter />

      {/* ── Modal: Articles ── */}
      <ArticleModal
        isOpen={artIsNew || !!artSelected}
        isNew={artIsNew}
        form={artForm}
        setForm={setArtForm}
        onSave={handleArtSave}
        onClose={closeArtModal}
        isSaving={artSaving}
        categories={CATEGORIES}
        lang={lang}
      />

      {/* ── Modal: About Us ── */}
      <AboutUsModal
        isOpen={aboutIsNew || !!aboutSelected}
        isNew={aboutIsNew}
        form={aboutForm}
        setForm={setAboutForm}
        onSave={handleAboutSave}
        onClose={closeAboutModal}
        isSaving={aboutSaving}
        sections={ABOUT_SECTIONS}
        lang={lang}
      />
    </div>
  );
}
