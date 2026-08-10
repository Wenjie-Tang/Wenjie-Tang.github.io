'use client';

import { motion } from 'framer-motion';
import PublicationCard from './PublicationCard';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Publication } from '@/types/publication';
import type { PublicationPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface PublicationsListProps {
  config: PublicationPageConfig;
  publications: Publication[];
  embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
  const locale = useLocaleStore((state) => state.locale);
  const isChinese = locale.startsWith('zh');
  const papers = publications.filter((publication) => publication.category !== 'patent');
  const patents = publications.filter((publication) => publication.category === 'patent');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45 }}
    >
      <SectionHeading title={config.title} description={config.description} embedded={embedded} />

      <div className="publication-groups">
        <section aria-labelledby="publications-heading">
          <h3 id="publications-heading" className="subsection-title">{isChinese ? '论文' : 'Publications'}</h3>
          <div className="publication-list">
            {papers.map((publication) => <PublicationCard key={publication.id} publication={publication} />)}
          </div>
        </section>

        <section aria-labelledby="patents-heading">
          <h3 id="patents-heading" className="subsection-title">{isChinese ? '专利' : 'Patents'}</h3>
          <div className="publication-list">
            {patents.map((publication) => <PublicationCard key={publication.id} publication={publication} />)}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
