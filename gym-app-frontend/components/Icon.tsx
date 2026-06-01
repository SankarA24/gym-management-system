'use client';
import React from 'react';

type IconName =
  | 'grid' | 'users' | 'bell' | 'calendar' | 'plus' | 'search' | 'chev' | 'chevDown'
  | 'back' | 'x' | 'user' | 'settings' | 'bolt' | 'dumbbell' | 'check' | 'phone'
  | 'rupee' | 'trend' | 'money' | 'play' | 'pause' | 'pencil' | 'trash' | 'msg'
  | 'sliders' | 'clock' | 'flame' | 'sparkles' | 'home' | 'sun' | 'moon' | 'wallet';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  users: <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.4-3.4 3.3-6 6.5-6s6.1 2.6 6.5 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14c2.4 0 4.4 1.6 4.9 3.6"/></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5 2 6H4c.5-1 2-2 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  search: <><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></>,
  chev: <path d="m9 6 6 6-6 6"/>,
  chevDown: <path d="m6 9 6 6 6-6"/>,
  back: <path d="m15 6-6 6 6 6"/>,
  x: <><path d="M6 6l12 12M18 6L6 18"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.7-4.5 4.4-8 8-8s7.3 3.5 8 8"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.4l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.4H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.4 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>,
  dumbbell: <><path d="M6 4v16M10 7v10M14 7v10M18 4v16M3 10v4M21 10v4"/></>,
  check: <path d="m5 12 5 5L20 7"/>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/>,
  rupee: <><path d="M6 4h12M6 9h12M14 4c0 4.5-3 8-8 8h.5L15 20"/></>,
  trend: <><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
  money: <><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></>,
  play: <path d="M5 4v16l14-8L5 4z"/>,
  pause: <><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>,
  pencil: <><path d="M16 3.5 20.5 8 8 20.5H3.5V16z"/><path d="m13.5 6 4.5 4.5"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></>,
  msg: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 8.5 8.5 0 0 1-3.9-1L3 20l1-5a8.5 8.5 0 1 1 17-3.5z"/>,
  sliders: <><path d="M4 6h10M14 6h6M4 12h4M8 12h12M4 18h14M18 18h2"/><circle cx="14" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  flame: <path d="M12 2c4 5 6 8 6 12a6 6 0 1 1-12 0c0-3 2-5 3-7 .5 2 2 3 3 3 0-2 0-5 0-8z"/>,
  sparkles: <><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l-2-2M20 20l-2-2M6 18l-2 2M20 4l-2 2"/><circle cx="12" cy="12" r="3"/></>,
  home: <path d="M3 11 12 3l9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></>,
  moon: <path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z"/>,
  wallet: <><path d="M3 7a2 2 0 0 1 2-2h13l3 3v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 9h18"/><circle cx="17" cy="14" r="1.5"/></>,
};

export default function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
