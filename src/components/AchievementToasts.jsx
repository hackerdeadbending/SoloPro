import {useEffect,useRef,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useApp} from '../context/AppState';
import {getAchievementScope,hasAchievement,recordAchievement,subscribeAchievements} from '../utils/achievements';
import '../achievement-toasts.css';

const COPY={
 English:{
  firstLogin:['Welcome to SoloPro','Your workspace is ready.'],
  dashboard:['First look at Dashboard','You opened your business overview for the first time.'],
  earnings:['First look at Earnings','You opened your income and expense workspace.'],
  clients:['First look at Clients','You opened your client workspace for the first time.'],
  tax:['First look at Tax','You opened your tax workspace for the first time.'],
  referral:['First look at Referrals','You opened your referral area for the first time.'],
  premium:['First look at Premium','You opened Premium for the first time.'],
  settings:['First look at Settings','You opened your settings for the first time.'],
  notifications:['First look at Notifications','You opened Notifications for the first time.'],
  clientAdded:['First client','You added your first client.'],
  serviceAdded:['First service','You recorded your first service.'],
  incomeAdded:['First income','You added your first additional income.'],
  expenseAdded:['First expense','You added your first additional expense.']
 },
 Ukrainian:{
  firstLogin:['Ласкаво просимо до SoloPro','Ваш робочий простір готовий.'],
  dashboard:['Перший перегляд Dashboard','Ви вперше відкрили огляд свого бізнесу.'],
  earnings:['Перший перегляд Доходів','Ви відкрили розділ доходів і витрат.'],
  clients:['Перший перегляд Клієнтів','Ви вперше відкрили розділ клієнтів.'],
  tax:['Перший перегляд Податків','Ви відкрили податковий розділ.'],
  referral:['Перший перегляд Рефералів','Ви відкрили реферальний розділ.'],
  premium:['Перший перегляд Premium','Ви вперше відкрили Premium.'],
  settings:['Перший перегляд Налаштувань','Ви вперше відкрили налаштування.'],
  notifications:['Перший перегляд Сповіщень','Ви вперше відкрили сповіщення.'],
  clientAdded:['Перший клієнт','Ви додали свого першого клієнта.'],
  serviceAdded:['Перша послуга','Ви записали свою першу послугу.'],
  incomeAdded:['Перший дохід','Ви додали свій перший додатковий дохід.'],
  expenseAdded:['Перша витрата','Ви додали свою першу додаткову витрату.']
 },
 Italian:{
  firstLogin:['Benvenuto in SoloPro','Il tuo spazio di lavoro è pronto.'],
  dashboard:['Prima visita alla Dashboard','Hai aperto per la prima volta la panoramica della tua attività.'],
  earnings:['Prima visita a Entrate','Hai aperto il tuo spazio per entrate e spese.'],
  clients:['Prima visita ai Clienti','Hai aperto per la prima volta lo spazio clienti.'],
  tax:['Prima visita alle Imposte','Hai aperto il tuo spazio fiscale.'],
  referral:['Prima visita ai Referral','Hai aperto l’area referral.'],
  premium:['Prima visita a Premium','Hai aperto Premium per la prima volta.'],
  settings:['Prima visita alle Impostazioni','Hai aperto le impostazioni per la prima volta.'],
  notifications:['Prima visita alle Notifiche','Hai aperto le notifiche per la prima volta.'],
  clientAdded:['Primo cliente','Hai aggiunto il tuo primo cliente.'],
  serviceAdded:['Primo servizio','Hai registrato il tuo primo servizio.'],
  incomeAdded:['Prima entrata','Hai aggiunto la tua prima entrata aggiuntiva.'],
  expenseAdded:['Prima spesa','Hai aggiunto la tua prima spesa aggiuntiva.']
 }
};

const LOCALIZED={
 French:{
  firstLogin:['Bienvenue sur SoloPro','Votre espace de travail est prêt.'],dashboard:['Première visite du tableau de bord','Vous avez ouvert votre aperçu professionnel pour la première fois.'],earnings:['Première visite des revenus','Vous avez ouvert votre espace revenus et dépenses.'],clients:['Première visite des clients','Vous avez ouvert votre espace clients pour la première fois.'],tax:['Première visite des impôts','Vous avez ouvert votre espace fiscal.'],referral:['Première visite des parrainages','Vous avez ouvert votre espace de parrainage.'],premium:['Première visite de Premium','Vous avez ouvert Premium pour la première fois.'],settings:['Première visite des réglages','Vous avez ouvert les réglages pour la première fois.'],notifications:['Première visite des notifications','Vous avez ouvert les notifications pour la première fois.'],clientAdded:['Premier client','Vous avez ajouté votre premier client.'],serviceAdded:['Premier service','Vous avez enregistré votre premier service.'],incomeAdded:['Premier revenu','Vous avez ajouté votre premier revenu supplémentaire.'],expenseAdded:['Première dépense','Vous avez ajouté votre première dépense supplémentaire.']
 },
 German:{
  firstLogin:['Willkommen bei SoloPro','Dein Arbeitsbereich ist bereit.'],dashboard:['Erster Dashboard-Besuch','Du hast deine Geschäftsübersicht zum ersten Mal geöffnet.'],earnings:['Erster Besuch bei Einnahmen','Du hast deinen Bereich für Einnahmen und Ausgaben geöffnet.'],clients:['Erster Besuch bei Kunden','Du hast deinen Kundenbereich zum ersten Mal geöffnet.'],tax:['Erster Besuch bei Steuern','Du hast deinen Steuerbereich geöffnet.'],referral:['Erster Besuch bei Empfehlungen','Du hast deinen Empfehlungsbereich geöffnet.'],premium:['Erster Besuch bei Premium','Du hast Premium zum ersten Mal geöffnet.'],settings:['Erster Besuch bei Einstellungen','Du hast die Einstellungen zum ersten Mal geöffnet.'],notifications:['Erster Besuch bei Benachrichtigungen','Du hast die Benachrichtigungen zum ersten Mal geöffnet.'],clientAdded:['Erster Kunde','Du hast deinen ersten Kunden hinzugefügt.'],serviceAdded:['Erster Service','Du hast deinen ersten Service erfasst.'],incomeAdded:['Erste Einnahme','Du hast deine erste zusätzliche Einnahme hinzugefügt.'],expenseAdded:['Erste Ausgabe','Du hast deine erste zusätzliche Ausgabe hinzugefügt.']
 },
 Spanish:{
  firstLogin:['Bienvenido a SoloPro','Tu espacio de trabajo está listo.'],dashboard:['Primera visita al panel','Has abierto por primera vez el resumen de tu negocio.'],earnings:['Primera visita a Ingresos','Has abierto tu espacio de ingresos y gastos.'],clients:['Primera visita a Clientes','Has abierto por primera vez tu espacio de clientes.'],tax:['Primera visita a Impuestos','Has abierto tu espacio fiscal.'],referral:['Primera visita a Referidos','Has abierto tu área de referidos.'],premium:['Primera visita a Premium','Has abierto Premium por primera vez.'],settings:['Primera visita a Ajustes','Has abierto los ajustes por primera vez.'],notifications:['Primera visita a Notificaciones','Has abierto las notificaciones por primera vez.'],clientAdded:['Primer cliente','Has añadido tu primer cliente.'],serviceAdded:['Primer servicio','Has registrado tu primer servicio.'],incomeAdded:['Primer ingreso','Has añadido tu primer ingreso adicional.'],expenseAdded:['Primer gasto','Has añadido tu primer gasto adicional.']
 },
 Portuguese:{
  firstLogin:['Bem-vindo ao SoloPro','O seu espaço de trabalho está pronto.'],dashboard:['Primeira visita ao Painel','Abriu pela primeira vez a visão geral do seu negócio.'],earnings:['Primeira visita às Receitas','Abriu o espaço de receitas e despesas.'],clients:['Primeira visita aos Clientes','Abriu o espaço de clientes pela primeira vez.'],tax:['Primeira visita aos Impostos','Abriu o seu espaço fiscal.'],referral:['Primeira visita às Indicações','Abriu a área de indicações.'],premium:['Primeira visita ao Premium','Abriu o Premium pela primeira vez.'],settings:['Primeira visita às Definições','Abriu as definições pela primeira vez.'],notifications:['Primeira visita às Notificações','Abriu as notificações pela primeira vez.'],clientAdded:['Primeiro cliente','Adicionou o seu primeiro cliente.'],serviceAdded:['Primeiro serviço','Registou o seu primeiro serviço.'],incomeAdded:['Primeira receita','Adicionou a sua primeira receita adicional.'],expenseAdded:['Primeira despesa','Adicionou a sua primeira despesa adicional.']
 },
 Dutch:{
  firstLogin:['Welkom bij SoloPro','Je werkruimte is klaar.'],dashboard:['Eerste bezoek aan Dashboard','Je hebt je bedrijfsoverzicht voor het eerst geopend.'],earnings:['Eerste bezoek aan Inkomsten','Je hebt je inkomsten- en uitgavenruimte geopend.'],clients:['Eerste bezoek aan Klanten','Je hebt je klantenruimte voor het eerst geopend.'],tax:['Eerste bezoek aan Belastingen','Je hebt je belastingruimte geopend.'],referral:['Eerste bezoek aan Verwijzingen','Je hebt je verwijzingsgedeelte geopend.'],premium:['Eerste bezoek aan Premium','Je hebt Premium voor het eerst geopend.'],settings:['Eerste bezoek aan Instellingen','Je hebt de instellingen voor het eerst geopend.'],notifications:['Eerste bezoek aan Meldingen','Je hebt meldingen voor het eerst geopend.'],clientAdded:['Eerste klant','Je hebt je eerste klant toegevoegd.'],serviceAdded:['Eerste service','Je hebt je eerste service geregistreerd.'],incomeAdded:['Eerste inkomen','Je hebt je eerste extra inkomen toegevoegd.'],expenseAdded:['Eerste uitgave','Je hebt je eerste extra uitgave toegevoegd.']
 },
 Polish:{
  firstLogin:['Witaj w SoloPro','Twoja przestrzeń robocza jest gotowa.'],dashboard:['Pierwsza wizyta w Panelu','Po raz pierwszy otworzyłeś podsumowanie swojej działalności.'],earnings:['Pierwsza wizyta w Przychodach','Otworzyłeś przestrzeń przychodów i wydatków.'],clients:['Pierwsza wizyta w Klientach','Po raz pierwszy otworzyłeś przestrzeń klientów.'],tax:['Pierwsza wizyta w Podatkach','Otworzyłeś przestrzeń podatkową.'],referral:['Pierwsza wizyta w Poleceniach','Otworzyłeś sekcję poleceń.'],premium:['Pierwsza wizyta w Premium','Po raz pierwszy otworzyłeś Premium.'],settings:['Pierwsza wizyta w Ustawieniach','Po raz pierwszy otworzyłeś ustawienia.'],notifications:['Pierwsza wizyta w Powiadomieniach','Po raz pierwszy otworzyłeś powiadomienia.'],clientAdded:['Pierwszy klient','Dodałeś swojego pierwszego klienta.'],serviceAdded:['Pierwsza usługa','Zarejestrowałeś swoją pierwszą usługę.'],incomeAdded:['Pierwszy przychód','Dodałeś swój pierwszy dodatkowy przychód.'],expenseAdded:['Pierwszy wydatek','Dodałeś swój pierwszy dodatkowy wydatek.']
 },
 Czech:{
  firstLogin:['Vítejte v SoloPro','Váš pracovní prostor je připraven.'],dashboard:['První návštěva Přehledu','Poprvé jste otevřeli přehled svého podnikání.'],earnings:['První návštěva Příjmů','Otevřeli jste prostor pro příjmy a výdaje.'],clients:['První návštěva Klientů','Poprvé jste otevřeli prostor klientů.'],tax:['První návštěva Daní','Otevřeli jste daňový prostor.'],referral:['První návštěva Doporučení','Otevřeli jste sekci doporučení.'],premium:['První návštěva Premium','Poprvé jste otevřeli Premium.'],settings:['První návštěva Nastavení','Poprvé jste otevřeli nastavení.'],notifications:['První návštěva Oznámení','Poprvé jste otevřeli oznámení.'],clientAdded:['První klient','Přidali jste svého prvního klienta.'],serviceAdded:['První služba','Zaznamenali jste svou první službu.'],incomeAdded:['První příjem','Přidali jste svůj první dodatečný příjem.'],expenseAdded:['První výdaj','Přidali jste svůj první dodatečný výdaj.']
 },
 Finnish:{
  firstLogin:['Tervetuloa SoloProhon','Työtilasi on valmis.'],dashboard:['Ensimmäinen Dashboard-käynti','Avasit yrityksesi yleiskatsauksen ensimmäistä kertaa.'],earnings:['Ensimmäinen Tulot-käynti','Avasit tulojen ja menojen työtilan.'],clients:['Ensimmäinen Asiakkaat-käynti','Avasit asiakastyötilan ensimmäistä kertaa.'],tax:['Ensimmäinen Verot-käynti','Avasit veroalueen.'],referral:['Ensimmäinen Suositukset-käynti','Avasit suosittelualueen.'],premium:['Ensimmäinen Premium-käynti','Avasit Premiumin ensimmäistä kertaa.'],settings:['Ensimmäinen Asetukset-käynti','Avasit asetukset ensimmäistä kertaa.'],notifications:['Ensimmäinen Ilmoitukset-käynti','Avasit ilmoitukset ensimmäistä kertaa.'],clientAdded:['Ensimmäinen asiakas','Lisäsit ensimmäisen asiakkaasi.'],serviceAdded:['Ensimmäinen palvelu','Kirjasit ensimmäisen palvelusi.'],incomeAdded:['Ensimmäinen tulo','Lisäsit ensimmäisen lisätulosi.'],expenseAdded:['Ensimmäinen meno','Lisäsit ensimmäisen lisämenos.']
 },
 Swedish:{
  firstLogin:['Välkommen till SoloPro','Din arbetsyta är redo.'],dashboard:['Första besöket på Dashboard','Du öppnade din företagsöversikt för första gången.'],earnings:['Första besöket på Intäkter','Du öppnade din yta för intäkter och utgifter.'],clients:['Första besöket på Kunder','Du öppnade kundytan för första gången.'],tax:['Första besöket på Skatt','Du öppnade skatteytan.'],referral:['Första besöket på Hänvisningar','Du öppnade hänvisningsområdet.'],premium:['Första besöket på Premium','Du öppnade Premium för första gången.'],settings:['Första besöket på Inställningar','Du öppnade inställningarna för första gången.'],notifications:['Första besöket på Aviseringar','Du öppnade aviseringarna för första gången.'],clientAdded:['Första kunden','Du lade till din första kund.'],serviceAdded:['Första tjänsten','Du registrerade din första tjänst.'],incomeAdded:['Första inkomsten','Du lade till din första extra inkomst.'],expenseAdded:['Första utgiften','Du lade till din första extra utgift.']
 },
 Danish:{
  firstLogin:['Velkommen til SoloPro','Dit arbejdsområde er klar.'],dashboard:['Første besøg på Dashboard','Du åbnede din virksomhedsoversigt for første gang.'],earnings:['Første besøg i Indtægter','Du åbnede dit område for indtægter og udgifter.'],clients:['Første besøg i Kunder','Du åbnede kundeområdet for første gang.'],tax:['Første besøg i Skat','Du åbnede dit skatteområde.'],referral:['Første besøg i Henvisninger','Du åbnede henvisningsområdet.'],premium:['Første besøg i Premium','Du åbnede Premium for første gang.'],settings:['Første besøg i Indstillinger','Du åbnede indstillingerne for første gang.'],notifications:['Første besøg i Notifikationer','Du åbnede notifikationerne for første gang.'],clientAdded:['Første kunde','Du tilføjede din første kunde.'],serviceAdded:['Første service','Du registrerede din første service.'],incomeAdded:['Første indtægt','Du tilføjede din første ekstra indtægt.'],expenseAdded:['Første udgift','Du tilføjede din første ekstra udgift.']
 },
 Norwegian:{
  firstLogin:['Velkommen til SoloPro','Arbeidsområdet ditt er klart.'],dashboard:['Første besøk på Dashboard','Du åpnet virksomhetsoversikten for første gang.'],earnings:['Første besøk i Inntekter','Du åpnet området for inntekter og utgifter.'],clients:['Første besøk i Kunder','Du åpnet kundeområdet for første gang.'],tax:['Første besøk i Skatt','Du åpnet skatteområdet.'],referral:['Første besøk i Henvisninger','Du åpnet henvisningsområdet.'],premium:['Første besøk i Premium','Du åpnet Premium for første gang.'],settings:['Første besøk i Innstillinger','Du åpnet innstillingene for første gang.'],notifications:['Første besøk i Varsler','Du åpnet varsler for første gang.'],clientAdded:['Første kunde','Du la til din første kunde.'],serviceAdded:['Første tjeneste','Du registrerte din første tjeneste.'],incomeAdded:['Første inntekt','Du la til din første ekstra inntekt.'],expenseAdded:['Første utgift','Du la til din første ekstra utgift.']
 },
 Icelandic:{
  firstLogin:['Velkomin í SoloPro','Vinnusvæðið þitt er tilbúið.'],dashboard:['Fyrsta heimsókn á stjórnborð','Þú opnaðir yfirlit fyrirtækisins í fyrsta sinn.'],earnings:['Fyrsta heimsókn í tekjur','Þú opnaðir svæði tekna og gjalda.'],clients:['Fyrsta heimsókn í viðskiptavini','Þú opnaðir viðskiptavinasvæðið í fyrsta sinn.'],tax:['Fyrsta heimsókn í skatta','Þú opnaðir skattasvæðið.'],referral:['Fyrsta heimsókn í tilvísanir','Þú opnaðir tilvísunarsvæðið.'],premium:['Fyrsta heimsókn í Premium','Þú opnaðir Premium í fyrsta sinn.'],settings:['Fyrsta heimsókn í stillingar','Þú opnaðir stillingarnar í fyrsta sinn.'],notifications:['Fyrsta heimsókn í tilkynningar','Þú opnaðir tilkynningarnar í fyrsta sinn.'],clientAdded:['Fyrsti viðskiptavinur','Þú bættir við fyrsta viðskiptavininum þínum.'],serviceAdded:['Fyrsta þjónusta','Þú skráðir fyrstu þjónustuna þína.'],incomeAdded:['Fyrstu tekjur','Þú bættir við fyrstu viðbótartekjunum þínum.'],expenseAdded:['Fyrsti kostnaður','Þú bættir við fyrsta viðbótarkostnaðinum þínum.']
 },
 Arabic:{
  firstLogin:['مرحبًا بك في SoloPro','مساحة العمل الخاصة بك جاهزة.'],dashboard:['أول زيارة للوحة التحكم','فتحت نظرة عامة على نشاطك لأول مرة.'],earnings:['أول زيارة للدخل','فتحت مساحة الدخل والمصروفات.'],clients:['أول زيارة للعملاء','فتحت مساحة العملاء لأول مرة.'],tax:['أول زيارة للضرائب','فتحت مساحة الضرائب.'],referral:['أول زيارة للإحالات','فتحت قسم الإحالات.'],premium:['أول زيارة لـ Premium','فتحت Premium لأول مرة.'],settings:['أول زيارة للإعدادات','فتحت الإعدادات لأول مرة.'],notifications:['أول زيارة للإشعارات','فتحت الإشعارات لأول مرة.'],clientAdded:['أول عميل','أضفت أول عميل لك.'],serviceAdded:['أول خدمة','سجلت أول خدمة لك.'],incomeAdded:['أول دخل','أضفت أول دخل إضافي لك.'],expenseAdded:['أول مصروف','أضفت أول مصروف إضافي لك.']
 },
 Chinese:{
  firstLogin:['欢迎使用 SoloPro','你的工作空间已准备就绪。'],dashboard:['首次查看仪表板','你第一次打开了业务概览。'],earnings:['首次查看收入','你打开了收入和支出工作区。'],clients:['首次查看客户','你第一次打开了客户工作区。'],tax:['首次查看税务','你打开了税务工作区。'],referral:['首次查看推荐','你打开了推荐区域。'],premium:['首次查看 Premium','你第一次打开了 Premium。'],settings:['首次查看设置','你第一次打开了设置。'],notifications:['首次查看通知','你第一次打开了通知。'],clientAdded:['第一个客户','你添加了第一个客户。'],serviceAdded:['第一项服务','你记录了第一项服务。'],incomeAdded:['第一笔收入','你添加了第一笔额外收入。'],expenseAdded:['第一笔支出','你添加了第一笔额外支出。']
 },
 Japanese:{
  firstLogin:['SoloProへようこそ','ワークスペースの準備ができました。'],dashboard:['初めてダッシュボードを表示','初めてビジネス概要を開きました。'],earnings:['初めて収入を表示','収入と支出のワークスペースを開きました。'],clients:['初めて顧客を表示','初めて顧客ワークスペースを開きました。'],tax:['初めて税務を表示','税務ワークスペースを開きました。'],referral:['初めて紹介を表示','紹介エリアを開きました。'],premium:['初めてPremiumを表示','初めてPremiumを開きました。'],settings:['初めて設定を表示','初めて設定を開きました。'],notifications:['初めて通知を表示','初めて通知を開きました。'],clientAdded:['初めての顧客','最初の顧客を追加しました。'],serviceAdded:['初めてのサービス','最初のサービスを記録しました。'],incomeAdded:['初めての収入','最初の追加収入を登録しました。'],expenseAdded:['初めての支出','最初の追加支出を登録しました。']
 },
 Korean:{
  firstLogin:['SoloPro에 오신 것을 환영합니다','워크스페이스가 준비되었습니다.'],dashboard:['대시보드 첫 방문','처음으로 비즈니스 개요를 열었습니다.'],earnings:['수입 첫 방문','수입 및 지출 공간을 열었습니다.'],clients:['고객 첫 방문','처음으로 고객 공간을 열었습니다.'],tax:['세금 첫 방문','세금 공간을 열었습니다.'],referral:['추천 첫 방문','추천 영역을 열었습니다.'],premium:['Premium 첫 방문','처음으로 Premium을 열었습니다.'],settings:['설정 첫 방문','처음으로 설정을 열었습니다.'],notifications:['알림 첫 방문','처음으로 알림을 열었습니다.'],clientAdded:['첫 고객','첫 고객을 추가했습니다.'],serviceAdded:['첫 서비스','첫 서비스를 기록했습니다.'],incomeAdded:['첫 수입','첫 추가 수입을 등록했습니다.'],expenseAdded:['첫 지출','첫 추가 지출을 등록했습니다.']
 },
 Ukkrainian:{}
};
\nconst FALLBACK=COPY.English;

function copyFor(language,key){
  return (LOCALIZED[language]&&LOCALIZED[language][key])||(COPY[language]&&COPY[language][key])||FALLBACK[key];
}

const ROUTES={
 '/':'dashboard',
 '/app':'dashboard',
 '/earnings':'earnings',
 '/clients':'clients',
 '/tax':'tax',
 '/referral':'referral',
 '/premium':'premium',
 '/settings':'settings',
 '/smart-messages':'notifications'
};

function playChime(){
 try{
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext)return;
  const ctx=new AudioContext();
  const now=ctx.currentTime;
  const gain=ctx.createGain();
  const osc=ctx.createOscillator();
  osc.type='sine';
  osc.frequency.setValueAtTime(660,now);
  osc.frequency.exponentialRampToValueAtTime(880,now+0.12);
  gain.gain.setValueAtTime(0.0001,now);
  gain.gain.exponentialRampToValueAtTime(0.045,now+0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001,now+0.32);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now+0.33);
  osc.addEventListener('ended',()=>{try{ctx.close()}catch{}},{once:true});
 }catch{}
}

export default function AchievementToasts(){
 const app=useApp();
 const location=useLocation();
 const [queue,setQueue]=useState([]);
 const scope=getAchievementScope(app.authSession?.user?.email||app.account?.email||app.user?.email);
 const premium=Boolean(app.premiumActive||app.isAdmin);
 const seenRef=useRef(new Set());

 useEffect(()=>{
  if(!premium||!app.account?.authenticated)return;
  const onEvent=({scope:eventScope,key})=>{
   if(eventScope!==scope||seenRef.current.has(key)||hasAchievement(scope,key)===false)return;
   const copy=copyFor(app.language,key);
   if(!copy)return;
   seenRef.current.add(key);
   setQueue(q=>[...q,{key,title:copy[0],body:copy[1]}]);
  };
  return subscribeAchievements(onEvent);
 },[premium,app.account?.authenticated,scope,app.language]);

 useEffect(()=>{
  if(!premium||!app.account?.authenticated)return;
  const key=ROUTES[location.pathname];
  if(!key)return;
  const achievementKey=key;
  if(hasAchievement(scope,achievementKey))return;
  if(recordAchievement(scope,achievementKey)){
   const copy=copyFor(app.language,achievementKey);
   if(copy&&!seenRef.current.has(achievementKey)){
    seenRef.current.add(achievementKey);
    setQueue(q=>[...q,{key:achievementKey,title:copy[0],body:copy[1]}]);
   }
  }
 },[location.pathname,premium,app.account?.authenticated,scope,app.language]);

 useEffect(()=>{
  if(!premium||!app.account?.authenticated)return;
  const key='firstLogin';
  if(hasAchievement(scope,key))return;
  if(recordAchievement(scope,key)){
   const copy=copyFor(app.language,key);
   if(copy&&!seenRef.current.has(key)){
    seenRef.current.add(key);
    setQueue(q=>[...q,{key,title:copy[0],body:copy[1]}]);
   }
  }
 },[premium,app.account?.authenticated,scope,app.language]);

 useEffect(()=>{
  if(!queue.length)return;
  playChime();
  const timer=setTimeout(()=>setQueue(q=>q.slice(1)),4200);
  return()=>clearTimeout(timer);
 },[queue]);

 if(!premium||!app.account?.authenticated||!queue.length)return null;
 return <div className="achievement-toasts" aria-live="polite">{queue.map(item=><div className="achievement-toast" key={item.key}><div className="achievement-toast-icon">✦</div><div className="achievement-toast-copy"><strong>{item.title}</strong><span>{item.body}</span></div></div>)}</div>;
}
