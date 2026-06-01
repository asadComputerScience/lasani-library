import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  THUMB_BAIT, THUMB_TASBIHAT, THUMB_SALAT, THUMB_DAM, THUMB_SHAJRA,
  PDF_BAIT, PDF_TASBIHAT, PDF_SALAT, PDF_DAM, PDF_SHAJRA
} from "./lasaniData.js";

const C = {
  bg0:"#04030a", bg1:"#080614", bg2:"#100e24", bg3:"#18163a",
  a1:"#6d28d9", a2:"#8b5cf6", a3:"#a78bfa", a4:"#c4b5fd",
  r1:"#9d174d", r2:"#db2777", r3:"#f472b6",
  t1:"#0f766e", t2:"#14b8a6", t3:"#5eead4",
  o1:"#b45309", o2:"#d97706", o3:"#fbbf24", o4:"#fde68a",
  tx0:"#fafafa", tx1:"#e9d5ff", tx2:"#c4b5fd", tx3:"#a78bfa",
  bd:"rgba(109,40,217,0.18)", bd2:"rgba(109,40,217,0.4)",
};

const THUMBS = {
  bait:THUMB_BAIT, tasbihat:THUMB_TASBIHAT, salat:THUMB_SALAT, dam:THUMB_DAM, shajra:THUMB_SHAJRA,
  murshad:"/thumbs/murshad_akmal.jpg",
  rohani_nukat:"/thumbs/rohani_nukat.jpg",
  waris_faqar:"/thumbs/waris_faqar.jpg",
  khazanay:"/thumbs/khazanay.jpg",
  meray_murshid:"/thumbs/meray_murshid.jpg",
  nashat_sania:"/thumbs/nashat_sania.jpg",
  noori_kirnein:"/thumbs/noori_kirnein.jpg",
  ayat_hadith:"/thumbs/ayat_hadith.jpg",
  salat_momineen:"/thumbs/salat_momineen.jpg",
  lasani_kirnein:"/thumbs/lasani_kirnein.jpg",
  ithad_anwar:"/thumbs/ithad_anwar.jpg",
  fiyouz_barkat:"/thumbs/fiyouz_barkat.jpg",
  mahzan_kamalat:"/thumbs/mahzan_kamalat.jpg",
};

const PDFS = {
  bait:     {ur:"عہدنامہ — بیعت فارم",   en:"Lasani Sarkar Oath Form",           data:PDF_BAIT,     fn:"Lasani-Sarkar-Oath-Form.pdf"},
  tasbihat: {ur:"صبح شام کی تسبیحات",    en:"Daily Morning & Evening Tasbihat",  data:PDF_TASBIHAT, fn:"Subha-Sham-Tasbihat.pdf"},
  salat:    {ur:"صلوٰۃ و سلام",           en:"Salat o Salam — Durood Collection", data:PDF_SALAT,    fn:"Salat-o-Salam.pdf"},
  dam:      {ur:"خیر و برکت دم کارڈ",    en:"Protection & Blessings Dam Card",   data:PDF_DAM,      fn:"Khair-o-Barkat-Dam-Card.pdf"},
  shajra:   {ur:"شجرہ مبارک",             en:"Shajra Mubarik — Sacred Lineage",   data:PDF_SHAJRA,   fn:"Shajra-Mubarik.pdf"},
  murshad:        {ur:"مرشدِ اکمل",          en:"Murshad-e-Akmal",        data:"/murshad_akmal.pdf",   fn:"murshad_akmal.pdf"},
  rohani_nukat:   {ur:"روحانی نکات",         en:"Rohani Nukat",           data:"/rohani_nukat.pdf",    fn:"rohani_nukat.pdf"},
  waris_faqar:    {ur:"وارثِ فقر",           en:"Waris-e-Faqar",          data:"/waris_faqar.pdf",     fn:"waris_faqar.pdf"},
  khazanay:       {ur:"خزانے",               en:"Khazanay",               data:"/khazanay.pdf",        fn:"khazanay.pdf"},
  meray_murshid:  {ur:"میرے مرشد",           en:"Meray Murshid",          data:"/meray_murshid.pdf",   fn:"meray_murshid.pdf"},
  nashat_sania:   {ur:"نشاتِ ثانیہ",         en:"Nashat-e-Sania",         data:"/nashat_sania.pdf",    fn:"nashat_sania.pdf"},
  noori_kirnein:  {ur:"نوری کرنیں",          en:"Noori Kirnein",          data:"/noori_kirnein.pdf",   fn:"noori_kirnein.pdf"},
  ayat_hadith:    {ur:"آیات و حدیث کتابچہ",  en:"Ayat o Hadith",          data:"/ayat_hadit.pdf",      fn:"ayat_hadit.pdf"},
  salat_momineen: {ur:"صلاۃ المومنین",        en:"Salat ul Momineen",      data:"/salat_momineen.pdf",  fn:"salat_momineen.pdf"},
  lasani_kirnein: {ur:"لاثانی کرنیں",         en:"Lasani Kirnein",         data:"/lasani_kirnein.pdf",  fn:"lasani_kirnein.pdf"},
  ithad_anwar:    {ur:"اتحاد الانوار",        en:"Ithad ul Anwar",         data:"/ithad_anwar.pdf",     fn:"ithad_anwar.pdf"},
  fiyouz_barkat:  {ur:"فیوض و برکات",         en:"Fiyouz o Barkat",        data:"/fiyouz_barkat.pdf",   fn:"fiyouz_barkat.pdf"},
  mahzan_kamalat: {ur:"محزن کمالات",          en:"Mahzan Kamalat",         data:"/mahzan_kamalat.pdf",  fn:"mahzan_kamalat.pdf"},
};

const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Gulzar&family=Amiri:ital,wght@0,400;0,700;1,400&family=Scheherazade+New:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:#04030a;font-family:'Scheherazade New',serif;color:#fafafa;direction:rtl;overflow-x:hidden;cursor:none!important}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#080614}::-webkit-scrollbar-thumb{background:#6d28d9;border-radius:3px}
.gulzar{font-family:'Gulzar',serif!important}.amiri{font-family:'Amiri',serif!important}.cor{font-family:'Cormorant Garamond',serif!important}
@keyframes fadeup{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin2{to{transform:rotate(360deg)}}
@keyframes pulse2{0%,100%{opacity:.5}50%{opacity:1}}
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}
.rv.vis{opacity:1;transform:none}

@media(max-width:768px){
  body{cursor:auto!important}
  .tb-nav-links{display:none!important}
  .tb-pill{display:none!important}
  .bait-grid{grid-template-columns:1fr!important}
  .wazaif-grid{grid-template-columns:1fr 1fr!important}
  .books-row{grid-template-columns:1fr 1fr!important}
  .footer-grid{grid-template-columns:1fr!important}
  .hero-badges{gap:6px!important}
  .hero-btns{flex-direction:column!important;align-items:center!important}
}
@media(max-width:480px){
  .wazaif-grid{grid-template-columns:1fr!important}
  .books-row{grid-template-columns:1fr 1fr!important}
}
`;

const WAZAIF_ITEMS = [
  {id:"tasbihat",ur:"صبح شام کی تسبیحات",en:"Daily Tasbihat"},
  {id:"salat",   ur:"صلوٰۃ و سلام",       en:"Salat o Salam"},
  {id:"dam",     ur:"خیر و برکت دم کارڈ", en:"Dam Card"},
  {id:"shajra",  ur:"شجرہ مبارک",          en:"Shajra Mubarik"},
];
const DEGAR_ITEMS = [
  {icon:"📿",ur:"سنتِ مبارک و ارشادات",                   desc:"سنتِ نبوی ﷺ کی پیروی اور ارشاداتِ مبارکہ — روزمرہ زندگی میں سنتوں کا اہتمام۔"},
  {icon:"📖",ur:"حدیث مبارک کی روشنی میں معاملاتِ زندگی", desc:"احادیث نبوی ﷺ کی روشنی میں روزمرہ زندگی — خرید و فروخت، معاشرت اور معاملات۔"},
  {icon:"🚫",ur:"فرسودہ رسومات کا بائیکاٹ",               desc:"غیر اسلامی رسومات سے اجتناب — شریعت و سنت کی روشنی میں مکمل رہنمائی۔"},
  {icon:"🛡️",ur:"احتیاطی تدابیر",                         desc:"روحانی و جسمانی حفاظت — نظرِ بد، جادو اور آفات سے تحفظ کی رہنمائی۔"},
  {icon:"🪞",ur:"محاسبہ",                                  desc:"نفس کا محاسبہ — روزانہ اعمال، نیت اور کردار کا جائزہ۔ تزکیۂ نفس کا طریقہ۔"},
  {icon:"⭐",ur:"شانِ اولیاء",                             desc:"اللہ کے ولیوں کی عظمت، کرامات، تعلیمات اور روحانی اثرات۔"},
];
const LIBRARY_CATS = [
  {label:"ا",ur:"تصانیف حضرت صوفی مسعود احمد صدیقی لاثانی سرکار",en:"Tasaneef Hazrat Lasani Sarkar",grad:`linear-gradient(135deg,${C.a1},${C.r1})`,
    books:[
      {id:"murshad",      ur:"مرشدِ اکمل",  en:"Murshad-e-Akmal",  icon:"📗",sp:`linear-gradient(180deg,${C.a1},${C.a3},${C.a1})`},
      {id:"rohani_nukat", ur:"روحانی نکات", en:"Rohani Nukat",      icon:"📘",sp:`linear-gradient(180deg,${C.t1},${C.t3},${C.t1})`},
      {id:"waris_faqar",  ur:"وارثِ فقر",   en:"Waris-e-Faqar",    icon:"📙",sp:`linear-gradient(180deg,${C.r1},${C.r3},${C.r1})`},
      {id:"khazanay",     ur:"خزانے",        en:"Khazanay",         icon:"📕",sp:`linear-gradient(180deg,${C.o1},${C.o3},${C.o1})`},
    ]},
  {label:"ب",ur:"تعارف لاثانی سرکار",en:"Taruf Lasani Sarkar",grad:`linear-gradient(135deg,${C.t1},${C.a1})`,
    books:[
      {id:"meray_murshid",ur:"میرے مرشد",  en:"Meray Murshid",  icon:"💜",sp:"linear-gradient(180deg,#5b21b6,#8b5cf6,#5b21b6)"},
      {id:"nashat_sania", ur:"نشاتِ ثانیہ",en:"Nashat-e-Sania", icon:"🟢",sp:"linear-gradient(180deg,#065f46,#10b981,#065f46)"},
    ]},
  {label:"ج",ur:"بنیادی عقائد و رہنمائی کی کتب",en:"Bunyadi Aqaid o Rehnumai",grad:`linear-gradient(135deg,${C.r1},${C.o1})`,
    books:[
      {id:"noori_kirnein", ur:"نوری کرنیں",         en:"Noori Kirnein",    icon:"✨",sp:`linear-gradient(180deg,${C.o1},${C.o4},${C.o1})`},
      {id:"ayat_hadith",   ur:"آیات و حدیث کتابچہ", en:"Ayat o Hadith",    icon:"📖",sp:"linear-gradient(180deg,#1e3a8a,#3b82f6,#1e3a8a)"},
      {id:"salat_momineen",ur:"صلاۃ المومنین",       en:"Salat ul Momineen",icon:"🤲",sp:`linear-gradient(180deg,${C.a1},${C.a4},${C.a1})`},
    ]},
  {label:"د",ur:"مناقب و کلام",en:"Manaqat o Kalam",grad:`linear-gradient(135deg,${C.a1},${C.t1})`,
    books:[
      {id:"lasani_kirnein",ur:"لاثانی کرنیں", en:"Lasani Kirnein", icon:"🌟",sp:"linear-gradient(180deg,#92400e,#f59e0b,#92400e)"},
      {id:"ithad_anwar",   ur:"اتحاد الانوار",en:"Ithad ul Anwar", icon:"💫",sp:"linear-gradient(180deg,#1e3a8a,#60a5fa,#1e3a8a)"},
    ]},
  {label:"ہ",ur:"دیگر کتب",en:"Degar Kutab",grad:`linear-gradient(135deg,${C.r1},${C.r2})`,
    books:[
      {id:"fiyouz_barkat", ur:"فیوض و برکات",en:"Fiyouz o Barkat",icon:"🌿",sp:"linear-gradient(180deg,#065f46,#34d399,#065f46)"},
      {id:"mahzan_kamalat",ur:"محزن کمالات", en:"Mahzan Kamalat", icon:"💎",sp:"linear-gradient(180deg,#7f1d1d,#f87171,#7f1d1d)"},
    ]},
];

/* ═══ CURSOR ═══ */
function Cursor() {
  const dot=useRef(null),ring=useRef(null),pos=useRef({x:0,y:0,rx:0,ry:0});
  useEffect(()=>{
    const mv=e=>{pos.current.x=e.clientX;pos.current.y=e.clientY;if(dot.current){dot.current.style.left=e.clientX+"px";dot.current.style.top=e.clientY+"px";}};
    window.addEventListener("mousemove",mv);
    let raf;const loop=()=>{pos.current.rx+=(pos.current.x-pos.current.rx)*.1;pos.current.ry+=(pos.current.y-pos.current.ry)*.1;if(ring.current){ring.current.style.left=pos.current.rx+"px";ring.current.style.top=pos.current.ry+"px";}raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);
    return()=>{window.removeEventListener("mousemove",mv);cancelAnimationFrame(raf);};
  },[]);
  return(<>
    <div ref={dot} style={{position:"fixed",width:9,height:9,background:C.a2,borderRadius:"50%",pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)",transition:"width .2s,height .2s"}}/>
    <div ref={ring} style={{position:"fixed",width:28,height:28,border:`1.5px solid ${C.a2}`,borderRadius:"50%",pointerEvents:"none",zIndex:9998,transform:"translate(-50%,-50%)",opacity:.45}}/>
  </>);
}

/* ═══ PDF FLIPBOOK MODAL ═══
   • pdf.js renders every page to a canvas image
   • Mouse drag: page curl angle = exactly how far you dragged (real-time)
   • Release > 35% → completes flip
   • Release < 35% → snaps back
   • iframe fallback if pdf.js fails
*/
function PDFModal({pdf, onClose}) {
  const containerRef = useRef(null);
  const pageFlipRef  = useRef(null);
  const touchStartX  = useRef(0);
  const touchStartY  = useRef(0);

  const [pages,       setPages]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadMsg,     setLoadMsg]     = useState("PDF لوڈ ہو رہی ہے...");
  const [useFallback, setUseFallback] = useState(false);
  const [curPage,     setCurPage]     = useState(0);
  const [totalPages,  setTotalPages]  = useState(0);

  const isMobile = window.innerWidth < 768;

  const loadScript = src => new Promise((res,rej)=>{
    if(document.querySelector(`script[src="${src}"]`)){res();return;}
    const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=rej;
    document.head.appendChild(s);
  });

  /* ── Render PDF pages ── */
  useEffect(()=>{
    let cancelled=false;
    const waitLib=()=>new Promise((res,rej)=>{
      let t=0;const p=()=>{if(window.pdfjsLib?.getDocument){res();return;}if(t++>80){rej(new Error("timeout"));return;}setTimeout(p,150);};p();
    });
    (async()=>{
      try{
        setLoadMsg("PDF.js لوڈ ہو رہی ہے...");
        try{
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js");
          await waitLib();
          window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
        }catch{
          await loadScript("https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.min.js");
          await waitLib();
          window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";
        }
        if(cancelled)return;
        setLoadMsg("کتاب کھل رہی ہے...");
        let src;
        if(pdf.data.startsWith("data:")){
          const b64=pdf.data.split(",")[1];const bin=atob(b64);
          const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
          src={data:arr};
        }else{src={url:pdf.data};}
        const doc=await window.pdfjsLib.getDocument({...src,verbosity:0,stopAtErrors:false}).promise;
        if(cancelled)return;
        const n=doc.numPages;setTotalPages(n);
        const imgs=[];
        for(let i=1;i<=n;i++){
          if(cancelled)return;
          setLoadMsg(`صفحہ ${i} / ${n} تیار ہو رہا ہے...`);
          const pg=await doc.getPage(i);
          const scale = isMobile ? 1.4 : 1.8;
          const vp=pg.getViewport({scale});
          const cv=document.createElement("canvas");
          cv.width=vp.width;cv.height=vp.height;
          await pg.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise;
          imgs.push(cv.toDataURL("image/jpeg",.88));
          cv.width=0;cv.height=0;
        }
        if(!cancelled){setPages(imgs);setLoading(false);}
      }catch(e){
        console.error(e);
        if(!cancelled){
          if(!pdf.data.startsWith("data:")){setUseFallback(true);setLoading(false);}
          else setLoadMsg(`❌ خرابی: ${e.message}`);
        }
      }
    })();
    return()=>{cancelled=true;};
  },[pdf.data]);

  /* ── Init StPageFlip (DESKTOP only) ── */
  useEffect(()=>{
    if(isMobile||loading||useFallback||pages.length===0||!containerRef.current) return;
    let destroyed=false;
    (async()=>{
      try{
        await loadScript("https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js");
      }catch{
        try{ await loadScript("https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js"); }
        catch(e){ setUseFallback(true);return; }
      }
      if(destroyed||!window.St||!containerRef.current) return;
      const stageW = window.innerWidth  - 60;
      const stageH = window.innerHeight - 120;
      const pageH  = Math.min(stageH - 20, 680);
      const pageW  = Math.round(pageH * 0.72);
      try{
        const pf = new window.St.PageFlip(containerRef.current,{
          width:pageW, height:pageH,
          size:"fixed",
          minWidth:pageW, maxWidth:pageW,
          minHeight:pageH, maxHeight:pageH,
          drawShadow:true, flippingTime:650,
          usePortrait:false,
          startZIndex:10, autoSize:false,
          showCover:false, startPage:pages.length-1,
          mobileScrollSupport:false,
          clickEventForward:true,
          useMouseEvents:true,
          swipeDistance:30,
          showPageCorners:true,
          disableFlipByClick:false,
        });
        pf.loadFromHTML(containerRef.current.querySelectorAll(".page"));
        pf.on("flip", e => setCurPage(e.data));
        pageFlipRef.current = pf;
      }catch(e){ console.error(e); setUseFallback(true); }
    })();
    return()=>{
      destroyed=true;
      try{if(pageFlipRef.current)pageFlipRef.current.destroy();}catch(e){}
      pageFlipRef.current=null;
    };
  },[loading,useFallback,pages,isMobile]);

  /* keyboard */
  useEffect(()=>{
    document.body.style.overflow="hidden";
    const kh=e=>{
      if(e.key==="Escape")onClose();
      if(e.key==="ArrowRight")flipNext();
      if(e.key==="ArrowLeft")flipPrev();
    };
    window.addEventListener("keydown",kh);
    return()=>{window.removeEventListener("keydown",kh);document.body.style.overflow="";};
  },[onClose,curPage,pages]);

  /* ── Mobile: simple page navigation ── */
  const flipNext = useCallback(()=>{
    if(isMobile){
      setCurPage(p=>Math.min(p+1, totalPages-1));
    }else{
      /* Desktop: pages reversed so flipNext = forward */
      try{pageFlipRef.current?.flipNext();}catch(e){}
    }
  },[isMobile,totalPages]);

  const flipPrev = useCallback(()=>{
    if(isMobile){
      setCurPage(p=>Math.max(p-1, 0));
    }else{
      try{pageFlipRef.current?.flipNext();}catch(e){}
    }
  },[isMobile]);

  /* touch swipe for mobile */
  const onTouchStart = e=>{
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = e=>{
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if(dy > 60) return; // vertical scroll, ignore
    if(dx >  50) flipNext(); // swipe right = next (Urdu: right→left reading)
    if(dx < -50) flipPrev(); // swipe left  = prev
  };

  const dl=()=>{const a=document.createElement("a");a.href=pdf.data;a.download=pdf.fn;a.click();};

  /* Desktop page order for StPageFlip */
  const PH_D = Math.min(window.innerHeight-140, 680);
  const PW_D = Math.round(PH_D * 0.72);

  const progress = totalPages>1?(curPage/(totalPages-1))*100:0;

  /* ── Mobile single-page dimensions ── */
  const MOB_W = window.innerWidth - 16;
  const MOB_H = window.innerHeight - 110;

  return(
    <div style={{position:"fixed",inset:0,zIndex:800,
      background:"rgba(2,1,8,.98)",backdropFilter:"blur(30px)",
      display:"flex",flexDirection:"column"}}>

      {/* TOP BAR */}
      <div style={{height:isMobile?48:58,
        borderBottom:`1px solid ${C.bd}`,
        background:"rgba(4,3,10,.97)",flexShrink:0,zIndex:10,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:isMobile?"0 10px":"0 28px"}}>
        <div style={{flex:1,overflow:"hidden",marginRight:8}}>
          <div style={{fontFamily:"'Amiri',serif",
            fontSize:isMobile?"0.95rem":"1.1rem",
            color:C.tx1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {pdf.ur}
          </div>
          {!isMobile&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".68rem",color:C.tx3,fontStyle:"italic",direction:"ltr"}}>{pdf.en}</div>}
        </div>
        <div style={{display:"flex",gap:isMobile?6:10,alignItems:"center",direction:"ltr",flexShrink:0}}>
          <button onClick={dl} style={{
            padding:isMobile?"6px 10px":"7px 18px",
            borderRadius:6,border:`1px solid ${C.bd}`,background:"transparent",color:C.a3,
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:isMobile?".65rem":".7rem",
            letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>
            {isMobile?"⬇":"⬇ Download"}
          </button>
          <button onClick={flipPrev} style={{width:34,height:34,borderRadius:6,border:`1px solid ${C.bd}`,background:"transparent",color:C.tx2,cursor:"pointer",fontSize:"1.3rem",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
          <button onClick={flipNext} style={{width:34,height:34,borderRadius:6,border:`1px solid ${C.bd}`,background:"transparent",color:C.tx2,cursor:"pointer",fontSize:"1.3rem",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",border:`1px solid ${C.bd}`,background:"transparent",color:C.tx2,cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      </div>

      {/* STAGE */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
        overflow:"hidden",position:"relative",background:"rgba(2,1,8,.98)"}}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Loading */}
        {loading&&!useFallback&&!loadMsg.startsWith("❌")&&(
          <div style={{textAlign:"center",padding:20}}>
            <div style={{width:56,height:56,margin:"0 auto 20px",border:"2px solid transparent",
              borderTopColor:C.a2,borderRightColor:C.r2,borderRadius:"50%",animation:"spin2 1s linear infinite"}}/>
            <div style={{fontFamily:"'Amiri',serif",fontSize:"1.1rem",color:C.tx1,marginBottom:8}}>{loadMsg}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".7rem",color:C.tx3,direction:"ltr",letterSpacing:2}}>Please wait...</div>
          </div>
        )}

        {/* Error */}
        {loadMsg.startsWith("❌")&&(
          <div style={{textAlign:"center",padding:30,maxWidth:420}}>
            <div style={{fontSize:"2.5rem",marginBottom:14}}>⚠️</div>
            <div style={{fontFamily:"'Amiri',serif",fontSize:"1rem",color:"#f87171",marginBottom:12,lineHeight:2}}>PDF فائل لوڈ نہیں ہوئی</div>
            <button onClick={onClose} style={{padding:"9px 24px",borderRadius:6,background:`linear-gradient(135deg,${C.a1},${C.r1})`,color:"#fff",border:"none",cursor:"pointer"}}>بند کریں</button>
          </div>
        )}

        {/* Iframe fallback */}
        {useFallback&&(
          <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 12px",gap:8}}>
            <div style={{fontFamily:"'Amiri',serif",fontSize:"1rem",color:C.tx2}}>📄 PDF نیچے پڑھیں</div>
            <iframe src={pdf.data} style={{width:"100%",maxWidth:900,flex:1,border:"none",borderRadius:8,background:"#fff"}} title={pdf.ur}/>
          </div>
        )}

        {/* ══ MOBILE: single page swipe reader ══ */}
        {!loading&&!useFallback&&pages.length>0&&isMobile&&(
          <div style={{position:"relative",width:MOB_W,height:MOB_H,
            boxShadow:"0 20px 60px rgba(0,0,0,.9)"}}>
            {/* Current page */}
            <img
              src={pages[curPage]}
              alt={`Page ${curPage+1}`}
              draggable={false}
              style={{width:"100%",height:"100%",objectFit:"contain",
                display:"block",background:"#fff",borderRadius:4}}
            />
            {/* Tap zones — left side = prev, right side = next */}
            {/* Tap right side = next page (Urdu reads right→left) */}
            <div onClick={flipNext}
              style={{position:"absolute",top:0,left:0,width:"40%",height:"100%",cursor:"pointer",zIndex:5,
                display:"flex",alignItems:"center",justifyContent:"flex-start",paddingLeft:8}}>
              {curPage<totalPages-1&&<span style={{fontSize:"2rem",color:"rgba(255,255,255,.25)"}}>›</span>}
            </div>
            {/* Tap left side = prev page */}
            <div onClick={flipPrev}
              style={{position:"absolute",top:0,right:0,width:"40%",height:"100%",cursor:"pointer",zIndex:5,
                display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
              {curPage>0&&<span style={{fontSize:"2rem",color:"rgba(255,255,255,.25)"}}>‹</span>}
            </div>
          </div>
        )}

        {/* ══ DESKTOP: StPageFlip double-page flipbook ══ */}
        {!loading&&!useFallback&&pages.length>0&&!isMobile&&(
          <div style={{boxShadow:"0 60px 120px rgba(0,0,0,.95),0 0 60px rgba(109,40,217,.08)"}}>
            <div ref={containerRef} style={{display:"block"}}>
              {(()=>{
                // Reverse page order so StPageFlip's natural drag (left→right) = forward in Urdu
                // StPageFlip: drag left page right = go to NEXT index
                // Reversed: index 0 = last page, last index = cover
                // startPage = last index so cover shows first on left
                const rev = [...pages].reverse();
                const ordered=[];
                for(let i=0;i<rev.length;i+=2){
                  ordered.push({src:rev[i]  ||null, density:"soft"}); // LEFT
                  ordered.push({src:rev[i+1]||null, density:"soft"}); // RIGHT
                }
                return ordered.map((item,i)=>(
                  <div key={i} className="page" data-density={item.density}
                    style={{width:PW_D,height:PH_D,background:"#fff",overflow:"hidden"}}>
                    {item.src
                      ? <img src={item.src} draggable={false}
                          style={{width:"100%",height:"100%",objectFit:"contain",display:"block",pointerEvents:"none"}}/>
                      : <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#faf8f3,#f0ece0)"}}/>
                    }
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BAR */}
      <div style={{height:isMobile?44:52,borderTop:`1px solid ${C.bd}`,
        background:"rgba(4,3,10,.97)",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"center",
        gap:isMobile?10:20,direction:"ltr"}}>
        <button onClick={flipPrev} disabled={isMobile&&curPage<=0}
          style={{width:34,height:34,borderRadius:6,border:`1px solid ${C.bd}`,background:"transparent",
            color:C.tx2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            opacity:(isMobile&&curPage<=0)?.3:1}}>→</button>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".7rem",color:C.tx3,
          letterSpacing:2,minWidth:isMobile?90:130,textAlign:"center"}}>
          {loading?"Loading...":`${curPage+1} / ${totalPages}`}
        </span>
        {/* Progress bar */}
        <div style={{width:isMobile?100:160,height:2,background:"rgba(109,40,217,.15)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,
            background:`linear-gradient(90deg,${C.a1},${C.r2})`,transition:"width .3s",borderRadius:2}}/>
        </div>
        {!isMobile&&(
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".6rem",
            color:"rgba(139,92,246,.3)",letterSpacing:2,textTransform:"uppercase"}}>
            drag corners · ← → keys · swipe
          </span>
        )}
        {isMobile&&(
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".6rem",
            color:"rgba(139,92,246,.3)",letterSpacing:2}}>
            swipe ← →
          </span>
        )}
        <button onClick={flipNext} disabled={isMobile&&curPage>=totalPages-1}
          style={{width:34,height:34,borderRadius:6,border:`1px solid ${C.bd}`,background:"transparent",
            color:C.tx2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            opacity:(isMobile&&curPage>=totalPages-1)?.3:1}}>←</button>
      </div>
    </div>
  );
}


function BookThumbCard({bookId,ur,en,onOpen,delay=0}){
  const [hov,setHov]=useState(false);
  const thumb=THUMBS[bookId];
  const pdf=PDFS[bookId];
  return(
    <div onClick={()=>pdf?onOpen(pdf):alert("یہ PDF جلد شامل ہوگی\nComing soon!")}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:14,overflow:"hidden",border:`1px solid ${hov?C.bd2:C.bd}`,background:C.bg2,cursor:"pointer",
        transform:hov?"translateY(-8px)":"none",
        boxShadow:hov?`0 28px 70px rgba(0,0,0,.5),0 0 22px rgba(109,40,217,.14)`:"none",
        transition:"all .4s cubic-bezier(.16,1,.3,1)",position:"relative",
        animation:`fadeup .6s ${delay}s ease both`}}>
      <div style={{position:"relative",overflow:"hidden"}}>
        {thumb?(
          <img src={thumb} alt={ur} style={{width:"100%",display:"block",aspectRatio:"3/4",objectFit:"cover",transform:hov?"scale(1.04)":"scale(1)",transition:"transform .5s"}}/>
        ):(
          <div style={{width:"100%",aspectRatio:"3/4",background:`linear-gradient(160deg,${C.bg3},${C.bg1})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
            <span style={{fontSize:"2.5rem",opacity:.4}}>📄</span>
            <span className="cor" style={{fontSize:".65rem",color:"rgba(109,40,217,.35)",letterSpacing:2,textTransform:"uppercase"}}>PDF Coming Soon</span>
          </div>
        )}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(180deg,transparent 48%,rgba(4,3,10,.93) 100%)"}}/>
        <div style={{position:"absolute",top:12,right:12,padding:"4px 12px",borderRadius:10,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",fontFamily:"'Cormorant Garamond',serif",fontSize:".58rem",letterSpacing:2,textTransform:"uppercase",color:pdf?C.o3:"rgba(255,255,255,.3)",border:`1px solid ${pdf?"rgba(253,230,138,.25)":"rgba(255,255,255,.1)"}`,direction:"ltr"}}>
          {pdf?"PDF":"soon"}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"18px 16px",zIndex:2}}>
          <div className="amiri" style={{fontSize:"1rem",color:"#fff",fontWeight:700,marginBottom:4}}>{ur}</div>
          <div className="cor" style={{fontSize:".7rem",color:"rgba(255,255,255,.55)",fontStyle:"italic",direction:"ltr",marginBottom:10}}>{en}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 14px",borderRadius:20,border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.75)",fontSize:".72rem",fontFamily:"'Cormorant Garamond',serif",letterSpacing:1,background:hov?C.a1:"transparent",transition:"background .3s"}}>
            {pdf?"📖 کھولیں":"⏳ جلد آئے گا"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ BOOK CARD (library) ═══ */
function BookCard({book,onOpen,delay=0}){
  const [hov,setHov]=useState(false);
  const pdf=PDFS[book.id];
  return(
    <div onClick={()=>pdf?onOpen(pdf):alert("یہ PDF جلد شامل ہوگی\nComing soon!")}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:12,overflow:"hidden",border:`1px solid ${hov?C.bd2:C.bd}`,background:C.bg2,cursor:"pointer",
        transform:hov?"translateY(-10px) rotate(-1.2deg)":"none",
        boxShadow:hov?`0 24px 58px rgba(0,0,0,.5),0 0 18px rgba(109,40,217,.12)`:"none",
        transition:"all .4s cubic-bezier(.16,1,.3,1)",position:"relative",
        animation:`fadeup .6s ${delay}s ease both`}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:6,background:book.sp}}/>
      <div style={{padding:"22px 14px 14px 18px"}}>
        <div style={{fontSize:"2rem",marginBottom:12,opacity:.75}}>{book.icon}</div>
        <div className="amiri" style={{fontSize:"1rem",color:C.tx0,marginBottom:4,lineHeight:1.8,fontWeight:700}}>{book.ur}</div>
        <div className="cor" style={{fontSize:".68rem",color:C.tx3,fontStyle:"italic",direction:"ltr",marginBottom:8}}>{book.en}</div>
        {!pdf&&<div className="cor" style={{fontSize:".63rem",color:"rgba(109,40,217,.35)",letterSpacing:1}}>PDF coming soon</div>}
      </div>
      <div style={{padding:"10px 14px",borderTop:`1px solid ${C.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span className="cor" style={{fontSize:".63rem",letterSpacing:1.5,textTransform:"uppercase",color:hov?C.a3:C.tx3,direction:"ltr",transition:"color .3s"}}>{pdf?"Open & Read →":"Coming soon"}</span>
        <span className="cor" style={{fontSize:".58rem",color:"rgba(109,40,217,.3)",direction:"ltr"}}>PDF</span>
      </div>
    </div>
  );
}

/* ═══ ACCORDION ═══ */
function Accordion({items}){
  const [open,setOpen]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {items.map((item,i)=>(
        <div key={i} style={{border:`1px solid ${open===i?C.bd2:C.bd}`,borderRadius:10,overflow:"hidden",transition:"border-color .3s"}}>
          <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"17px 22px",cursor:"pointer",background:open===i?"rgba(109,40,217,.09)":"rgba(109,40,217,.04)",transition:"background .3s",direction:"rtl"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:36,height:36,borderRadius:8,background:"rgba(109,40,217,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{item.icon}</div>
              <span className="amiri" style={{fontSize:"1.05rem",color:C.tx0}}>{item.ur}</span>
            </div>
            <div style={{width:26,height:26,borderRadius:"50%",border:`1px solid ${open===i?C.a1:C.bd}`,background:open===i?C.a1:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:open===i?"#fff":C.a3,fontSize:".72rem",transform:open===i?"rotate(180deg)":"none",transition:"all .35s",flexShrink:0}}>▾</div>
          </div>
          <div style={{maxHeight:open===i?300:0,overflow:"hidden",transition:"max-height .5s cubic-bezier(.16,1,.3,1)"}}>
            <div style={{padding:"16px 22px 24px"}}>
              <p style={{fontFamily:"'Scheherazade New',serif",fontSize:".9rem",color:C.tx3,lineHeight:2.4}}>{item.desc}</p>
              <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:6,border:"1px dashed rgba(109,40,217,.2)",fontSize:".75rem",color:"rgba(109,40,217,.5)"}}>📄 PDF جلد شامل ہوگا</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ SECTION HEADER ═══ */
function SecHead({label,ur,highlight,en}){
  return(
    <div style={{marginBottom:52}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"5px 16px",borderRadius:20,background:"rgba(109,40,217,.1)",border:`1px solid ${C.bd}`,fontFamily:"'Cormorant Garamond',serif",fontSize:".62rem",letterSpacing:4,textTransform:"uppercase",color:C.a3,marginBottom:14,direction:"ltr"}}>{label}</div>
      <h2 className="gulzar" style={{fontSize:"clamp(1.8rem,3.2vw,2.8rem)",lineHeight:1.6,marginBottom:8}}>
        {ur} {highlight&&<span style={{background:`linear-gradient(135deg,${C.a2},${C.r2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{highlight}</span>}
      </h2>
      <div className="cor" style={{fontSize:".95rem",color:C.tx3,fontStyle:"italic",direction:"ltr"}}>{en}</div>
      <div style={{width:50,height:3,marginTop:16,borderRadius:2,background:`linear-gradient(90deg,${C.a1},${C.r2})`}}/>
    </div>
  );
}

/* ═══ TOPBAR ═══ */
function Topbar(){
  const [sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>60);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:400,height:62,background:sc?"rgba(4,3,10,.97)":"transparent",borderBottom:sc?`1px solid ${C.bd}`:"none",backdropFilter:sc?"blur(22px)":"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 30px",transition:"all .4s"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${C.a1},${C.r1})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",boxShadow:`0 0 18px rgba(109,40,217,.4)`}}>🌹</div>
        <div>
          <div className="gulzar" style={{fontSize:"1rem",color:C.tx1,lineHeight:1.2}}>دربارِ لاثانی</div>
          <div className="cor" style={{fontSize:".62rem",letterSpacing:4,textTransform:"uppercase",color:C.tx3,direction:"ltr"}}>Lasani Sarkar — Spiritual Library</div>
        </div>
      </div>
      <div className="tb-nav-links" style={{display:"flex",gap:2,direction:"rtl"}}>
        {[["بیعت","bait-sec"],["وظائف","wazaif-sec"],["ذکر اذکار","degar-sec"],["کتب خانہ","library-sec"]].map(([l,id])=>(
          <button key={id} onClick={()=>go(id)} style={{padding:"7px 14px",borderRadius:6,fontFamily:"'Scheherazade New',serif",fontSize:".84rem",color:C.tx2,background:"transparent",border:"none",cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      <button onClick={()=>window.open("https://tmupi.com","_blank")} style={{padding:"8px 20px",borderRadius:20,background:`linear-gradient(135deg,${C.a1},${C.r1})`,color:"#fff",fontFamily:"'Cormorant Garamond',serif",fontSize:".7rem",letterSpacing:2,textTransform:"uppercase",border:"none",cursor:"pointer",boxShadow:`0 4px 18px rgba(109,40,217,.3)`}}>tmupi.com ↗</button>
    </nav>
  );
}

/* ═══ HERO ═══ */
function Hero({onExplore}){
  return(
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",paddingTop:62,position:"relative",overflow:"hidden",background:`radial-gradient(ellipse 70% 55% at 50% 40%,rgba(109,40,217,.14),transparent 70%),${C.bg0}`}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.1,pointerEvents:"none"}} viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice">
        <circle cx="700" cy="450" r="280" fill="none" stroke="#8b5cf6" strokeWidth=".5"><animateTransform attributeName="transform" type="rotate" from="0 700 450" to="360 700 450" dur="90s" repeatCount="indefinite"/></circle>
        <circle cx="700" cy="450" r="430" fill="none" stroke="#db2777" strokeWidth=".3"><animateTransform attributeName="transform" type="rotate" from="360 700 450" to="0 700 450" dur="130s" repeatCount="indefinite"/></circle>
        <polygon points="700,255 732,368 852,358 756,428 788,540 700,473 612,540 644,428 548,358 668,368" fill="none" stroke="#8b5cf6" strokeWidth=".4"><animateTransform attributeName="transform" type="rotate" from="0 700 450" to="360 700 450" dur="180s" repeatCount="indefinite"/></polygon>
      </svg>
      <div style={{textAlign:"center",padding:"60px 24px",maxWidth:860,position:"relative",zIndex:2}}>
        <div className="gulzar" style={{fontSize:"clamp(1.8rem,3.5vw,3rem)",color:C.o4,textShadow:"0 0 55px rgba(253,230,138,.28)",marginBottom:18,lineHeight:1.8,animation:"fadeup .9s .2s both"}}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
        <div style={{display:"flex",alignItems:"center",gap:16,justifyContent:"center",marginBottom:18,animation:"fadeup .9s .5s both"}}>
          <div style={{flex:1,maxWidth:90,height:1,background:`linear-gradient(90deg,transparent,${C.a2})`}}/>
          <div style={{width:9,height:9,background:C.a2,transform:"rotate(45deg)",boxShadow:`0 0 10px ${C.a2}`}}/>
          <div style={{flex:1,maxWidth:90,height:1,background:`linear-gradient(90deg,${C.a2},transparent)`}}/>
        </div>
        <div className="cor" style={{fontSize:".7rem",letterSpacing:5,textTransform:"uppercase",color:C.a3,marginBottom:14,direction:"ltr",animation:"fadeup .9s .7s both"}}>Tanzeem Mashaikh Uzam Pakistan · tmupi.com · Faisalabad</div>
        <h1 className="gulzar" style={{fontSize:"clamp(2.2rem,5.5vw,4.5rem)",lineHeight:1.5,marginBottom:10,animation:"fadeup .9s .9s both"}}>
          روحانی کتب خانہ<br/>
          <span style={{background:`linear-gradient(135deg,${C.a2},${C.r2},${C.t2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>حضرت لاثانی سرکار</span>
        </h1>
        <div className="amiri" style={{fontSize:"clamp(1rem,2.5vw,1.4rem)",color:C.tx2,lineHeight:2,marginBottom:36,animation:"fadeup .9s 1.1s both"}}>حضرت صوفی مسعود احمد صدیقی لاثانی سرکار — فیصل آباد، پاکستان</div>
        <div className="hero-badges" style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:42,animation:"fadeup .9s 1.3s both"}}>
          {["بیعت فارم","وظائف و تسبیحات","صلوٰۃ و سلام","شجرہ مبارک","کتب و رسائل"].map(b=>(
            <span key={b} style={{padding:"6px 18px",borderRadius:20,fontSize:".82rem",border:`1px solid rgba(109,40,217,.3)`,color:C.a3,background:"rgba(109,40,217,.08)"}}>{b}</span>
          ))}
        </div>
        <div className="hero-btns" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",animation:"fadeup .9s 1.5s both"}}>
          <button onClick={onExplore} style={{padding:"14px 34px",borderRadius:8,background:`linear-gradient(135deg,${C.a1},${C.r1})`,color:"#fff",fontFamily:"'Scheherazade New',serif",fontSize:".95rem",border:"none",cursor:"pointer",boxShadow:`0 8px 28px rgba(109,40,217,.28)`}}>📚 کتب خانہ کھولیں</button>
          <button onClick={()=>document.getElementById("bait-sec")?.scrollIntoView({behavior:"smooth"})} style={{padding:"14px 34px",borderRadius:8,background:"transparent",color:C.a3,fontFamily:"'Scheherazade New',serif",fontSize:".95rem",border:`1px solid ${C.bd2}`,cursor:"pointer"}}>بیعت فارم</button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
export default function App(){
  const [activePDF,setActivePDF]=useState(null);
  const inner={maxWidth:1280,margin:"0 auto"};
  const sec=(id,bg)=>({id,style:{padding:window.innerWidth<640?"60px 4vw":"96px 5vw",background:bg||C.bg0,position:"relative",zIndex:1}});

  useEffect(()=>{
    document.querySelectorAll("[data-ls]").forEach(e=>e.remove());
    const s=document.createElement("style");s.setAttribute("data-ls","1");s.textContent=GCSS;document.head.appendChild(s);
    return()=>s.remove();
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("vis");}),{threshold:.06,rootMargin:"0px 0px -36px 0px"});
    document.querySelectorAll(".rv").forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  });

  return(
    <div style={{background:C.bg0,minHeight:"100vh",direction:"rtl"}}>
      <Cursor/>
      <Topbar/>
      <Hero onExplore={()=>document.getElementById("library-sec")?.scrollIntoView({behavior:"smooth"})}/>

      {/* SECTION 1: BAIT */}
      <section {...sec("bait-sec",`linear-gradient(180deg,${C.bg0},${C.bg1})`)}>
        <div style={inner}>
          <div className="rv"><SecHead label="Section 01" ur="بیعت فارم" highlight="— عہدنامہ" en="Oath of Spiritual Initiation"/></div>
          <div className="bait-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
            <div className="rv">
              <div className="amiri" style={{fontSize:"1.1rem",lineHeight:2.4,color:C.tx1,padding:"22px 26px",background:"rgba(109,40,217,.07)",borderRight:`3px solid ${C.a2}`,borderRadius:"0 8px 8px 0",marginBottom:22,fontStyle:"italic"}}>سلسلہ عالیہ نقشبندیہ لاثانیہ میں داخل ہونے کے لیے یہ عقیدہ پڑھیں — بیعت ایک روحانی عہد ہے جو مرید اپنے مرشد کامل کے ہاتھ پر کرتا ہے۔</div>
              <p style={{fontFamily:"'Scheherazade New',serif",fontSize:".93rem",lineHeight:2.2,color:C.tx3,marginBottom:20}}>بیعت فارم پڑھیں، پُر کریں اور دربارِ لاثانی فیصل آباد بھیجیں۔</p>
              <div style={{marginBottom:20,padding:"13px 18px",borderRadius:8,background:"rgba(15,118,110,.08)",border:"1px solid rgba(15,118,110,.2)",fontFamily:"'Cormorant Garamond',serif",fontSize:".82rem",color:C.t3,direction:"ltr",lineHeight:1.8}}>
                📞 041-8720352 &nbsp;|&nbsp; +92 300 3586343<br/>📧 info@tmupi.com &nbsp;|&nbsp; 🌐 LasaniSarkar.org
              </div>
              <button onClick={()=>setActivePDF(PDFS.bait)} style={{display:"inline-flex",alignItems:"center",gap:12,padding:"14px 30px",borderRadius:8,background:`linear-gradient(135deg,${C.t1},${C.a1})`,color:"#fff",fontFamily:"'Scheherazade New',serif",fontSize:".95rem",border:"none",cursor:"pointer",boxShadow:`0 8px 28px rgba(15,118,110,.22)`}}>
                <span>📄</span> بیعت فارم کھولیں و پڑھیں
              </button>
            </div>
            <div className="rv"><BookThumbCard bookId="bait" ur="عہدنامہ — بیعت فارم" en="Lasani Sarkar Oath Form" onOpen={setActivePDF}/></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WAZAIF */}
      <section {...sec("wazaif-sec",C.bg1)}>
        <div style={inner}>
          <div className="rv"><SecHead label="Section 02" ur="وظائف" highlight="و تسبیحات" en="Wazaif — Daily Spiritual Practices & Prayers"/></div>
          <div className="wazaif-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:20}}>
            {WAZAIF_ITEMS.map((item,i)=>(
              <div key={item.id} className="rv" style={{animationDelay:`${i*.08}s`}}>
                <BookThumbCard bookId={item.id} ur={item.ur} en={item.en} onOpen={setActivePDF} delay={i*.08}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: DEGAR */}
      <section {...sec("degar-sec",`linear-gradient(180deg,${C.bg1},${C.bg0})`)}>
        <div style={inner}>
          <div className="rv"><SecHead label="Section 03" ur="دیگر وظائف" highlight="و ذکر اذکار" en="Additional Wazaif, Dhikr & Islamic Guidance"/></div>
          <div className="rv"><Accordion items={DEGAR_ITEMS}/></div>
        </div>
      </section>

      {/* SECTION 4: LIBRARY */}
      <section {...sec("library-sec",C.bg1)}>
        <div style={inner}>
          <div className="rv"><SecHead label="Section 04" ur="قائدِ روحانی انقلاب" highlight="— کتب خانہ" en="Complete Spiritual Library — All Books & Publications"/></div>
          {LIBRARY_CATS.map((cat,ci)=>(
            <div key={ci} className="rv" style={{marginBottom:64}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22,paddingBottom:14,borderBottom:`1px solid ${C.bd}`}}>
                <div style={{width:38,height:38,borderRadius:10,flexShrink:0,background:cat.grad,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"#fff"}}>{cat.label}</div>
                <div>
                  <div className="amiri" style={{fontSize:"1.1rem",color:C.tx0,fontWeight:700}}>{cat.ur}</div>
                  <div className="cor" style={{fontSize:".76rem",color:C.tx3,fontStyle:"italic",direction:"ltr"}}>{cat.en}</div>
                </div>
              </div>
              <div className="books-row" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:16}}>
                {cat.books.map((book,bi)=>(
                  <BookCard key={book.id} book={book} onOpen={setActivePDF} delay={bi*.07}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:C.bg0,borderTop:`1px solid ${C.bd}`,padding:"58px 5vw 34px",position:"relative",zIndex:1}}>
        <div style={inner}>
          <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:48,marginBottom:38,paddingBottom:38,borderBottom:`1px solid ${C.bd}`}}>
            <div>
              <div className="gulzar" style={{fontSize:"1.15rem",color:C.tx0,marginBottom:4}}>حضرت صوفی مسعود احمد صدیقی لاثانی سرکار</div>
              <div className="cor" style={{fontSize:".74rem",color:C.tx3,fontStyle:"italic",direction:"ltr",marginBottom:13}}>Hazrat Sufi Masood Ahmed Siddique Lasani Sarkar — Faisalabad, Pakistan</div>
              <div style={{fontSize:".8rem",color:C.tx3,lineHeight:2.2}}>تنظیم مشائخِ عظام پاکستان — روحانی کتب خانہ<br/>39/4 غلام رسول گرپیٹلز کالونی نمبر 2، فیصل آباد<br/>📞 041-8720352 · 📧 info@tmupi.com</div>
            </div>
            <div>
              <div className="cor" style={{fontSize:".6rem",letterSpacing:3,textTransform:"uppercase",color:C.a3,marginBottom:17,direction:"ltr"}}>Quick Links</div>
              {["بیعت فارم","وظائف","دیگر وظائف","کتب خانہ"].map(l=>(<div key={l} style={{marginBottom:9}}><span style={{fontSize:".8rem",color:C.tx3,cursor:"pointer"}}>{l}</span></div>))}
            </div>
            <div>
              <div className="cor" style={{fontSize:".6rem",letterSpacing:3,textTransform:"uppercase",color:C.a3,marginBottom:17,direction:"ltr"}}>Organizations</div>
              {[["tmupi.com","https://tmupi.com"],["Lasani Welfare","http://lasaniwelfare.com"],["IRPAP","http://irpap.com"]].map(([l,h])=>(
                <div key={l} style={{marginBottom:9}}><a href={h} target="_blank" rel="noreferrer" style={{fontSize:".8rem",color:C.tx3,textDecoration:"none"}}>{l}</a></div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",direction:"ltr"}}>
            <div className="cor" style={{fontSize:".68rem",color:"rgba(255,255,255,.14)"}}>© 2026 Tanzeem Mashaikh Uzam Pakistan — All Rights Reserved</div>
            <div style={{display:"flex",gap:14}}>
              {["tmupi.com","lasaniwelfare.com","irpap.com"].map(o=>(<span key={o} className="cor" style={{fontSize:".65rem",color:"rgba(255,255,255,.18)"}}>{o}</span>))}
            </div>
          </div>
        </div>
      </footer>

      {activePDF&&<PDFModal pdf={activePDF} onClose={()=>setActivePDF(null)}/>}
    </div>
  );
}
