'use client';

/**
 * 런온(LearnOn) — 사전예약 랜딩 (리드/DB 수집형)
 * 포트폴리오 #01
 *
 * 원본: Claude Design "Lead Landing.html"
 * 디자인 톤: 다크 히어로 + 라이트 본문 + 파스텔 카테고리, 단일 CTA(이메일 사전예약)
 *
 * 단일 파일 구조:
 *   - 원본 <style>은 그대로 유지하되 ".lp" 접두로 스코프 (다른 라우트로 누수 방지)
 *   - 폼 / FAQ / 카운트다운만 React 상태로 처리
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';

const SCOPED_CSS = `
.lp{
  --color-primary:#0052ff;
  --color-primary-active:#003ecc;
  --color-canvas:#ffffff;
  --color-surface-soft:#f7f7f7;
  --color-surface-strong:#eef0f3;
  --color-surface-dark:#0a0b0d;
  --color-surface-dark-elevated:#16181c;
  --color-hairline:#dee1e6;
  --color-hairline-soft:#eef0f3;
  --color-ink:#0a0b0d;
  --color-body:#5b616e;
  --color-muted:#7c828a;
  --color-muted-soft:#a8acb3;
  --color-on-primary:#ffffff;
  --color-on-dark:#ffffff;
  --color-on-dark-soft:#a8acb3;
  --color-semantic-up:#05b169;
  --color-semantic-down:#cf202f;
  --color-accent-yellow:#f4b000;
  --pastel-mint:#d6f1e3;
  --pastel-mint-d:#0a5c3d;
  --pastel-peach:#ffe3d3;
  --pastel-sky:#dbe8ff;
  --pastel-sky-d:#143a8a;
  --pastel-cream:#fff3cf;
  --pastel-cream-d:#7a4d00;
  --font-display:'Inter','Noto Sans KR',-apple-system,system-ui,sans-serif;
  --font-sans:'Inter','Noto Sans KR',-apple-system,system-ui,sans-serif;
  --font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  --container-max:1200px;
  --nav-height:64px;
  --radius-pill:100px;
  --radius-xl:24px;
  --radius-lg:16px;
  --radius-md:12px;
  --shadow-soft:0 4px 12px rgba(0,0,0,0.04);

  font-family:var(--font-sans);
  font-size:16px;
  line-height:1.5;
  color:var(--color-ink);
  background:var(--color-canvas);
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
  scroll-padding-top:80px;
}
.lp *,.lp *::before,.lp *::after{box-sizing:border-box}
.lp a{color:var(--color-primary);text-decoration:none}
.lp a:hover{text-decoration:underline}
.lp button{font-family:var(--font-sans)}
.lp img{display:block;max-width:100%}
.lp h1,.lp h2,.lp h3,.lp h4{margin:0}

.lp .container{max-width:var(--container-max);margin:0 auto;padding:0 32px}

/* nav */
.lp .nav{height:var(--nav-height);background:rgba(10,11,13,0.92);backdrop-filter:saturate(1.2) blur(8px);-webkit-backdrop-filter:saturate(1.2) blur(8px);color:#fff;border-bottom:1px solid #16181c;position:sticky;top:0;z-index:50}
.lp .nav-inner{max-width:var(--container-max);margin:0 auto;height:100%;padding:0 32px;display:flex;align-items:center;gap:32px}
.lp .wordmark{font-family:var(--font-display);font-weight:700;font-size:18px;letter-spacing:-0.5px;color:#fff;display:inline-flex;align-items:center;gap:8px}
.lp .wordmark .dot{width:10px;height:10px;border-radius:50%;background:var(--color-primary);display:inline-block}
.lp .nav-menu{display:flex;align-items:center;gap:28px;margin-left:8px}
.lp .nav-menu a{font-size:14px;font-weight:500;color:rgba(255,255,255,0.78);transition:color .15s ease-out}
.lp .nav-menu a:hover{text-decoration:none;color:#fff}
.lp .nav-menu a.active{color:#fff;position:relative}
.lp .nav-menu a.active::after{content:"";position:absolute;left:0;right:0;bottom:-22px;height:2px;background:var(--color-primary);border-radius:2px}
.lp .nav-spacer{flex:1}
.lp .nav-actions{display:flex;align-items:center;gap:12px}
.lp .nav-signin{font-size:14px;font-weight:600;color:#fff;background:transparent;border:0;cursor:pointer;padding:0 8px}

/* buttons */
.lp .btn{font-family:var(--font-sans);font-weight:600;font-size:16px;line-height:1.15;border:0;border-radius:var(--radius-pill);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 20px;height:44px;transition:background-color .15s ease-out,transform .15s ease-out;white-space:nowrap;text-decoration:none}
.lp .btn-primary{background:var(--color-primary);color:#fff}
.lp .btn-primary:hover{background:var(--color-primary-active);text-decoration:none}
.lp .btn-outline-dark{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px #fff;height:56px;padding:0 32px}
.lp .btn-outline-dark:hover{background:rgba(255,255,255,0.06);text-decoration:none}
.lp .btn-outline-light{background:transparent;color:var(--color-ink);box-shadow:inset 0 0 0 1px var(--color-hairline);height:44px;padding:0 20px}
.lp .btn-outline-light:hover{background:var(--color-surface-soft);text-decoration:none}

/* eyebrow */
.lp .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:100px;background:var(--color-surface-dark-elevated);font-family:var(--font-sans);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#fff;white-space:nowrap}
.lp .eyebrow .pulse{width:6px;height:6px;border-radius:50%;background:var(--color-semantic-up);box-shadow:0 0 0 0 rgba(5,177,105,.6);animation:lp-pulse 1.8s ease-out infinite}
@keyframes lp-pulse{0%{box-shadow:0 0 0 0 rgba(5,177,105,.55)}70%{box-shadow:0 0 0 10px rgba(5,177,105,0)}100%{box-shadow:0 0 0 0 rgba(5,177,105,0)}}

/* type */
.lp h1{font-family:var(--font-display);font-weight:400;font-size:72px;line-height:1;letter-spacing:-2.2px;color:var(--color-ink)}
.lp h2{font-family:var(--font-display);font-weight:400;font-size:52px;line-height:1;letter-spacing:-1.3px;color:var(--color-ink)}
.lp h3{font-family:var(--font-display);font-weight:400;font-size:32px;line-height:1.13;letter-spacing:-0.4px;color:var(--color-ink)}
.lp h4{font-family:var(--font-sans);font-weight:600;font-size:18px;line-height:1.33;color:var(--color-ink)}
.lp p{margin:0;color:var(--color-body);font-size:16px;line-height:1.5}
.lp .lead{font-size:18px;line-height:1.55;color:var(--color-body)}
.lp .lead-on-dark{color:var(--color-on-dark-soft)}
.lp .label{font-family:var(--font-sans);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-muted)}
.lp .mono{font-family:var(--font-mono);font-weight:500;font-variant-numeric:tabular-nums}

/* HERO */
.lp .hero{background:var(--color-surface-dark);color:#fff;padding:80px 32px 120px;position:relative;overflow:hidden}
.lp .hero::before{content:"";position:absolute;left:-200px;top:-200px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(0,82,255,0.18),transparent 60%);pointer-events:none}
.lp .hero::after{content:"";position:absolute;right:-150px;bottom:-150px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(244,176,0,0.08),transparent 60%);pointer-events:none}
.lp .hero-grid{max-width:var(--container-max);margin:0 auto;display:grid;grid-template-columns:1.05fr 1fr;gap:64px;align-items:center;position:relative;z-index:1}
.lp .hero h1{color:#fff;margin-top:20px;text-wrap:balance;font-size:72px;letter-spacing:-2.2px}
.lp .hero h1 .accent{color:var(--color-primary);position:relative;display:inline-block}
.lp .hero .lead{color:var(--color-on-dark-soft);margin-top:20px;max-width:480px}

.lp .signup-form{margin-top:32px;display:flex;align-items:center;gap:8px;background:var(--color-surface-dark-elevated);padding:8px;border-radius:var(--radius-pill);max-width:520px;border:1px solid #1f232a;transition:border-color .15s ease-out,box-shadow .15s ease-out}
.lp .signup-form:focus-within{border-color:#324053;box-shadow:0 0 0 4px rgba(0,82,255,0.18)}
.lp .signup-form input{flex:1;background:transparent;border:0;outline:0;color:#fff;font-family:var(--font-sans);font-size:16px;padding:0 16px;height:48px;min-width:0}
.lp .signup-form input::placeholder{color:var(--color-muted)}
.lp .signup-form button{background:var(--color-primary);color:#fff;border:0;border-radius:var(--radius-pill);height:48px;padding:0 24px;font-family:var(--font-sans);font-weight:600;font-size:15px;cursor:pointer;transition:background .15s ease-out}
.lp .signup-form button:hover{background:var(--color-primary-active)}
.lp .form-micro{display:flex;align-items:center;gap:16px;margin-top:14px;color:var(--color-on-dark-soft);font-size:13px;flex-wrap:wrap}
.lp .form-micro .check{color:var(--color-semantic-up)}
.lp .form-success{margin-top:14px;color:var(--color-semantic-up);font-size:14px;font-weight:600}

/* hero floating cards */
.lp .hero-mock{position:relative;height:520px}
.lp .pcard{background:var(--color-surface-dark-elevated);border-radius:var(--radius-xl);padding:24px;color:#fff;box-shadow:0 24px 60px rgba(0,0,0,0.5);position:absolute}
.lp .pcard.course{width:380px;right:0;top:24px;transform:rotate(-2deg);animation:lp-floatA 7s ease-in-out infinite}
.lp .pcard.stat{width:240px;right:260px;top:300px;transform:rotate(3deg);animation:lp-floatB 8s ease-in-out infinite .8s}
.lp .pcard.badge{width:200px;right:-12px;top:-28px;transform:rotate(6deg);padding:14px 18px;background:var(--color-primary);box-shadow:0 16px 36px rgba(0,82,255,0.4);animation:lp-floatC 6s ease-in-out infinite .4s}
@keyframes lp-floatA{0%,100%{transform:rotate(-2deg) translateY(0)}50%{transform:rotate(-2deg) translateY(-12px)}}
@keyframes lp-floatB{0%,100%{transform:rotate(3deg) translateY(0)}50%{transform:rotate(3deg) translateY(10px)}}
@keyframes lp-floatC{0%,100%{transform:rotate(6deg) translateY(0)}50%{transform:rotate(8deg) translateY(-6px)}}

.lp .course-thumb{aspect-ratio:16/9;border-radius:var(--radius-lg);background:linear-gradient(135deg,#1f2a55,#0d1532);position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:14px}
.lp .course-thumb::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 80% at 100% 0%,rgba(0,82,255,.45),transparent 55%),radial-gradient(120% 80% at 0% 100%,rgba(244,176,0,.25),transparent 55%)}
.lp .course-thumb .play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.96);display:flex;align-items:center;justify-content:center;color:#0a0b0d}
.lp .course-thumb .chip{position:relative;background:rgba(10,11,13,0.7);backdrop-filter:blur(8px);color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px}
.lp .course-meta{margin-top:14px}
.lp .course-meta .ctitle{font-size:15px;font-weight:600}
.lp .course-meta .csub{font-size:12px;color:var(--color-on-dark-soft);margin-top:2px}
.lp .course-progress{margin-top:14px;display:flex;align-items:center;gap:12px}
.lp .pbar{flex:1;height:6px;background:#0a0b0d;border-radius:100px;overflow:hidden}
.lp .pbar > i{display:block;height:100%;background:var(--color-primary);border-radius:100px}
.lp .ptxt{font-family:var(--font-mono);font-size:12px;font-weight:500;color:var(--color-on-dark-soft)}

.lp .stat-card .slabel{font-size:11px;color:var(--color-on-dark-soft);text-transform:uppercase;letter-spacing:0.08em;font-weight:600}
.lp .stat-card .sval{font-family:var(--font-mono);font-weight:500;font-size:36px;line-height:1;margin-top:10px;letter-spacing:-1px}
.lp .stat-card .sdelta{font-family:var(--font-mono);font-size:12px;color:var(--color-semantic-up);margin-top:6px}
.lp .stat-card svg{margin-top:14px}

.lp .badge-card .blabel{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:.9}
.lp .badge-card .btitle{font-family:var(--font-display);font-weight:400;font-size:24px;letter-spacing:-0.5px;margin-top:4px;line-height:1.1}

/* section heads */
.lp .section-head{max-width:760px;margin-bottom:56px}
.lp .section-head h2{margin-top:12px;text-wrap:balance}
.lp .section-head.center{margin-left:auto;margin-right:auto;text-align:center}
.lp .section-head p{margin-top:16px;font-size:17px;max-width:600px}
.lp .section-head.center p{margin-left:auto;margin-right:auto}

/* LOGO MARQUEE */
.lp .logos{background:var(--color-surface-soft);padding:56px 0;border-bottom:1px solid var(--color-hairline-soft);position:relative;overflow:hidden}
.lp .logos .logos-label{text-align:center;color:var(--color-muted);font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:32px}
.lp .marquee{display:flex;gap:64px;width:max-content;animation:lp-marquee 36s linear infinite}
.lp .marquee:hover{animation-play-state:paused}
@keyframes lp-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.lp .marquee .lg{display:flex;align-items:center;justify-content:center;height:36px;padding:0 8px;font-family:var(--font-display);font-weight:600;font-size:22px;color:var(--color-muted);letter-spacing:-0.5px;white-space:nowrap;opacity:.85}
.lp .marquee .lg .glyph{margin-right:10px;font-family:var(--font-mono);font-weight:500;color:var(--color-ink)}

/* VALUE PROPS */
.lp .vp-section{background:var(--color-canvas);padding:120px 32px 96px}
.lp .vp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.lp .vp-card{background:var(--color-canvas);border:1px solid var(--color-hairline);border-radius:var(--radius-xl);padding:36px;display:flex;flex-direction:column;gap:16px;min-height:300px;transition:box-shadow .2s ease-out,transform .2s ease-out}
.lp .vp-card:hover{box-shadow:var(--shadow-soft);transform:translateY(-2px)}
.lp .vp-icon{width:56px;height:56px;border-radius:var(--radius-md);background:var(--color-surface-strong);display:flex;align-items:center;justify-content:center;color:var(--color-ink)}
.lp .vp-card h4{font-family:var(--font-display);font-weight:400;font-size:24px;letter-spacing:-0.4px;line-height:1.2}
.lp .vp-card p{font-size:15px}
.lp .vp-card .vp-foot{margin-top:auto;display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:var(--color-primary)}

/* CATEGORIES */
.lp .cats{background:var(--color-canvas);padding:96px 32px}
.lp .cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.lp .cat{aspect-ratio:1/1;border-radius:var(--radius-xl);padding:24px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:transform .2s ease-out,box-shadow .2s ease-out;position:relative;overflow:hidden}
.lp .cat:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft);text-decoration:none}
.lp .cat .cat-count{font-family:var(--font-mono);font-weight:500;font-size:12px;opacity:.65}
.lp .cat .cat-title{font-family:var(--font-display);font-weight:400;font-size:24px;letter-spacing:-0.5px;line-height:1.1}
.lp .cat-mint{background:var(--pastel-mint);color:var(--pastel-mint-d)}
.lp .cat-peach{background:var(--pastel-peach);color:#7a2d00}
.lp .cat-sky{background:var(--pastel-sky);color:var(--pastel-sky-d)}
.lp .cat-cream{background:var(--pastel-cream);color:var(--pastel-cream-d)}
.lp .cat-ink{background:var(--color-surface-dark);color:#fff}
.lp .cat-blue{background:var(--color-primary);color:#fff}
.lp .cat-strong{background:var(--color-surface-strong);color:var(--color-ink)}
.lp .cat-ink2{background:#1a1d22;color:#fff}

/* INSTRUCTORS */
.lp .ins{background:var(--color-surface-soft);padding:96px 32px}
.lp .ins-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.lp .ins-card{background:var(--color-canvas);border-radius:var(--radius-xl);padding:24px;display:flex;flex-direction:column;gap:16px;border:1px solid var(--color-hairline);transition:transform .2s ease-out,box-shadow .2s ease-out}
.lp .ins-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft)}
.lp .ins-photo{aspect-ratio:1/1;border-radius:var(--radius-lg);background:linear-gradient(135deg,var(--pastel-sky),var(--pastel-mint));display:flex;align-items:flex-end;justify-content:flex-start;padding:16px;position:relative;overflow:hidden;font-family:var(--font-display);font-weight:400;font-size:120px;line-height:1;color:rgba(255,255,255,0.85);letter-spacing:-4px}
.lp .ins-photo .tag{position:absolute;top:12px;left:12px;background:rgba(10,11,13,0.75);color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;letter-spacing:0.04em}
.lp .ins-photo.p2{background:linear-gradient(135deg,var(--pastel-peach),var(--pastel-cream))}
.lp .ins-photo.p3{background:linear-gradient(135deg,#1f2a55,var(--color-primary))}
.lp .ins-photo.p4{background:linear-gradient(135deg,var(--pastel-mint),#0d3b29)}
.lp .ins-name{font-family:var(--font-sans);font-weight:600;font-size:17px;color:var(--color-ink)}
.lp .ins-role{font-size:13px;color:var(--color-muted);margin-top:4px}
.lp .ins-stats{margin-top:auto;display:flex;gap:16px;font-size:13px;color:var(--color-body)}
.lp .ins-stats b{color:var(--color-ink);font-weight:600}

/* FEATURED COURSES */
.lp .feat{background:var(--color-surface-dark);color:#fff;padding:96px 32px;position:relative;overflow:hidden}
.lp .feat::before{content:"";position:absolute;left:50%;top:-100px;transform:translateX(-50%);width:800px;height:600px;background:radial-gradient(ellipse at center,rgba(0,82,255,0.12),transparent 60%);pointer-events:none}
.lp .feat .section-head h2,.lp .feat h2{color:#fff}
.lp .feat .section-head p{color:var(--color-on-dark-soft)}
.lp .feat .label{color:var(--color-on-dark-soft)}
.lp .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;position:relative}
.lp .feat-card{background:var(--color-surface-dark-elevated);border-radius:var(--radius-xl);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s ease-out,box-shadow .2s ease-out;cursor:pointer}
.lp .feat-card:hover{transform:translateY(-4px);box-shadow:0 24px 60px rgba(0,0,0,0.55)}
.lp .feat-thumb{aspect-ratio:16/10;position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:14px}
.lp .feat-thumb .chip{background:rgba(10,11,13,0.7);backdrop-filter:blur(8px);color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:100px;z-index:1}
.lp .feat-thumb .play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,0.96);display:flex;align-items:center;justify-content:center;color:#0a0b0d;z-index:1}
.lp .feat-thumb.t1{background:linear-gradient(135deg,#1a3a8a,#0d1532)}
.lp .feat-thumb.t2{background:linear-gradient(135deg,#2d1a4a,#0a0b0d)}
.lp .feat-thumb.t3{background:linear-gradient(135deg,#0d3b29,#0a0b0d)}
.lp .feat-thumb.t4{background:linear-gradient(135deg,#5a2d00,#0a0b0d)}
.lp .feat-thumb.t5{background:linear-gradient(135deg,#2a2a2a,#0a0b0d)}
.lp .feat-thumb.t6{background:linear-gradient(135deg,#1f2a55,#3a1a4a)}
.lp .feat-body{padding:20px;display:flex;flex-direction:column;gap:12px;flex:1}
.lp .feat-body .ftitle{font-family:var(--font-sans);font-weight:600;font-size:17px;line-height:1.3;color:#fff}
.lp .feat-body .fsub{font-size:13px;color:var(--color-on-dark-soft)}
.lp .feat-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:8px}
.lp .feat-rating{display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-weight:500;font-size:13px;color:#fff}
.lp .feat-rating .star{color:var(--color-accent-yellow)}
.lp .feat-price{font-family:var(--font-mono);font-weight:500;font-size:14px;color:#fff}
.lp .feat-price s{color:var(--color-muted);font-size:11px;margin-right:6px}
.lp .feat-cta-wrap{display:flex;justify-content:center;margin-top:48px}

/* STATS */
.lp .trust{background:var(--color-surface-soft);padding:96px 32px}
.lp .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-bottom:48px}
.lp .stat-block{background:var(--color-canvas);border:1px solid var(--color-hairline);border-radius:var(--radius-xl);padding:32px}
.lp .stat-block .label{margin-bottom:16px;display:block}
.lp .stat-block .num{font-family:var(--font-mono);font-weight:500;font-size:56px;line-height:1;letter-spacing:-2px;color:var(--color-ink)}
.lp .stat-block .num .unit{font-size:20px;color:var(--color-muted);margin-left:6px;letter-spacing:0}
.lp .stat-block .sub{margin-top:12px;font-size:14px;color:var(--color-body)}
.lp .stat-block .delta{color:var(--color-semantic-up);font-family:var(--font-mono);font-size:13px;margin-top:8px}

/* HOW IT WORKS */
.lp .how{background:var(--color-canvas);padding:96px 32px}
.lp .how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:8px}
.lp .step{background:var(--color-surface-soft);border-radius:var(--radius-xl);padding:36px 32px;display:flex;flex-direction:column;gap:16px;min-height:300px;position:relative;overflow:hidden;transition:transform .2s ease-out,box-shadow .2s ease-out}
.lp .step:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft)}
.lp .step .stepnum{font-family:var(--font-mono);font-weight:500;font-size:14px;color:var(--color-muted)}
.lp .step h4{font-family:var(--font-display);font-weight:400;font-size:28px;letter-spacing:-0.5px;line-height:1.15}
.lp .step p{font-size:15px}
.lp .step.accent{background:var(--color-surface-dark);color:#fff}
.lp .step.accent h4{color:#fff}
.lp .step.accent p{color:var(--color-on-dark-soft)}
.lp .step.accent .stepnum{color:var(--color-on-dark-soft)}
.lp .step .step-art{margin-top:auto;align-self:flex-end;opacity:.55}

/* COMPARISON */
.lp .cmp{background:var(--color-canvas);padding:96px 32px}
.lp .cmp-wrap{max-width:980px;margin:0 auto}
.lp .cmp-table{background:var(--color-canvas);border:1px solid var(--color-hairline);border-radius:var(--radius-xl);overflow:hidden}
.lp .cmp-row{display:grid;grid-template-columns:1.4fr 1fr 1fr;align-items:center}
.lp .cmp-row:not(:last-child){border-bottom:1px solid var(--color-hairline-soft)}
.lp .cmp-row.cmp-head{background:var(--color-surface-soft)}
.lp .cmp-cell{padding:20px 24px;font-size:15px;color:var(--color-body)}
.lp .cmp-cell.feat-name{color:var(--color-ink);font-weight:500}
.lp .cmp-cell.center{text-align:center}
.lp .cmp-cell.brand-col{background:rgba(0,82,255,0.04);font-weight:600;color:var(--color-ink);text-align:center;font-size:16px;border-left:1px solid var(--color-hairline-soft);border-right:1px solid var(--color-hairline-soft)}
.lp .cmp-row.cmp-head .cmp-cell.brand-col{background:var(--color-primary);color:#fff;font-family:var(--font-display);font-weight:600;font-size:18px;letter-spacing:-0.3px}
.lp .cmp-row.cmp-head .cmp-cell{font-family:var(--font-sans);font-weight:600;color:var(--color-ink);font-size:14px;text-transform:uppercase;letter-spacing:0.06em;padding-top:18px;padding-bottom:18px}
.lp .check-y{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(0,82,255,0.1);color:var(--color-primary)}
.lp .check-n{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--color-surface-strong);color:var(--color-muted-soft)}
.lp .cmp-val{font-size:14px;color:var(--color-muted)}

/* TESTIMONIALS */
.lp .testi{background:var(--color-surface-soft);padding:96px 32px}
.lp .reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.lp .review{background:var(--color-canvas);border:1px solid var(--color-hairline);border-radius:var(--radius-xl);padding:28px;display:flex;flex-direction:column;gap:16px;transition:transform .2s ease-out,box-shadow .2s ease-out}
.lp .review:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft)}
.lp .review .stars{color:var(--color-accent-yellow);letter-spacing:2px;font-size:16px}
.lp .review blockquote{margin:0;font-size:15px;line-height:1.55;color:var(--color-ink);font-weight:500}
.lp .review .who{display:flex;align-items:center;gap:12px;margin-top:auto}
.lp .avatar{width:40px;height:40px;border-radius:50%;background:var(--color-surface-strong);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:15px;color:var(--color-ink)}
.lp .avatar.a1{background:var(--pastel-sky);color:var(--pastel-sky-d)}
.lp .avatar.a2{background:var(--pastel-mint);color:var(--pastel-mint-d)}
.lp .avatar.a3{background:var(--pastel-peach);color:#7a2d00}
.lp .avatar.a4{background:var(--pastel-cream);color:var(--pastel-cream-d)}
.lp .avatar.a5{background:var(--color-surface-dark);color:#fff}
.lp .avatar.a6{background:var(--color-primary);color:#fff}
.lp .review .name{font-size:14px;font-weight:600;color:var(--color-ink)}
.lp .review .meta{font-size:12px;color:var(--color-muted)}

/* FAQ */
.lp .faq-section{background:var(--color-canvas);padding:96px 32px}
.lp .faq-wrap{max-width:880px;margin:0 auto}
.lp .faq-head{text-align:center;margin-bottom:48px}
.lp .faq-list{display:flex;flex-direction:column;gap:12px}
.lp .faq{background:var(--color-canvas);border:1px solid var(--color-hairline);border-radius:var(--radius-xl);overflow:hidden;transition:border-color .15s ease-out}
.lp .faq.open{border-color:#c8cdd4}
.lp .faq-q{width:100%;background:transparent;border:0;cursor:pointer;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;gap:24px;text-align:left;color:var(--color-ink);font-family:var(--font-sans);font-weight:600;font-size:17px;line-height:1.4}
.lp .faq-q .qcaret{flex:0 0 auto;width:32px;height:32px;border-radius:50%;background:var(--color-surface-strong);display:flex;align-items:center;justify-content:center;transition:transform .25s ease-out,background .15s ease-out,color .15s ease-out;color:var(--color-ink)}
.lp .faq.open .qcaret{background:var(--color-primary);color:#fff;transform:rotate(45deg)}
.lp .faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease-out}
.lp .faq-a-inner{padding:0 28px 24px;color:var(--color-body);font-size:15px;line-height:1.65;max-width:720px}
.lp .faq.open .faq-a{max-height:400px}

/* FINAL CTA */
.lp .final-cta{background:var(--color-surface-dark);color:#fff;padding:120px 32px;text-align:center;position:relative;overflow:hidden}
.lp .final-cta::before{content:"";position:absolute;left:50%;top:0;transform:translateX(-50%);width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle at center,rgba(0,82,255,0.22),transparent 60%);pointer-events:none}
.lp .final-cta-inner{position:relative;max-width:760px;margin:0 auto;z-index:1}
.lp .final-cta h2{color:#fff;font-size:56px;letter-spacing:-1.5px;margin:0;text-wrap:balance}
.lp .final-cta .lead{margin-top:16px}
.lp .final-cta .signup-form{margin:32px auto 0}
.lp .final-cta .form-micro{justify-content:center}
.lp .countdown{display:inline-flex;align-items:center;gap:12px;margin-top:32px;padding:14px 20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-pill)}
.lp .countdown .cd-label{font-size:13px;color:var(--color-on-dark-soft);text-transform:uppercase;letter-spacing:0.06em;font-weight:600}
.lp .countdown .cd-time{font-family:var(--font-mono);font-weight:500;font-size:18px;color:#fff;letter-spacing:0;font-variant-numeric:tabular-nums}

/* FOOTER */
.lp .lp-footer{background:var(--color-canvas);border-top:1px solid var(--color-hairline)}
.lp .footer-inner{max-width:var(--container-max);margin:0 auto;padding:64px 32px 32px}
.lp .footer-top{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr;gap:32px;margin-bottom:48px}
.lp .footer-brand .wordmark{color:var(--color-ink)}
.lp .footer-brand p{margin-top:16px;font-size:14px;max-width:340px}
.lp .footer-social{display:flex;gap:8px;margin-top:24px}
.lp .footer-social a{width:36px;height:36px;border-radius:50%;background:var(--color-surface-strong);display:inline-flex;align-items:center;justify-content:center;color:var(--color-ink)}
.lp .footer-social a:hover{background:var(--color-ink);color:#fff;text-decoration:none}
.lp .footer-col h5{font-family:var(--font-sans);font-weight:600;font-size:14px;color:var(--color-ink);margin:0 0 16px}
.lp .footer-col ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
.lp .footer-col a{font-size:14px;color:var(--color-body)}
.lp .footer-legal{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap;padding-top:32px;border-top:1px solid var(--color-hairline)}
.lp .footer-biz{font-size:12px;color:var(--color-muted);line-height:1.8;max-width:720px}
.lp .footer-links{display:flex;gap:16px}
.lp .footer-links a{font-size:12px;color:var(--color-muted)}
.lp .footer-portfolio-note{margin-top:24px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;color:var(--color-muted);font-size:12px}
.lp .footer-portfolio-note a{color:var(--color-primary);font-weight:600}

/* responsive */
@media (max-width: 900px){
  .lp .hero-grid{grid-template-columns:1fr;gap:48px}
  .lp .hero-mock{height:auto;min-height:380px}
  .lp .pcard.course{width:90%;right:5%;top:24px;transform:none;animation:none}
  .lp .pcard.stat{width:60%;right:5%;top:220px;transform:none;animation:none}
  .lp .pcard.badge{right:5%;top:-12px;transform:none;animation:none}
  .lp .hero h1{font-size:48px;letter-spacing:-1.4px}
  .lp h2{font-size:36px;letter-spacing:-0.8px}
  .lp .vp-grid,.lp .feat-grid,.lp .how-grid,.lp .reviews{grid-template-columns:1fr}
  .lp .cat-grid{grid-template-columns:repeat(2,1fr)}
  .lp .ins-grid{grid-template-columns:repeat(2,1fr)}
  .lp .stats-row{grid-template-columns:repeat(2,1fr)}
  .lp .footer-top{grid-template-columns:1fr 1fr;gap:32px}
  .lp .cmp-row{grid-template-columns:1.2fr 1fr 1fr}
  .lp .nav-menu{display:none}
  .lp .final-cta h2{font-size:36px;letter-spacing:-0.8px}
}
`;

type FormKey = 'hero' | 'cta';

export default function LeadLandingClient() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      <main className="lp" id="top">
        <Nav />
        <Hero />
        <LogoMarquee />
        <ValueProps />
        <Categories />
        <Instructors />
        <FeaturedCourses />
        <Stats />
        <HowItWorks />
        <Comparison />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}

function Wordmark({ inkOnLight = false }: { inkOnLight?: boolean }) {
  return (
    <a href="#top" className="wordmark" style={inkOnLight ? { color: 'var(--color-ink)' } : undefined}>
      <span className="dot" />
      LearnOn
    </a>
  );
}

function Nav() {
  const navItems = [
    { id: 'why', label: '왜 런온인가' },
    { id: 'categories', label: '카테고리' },
    { id: 'instructors', label: '강사진' },
    { id: 'courses', label: '추천 강의' },
    { id: 'testimonials', label: '후기' },
    { id: 'faq', label: '자주 묻는 질문' },
  ];
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const targets = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        }
        if (best) setActive(best.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Wordmark />
        <div className="nav-menu">
          {navItems.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''}>
              {n.label}
            </a>
          ))}
        </div>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <button type="button" className="nav-signin" onClick={() => console.log('Sign in')}>
            로그인
          </button>
          <a href="#final-cta" className="btn btn-primary" style={{ height: 36, padding: '0 16px', fontSize: 14 }}>
            사전예약
          </a>
        </div>
      </div>
    </nav>
  );
}

function SignupForm({ formKey }: { formKey: FormKey }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  if (submitted) {
    return (
      <div className="form-success">신청이 완료되었어요. 입력하신 이메일로 안내를 보내드릴게요.</div>
    );
  }
  return (
    <form
      className="signup-form"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(`[${formKey}] signup`, email);
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="이메일 주소를 입력해 주세요"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">사전예약 하기</button>
    </form>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <span className="eyebrow">
            <span className="pulse" />사전예약 오픈 · 7일 한정
          </span>
          <h1>
            배움이<br />시작되는 곳,<br /><span className="accent">런온.</span>
          </h1>
          <p className="lead">
            필요한 강의만 골라 듣는 큐레이션 학습 플랫폼.<br />
            지금 사전예약하면 정식 오픈일에 첫 강의 <strong style={{ color: '#fff' }}>25% 할인</strong>으로 시작할 수 있어요.
          </p>
          <SignupForm formKey="hero" />
          <div className="form-micro">
            <span><span className="check">✓</span> 30초 가입</span>
            <span><span className="check">✓</span> 스팸 없음</span>
            <span><span className="check">✓</span> 언제든 해지</span>
          </div>
        </div>

        <div className="hero-mock" aria-hidden="true">
          <div className="pcard badge badge-card">
            <div className="blabel">사전예약 한정</div>
            <div className="btitle">첫 강의<br />25% 할인</div>
          </div>

          <div className="pcard course">
            <div className="course-thumb">
              <span className="chip">디자인</span>
              <span className="play">
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5l9 5.5-9 5.5z" fill="currentColor" /></svg>
              </span>
            </div>
            <div className="course-meta">
              <div className="ctitle">실무로 배우는 브랜드 시스템</div>
              <div className="csub">박지윤 · 12강 · 4시간 30분</div>
            </div>
            <div className="course-progress">
              <div className="pbar"><i style={{ width: '62%' }} /></div>
              <div className="ptxt">62%</div>
            </div>
          </div>

          <div className="pcard stat stat-card">
            <div className="slabel">이번 주 신청자</div>
            <div className="sval">12,840</div>
            <div className="sdelta">+1,204 어제 대비</div>
            <svg viewBox="0 0 200 40" width="100%" height="40">
              <polyline
                points="0,32 20,28 40,30 60,22 80,24 100,18 120,20 140,12 160,14 180,8 200,6"
                fill="none"
                stroke="#05b169"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

const LOGOS = [
  ['◆', 'NAVER'], ['▲', 'Kakao'], ['●', 'Coupang'], ['◇', 'Toss'],
  ['■', 'Woowa'], ['◇', 'Daangn'], ['●', 'Line'], ['▲', 'Krafton'],
  ['◆', 'Samsung'], ['●', 'SK Telecom'], ['■', 'Hyundai'], ['◇', 'Riiid'],
] as const;

function LogoMarquee() {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <section className="logos">
      <div className="logos-label">현업 강사들이 일하고 있는 곳</div>
      <div className="marquee">
        {doubled.map(([g, name], i) => (
          <div className="lg" key={`${name}-${i}`}>
            <span className="glyph">{g}</span>{name}
          </div>
        ))}
      </div>
    </section>
  );
}

function ValueProps() {
  const items = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8.5" />
          <path d="m3 10 9-6 9 6" />
          <path d="M9 21v-7h6v7" />
        </svg>
      ),
      title: '큐레이션된 강의만',
      desc: '현업 전문가가 직접 검수한 강의만 올라옵니다. 비슷한 강의 100개 중 무엇을 들어야 할지 더는 고민하지 않아도 돼요.',
      foot: '엄선된 200+ 강의 →',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
        </svg>
      ),
      title: '검증된 크리에이터',
      desc: '업계 평균 7년 이상의 실무자만 강의를 만듭니다. 이론이 아닌 어제까지의 현장 경험을 그대로 전해드려요.',
      foot: '강사진 만나보기 →',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 3 7v6c0 5 3.5 8.5 9 10 5.5-1.5 9-5 9-10V7l-9-5z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: '평생 소장, 평생 업데이트',
      desc: '한 번 구매한 강의는 평생 소장. 강사가 직접 콘텐츠를 갱신하면 추가 비용 없이 새 버전이 라이브러리에 자동으로 들어옵니다.',
      foot: '정책 자세히 보기 →',
    },
  ];

  return (
    <section className="vp-section" id="why">
      <div className="container">
        <div className="section-head">
          <span className="label">왜 런온인가</span>
          <h2>매일 쏟아지는 강의에 지쳤다면,<br />이제는 꼭 필요한 것만.</h2>
          <p>좋은 강의 100개를 찾아 헤매는 시간 대신, 검증된 강의 1개로 시작하세요.</p>
        </div>
        <div className="vp-grid">
          {items.map((it) => (
            <div className="vp-card" key={it.title}>
              <div className="vp-icon">{it.icon}</div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
              <span className="vp-foot">{it.foot}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const cats: Array<{ tone: string; count: string; title: React.ReactNode; sub: string; subColor?: string }> = [
    { tone: 'cat-blue', count: '42 강의', title: '디자인', sub: 'UX · UI · 브랜드 · 그래픽', subColor: 'rgba(255,255,255,0.85)' },
    { tone: 'cat-ink', count: '38 강의', title: '개발', sub: '프론트 · 백엔드 · 데이터' },
    { tone: 'cat-mint', count: '24 강의', title: <>프로덕트<br />매니지먼트</>, sub: '기획 · 전략 · 리서치' },
    { tone: 'cat-peach', count: '31 강의', title: <>마케팅<br />그로스</>, sub: '퍼포먼스 · 브랜드 · CRM' },
    { tone: 'cat-cream', count: '18 강의', title: '비즈니스', sub: '창업 · 파이낸스 · 운영' },
    { tone: 'cat-sky', count: '22 강의', title: <>글쓰기<br />커뮤니케이션</>, sub: '기획서 · 카피 · 발표' },
    { tone: 'cat-ink2', count: '14 강의', title: <>영상<br />모션</>, sub: '편집 · 모션 · 컬러' },
    { tone: 'cat-strong', count: '16 강의', title: <>생산성<br />커리어</>, sub: '노션 · AI도구 · 이직', subColor: 'var(--color-muted)' },
  ];
  return (
    <section className="cats" id="categories">
      <div className="container">
        <div className="section-head">
          <span className="label">강의 카테고리</span>
          <h2>처음부터 끝까지, 일에 필요한 거의 모든 것.</h2>
          <p>12개 카테고리, 200+ 강의가 정식 오픈일에 함께 공개됩니다.</p>
        </div>
        <div className="cat-grid">
          {cats.map((c, i) => (
            <a href="#" key={i} className={`cat ${c.tone}`} onClick={(e) => e.preventDefault()}>
              <div className="cat-count">{c.count}</div>
              <div>
                <div className="cat-title">{c.title}</div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4, color: c.subColor }}>{c.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instructors() {
  const items = [
    { name: '박지윤', role: '前 토스 시니어 디자이너 · 12년차', initial: '박', tag: '디자인', tone: '', stats: { count: 3, rating: '4.9' } },
    { name: '이정환', role: '前 우아한형제들 백엔드 · 9년차', initial: '이', tag: '개발', tone: 'p2', stats: { count: 4, rating: '4.8' } },
    { name: '김민서', role: '前 카카오 PM · 8년차', initial: '김', tag: 'PM', tone: 'p3', stats: { count: 2, rating: '5.0' } },
    { name: '정수아', role: '前 쿠팡 그로스 리드 · 10년차', initial: '정', tag: '마케팅', tone: 'p4', stats: { count: 3, rating: '4.9' } },
  ];
  return (
    <section className="ins" id="instructors">
      <div className="container">
        <div className="section-head">
          <span className="label">강사진</span>
          <h2>현장의 베스트가, 어제까지 쓰던 방식으로.</h2>
          <p>업계 평균 8.4년의 실무자 60+ 명. 책에서 배운 게 아니라 일에서 배운 것만 전해드려요.</p>
        </div>
        <div className="ins-grid">
          {items.map((it) => (
            <div className="ins-card" key={it.name}>
              <div className={`ins-photo ${it.tone}`}>
                {it.initial}
                <span className="tag">{it.tag}</span>
              </div>
              <div>
                <div className="ins-name">{it.name}</div>
                <div className="ins-role">{it.role}</div>
              </div>
              <div className="ins-stats">
                <span><b>{it.stats.count}</b> 강의</span>
                <span><b>{it.stats.rating}</b> 평점</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="#" className="btn btn-outline-light" onClick={(e) => e.preventDefault()}>강사 60+ 명 모두 보기</a>
        </div>
      </div>
    </section>
  );
}

function FeaturedCourses() {
  const courses = [
    { tone: 't1', chip: '디자인', title: '실무로 배우는 브랜드 시스템', sub: '박지윤 · 12강 · 4시간 30분', rating: '4.9', reviews: 248, price: 66750, original: 89000 },
    { tone: 't2', chip: '개발', title: '현업자가 만든 백엔드 설계', sub: '이정환 · 18강 · 7시간 10분', rating: '4.8', reviews: 412, price: 96750, original: 129000 },
    { tone: 't3', chip: 'PM', title: '데이터 기반의 제품 결정', sub: '김민서 · 10강 · 3시간 50분', rating: '5.0', reviews: 186, price: 59250, original: 79000 },
    { tone: 't4', chip: '마케팅', title: '퍼포먼스 마케팅 A부터 Z까지', sub: '정수아 · 16강 · 6시간 20분', rating: '4.9', reviews: 321, price: 89250, original: 119000 },
    { tone: 't5', chip: '생산성', title: 'AI 도구로 일하는 법', sub: '최유진 · 8강 · 2시간 50분', rating: '4.7', reviews: 154, price: 44250, original: 59000 },
    { tone: 't6', chip: '글쓰기', title: '잘 읽히는 기획서 쓰는 법', sub: '한지연 · 9강 · 3시간 10분', rating: '4.9', reviews: 208, price: 51750, original: 69000 },
  ];
  const fmt = (n: number) => `₩${n.toLocaleString('ko-KR')}`;
  return (
    <section className="feat" id="courses">
      <div className="container">
        <div className="section-head center">
          <span className="label">에디터스 픽</span>
          <h2>오픈 첫 주, 이 강의부터 시작해 보세요.</h2>
          <p>에디터가 직접 듣고 추천하는 베스트 6개 강의. 사전예약자에게는 첫 강의 25% 할인 코드가 함께 발송됩니다.</p>
        </div>
        <div className="feat-grid">
          {courses.map((c) => (
            <article className="feat-card" key={c.title}>
              <div className={`feat-thumb ${c.tone}`}>
                <span className="chip">{c.chip}</span>
                <span className="play">
                  <svg width="16" height="16" viewBox="0 0 14 14"><path d="M3 1.5l9 5.5-9 5.5z" fill="currentColor" /></svg>
                </span>
              </div>
              <div className="feat-body">
                <div className="ftitle">{c.title}</div>
                <div className="fsub">{c.sub}</div>
                <div className="feat-foot">
                  <div className="feat-rating">
                    <span className="star">★</span> {c.rating} <span style={{ color: 'var(--color-on-dark-soft)' }}>({c.reviews})</span>
                  </div>
                  <div className="feat-price"><s>{fmt(c.original)}</s>{fmt(c.price)}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="feat-cta-wrap">
          <a href="#final-cta" className="btn btn-outline-dark" style={{ height: 48, fontSize: 15 }}>사전예약하고 전체 강의 보기</a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="trust">
      <div className="container">
        <div className="section-head">
          <span className="label">사전예약 현황</span>
          <h2>이미 12,840명이 런온을 기다리고 있어요.</h2>
        </div>
        <div className="stats-row">
          <div className="stat-block">
            <span className="label">누적 사전예약자</span>
            <div className="num"><span>12,840</span><span className="unit">명</span></div>
            <div className="delta">+1,204 어제 대비</div>
            <p className="sub">매일 늘어나고 있어요.</p>
          </div>
          <div className="stat-block">
            <span className="label">런칭 강의 수</span>
            <div className="num"><span>200</span><span className="unit">+</span></div>
            <p className="sub">12개 카테고리에서 엄선.</p>
          </div>
          <div className="stat-block">
            <span className="label">검증된 강사</span>
            <div className="num"><span>64</span><span className="unit">명</span></div>
            <p className="sub">업계 평균 8.4년 실무자.</p>
          </div>
          <div className="stat-block">
            <span className="label">베타 만족도</span>
            <div className="num"><span>4.9</span><span className="unit">/5.0</span></div>
            <p className="sub">2,481명의 평점 평균.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="how">
      <div className="container">
        <div className="section-head">
          <span className="label">이용 방법</span>
          <h2>3단계로 시작하는 런온.</h2>
          <p>이메일 한 줄이면 충분해요. 비밀번호도, 결제 정보도 지금은 필요 없습니다.</p>
        </div>
        <div className="how-grid">
          <div className="step">
            <span className="stepnum">01</span>
            <h4>이메일로 사전예약</h4>
            <p>이메일 한 줄이면 가입 완료. 지금 단계에서는 어떤 결제 정보도 받지 않습니다.</p>
            <svg className="step-art" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="22" width="60" height="40" rx="6" stroke="#5b616e" strokeWidth="1.5" />
              <path d="M10 28l30 18 30-18" stroke="#5b616e" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="step">
            <span className="stepnum">02</span>
            <h4>관심 분야 선택</h4>
            <p>관심 카테고리를 알려주시면 비공개 추천 리스트를 가장 먼저 보내드려요.</p>
            <svg className="step-art" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="12" width="26" height="26" rx="4" stroke="#5b616e" strokeWidth="1.5" />
              <rect x="44" y="12" width="26" height="26" rx="4" fill="#0052ff" />
              <rect x="10" y="46" width="26" height="26" rx="4" fill="#0052ff" />
              <rect x="44" y="46" width="26" height="26" rx="4" stroke="#5b616e" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="step accent">
            <span className="stepnum">03</span>
            <h4>오픈 당일 25% 할인</h4>
            <p>정식 오픈일, 사전예약자 전용 코드로 첫 강의를 25% 할인된 가격에 시작하세요.</p>
            <svg className="step-art" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="28" stroke="#fff" strokeWidth="1.5" />
              <path d="M28 40l8 8 16-16" stroke="#0052ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

const CHECK_Y_SVG = (
  <span className="check-y">
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </span>
);
const CHECK_N_SVG = (
  <span className="check-n">
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </span>
);

function Comparison() {
  return (
    <section className="cmp">
      <div className="cmp-wrap">
        <div className="section-head center">
          <span className="label">왜 런온인가</span>
          <h2>가볍게, 그러나 단단하게.</h2>
          <p>일반 강의 플랫폼과 런온은 무엇이 다른가요?</p>
        </div>
        <div className="cmp-table">
          <div className="cmp-row cmp-head">
            <div className="cmp-cell">기준</div>
            <div className="cmp-cell brand-col">런온</div>
            <div className="cmp-cell center">일반 강의 플랫폼</div>
          </div>
          <div className="cmp-row">
            <div className="cmp-cell feat-name">강의 큐레이션</div>
            <div className="cmp-cell brand-col">
              {CHECK_Y_SVG}
              <div className="cmp-val" style={{ marginTop: 6, color: 'var(--color-body)' }}>에디터 검수 통과 강의만</div>
            </div>
            <div className="cmp-cell center">
              {CHECK_N_SVG}
              <div className="cmp-val" style={{ marginTop: 6 }}>누구나 업로드</div>
            </div>
          </div>
          <div className="cmp-row">
            <div className="cmp-cell feat-name">강사 실무 경력</div>
            <div className="cmp-cell brand-col">
              <span className="cmp-val" style={{ color: 'var(--color-ink)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>평균 8.4년</span>
            </div>
            <div className="cmp-cell center"><span className="cmp-val">제한 없음</span></div>
          </div>
          <div className="cmp-row">
            <div className="cmp-cell feat-name">평생 소장</div>
            <div className="cmp-cell brand-col">{CHECK_Y_SVG}</div>
            <div className="cmp-cell center"><span className="cmp-val">구독 종료 시 접근 불가</span></div>
          </div>
          <div className="cmp-row">
            <div className="cmp-cell feat-name">강의 업데이트</div>
            <div className="cmp-cell brand-col">
              <span className="cmp-val" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>무료 평생 업데이트</span>
            </div>
            <div className="cmp-cell center"><span className="cmp-val">신규 버전 별도 결제</span></div>
          </div>
          <div className="cmp-row">
            <div className="cmp-cell feat-name">학습 자료 · 코드</div>
            <div className="cmp-cell brand-col">
              {CHECK_Y_SVG}
              <div className="cmp-val" style={{ marginTop: 6, color: 'var(--color-body)' }}>전 강의 제공</div>
            </div>
            <div className="cmp-cell center"><span className="cmp-val">강의별 상이</span></div>
          </div>
          <div className="cmp-row">
            <div className="cmp-cell feat-name">환불 정책</div>
            <div className="cmp-cell brand-col">
              <span className="cmp-val" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>7일 · 20% 미수강</span>
            </div>
            <div className="cmp-cell center"><span className="cmp-val">통상 24시간 이내</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { avatarCls: 'a1', avatarChar: '김', body: '"강의 고르는 데만 일주일씩 걸리던 게 한 시간이면 끝났어요. 큐레이션이 진짜 다릅니다."', name: '김민서', meta: '프로덕트 디자이너 · 베타 사용자' },
    { avatarCls: 'a2', avatarChar: '이', body: '"강사가 어제까지 쓰던 도구로 가르치는 느낌. 책에서 배운 게 아니라 일에서 배운 거예요."', name: '이정환', meta: '백엔드 엔지니어 · 베타 사용자' },
    { avatarCls: 'a3', avatarChar: '박', body: '"평생 소장이 진짜 의미가 있더라고요. 6개월 뒤 강의가 업데이트됐는데 추가 결제 없이 그냥 받았어요."', name: '박지윤', meta: '콘텐츠 마케터 · 베타 사용자' },
    { avatarCls: 'a4', avatarChar: '정', body: '"광고로 도배된 다른 사이트와 달라요. 들어가면 진짜 강의가 보이고, 다른 잡음이 없어요."', name: '정수아', meta: '그로스 매니저 · 베타 사용자' },
    { avatarCls: 'a5', avatarChar: '최', body: '"3년차 주니어인데 시니어가 옆에서 일을 보여주는 것 같았어요. 코드 리뷰 챕터가 특히 좋았습니다."', name: '최유진', meta: '프론트엔드 개발자 · 베타 사용자' },
    { avatarCls: 'a6', avatarChar: '한', body: '"환불 안 받았어요. 한 강의를 다 보고 나니까 다음 강의가 자연스럽게 보이더라고요."', name: '한지연', meta: '기획자 · 베타 사용자' },
  ];
  return (
    <section className="testi" id="testimonials">
      <div className="container">
        <div className="section-head">
          <span className="label">베타 사용자 후기</span>
          <h2>먼저 써본 분들이 남긴 한 줄.</h2>
          <p>2,481명의 베타 사용자 평균 평점 4.9/5.0. 그중 몇 줄을 소개해요.</p>
        </div>
        <div className="reviews">
          {reviews.map((r) => (
            <div className="review" key={r.name}>
              <div className="stars">★★★★★</div>
              <blockquote>{r.body}</blockquote>
              <div className="who">
                <div className={`avatar ${r.avatarCls}`}>{r.avatarChar}</div>
                <div>
                  <div className="name">{r.name}</div>
                  <div className="meta">{r.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: '사전예약을 하면 정말 무료인가요?', a: '네, 사전예약은 무료입니다. 결제 정보는 정식 오픈일에 강의를 직접 구매하실 때만 받습니다. 사전예약만 하고 강의를 구매하지 않으셔도 어떠한 비용도 청구되지 않아요.' },
  { q: '정식 오픈은 언제인가요?', a: '2026년 6월 17일 정식 오픈 예정입니다. 사전예약자에게는 오픈 24시간 전 이메일로 우선 입장 링크와 25% 할인 코드를 발송해드려요.' },
  { q: '25% 할인은 어떤 강의에 적용되나요?', a: '정식 오픈일에 공개되는 200여 개 강의 중 처음 구매하시는 한 개 강의에 적용됩니다. 신규 강의를 포함한 전 카테고리에서 자유롭게 선택하실 수 있어요. 할인 코드는 오픈 후 7일간 유효합니다.' },
  { q: '강의는 평생 소장이라고 하셨는데, 정말 평생인가요?', a: '네, 한 번 구매한 강의는 계정이 유지되는 한 무기한 다시 보실 수 있습니다. 강사가 콘텐츠를 업데이트해도 추가 결제 없이 새 버전이 라이브러리에 자동으로 추가됩니다.' },
  { q: '환불 정책은 어떻게 되나요?', a: '구매 후 7일 이내, 강의 진도율 20% 미만인 경우 100% 환불해드립니다. 사전예약 단계에서는 결제가 발생하지 않으므로 환불 대상이 아닙니다.' },
  { q: '모바일에서도 들을 수 있나요?', a: '웹 · iOS · Android 모두 지원합니다. 정식 오픈과 동시에 iOS와 Android 앱이 함께 공개되며, 어디서든 이어듣기가 가능합니다.' },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq-section" id="faq">
      <div className="faq-wrap">
        <div className="faq-head">
          <span className="label">자주 묻는 질문</span>
          <h2 style={{ marginTop: 12 }}>궁금증을 미리 풀어드릴게요.</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div className={`faq ${open === i ? 'open' : ''}`} key={i}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{f.q}</span>
                <span className="qcaret">
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </span>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const [time, setTime] = useState('06일 23:59:59');

  useEffect(() => {
    const STORAGE_KEY = 'lp_cd_end';
    let end = 0;
    try {
      end = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    } catch {
      end = 0;
    }
    if (!end || end < Date.now()) {
      end = Date.now() + 7 * 24 * 60 * 60 * 1000;
      try { localStorage.setItem(STORAGE_KEY, String(end)); } catch {/* noop */}
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${pad(d)}일 ${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="final-cta" id="final-cta">
      <div className="final-cta-inner">
        <span className="eyebrow"><span className="pulse" />사전예약 마감까지</span>
        <h2 style={{ marginTop: 24 }}>
          지금 줄을 서고,<br />오픈 당일 25% 할인으로 시작하세요.
        </h2>
        <p className="lead lead-on-dark">
          이메일 한 줄이면 충분해요. 정식 오픈일에 가장 먼저 입장 링크를 보내드릴게요.
        </p>
        <div className="countdown">
          <span className="cd-label">남은 시간</span>
          <span className="cd-time">{time}</span>
        </div>
        <SignupForm formKey="cta" />
        <div className="form-micro">
          <span><span className="check">✓</span> 무료</span>
          <span><span className="check">✓</span> 30초</span>
          <span><span className="check">✓</span> 스팸 없음</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { h: '서비스', items: [['왜 런온인가', '#why'], ['카테고리', '#categories'], ['강사진', '#instructors'], ['추천 강의', '#courses']] as Array<[string, string]> },
    { h: '회사', items: [['회사 소개', '#'], ['채용', '#'], ['보도자료', '#'], ['크리에이터 모집', '#']] as Array<[string, string]> },
    { h: '고객지원', items: [['자주 묻는 질문', '#faq'], ['고객센터', '#'], ['공지사항', '#'], ['support@learnon.kr', 'mailto:support@learnon.kr']] as Array<[string, string]> },
    { h: '정책', items: [['이용약관', '#'], ['개인정보처리방침', '#'], ['환불 정책', '#'], ['쿠키 설정', '#']] as Array<[string, string]> },
  ];
  return (
    <footer className="lp-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark inkOnLight />
            <p>필요한 강의만 골라 듣는 큐레이션 학습 플랫폼. 매일의 배움을 가볍게.</p>
            <div className="footer-social">
              <a href="#" aria-label="X"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.5 2h2.6L8.9 6.8 14 14H10l-3.4-4.4L2.7 14H.1l4.6-5.2L0 2h4.2l3 4 3.3-4z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="2" width="12" height="12" rx="3" /><circle cx="8" cy="8" r="2.6" /><circle cx="11.5" cy="4.5" r="0.6" fill="currentColor" /></svg></a>
              <a href="#" aria-label="YouTube"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14 4.5c-.2-.7-.7-1.2-1.4-1.4C11.5 3 8 3 8 3s-3.5 0-4.6.1c-.7.2-1.2.7-1.4 1.4C2 5.5 2 8 2 8s0 2.5.1 3.5c.2.7.7 1.2 1.4 1.4 1.1.1 4.6.1 4.6.1s3.5 0 4.6-.1c.7-.2 1.2-.7 1.4-1.4.1-1 .1-3.5.1-3.5s0-2.5-.1-3.5zM6.6 10.2V5.8L10.4 8l-3.8 2.2z" /></svg></a>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.h} className="footer-col">
              <h5>{col.h}</h5>
              <ul>
                {col.items.map(([label, href]) => (
                  <li key={label}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-legal">
          <div className="footer-biz">
            (주)런온 · 대표 김현우 · 사업자등록번호 123-45-67890 · 통신판매업신고 2026-서울강남-01234<br />
            서울특별시 강남구 테헤란로 123, 9층 · 고객센터 1588-0000 (평일 10:00–18:00)<br />
            © 2026 LearnOn, Inc. All rights reserved.
          </div>
          <div className="footer-links">
            <a href="#">사이트맵</a>
            <a href="#">접근성</a>
          </div>
        </div>

        <div className="footer-portfolio-note">
          <span>포트폴리오용 샘플 작업입니다.</span>
          <Link href="/portfolio">← 다른 포트폴리오 보기</Link>
        </div>
      </div>
    </footer>
  );
}
