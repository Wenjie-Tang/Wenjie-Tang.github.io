'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ExternalEntityText } from '@/components/ui/ExternalEntityLink';
import { organizationEntityKeys } from '@/lib/externalEntities';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { CardItem } from '@/types/page';

function AwardItem({ item, showDate = true }: { item: CardItem; showDate?: boolean }) {
  return (
    <li className="award-item">
      {showDate ? (
        <span className="award-date">{item.date}</span>
      ) : (
        <span className="award-date-spacer" aria-hidden="true" />
      )}
      <div>
        <p className="award-title">
          <ExternalEntityText entities={organizationEntityKeys}>{item.title}</ExternalEntityText>
        </p>
        {(item.subtitle || item.content) && (
          <p className="award-detail">{[item.subtitle, item.content].filter(Boolean).join(' · ')}</p>
        )}
      </div>
    </li>
  );
}

export default function AwardsList({ items }: { items: CardItem[] }) {
  const locale = useLocaleStore((state) => state.locale);
  const isChinese = locale.startsWith('zh');
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const featuredItems = useMemo(() => {
    const featured = items.filter((item) => item.featured);
    return featured.length > 0 ? featured : items;
  }, [items]);

  const yearGroups = useMemo(() => {
    const groups = new Map<string, CardItem[]>();
    for (const item of items) {
      const year = item.date || '';
      groups.set(year, [...(groups.get(year) || []), item]);
    }
    return Array.from(groups, ([year, awards]) => ({ year, awards }));
  }, [items]);

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toggleRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
      });
      return;
    }

    setExpanded(true);
  };

  const toggleLabel = expanded
    ? isChinese
      ? '收起'
      : 'Show Less'
    : isChinese
      ? `查看全部奖项与项目（${items.length}）`
      : `View All Awards & Grants (${items.length})`;

  return (
    <div className="awards-disclosure">
      <div key={expanded ? 'expanded' : 'collapsed'} id={listId} className="awards-disclosure-content">
        {expanded ? (
          <div className="award-groups">
            {yearGroups.map((group) => {
              const headingId = `${listId}-${group.year}`;
              return (
                <section className="award-year-group" aria-labelledby={headingId} key={group.year}>
                  <h3 className="award-year-heading" id={headingId}>
                    <span>{group.year}</span>
                  </h3>
                  <ul className="award-list award-list-grouped">
                    {group.awards.map((item) => (
                      <AwardItem key={`${item.title}-${item.date}`} item={item} showDate={false} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <ul className="award-list">
            {featuredItems.map((item) => (
              <AwardItem key={`${item.title}-${item.date}`} item={item} />
            ))}
          </ul>
        )}
      </div>

      <button
        ref={toggleRef}
        type="button"
        className="awards-toggle"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={handleToggle}
      >
        <span>{toggleLabel}</span>
        {expanded ? <ChevronUp aria-hidden="true" size={15} /> : <ChevronDown aria-hidden="true" size={15} />}
      </button>
    </div>
  );
}
