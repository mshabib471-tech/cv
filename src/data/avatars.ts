/**
 * Professional, human-crafted avatars for resumes and CVs.
 * Clean, lightweight SVG Data URIs that render reliably offline and in print.
 */

export interface AvatarOption {
  id: string;
  name: string;
  nameBn: string;
  category: 'male' | 'female' | 'neutral';
  svgDataUri: string;
}

export const PROFESSIONAL_AVATARS: AvatarOption[] = [
  {
    id: 'male-corporate',
    name: 'Executive Male (Suit & Tie)',
    nameBn: 'কর্পোরেট পুরুষ (স্যুট-টাই)',
    category: 'male',
    svgDataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="%23f1f5f9"/><circle cx="120" cy="85" r="42" fill="%23e2b18a"/><path d="M78 80 C78 50 162 50 162 80 C162 60 145 42 120 42 C95 42 78 60 78 80 Z" fill="%232d3748"/><path d="M120 125 L120 145 L108 145 L112 125 Z" fill="%23d49e75"/><path d="M45 240 L65 170 L120 185 L175 170 L195 240 Z" fill="%231e293b"/><polygon points="100,165 120,205 140,165 130,160 120,175 110,160" fill="%23ffffff"/><polygon points="116,175 124,175 122,230 118,230" fill="%23dc2626"/><circle cx="106" cy="85" r="4" fill="%232d3748"/><circle cx="134" cy="85" r="4" fill="%232d3748"/><path d="M112 105 Q120 112 128 105" stroke="%239c4221" stroke-width="2" fill="none"/></svg>',
  },
  {
    id: 'male-tech',
    name: 'Modern Professional (Tech / Glasses)',
    nameBn: 'মডার্ন প্রফেশনাল (চশমা পরিহিত)',
    category: 'male',
    svgDataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="%23f8fafc"/><circle cx="120" cy="88" r="44" fill="%23f5caa6"/><path d="M75 80 C75 42 165 42 165 80 C155 52 140 45 120 45 C95 45 80 55 75 80 Z" fill="%231e293b"/><rect x="94" y="78" width="22" height="15" rx="3" fill="none" stroke="%230f172a" stroke-width="2.5"/><rect x="124" y="78" width="22" height="15" rx="3" fill="none" stroke="%230f172a" stroke-width="2.5"/><line x1="116" y1="85" x2="124" y2="85" stroke="%230f172a" stroke-width="2.5"/><path d="M50 240 L70 170 L170 170 L190 240 Z" fill="%232563eb"/><polygon points="105,170 120,195 135,170" fill="%23f5caa6"/><circle cx="105" cy="85" r="3" fill="%230f172a"/><circle cx="135" cy="85" r="3" fill="%230f172a"/><path d="M112 110 Q120 116 128 110" stroke="%23a16207" stroke-width="2" fill="none"/></svg>',
  },
  {
    id: 'female-corporate',
    name: 'Executive Female (Blazer)',
    nameBn: 'কর্পোরেট নারী (ব্লেজার)',
    category: 'female',
    svgDataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="%23f8fafc"/><path d="M68 90 C68 45 172 45 172 90 C172 135 162 165 158 175 C145 135 150 95 120 95 C90 95 95 135 82 175 C78 165 68 135 68 90 Z" fill="%23422006"/><circle cx="120" cy="90" r="40" fill="%23ffd7ba"/><path d="M110 128 L110 150 L130 150 L130 128 Z" fill="%23f0be9b"/><path d="M50 240 L70 172 L120 190 L170 172 L190 240 Z" fill="%230f172a"/><polygon points="98,172 120,215 142,172" fill="%23e2e8f0"/><polygon points="106,172 120,200 134,172" fill="%23ffd7ba"/><circle cx="106" cy="90" r="3.5" fill="%23292524"/><circle cx="134" cy="90" r="3.5" fill="%23292524"/><path d="M112 112 Q120 118 128 112" stroke="%23b91c1c" stroke-width="2.5" fill="none"/></svg>',
  },
  {
    id: 'female-hijab',
    name: 'Professional Female (Modest / Hijab)',
    nameBn: 'প্রফেশনাল নারী (হিজাব পরিহিত)',
    category: 'female',
    svgDataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="%23f1f5f9"/><path d="M65 110 C65 50 175 50 175 110 C175 160 160 185 145 195 L95 195 C80 185 65 160 65 110 Z" fill="%23047857"/><ellipse cx="120" cy="108" rx="34" ry="40" fill="%23fed7aa"/><path d="M86 102 C90 75 150 75 154 102 C154 85 140 70 120 70 C100 70 86 85 86 102 Z" fill="%23065f46"/><path d="M50 240 L75 180 L165 180 L190 240 Z" fill="%230f172a"/><circle cx="108" cy="105" r="3" fill="%23292524"/><circle cx="132" cy="105" r="3" fill="%23292524"/><path d="M114 125 Q120 130 126 125" stroke="%23be123c" stroke-width="2" fill="none"/></svg>',
  },
  {
    id: 'neutral-executive',
    name: 'Minimalist Line Silhouette',
    nameBn: 'মিনিমালিস্ট লাইন আর্ট',
    category: 'neutral',
    svgDataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="%23e2e8f0"/><circle cx="120" cy="85" r="42" fill="%2394a3b8"/><path d="M52 235 C52 165 85 150 120 150 C155 150 188 165 188 235 Z" fill="%2364748b"/></svg>',
  },
];

export const DEFAULT_AVATAR = PROFESSIONAL_AVATARS[0].svgDataUri;
