import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Mic,
  Rss,
} from 'lucide-react'

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

function TwitterGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  )
}

/* ---------- Scoped styles (Firecrawl whiteboard system) ---------- */
const SCOPED_CSS = `
.ddpage-profile {
  --color-fire-orange: #ff4d00;
  --color-fire-orange-hover: #e64500;
  --color-cloud-canvas: #e5e7eb;
  --color-paper-white: #f9f9f9;
  --color-ink-black: #262626;
  --color-stone-gray: #616161;
  --color-slate-gray: #727272;
  --color-silver-mist: #949494;
  --color-frost-gray: #c7c7c7;
  --color-pale-sienna: #fcddcc;
  --color-powder-pink: #febec2;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  --shadow-xl:
    rgba(0, 0, 0, 0.02) 0px 40px 48px -20px,
    rgba(0, 0, 0, 0.03) 0px 32px 32px -20px,
    rgba(0, 0, 0, 0.03) 0px 16px 24px -12px,
    rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;

  --shadow-xl-3:
    rgba(0, 0, 0, 0.02) 0px 0px 44px 0px,
    rgba(0, 0, 0, 0.03) 0px 88px 56px -20px,
    rgba(0, 0, 0, 0.02) 0px 56px 56px -20px,
    rgba(0, 0, 0, 0.03) 0px 32px 32px -20px,
    rgba(0, 0, 0, 0.03) 0px 16px 24px -12px,
    rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(249, 249, 249) 0px 0px 0px 10px;

  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--color-cloud-canvas);
  background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0);
  background-size: 24px 24px;
  color: var(--color-ink-black);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}
.ddpage-profile ::selection { background: var(--color-fire-orange); color: #fff; }

.ddpage-profile .ddpage-mono {
  font-family: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.ddpage-profile .ddpage-avatar-frame {
  box-shadow:
    0 0 0 6px var(--color-paper-white),
    0 0 0 7px rgba(0,0,0,0.06),
    0 24px 32px -16px rgba(0,0,0,0.10);
}

.ddpage-profile .ddpage-profile-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: var(--shadow-xl-3);
}

.ddpage-profile .ddpage-link-card {
  background: var(--color-paper-white);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
}
.ddpage-profile .ddpage-link-card:hover {
  transform: translateY(-2px);
  box-shadow:
    rgba(0, 0, 0, 0.02) 0px 40px 48px -20px,
    rgba(0, 0, 0, 0.04) 0px 32px 32px -20px,
    rgba(0, 0, 0, 0.04) 0px 24px 32px -12px,
    rgba(0, 0, 0, 0.04) 0px 16px 24px -12px,
    rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;
}
.ddpage-profile .ddpage-link-card:active { transform: translateY(-1px) scale(0.995); }

.ddpage-profile .ddpage-icon-box {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--color-cloud-canvas);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-ink-black);
  flex-shrink: 0;
}

.ddpage-profile .ddpage-btn-primary {
  background: var(--color-fire-orange);
  color: #fff;
  transition: background 120ms var(--ease-out), transform 120ms var(--ease-out);
}
.ddpage-profile .ddpage-btn-primary:hover { background: var(--color-fire-orange-hover); }
.ddpage-profile .ddpage-btn-primary:active { transform: scale(0.98); }

.ddpage-profile .ddpage-sns-icon {
  width: 40px; height: 40px;
  border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--color-stone-gray);
  background: var(--color-paper-white);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04);
  transition: color 120ms var(--ease-out), transform 120ms var(--ease-out), box-shadow 120ms var(--ease-out);
}
.ddpage-profile .ddpage-sns-icon:hover {
  color: var(--color-ink-black);
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.06);
}

.ddpage-profile .ddpage-highlight-card {
  background: var(--color-paper-white);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  transition: transform 200ms var(--ease-out);
  overflow: hidden;
  display: block;
}
.ddpage-profile .ddpage-highlight-card:hover { transform: translateY(-2px); }

.ddpage-profile .ddpage-caption {
  font-size: 10px;
  line-height: 1.4;
  letter-spacing: 0.1px;
  font-weight: 500;
  color: var(--color-slate-gray);
  text-transform: uppercase;
}

@keyframes ddpage-profile-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.ddpage-profile .ddpage-pulse-dot { animation: ddpage-profile-pulse 1.6s var(--ease-out) infinite; }

.ddpage-profile .ddpage-avatar-fill {
  background: linear-gradient(135deg, #fcddcc 0%, #febec2 100%);
}
.ddpage-profile .ddpage-cover-fill {
  background: linear-gradient(135deg, #fcddcc 0%, #febec2 60%, #fcddcc 100%);
}

.ddpage-profile .ddpage-footer-divider {
  border-top: 1px solid var(--color-cloud-canvas);
}
`

/* ---------- Data ---------- */
type LinkItem = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  meta: string
  href: string
  metaMono?: boolean
}

const LINKS: LinkItem[] = [
  {
    icon: Mail,
    title: '뉴스레터 「화요일의 편지」',
    meta: '매주 한 편의 에세이 · 구독자 4,200명',
    href: 'https://example.com/newsletter',
  },
  {
    icon: GraduationCap,
    title: '강의 「에세이 쓰는 법」',
    meta: '인프런 · 4주 과정',
    href: 'https://example.com/course',
  },
  {
    icon: InstagramGlyph,
    title: '인스타그램',
    meta: '@jion.writes',
    href: 'https://instagram.com/',
    metaMono: true,
  },
  {
    icon: YoutubeGlyph,
    title: '유튜브 채널',
    meta: '읽고 쓰는 사람의 책상 · 12,000명',
    href: 'https://youtube.com/',
  },
  {
    icon: Mic,
    title: '팟캐스트 「오래 쓰기」',
    meta: '격주 수요일 · Spotify',
    href: 'https://example.com/podcast',
  },
  {
    icon: MessageSquare,
    title: '컨택 · 강연 · 협업 문의',
    meta: 'hello@jion.kr',
    href: 'mailto:hello@jion.kr',
    metaMono: true,
  },
]

const SOCIALS = [
  { icon: TwitterGlyph, label: 'X', href: 'https://twitter.com/' },
  { icon: InstagramGlyph, label: 'Instagram', href: 'https://instagram.com/' },
  { icon: AtSign, label: 'Threads', href: 'https://threads.net/' },
  { icon: YoutubeGlyph, label: 'YouTube', href: 'https://youtube.com/' },
  { icon: Rss, label: 'RSS', href: '#rss' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@jion.kr' },
]

/* ---------- Page ---------- */
export default function Page() {
  return (
    <main className="ddpage-profile">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      <div className="mx-auto w-full max-w-md px-4 pt-10 pb-16 sm:pt-14">
        {/* 1. PROFILE CARD */}
        <section className="ddpage-profile-card px-6 pt-10 pb-8 text-center">
          <div
            className="ddpage-avatar-frame ddpage-avatar-fill mx-auto overflow-hidden rounded-full flex items-center justify-center"
            style={{ width: 104, height: 104 }}
            aria-label="프로필 이미지"
          >
            <span
              style={{
                color: '#ff4d00',
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: '-0.02em',
              }}
            >
              지
            </span>
          </div>

          <h1
            className="break-keep mt-5"
            style={{
              fontSize: 28,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              fontWeight: 500,
            }}
          >
            김지온
          </h1>

          <p
            className="break-keep mt-2 text-[15px]"
            style={{ color: 'var(--color-stone-gray)' }}
          >
            느린 글을 쓰는 사람
          </p>

          <div
            className="ddpage-mono mt-4 flex items-center justify-center gap-2"
            style={{ fontSize: 11, color: 'var(--color-slate-gray)' }}
          >
            <MapPin className="w-3 h-3" />
            <span>서울</span>
            <span style={{ color: 'var(--color-frost-gray)' }}>·</span>
            <span className="break-keep">에세이 작가 · 독립 출판인</span>
          </div>

          <p
            className="break-keep mt-6 mx-auto text-[14px] leading-[1.65]"
            style={{ color: 'var(--color-stone-gray)', maxWidth: 280 }}
          >
            글로 일상을 모으는 사람입니다. 매주 한 편의 에세이를 쓰고, 가끔 작은 책을 만듭니다.
          </p>

          <a
            href="https://example.com/book"
            target="_blank"
            rel="noopener noreferrer"
            className="ddpage-btn-primary break-keep mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            <BookOpen className="w-4 h-4" />
            <span>최신 책 「오래 머무는 마음」 구매</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <div
            className="ddpage-mono mt-4 inline-flex items-center gap-1.5"
            style={{
              fontSize: 10,
              color: 'var(--color-slate-gray)',
              letterSpacing: '0.2px',
            }}
          >
            <span
              className="ddpage-pulse-dot inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--color-fire-orange)' }}
            />
            <span>새 글 매주 화요일 발행</span>
          </div>
        </section>

        {/* 2. LINK CARDS */}
        <section className="mt-10">
          <div className="ddpage-caption mb-3 px-1">Links</div>
          <div className="flex flex-col gap-3">
            {LINKS.map((item) => {
              const Icon = item.icon
              const isExternal = item.href.startsWith('http') || item.href.startsWith('mailto:')
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="ddpage-link-card flex items-center gap-4 px-4 py-3.5"
                >
                  <span className="ddpage-icon-box">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className="block break-keep text-[14.5px]"
                      style={{ fontWeight: 500 }}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`block mt-0.5 text-[12px] break-keep ${item.metaMono ? 'ddpage-mono' : ''}`}
                      style={{ color: 'var(--color-slate-gray)' }}
                    >
                      {item.meta}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 shrink-0"
                    style={{ color: 'var(--color-silver-mist)' }}
                  />
                </a>
              )
            })}
          </div>
        </section>

        {/* 3. LATEST / HIGHLIGHT */}
        <section className="mt-10">
          <div className="ddpage-caption mb-3 px-1 flex items-center justify-between">
            <span>Latest</span>
            <span
              className="ddpage-mono"
              style={{
                fontSize: 10,
                color: 'var(--color-silver-mist)',
                textTransform: 'none',
                letterSpacing: 'normal',
              }}
            >
              2025.11.18
            </span>
          </div>

          <a
            href="https://example.com/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="ddpage-highlight-card"
          >
            <div
              className="ddpage-cover-fill relative flex w-full items-center justify-center"
              style={{ aspectRatio: '16 / 10' }}
            >
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 250"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <pattern id="ddpage-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ddpage-grid)" />
              </svg>
              <div
                className="ddpage-mono relative rounded-full px-3 py-1"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  color: 'var(--color-stone-gray)',
                  fontSize: 10,
                  letterSpacing: '0.3px',
                }}
              >
                essay · vol.47
              </div>
            </div>
            <div className="px-4 py-4">
              <div
                className="ddpage-caption"
                style={{ color: 'var(--color-fire-orange)' }}
              >
                에세이
              </div>
              <h3
                className="break-keep mt-1.5 text-[16px] leading-[1.4]"
                style={{ fontWeight: 500 }}
              >
                오래 머무는 마음에 대하여
              </h3>
              <p
                className="break-keep mt-1.5 text-[13px] leading-[1.55]"
                style={{ color: 'var(--color-slate-gray)' }}
              >
                빨리 지나가는 것들 사이에서, 굳이 오래 머무는 마음을 가진 사람들의 이야기.
              </p>
              <div
                className="mt-3 flex items-center gap-1.5 text-[12px]"
                style={{ color: 'var(--color-stone-gray)' }}
              >
                <span>읽어보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </a>
        </section>

        {/* 4. SNS QUICK ROW */}
        <section className="mt-10">
          <div className="ddpage-caption mb-3 px-1 text-center">Elsewhere</div>
          <div className="flex items-center justify-center gap-2.5">
            {SOCIALS.map((s) => {
              const Icon = s.icon
              const isExternal = s.href.startsWith('http') || s.href.startsWith('mailto:')
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="ddpage-sns-icon"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </section>

        {/* 5. FOOTER */}
        <footer className="ddpage-footer-divider mt-12 pt-6 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-[12px]"
            style={{ color: 'var(--color-stone-gray)' }}
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="break-keep">다른 포트폴리오 보기</span>
          </Link>
          <p
            className="ddpage-mono mt-3"
            style={{
              fontSize: 10,
              color: 'var(--color-silver-mist)',
              letterSpacing: '0.2px',
            }}
          >
            © 2026 김지온 — 포트폴리오용 샘플 작업입니다
          </p>
        </footer>
      </div>
    </main>
  )
}
