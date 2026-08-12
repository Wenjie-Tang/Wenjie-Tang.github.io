'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CalendarDays, Check, FileText, Github, Mail, MapPin } from 'lucide-react';
import { ExternalEntityText } from '@/components/ui/ExternalEntityLink';
import type { SiteConfig } from '@/lib/config';
import { organizationEntityKeys } from '@/lib/externalEntities';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface ProfileProps {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the compatibility path below.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    textarea.remove();
  }
}

export default function Profile({ author, social }: ProfileProps) {
  const locale = useLocaleStore((state) => state.locale);
  const isChinese = locale.startsWith('zh');
  const locationDetails = Array.isArray(social.location_details) ? social.location_details : [];
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    };
  }, []);

  const handleEmailCopy = async () => {
    if (!social.email) return;

    const copied = await copyText(social.email);
    setCopyStatus(copied ? 'copied' : 'error');

    if (copyResetTimer.current) clearTimeout(copyResetTimer.current);
    copyResetTimer.current = setTimeout(() => setCopyStatus('idle'), 1800);
  };

  const emailButtonText =
    copyStatus === 'copied'
      ? isChinese
        ? '已复制'
        : 'Copied!'
      : copyStatus === 'error'
        ? isChinese
          ? '复制失败'
          : 'Copy failed'
        : social.email;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="profile-panel"
    >
      <div className="profile-portrait">
        <Image
          src={author.avatar}
          alt={`Portrait of ${author.name}`}
          fill
          className="object-cover object-[30%_center]"
          sizes="(max-width: 767px) 78vw, 330px"
          priority
        />
      </div>

      <div className="profile-identity">
        <h1>{author.name}</h1>
        <p className="profile-institution">
          <ExternalEntityText entities={organizationEntityKeys}>{author.institution}</ExternalEntityText>
        </p>
      </div>

      <div className="profile-actions" aria-label={isChinese ? '联系方式与文件' : 'Contact and files'}>
        {social.email && (
          <button
            type="button"
            className={`profile-email-copy${copyStatus === 'copied' ? ' is-copied' : ''}`}
            onClick={handleEmailCopy}
            aria-label={
              copyStatus === 'copied'
                ? isChinese
                  ? `邮箱已复制：${social.email}`
                  : `Email copied: ${social.email}`
                : isChinese
                  ? `复制邮箱地址：${social.email}`
                  : `Copy email address: ${social.email}`
            }
            title={isChinese ? '点击复制邮箱地址' : 'Click to copy email address'}
          >
            {copyStatus === 'copied' ? (
              <Check aria-hidden="true" size={17} />
            ) : (
              <Mail aria-hidden="true" size={17} />
            )}
            <span aria-live="polite">{emailButtonText}</span>
          </button>
        )}
        {social.github && (
          <a href={social.github as string} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
            <Github aria-hidden="true" size={17} />
            <span>GitHub</span>
          </a>
        )}
        <a
          href="/Wenjie-Tang-CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isChinese ? '打开简历 PDF（在新标签页中打开）' : 'Open CV PDF (opens in a new tab)'}
        >
          <FileText aria-hidden="true" size={17} />
          <span>CV</span>
        </a>
      </div>

      <div className="profile-details">
        {social.location && (
          <p className="profile-location">
            <MapPin aria-hidden="true" size={15} />
            {social.location_url ? (
              <a href={social.location_url as string} target="_blank" rel="noopener noreferrer">
                {social.location as string}
              </a>
            ) : (
              <span>{social.location as string}</span>
            )}
          </p>
        )}
        {locationDetails.map((detail) => (
          <p className="profile-location" key={detail}>
            <CalendarDays aria-hidden="true" size={15} />
            <span>{detail}</span>
          </p>
        ))}
      </div>
    </motion.div>
  );
}
