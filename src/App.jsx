import { useState, useEffect, useRef, createContext, useContext } from "react";
import { BookOpen, Award, Users, FileText, Menu, X, CheckCircle, AlertCircle, Calendar, Clock, Copy } from "lucide-react";

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzgeCUChzdk3qNraq6BlBPFoeiQn2VUe_tlhW5Rvmlah0gUBgml31soRyHsv8Cch29t/exec";

const FEE_TABLE = { 1: 2000, 2: 3500, 3: 5000, 4: 6000, 5: 7000, 6: 8000 };

const LangCtx = createContext("en");
const useLang = () => useContext(LangCtx);
const t = (copy, lang) => copy[lang] ?? copy.en;

const COPY = {
  nav: {
    competitions: { en: "Olympiads",      ru: "Олимпиады" },
    experts:      { en: "Experts",        ru: "Эксперты" },
    transcript:   { en: "The Transcript", ru: "Транскрипт" },
    about:        { en: "About",          ru: "О нас" },
    register:     { en: "Register",       ru: "Регистрация" },
  },
  header: {
    tagline: { en: "Academic Excellence · Independent Research", ru: "Академическое Превосходство · Независимые Исследования" },
  },
  hero: {
    est:   { en: "Astana, Kazakhstan", ru: "Астана, Казахстан" },
    line1: { en: "The Discipline of Thought", ru: "Дисциплина Мышления" },
    line2: { en: "Is the Foundation of All Achievement", ru: "Основа Всякого Достижения" },
    quote: { en: '"Disciplina cogitationis est fundamentum omnis praestantiae."', ru: '"The discipline of thought is the foundation of all achievement."' },
    body:  { en: "The Russell Institute invites scholars of uncommon ambition to test their knowledge in rigorous academic olympiads — assessed and certified by an independent board of academic experts.", ru: "Russell Institute приглашает молодых учёных проверить свои знания на строгих академических олимпиадах, оцениваемых независимым международным академическим советом." },
    stats: [
      { n: "6",  en: "Olympiad Subjects",   ru: "Предметов олимпиады" },
      { n: "IV", en: "Expert Reviewers",    ru: "Эксперта-рецензента" },
      { n: "I",  en: "Academic Transcript", ru: "Академический транскрипт" },
    ],
    scroll: { en: "Scroll", ru: "Листать" },
  },
  about: {
    label: { en: "Our Mission", ru: "Наша Миссия" },
    quote: { en: '"The purpose of education is not to fill a pail, but to light a fire — a fire of curiosity, discipline, and intellectual courage."', ru: '"Цель образования — не в том, чтобы наполнить сосуд, а в том, чтобы зажечь огонь — огонь любознательности, дисциплины и интеллектуальной смелости."' },
    body:  { en: "The Russell Institute exists to cultivate the next generation of independent thinkers in Central Asia and beyond. Our olympiads are assessed by internationally credentialled academics, producing a formal Academic Transcript that distinguishes any university application.", ru: "The Russell Institute создан для воспитания нового поколения независимых мыслителей в Центральной Азии. Наши олимпиады оцениваются международными академическими специалистами, и по результатам выдаётся официальный академический транскрипт." },
    items: [
      { en: "Independent Expert Review",  ru: "Независимая экспертная оценка" },
      { en: "Formal Academic Transcript", ru: "Официальный академический транскрипт" },
      { en: "Oxford-Style Assessment",    ru: "Оценка по Оксфордской модели" },
    ],
  },
  olympiadSection: {
    label:       { en: "Open Olympiads",         ru: "Открытые Олимпиады" },
    headline:    { en: "Six Subjects. One Standard.", ru: "Шесть Предметов. Один Стандарт." },
    body:        { en: "Each olympiad is conducted online. Dates will be announced shortly. Registration closes 17 May 2026.", ru: "Каждая олимпиада проводится онлайн. Даты будут объявлены в ближайшее время. Регистрация закрывается 17 мая 2026." },
    dateLabel:   { en: "Date",     ru: "Дата" },
    timeLabel:   { en: "Time",     ru: "Время" },
    registerBtn: { en: "Register", ru: "Участвовать" },
    deadlineLabel:{ en: "Registration deadline", ru: "Дедлайн регистрации" },
    deadlineVal:  { en: "17 May 2026", ru: "17 мая 2026" },
  },
  olympiads: [
    { key: "math", en: "Mathematics",      ru: "Математика",         dateEn: "To be announced", dateRu: "Будет объявлено", time: "—" },
    { key: "phys", en: "Physics",          ru: "Физика",             dateEn: "To be announced", dateRu: "Будет объявлено", time: "—" },
    { key: "cs",   en: "Computer Science", ru: "Информатика",        dateEn: "To be announced", dateRu: "Будет объявлено", time: "—" },
    { key: "bio",  en: "Biology",          ru: "Биология",           dateEn: "To be announced", dateRu: "Будет объявлено", time: "—" },
    { key: "econ", en: "Economics",        ru: "Экономика",          dateEn: "To be announced", dateRu: "Будет объявлено", time: "—" },
    { key: "hum",  en: "Humanities",       ru: "Гуманитарные науки", dateEn: "To be announced", dateRu: "Будет объявлено", time: "—" },
  ],
  experts: {
    label:    { en: "The Expert Board", ru: "Совет Экспертов" },
    headline: { en: ["Reviewed by Those", "Who Know the Standard"], ru: ["Оценивают Те,", "Кто Знает Стандарт"] },
    body:     { en: "Every olympiad paper is reviewed by a credentialled academic. We do not employ automated scoring. Assessment is the work of human intellect.", ru: "Каждая олимпийская работа проверяется дипломированным учёным. Мы не используем автоматизированные оценки." },
    spec:     { en: "Specialisation", ru: "Специализация" },
    prior:    { en: "Work Experience", ru: "Опыт работы" },
  },
  expertsData: [
    {
      ini: "A.V.",
      name:  { en: "Prof. Arina Volkova",    ru: "Проф. Арина Волкова" },
      cred:  { en: "Ph.D. Political Philosophy · University of Oxford", ru: "Ph.D. Политическая философия · Оксфордский университет" },
      field: { en: "Political Theory & Constitutional Law", ru: "Политическая теория и конституционное право" },
      prior: { en: "Fellow, All Souls College", ru: "Научный сотрудник, All Souls College" },
    },
    {
      ini: "D.S.",
      name:  { en: "Dr. David Sternberg", ru: "Д-р Дэвид Стернберг" },
      cred:  { en: "Ph.D. Economics · London School of Economics", ru: "Ph.D. Экономика · Лондонская школа экономики" },
      field: { en: "Welfare Economics & Public Policy", ru: "Экономика благосостояния и государственная политика" },
      prior: { en: "Economist, HM Treasury", ru: "Экономист, Казначейство ЕВ" },
    },
    {
      ini: "N.A.",
      name:  { en: "Nadia Al-Rashid", ru: "Надия Аль-Рашид" },
      cred:  { en: "M.A. Artificial Intelligence and Machine Learning · University of California, Los Angeles", ru: "M.A. Искусственный интеллект и Машинное обучение · Университет Калифорния Лос-Анджелес" },
      field: { en: "Deep Learning and Statistics", ru: "Глубокое обучение и Статистика" },
      prior: { en: "Senior Researcher, Meta", ru: "Старший исследователь, Meta" },
    },
    {
      ini: "B.A.",
      name:  { en: "Beksultan Aubakirov", ru: "Бексултан Аубакиров" },
      cred:  { en: "M.A. International Relations · Sciences Po Paris", ru: "M.A. Международные отношения · Sciences Po Париж" },
      field: { en: "Comparative Politics · Eurasian region", ru: "Сравнительная политология · Евразийский регион" },
      prior: { en: "Junior Assistant, OSCE", ru: "Младший ассистент, ОБСЕ" },
    },
  ],
  transcript: {
    label:      { en: "The Academic Transcript", ru: "Академический Транскрипт" },
    h1:         { en: "A Record That",           ru: "Документ," },
    h2:         { en: "Speaks With Authority",   ru: "Говорящий за Себя" },
    p1:         { en: "Upon review, the Institute issues a formal Academic Transcript — a single-page document bearing the Institute's seal, recording assessed performance across five academic competency domains. In addition to the Academic Transcript, an official diploma will be issued.", ru: "После проверки Институт выдаёт официальный академический транскрипт — документ на одной странице с печатью Института. В дополнение к транскрипту выдаётся официальный диплом." },
    p2:         { en: "The Transcript is designed to accompany university applications, fellowship submissions, and professional portfolios. It is not a certificate of participation — it is a verifiable record of intellectual performance.", ru: "Транскрипт предназначен для приложения к заявкам в университеты. Это не сертификат участия — это верифицируемая запись интеллектуальной деятельности." },
    blockLabel: { en: "Sample Qualitative Review Extract", ru: "Образец качественного отзыва" },
    blockBody:  { en: '"The candidate demonstrates an unusually sophisticated grasp of the tension between positive and negative liberty. The deployment of Berlin and Rawls is confident, if at times under-developed. The essay would benefit from a more sustained engagement with counter-arguments..."', ru: '"Кандидат демонстрирует необычайно глубокое понимание противоречия между позитивной и негативной свободой. Обращение к Берлину и Роулзу уверенное, хотя местами недостаточно развёрнутое..."' },
    reviewer:   { en: "Reviewed by ...", ru: "Проверено ..." },
    instName:   { en: "The Russell Institute", ru: "The Russell Institute" },
    mockTitle:  { en: "Academic Transcript of Performance", ru: "Академический Транскрипт Результатов" },
    mockComp:   { en: "Olympiad: Mathematics — 2026", ru: "Олимпиада: Математика — 2026" },
    mockCand:   { en: "Candidate: A. Candidate · 2026", ru: "Кандидат: А. Кандидатов · 2026" },
    compLabel:  { en: "Competency Assessment", ru: "Оценка компетенций" },
    overall:    { en: "Overall Assessment",    ru: "Общая оценка" },
    verdict:    { en: "Demonstrates High Academic Promise", ru: "Высокий Академический Потенциал" },
  },
  scores: [
    { en: "Critical Analysis",                    ru: "Критический анализ",                             v: 88 },
    { en: "Evidentiary Rigor and Use of Sources", ru: "Доказательная строгость и работа с источниками", v: 74 },
    { en: "Architectural Logic",                  ru: "Архитектурная логика",                           v: 92 },
    { en: "Academic Prose",                       ru: "Академическая проза",                            v: 68 },
    { en: "Originality of Thought",               ru: "Оригинальность мысли",                          v: 81 },
  ],
  regForm: {
    sectionLabel:     { en: "Enrolment",  ru: "Регистрация" },
    headline:         { en: "Register for the Olympiad", ru: "Зарегистрироваться на олимпиаду" },
    sub:              { en: "Complete the form below. Select one or more olympiad subjects. After payment confirmation you will receive your personal login and password. Registration deadline: 17 May 2026.", ru: "Заполните форму ниже. Выберите один или несколько предметов олимпиады. После подтверждения оплаты вы получите личный логин и пароль. Дедлайн регистрации: 17 мая 2026." },
    nameLabel:        { en: "Full Name",               ru: "Имя и Фамилия" },
    namePlaceholder:  { en: "e.g. Aibek Dzhaksybekov", ru: "напр. Айбек Джаксыбеков" },
    emailLabel:       { en: "Email Address",           ru: "Адрес электронной почты" },
    emailPlaceholder: { en: "your@email.com",          ru: "ваш@email.com" },
    phoneLabel:       { en: "Phone Number",            ru: "Номер телефона" },
    phonePlaceholder: { en: "+7 777 123 45 67",        ru: "+7 777 123 45 67" },
    errPhone:         { en: "Please enter a valid phone number.", ru: "Введите корректный номер телефона." },
    catLabel:         { en: "Select Olympiad Subjects", ru: "Выберите предметы олимпиады" },
    cats: [
      { en: "Mathematics",      ru: "Математика",         val: "Mathematics" },
      { en: "Physics",          ru: "Физика",             val: "Physics" },
      { en: "Computer Science", ru: "Информатика",        val: "Computer Science" },
      { en: "Biology",          ru: "Биология",           val: "Biology" },
      { en: "Economics",        ru: "Экономика",          val: "Economics" },
      { en: "Humanities",       ru: "Гуманитарные науки", val: "Humanities" },
    ],
    legalPre:    { en: "I have read and agree to the ",  ru: "Я ознакомился(-ась) и согласен(-на) с " },
    legalOffer:  { en: "Public Offer,",                  ru: "Публичной офертой," },
    legalRefund: { en: " Refund Policy",                 ru: " Политикой возврата" },
    legalAnd:    { en: " and the ",                      ru: " и " },
    legalPriv:   { en: "Privacy Policy",                 ru: "Политикой конфиденциальности" },
    legalPost:   { en: " of The Russell Institute.",     ru: " The Russell Institute." },
    errRequired:     { en: "This field is required.",                ru: "Это поле обязательно для заполнения." },
    errEmail:        { en: "Please enter a valid email address.",    ru: "Введите корректный адрес электронной почты." },
    errCat:          { en: "Please select at least one subject.",    ru: "Выберите хотя бы один предмет." },
    errLegal:        { en: "You must accept the terms to proceed.",  ru: "Для продолжения необходимо принять условия." },
    btnPay:          { en: "Proceed to Payment",          ru: "Перейти к оплате" },
    btnDisabled:     { en: "Accept terms to continue",    ru: "Примите условия для продолжения" },
    feeNote:         { en: "Base fee: 2,000 KZT per subject. Multi-subject discounts apply automatically.", ru: "Базовый взнос: 2 000 KZT за предмет. Скидки при нескольких предметах применяются автоматически." },
    discountTitle:   { en: "Multi-Subject Pricing",       ru: "Цены при нескольких предметах" },
    discountSub:     { en: "Select more subjects for a better rate:", ru: "Больше предметов — выгоднее:" },
    pricingRows: [
      { n: 1, price: "2,000 KZT",  saveEn: "base rate",  saveRu: "базовая цена" },
      { n: 2, price: "3,500 KZT",  saveEn: "save 500",   saveRu: "экономия 500" },
      { n: 3, price: "5,000 KZT",  saveEn: "save 1,000", saveRu: "экономия 1 000" },
      { n: 4, price: "6,000 KZT",  saveEn: "save 2,000", saveRu: "экономия 2 000" },
      { n: 5, price: "7,000 KZT",  saveEn: "save 3,000", saveRu: "экономия 3 000" },
      { n: 6, price: "8,000 KZT",  saveEn: "save 4,000", saveRu: "экономия 4 000" },
    ],
    totalLabel:      { en: "Total",            ru: "Итого" },
    discountApplied: { en: "Discount applied", ru: "Скидка применена" },
    subjectWord:     { en: "subject",  ru: "предмет" },
    subjectsWord24:  { en: "subjects", ru: "предмета" },
    subjectsWord56:  { en: "subjects", ru: "предметов" },
  },
  modal: {
    title:         { en: "Payment Instructions", ru: "Инструкции по оплате" },
    sub:           { en: "Please complete your payment via Kaspi Bank to finalise your registration.", ru: "Завершите оплату через Kaspi Bank для завершения регистрации." },
    feeLabel:      { en: "Total Registration Fee", ru: "Итоговый регистрационный взнос" },
    qrLabel:       { en: "Scan with Kaspi to Pay", ru: "Отсканируйте для оплаты через Kaspi" },
    qrAlt:         { en: "Kaspi QR Code",          ru: "QR-код Kaspi" },
    orLabel:       { en: "Or transfer manually via phone number (Kaspi, Halyk, Freedom):", ru: "Или переведите вручную по номеру телефона (Kaspi, Halyk, Freedom):" },
    accountNo:     { en: "+7 747 822 5091",   ru: "+7 747 822 5091" },
    reference:     { en: "Comments: Student Full Name", ru: "Комментарий: Полное Имя ученика" },
    confirmBtn:    { en: "I have paid — Show my credentials", ru: "Я оплатил(-а) — Показать данные входа" },
    confirmSending:{ en: "Sending...", ru: "Отправка..." },
    cancelBtn:     { en: "Cancel",    ru: "Отмена" },
    disclaimer:    { en: "After confirming payment, you will receive your personal login and password for the Personal Cabinet.", ru: "После подтверждения оплаты вы получите логин и пароль для входа в личный кабинет." },
    subjectsLabel: { en: "Selected subjects", ru: "Выбранные предметы" },
  },
  success: {
    headline:   { en: "Registration Complete",  ru: "Регистрация завершена" },
    body:       { en: "Your payment has been confirmed. Save your login and password — you will need them to access the Personal Cabinet and start the olympiad.", ru: "Ваша оплата подтверждена. Сохраните логин и пароль — они нужны для входа в личный кабинет и прохождения олимпиады." },
    loginLabel: { en: "Your Login",    ru: "Ваш логин" },
    passLabel:  { en: "Your Password", ru: "Ваш пароль" },
    warning:    { en: "Important: save these credentials now. They will not be sent by email.", ru: "Важно: сохраните данные прямо сейчас. Они не будут отправлены на почту." },
    cabinetBtn: { en: "Open Personal Cabinet", ru: "Открыть личный кабинет" },
    newBtn:     { en: "Submit Another Application", ru: "Подать ещё одну заявку" },
    copyHint:   { en: "Copy",    ru: "Копировать" },
    copied:     { en: "Copied!", ru: "Скопировано!" },
  },
  footer: {
    tagline:   { en: "Academic Excellence & Independent Research", ru: "Академическое Превосходство и Независимые Исследования" },
    location:  { en: "Astana, Republic of Kazakhstan", ru: "Астана, Республика Казахстан" },
    navHd:     { en: "Navigate",  ru: "Навигация" },
    legalHd:   { en: "Legal",     ru: "Документы" },
    contactHd: { en: "Contact",   ru: "Контакты" },
    instName:  { en: "The Russell Institute", ru: "The Russell Institute" },
    ie:        { en: "IE MSM GROUP", ru: "ИП MSM GROUP" },
    navLinks: [
      { en: "Olympiads",           ru: "Олимпиады",        href: "#competitions" },
      { en: "Expert Board",        ru: "Совет экспертов",  href: "#experts" },
      { en: "The Transcript",      ru: "Транскрипт",       href: "#transcript" },
      { en: "About the Institute", ru: "Об Институте",     href: "#about" },
      { en: "Register",            ru: "Регистрация",      href: "#registration" },
      { en: "Personal Cabinet",    ru: "Личный кабинет",   href: "/cabinet.html" },
    ],
    legalLinks: [
      { en: "Terms & Conditions",     ru: "Условия и положения",         href: "/offer.pdf" },
      { en: "Privacy Policy",         ru: "Политика конфиденциальности", href: "/privacy.pdf" },
      { en: "Assessment Methodology", ru: "Методология оценки",          href: "/methodology.pdf" },
      { en: "Refund Policy",          ru: "Политика возврата",            href: "/refund.pdf" },
    ],
    copy: { en: "2026 MSM Group (Individual Entrepreneur MSM GROUP). All rights reserved.", ru: "2026 MSM Group (IP MSM GROUP). Vse prava zashhishheny." },
    est:  { en: "The Russell Institute", ru: "The Russell Institute" },
  },
};

const GF = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+SC:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #F9F7F2 !important; }
    .mi { font-family: 'Lora', Georgia, serif; color: #1A2B45; background: #F9F7F2; min-height: 100vh; overflow-x: hidden; }
    .rv { opacity: 0; transform: translateY(24px); transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1); }
    .rv.in { opacity: 1; transform: none; }
    .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}
    .hdr { position: fixed; top: 0; left: 0; right: 0; z-index: 200; transition: all 0.4s; }
    .hdr.sc { background: rgba(249,247,242,0.97); border-bottom: 1px solid #D8CEB8; box-shadow: 0 2px 24px rgba(26,43,69,0.06); backdrop-filter: blur(8px); }
    .hdr-in { max-width: 1200px; margin: 0 auto; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; height: 76px; }
    .nav-a { font-family: 'Cormorant SC',serif; font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase; text-decoration: none; padding-bottom: 2px; border-bottom: 1px solid transparent; transition: all 0.25s; }
    .nav-a:hover { border-color: #4A0E0E !important; color: #4A0E0E !important; }
    .lt { display: flex; align-items: center; border: 1px solid; overflow: hidden; }
    .lt-btn { font-family: 'Cormorant SC',serif; font-size: 0.6rem; letter-spacing: 0.18em; border: none; background: transparent; cursor: pointer; padding: 6px 11px; transition: all 0.22s; line-height: 1; }
    .nav-cta { font-family: 'Cormorant SC',serif; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; text-decoration: none; background: #1A2B45; color: #F9F7F2 !important; padding: 10px 26px; cursor: pointer; transition: background 0.3s; }
    .nav-cta:hover { background: #4A0E0E; }
    .hero { background: #1A2B45; min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; }
    .hero::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse at 15% 55%, rgba(74,14,14,0.28) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(74,14,14,0.15) 0%, transparent 50%); }
    .h-line { position:absolute; top:0; bottom:0; width:1px; background:rgba(200,216,240,0.05); }
    .btn-p { display:inline-block; background:#1A2B45; color:#F9F7F2; font-family:'Cormorant SC',serif; font-size:0.68rem; letter-spacing:0.25em; text-transform:uppercase; border:none; padding:16px 52px; cursor:pointer; text-decoration:none; transition:background 0.3s,letter-spacing 0.3s; }
    .btn-p:hover { background:#4A0E0E; letter-spacing:0.3em; }
    .btn-o { display:inline-block; background:transparent; color:#1A2B45; font-family:'Cormorant SC',serif; font-size:0.68rem; letter-spacing:0.22em; text-transform:uppercase; border:1px solid #1A2B45; padding:14px 40px; cursor:pointer; text-decoration:none; transition:all 0.3s; }
    .btn-o:hover { background:#1A2B45; color:#F9F7F2; }
    .ec { background:#FFFEF9; border:1px solid #E2D8C8; transition:all 0.35s; }
    .ec:hover { border-color:#1A2B45; transform:translateY(-4px); box-shadow:0 14px 44px rgba(26,43,69,0.1); }
    .sb-t { height:5px; background:#E8E0D0; }
    .sb-f { height:100%; background:linear-gradient(90deg,#4A0E0E,#1A2B45); transition:width 1.4s cubic-bezier(0.22,1,0.36,1); }
    .slbl { font-family:'Cormorant SC',serif; font-size:0.62rem; letter-spacing:0.32em; text-transform:uppercase; color:#4A0E0E; }
    .orn { display:flex; align-items:center; gap:18px; color:#C8B898; }
    .orn::before,.orn::after { content:''; flex:1; height:1px; background:#D8CEB8; }
    .pq { border-left:3px solid #4A0E0E; padding-left:28px; }
    @keyframes bnc{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(10px);opacity:1}}
    .bnc { animation:bnc 2.4s ease-in-out infinite; }
    .fi { width:100%; background:#FFFEF9; border:1px solid #D8CEB8; padding:14px 18px; font-family:'Lora',serif; font-size:0.88rem; color:#1A2B45; outline:none; transition:border-color 0.25s,box-shadow 0.25s; appearance:none; }
    .fi:focus { border-color:#1A2B45; box-shadow:0 0 0 3px rgba(26,43,69,0.07); }
    .fi::placeholder { color:#B8A888; font-style:italic; }
    .fi.err { border-color:#8B2020; }
    .fi-label { display:block; font-family:'Cormorant SC',serif; font-size:0.6rem; letter-spacing:0.22em; text-transform:uppercase; color:#7A6A58; margin-bottom:8px; }
    .fi-err { font-family:'Lora',serif; font-size:0.72rem; color:#8B2020; margin-top:6px; font-style:italic; }
    .legal-row { display:flex; gap:14px; align-items:flex-start; }
    .cb-wrap { position:relative; flex-shrink:0; margin-top:2px; }
    .cb-real { position:absolute; opacity:0; width:0; height:0; }
    .cb-box { width:20px; height:20px; border:1.5px solid #C8B898; background:#FFFEF9; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:border-color 0.2s,background 0.2s; }
    .cb-box.checked { border-color:#1A2B45; background:#1A2B45; }
    .cb-box.cb-err { border-color:#8B2020; }
    .cb-tick { color:#F9F7F2; font-size:12px; }
    .legal-text { font-family:'Lora',serif; font-size:0.82rem; color:#4A5A6A; line-height:1.7; }
    .legal-link { color:#4A0E0E; text-decoration:underline; text-underline-offset:2px; text-decoration-color:rgba(74,14,14,0.4); cursor:pointer; transition:text-decoration-color 0.2s; }
    .legal-link:hover { text-decoration-color:#4A0E0E; }
    .pay-btn { width:100%; font-family:'Cormorant SC',serif; font-size:0.72rem; letter-spacing:0.28em; text-transform:uppercase; border:none; padding:18px 24px; transition:background 0.3s,opacity 0.3s,letter-spacing 0.3s; }
    .pay-btn.active { background:#1A2B45; color:#F9F7F2; cursor:pointer; }
    .pay-btn.active:hover { background:#4A0E0E; letter-spacing:0.33em; }
    .pay-btn.disabled { background:#C8C0B0; color:#8A8078; cursor:not-allowed; opacity:0.65; }
    .cat-row { display:flex; align-items:center; gap:14px; cursor:pointer; padding:12px 16px; border:1px solid #D8CEB8; background:#FFFEF9; transition:all 0.2s; }
    .cat-row:hover { border-color:#1A2B45; }
    .cat-row.sel { border-color:#1A2B45; background:#F0EEF8; }
    .cat-chk { width:18px; height:18px; border:1.5px solid #C8B898; background:#FFFEF9; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s; }
    .cat-chk.sel { border-color:#1A2B45; background:#1A2B45; }
    .modal-overlay { position:fixed; inset:0; z-index:500; background:rgba(10,18,28,0.72); display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(3px); animation:fadeIn 0.2s ease; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .modal-box { background:#F9F7F2; max-width:520px; width:100%; border:1px solid #D8CEB8; padding:48px; position:relative; animation:slideUp 0.28s cubic-bezier(0.22,1,0.36,1); max-height:90vh; overflow-y:auto; }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
    .modal-close { position:absolute; top:20px; right:20px; background:none; border:none; cursor:pointer; color:#7A8A9A; transition:color 0.2s; }
    .modal-close:hover { color:#1A2B45; }
    .olym-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
    .olym-card { background:#FFFEF9; border:1px solid #D8CEB8; padding:32px 28px; display:flex; flex-direction:column; gap:16px; transition:border-color 0.3s,box-shadow 0.3s; }
    .olym-card:hover { border-color:#1A2B45; box-shadow:0 8px 32px rgba(26,43,69,0.09); }
    .olym-name { font-family:'EB Garamond',serif; font-size:1.6rem; font-weight:400; color:#1A2B45; line-height:1.1; }
    .olym-meta-row { display:flex; align-items:center; gap:8px; }
    .olym-meta-key { font-family:'Cormorant SC',serif; font-size:0.56rem; letter-spacing:0.18em; text-transform:uppercase; color:#9A8878; min-width:40px; }
    .olym-meta-val { font-family:'Lora',serif; font-size:0.8rem; color:#7A8A9A; font-style:italic; }
    .deadline-banner { background:#1A2B45; padding:12px 20px; display:flex; align-items:center; gap:12px; margin-bottom:2px; }
    .deadline-banner-text { font-family:'Cormorant SC',serif; font-size:0.62rem; letter-spacing:0.22em; text-transform:uppercase; color:#C8A87A; }
    .deadline-banner-date { font-family:'EB Garamond',serif; font-size:1.1rem; color:#EEE8E0; }
    .cred-card { border:2px solid #1A2B45; background:#FFFEF9; padding:28px 32px; margin-bottom:20px; }
    .cred-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding-bottom:16px; margin-bottom:16px; border-bottom:1px solid #E8E0D0; }
    .cred-row:last-child { padding-bottom:0; margin-bottom:0; border-bottom:none; }
    .cred-label { font-family:'Cormorant SC',serif; font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase; color:#7A6A58; margin-bottom:4px; }
    .cred-value { font-family:'EB Garamond',serif; font-size:1.5rem; color:#1A2B45; letter-spacing:0.05em; }
    .copy-btn { background:transparent; border:1px solid #D8CEB8; padding:6px 14px; font-family:'Cormorant SC',serif; font-size:0.6rem; letter-spacing:0.15em; color:#5A6A7A; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
    .copy-btn:hover { border-color:#1A2B45; color:#1A2B45; }
    .copy-btn.ok { border-color:#2A5A2A; color:#2A5A2A; }
    .cred-warning { background:#FFF8E8; border:1px solid #C8A87A; padding:14px 18px; font-family:'Lora',serif; font-size:0.78rem; color:#5A3A00; line-height:1.65; margin-bottom:28px; }
    .ftr { background:#0E1620; color:#7A8A9A; }
    .ftr a { color:#7A8A9A; text-decoration:none; transition:color 0.2s; }
    .ftr a:hover { color:#F9F7F2; }
    @media(max-width:900px){ .hdr-in{padding:0 20px;} .d-nav{display:none!important;} .m-grp{display:flex!important;} .eg{grid-template-columns:1fr 1fr!important;} .olym-grid{grid-template-columns:1fr 1fr!important;} }
    @media(max-width:580px){ .h-title{font-size:2.2rem!important;} .eg{grid-template-columns:1fr!important;} .cm{min-width:100%!important;} .modal-box{padding:28px 22px;} .olym-grid{grid-template-columns:1fr!important;} }
  `}</style>
);

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { rootMargin: "-50px", threshold: 0.07 }
    );
    ref.current.querySelectorAll(".rv").forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function useBarReveal() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

function LangToggle({ lang, setLang, scrolled }) {
  const bdr    = scrolled ? "rgba(26,43,69,0.3)"   : "rgba(200,216,240,0.2)";
  const actBg  = scrolled ? "#1A2B45"              : "#C8D8E8";
  const actTxt = scrolled ? "#F9F7F2"              : "#1A2B45";
  const idlTxt = scrolled ? "rgba(90,106,122,0.7)" : "rgba(200,216,240,0.45)";
  return (
    <div className="lt" style={{ borderColor: bdr }}>
      {["en", "ru"].map(l => (
        <button key={l} className="lt-btn" onClick={() => setLang(l)} style={{
          background: lang === l ? actBg  : "transparent",
          color:      lang === l ? actTxt : idlTxt,
          fontWeight: lang === l ? 500    : 300,
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

function Header({ lang, setLang }) {
  const [sc, setSc]     = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const col  = sc ? "#1A2B45" : "#C8D8E8";
  const keys = ["competitions", "experts", "transcript", "about"];
  return (
    <header className={"hdr" + (sc ? " sc" : "")}>
      <div className="hdr-in">
        <a href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, border: "1px solid " + (sc ? "#1A2B45" : "#3A5A7A"), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={15} color={sc ? "#1A2B45" : "#8AAABB"} />
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.76rem", letterSpacing: "0.2em", color: sc ? "#1A2B45" : "#EAE7E0", lineHeight: 1.2 }}>
              {t(COPY.footer.instName, lang)}
            </div>
            <div style={{ fontFamily: "'Lora',serif", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: sc ? "#9A8878" : "#7A9AB8" }}>
              {t(COPY.header.tagline, lang)}
            </div>
          </div>
        </a>
        <nav className="d-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {keys.map(k => (
            <a key={k} href={"#" + k} className="nav-a" style={{ color: col }}>{t(COPY.nav[k], lang)}</a>
          ))}
          <a href="/cabinet.html" target="_blank" rel="noopener noreferrer" className="nav-a" style={{ color: col }}>
            {lang === "en" ? "Cabinet" : "Кабинет"}
          </a>
          <LangToggle lang={lang} setLang={setLang} scrolled={sc} />
          <a href="#registration" className="nav-cta">{t(COPY.nav.register, lang)}</a>
        </nav>
        <div className="m-grp" style={{ display: "none", alignItems: "center", gap: 12 }}>
          <LangToggle lang={lang} setLang={setLang} scrolled={sc} />
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            {open ? <X size={22} color={sc ? "#1A2B45" : "#F9F7F2"} /> : <Menu size={22} color={sc ? "#1A2B45" : "#F9F7F2"} />}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ background: "#F9F7F2", borderTop: "1px solid #D8CEB8", padding: "20px 24px" }}>
          {[...keys, "register"].map(k => (
            <a key={k} href={"#" + (k === "register" ? "registration" : k)} className="nav-a"
              style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #EEE8DA", color: "#1A2B45" }}
              onClick={() => setOpen(false)}>
              {t(COPY.nav[k], lang)}
            </a>
          ))}
          <a href="/cabinet.html" target="_blank" rel="noopener noreferrer" className="nav-a"
            style={{ display: "block", padding: "12px 0", borderBottom: "1px solid #EEE8DA", color: "#1A2B45" }}
            onClick={() => setOpen(false)}>
            {lang === "en" ? "Personal Cabinet" : "Личный кабинет"}
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const lang = useLang();
  const c = COPY.hero;
  return (
    <section className="hero" id="home">
      <div className="h-line" style={{ left: "8%" }} />
      <div className="h-line" style={{ right: "8%" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1, paddingTop: 80 }}>
        <div style={{ maxWidth: 860 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 52 }}>
            <div style={{ width: 44, height: 1, background: "#4A0E0E" }} />
            <span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.62rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "#7A9AB8" }}>{t(c.est, lang)}</span>
          </div>
          <h1 className="h-title" style={{ fontFamily: "'EB Garamond',serif", fontSize: "3.9rem", fontWeight: 400, lineHeight: 1.1, color: "#EEE8E0", marginBottom: 28 }}>
            {t(c.line1, lang)}<br /><em style={{ color: "#C8A87A" }}>{t(c.line2, lang)}</em>
          </h1>
          <p style={{ fontFamily: "'Lora',serif", fontSize: "0.98rem", color: "#7A9AB8", fontStyle: "italic", marginBottom: 14 }}>{t(c.quote, lang)}</p>
          <p style={{ fontFamily: "'Lora',serif", fontSize: "1rem", color: "#8AAABE", lineHeight: 1.88, marginBottom: 68, maxWidth: 600 }}>{t(c.body, lang)}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 52, marginBottom: 80 }}>
            {c.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "2.4rem", color: "#C8A87A", lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#8AAABE", lineHeight: 1.5 }}>{t(s, lang)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bnc" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
          <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom, #4A0E0E, transparent)" }} />
          <span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.28em", color: "#3A5A6A", textTransform: "uppercase" }}>{t(c.scroll, lang)}</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  const lang = useLang();
  const ref  = useReveal();
  const c    = COPY.about;
  const icons = [<Award size={15} key="a" />, <FileText size={15} key="f" />, <Users size={15} key="u" />];
  return (
    <section id="about" ref={ref} style={{ background: "#EEE8E0", borderTop: "1px solid #D8CEB8", borderBottom: "1px solid #D8CEB8", padding: "72px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 56 }}>
        <div className="rv pq">
          <p style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.2rem", fontStyle: "italic", color: "#1A2B45", lineHeight: 1.75 }}>{t(c.quote, lang)}</p>
        </div>
        <div className="rv d2">
          <div className="slbl" style={{ marginBottom: 16 }}>{t(c.label, lang)}</div>
          <p style={{ fontFamily: "'Lora',serif", fontSize: "0.88rem", color: "#384858", lineHeight: 1.95 }}>{t(c.body, lang)}</p>
        </div>
        <div className="rv d3" style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {c.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 38, height: 38, border: "1px solid #4A0E0E", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#4A0E0E" }}>{icons[i]}</div>
              <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "#1A2B45", paddingTop: 10 }}>{t(item, lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Olympiads() {
  const lang = useLang();
  const ref  = useReveal();
  const c    = COPY.olympiadSection;
  return (
    <section id="competitions" ref={ref} style={{ padding: "100px 40px", background: "#F9F7F2" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 680, marginBottom: 56 }}>
          <div className="slbl rv" style={{ marginBottom: 20 }}>{t(c.label, lang)}</div>
          <h2 className="rv d1" style={{ fontFamily: "'EB Garamond',serif", fontSize: "2.9rem", fontWeight: 400, color: "#1A2B45", lineHeight: 1.12, marginBottom: 28 }}>
            {t(c.headline, lang)}
          </h2>
          <div className="orn rv d2"><span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.85rem", letterSpacing: "0.3em", whiteSpace: "nowrap" }}>* * *</span></div>
          <p className="rv d2" style={{ fontFamily: "'Lora',serif", fontSize: "0.9rem", color: "#5A6A7A", lineHeight: 1.88, marginTop: 24 }}>{t(c.body, lang)}</p>
        </div>

        {/* Deadline banner */}
        <div className="deadline-banner rv d2" style={{ marginBottom: 16 }}>
          <div>
            <div className="deadline-banner-text">{t(c.deadlineLabel, lang)}</div>
            <div className="deadline-banner-date">{t(c.deadlineVal, lang)}</div>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: "'Lora',serif", fontSize: "0.78rem", color: "#8A9AB8", fontStyle: "italic" }}>
            {lang === "en" ? "Olympiad dates to be announced" : "Даты олимпиад будут объявлены"}
          </div>
        </div>

        <div className="olym-grid">
          {COPY.olympiads.map((sub, i) => (
            <div key={sub.key} className={"olym-card rv d" + (i + 1)}>
              <div className="olym-name">{lang === "en" ? sub.en : sub.ru}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="olym-meta-row">
                  <Calendar size={12} color="#4A0E0E" />
                  <span className="olym-meta-key">{t(c.dateLabel, lang)}</span>
                  <span className="olym-meta-val">{lang === "en" ? sub.dateEn : sub.dateRu}</span>
                </div>
                <div className="olym-meta-row">
                  <Clock size={12} color="#4A0E0E" />
                  <span className="olym-meta-key">{t(c.timeLabel, lang)}</span>
                  <span className="olym-meta-val">{sub.time}</span>
                </div>
              </div>
              <a href="#registration" className="btn-o" style={{ textAlign: "center", fontSize: "0.6rem", padding: "10px 18px", marginTop: 4 }}>
                {t(c.registerBtn, lang)}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experts() {
  const lang = useLang();
  const ref  = useReveal();
  const c    = COPY.experts;
  const hl   = t(c.headline, lang);
  return (
    <section id="experts" ref={ref} style={{ padding: "100px 40px", background: "#EEE8E0", borderTop: "1px solid #D8CEB8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32, marginBottom: 68 }}>
          <div>
            <div className="slbl rv" style={{ marginBottom: 20 }}>{t(c.label, lang)}</div>
            <h2 className="rv d1" style={{ fontFamily: "'EB Garamond',serif", fontSize: "2.9rem", fontWeight: 400, color: "#1A2B45", lineHeight: 1.12 }}>
              {hl[0]}<br />{hl[1]}
            </h2>
          </div>
          <p className="rv d2" style={{ fontFamily: "'Lora',serif", fontSize: "0.88rem", color: "#5A6A7A", lineHeight: 1.88, maxWidth: 360 }}>{t(c.body, lang)}</p>
        </div>
        <div className="eg" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {COPY.expertsData.map((e, i) => (
            <div key={i} className={"ec rv d" + (i + 1)} style={{ padding: "40px 30px" }}>
              <div style={{ width: 68, height: 68, background: "#1A2B45", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "1.05rem", color: "#C8A87A" }}>{e.ini}</span>
              </div>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.2rem", fontWeight: 500, color: "#1A2B45", marginBottom: 16 }}>{t(e.name, lang)}</h3>
              <div style={{ width: 28, height: 1, background: "#4A0E0E", marginBottom: 16 }} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#3A4A5A", lineHeight: 1.65, marginBottom: 18 }}>{t(e.cred, lang)}</p>
              <div style={{ borderTop: "1px solid #E2D8C8", paddingTop: 16, marginBottom: 12 }}>
                <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#9A8878", marginBottom: 4, textTransform: "uppercase" }}>{t(c.spec, lang)}</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#1A2B45", lineHeight: 1.4 }}>{t(e.field, lang)}</div>
              </div>
              <div style={{ borderTop: "1px solid #E2D8C8", paddingTop: 12 }}>
                <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#9A8878", marginBottom: 4, textTransform: "uppercase" }}>{t(c.prior, lang)}</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: "0.74rem", color: "#5A6A7A", fontStyle: "italic" }}>{t(e.prior, lang)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Transcript() {
  const lang = useLang();
  const ref  = useReveal();
  const { ref: barRef, on } = useBarReveal();
  const c = COPY.transcript;
  return (
    <section id="transcript" ref={ref} style={{ padding: "100px 40px", background: "#F9F7F2", borderTop: "1px solid #D8CEB8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 88, alignItems: "start" }}>
        <div>
          <div className="slbl rv" style={{ marginBottom: 20 }}>{t(c.label, lang)}</div>
          <h2 className="rv d1" style={{ fontFamily: "'EB Garamond',serif", fontSize: "2.6rem", fontWeight: 400, color: "#1A2B45", lineHeight: 1.12, marginBottom: 32 }}>
            {t(c.h1, lang)}<br />{t(c.h2, lang)}
          </h2>
          <div className="rv d2">
            <p style={{ fontFamily: "'Lora',serif", fontSize: "0.9rem", color: "#384858", lineHeight: 1.92, marginBottom: 18 }}>{t(c.p1, lang)}</p>
            <p style={{ fontFamily: "'Lora',serif", fontSize: "0.9rem", color: "#384858", lineHeight: 1.92 }}>{t(c.p2, lang)}</p>
          </div>
          <div className="rv d3" style={{ marginTop: 40, background: "#1A2B45", padding: "32px 36px" }}>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.26em", color: "#7A9AB8", textTransform: "uppercase", marginBottom: 18 }}>{t(c.blockLabel, lang)}</div>
            <p style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.02rem", fontStyle: "italic", color: "#C8D8E8", lineHeight: 1.8 }}>{t(c.blockBody, lang)}</p>
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #2A4A6A", fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#4A7A9A" }}>
              {t(c.reviewer, lang)}
            </div>
          </div>
        </div>
        <div ref={barRef}>
          <div className="rv" style={{ border: "1px solid #D8CEB8", background: "#FFFEF9", padding: "40px" }}>
            <div style={{ textAlign: "center", paddingBottom: 28, borderBottom: "1px solid #E8E0D0", marginBottom: 32 }}>
              <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#9A8878", textTransform: "uppercase", marginBottom: 10 }}>{t(c.instName, lang)}</div>
              <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.4rem", color: "#1A2B45", marginBottom: 8 }}>{t(c.mockTitle, lang)}</div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: "0.7rem", color: "#8A7A66", fontStyle: "italic", lineHeight: 1.65 }}>{t(c.mockComp, lang)}<br />{t(c.mockCand, lang)}</div>
            </div>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "#7A8A9A", textTransform: "uppercase", marginBottom: 22 }}>{t(c.compLabel, lang)}</div>
            {COPY.scores.map((s, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#1A2B45" }}>{t(s, lang)}</span>
                  <span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.82rem", color: "#4A0E0E", minWidth: 30, textAlign: "right" }}>{on ? s.v : "-"}</span>
                </div>
                <div className="sb-t"><div className="sb-f" style={{ width: on ? s.v + "%" : "0%", transitionDelay: i * 0.13 + "s" }} /></div>
              </div>
            ))}
            <div style={{ marginTop: 28, background: "#1A2B45", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#8A9AB8", textTransform: "uppercase", marginBottom: 4 }}>{t(c.overall, lang)}</div>
                <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "0.92rem", fontStyle: "italic", color: "#C8D8E8" }}>{t(c.verdict, lang)}</div>
              </div>
              <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "1.9rem", color: "#C8A87A" }}>{on ? "81" : "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentModal({ isOpen, onClose, onConfirm, applicantName, feeDisplay, selectedCategories, lang, sending }) {
  const c = COPY.modal;
  useEffect(() => {
    if (!isOpen) return;
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #E8E0D0" }}>
          <div className="slbl" style={{ marginBottom: 12 }}>{t(c.title, lang)}</div>
          <p style={{ fontFamily: "'Lora',serif", fontSize: "0.85rem", color: "#5A6A7A", lineHeight: 1.75 }}>{t(c.sub, lang)}</p>
          {applicantName && (
            <div style={{ marginTop: 14, padding: "10px 16px", background: "#EEE8E0", border: "1px solid #D8CEB8" }}>
              <span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.18em", color: "#7A6A58" }}>
                {lang === "en" ? "APPLICANT" : "ЗАЯВИТЕЛЬ"}
              </span>
              <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "1rem", color: "#1A2B45", marginTop: 2 }}>{applicantName}</div>
            </div>
          )}
        </div>
        {selectedCategories && selectedCategories.length > 0 && (
          <div style={{ marginBottom: 24, padding: "14px 18px", background: "#F2EEE6", borderLeft: "3px solid #4A0E0E" }}>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#7A6A58", textTransform: "uppercase", marginBottom: 10 }}>{t(c.subjectsLabel, lang)}</div>
            {selectedCategories.map((cat, i) => (
              <div key={i} style={{ fontFamily: "'Lora',serif", fontSize: "0.8rem", color: "#1A2B45", marginBottom: 4 }}>{i + 1}. {cat}</div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, padding: "16px 20px", border: "1px solid #1A2B45" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "#7A6A58", textTransform: "uppercase", marginBottom: 4 }}>{t(c.feeLabel, lang)}</div>
            <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "2rem", color: "#1A2B45", lineHeight: 1 }}>{feeDisplay}</div>
          </div>
          {selectedCategories && selectedCategories.length > 1 && (
            <div style={{ fontFamily: "'Lora',serif", fontSize: "0.72rem", color: "#4A0E0E", fontStyle: "italic" }}>
              {lang === "en" ? "Discount applied" : "Скидка применена"}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "#7A8A9A", textTransform: "uppercase", marginBottom: 16 }}>{t(c.qrLabel, lang)}</div>
          <div style={{ width: 200, height: 200, margin: "0 auto" }}>
            <img src="/qr-kaspi.jpg" alt={t(c.qrAlt, lang)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>
        <div style={{ marginBottom: 32, padding: "16px 20px", background: "#F2EEE6", borderLeft: "3px solid #D8CEB8" }}>
          <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#7A6A58", textTransform: "uppercase", marginBottom: 10 }}>{t(c.orLabel, lang)}</div>
          <div style={{ fontFamily: "'Lora',serif", fontSize: "0.82rem", color: "#1A2B45", lineHeight: 1.8 }}>{t(c.accountNo, lang)}</div>
          <div style={{ fontFamily: "'Lora',serif", fontSize: "0.78rem", color: "#5A6A7A", fontStyle: "italic" }}>{t(c.reference, lang)}</div>
        </div>
        <p style={{ fontFamily: "'Lora',serif", fontSize: "0.74rem", color: "#7A8A9A", lineHeight: 1.7, marginBottom: 28, fontStyle: "italic" }}>{t(c.disclaimer, lang)}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={onConfirm} disabled={sending}
            style={{ flex: 1, background: "#1A2B45", color: "#F9F7F2", fontFamily: "'Cormorant SC',serif", fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", border: "none", padding: "16px 24px", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.65 : 1, transition: "background 0.3s" }}
            onMouseOver={e => { if (!sending) e.currentTarget.style.background = "#4A0E0E"; }}
            onMouseOut={e  => { e.currentTarget.style.background = "#1A2B45"; }}>
            {sending ? t(c.confirmSending, lang) : t(c.confirmBtn, lang)}
          </button>
          <button onClick={onClose} disabled={sending}
            style={{ background: "transparent", color: "#5A6A7A", fontFamily: "'Cormorant SC',serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid #D8CEB8", padding: "16px 24px", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.5 : 1, transition: "all 0.25s" }}
            onMouseOver={e => { if (!sending) { e.currentTarget.style.borderColor = "#1A2B45"; e.currentTarget.style.color = "#1A2B45"; }}}
            onMouseOut={e  => { e.currentTarget.style.borderColor = "#D8CEB8"; e.currentTarget.style.color = "#5A6A7A"; }}>
            {t(c.cancelBtn, lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyBtn({ text, lang }) {
  const [done, setDone] = useState(false);
  const sc = COPY.success;
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 2000); });
  };
  return (
    <button className={"copy-btn" + (done ? " ok" : "")} onClick={handle}>
      {done ? t(sc.copied, lang) : t(sc.copyHint, lang)}
    </button>
  );
}

function Field({ id, label, children, error }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <label className="fi-label" htmlFor={id}>{label}</label>
      {children}
      {error && <div className="fi-err">{error}</div>}
    </div>
  );
}

function RegistrationForm() {
  const lang = useLang();
  const ref  = useReveal();
  const c    = COPY.regForm;

  const [fields, setFields]               = useState({ name: "", email: "", phone: "", categories: [] });
  const [errors, setErrors]               = useState({});
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalTouched,  setLegalTouched]  = useState(false);
  const [showModal,  setShowModal]        = useState(false);
  const [submitted,  setSubmitted]        = useState(false);
  const [credentials, setCredentials]     = useState({ login: "", password: "" });
  const [sending,    setSending]          = useState(false);

  const selectedCount = fields.categories.length;
  const totalFee      = FEE_TABLE[selectedCount] || 0;
  const feeDisplay    = selectedCount > 0 ? totalFee.toLocaleString() + " KZT" : "-";

  const subjectWord = (n) => {
    if (lang === "ru") {
      if (n === 1) return "предмет";
      if (n >= 2 && n <= 4) return "предмета";
      return "предметов";
    }
    return n === 1 ? "subject" : "subjects";
  };

  const handleChange = (field, value) => {
    setFields(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  const toggleCategory = (val) => {
    setFields(f => {
      const already = f.categories.includes(val);
      const next    = already ? f.categories.filter(v => v !== val) : [...f.categories, val];
      return { ...f, categories: next };
    });
    if (errors.categories) setErrors(e => ({ ...e, categories: "" }));
  };

  const validate = () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\+?[0-9\s\-().]{7,20}$/;
    const next = {};
    if (!fields.name.trim())              next.name       = t(c.errRequired, lang);
    if (!fields.email.trim())             next.email      = t(c.errRequired, lang);
    else if (!emailRe.test(fields.email)) next.email      = t(c.errEmail, lang);
    if (!fields.phone.trim())             next.phone      = t(c.errRequired, lang);
    else if (!phoneRe.test(fields.phone)) next.phone      = t(c.errPhone, lang);
    if (fields.categories.length === 0)   next.categories = t(c.errCat, lang);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    setLegalTouched(true);
    if (!validate() || !legalAccepted) return;
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    if (sending) return;
    setSending(true);
    const login    = "OL-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);
    const password = Math.random().toString(36).slice(2, 8).toUpperCase();
    const time     = new Date().toLocaleString("ru-KZ", { timeZone: "Asia/Almaty" });
    await fetch(SHEETS_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: time, name: fields.name, email: fields.email,
        phone: fields.phone, categories: fields.categories.join("; "),
        fee: totalFee, login, password, lang,
      }),
    });
    setCredentials({ login, password });
    setShowModal(false);
    setSubmitted(true);
    setSending(false);
  };

  const handleReset = () => {
    setFields({ name: "", email: "", phone: "", categories: [] });
    setErrors({});
    setLegalAccepted(false);
    setLegalTouched(false);
    setSubmitted(false);
    setCredentials({ login: "", password: "" });
    setSending(false);
  };

  const sc = COPY.success;

  return (
    <section id="registration" ref={ref} style={{ padding: "100px 40px", background: "#F9F7F2", borderTop: "1px solid #D8CEB8" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ maxWidth: 640, marginBottom: 64 }}>
          <div className="slbl rv" style={{ marginBottom: 20 }}>{t(c.sectionLabel, lang)}</div>
          <h2 className="rv d1" style={{ fontFamily: "'EB Garamond',serif", fontSize: "2.9rem", fontWeight: 400, color: "#1A2B45", lineHeight: 1.12, marginBottom: 20 }}>
            {t(c.headline, lang)}
          </h2>
          <p className="rv d2" style={{ fontFamily: "'Lora',serif", fontSize: "0.9rem", color: "#5A6A7A", lineHeight: 1.88 }}>
            {t(c.sub, lang)}
          </p>
        </div>

        {submitted ? (
          <div className="rv in" style={{ border: "1px solid #1A2B45", background: "#FFFEF9", padding: "52px 56px" }}>
            <CheckCircle size={36} color="#1A2B45" style={{ marginBottom: 20 }} />
            <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: "2.2rem", fontWeight: 400, color: "#1A2B45", marginBottom: 16 }}>
              {t(sc.headline, lang)}
            </h3>
            <p style={{ fontFamily: "'Lora',serif", fontSize: "0.9rem", color: "#3A4A5A", lineHeight: 1.85, marginBottom: 32, maxWidth: 520 }}>
              {t(sc.body, lang)}
            </p>
            <div className="cred-card">
              <div className="cred-row">
                <div>
                  <div className="cred-label">{t(sc.loginLabel, lang)}</div>
                  <div className="cred-value">{credentials.login}</div>
                </div>
                <CopyBtn text={credentials.login} lang={lang} />
              </div>
              <div className="cred-row">
                <div>
                  <div className="cred-label">{t(sc.passLabel, lang)}</div>
                  <div className="cred-value" style={{ letterSpacing: "0.12em" }}>{credentials.password}</div>
                </div>
                <CopyBtn text={credentials.password} lang={lang} />
              </div>
            </div>
            <div className="cred-warning">{t(sc.warning, lang)}</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="/cabinet.html" target="_blank" rel="noopener noreferrer" className="btn-p">
                {t(sc.cabinetBtn, lang)}
              </a>
              <button className="btn-o" onClick={handleReset}>{t(sc.newBtn, lang)}</button>
            </div>
          </div>
        ) : (
          <div className="rv d2" style={{ background: "#FFFEF9", border: "1px solid #D8CEB8", padding: "52px 56px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "0 48px" }}>
              <Field id="name" label={t(c.nameLabel, lang)} error={errors.name}>
                <input id="name" className={"fi" + (errors.name ? " err" : "")}
                  placeholder={t(c.namePlaceholder, lang)} value={fields.name}
                  onChange={e => handleChange("name", e.target.value)} />
              </Field>
              <Field id="email" label={t(c.emailLabel, lang)} error={errors.email}>
                <input id="email" type="email" className={"fi" + (errors.email ? " err" : "")}
                  placeholder={t(c.emailPlaceholder, lang)} value={fields.email}
                  onChange={e => handleChange("email", e.target.value)} />
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field id="phone" label={t(c.phoneLabel, lang)} error={errors.phone}>
                  <input id="phone" type="tel" className={"fi" + (errors.phone ? " err" : "")}
                    placeholder={t(c.phonePlaceholder, lang)} value={fields.phone}
                    onChange={e => handleChange("phone", e.target.value)} />
                </Field>
              </div>
              <div style={{ gridColumn: "1 / -1", marginBottom: 28 }}>
                <label className="fi-label">{t(c.catLabel, lang)}</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 8, marginTop: 4 }}>
                  {c.cats.map(cat => {
                    const checked = fields.categories.includes(cat.val);
                    return (
                      <div key={cat.val} className={"cat-row" + (checked ? " sel" : "")} onClick={() => toggleCategory(cat.val)}>
                        <div className={"cat-chk" + (checked ? " sel" : "")}>
                          {checked && <span style={{ color: "#F9F7F2", fontSize: "11px", lineHeight: 1 }}>v</span>}
                        </div>
                        <span style={{ fontFamily: "'Lora',serif", fontSize: "0.84rem", color: "#1A2B45" }}>
                          {lang === "en" ? cat.en : cat.ru}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {errors.categories && <div className="fi-err" style={{ marginTop: 8 }}>{errors.categories}</div>}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E8E0D0", margin: "12px 0 32px" }} />

            <div style={{ marginBottom: 32 }}>
              <div className="legal-row">
                <div className="cb-wrap">
                  <input type="checkbox" className="cb-real" id="legal" checked={legalAccepted}
                    onChange={e => { setLegalAccepted(e.target.checked); setLegalTouched(true); }} />
                  <label htmlFor="legal" className={"cb-box " + (legalAccepted ? "checked " : "") + (legalTouched && !legalAccepted ? "cb-err" : "")}>
                    {legalAccepted && <span className="cb-tick">v</span>}
                  </label>
                </div>
                <div className="legal-text">
                  {t(c.legalPre, lang)}
                  <a href="/offer.pdf"   target="_blank" rel="noopener noreferrer" className="legal-link">{t(c.legalOffer, lang)}</a>
                  <a href="/refund.pdf"  target="_blank" rel="noopener noreferrer" className="legal-link">{t(c.legalRefund, lang)}</a>
                  {t(c.legalAnd, lang)}
                  <a href="/privacy.pdf" target="_blank" rel="noopener noreferrer" className="legal-link">{t(c.legalPriv, lang)}</a>
                  {t(c.legalPost, lang)}
                </div>
              </div>
              {legalTouched && !legalAccepted && (
                <div className="fi-err" style={{ marginTop: 10, marginLeft: 34 }}>
                  <AlertCircle size={13} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
                  {t(c.errLegal, lang)}
                </div>
              )}
            </div>

            <p style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#8A7A66", fontStyle: "italic", marginBottom: 20, lineHeight: 1.65 }}>
              {t(c.feeNote, lang)}
            </p>

            <div style={{ marginBottom: 24, border: "1px solid #C8A87A", background: "#FDFAF3", padding: "20px 24px" }}>
              <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#4A0E0E", marginBottom: 10 }}>
                {t(c.discountTitle, lang)}
              </div>
              <p style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#5A6A7A", lineHeight: 1.65, marginBottom: 14 }}>
                {t(c.discountSub, lang)}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
                {c.pricingRows.map(row => (
                  <div key={row.n} style={{ padding: "10px 12px", background: selectedCount === row.n ? "#1A2B45" : "transparent", border: "1px solid " + (selectedCount === row.n ? "#1A2B45" : "#E8E0D0"), transition: "all 0.2s" }}>
                    <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.56rem", letterSpacing: "0.15em", color: selectedCount === row.n ? "#8A9AB8" : "#9A8878", textTransform: "uppercase", marginBottom: 4 }}>
                      {row.n} {subjectWord(row.n)}
                    </div>
                    <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "1rem", color: selectedCount === row.n ? "#C8A87A" : "#1A2B45" }}>{row.price}</div>
                    <div style={{ fontFamily: "'Lora',serif", fontSize: "0.68rem", color: selectedCount === row.n ? "#7A9AB8" : "#9A8878", fontStyle: "italic" }}>
                      {lang === "en" ? row.saveEn : row.saveRu}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCount > 0 && (
              <div style={{ marginBottom: 20, padding: "16px 22px", background: "#1A2B45", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "#8A9AB8", textTransform: "uppercase", marginBottom: 4 }}>
                    {lang === "en"
                      ? "Total for " + selectedCount + " " + subjectWord(selectedCount)
                      : "Итого за " + selectedCount + " " + subjectWord(selectedCount)}
                  </div>
                  {selectedCount > 1 && (
                    <div style={{ fontFamily: "'Lora',serif", fontSize: "0.72rem", color: "#C8A87A", fontStyle: "italic" }}>
                      {t(c.discountApplied, lang)}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "2rem", color: "#C8A87A", lineHeight: 1 }}>{feeDisplay}</div>
              </div>
            )}

            <button className={"pay-btn " + (legalAccepted ? "active" : "disabled")}
              onClick={handleSubmit}
              title={!legalAccepted ? t(c.btnDisabled, lang) : undefined}
              style={{ cursor: legalAccepted ? "pointer" : "not-allowed" }}
              aria-disabled={!legalAccepted}>
              {t(c.btnPay, lang)}
            </button>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmPayment}
        sending={sending}
        applicantName={fields.name}
        feeDisplay={feeDisplay}
        selectedCategories={fields.categories}
        lang={lang}
      />
    </section>
  );
}

function Footer() {
  const lang = useLang();
  const c    = COPY.footer;
  return (
    <footer className="ftr" style={{ padding: "68px 40px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 52, marginBottom: 56, paddingBottom: 48, borderBottom: "1px solid #1E2E40" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, border: "1px solid #2A3E52", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={14} color="#7A9AB8" />
              </div>
              <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.7rem", letterSpacing: "0.18em", color: "#C8D8E8" }}>
                {t(c.instName, lang)}
              </div>
            </div>
            <p style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#5A6A7A", lineHeight: 1.8, marginBottom: 14 }}>{t(c.tagline, lang)}</p>
            <div style={{ fontFamily: "'Lora',serif", fontSize: "0.7rem", color: "#3A4A5A", fontStyle: "italic" }}>{t(c.location, lang)}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.62rem", letterSpacing: "0.22em", color: "#C8D4E0", textTransform: "uppercase", marginBottom: 18 }}>{t(c.navHd, lang)}</div>
            {c.navLinks.map((l, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <a href={l.href} style={{ fontFamily: "'Lora',serif", fontSize: "0.78rem" }}>{t(l, lang)}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.62rem", letterSpacing: "0.22em", color: "#C8D4E0", textTransform: "uppercase", marginBottom: 18 }}>{t(c.legalHd, lang)}</div>
            {c.legalLinks.map((l, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Lora',serif", fontSize: "0.78rem" }}>{t(l, lang)}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.62rem", letterSpacing: "0.22em", color: "#C8D4E0", textTransform: "uppercase", marginBottom: 18 }}>{t(c.contactHd, lang)}</div>
            <div style={{ fontFamily: "'Lora',serif", fontSize: "0.78rem", color: "#5A6A7A", lineHeight: 2.1 }}>
              <div><a href="mailto:info.russellinstitute@gmail.com">info.russellinstitute@gmail.com</a></div>
              <div>+7 706 706 29 56</div>
              <div style={{ marginTop: 14, fontStyle: "italic", color: "#3A4A5A", lineHeight: 1.6, fontSize: "0.72rem" }}>
                MSM Group<br />{t(c.ie, lang)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: "'Lora',serif", fontSize: "0.7rem", color: "#3A4A5A" }}>© {t(c.copy, lang)}</div>
          <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.22em", color: "#2A3A4A", textTransform: "uppercase" }}>{t(c.est, lang)}</div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  return (
    <LangCtx.Provider value={lang}>
      <div className="mi">
        <GF />
        <Header lang={lang} setLang={setLang} />
        <main>
          <Hero />
          <About />
          <Olympiads />
          <Experts />
          <Transcript />
          <RegistrationForm />
        </main>
        <Footer />
      </div>
    </LangCtx.Provider>
  );
}