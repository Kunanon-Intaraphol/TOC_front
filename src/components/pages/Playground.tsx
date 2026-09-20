import { useState, useEffect } from 'react';
import { useRulesQuery } from '../../services/rules.service';
import { useMaskMutation } from "../../services/mask.service";
import type { RuleId } from '../../types/common.types';

const SAMPLES = {
  bank: `[2025-05-18 14:32:05] [PAYMENT-GATEWAY] INFO:
Customer transaction processed successfully.
- Account Holder: Somchai Prasert
- Thai ID: 1-1004-99283-44-1
- Card Number: 4129-8837-1928-8921
- Contact Tel: 089-123-4567
- Email Address: somchai.dev@scb-digital.co.th
- Date of Birth: 14/09/2535
- Address: 128/45 Moo 5 Sukhumvit Rd, Khlong Toei, Bangkok 10110
- Transaction Amount: 12,500.00 THB`,
  ecommerce: `ORDER #TH-90812
ผู้รับ: วราภรณ์ สุขเกษม
เบอร์ติดต่อ: 092-445-6789
อีเมล: waraporn_s@gmail.com
วันเกิด: 28/02/2541
Address: 99/142 หมู่บ้านพฤกษาวิลล์ ซอยรามคำแหง 24 กทม. 10240
เลขบัตรเครดิตชำระ: 5412-7512-3412-4432
รหัสบัตรประชาชน: 3-5012-00431-89-2`
};

const RULE_THEMES: Record<string, any> = {
  address: { icon: 'ph-map-pin text-amber-500', group: 'group-hover:text-amber-800', border: 'hover:border-amber-300 hover:bg-amber-50/30', badgeBg: 'bg-amber-100/70 text-amber-700' },
  credit_card: { icon: 'ph-credit-card text-rose-500', group: 'group-hover:text-rose-800', border: 'hover:border-rose-300 hover:bg-rose-50/30', badgeBg: 'bg-rose-100/70 text-rose-700' },
  dob: { icon: 'ph-calendar text-fuchsia-500', group: 'group-hover:text-fuchsia-800', border: 'hover:border-fuchsia-300 hover:bg-fuchsia-50/30', badgeBg: 'bg-fuchsia-100/70 text-fuchsia-700' },
  email: { icon: 'ph-envelope-simple text-emerald-500', group: 'group-hover:text-emerald-800', border: 'hover:border-emerald-300 hover:bg-emerald-50/30', badgeBg: 'bg-emerald-100/70 text-emerald-700' },
  phone: { icon: 'ph-phone-call text-blue-500', group: 'group-hover:text-blue-800', border: 'hover:border-blue-300 hover:bg-blue-50/30', badgeBg: 'bg-blue-100/70 text-blue-700' },
  default: { icon: 'ph-identification-card text-purple-600', group: 'group-hover:text-purple-800', border: 'hover:border-purple-300 hover:bg-purple-50/30', badgeBg: 'bg-purple-100/70 text-purple-700' }
};

export default function Playground() {
  const [inputText, setInputText] = useState('');
  const [selectedRules, setSelectedRules] = useState<RuleId[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  const [isAutoMode, setIsAutoMode] = useState(true);

  const { data: rulesData, isLoading: isRulesLoading } = useRulesQuery();
  const maskMutation = useMaskMutation();

  useEffect(() => {
    if (rulesData?.rules) {
      setSelectedRules(rulesData.rules.map((rule) => rule.id));
    }
  }, [rulesData]);

  useEffect(() => {
    if (!isAutoMode || !inputText.trim()) return;

    const debounceTimer = setTimeout(() => {
      maskMutation.mutate({ text: inputText, enabled_rules: selectedRules, include_matches: true });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [inputText, selectedRules, isAutoMode]);

  const handleToggleRule = (id: RuleId) => {
    setSelectedRules((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const handleToggleAll = () => {
    if (rulesData?.rules) {
      selectedRules.length === rulesData.rules.length ? setSelectedRules([]) : setSelectedRules(rulesData.rules.map(r => r.id));
    }
  };

  const handleMask = () => {
    if (!inputText.trim()) return;
    maskMutation.mutate({ text: inputText, enabled_rules: selectedRules, include_matches: true });
  };

  const handleCopy = () => {
    if (maskMutation.data?.masked_text) {
      navigator.clipboard.writeText(maskMutation.data.masked_text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    }
  };

  return (
    <div className='min-h-[calc(100vh-4rem)] text-foreground selection:bg-indigo-500 selection:text-white flex flex-col font-sans'>
      <section className='mx-auto max-w-4xl px-4 pb-8 pt-10 text-center'>
        <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500'>
          <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
          PDPA Data Masking Engine v2.4 Active
        </div>
        <h1 className='text-3xl font-bold leading-tight tracking-tight text-heading sm:text-4xl md:text-[2.6rem]'>
          ระบบเซ็นเซอร์ข้อมูลลูกค้าเพื่อความปลอดภัย
        </h1>
        <p className='mt-2.5 text-base font-normal text-muted sm:text-lg'>
          ทดสอบการทำงานของ Regular Expression ในการทำ Data Masking สำหรับ PDPA
        </p>
      </section>

      <main className='mx-auto flex w-full max-w-[1520px] flex-grow px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-6'>
          <div className='surface-panel rounded-3xl p-6 shadow-2xl shadow-black/10 sm:p-7'>
            <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4'>
              <div className='flex items-center gap-3'>
                <div>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-base font-bold text-heading sm:text-lg'>
                      เงื่อนไขการตรวจจับและเซ็นเซอร์ข้อมูล
                    </h2>
                    <span className='rounded-full border border-indigo-200 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600'>
                      6 กฎมาตรฐาน PDPA
                    </span>
                  </div>
                  <p className='mt-0.5 text-xs text-muted'>
                    เลือกหมวดหมู่ข้อมูลส่วนบุคคล (PII) ที่ต้องการปิดบังและกำหนดรูปแบบการ Mask อัตโนมัติ
                  </p>
                </div>
              </div>

              {/* ปรับปรุงแถบเครื่องมือควบคุมด้านขวาบน */}
              <div className='flex flex-wrap items-center gap-3'>
                
                {/* สวิตช์เปิด/ปิด Auto Mode */}
                <label className='flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-1.5 transition-colors hover:border-border hover:bg-surface-3'>
                  <div className='relative flex items-center'>
                    <input 
                      type='checkbox' 
                      className='peer sr-only' 
                      checked={isAutoMode} 
                      onChange={() => setIsAutoMode(!isAutoMode)} 
                    />
                    <div className='h-4 w-7 rounded-full bg-surface-3 shadow-inner ring-1 ring-inset ring-border transition-colors peer-checked:bg-indigo-500 peer-checked:ring-indigo-500'></div>
                    <div className='absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-3'></div>
                  </div>
                  <span className='text-xs font-semibold text-foreground select-none'>Auto</span>
                </label>

                <button
                  onClick={handleToggleAll}
                  className='flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-border hover:bg-surface-3'
                >
                  <i
                    className={`ph ph-${selectedRules.length === rulesData?.rules.length ? 'x-circle text-muted' : 'check-circle text-indigo-600'}`}
                  />
                  <span>
                    {selectedRules.length === rulesData?.rules.length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}
                  </span>
                </button>
                
                <button
                  onClick={handleMask}
                  disabled={isAutoMode || maskMutation.isPending || !inputText.trim()}
                  className='flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-indigo-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100'
                >
                  {maskMutation.isPending ? (
                    <i className='ph-bold ph-spinner animate-spin text-sm text-white' />
                  ) : (
                    <i className='ph-bold ph-lightning text-sm text-amber-300' />
                  )}
                  <span>ประมวลผลทันที</span>
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-3 pt-4 md:grid-cols-2 lg:grid-cols-3'>
              {isRulesLoading ? (
                <div className='col-span-full flex h-24 items-center justify-center text-muted'>
                  กำลังโหลดกฎการเซ็นเซอร์...
                </div>
              ) : (
                rulesData?.rules.map((rule) => {
                  const theme = RULE_THEMES[rule.id] || RULE_THEMES.default;
                  return (
                    <label
                      key={rule.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface-2/70 p-3.5 shadow-sm transition-all ${theme.border}`}
                    >
                      <input
                        type='checkbox'
                        checked={selectedRules.includes(rule.id)}
                        onChange={() => handleToggleRule(rule.id)}
                        className='mt-0.5 h-4 w-4 cursor-pointer rounded border-border text-indigo-600 focus:ring-indigo-500/20'
                      />
                      <div className='flex-1 select-none'>
                        <div className='flex items-center justify-between gap-2'>
                          <span className={`flex items-center gap-1.5 text-xs font-bold text-heading transition-colors ${theme.group}`}>
                            <i className={`ph-fill ${theme.icon} text-sm`} /> {rule.label_th}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium ${theme.badgeBg}`}>
                            {rule.example_after}
                          </span>
                        </div>
                        <p className='mt-1 text-[11px] leading-snug text-muted'>{rule.description}</p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2'>
            <div className='surface-panel flex min-h-[580px] flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7'>
              <div className='flex flex-1 flex-col'>
                <div className='mb-4 flex items-center justify-between border-b border-border pb-4'>
                  <div className='flex items-center gap-2.5'>
                    <h2 className='text-base font-bold text-heading'>ป้อนข้อความต้นฉบับ</h2>
                  </div>

                  <div className='flex items-center gap-1.5'>
                    <button
                      onClick={async () => {
                        const text = await navigator.clipboard.readText();
                        setInputText(text);
                      }}
                      className='flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-500/5 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-500/10'
                    >
                      <i className='ph ph-clipboard-text text-sm' /> วางข้อความ
                    </button>
                    <button
                      onClick={() => setInputText('')}
                      className='flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground'
                    >
                      <i className='ph ph-trash text-sm' /> ล้าง
                    </button>
                  </div>
                </div>

                <div className='relative flex flex-1 flex-col'>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className='min-h-[340px] w-full flex-1 resize-none rounded-2xl border border-border bg-surface-2/80 p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted transition duration-150 focus:border-indigo-400 focus:bg-surface focus:ring-4 focus:ring-indigo-500/15'
                    placeholder='วาง Log ของระบบธนาคาร หรือข้อความที่มีข้อมูลส่วนบุคคลที่นี่...'
                  />
                </div>
              </div>

              <div className='mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3.5 text-xs'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='flex items-center gap-1 font-semibold text-muted'>
                    <i className='ph-bold ph-lightning text-sm text-amber-500' /> ตัวอย่างชุดข้อมูล:
                  </span>
                  <button
                    onClick={() => setInputText(SAMPLES.bank)}
                    className='rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-indigo-500/5 hover:text-indigo-600'
                  >
                    Log ธนาคารโอนเงิน
                  </button>
                  <button
                    onClick={() => setInputText(SAMPLES.ecommerce)}
                    className='rounded-xl border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-indigo-500/5 hover:text-indigo-600'
                  >
                    คำสั่งซื้อ E-Commerce
                  </button>
                </div>
                <span className='text-[11px] text-muted'>API Connection Active</span>
              </div>
            </div>

            <div className='surface-panel flex min-h-[580px] flex-col justify-between rounded-3xl p-6 text-foreground sm:p-7'>
              <div className='flex flex-1 flex-col'>
                <div className='mb-4 flex items-center justify-between border-b border-border pb-4'>
                  <div className='flex items-center gap-2.5'>
                    <h2 className='text-base font-bold text-heading'>ผลลัพธ์การเซ็นเซอร์</h2>
                  </div>
                  <button
                    onClick={handleCopy}
                    disabled={!maskMutation.data}
                    className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                      isCopied
                        ? 'border-emerald-200 bg-emerald-500/10 text-emerald-700'
                        : 'border-indigo-200 bg-indigo-500/5 text-indigo-600 hover:bg-indigo-500/10'
                    }`}
                  >
                    <i className={`ph-bold ${isCopied ? 'ph-check' : 'ph-copy'} text-sm`} />
                    {isCopied ? 'คัดลอกแล้ว!' : 'คัดลอกผลลัพธ์'}
                  </button>
                </div>

                <div className='relative flex flex-1 flex-col'>
                  {!maskMutation.data ? (
                    <div className='flex min-h-[340px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-2/50 p-6 text-center'>
                      <p className='text-sm font-medium text-heading'>ผลลัพธ์จะแสดงที่นี่ . . .</p>
                      <p className='mt-1 max-w-xs text-xs text-muted'>
                        ใส่ข้อความที่คอลัมน์ซ้ายแล้วกดปุ่ม "ประมวลผลทันที"
                      </p>
                    </div>
                  ) : (
                    <div className='flex flex-1 flex-col'>
                      <div className='min-h-[340px] flex-1 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-border bg-surface-2/80 p-5 font-mono text-[13px] leading-relaxed text-foreground select-text'>
                        {maskMutation.data.masked_text}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5 text-xs'>
                <div className='flex flex-wrap items-center gap-3'>
                  <span className='flex items-center gap-1.5 font-semibold text-heading'>
                    <i className='ph-bold ph-shield-check text-sm text-emerald-600' /> PDPA B.E. 2562 Compliant
                  </span>
                  <span className='text-border'>|</span>
                  <span className='font-medium text-foreground'>
                    ตรวจพบและปิดบัง {maskMutation.data?.summary.total || 0} จุด
                  </span>
                  <span className='text-border'>|</span>
                  <span className='font-mono text-muted'>
                    {(maskMutation.data?.processing_time_ms || 0).toFixed(2)} ms
                  </span>
                </div>
                {maskMutation.data && (
                  <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700'>
                    <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' /> Safe to export
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}