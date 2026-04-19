'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/auth/actions';

/* ─── Icon library (inline SVG, no dependency) ─── */
const Icon = {
  home: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  grid: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  chat: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  ),
  shield: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  calendar: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  users: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  chart: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  box: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  sparkle: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  signout: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
  mail: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  bell: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  ),
  menu: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  close: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

/* ─── Nav config per role ─── */
type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Show in mobile bottom nav (max ~4). All items always show in the drawer. */
  bottom?: boolean;
};

const NAV: Record<string, NavItem[]> = {
  CLIENT: [
    { href: '/dashboard',              label: 'Overview',    icon: Icon.home,     bottom: true },
    { href: '/dashboard/marketplace',  label: 'Marketplace', icon: Icon.grid,     bottom: true },
    { href: '/dashboard/messages',     label: 'Messages',    icon: Icon.chat,     bottom: true },
    { href: '/dashboard/settings',     label: 'Privacy',     icon: Icon.shield,   bottom: true },
  ],
  AGENT: [
    { href: '/agent',          label: 'My Clients', icon: Icon.users,    bottom: true },
    { href: '/agent/messages', label: 'Messages',   icon: Icon.chat,     bottom: true },
    { href: '/agent/bookings', label: 'Bookings',   icon: Icon.calendar, bottom: true },
    { href: '/agent/settings', label: 'Profile',    icon: Icon.shield,   bottom: true },
  ],
  ADMIN: [
    { href: '/admin',                label: 'Overview',    icon: Icon.chart,    bottom: true },
    { href: '/admin/bookings',       label: 'Bookings',    icon: Icon.calendar, bottom: true },
    { href: '/admin/users',          label: 'Users',       icon: Icon.users,    bottom: true },
    { href: '/admin/experiences',    label: 'Experiences', icon: Icon.sparkle,  bottom: false },
    { href: '/admin/products',       label: 'Marketplace', icon: Icon.box,      bottom: false },
    { href: '/admin/messages',       label: 'Comms',       icon: Icon.mail,     bottom: true },
  ],
};

interface ShellProps {
  children: React.ReactNode;
  user: { alias: string; role: 'CLIENT' | 'AGENT' | 'ADMIN' };
  unread?: { total: number; href: string };
}

export function DashboardShell({ children, user, unread }: ShellProps) {
  const pathname = usePathname();
  const nav = NAV[user.role] ?? [];
  const bottomNav = nav.filter((n) => n.bottom !== false);
  const initial = user.alias.charAt(0).toUpperCase();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const unreadTotal = unread?.total ?? 0;
  const unreadHref = unread?.href ?? '#';

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [drawerOpen]);

  function isActive(href: string) {
    if (href === '/dashboard' || href === '/agent' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>

      {/* ───── Desktop sidebar ───── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-[264px] flex-col z-50"
        style={{ background: '#100810' }}>

        {/* Logo */}
        <div className="px-6 pt-7 pb-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/nawilogo.png"
              alt="Nawi"
              width={44}
              height={44}
              className="object-contain"
              style={{ height: 40, width: 'auto' }}
              priority
            />
            <span className="leading-tight">
              <span className="block text-white font-bold tracking-tight text-lg">Nawi</span>
              <span className="block text-white/40 text-[9px] font-bold tracking-[0.32em] uppercase">Experiences</span>
            </span>
          </Link>
        </div>

        {/* Role badge + bell */}
        <div className="px-6 py-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(128,0,32,0.25)', color: '#e8a0b0' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8a0b0]" />
            {user.role.toLowerCase()}
          </span>
          <Link href={unreadHref}
            aria-label={`Notifications (${unreadTotal} unread)`}
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: unreadTotal > 0 ? '#e8a0b0' : 'rgba(255,255,255,0.5)' }}>
            {Icon.bell}
            {unreadTotal > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: '#800020', boxShadow: '0 0 0 2px #100810' }}>
                {unreadTotal > 99 ? '99+' : unreadTotal}
              </span>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          <p className="px-3 pt-2 pb-1 text-[9px] font-bold tracking-[0.25em] uppercase text-white/20">
            Navigation
          </p>
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'text-white border-l-[3px] rounded-l-none pl-[calc(0.75rem-3px)]'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/5 border-l-[3px] border-transparent rounded-l-none pl-[calc(0.75rem-3px)]'
                }`}
                style={active ? { background: 'rgba(128,0,32,0.2)', borderColor: '#800020' } : {}}
              >
                <span className={active ? 'text-[#e8a0b0]' : ''}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 pb-6 pt-2 border-t border-white/5 space-y-1">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'rgba(128,0,32,0.3)', color: '#e8a0b0' }}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.alias}</p>
              <p className="text-white/30 text-[10px]">Private alias</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 text-sm transition-all">
              {Icon.signout}
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ───── Mobile top bar ───── */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 px-3 h-16"
        style={{ background: 'rgba(245,243,237,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(128,0,32,0.08)' }}>
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Image src="/nawilogo.png" alt="Nawi" width={32} height={32} className="object-contain flex-shrink-0" style={{ height: 30, width: 'auto' }} priority />
          <span className="leading-tight min-w-0">
            <span className="block text-[#800020] font-bold text-sm tracking-tight truncate">Nawi</span>
            <span className="block text-[#800020]/55 text-[8px] font-bold tracking-[0.3em] uppercase truncate">
              {user.role.toLowerCase()}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Notifications bell */}
          <Link
            href={unreadHref}
            aria-label={`Notifications (${unreadTotal} unread)`}
            className="relative w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ color: unreadTotal > 0 ? '#800020' : '#7a7a7a' }}
          >
            {Icon.bell}
            {unreadTotal > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ background: '#800020', boxShadow: '0 0 0 2px rgba(245,243,237,1)' }}>
                {unreadTotal > 99 ? '99+' : unreadTotal}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mx-0.5"
            style={{ background: 'rgba(128,0,32,0.1)', color: '#800020' }}>
            {initial}
          </div>

          {/* Hamburger — opens full drawer (all options) */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ color: '#800020' }}
          >
            {Icon.menu}
          </button>
        </div>
      </header>

      {/* ───── Mobile drawer (full nav) ───── */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            className="md:hidden fixed inset-0 z-50 bg-black/50 animate-[fadein_0.2s_ease-out]"
          />
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-[86%] max-w-sm z-50 flex flex-col animate-[slidein_0.25s_cubic-bezier(0.22,1,0.36,1)]"
            style={{ background: '#100810', boxShadow: '-12px 0 40px rgba(0,0,0,0.4)' }}>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Image src="/nawilogo.png" alt="Nawi" width={36} height={36} className="object-contain" style={{ height: 32, width: 'auto' }} />
                <div>
                  <p className="text-white font-bold text-base leading-tight">Nawi</p>
                  <p className="text-white/40 text-[9px] font-bold tracking-[0.3em] uppercase">Experiences</p>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5">
                {Icon.close}
              </button>
            </div>

            {/* User info */}
            <div className="px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
                  style={{ background: 'rgba(128,0,32,0.3)', color: '#e8a0b0' }}>
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user.alias}</p>
                  <span className="inline-flex items-center gap-1.5 mt-1 text-[9px] font-bold tracking-[0.25em] uppercase px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(128,0,32,0.25)', color: '#e8a0b0' }}>
                    <span className="w-1 h-1 rounded-full bg-[#e8a0b0]" />
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* All nav items */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <p className="px-3 pb-1 text-[9px] font-bold tracking-[0.3em] uppercase text-white/20">
                All sections
              </p>
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'text-white'
                        : 'text-white/55 hover:text-white hover:bg-white/5'
                    }`}
                    style={active ? { background: 'rgba(128,0,32,0.25)' } : {}}
                  >
                    <span className={active ? 'text-[#e8a0b0]' : 'text-white/40'}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#e8a0b0]" />}
                  </Link>
                );
              })}

              {/* Notifications quick link */}
              <Link href={unreadHref} onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/5 transition-all mt-2">
                <span className="text-white/40">{Icon.bell}</span>
                <span className="flex-1">Notifications</span>
                {unreadTotal > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: '#800020' }}>
                    {unreadTotal > 99 ? '99+' : unreadTotal}
                  </span>
                )}
              </Link>
            </nav>

            {/* Sign out */}
            <div className="px-3 pb-6 pt-3 border-t border-white/5">
              <form action={logoutAction}>
                <button type="submit"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/55 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                  {Icon.signout}
                  Sign out
                </button>
              </form>
            </div>
          </div>

          {/* Drawer animations */}
          <style jsx global>{`
            @keyframes fadein { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slidein { from { transform: translateX(100%) } to { transform: translateX(0) } }
          `}</style>
        </>
      )}

      {/* ───── Main content ───── */}
      <main className="md:ml-[264px] min-h-screen pb-28 md:pb-8">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-6 md:py-10">
          {children}
        </div>
      </main>

      {/* ───── Mobile bottom nav (top items only — drawer has the rest) ───── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(128,0,32,0.08)' }}>
        <div className="flex items-stretch">
          {bottomNav.slice(0, 4).map((item) => {
            const active = isActive(item.href);
            const showBadge = unreadTotal > 0 && item.href === unreadHref;
            return (
              <Link key={item.href} href={item.href}
                className="flex-1 relative flex flex-col items-center justify-center gap-1 py-3 transition-all"
                style={{ color: active ? '#800020' : '#9a9a9a' }}>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b-full"
                    style={{ background: '#800020' }} />
                )}
                <span className={`relative transition-transform ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                      style={{ background: '#800020' }}>
                      {unreadTotal > 9 ? '9+' : unreadTotal}
                    </span>
                  )}
                </span>
                <span className="text-[9px] font-bold tracking-wide uppercase"
                  style={{ color: active ? '#800020' : '#bbb' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* "More" pill if there are extra nav items not in the bottom row */}
          {bottomNav.length > 4 || nav.length > bottomNav.length ? (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex-1 relative flex flex-col items-center justify-center gap-1 py-3 transition-all"
              style={{ color: '#9a9a9a' }}
              aria-label="More options"
            >
              <span className="transition-transform">{Icon.menu}</span>
              <span className="text-[9px] font-bold tracking-wide uppercase" style={{ color: '#bbb' }}>
                More
              </span>
            </button>
          ) : null}
        </div>
        <div className="h-safe-area-inset-bottom" />
      </nav>

    </div>
  );
}
