'use client';

import ActionLinks from '@/components/ui/ActionLinks';
import Tag from '@/components/ui/Tag';
import FormattedBibTeXText from './FormattedBibTeXText';
import { ExternalLink } from 'lucide-react';
import type { Publication } from '@/types/publication';
import { useLocaleStore } from '@/lib/stores/localeStore';

export default function PublicationCard({ publication }: { publication: Publication }) {
  const locale = useLocaleStore((state) => state.locale);
  const isChinese = locale.startsWith('zh');
  const venue = publication.venueLabel || publication.journal || publication.conference;

  return (
    <article className="publication-card">
      <div className="publication-marker" aria-hidden="true">
        <span>{publication.category === 'patent' ? 'PAT' : 'PUB'}</span>
        <strong>{publication.year}</strong>
      </div>
      <div className="publication-content">
        <div className="publication-topline">
          <span className="eyebrow">
            {publication.category === 'patent'
              ? (isChinese ? '专利' : 'Patent')
              : (isChinese ? '论文' : 'Publication')}
          </span>
          {publication.role && <span className="status-label">{publication.role}</span>}
        </div>
        <h3 className="publication-title">
          {publication.url ? (
            <a
              href={publication.url}
              target="_blank"
              rel="noopener noreferrer"
              className="research-title-link"
            >
              <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
              <ExternalLink className="research-title-link-icon" aria-hidden="true" size={14} strokeWidth={1.8} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
          )}
        </h3>
        <p className="publication-authors">
          {publication.authors.map((author, index) => (
            <span key={`${author.name}-${index}`}>
              <span className={author.isHighlighted ? 'publication-author-highlight' : undefined}>{author.name}</span>
              {index < publication.authors.length - 1 && ', '}
            </span>
          ))}
        </p>
        {venue && <p className="publication-venue">{venue}</p>}
        {publication.description && <p className="publication-description">{publication.description}</p>}
        {publication.keywords && publication.keywords.length > 0 && (
          <div className="tag-row">
            {publication.keywords.slice(0, 4).map((keyword) => <Tag key={keyword}>{keyword}</Tag>)}
          </div>
        )}
        <ActionLinks actions={publication.actions} />
      </div>
    </article>
  );
}
