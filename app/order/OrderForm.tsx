'use client';

/**
 * 뚝딱페이지 — 제작 신청 멀티스텝 폼
 *
 * 원본: Claude Design "mainpage1/form.html" (3 step)
 * - Step 1: 톤 & 분위기 선택 (6개 옵션 중 1개)
 * - Step 2: 사업 콘텐츠 + 참고 이미지 입력
 * - Step 3: 완료 화면 (mailto 발송 후)
 *
 * 외부 vanilla JS 스크립트와 cloudflare email-decode 제거.
 * 모든 인터랙션은 useState 로 재구성.
 *
 * 파일 첨부는 mailto 한계로 불가능 → 파일명만 본문에 기재하고
 * 사용자가 메일 클라이언트에서 직접 첨부하도록 안내.
 */

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';

type ToneValue =
  | '차분함 · 신뢰형'
  | '친근함 · 따뜻형'
  | '프리미엄 · 고급형'
  | '미니멀 · 정돈형'
  | '활기참 · 임팩트형'
  | '따뜻함 · 감성형';

type ToneOption = {
  value: ToneValue;
  vizClass: string;
  vizLabel: string;
  vizLabelStyle?: React.CSSProperties;
  name: string;
  desc: string;
};

const TONE_OPTIONS: ToneOption[] = [
  {
    value: '차분함 · 신뢰형',
    vizClass: 'tone-viz-calm',
    vizLabel: '차분함',
    name: '차분함 · 신뢰형',
    desc: '컨설팅, 세무·법무, 의료, B2B',
  },
  {
    value: '친근함 · 따뜻형',
    vizClass: 'tone-viz-friend',
    vizLabel: '친근함',
    name: '친근함 · 따뜻형',
    desc: '동네 가게, 헬스·요가, 1:1 코칭',
  },
  {
    value: '프리미엄 · 고급형',
    vizClass: 'tone-viz-premium',
    vizLabel: '프리미엄',
    vizLabelStyle: { color: 'var(--color-air-blue)' },
    name: '프리미엄 · 고급형',
    desc: '고가 강의, 럭셔리 상품, 작가',
  },
  {
    value: '미니멀 · 정돈형',
    vizClass: 'tone-viz-minimal',
    vizLabel: '미니멀',
    name: '미니멀 · 정돈형',
    desc: '디자이너, 개발자, 크리에이터',
  },
  {
    value: '활기참 · 임팩트형',
    vizClass: 'tone-viz-bold',
    vizLabel: '활기참',
    name: '활기참 · 임팩트형',
    desc: '이벤트, 신제품 런칭, MZ 타깃',
  },
  {
    value: '따뜻함 · 감성형',
    vizClass: 'tone-viz-warm',
    vizLabel: '따뜻함',
    name: '따뜻함 · 감성형',
    desc: '에세이, 베이커리, 카페, 공방',
  },
];

type FieldKey =
  | 'bizName'
  | 'bizType'
  | 'bizTagline'
  | 'bizDesc'
  | 'bizRef'
  | 'bizKakao'
  | 'bizEmail';

type FormState = {
  tone: ToneValue | null;
  bizName: string;
  bizType: string;
  bizTagline: string;
  bizDesc: string;
  bizRef: string;
  bizKakao: string;
  bizEmail: string;
};

const INITIAL_STATE: FormState = {
  tone: null,
  bizName: '',
  bizType: '',
  bizTagline: '',
  bizDesc: '',
  bizRef: '',
  bizKakao: '',
  bizEmail: '',
};

const REQUIRED_FIELDS: FieldKey[] = ['bizName', 'bizTagline', 'bizDesc', 'bizKakao'];

const SCOPED_CSS = `
.ddpage-order { background: var(--color-soft-gray-fill); }

.ddpage-order .form-shell {
  max-width: 920px;
  margin: 0 auto;
  padding: 60px 24px 120px;
}

.ddpage-order .form-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 36px;
}
.ddpage-order .form-progress__step {
  display: flex; align-items: center; gap: 10px;
}
.ddpage-order .form-progress__dot {
  width: 28px; height: 28px;
  background: #fff;
  border: 1.5px solid var(--color-cloud-mist);
  color: var(--fg-3);
  border-radius: 50%;
  display: grid; place-items: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 13px;
  flex: none;
  transition: all .2s var(--ease-out-soft);
}
.ddpage-order .form-progress__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--fg-3);
  letter-spacing: -.02em;
  white-space: nowrap;
}
.ddpage-order .form-progress__bar {
  height: 2px;
  flex: 1;
  background: var(--color-cloud-mist);
  border-radius: 200px;
  overflow: hidden;
  position: relative;
}
.ddpage-order .form-progress__bar::after {
  content: ""; position: absolute; inset: 0; right: 100%;
  background: var(--color-action-violet);
  transition: right .3s var(--ease-out-soft);
}
.ddpage-order .form-progress__step.is-active .form-progress__dot {
  background: var(--color-action-violet);
  color: #fff;
  border-color: var(--color-action-violet);
}
.ddpage-order .form-progress__step.is-active .form-progress__label {
  color: var(--color-rich-violet);
}
.ddpage-order .form-progress__step.is-done .form-progress__dot {
  background: var(--color-rich-violet);
  color: #fff;
  border-color: var(--color-rich-violet);
}
.ddpage-order .form-progress__step.is-done + .form-progress__bar::after { right: 0; }

.ddpage-order .form-card {
  background: #fff;
  border-radius: var(--radius-3xl);
  padding: 56px 56px 64px;
  border: 1px solid var(--color-cloud-mist);
}
.ddpage-order .form-card__head { margin-bottom: 36px; }
.ddpage-order .form-card__eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-action-violet);
  letter-spacing: 0;
  margin-bottom: 12px;
}
.ddpage-order .form-card__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.2;
  letter-spacing: -.03em;
  color: var(--color-rich-violet);
  margin: 0 0 12px;
}
.ddpage-order .form-card__sub {
  font-size: 16px;
  line-height: 1.6;
  color: var(--fg-2);
  margin: 0;
  max-width: 540px;
}

.ddpage-order .tone-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.ddpage-order .tone-opt {
  background: #fff;
  border: 1.5px solid var(--color-cloud-mist);
  border-radius: 20px;
  padding: 18px 18px 20px;
  display: flex; flex-direction: column; gap: 6px;
  text-align: left;
  cursor: pointer;
  transition: all .15s var(--ease-out-soft);
  position: relative;
  overflow: hidden;
}
.ddpage-order .tone-opt:hover { border-color: var(--color-action-violet); }
.ddpage-order .tone-opt.is-on {
  border-color: var(--color-action-violet);
  background: rgba(89,46,255,.04);
}
.ddpage-order .tone-opt.is-on::after {
  content: ""; position: absolute; top: 14px; right: 14px;
  width: 22px; height: 22px;
  background: var(--color-action-violet);
  border-radius: 50%;
  background-image: linear-gradient(45deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
                    linear-gradient(-45deg, transparent 30%, #fff 30%, #fff 40%, transparent 40%);
  background-size: 11px 11px;
  background-repeat: no-repeat;
  background-position: center;
}
.ddpage-order .tone-opt__visual {
  height: 88px;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  position: relative;
}
.ddpage-order .tone-opt__name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -.03em;
  color: var(--color-rich-violet);
}
.ddpage-order .tone-opt__desc {
  font-size: 12.5px;
  color: var(--fg-3);
  line-height: 1.5;
}

.ddpage-order .field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.ddpage-order .field { display: flex; flex-direction: column; gap: 7px; }
.ddpage-order .field--full { grid-column: 1 / -1; }
.ddpage-order .field__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-rich-violet);
  letter-spacing: -.02em;
}
.ddpage-order .field__label .req { color: var(--color-action-violet); }
.ddpage-order .field__hint { font-size: 12px; color: var(--fg-3); }
.ddpage-order .field__error { font-size: 12px; color: #e15858; }
.ddpage-order .field input,
.ddpage-order .field textarea,
.ddpage-order .field select {
  font: inherit;
  font-size: 15px;
  color: var(--color-rich-violet);
  background: #fff;
  border: 1px solid var(--color-cloud-mist);
  border-radius: 12px;
  padding: 14px 16px;
  width: 100%;
  letter-spacing: -.02em;
  transition: border-color .15s var(--ease-out-soft), box-shadow .15s var(--ease-out-soft);
}
.ddpage-order .field input:focus,
.ddpage-order .field textarea:focus,
.ddpage-order .field select:focus {
  outline: none;
  border-color: var(--color-action-violet);
  box-shadow: 0 0 0 3px rgba(89,46,255,.12);
}
.ddpage-order .field textarea { min-height: 140px; resize: vertical; line-height: 1.55; }
.ddpage-order .field.has-error input,
.ddpage-order .field.has-error textarea {
  border-color: #e15858;
}

.ddpage-order .file-drop {
  background: var(--color-soft-gray-fill);
  border: 1.5px dashed var(--color-cloud-mist);
  border-radius: 14px;
  padding: 28px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color .15s var(--ease-out-soft), background .15s var(--ease-out-soft);
  display: block;
}
.ddpage-order .file-drop:hover, .ddpage-order .file-drop.is-hover {
  border-color: var(--color-action-violet);
  background: rgba(89,46,255,.04);
}
.ddpage-order .file-drop__icon {
  width: 44px; height: 44px;
  margin: 0 auto 8px;
  border-radius: 12px;
  background: #fff;
  color: var(--color-action-violet);
  display: grid; place-items: center;
}
.ddpage-order .file-drop__main {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  color: var(--color-rich-violet);
  letter-spacing: -.02em;
}
.ddpage-order .file-drop__sub {
  font-size: 12.5px;
  color: var(--fg-3);
  margin-top: 4px;
}
.ddpage-order .file-list {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-top: 10px;
}
.ddpage-order .file-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 10px 5px 12px;
  background: #fff;
  border: 1px solid var(--color-cloud-mist);
  border-radius: 200px;
  font-size: 12.5px;
  color: var(--color-rich-violet);
  letter-spacing: -.02em;
}
.ddpage-order .file-pill button {
  background: none; border: 0;
  color: var(--fg-3);
  font-size: 14px; line-height: 1;
  cursor: pointer;
  padding: 2px 4px;
}
.ddpage-order .file-pill button:hover { color: #c64a4a; }

.ddpage-order .step2-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items: flex-start;
}
.ddpage-order .summary {
  background: var(--color-soft-gray-fill);
  border-radius: 20px;
  padding: 22px 24px;
  position: sticky;
  top: 20px;
  display: flex; flex-direction: column; gap: 16px;
}
.ddpage-order .summary__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 14px;
  color: var(--color-rich-violet);
  letter-spacing: 0;
}
.ddpage-order .summary__row { display: flex; flex-direction: column; gap: 4px; padding: 0 0 12px; border-bottom: 1px solid var(--color-cloud-mist); }
.ddpage-order .summary__row:last-of-type { border-bottom: 0; padding-bottom: 0; }
.ddpage-order .summary__row .k { font-size: 11.5px; color: var(--fg-3); letter-spacing: 0; text-transform: uppercase; font-weight: 700; }
.ddpage-order .summary__row .v { font-size: 14px; color: var(--color-rich-violet); font-weight: 600; letter-spacing: -.02em; }
.ddpage-order .summary__row .v.empty { color: var(--fg-3); font-weight: 400; }
.ddpage-order .summary__row .v.hi { color: var(--color-action-violet); }

.ddpage-order .form-foot {
  margin-top: 44px;
  padding-top: 28px;
  border-top: 1px solid var(--color-cloud-mist);
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px;
}
.ddpage-order .form-foot__back {
  background: transparent; border: 0;
  color: var(--fg-3);
  font-size: 14px; font-weight: 500;
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
  letter-spacing: -.02em;
  padding: 8px 0;
}
.ddpage-order .form-foot__back:hover { color: var(--color-rich-violet); }
.ddpage-order .form-foot__back:disabled { opacity: .4; cursor: not-allowed; }
.ddpage-order .form-foot__primary { display: flex; gap: 10px; align-items: center; }
.ddpage-order .form-foot__primary .note { font-size: 12px; color: var(--fg-3); }

.ddpage-order .done {
  text-align: center;
  padding: 40px 0 20px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.ddpage-order .done__check {
  width: 88px; height: 88px;
  background: var(--color-action-violet);
  color: #fff;
  border-radius: 50%;
  display: grid; place-items: center;
  box-shadow: 0 14px 40px -10px rgba(89,46,255,.4);
}
.ddpage-order .done__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(28px, 3.4vw, 40px);
  letter-spacing: -.03em;
  color: var(--color-rich-violet);
  margin: 12px 0 0;
}
.ddpage-order .done__sub {
  font-size: 16px;
  color: var(--fg-2);
  line-height: 1.6;
  max-width: 480px;
  margin: 0;
}
.ddpage-order .done__card {
  background: var(--color-soft-gray-fill);
  border-radius: 20px;
  padding: 24px 28px;
  margin-top: 16px;
  max-width: 540px;
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: center;
}
.ddpage-order .done__icon {
  width: 48px; height: 48px;
  background: var(--color-rich-violet);
  color: var(--color-electric-green);
  border-radius: 14px;
  display: grid; place-items: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 14px;
}
.ddpage-order .done__card-text h4 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -.02em;
  color: var(--color-rich-violet);
  margin: 0 0 4px;
}
.ddpage-order .done__card-text p {
  font-size: 13.5px;
  color: var(--fg-3);
  margin: 0;
  line-height: 1.55;
}
.ddpage-order .done__btns { display: flex; gap: 10px; margin-top: 28px; flex-wrap: wrap; justify-content: center; }

.ddpage-order .tone-viz-calm    { background: linear-gradient(135deg, #f0f4ff, #c5d2ff); }
.ddpage-order .tone-viz-friend  { background: linear-gradient(135deg, #ffe9d4, #ffaae6); }
.ddpage-order .tone-viz-premium { background: linear-gradient(135deg, #21164c, #592eff); }
.ddpage-order .tone-viz-minimal { background: linear-gradient(135deg, #fafaf7, #e0e0db); border: 1px solid var(--color-cloud-mist); }
.ddpage-order .tone-viz-bold    { background: linear-gradient(135deg, #dfff9d, #a2ea13); }
.ddpage-order .tone-viz-warm    { background: linear-gradient(135deg, #fff4e0, #ffd6a5); }

.ddpage-order .tone-viz {
  width: 100%; height: 100%;
  display: flex; align-items: flex-end; padding: 12px;
}
.ddpage-order .tone-viz__type {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -.04em;
  color: var(--color-rich-violet);
  line-height: 1;
}

@media (max-width: 880px) {
  .ddpage-order .form-card { padding: 40px 28px; }
  .ddpage-order .tone-grid { grid-template-columns: repeat(2, 1fr); }
  .ddpage-order .step2-grid { grid-template-columns: 1fr; }
  .ddpage-order .summary { position: static; }
  .ddpage-order .field-grid { grid-template-columns: 1fr; }
  .ddpage-order .form-progress__label { display: none; }
}
@media (max-width: 560px) {
  .ddpage-order .tone-grid { grid-template-columns: 1fr; }
  .ddpage-order .form-shell { padding: 30px 16px 80px; }
}
`;

export default function OrderForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = (key: FieldKey, value: string) => {
    setState((s) => ({ ...s, [key]: value }));
    if (errors[key]) {
      setErrors((e) => ({ ...e, [key]: false }));
    }
  };

  const selectTone = (tone: ToneValue) => {
    setState((s) => ({ ...s, tone }));
  };

  const goNextFromStep1 = () => {
    if (!state.tone) return;
    setStep(2);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleFilesAdded = (added: File[]) => {
    const imageOnly = added.filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...imageOnly]);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesAdded(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer?.files) {
      handleFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = () => {
    const nextErrors: Partial<Record<FieldKey, boolean>> = {};
    let firstInvalid: FieldKey | null = null;
    REQUIRED_FIELDS.forEach((key) => {
      if (!state[key].trim()) {
        nextErrors[key] = true;
        if (!firstInvalid) firstInvalid = key;
      }
    });
    setErrors(nextErrors);
    if (firstInvalid) {
      if (typeof document !== 'undefined') {
        const el = document.getElementById(firstInvalid);
        el?.focus();
      }
      return;
    }

    const subject = `[뚝딱페이지 신청] ${state.bizName}`;
    const fileLines = files.length
      ? files.map((f) => `  - ${f.name}`).join('\n')
      : '  (첨부 없음)';
    const lines = [
      `상호 / 브랜드명: ${state.bizName}`,
      `사업 분야: ${state.bizType || '(미입력)'}`,
      `한 줄 소개: ${state.bizTagline}`,
      ``,
      `사업 설명:`,
      state.bizDesc,
      ``,
      `참고 사이트 URL · 색상 키워드: ${state.bizRef || '(미입력)'}`,
      `카카오톡 ID: ${state.bizKakao}`,
      `이메일: ${state.bizEmail || '(미입력)'}`,
      `톤 & 분위기: ${state.tone ?? '(미선택)'}`,
      ``,
      `참고 이미지 파일 목록:`,
      fileLines,
      ``,
      `* 참고 이미지는 이 메일에 직접 첨부해 주세요. (mailto 한계로 자동 첨부가 불가합니다.)`,
    ];
    const body = lines.join('\n');

    if (typeof window !== 'undefined') {
      const mailto = `mailto:vnfm0580@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setStep(3);
  };

  return (
    <div className="ddpage-order">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      <main className="form-shell">
        <div className="form-progress">
          <div
            className={`form-progress__step${step === 1 ? ' is-active' : ''}${step > 1 ? ' is-done' : ''}`}
            data-step="1"
          >
            <div className="form-progress__dot">1</div>
            <div className="form-progress__label">톤 &amp; 분위기</div>
          </div>
          <div className="form-progress__bar" />
          <div
            className={`form-progress__step${step === 2 ? ' is-active' : ''}${step > 2 ? ' is-done' : ''}`}
            data-step="2"
          >
            <div className="form-progress__dot">2</div>
            <div className="form-progress__label">콘텐츠 + 참고 이미지</div>
          </div>
          <div className="form-progress__bar" />
          <div
            className={`form-progress__step${step === 3 ? ' is-active is-done' : ''}`}
            data-step="3"
          >
            <div className="form-progress__dot">3</div>
            <div className="form-progress__label">1시간 내 시안 도착</div>
          </div>
        </div>

        <div className="form-card">
          {step === 1 && (
            <section className="step is-on" data-step="1">
              <div className="form-card__head">
                <span className="form-card__eyebrow">STEP 1 / 2</span>
                <h1 className="form-card__title">
                  어떤 톤이<br />당신 사업에 어울리나요?
                </h1>
                <p className="form-card__sub">
                  시안 디자인의 전체 분위기를 결정합니다. 가장 가까운 것 하나만 골라주세요.
                </p>
              </div>

              <div className="tone-grid">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`tone-opt${state.tone === opt.value ? ' is-on' : ''}`}
                    onClick={() => selectTone(opt.value)}
                  >
                    <div className={`tone-opt__visual ${opt.vizClass}`}>
                      <div className="tone-viz">
                        <span className="tone-viz__type" style={opt.vizLabelStyle}>
                          {opt.vizLabel}
                        </span>
                      </div>
                    </div>
                    <div className="tone-opt__name">{opt.name}</div>
                    <div className="tone-opt__desc">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="form-foot">
                <button className="form-foot__back" type="button" disabled>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  이전
                </button>
                <div className="form-foot__primary">
                  <span className="note">평균 작성 시간 30초</span>
                  <button
                    type="button"
                    className="btn btn--primary btn--lg"
                    disabled={!state.tone}
                    onClick={goNextFromStep1}
                  >
                    다음 단계
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="step is-on" data-step="2">
              <div className="form-card__head">
                <span className="form-card__eyebrow">STEP 2 / 2</span>
                <h1 className="form-card__title">
                  사업 콘텐츠 +<br />참고 이미지를 보내주세요.
                </h1>
                <p className="form-card__sub">
                  있는 그대로 보내주시면 됩니다. 정리는 저희가 해드릴게요. 참고하고 싶은 이미지·사이트가 있다면 같이 첨부해주세요.
                </p>
              </div>

              <div className="step2-grid">
                <div className="field-grid">
                  <div className={`field${errors.bizName ? ' has-error' : ''}`}>
                    <label className="field__label" htmlFor="bizName">
                      상호 / 브랜드명 <span className="req">*</span>
                    </label>
                    <input
                      id="bizName"
                      type="text"
                      placeholder="예: 햇살요가스튜디오"
                      value={state.bizName}
                      onChange={(e) => updateField('bizName', e.target.value)}
                      autoComplete="off"
                    />
                    {errors.bizName && <span className="field__error">필수 항목입니다.</span>}
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="bizType">사업 분야</label>
                    <input
                      id="bizType"
                      type="text"
                      placeholder="예: 요가 스튜디오, SaaS, 베이커리"
                      value={state.bizType}
                      onChange={(e) => updateField('bizType', e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div className={`field field--full${errors.bizTagline ? ' has-error' : ''}`}>
                    <label className="field__label" htmlFor="bizTagline">
                      한 줄 소개 <span className="req">*</span>
                    </label>
                    <input
                      id="bizTagline"
                      type="text"
                      placeholder="예: 매일 30분, 흔들리지 않는 몸을 만드는 곳"
                      value={state.bizTagline}
                      onChange={(e) => updateField('bizTagline', e.target.value)}
                      autoComplete="off"
                    />
                    <span className="field__hint">사이트 메인 헤드라인의 기초가 됩니다.</span>
                    {errors.bizTagline && <span className="field__error">필수 항목입니다.</span>}
                  </div>
                  <div className={`field field--full${errors.bizDesc ? ' has-error' : ''}`}>
                    <label className="field__label" htmlFor="bizDesc">
                      사업 설명 <span className="req">*</span>
                    </label>
                    <textarea
                      id="bizDesc"
                      placeholder="제공하는 서비스/상품, 가격, 차별점 — 자유롭게 적어주세요. 정돈 안 해도 괜찮습니다."
                      value={state.bizDesc}
                      onChange={(e) => updateField('bizDesc', e.target.value)}
                    />
                    {errors.bizDesc && <span className="field__error">필수 항목입니다.</span>}
                  </div>

                  <div className="field field--full">
                    <label className="field__label">참고 이미지 / 참고 사이트 (선택)</label>
                    <label
                      className={`file-drop${isDragOver ? ' is-hover' : ''}`}
                      onDragEnter={onDragEnter}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      <div className="file-drop__icon">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div className="file-drop__main">참고 이미지를 끌어다 놓거나 클릭해서 선택</div>
                      <div className="file-drop__sub">JPG, PNG, GIF · 최대 10MB · 여러 장 가능</div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={onFileInputChange}
                      />
                    </label>
                    {files.length > 0 && (
                      <div className="file-list">
                        {files.map((f, i) => (
                          <div className="file-pill" key={`${f.name}-${i}`}>
                            <span>📎 {f.name}</span>
                            <button
                              type="button"
                              aria-label="제거"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile(i);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <span className="field__hint">
                      참고용 파일명만 신청 본문에 기재됩니다. 파일 자체는 신청 후 열리는 메일에 직접 첨부해 주세요.
                    </span>
                  </div>

                  <div className="field field--full">
                    <label className="field__label" htmlFor="bizRef">
                      참고 사이트 URL · 색상 키워드 (선택)
                    </label>
                    <input
                      id="bizRef"
                      type="text"
                      placeholder="예: 파스텔 톤, 차분한 베이지, https://example.com"
                      value={state.bizRef}
                      onChange={(e) => updateField('bizRef', e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className={`field${errors.bizKakao ? ' has-error' : ''}`}>
                    <label className="field__label" htmlFor="bizKakao">
                      카카오톡 ID <span className="req">*</span>
                    </label>
                    <input
                      id="bizKakao"
                      type="text"
                      placeholder="@yourID"
                      value={state.bizKakao}
                      onChange={(e) => updateField('bizKakao', e.target.value)}
                      autoComplete="off"
                    />
                    <span className="field__hint">시안 전달 및 수정 소통 용도</span>
                    {errors.bizKakao && <span className="field__error">필수 항목입니다.</span>}
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="bizEmail">이메일</label>
                    <input
                      id="bizEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={state.bizEmail}
                      onChange={(e) => updateField('bizEmail', e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <aside className="summary">
                  <div className="summary__title">선택 요약</div>
                  <div className="summary__row">
                    <span className="k">톤 &amp; 분위기</span>
                    <span className={`v${state.tone ? '' : ' empty'}`}>
                      {state.tone ?? '아직 미선택'}
                    </span>
                  </div>
                  <div className="summary__row">
                    <span className="k">패키지</span>
                    <span className="v hi">올인원 패키지 14,900원</span>
                  </div>
                  <div className="summary__row">
                    <span className="k">예상 시안 전달</span>
                    <span className="v">신청 후 약 1시간</span>
                  </div>
                  <div className="summary__row">
                    <span className="k">결제 안내</span>
                    <span className="v">크몽 플랫폼</span>
                  </div>
                </aside>
              </div>

              <div className="form-foot">
                <button
                  className="form-foot__back"
                  type="button"
                  onClick={goBack}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  이전
                </button>
                <div className="form-foot__primary">
                  <span className="note">필수 항목 *</span>
                  <button
                    type="button"
                    className="btn btn--primary btn--lg"
                    onClick={handleSubmit}
                  >
                    제작 신청하기
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <div className="done-block is-on">
              <div className="done">
                <div className="done__check">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </div>
                <h1 className="done__title">신청이 접수되었습니다.</h1>
                <p className="done__sub">
                  메일 클라이언트가 열렸다면 참고 이미지를 첨부 후 발송해 주세요.
                  <br />
                  담당자가 곧 카톡으로 연락드리고, 결제 확인 후 약 1시간 안에 시안이 도착합니다.
                </p>

                <div className="done__card">
                  <div className="done__icon">$</div>
                  <div className="done__card-text">
                    <h4>결제는 크몽 플랫폼에서 진행됩니다</h4>
                    <p>
                      안전 거래 + 환불 정책이 보장되는 크몽 채널로 안내해 드립니다. 카톡으로 받으신 링크에서 결제해주세요.
                    </p>
                  </div>
                </div>

                <div className="done__btns">
                  <a className="btn btn--ghost btn--lg" href="/">메인으로 돌아가기</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
