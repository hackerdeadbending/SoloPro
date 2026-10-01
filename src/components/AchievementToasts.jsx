import {useCallback,useEffect,useRef,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useApp} from '../context/AppState';
import {createTranslator} from '../i18n';
import './achievement-toasts.css';

const COPY={
English:{accountCreated:'You registered in SoloPro',accountCreatedSub:'Your workspace is ready.',clientsOpened:'Clients opened',clientsOpenedSub:'Your client workspace is ready to use.',firstService:'First service recorded',firstServiceSub:'Your business history has started.',firstIncome:'First income added',firstIncomeSub:'Your revenue is now being tracked.',firstExpense:'First expense added',firstExpenseSub:'Your business costs are now being tracked.'},
Ukrainian:{accountCreated:'Ви зареєструвалися в SoloPro',accountCreatedSub:'Ваш робочий простір готовий.',clientsOpened:'Ви відкрили Клієнтів',clientsOpenedSub:'Розділ клієнтів готовий до роботи.',firstService:'Першу послугу записано',firstServiceSub:'Історія вашого бізнесу розпочалася.',firstIncome:'Перший дохід додано',firstIncomeSub:'Тепер ваш дохід відстежується.',firstExpense:'Першу витрату додано',firstExpenseSub:'Тепер ваші витрати відстежуються.'},
Italian:{accountCreated:'Ti sei registrato su SoloPro',accountCreatedSub:'Il tuo spazio di lavoro è pronto.',clientsOpened:'Hai aperto Clienti',clientsOpenedSub:'Il tuo spazio clienti è pronto.',firstService:'Prima prestazione registrata',firstServiceSub:'La cronologia della tua attività è iniziata.',firstIncome:'Prima entrata aggiunta',firstIncomeSub:'Ora le tue entrate vengono monitorate.',firstExpense:'Prima spesa aggiunta',firstExpenseSub:'Ora le tue spese vengono monitorate.'},
French:{accountCreated:'Vous vous êtes inscrit sur SoloPro',accountCreatedSub:'Votre espace de travail est prêt.',clientsOpened:'Clients ouvert',clientsOpenedSub:'Votre espace clients est prêt.',firstService:'Premier service enregistré',firstServiceSub:'L’historique de votre activité commence.',firstIncome:'Premier revenu ajouté',firstIncomeSub:'Vos revenus sont maintenant suivis.',firstExpense:'Première dépense ajoutée',firstExpenseSub:'Vos dépenses sont maintenant suivies.'},
German:{accountCreated:'Du hast dich bei SoloPro registriert',accountCreatedSub:'Dein Arbeitsbereich ist bereit.',clientsOpened:'Kunden geöffnet',clientsOpenedSub:'Dein Kundenbereich ist bereit.',firstService:'Erster Service erfasst',firstServiceSub:'Deine Geschäftshistorie beginnt.',firstIncome:'Erster Umsatz hinzugefügt',firstIncomeSub:'Deine Einnahmen werden jetzt erfasst.',firstExpense:'Erste Ausgabe hinzugefügt',firstExpenseSub:'Deine Ausgaben werden jetzt erfasst.'},
Spanish:{accountCreated:'Te registraste en SoloPro',accountCreatedSub:'Tu espacio de trabajo está listo.',clientsOpened:'Clientes abierto',clientsOpenedSub:'Tu espacio de clientes está listo.',firstService:'Primer servicio registrado',firstServiceSub:'Tu historial de negocio ha comenzado.',firstIncome:'Primer ingreso añadido',firstIncomeSub:'Ahora se registran tus ingresos.',firstExpense:'Primer gasto añadido',firstExpenseSub:'Ahora se registran tus gastos.'},
Portuguese:{accountCreated:'Você se registrou no SoloPro',accountCreatedSub:'Seu espaço de trabalho está pronto.',clientsOpened:'Clientes aberto',clientsOpenedSub:'Seu espaço de clientes está pronto.',firstService:'Primeiro serviço registado',firstServiceSub:'O histórico do seu negócio começou.',firstIncome:'Primeira receita adicionada',firstIncomeSub:'As suas receitas agora são acompanhadas.',firstExpense:'Primeira despesa adicionada',firstExpenseSub:'As suas despesas agora são acompanhadas.'},
Dutch:{accountCreated:'Je hebt je geregistreerd bij SoloPro',accountCreatedSub:'Je werkruimte is klaar.',clientsOpened:'Klanten geopend',clientsOpenedSub:'Je klantenruimte is klaar.',firstService:'Eerste dienst geregistreerd',firstServiceSub:'Je bedrijfsgeschiedenis is gestart.',firstIncome:'Eerste inkomsten toegevoegd',firstIncomeSub:'Je inkomsten worden nu bijgehouden.',firstExpense:'Eerste uitgave toegevoegd',firstExpenseSub:'Je uitgaven worden nu bijgehouden.'},
Polish:{accountCreated:'Zarejestrowałeś się w SoloPro',accountCreatedSub:'Twoja przestrzeń robocza jest gotowa.',clientsOpened:'Otwarto klientów',clientsOpenedSub:'Twoja przestrzeń klientów jest gotowa.',firstService:'Zapisano pierwszą usługę',firstServiceSub:'Historia Twojej firmy właśnie się zaczęła.',firstIncome:'Dodano pierwszy przychód',firstIncomeSub:'Przychody są teraz śledzone.',firstExpense:'Dodano pierwszy wydatek',firstExpenseSub:'Wydatki są teraz śledzone.'},
Czech:{accountCreated:'Zaregistrovali jste se v SoloPro',accountCreatedSub:'Váš pracovní prostor je připraven.',clientsOpened:'Otevřeni klienti',clientsOpenedSub:'Váš prostor pro klienty je připraven.',firstService:'První služba zaznamenána',firstServiceSub:'Historie vašeho podnikání začala.',firstIncome:'Přidán první příjem',firstIncomeSub:'Vaše příjmy se nyní sledují.',firstExpense:'Přidán první výdaj',firstExpenseSub:'Vaše výdaje se nyní sledují.'},
Finnish:{accountCreated:'Rekisteröidyit SoloProhon',accountCreatedSub:'Työtilasi on valmis.',clientsOpened:'Asiakkaat avattu',clientsOpenedSub:'Asiakastilasi on valmis.',firstService:'Ensimmäinen palvelu kirjattu',firstServiceSub:'Yrityksesi historia on alkanut.',firstIncome:'Ensimmäinen tulo lisätty',firstIncomeSub:'Tulojasi seurataan nyt.',firstExpense:'Ensimmäinen kulu lisätty',firstExpenseSub:'Kulujasi seurataan nyt.'},
Swedish:{accountCreated:'Du registrerade dig på SoloPro',accountCreatedSub:'Din arbetsyta är klar.',clientsOpened:'Kunder öppnade',clientsOpenedSub:'Din kundyta är klar.',firstService:'Första tjänsten registrerad',firstServiceSub:'Din företagshistorik har börjat.',firstIncome:'Första intäkten tillagd',firstIncomeSub:'Dina intäkter följs nu.',firstExpense:'Första utgiften tillagd',firstExpenseSub:'Dina utgifter följs nu.'},
Danish:{accountCreated:'Du registrerede dig på SoloPro',accountCreatedSub:'Dit arbejdsområde er klar.',clientsOpened:'Kunder åbnet',clientsOpenedSub:'Dit kundeområde er klar.',firstService:'Første service registreret',firstServiceSub:'Din virksomhedshistorik er begyndt.',firstIncome:'Første indtægt tilføjet',firstIncomeSub:'Dine indtægter bliver nu fulgt.',firstExpense:'Første udgift tilføjet',firstExpenseSub:'Dine udgifter bliver nu fulgt.'},
Norwegian:{accountCreated:'Du registrerte deg på SoloPro',accountCreatedSub:'Arbeidsområdet ditt er klart.',clientsOpened:'Kunder åpnet',clientsOpenedSub:'Kundeområdet ditt er klart.',firstService:'Første tjeneste registrert',firstServiceSub:'Bedriftshistorikken din har startet.',firstIncome:'Første inntekt lagt til',firstIncomeSub:'Inntektene dine følges nå.',firstExpense:'Første utgift lagt til',firstExpenseSub:'Utgiftene dine følges nå.'},
Icelandic:{accountCreated:'Þú skráðir þig á SoloPro',accountCreatedSub:'Vinnusvæðið þitt er tilbúið.',clientsOpened:'Viðskiptavinir opnað',clientsOpenedSub:'Viðskiptavinasvæðið þitt er tilbúið.',firstService:'Fyrsta þjónusta skráð',firstServiceSub:'Saga fyrirtækisins þíns er hafin.',firstIncome:'Fyrstu tekjum bætt við',firstIncomeSub:'Tekjurnar þínar eru nú skráðar.',firstExpense:'Fyrstu gjöldum bætt við',firstExpenseSub:'Gjöldin þín eru nú skráð.'},
Arabic:{accountCreated:'لقد سجلت في SoloPro',accountCreatedSub:'مساحة عملك جاهزة.',clientsOpened:'تم فتح العملاء',clientsOpenedSub:'مساحة العملاء جاهزة للاستخدام.',firstService:'تم تسجيل أول خدمة',firstServiceSub:'بدأ سجل نشاطك التجاري.',firstIncome:'تمت إضافة أول دفعة دخل',firstIncomeSub:'يتم الآن تتبع دخلك.',firstExpense:'تمت إضافة أول مصروف',firstExpenseSub:'يتم الآن تتبع مصروفاتك.'},
Chinese:{accountCreated:'你已注册 SoloPro',accountCreatedSub:'你的工作空间已准备就绪。',clientsOpened:'已打开客户',clientsOpenedSub:'你的客户工作区已准备好。',firstService:'已记录第一项服务',firstServiceSub:'你的业务记录开始了。',firstIncome:'已添加第一笔收入',firstIncomeSub:'现在开始跟踪你的收入。',firstExpense:'已添加第一笔支出',firstExpenseSub:'现在开始跟踪你的支出。'},
Japanese:{accountCreated:'SoloPro に登録しました',accountCreatedSub:'ワークスペースの準備ができました。',clientsOpened:'顧客を開きました',clientsOpenedSub:'顧客ワークスペースを使い始められます。',firstService:'最初のサービスを記録しました',firstServiceSub:'ビジネス履歴が始まりました。',firstIncome:'最初の収入を追加しました',firstIncomeSub:'収入の記録が始まりました。',firstExpense:'最初の支出を追加しました',firstExpenseSub:'支出の記録が始まりました。'},
Korean:{accountCreated:'SoloPro에 가입했습니다',accountCreatedSub:'워크스페이스가 준비되었습니다.',clientsOpened:'고객을 열었습니다',clientsOpenedSub:'고객 워크스페이스를 사용할 수 있습니다.',firstService:'첫 서비스를 기록했습니다',firstServiceSub:'비즈니스 기록이 시작되었습니다.',firstIncome:'첫 수입을 추가했습니다',firstIncomeSub:'이제 수입이 추적됩니다.',firstExpense:'첫 지출을 추가했습니다',firstExpenseSub:'이제 지출이 추적됩니다.'}
};

const ICONS={accountCreated:'✦',clientsOpened:'♙',firstService:'✦',firstIncome:'↗',firstExpense:'↘'};

function playAchievementSound(){
  try{
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)return;
    const ctx=new C();
    const now=ctx.currentTime;
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(660,now);
    osc.frequency.exponentialRampToValueAtTime(880,now+.12);
    gain.gain.setValueAtTime(.0001,now);
    gain.gain.exponentialRampToValueAtTime(.055,now+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,now+.34);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start(now);osc.stop(now+.36);
    osc.addEventListener('ended',()=>ctx.close().catch(()=>{}),{once:true});
  }catch{}
}

export default function AchievementToasts(){
  const app=useApp();
  const location=useLocation();
  const [queue,setQueue]=useState([]);
  const [active,setActive]=useState(null);
  const seenRef=useRef(new Set());
  const baselineRef=useRef(null);
  const premium=Boolean(app.premiumActive||app.isAdmin);
  const email=String(app.authSession?.user?.email||app.account?.email||'').trim().toLowerCase();
  const storageKey=email?'solopro-achievements:'+email:'';
  const copy=Object.assign({},COPY.English,COPY[app.language]||{});

  const markSeen=useCallback(id=>{
    if(!storageKey)return;
    seenRef.current.add(id);
    try{
      const list=JSON.parse(localStorage.getItem(storageKey)||'[]');
      if(!list.includes(id)){
        list.push(id);
        localStorage.setItem(storageKey,JSON.stringify(list));
      }
    }catch{}
  },[storageKey]);

  const fire=useCallback(id=>{
    if(!premium||!storageKey||seenRef.current.has(id))return;
    seenRef.current.add(id);
    markSeen(id);
    setQueue(q=>[...q,{id}]);
  },[premium,storageKey,markSeen]);

  useEffect(()=>{
    if(!storageKey){seenRef.current=new Set();return;}
    try{
      const list=JSON.parse(localStorage.getItem(storageKey)||'[]');
      seenRef.current=new Set(Array.isArray(list)?list:[]);
    }catch{seenRef.current=new Set();}
    baselineRef.current=null;
  },[storageKey]);

  useEffect(()=>{
    if(!premium||!storageKey)return;
    if(app.account?.createdAt)fire('accountCreated');
  },[premium,storageKey,app.account?.createdAt,fire]);

  useEffect(()=>{
    if(!premium||!storageKey)return;
    if(location.pathname==='/clients')fire('clientsOpened');
  },[premium,storageKey,location.pathname,fire]);

  useEffect(()=>{
    if(!premium||!storageKey)return;
    const snapshot={
      services:Array.isArray(app.services)?app.services.length:0,
      income:Array.isArray(app.financialIncome)?app.financialIncome.length:0,
      expenses:Array.isArray(app.financialExpenses)?app.financialExpenses.length:0
    };
    if(!baselineRef.current){baselineRef.current=snapshot;return;}
    const prev=baselineRef.current;
    if(snapshot.services>prev.services)fire('firstService');
    if(snapshot.income>prev.income)fire('firstIncome');
    if(snapshot.expenses>prev.expenses)fire('firstExpense');
    baselineRef.current=snapshot;
  },[premium,storageKey,app.services,app.financialIncome,app.financialExpenses,fire]);

  useEffect(()=>{
    if(!queue.length||active)return;
    const item=queue[0];
    setQueue(q=>q.slice(1));
    setActive(item);
    playAchievementSound();
    const timer=setTimeout(()=>setActive(null),4300);
    return()=>clearTimeout(timer);
  },[queue,active]);

  if(!active)return null;
  const title=copy[active.id]||copy.accountCreated;
  const sub=copy[active.id+'Sub']||'';
  return <div className="achievement-toast" role="status" aria-live="polite">
    <div className="achievement-icon">{ICONS[active.id]||'✦'}</div>
    <div className="achievement-copy"><span className="achievement-kicker">{copy.premiumOnly||'PREMIUM'}</span><strong>{title}</strong><small>{sub}</small></div>
    <button type="button" className="achievement-close" aria-label="Close" onClick={()=>setActive(null)}>×</button>
    <div className="achievement-progress"/>
  </div>;
}
