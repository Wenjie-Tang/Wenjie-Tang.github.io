'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import ActionLinks from '@/components/ui/ActionLinks';
import Tag from '@/components/ui/Tag';
import { ExternalEntityText } from '@/components/ui/ExternalEntityLink';
import type { CardItem } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';
import { facultyEntityKeys, organizationEntityKeys } from '@/lib/externalEntities';

export default function ResearchCard({ item }: { item: CardItem }) {
  const locale = useLocaleStore((state) => state.locale);
  const isChinese = locale.startsWith('zh');
  const metadata = [item.role, item.advisor, item.date].filter(Boolean);
  const imageIsDiagram = item.image?.toLowerCase().endsWith('.svg');

  return (
    <article className="research-card">
      <div className="research-visual">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.teaser_label || item.title}
            fill
            className={imageIsDiagram ? 'research-cover research-cover-diagram' : 'research-cover'}
            sizes="(max-width: 767px) 100vw, 36vw"
          />
        ) : (
          <div
            className="research-teaser"
            role="img"
            aria-label={`${item.teaser_label || item.title}. Graphic placeholder; authentic project image not yet available.`}
          >
            <span className="research-teaser-code">{item.teaser || 'HCI'}</span>
            <span className="research-teaser-line" />
            <span className="research-teaser-label">{item.teaser_label || item.title}</span>
            <span className="research-teaser-note">{isChinese ? '研究预览' : 'Research preview'}</span>
          </div>
        )}
      </div>

      <div className="research-content">
        <div className="research-card-topline">
          {item.eyebrow && <span className="eyebrow">{item.eyebrow}</span>}
          {item.status && <span className="status-label">{item.status}</span>}
        </div>
        <h3 className="research-title">
          {item.title_link ? (
            <a
              href={item.title_link}
              target="_blank"
              rel="noopener noreferrer"
              className="research-title-link"
            >
              <span>{item.title}</span>
              <ExternalLink className="research-title-link-icon" aria-hidden="true" size={14} strokeWidth={1.8} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : item.title}
        </h3>
        {item.affiliation && (
          <p className="research-affiliation">
            <ExternalEntityText entities={organizationEntityKeys}>{item.affiliation}</ExternalEntityText>
          </p>
        )}
        {metadata.length > 0 && (
          <p className="research-metadata">
            <ExternalEntityText entities={facultyEntityKeys}>{metadata.join(' · ')}</ExternalEntityText>
          </p>
        )}
        {item.content && <p className="research-summary">{item.content}</p>}

        {item.metrics && item.metrics.length > 0 && (
          <div className="metric-list" aria-label="Project evidence">
            {item.metrics.map((metric) => <span key={metric}>{metric}</span>)}
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="tag-row" aria-label="Research areas">
            {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        )}

        {item.methods && item.methods.length > 0 && (
          <div className="method-row">
            <span className="method-label">{isChinese ? '方法与工具' : 'Methods & tools'}</span>
            <div className="tag-row">
              {item.methods.map((method) => <Tag key={method} variant="method">{method}</Tag>)}
            </div>
          </div>
        )}

        <ActionLinks actions={item.actions} />
      </div>
    </article>
  );
}
