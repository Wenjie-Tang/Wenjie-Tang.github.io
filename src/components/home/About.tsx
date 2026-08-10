'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface AboutProps {
  content: string;
  title?: string;
}

export default function About({ content, title }: AboutProps) {
  const messages = useMessages();
  const locale = useLocaleStore((state) => state.locale);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="about-panel"
    >
      <p className="eyebrow">{locale.startsWith('zh') ? '关于 / 研究方向' : 'About / Research focus'}</p>
      <h2>{title || messages.home.about}</h2>
      <div className="about-copy">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p>{children}</p>,
            a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            strong: ({ children }) => <strong>{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.section>
  );
}
