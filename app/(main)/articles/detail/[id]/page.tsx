import prisma from '@/backend/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const runtime = 'nodejs';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  if (isNaN(id)) return { title: 'บทความ | Pawplan' };

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) return { title: 'ไม่พบบทความ | Pawplan' };

  return {
    title: `${article.title} | Pawplan คลินิก`,
    description: article.content.substring(0, 160),
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article || !article.published) {
    notFound();
  }

  // Fetch recent articles as recommendations
  const recentArticles = await prisma.article.findMany({
    where: {
      published: true,
      id: { not: id },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const formattedDate = new Date(article.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageSrc = article.imageUrl || '/assets/cat1.png';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      paddingBottom: '80px',
      fontFamily: "'Kanit', sans-serif"
    }}>
      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        height: '400px',
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${imageSrc}) center/cover no-repeat`,
        display: 'flex',
        alignItems: 'flex-end',
        color: '#ffffff',
        paddingBottom: '40px'
      }}>
        <div className="container" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <Link href="/#services" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '50px',
            backdropFilter: 'blur(4px)',
            transition: 'background 0.2s'
          }}>
            <ArrowLeft size={16} />
            ย้อนกลับ
          </Link>
          <span style={{
            background: '#248f9b',
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            {article.category}
          </span>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: '0 0 16px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', opacity: 0.9 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} />
              {formattedDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              สัตวแพทย์ผู้เชี่ยวชาญ Pawplan
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container" style={{ maxWidth: '900px', margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e2e8f0',
        }}>
          <div 
            style={{
              fontSize: '17px',
              color: '#334155',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {article.content}
          </div>
        </div>

        {/* Related Articles Section */}
        {recentArticles.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} color="#248f9b" />
              บทความอื่นๆ ที่น่าสนใจ
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {recentArticles.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/articles/detail/${item.id}`}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ height: '160px', background: `url(${item.imageUrl || '/assets/cat1.png'}) center/cover no-repeat` }} />
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: '#248f9b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                      {item.category}
                    </span>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#1e293b', fontWeight: 700, lineHeight: 1.4 }}>
                      {item.title}
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#64748b',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5
                    }}>
                      {item.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
