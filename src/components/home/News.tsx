'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
  date: string;
  content: string;
}

interface NewsProps {
  items: NewsItem[];
  title?: string;
}

export default function News({ items, title }: NewsProps) {
  const messages = useMessages();

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="news-section"
    >
      <div className="news-heading">
        <p className="eyebrow">Updates</p>
        <h2>{title || messages.home.news}</h2>
      </div>
      <ol className="news-list">
        {items.map((item, index) => (
          <li key={`${item.date}-${index}`}>
            <time>{item.date}</time>
            <p>{item.content}</p>
          </li>
        ))}
      </ol>
    </motion.section>
  );
}
