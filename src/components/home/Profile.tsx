'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays, FileText, Github, Mail, MapPin } from 'lucide-react';
import { ExternalEntityText } from '@/components/ui/ExternalEntityLink';
import type { SiteConfig } from '@/lib/config';
import { organizationEntityKeys } from '@/lib/externalEntities';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface ProfileProps {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
}

export default function Profile({ author, social }: ProfileProps) {
  const locale = useLocaleStore((state) => state.locale);
  const isChinese = locale.startsWith('zh');
  const locationDetails = Array.isArray(social.location_details) ? social.location_details : [];

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
          <a href={`mailto:${social.email}`} aria-label={`${isChinese ? '发送邮件至' : 'Email'} ${social.email}`}>
            <Mail aria-hidden="true" size={17} />
            <span>{social.email}</span>
          </a>
        )}
        {social.github && (
          <a href={social.github as string} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
            <Github aria-hidden="true" size={17} />
            <span>GitHub</span>
          </a>
        )}
        <Link href="/cv/" aria-label={isChinese ? '查看简历' : 'View CV'}>
          <FileText aria-hidden="true" size={17} />
          <span>CV</span>
        </Link>
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
