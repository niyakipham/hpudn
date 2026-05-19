import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import * as htmlToImage from "html-to-image";

const QR_URL = "https://www.facebook.com/niyakipham.off";
const NEXT_LOGO_URL = "/next-logo.png";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(QR_URL, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 400,
      color: { dark: "#0a0a0b", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const downloadComposite = async () => {
    if (!frameRef.current || !image) return;
    setIsDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 100));
      const dataUrl = await htmlToImage.toPng(frameRef.current, {
        backgroundColor: "#0a0a0b",
        pixelRatio: 3,
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset.html2canvasIgnore === "true") {
            return false;
          }
          return true;
        }
      });
      const link = document.createElement("a");
      link.download = `gdg-cloud-hanoi-next26-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Có lỗi khi tải xuống. Vui lòng thử lại!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-blue-600/12 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-indigo-700/12 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8 lg:py-12">
        <nav className="w-full max-w-6xl flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-full" />
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="relative">
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path d="M12 2L14.5 7.5L20 8.5L16 12.5L17 18L12 15.5L7 18L8 12.5L4 8.5L9.5 7.5L12 2Z" fill="url(#logo-grad)" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-medium leading-none" style={{ fontFamily: "Google Sans, system-ui, sans-serif" }}>
                GDG Cloud Hanoi
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 tracking-wider uppercase">Scrapbook Studio</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-zinc-400">Next '26 Extended Hanoi</span>
          </div>
        </nav>

        <div className="text-center mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#60a5fa">
              <path d="M12 2L14.5 7.5L20 8.5L16 12.5L17 18L12 15.5L7 18L8 12.5L4 8.5L9.5 7.5L12 2Z" />
            </svg>
            <span className="text-[11px] font-medium text-blue-300 tracking-wide">BUILD WITH AI • LAS VEGAS</span>
          </div>
          <h1 className="text-[32px] lg:text-[44px] leading-[1.05] font-medium tracking-tight bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent" style={{ fontFamily: "Google Sans, system-ui, sans-serif" }}>
            Tạo Scrapbook của bạn<br/>cho Google Cloud Next '26
          </h1>
        </div>

        <div className="relative w-full max-w-[540px]">
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 rounded-[40px] blur-2xl" />

          <div
            ref={frameRef}
            className="relative aspect-square rounded-[32px] overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0d0d10 0%, #07070a 100%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />

            <div className="relative h-full p-[22px] flex flex-col">
              {/* TOP BAR */}
              <div className="relative mb-2 h-[78px]">
                {/* GDG Cloud Hanoi - TOP LEFT */}
                <div className="absolute top-0 left-0 flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <span className="h-[16px] w-[28px] rounded-full rotate-[-35deg] bg-gradient-to-br from-[#60a5fa] to-[#1d4ed8] border border-blue-300/35 shadow-[0_0_12px_rgba(59,130,246,0.55)]" />
                    <span className="h-[16px] w-[28px] rounded-full rotate-[35deg] bg-[#111827] border border-blue-300/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
                  </div>
                  <span className="text-[16px] leading-none font-medium text-white tracking-[-0.02em]" style={{ fontFamily: "Google Sans, system-ui, sans-serif" }}>
                    GDG Cloud Hanoi
                  </span>
                </div>

                {/* HPU Student Ambassador pill - BOTTOM LEFT */}
                <div className="absolute left-0 bottom-0 flex items-center">
                  <div className="relative h-[32px] min-w-[166px] rounded-full px-4 flex items-center" style={{ background: "#0b0f15", border: "1px solid rgba(66,133,244,0.48)", boxShadow: "0 0 0 1px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 14px rgba(37,99,235,0.18)" }}>
                    <span className="text-[10px] leading-none text-white tracking-[0.03em] whitespace-nowrap" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                      HPU Student Ambassador
                    </span>
                  </div>
                  <div className="relative z-10 -ml-1 w-[32px] h-[32px] rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle at 35% 28%, #9ec5ff 0%, #4b8cff 42%, #1e3a8a 100%)", border: "1px solid rgba(147,197,253,0.75)", boxShadow: "0 0 18px rgba(59,130,246,0.6), inset 0 1px 0 rgba(255,255,255,0.4)" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#06111f"><path d="M12 0l3.2 8.8L24 12l-8.8 3.2L12 24l-3.2-8.8L0 12l8.8-3.2L12 0z" /></svg>
                  </div>
                  <div className="relative -ml-1.5 w-[40px] h-[32px] rounded-full bg-white" style={{ border: "1px solid rgba(255,255,255,0.95)", boxShadow: "0 0 14px rgba(255,255,255,0.35), 0 2px 10px rgba(0,0,0,0.45)" }} />
                </div>

                {/* Google Cloud Next Logo - TOP RIGHT, smaller */}
                <div className="absolute right-[-2px] top-[-4px] z-20">
                  <img
                    src={NEXT_LOGO_URL}
                    alt="Google Cloud Next 26"
                    className="h-[82px] w-auto"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.85))' }}
                  />
                </div>
              </div>

              {/* PHOTO AREA */}
              <div className="relative flex-1 rounded-[20px] overflow-hidden" style={{ background: "linear-gradient(135deg, #050507, #0a0a0d)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 2px 4px rgba(0,0,0,0.4)" }}>
                {!image ? (
                  <div onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? "bg-blue-500/10 scale-[0.98]" : "hover:bg-white/[0.02]"}`}>
                    <div className="relative mb-5">
                      <div className={`absolute inset-0 rounded-3xl bg-blue-500/30 blur-2xl transition-all ${isDragging ? "scale-150 opacity-100" : "opacity-0"}`} />
                      <div className={`relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${isDragging ? "scale-110" : ""}`} style={{ background: isDragging ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))" : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: `1px solid ${isDragging ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.08)"}` }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isDragging ? "#60a5fa" : "#71717a"} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-3.5-3.5L9 20" /></svg>
                      </div>
                    </div>
                    <h3 className="text-[18px] font-medium text-white mb-2" style={{ fontFamily: "Google Sans, sans-serif" }}>Kéo thả ảnh vào đây</h3>
                    <p className="text-[13px] text-zinc-500 mb-5">Khuyến nghị ảnh chân dung rõ nét (PNG, JPG)</p>
                    <div className="px-5 py-2.5 rounded-full flex items-center gap-2" style={{ background: "linear-gradient(135deg, #1e40af, #1e3a8a)", boxShadow: "0 4px 16px rgba(30,64,175,0.4), inset 0 1px 0 rgba(255,255,255,0.1)", border: "1px solid rgba(96,165,250,0.3)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                      <span className="text-[13px] font-medium text-white" style={{ fontFamily: "Google Sans, sans-serif" }}>Chọn ảnh từ máy</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
                    <button onClick={handleClick} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-all hover:scale-110" data-html2canvas-ignore="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* BOTTOM BAR */}
              <div className="flex items-end justify-between mt-3.5 gap-3">
                <div className="relative flex-shrink-0 group">
                  <div className="absolute -top-7 left-1 flex items-center gap-1 transition-transform group-hover:-translate-y-0.5">
                    <div className="h-[12px] w-[20px] rounded-full bg-[#172033] border border-blue-400/35 rotate-[-25deg] shadow-[0_0_6px_rgba(96,165,250,0.3)]" />
                    <div className="h-[12px] w-[20px] rounded-full bg-[#0b0f15] border border-slate-500/45 rotate-[30deg]" />
                    <div className="h-[18px] w-[36px] rounded-full bg-[#0b0f15] border border-blue-400/35 flex items-center justify-end pr-0.5 shadow-[0_0_8px_rgba(59,130,246,0.15)]">
                      <span className="h-[14px] w-[14px] rounded-full bg-[#1d4ed8] flex items-center justify-center shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="#bfdbfe"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" /></svg>
                      </span>
                    </div>
                  </div>

                  <div className="absolute -top-3 right-5 z-20 h-6 w-6 text-[#93c5fd] drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l3.2 8.8L24 12l-8.8 3.2L12 24l-3.2-8.8L0 12l8.8-3.2L12 0z" /></svg>
                  </div>

                  <div
                    className="relative h-[48px] w-[240px] overflow-hidden pl-4 pr-3 pt-2"
                    style={{
                      borderRadius: '0 8px 8px 8px',
                      background: 'linear-gradient(180deg, #1d4ed8 0%, #172554 20%, #0f172a 60%, #020617 100%)',
                      border: '1px solid rgba(96,165,250,0.5)',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.7), 0 6px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                      clipPath: 'polygon(0 0, 58% 0, 64% 15%, 100% 15%, 100% 100%, 0 100%)',
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage: 'linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />
                    <div className="absolute inset-x-0 top-0 h-[20px] bg-gradient-to-b from-blue-400/40 to-transparent" />
                    <div
                      className="relative z-10 text-white leading-[1.05] tracking-[0.02em]"
                      style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '16px' }}
                    >
                      <div className="font-semibold text-blue-100">Build With AI</div>
                      <div className="text-[13px] opacity-90">Next'26 Extended Hanoi</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1.5 pb-2">
                    <span className="text-[11px] text-zinc-400 leading-none font-medium">RSVP now</span>
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/60 to-blue-400" />
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #14161c, #0d0f14)", border: "1px solid rgba(59,130,246,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa"><path d="M12 2L14.5 7.5L20 8.5L16 12.5L17 18L12 15.5L7 18L8 12.5L4 8.5L9.5 7.5L12 2Z" /></svg>
                  </div>
                  <a href={QR_URL} target="_blank" rel="noopener noreferrer" className="block relative group flex-shrink-0" title="Scan or click to visit">
                    <div className="w-[76px] h-[76px] rounded-[10px] p-[5px] transition-transform group-hover:scale-105" style={{ background: "linear-gradient(135deg, #fff, #f4f4f5)", boxShadow: "0 8px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)" }}>
                      {qrDataUrl ? <img src={qrDataUrl} alt="QR Code" className="w-full h-full" /> : <div className="w-full h-full bg-zinc-200 animate-pulse rounded" />}
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button onClick={handleClick} className="group relative px-6 h-12 rounded-full font-medium text-[14px] transition-all hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg, #ffffff, #e4e4e7)", color: "#0a0a0b", boxShadow: "0 10px 30px -10px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.6)", fontFamily: "Google Sans, sans-serif" }}>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              {image ? "Đổi ảnh khác" : "Tải ảnh lên"}
            </span>
          </button>
          {image && (
            <button onClick={downloadComposite} disabled={isDownloading} className="group relative px-6 h-12 rounded-full font-medium text-[14px] text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-60" style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #312e81 100%)", boxShadow: "0 10px 30px -8px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)", border: "1px solid rgba(96,165,250,0.3)", fontFamily: "Google Sans, sans-serif" }}>
              <span className="flex items-center gap-2">
                {isDownloading ? <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>Đang tạo ảnh...</> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Tải xuống ảnh</>}
              </span>
            </button>
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
    </div>
  );
}
