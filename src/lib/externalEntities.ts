export type ExternalEntityType = 'university' | 'lab' | 'company' | 'faculty';

interface ExternalEntity {
  en: string;
  zh?: string;
  short?: string;
  url: string;
  type: ExternalEntityType;
  aliases: readonly string[];
}

export const externalEntities = {
  centralSouthUniversity: {
    en: 'Central South University',
    zh: '中南大学',
    url: 'https://en.csu.edu.cn/',
    type: 'university',
    aliases: ['Central South University', '中南大学'],
  },
  hkustGZ: {
    en: 'The Hong Kong University of Science and Technology (Guangzhou)',
    zh: '香港科技大学（广州）',
    short: 'HKUST(GZ)',
    url: 'https://www.hkust-gz.edu.cn/',
    type: 'university',
    aliases: [
      'The Hong Kong University of Science and Technology (Guangzhou)',
      '香港科技大学（广州）',
      'HKUST(GZ)',
    ],
  },
  fitAweLab: {
    en: 'FIT-AWE Lab',
    url: 'https://hai-ning-liang.github.io/',
    type: 'lab',
    aliases: ['FIT-AWE Lab'],
  },
  cityUHK: {
    en: 'City University of Hong Kong',
    zh: '香港城市大学',
    short: 'CityUHK',
    url: 'https://www.cityu.edu.hk/',
    type: 'university',
    aliases: ['City University of Hong Kong', '香港城市大学', 'CityUHK'],
  },
  studioNarrativeSpaces: {
    en: 'Studio for Narrative Spaces',
    url: 'https://www.scm.cityu.edu.hk/en/research/labs/studio-narrative-spaces',
    type: 'lab',
    aliases: ['Studio for Narrative Spaces'],
  },
  xiaomi: {
    en: 'Xiaomi Corporation',
    zh: '小米集团',
    url: 'https://www.mi.com/global/about/',
    type: 'company',
    aliases: ['Xiaomi Corporation', '小米科技有限责任公司', '小米集团', 'Xiaomi', '小米'],
  },
  mangoTV: {
    en: 'Mango TV',
    zh: '芒果TV',
    url: 'https://w.mgtv.com/?lang=en',
    type: 'company',
    aliases: ['Mango TV', '芒果 TV', '芒果TV'],
  },
  manulife: {
    en: 'Manulife Limited',
    zh: '宏利',
    url: 'https://www.manulife.com.hk/en/individual/about/our-story/our-business.html',
    type: 'company',
    aliases: ['Manulife Limited', '宏利金融', 'Manulife', '宏利'],
  },
  hainingLiang: {
    en: 'Prof. Haining Liang',
    zh: '梁海宁教授',
    url: 'https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page?id=437',
    type: 'faculty',
    aliases: ['Prof. Haining Liang', '梁海宁教授'],
  },
  rayLC: {
    en: 'Prof. Ray LC',
    zh: 'Ray LC 教授',
    url: 'https://www.scm.cityu.edu.hk/people/ray-lc',
    type: 'faculty',
    aliases: ['Prof. Ray LC', 'Ray LC'],
  },
} as const satisfies Record<string, ExternalEntity>;

export type ExternalEntityKey = keyof typeof externalEntities;

export const organizationEntityKeys = [
  'centralSouthUniversity',
  'hkustGZ',
  'fitAweLab',
  'cityUHK',
  'studioNarrativeSpaces',
  'xiaomi',
  'mangoTV',
  'manulife',
] as const satisfies readonly ExternalEntityKey[];

export const facultyEntityKeys = [
  'hainingLiang',
  'rayLC',
] as const satisfies readonly ExternalEntityKey[];

export const allExternalEntityKeys = [
  ...organizationEntityKeys,
  ...facultyEntityKeys,
] as const satisfies readonly ExternalEntityKey[];

export interface ExternalEntitySegment {
  text: string;
  entity?: ExternalEntityKey;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAliasEntries(keys: readonly ExternalEntityKey[]) {
  return keys
    .flatMap((key) => externalEntities[key].aliases.map((alias) => ({ alias, key })))
    .sort((a, b) => b.alias.length - a.alias.length);
}

export function tokenizeExternalEntities(
  text: string,
  keys: readonly ExternalEntityKey[] = allExternalEntityKeys
): ExternalEntitySegment[] {
  const aliases = getAliasEntries(keys);
  if (!text || aliases.length === 0) return [{ text }];

  const entityByAlias = new Map<string, ExternalEntityKey>(
    aliases.map(({ alias, key }): [string, ExternalEntityKey] => [alias, key])
  );
  const matcher = new RegExp(aliases.map(({ alias }) => escapeRegExp(alias)).join('|'), 'g');
  const segments: ExternalEntitySegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(matcher)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ text: text.slice(cursor, index) });
    segments.push({ text: match[0], entity: entityByAlias.get(match[0]) });
    cursor = index + match[0].length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length > 0 ? segments : [{ text }];
}

export function getExternalEntityKeyByUrl(url?: string): ExternalEntityKey | undefined {
  if (!url) return undefined;
  return allExternalEntityKeys.find((key) => externalEntities[key].url === url);
}
