import Link from 'next/link';

interface Article {
  id?: string;
  title: string;
  snippet?: string;
  image?: string;
  date?: string;
  category?: string;
  link?: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="article-card">
      <div className="card-image-wrapper">
        {
          (() => {
            const img = article?.image || '';
            const fixedImg = img.replace(/^https:\/([^/])/, 'https://$1').replace(/^http:\/([^/])/, 'http://$1');
            const imageSrc = fixedImg.startsWith('/') || fixedImg.startsWith('http') ? fixedImg : `/images/articles/${fixedImg}`;
            return (
              <img
                src={imageSrc}
                alt={article.title}
                className="card-image"
              />
            );
          })()
        }
      </div>
      <div className="card-content">
        {article.category && !['Dog', 'Cat', 'Health Tips', 'General'].includes(article.category) && (
          <p className="card-category">{(article.category || '').replace(/[^ก-๙a-zA-Z ]/g, '')}</p>
        )}
        <h4 className="card-title">{article.title}</h4>
        <p className="card-snippet">{article.snippet}</p>
        <div className="card-meta">
          <span className="card-date">{article.date}</span>
        </div>
      </div>
    </div>
  );
}
