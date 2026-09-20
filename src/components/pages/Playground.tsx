import { useState, useEffect } from 'react';
import { useRulesQuery } from '../../services/rules.service';
import { useMaskMutation } from "../../services/mask.service";
import type { RuleId } from '../../types/common.types';

export default function Playground() {
  const [inputText, setInputText] = useState('');
  const [selectedRules, setSelectedRules] = useState<RuleId[]>([]);

  const { data: rulesData, isLoading: isRulesLoading } = useRulesQuery();
  const maskMutation = useMaskMutation();

  useEffect(() => {
    if (rulesData?.rules) {
      setSelectedRules(rulesData.rules.map((rule) => rule.id));
    }
  }, [rulesData]);

  const handleToggleRule = (id: RuleId) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleMask = () => {
    if (!inputText.trim()) return;
    maskMutation.mutate({
      text: inputText,
      enabled_rules: selectedRules,
      include_matches: true,
    });
  };

  return (
    <div className="py-8 min-h-[calc(100vh-5rem)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight drop-shadow-sm">
          ระบบเซ็นเซอร์ข้อมูลลูกค้าเพื่อความปลอดภัย
        </h1>
        <p className="mt-3 text-lg text-slate-400 font-medium">
          ทดสอบการทำงานของ Regular Expression ในการทำ Data Masking สำหรับ PDPA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 pb-8">
        
        <div className="lg:col-span-5 flex flex-col gap-8 h-full">
          
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col flex-1">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">1</span>
              ป้อนข้อความต้นฉบับ
            </h2>
            <textarea
              className="flex-1 w-full p-5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none font-mono text-sm text-slate-700 leading-relaxed transition-all custom-scrollbar"
              placeholder="วาง Log ของระบบธนาคาร หรือข้อความที่มีข้อมูลส่วนบุคคลที่นี่..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">2</span>
              เลือกข้อมูลที่ต้องการเซ็นเซอร์
            </h2>
            
            {isRulesLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-2xl w-full"></div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {rulesData?.rules.map((rule) => (
                  <label 
                    key={rule.id} 
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-200 group"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer transition-colors"
                      checked={selectedRules.includes(rule.id)}
                      onChange={() => handleToggleRule(rule.id)}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                        {rule.label_th}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {rule.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            <button
              onClick={handleMask}
              disabled={maskMutation.isPending || !inputText.trim()}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex justify-center items-center gap-3"
            >
              {maskMutation.isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  กำลังประมวลผล...
                </>
              ) : 'เริ่มการเซ็นเซอร์ข้อมูล'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 h-full flex flex-col">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col w-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              ผลลัพธ์การเซ็นเซอร์
            </h2>
            
            <div className="flex-1 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 font-mono text-base whitespace-pre-wrap text-slate-700 leading-relaxed shadow-inner overflow-auto">
              {maskMutation.data ? (
                maskMutation.data.masked_text
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 italic">
                  ผลลัพธ์จะแสดงที่นี่...
                </div>
              )}
            </div>

            {maskMutation.data?.summary && maskMutation.data.summary.total > 0 && (
              <div className="mt-6 p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-3 text-lg">
                  <span className="bg-indigo-600 text-white py-1 px-3 rounded-lg text-sm shadow-sm">
                    {maskMutation.data.summary.total}
                  </span>
                  ตรวจพบข้อมูล PII ทั้งหมด
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  {Object.entries(maskMutation.data.summary.by_type).map(([key, count]) => {
                    const ruleLabel = rulesData?.rules.find(r => r.id === key)?.label_th || key;
                    return (
                      <div key={key} className="flex items-center gap-3 text-sm text-indigo-900 bg-white/60 p-2.5 rounded-xl border border-indigo-50 transition-colors hover:bg-white">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                        <span className="font-semibold flex-1">{ruleLabel}</span> 
                        <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md font-bold">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-indigo-200/50 text-sm text-indigo-500/80 text-right font-medium">
                  ใช้เวลาประมวลผล {maskMutation.data.processing_time_ms.toFixed(2)} ms
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}