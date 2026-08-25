"use client";

import { useEffect, useState } from "react";
import { mockSafetyData } from "./data/mock";

type Lang = "ko" | "en";
type Severity = "normal" | "danger" | "critical";
type PageView = "home" | "calls" | "esim" | "travel" | "safety" | "help" | "settings" | "topup";
type EntryView = "welcome" | "signup" | "login" | "app";

export default function Home() {
  const [lang, setLang] = useState<Lang>("ko");
  const [severity, setSeverity] = useState<Severity>("normal");
  const [checked, setChecked] = useState(false);
  const [esim, setEsim] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const [pageView, setPageView] = useState<PageView>("home");
  const [entryView, setEntryView] = useState<EntryView>("welcome");
  const subPageTitle: Record<PageView, string> = {
    home: "", calls: lang === "ko" ? "현지 통화" : "Local calls",
    esim: lang === "ko" ? "eSIM 관리" : "Manage eSIM",
    travel: lang === "ko" ? "여행" : "Trip", safety: "Safety",
    help: lang === "ko" ? "도움말" : "Help",
    settings: lang === "ko" ? "설정" : "Settings",
    topup: lang === "ko" ? "데이터 충전" : "Top up",
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 2200);
    if (window.localStorage.getItem("bero_session") === "active") {
      setEntryView("app");
      setIntro(false);
    }
    return () => window.clearTimeout(timer);
  }, []);

  const enterApp = () => {
    window.localStorage.setItem("bero_session", "active");
    setIntro(false);
    setEntryView("app");
  };
  const logout = () => {
    window.localStorage.removeItem("bero_session");
    setPageView("home");
    setEntryView("login");
  };

  if (entryView !== "app") return (<>
    <main className="entry-shell">
      {intro && <button className="bero-intro" onClick={()=>setIntro(false)} aria-label={lang === "ko" ? "인트로 건너뛰기" : "Skip intro"}>
        <span className="intro-orbit"><i/><em>B</em></span><strong>BeRo</strong><p>CONNECT <b>·</b> PROTECT <b>·</b> GO</p><small>GLOBAL eSIM · SAFETY</small><span className="intro-progress"/>
      </button>}
      {entryView === "welcome" ? <WelcomeBoard lang={lang} setLang={setLang} onSignup={()=>setEntryView("signup")} onLogin={()=>setEntryView("login")} onBiometric={enterApp}/> : entryView === "signup" ? <SignupBoard lang={lang} onBack={()=>setEntryView("welcome")} onComplete={enterApp}/> : <LoginBoard lang={lang} onBack={()=>setEntryView("welcome")} onComplete={enterApp}/>} 
    </main>
    <ChatSupport lang={lang}/>
  </>);

  return (<>
    <main className={`app-shell severity-${severity} ${severity !== "normal" ? "emergency-app" : "everyday-app"}`}>
      {intro && <button className="bero-intro" onClick={()=>setIntro(false)} aria-label={lang === "ko" ? "인트로 건너뛰기" : "Skip intro"}>
        <span className="intro-orbit"><i/><em>B</em></span>
        <strong>BeRo</strong>
        <p>CONNECT <b>·</b> PROTECT <b>·</b> GO</p>
        <small>GLOBAL eSIM · SAFETY</small>
        <span className="intro-progress"/>
      </button>}
      <header className={`topbar ${severity === "normal" && pageView !== "home" ? "subpage-topbar" : ""}`}>
        {severity === "normal" && pageView !== "home" ? <strong className="subpage-top-title">{subPageTitle[pageView]}</strong> : <div className="brand"><span className="brand-mark" aria-hidden="true"><i/><em>B</em></span><span className="brand-word"><strong>BeRo</strong><small>GLOBAL eSIM · SAFETY</small></span>{severity !== "normal" && <b>Safety</b>}</div>}
        <div className="header-actions">
          {pageView === "home" && <button className={`demo-toggle ${severity !== "normal" ? "on" : ""}`} onClick={() => setSeverity(severity === "normal" ? "danger" : severity === "danger" ? "critical" : "normal")}>{severity === "normal" ? "위험 DEMO" : severity === "danger" ? "최고 위험" : "평상시"}</button>}
          <button className="lang" onClick={() => setLang(lang === "ko" ? "en" : "ko")}>{lang === "ko" ? "EN" : "KO"}</button>
        </div>
      </header>

      {severity !== "normal" ? (
        <SafetyBoard lang={lang} critical={severity === "critical"} checked={checked} setChecked={setChecked} esim={esim} setEsim={setEsim} mapOpen={mapOpen} setMapOpen={setMapOpen} />
      ) : (
        pageView === "home" ? <EverydayBoard lang={lang} onNavigate={setPageView} /> : <SubPage view={pageView} lang={lang} onNavigate={setPageView} onLogout={logout}/>
      )}

      <nav className="bottom-nav" aria-label={lang === "ko" ? "주요 메뉴" : "Main menu"}>
        <button className={pageView==="home"?"active":""} onClick={()=>setPageView("home")} aria-label={severity !== "normal" ? (lang === "ko" ? "재난 홈" : "Safety home") : (lang === "ko" ? "홈" : "Home")}><span>{severity !== "normal" ? "✚" : "⌂"}</span><small>{severity !== "normal" ? (lang === "ko" ? "안전" : "Safety") : (lang === "ko" ? "홈" : "Home")}</small></button>
        <button className={pageView==="esim"?"active":""} onClick={()=>severity!=="normal"?setMapOpen(true):setPageView("esim")} aria-label={severity !== "normal" ? (lang === "ko" ? "안전 지도" : "Safety map") : (lang === "ko" ? "내 eSIM" : "My eSIM")}><span>{severity !== "normal" ? "⌖" : "▣"}</span><small>{severity !== "normal" ? (lang === "ko" ? "대피" : "Map") : "eSIM"}</small></button>
        <button className={pageView==="travel"?"active":""} onClick={()=>setPageView("travel")} aria-label={lang === "ko" ? "여행" : "Travel"}><span>✈</span><small>{lang === "ko" ? "여행" : "Trip"}</small></button>
        <button className={pageView==="settings"?"active":""} onClick={()=>setPageView("settings")} aria-label={lang === "ko" ? "설정" : "Settings"}><span>⚙</span><small>{lang === "ko" ? "설정" : "Settings"}</small></button>
      </nav>
    </main>
    {severity === "normal" && pageView !== "home" && <button className="back-button floating-back" onClick={()=>setPageView("home")} aria-label={lang === "ko" ? "뒤로" : "Back"}>‹</button>}
    <ChatSupport lang={lang}/>
  </>);
}

function ChatSupport({lang}:{lang:Lang}) {
  const [open,setOpen]=useState(false);
  const [sent,setSent]=useState(false);
  return <div className={`chat-support ${open?'open':''}`}>
    {open&&<section className="chat-panel" role="dialog" aria-label={lang==='ko'?'24시간 고객 상담':'24/7 customer support'}><header><span>●</span><div><b>BeRo AI Concierge</b><small>{lang==='ko'?'24시간 상담 중 · 평균 5초 이내':'Online 24/7 · replies in seconds'}</small></div><button onClick={()=>setOpen(false)} aria-label={lang==='ko'?'닫기':'Close'}>×</button></header><div className="chat-body"><div className="bot-message">{lang==='ko'?'안녕하세요, 지안님. eSIM 연결, 현지 통화, Safety 관련 무엇이든 도와드릴게요.':'Hello Jian. I can help with eSIM, local calls and Safety.'}</div>{sent&&<><div className="user-message">{lang==='ko'?'데이터 연결을 확인해 주세요.':'Please check my data connection.'}</div><div className="bot-message">{lang==='ko'?'현재 Japan eSIM은 정상 연결되어 있습니다. 자동 네트워크 점검을 시작할까요?':'Your Japan eSIM is connected. Start a network check?'}</div></>}<div className="chat-suggestions"><button onClick={()=>setSent(true)}>{lang==='ko'?'연결 문제':'Connection'}</button><button onClick={()=>setSent(true)}>Safety</button><button onClick={()=>setSent(true)}>{lang==='ko'?'상담원 연결':'Human agent'}</button></div></div><footer><input placeholder={lang==='ko'?'메시지를 입력하세요':'Type a message'}/><button onClick={()=>setSent(true)}>➤</button></footer></section>}
    <button className="chat-fab" onClick={()=>setOpen(!open)} aria-label={lang==='ko'?'24시간 상담 열기':'Open 24/7 support'}><span>{open?'×':'✦'}</span><b>24H CS</b><i/></button>
  </div>;
}

function WelcomeBoard({lang,setLang,onSignup,onLogin,onBiometric}:{lang:Lang;setLang:(v:Lang)=>void;onSignup:()=>void;onLogin:()=>void;onBiometric:()=>void}) {
  return <div className="welcome-page">
    <header className="entry-header"><div className="brand"><span className="brand-mark"><i/><em>B</em></span><span className="brand-word"><strong>BeRo</strong><small>GLOBAL eSIM · SAFETY</small></span></div><button className="lang" onClick={()=>setLang(lang==='ko'?'en':'ko')}>{lang==='ko'?'EN':'KO'}</button></header>
    <section className="welcome-hero global-welcome"><span>ONE eSIM · EVERYWHERE</span><h1>{lang==='ko'?'하나의 eSIM으로\n전 세계를 연결하세요':'One eSIM.\nConnected worldwide.'}</h1><p>{lang==='ko'?'국가가 바뀌어도 교체할 필요 없이 BeRo 하나로 연결됩니다.':'Stay connected across borders without switching eSIMs.'}</p><div className="global-orbit"><b>B</b><i/><i/><i/></div></section>
    <section className="global-pass"><span>GLOBAL PASS</span><div><b>190+</b><small>{lang==='ko'?'개 국가·지역':'countries & regions'}</small></div><p>{lang==='ko'?'한 번 설치 · 자동 네트워크 전환 · Safety 보호':'Install once · Auto network switching · Safety protection'}</p></section>
    <section className="entry-benefits"><div><span>✚</span><b>BeRo Safety</b><small>{lang==='ko'?'여행지 위험 실시간 알림':'Real-time travel alerts'}</small></div><div><span>☎</span><b>{lang==='ko'?'현지 통화':'Local calls'}</b><small>{lang==='ko'?'현지 번호 바로 사용':'Your local number'}</small></div></section>
    <div className="entry-account"><button className="signup-main" onClick={onSignup}>{lang==='ko'?'회원가입':'Create account'}</button><button className="biometric-login" onClick={onBiometric}><span>◎</span><b>{lang==='ko'?'생체정보로 로그인':'Sign in with biometrics'}</b><small>Face ID · Fingerprint</small></button><button className="login-link" onClick={onLogin}>{lang==='ko'?'이메일 또는 휴대폰으로 로그인':'Sign in with email or phone'}</button></div>
  </div>;
}

function SignupBoard({lang,onBack,onComplete}:{lang:Lang;onBack:()=>void;onComplete:()=>void}) {
  return <div className="signup-page"><header><button onClick={onBack} aria-label={lang==='ko'?'뒤로':'Back'}>‹</button><b>{lang==='ko'?'회원가입':'Create account'}</b><i/></header><section><span>WELCOME TO BERO</span><h1>{lang==='ko'?'여행을 더 자유롭게':'Travel with confidence'}</h1><p>{lang==='ko'?'eSIM과 Safety 서비스를 하나의 계정으로 이용하세요.':'One account for eSIM and Safety.'}</p><label>{lang==='ko'?'이름':'Name'}<input defaultValue="Jian"/></label><label>{lang==='ko'?'이메일':'Email'}<input type="email" placeholder="jian@example.com"/></label><label>{lang==='ko'?'비밀번호':'Password'}<input type="password" placeholder="••••••••"/></label><button className="signup-submit" onClick={onComplete}>{lang==='ko'?'가입하고 시작하기':'Create account'}</button><small>{lang==='ko'?'계속하면 이용약관 및 개인정보 처리방침에 동의하게 됩니다.':'By continuing, you agree to the Terms and Privacy Policy.'}</small></section></div>;
}

function LoginBoard({lang,onBack,onComplete}:{lang:Lang;onBack:()=>void;onComplete:()=>void}) {
  return <div className="signup-page login-page"><header><button onClick={onBack} aria-label={lang==='ko'?'뒤로':'Back'}>‹</button><b>{lang==='ko'?'로그인':'Sign in'}</b><i/></header><section><span>WELCOME BACK</span><h1>{lang==='ko'?'다시 만나서 반가워요':'Welcome back'}</h1><p>{lang==='ko'?'BeRo 계정으로 로그인하세요.':'Sign in to your BeRo account.'}</p><button className="login-biometric-large" onClick={onComplete}><span>◎</span>{lang==='ko'?'Face ID 또는 지문으로 로그인':'Use Face ID or fingerprint'}</button><div className="login-divider"><i/><span>{lang==='ko'?'또는':'OR'}</span><i/></div><label>{lang==='ko'?'이메일 또는 휴대폰':'Email or phone'}<input placeholder="jian@example.com"/></label><label>{lang==='ko'?'비밀번호':'Password'}<input type="password" placeholder="••••••••"/></label><button className="signup-submit" onClick={onComplete}>{lang==='ko'?'로그인':'Sign in'}</button><button className="forgot-password">{lang==='ko'?'비밀번호를 잊으셨나요?':'Forgot password?'}</button></section></div>;
}

function EverydayBoard({ lang, onNavigate }: { lang: Lang; onNavigate:(view:PageView)=>void }) {
  const [vpn, setVpn] = useState(false);
  return <>
    <section className="normal-hero">
      <div className="normal-greeting"><span>{lang === "ko" ? "안녕하세요, 지안님" : "Hello, Jian"}</span><small>{lang === "ko" ? "일본 여행 연결 상태" : "Japan trip connection"}</small></div>
      <div className="connection-pill"><i /> {lang === "ko" ? "연결됨" : "Connected"}</div>
      <div className="data-ring"><div><strong>7.4</strong><span>GB</span><small>{lang === "ko" ? "남은 데이터" : "remaining"}</small></div></div>
      <div className="plan-line"><div><small>{lang === "ko" ? "Japan 10GB" : "Japan 10GB"}</small><b>{lang === "ko" ? "2026. 09. 02까지" : "Valid until Sep 2, 2026"}</b></div><button onClick={()=>onNavigate("topup")}>{lang === "ko" ? "충전" : "Top up"} +</button></div>
    </section>
    <div className="content normal-content">
      <section><Heading eyebrow="TRAVEL CONNECT" title={lang === "ko" ? "여행 연결 허브" : "Travel connection hub"}/><div className="capability-grid">
        <button className="capability call-cap" onClick={()=>onNavigate("calls")} aria-label={lang === "ko" ? "현지 통화 열기" : "Open local calls"}><span className="cap-icon">☎</span><div><small>LOCAL CALL</small><strong>{lang === "ko" ? "현지 통화" : "Local calls"}</strong><p><b>28</b>{lang === "ko" ? "분 남음" : " min left"}</p></div><em>›</em></button>
        <button className="capability safety-cap" onClick={()=>onNavigate("safety")} aria-label={lang === "ko" ? "Safety 상태 보기" : "View Safety status"}><span className="cap-icon">✚</span><div><small>BERO SAFETY</small><strong>{lang === "ko" ? "안전 보호 중" : "Safety active"}</strong><p><i/>{lang === "ko" ? "현재 이상 없음" : "No threats nearby"}</p></div><em>›</em></button>
      </div><div className="local-number"><span>JP</span><div><small>{lang === "ko" ? "나의 일본 현지번호" : "My Japan local number"}</small><strong>+81 70 1234 5678</strong></div><button aria-label={lang === "ko" ? "번호 복사" : "Copy number"}>▣</button></div></section>
      <section><Heading eyebrow="QUICK" title={lang === "ko" ? "빠른 실행" : "Quick actions"}/><div className="quick-grid action-grid compact-actions">
        <ActionTile icon="☎" title={lang === "ko" ? "현지 전화" : "Local call"} onClick={()=>onNavigate("calls")}/>
        <ActionTile icon="＋" title={lang === "ko" ? "eSIM 구매" : "Buy eSIM"} onClick={()=>onNavigate("esim")}/>
        <ActionTile icon="?" title={lang === "ko" ? "도움" : "Help"} onClick={()=>onNavigate("help")}/>
        <ActionTile icon="◈" title={vpn ? (lang === "ko" ? "VPN 연결됨" : "VPN connected") : "VPN"} active={vpn} onClick={()=>setVpn(!vpn)}/>
      </div></section>
      <aside className="safety-ready"><span>✚</span><div><small>ALWAYS ON</small><strong>{lang === "ko" ? "BeRo Safety가 백그라운드에서 보호 중" : "BeRo Safety is protecting you"}</strong><p>{lang === "ko" ? "위험 감지 시 데이터와 현지 통화를 유지한 채 즉시 재난 보드로 전환됩니다." : "When danger is detected, BeRo keeps your data and calls connected and switches to the emergency board."}</p></div><button onClick={()=>onNavigate("safety")} aria-label={lang === "ko" ? "Safety 자세히 보기" : "Learn about Safety"}>›</button></aside>
    </div>
  </>;
}

function SubPage({view,lang,onNavigate,onLogout}:{view:PageView;lang:Lang;onNavigate:(view:PageView)=>void;onLogout:()=>void}) {
  const [enabled,setEnabled]=useState(true);
  const titles:Record<PageView,[string,string,string]>={
    home:['','',''],calls:['LOCAL CALL',lang==='ko'?'일본 현지 통화':'Local calls',lang==='ko'?'데이터 없이도 현지 번호로 통화하세요.':'Call locally with your Japan number.'],
    esim:['MY eSIM',lang==='ko'?'eSIM 관리':'Manage eSIM',lang==='ko'?'사용 중인 요금제와 추가 상품을 확인하세요.':'View your plan and add another eSIM.'],
    travel:['MY TRIP',lang==='ko'?'도쿄 여행':'Tokyo trip',lang==='ko'?'연결과 안전 정보를 여행 일정과 함께 관리합니다.':'Keep connectivity and safety with your itinerary.'],
    safety:['BERO SAFETY',lang==='ko'?'여행 안전 센터':'Travel safety center',lang==='ko'?'반경 100km의 위험을 실시간으로 확인합니다.':'Monitoring risks within 100km.'],
    help:['SUPPORT',lang==='ko'?'무엇을 도와드릴까요?':'How can we help?',lang==='ko'?'자주 찾는 도움을 빠르게 확인하세요.':'Find the help you need quickly.'],
    settings:['PREFERENCES',lang==='ko'?'설정':'Settings',lang==='ko'?'연결, 알림, 언어와 개인정보를 관리합니다.':'Manage connection, alerts and privacy.'],
    topup:['DATA TOP UP',lang==='ko'?'데이터 충전':'Top up data',lang==='ko'?'현재 eSIM에 데이터를 바로 추가하세요.':'Add data to your current eSIM.']};
  const [eyebrow,title,desc]=titles[view];
  return <div className="subpage">
    <section className={`subpage-hero sub-${view}`}><span>{eyebrow}</span><h1>{title}</h1><p>{desc}</p></section>
    <div className="subpage-content">
      {view==='calls'&&<><article className="balance-card"><small>{lang==='ko'?'남은 통화':'CALL BALANCE'}</small><strong>28 <em>{lang==='ko'?'분':'min'}</em></strong><p>+81 70 1234 5678</p></article><div className="dial-actions"><a href="tel:+817012345678">☎ <b>{lang==='ko'?'전화 걸기':'Call now'}</b></a><button>▣ <b>{lang==='ko'?'번호 복사':'Copy number'}</b></button></div><SubList rows={[["◎",lang==='ko'?'한국 대사관':'Korean Embassy','+81 3 3452 7611'],["110",lang==='ko'?'일본 경찰':'Japan Police',lang==='ko'?'긴급':'Emergency'],["119",lang==='ko'?'구급·소방':'Ambulance & Fire',lang==='ko'?'긴급':'Emergency']]}/></>}
      {view==='esim'&&<><article className="plan-detail"><div><small>ACTIVE eSIM</small><h2>Japan 10GB</h2><p>NTT DOCOMO · 5G</p></div><strong>7.4<em>GB</em></strong><span><i style={{width:'74%'}}/></span><footer>{lang==='ko'?'2026. 09. 02까지':'Valid until Sep 2, 2026'}</footer></article><h3 className="sub-section-title">{lang==='ko'?'추천 eSIM':'Recommended eSIMs'}</h3><div className="product-row"><button><b>Japan</b><strong>5GB</strong><small>15 DAYS · ₩12,900</small></button><button><b>Asia</b><strong>10GB</strong><small>30 DAYS · ₩29,900</small></button></div></>}
      {view==='travel'&&<><article className="trip-card"><small>JAPAN · TOKYO</small><h2>Aug 24 — Sep 2</h2><div><span>✈ ICN</span><i/><span>HND</span></div><p>9 {lang==='ko'?'박':'nights'} · Shibuya</p></article><SubList rows={[["◉",lang==='ko'?'Safety 모니터링':'Safety monitoring',lang==='ko'?'반경 100km 활성':'100km active'],["▣",lang==='ko'?'Japan eSIM':'Japan eSIM','7.4GB'],["☎",lang==='ko'?'현지 통화':'Local calls',lang==='ko'?'28분':'28 min']]}/></>}
      {view==='safety'&&<><article className="safe-status"><span>✓</span><div><small>LIVE STATUS</small><h2>{lang==='ko'?'현재 안전합니다':'You are safe'}</h2><p>{lang==='ko'?'도쿄 시부야 · 특이사항 없음':'Shibuya, Tokyo · No active threats'}</p></div></article><div className="radius-row">{['10','30','50','100'].map((r,i)=><button className={i===3?'selected':''} key={r}>{r}<small>km</small></button>)}</div><SubList rows={[["⌁",lang==='ko'?'지진':'Earthquake',lang==='ko'?'이상 없음':'Clear'],["≋",lang==='ko'?'쓰나미':'Tsunami',lang==='ko'?'이상 없음':'Clear'],["☂",lang==='ko'?'기상 특보':'Weather alerts',lang==='ko'?'이상 없음':'Clear'],["!",lang==='ko'?'치안·테러':'Security',lang==='ko'?'이상 없음':'Clear']]}/></>}
      {view==='help'&&<><label className="help-search">⌕<input placeholder={lang==='ko'?'질문을 검색하세요':'Search for help'}/></label><div className="help-grid"><button onClick={()=>onNavigate('esim')}>▣<b>eSIM</b></button><button onClick={()=>onNavigate('calls')}>☎<b>{lang==='ko'?'통화':'Calls'}</b></button><button onClick={()=>onNavigate('safety')}>✚<b>Safety</b></button><button>◈<b>VPN</b></button></div><SubList rows={[["?",lang==='ko'?'eSIM 설치 방법':'How to install eSIM','›'],["?",lang==='ko'?'데이터가 연결되지 않아요':'Data is not connecting','›'],["?",lang==='ko'?'24시간 채팅 상담':'24/7 chat support','›']]}/></>}
      {view==='settings'&&<><SubList rows={[["◎",lang==='ko'?'언어':'Language',lang==='ko'?'한국어':'English'],["♟",lang==='ko'?'여행 프로필':'Travel profile','Jian'],["⌖",lang==='ko'?'위치 권한':'Location access',lang==='ko'?'사용 중':'Enabled']]}/><h3 className="sub-section-title">{lang==='ko'?'알림 설정':'Notifications'}</h3><button className="setting-toggle" onClick={()=>setEnabled(!enabled)}><span>✚</span><div><b>{lang==='ko'?'재난 긴급 알림':'Emergency alerts'}</b><small>{lang==='ko'?'현재 위치 기반 알림':'Location-based warnings'}</small></div><i className={enabled?'on':''}/></button><button className="setting-toggle"><span>◈</span><div><b>VPN Auto Protect</b><small>{lang==='ko'?'공공 Wi-Fi 자동 보호':'Protect on public Wi-Fi'}</small></div><i className="on"/></button><button className="logout-button" onClick={onLogout}>{lang==='ko'?'로그아웃':'Sign out'}</button></>}
      {view==='topup'&&<><article className="topup-current"><small>{lang==='ko'?'현재 잔여량':'CURRENT DATA'}</small><strong>7.4GB</strong><p>Japan 10GB · Sep 2</p></article><div className="topup-options">{[['1GB','₩3,900'],['3GB','₩8,900'],['5GB','₩12,900']].map((x,i)=><button className={i===1?'selected':''} key={x[0]}><strong>{x[0]}</strong><span>{x[1]}</span><small>{lang==='ko'?'즉시 충전':'Instant'}</small></button>)}</div><button className="purchase-button">{lang==='ko'?'3GB 충전하기 · ₩8,900':'Top up 3GB · ₩8,900'}</button></>}
    </div>
  </div>;
}

function SubList({rows}:{rows:string[][]}) {return <div className="sub-list">{rows.map((r,i)=><button key={i}><span>{r[0]}</span><div><b>{r[1]}</b><small>{r[2]}</small></div><em>›</em></button>)}</div>}

function SafetyBoard({lang,critical,checked,setChecked,esim,setEsim,mapOpen,setMapOpen}:{lang:Lang;critical:boolean;checked:boolean;setChecked:(v:boolean)=>void;esim:boolean;setEsim:(v:boolean)=>void;mapOpen:boolean;setMapOpen:(v:boolean)=>void}) {
  return <>
    <div className="mode-transition"><span>{critical ? "×" : "!"}</span><div><b>{critical ? (lang === "ko" ? "최고 위험 단계" : "CRITICAL THREAT") : (lang === "ko" ? "BeRo Safety 모드 활성화" : "BeRo Safety mode activated")}</b><small>{critical ? (lang === "ko" ? "생명 위험 · 즉시 행동하십시오" : "Life threatening · act immediately") : (lang === "ko" ? "재난 신호 감지 · 통신 연결 유지 중" : "Disaster signal detected · connection secured")}</small></div></div>
    <section className={`hero danger ${critical ? "maximum-danger" : ""}`}><div className="location">⌖ {mockSafetyData.location[lang]}</div><div className="safe-row"><div className="safe-orb">{critical ? "×" : "!"}</div><div><p>{critical ? (lang === "ko" ? "최고 위험" : "CRITICAL THREAT") : (lang === "ko" ? "현재 위치 위험" : "LOCATION AT RISK")}</p><h1>{critical ? (lang === "ko" ? "생명이 위험합니다" : "Life at risk") : (lang === "ko" ? "즉시 대피하세요" : "Evacuate now")}</h1></div></div><p className="hero-copy">{critical ? (lang === "ko" ? "쓰나미 도달이 임박했습니다. 경보를 기다리지 말고 지금 가장 높은 곳으로 이동하세요." : "Tsunami arrival is imminent. Do not wait—move to the highest nearby place now.") : (lang === "ko" ? "현재 위치가 쓰나미 침수 예상 구역에 포함됩니다. 높은 곳으로 이동하세요." : "Your location is inside a projected tsunami zone. Move to higher ground.")}</p><button className="evacuate" onClick={()=>setMapOpen(true)}><span>⌖</span><b>{lang === "ko" ? "가장 가까운 대피소" : "Nearest shelter"}</b><small>{lang === "ko" ? "650m · 도보 8분" : "650m · 8 min walk"}</small><em>›</em></button></section>
    <div className="emergency-actions"><button onClick={()=>setMapOpen(true)}><b>⌖</b><span>{lang === "ko" ? "대피 경로" : "Evacuate"}</span><small>{lang === "ko" ? "지금 이동" : "Go now"}</small></button><button onClick={()=>setChecked(true)}><b>♥</b><span>{lang === "ko" ? "나는 안전해요" : "I'm safe"}</span><small>{checked ? (lang === "ko" ? "전송 완료" : "Sent") : (lang === "ko" ? "가족에게 알림" : "Notify family")}</small></button><a href="tel:119"><b>☎</b><span>119</span><small>{lang === "ko" ? "구급·소방" : "Emergency"}</small></a></div>
    <div className="content">
      <section><Heading eyebrow="EMERGENCY ALERT" title={lang === "ko" ? "쓰나미 경보" : "Tsunami warning"}/><article className="alert-card critical"><div className="alert-icon">!</div><div className="alert-body"><div className="alert-meta"><span className="chip">JMA MOCK</span><time>14:32</time></div><h3>{lang === "ko" ? "도쿄만 연안 쓰나미 경보" : "Tsunami warning for Tokyo Bay"}</h3><p>{lang === "ko" ? "해안과 하천에서 즉시 벗어나 높은 곳으로 이동하세요." : "Leave coastal and riverside areas and move to higher ground."}</p></div></article></section>
      <section><Heading eyebrow="EVACUATION" title={lang === "ko" ? "가까운 대피소" : "Nearby shelters"}/>{mockSafetyData.shelters.map((s,i)=><article className="shelter" key={s.id}><div className="number">{i+1}</div><div className="shelter-main"><strong>{s.name[lang]}</strong><p>{s.distanceM}m · {lang === "ko" ? `도보 ${s.walkMin}분` : `${s.walkMin} min walk`}</p></div><button onClick={()=>setMapOpen(true)}>›</button></article>)}</section>
      <section className="check-card"><span className="small-icon">♥</span><div><h2>Safety Check</h2><p>{lang === "ko" ? "가족과 동행자에게 내 상태를 알려주세요." : "Let your family and companions know."}</p><button onClick={()=>setChecked(true)} className={checked?"done":"primary"}>{checked?"✓ 전송 완료":(lang === "ko"?"나는 안전합니다":"I'm safe")}</button></div></section>
      <section><Heading eyebrow="SOS" title={lang === "ko" ? "긴급 연락" : "Emergency contacts"}/><div className="sos-grid"><a href="tel:110"><b>110</b><span>{lang === "ko" ? "경찰" : "Police"}</span></a><a href="tel:119"><b>119</b><span>{lang === "ko" ? "구급·소방" : "Ambulance"}</span></a><a href="tel:+81334521073"><b>◎</b><span>{lang === "ko" ? "영사관" : "Consulate"}</span></a></div></section>
      <section className="esim-card"><div className="esim-head"><span>EMERGENCY DATA</span><b>1GB · 24H</b></div><h2>{lang === "ko" ? "통신 연결을 유지하세요" : "Stay connected"}</h2><p>{lang === "ko" ? "재난 상황에서 사용할 긴급 데이터를 무료로 제공합니다." : "Emergency data is provided free during the disaster."}</p><button onClick={()=>setEsim(true)} className={esim?"done dark":"primary light"}>{esim?"✓ 활성화됨":(lang === "ko"?"긴급 데이터 받기":"Activate emergency data")}</button></section>
    </div>
    {mapOpen&&<div className="modal" role="dialog" aria-modal="true"><div className="full-map"><button className="close" onClick={()=>setMapOpen(false)}>×</button><div className="map-title"><b>{lang === "ko" ? "대피 경로" : "Evacuation route"}</b><span>{mockSafetyData.location[lang]}</span></div><div className="roads r1"/><div className="roads r2"/><div className="zone danger-zone"/><span className="big-you">●<small>{lang === "ko" ? "내 위치" : "You"}</small></span><span className="big-shelter">⌂<small>{mockSafetyData.shelters[0].name[lang]}</small></span><div className="route-line"/></div></div>}
  </>;
}

function Heading({eyebrow,title,action}:{eyebrow:string;title:string;action?:string}) { return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action&&<button className="text-button icon-action" aria-label={action} title={action}>•••</button>}</div>; }
function ActionTile({icon,title,active=false,onClick}:{icon:string;title:string;active?:boolean;onClick?:()=>void}) { return <button className={`action-tile ${active?"vpn-active":""}`} aria-label={title} aria-pressed={active} onClick={onClick}><b>{icon}</b><span>{title}</span>{active&&<small>SECURE</small>}</button>; }
