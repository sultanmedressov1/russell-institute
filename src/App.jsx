import { useState, useEffect, useRef, createContext, useContext } from "react";
import { BookOpen, Award, Users, FileText, Menu, X, CheckCircle, AlertCircle } from "lucide-react";

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbxp3Nw0PryyQrfzaRQKjC6gNL3m5FkUiPPwyRPjaxTx9eG7MDUVt3gkNV2NQ6I4fvjc/exec";

const LangCtx = createContext("en");
const useLang = () => useContext(LangCtx);
const t = (copy, lang) => copy[lang] ?? copy.en;

const COPY = {
  nav: {
    competitions: { en: "Competitions", ru: "Конкурсы" },
    experts:      { en: "Experts",      ru: "Эксперты" },
    transcript:   { en: "The Transcript", ru: "Транскрипт" },
    about:        { en: "About",        ru: "О нас" },
    register:     { en: "Register",     ru: "Регистрация" },
  },
  header: {
    tagline: { en: "Academic Excellence · Independent Research", ru: "Академическое Превосходство · Независимые Исследования" },
  },
  hero: {
    est:   { en: "Astana, Kazakhstan", ru: "Астана, Казахстан" },
    line1: { en: "The Discipline of Thought", ru: "Дисциплина Мышления" },
    line2: { en: "Is the Foundation of All Achievement", ru: "Основа Всякого Достижения" },
    quote: { en: '"Disciplina cogitationis est fundamentum omnis praestantiae."', ru: '"The discipline of thought is the foundation of all achievement."' },
    body:  { en: "The Russell Institute invites scholars of uncommon ambition to engage with the great questions of philosophy, economics, and political theory — and to have their reasoning evaluated by an independent board of academic experts.", ru: "Russell Institute открывает пространство для тех, кто готов бросить интеллектуальный вызов современности. Мы приглашаем молодых исследователей к осмыслению фундаментальных парадигм философии, экономики и политики — для прохождения строгой экспертизы их суждений независимым международным академическим советом." },
    stats: [
      { n: "IV", en: "Open Essay Competitions", ru: "Открытых конкурса эссе" },
      { n: "IV", en: "Expert Reviewers",        ru: "Эксперта-рецензента" },
      { n: "I",  en: "Academic Transcript",     ru: "Академический транскрипт" },
    ],
    scroll: { en: "Scroll", ru: "Листать" },
  },
  about: {
    label: { en: "Our Mission", ru: "Наша Миссия" },
    quote: { en: '"The purpose of education is not to fill a pail, but to light a fire — a fire of curiosity, discipline, and intellectual courage."', ru: '"Цель образования — не в том, чтобы наполнить сосуд, а в том, чтобы зажечь огонь — огонь любознательности, дисциплины и интеллектуальной смелости."' },
    body:  { en: "The Russell Institute exists to cultivate the next generation of independent thinkers in Central Asia and beyond. We offer rigorous essay competitions and olympiads assessed by internationally credentialled academics, producing a formal Academic Transcript that distinguishes any university application.", ru: "The Russell Institute создан для воспитания нового поколения независимых мыслителей в Центральной Азии и за её пределами. Мы проводим строгие конкурсы эссе и олимпиады, оцениваемые академически признанными специалистами." },
    items: [
      { en: "Independent Expert Review",  ru: "Независимая экспертная оценка" },
      { en: "Formal Academic Transcript", ru: "Официальный академический транскрипт" },
      { en: "Oxford-Style Assessment",    ru: "Оценка по Оксфордской модели" },
    ],
  },
  competitions: {
    label:       { en: "Open Competitions", ru: "Открытые Конкурсы" },
    headline:    { en: "Questions Worthy of Serious Inquiry", ru: "Вопросы, Достойные Серьёзного Изучения" },
    body:        { en: "Each competition essay is assessed across five academic competency domains by a member of our Expert Board. Participants receive a detailed written review alongside their formal transcript.", ru: "Каждое конкурсное эссе оценивается по пяти академическим компетенциям членом нашего Совета экспертов. Участники получают подробный письменный отзыв вместе с официальным транскриптом." },
    deadline:    { en: "Deadline",    ru: "Срок подачи" },
    wordCount:   { en: "Word Count",  ru: "Объём" },
    words:       { en: "words",       ru: "слов" },
    eligibility: { en: "Eligibility", ru: "Условия участия" },
    level:       { en: "Open · Undergraduate & Sixth Form", ru: "Открытый · Студенты и старшеклассники" },
    submit:      { en: "Submit Essay", ru: "Подать Эссе" },
  },
  comps: [
    {
      num: "I",
      tag:   { en: "Engineering, Technology, and IT", ru: "Инженерия, технологии и IT" },
      title: { en: "On the Acceptability of Risk", ru: "О допустимости риска" },
      q:     { en: "Innovation in engineering, physics, and computer science often relies on trial and error and involves uncertainty. How should we determine which risks are acceptable, and under what conditions does taking such risks become justified rather than irresponsible?", ru: "Инновации в инженерии, физике и компьютерных науках часто основаны на методе проб и ошибок и связаны с неопределенностью. Как следует определять, какие риски допустимы, и при каких условиях принятие таких рисков становится оправданным, а не безответственным?" },
      due:   { en: "15 April 2026", ru: "15 апреля 2026" },
      wc: "1,000 – 1,500",
    },
    {
      num: "II",
      tag:   { en: "Life Sciences and Medicine", ru: "Биологические науки и медицина" },
      title: { en: "Biotechnological Intervention and Evolution", ru: "Биотехнологическое вмешательство и Эволюция" },
      q:     { en: "If CRISPR technology allows us to eliminate genetic diseases, do we have the moral right to permanently alter human DNA? Should we risk interfering with natural evolution for the sake of immediate biological improvement?", ru: "Если технология CRISPR позволит нам полностью устранить генетические заболевания, имеем ли мы моральное право навсегда изменять ДНК человека? Стоит ли вмешиваться в естественный ход эволюции ради сиюминутного биологического улучшения?" },
      due:   { en: "15 April 2026", ru: "15 апреля 2026" },
      wc: "1,000 – 1,500",
    },
    {
      num: "III",
      tag:   { en: "Economics, Business and Political Theory", ru: "Экономика, Бизнес и политическая теория" },
      title: { en: "On the Nature of Economic Inequality", ru: "О природе экономического неравенства" },
      q:     { en: "To what extent is economic inequality an inherent consequence of efficient market systems, and under what conditions, if any, does it indicate failures in their operation rather than their proper functioning?", ru: "В какой мере экономическое неравенство является неизбежным следствием эффективного функционирования рыночных систем, и при каких условиях, если таковые имеются, оно свидетельствует о сбоях в их работе?" },
      due:   { en: "15 April 2026", ru: "15 апреля 2026" },
      wc: "1,000 – 1,500",
    },
    {
      num: "IV",
      tag:   { en: "Business, Marketing and Human Resources", ru: "Бизнес, Маркетинг и Управление персоналом" },
      title: { en: "Balancing Employee Autonomy and Corporate Control", ru: "Баланс между автономией сотрудников и корпоративным контролем" },
      q:     { en: "To what extent should organizations allow employee autonomy in decision-making, and how does this balance affect innovation, morale, and operational efficiency?", ru: "В какой мере организации должны предоставлять сотрудникам автономию в принятии решений, и как этот баланс влияет на инновации, мотивацию и операционную эффективность?" },
      due:   { en: "15 April 2026", ru: "15 апреля 2026" },
      wc: "1,000 – 1,500",
    },
  ],
  experts: {
    label:    { en: "The Expert Board", ru: "Совет Экспертов" },
    headline: { en: ["Reviewed by Those", "Who Know the Standard"], ru: ["Оценивают Те,", "Кто Знает Стандарт"] },
    body:     { en: "Every essay is reviewed by a credentialled academic. We do not employ automated scoring. Assessment is the work of human intellect.", ru: "Каждое эссе проверяется дипломированным учёным. Мы не используем автоматизированные оценки. Экспертиза — это работа человеческого интеллекта." },
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
    p1:         { en: "Upon review, the Institute issues a formal Academic Transcript — a single-page document bearing the Institute's seal, recording assessed performance across five academic competency domains. In addition to the Academic Transcript, an official diploma will be issued.", ru: "После проверки Институт выдаёт официальный академический транскрипт — документ на одной странице с печатью Института, фиксирующий результаты оценки по пяти академическим компетенциям. В дополнение к академическому транскрипту, будет также выдан официальный диплом." },
    p2:         { en: "The Transcript is designed to accompany university applications, fellowship submissions, and professional portfolios. It is not a certificate of participation — it is a verifiable record of intellectual performance.", ru: "Транскрипт предназначен для приложения к заявкам в университеты, заявкам на стипендии и профессиональным портфолио. Это не сертификат участия — это верифицируемая запись интеллектуальной деятельности." },
    blockLabel: { en: "Sample Qualitative Review Extract", ru: "Образец качественного отзыва" },
    blockBody:  { en: '"The candidate demonstrates an unusually sophisticated grasp of the tension between positive and negative liberty. The deployment of Berlin and Rawls is confident, if at times under-developed. The essay would benefit from a more sustained engagement with counter-arguments..."', ru: '"Кандидат демонстрирует необычайно глубокое понимание противоречия между позитивной и негативной свободой. Обращение к Берлину и Роулзу уверенное, хотя местами недостаточно развёрнутое. Эссе выиграло бы от более тщательного разбора контраргументов..."' },
    reviewer:   { en: "Reviewed by ...", ru: "Проверено ..." },
    instName:   { en: "The Russell Institute", ru: "The Russell Institute" },
    mockTitle:  { en: "Academic Transcript of Performance", ru: "Академический Транскрипт Результатов" },
    mockComp:   { en: "Competition: On the Limits of Legitimate Authority", ru: "Конкурс: О пределах легитимной власти" },
    mockCand:   { en: "Candidate: A. Candidate · April 2026", ru: "Кандидат: А. Кандидатов · Апрель 2026" },
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
    sectionLabel:     { en: "Enrolment", ru: "Запись" },
    headline:         { en: "Apply to the Competition", ru: "Подать заявку на конкурс" },
    sub:              { en: "Complete the form below. Select one or more essay categories. Your application will be reviewed within 24 hours of payment confirmation.", ru: "Заполните форму ниже. Выберите одну или несколько категорий эссе. Ваша заявка будет рассмотрена в течение 24 часов после подтверждения оплаты." },
    nameLabel:        { en: "Full Name",            ru: "Полное имя" },
    namePlaceholder:  { en: "e.g. Aibek Dzhaksybekov", ru: "напр. Айбек Джаксыбеков" },
    emailLabel:       { en: "Email Address",        ru: "Адрес электронной почты" },
    emailPlaceholder: { en: "your@email.com",       ru: "ваш@email.com" },
    phoneLabel:       { en: "Phone Number",         ru: "Номер телефона" },
    phonePlaceholder: { en: "+7 777 123 45 67",     ru: "+7 777 123 45 67" },
    errPhone:         { en: "Please enter a valid phone number.", ru: "Введите корректный номер телефона." },
    catLabel:         { en: "Competition Categories (select all that apply)", ru: "Категории конкурса (выберите все подходящие)" },
    cats: [
      { en: "I · Engineering, Technology & IT",     ru: "I · Инженерия, технологии и IT",     val: "I - Engineering, Technology & IT" },
      { en: "II · Life Sciences & Medicine",        ru: "II · Биологические науки и медицина", val: "II - Life Sciences & Medicine" },
      { en: "III · Economics, Business & Politics", ru: "III · Экономика, бизнес и политика",  val: "III - Economics, Business & Politics" },
      { en: "IV · Business, Marketing & HR",        ru: "IV · Бизнес, маркетинг и управление", val: "IV - Business, Marketing & HR" },
    ],
    schoolLabel:       { en: "School / University",        ru: "Школа / Университет" },
    schoolPlaceholder: { en: "e.g. BINOM", ru: "напр. BINOM" },
    legalPre:    { en: "I have read and agree to the ",  ru: "Я ознакомился(-ась) и согласен(-на) с " },
    legalOffer:  { en: "Public Offer,",                  ru: "Публичной офертой," },
    legalRefund: { en: " Refund Policy",                 ru: " Политикой возврата" },
    legalAnd:    { en: " and the ",                      ru: " и " },
    legalPriv:   { en: "Privacy Policy",                 ru: "Политикой конфиденциальности" },
    legalPost:   { en: " of The Russell Institute.",     ru: " The Russell Institute." },
    errRequired:   { en: "This field is required.",                 ru: "Это поле обязательно для заполнения." },
    errEmail:      { en: "Please enter a valid email address.",     ru: "Введите корректный адрес электронной почты." },
    errCat:        { en: "Please select at least one category.",    ru: "Выберите хотя бы одну категорию." },
    errLegal:      { en: "You must accept the terms to proceed.",   ru: "Для продолжения необходимо принять условия." },
    btnPay:        { en: "Proceed to Payment",           ru: "Перейти к оплате" },
    btnDisabled:   { en: "Accept terms to continue",     ru: "Примите условия для продолжения" },
    feeNote:       { en: "Base fee: 7,500 KZT per essay. Multi-essay discounts apply automatically.", ru: "Базовый взнос: 7 500 KZT за эссе. Скидки при нескольких эссе применяются автоматически." },
    discountTitle: { en: "Multi-Essay Discount", ru: "Скидка при нескольких эссе" },
    discountSub:   { en: "Select multiple categories to receive a discount. Each essay is reviewed separately.", ru: "Выберите несколько категорий для получения скидки. Каждое эссе проверяется отдельно." },
    disc2essays:   { en: "2 essays", ru: "2 эссе" },
    disc3essays:   { en: "3 essays", ru: "3 эссе" },
    disc4essays:   { en: "4 essays", ru: "4 эссе" },
    disc2save:     { en: "save 4,500", ru: "экономия 4 500" },
    disc3save:     { en: "save 7,500", ru: "экономия 7 500" },
    disc4save:     { en: "save 7,500", ru: "экономия 7 500" },
    totalLabel:    { en: "Total", ru: "Итого" },
    discountApplied: { en: "Discount applied", ru: "Скидка применена" },
  },
  modal: {
    title:      { en: "Payment Instructions", ru: "Инструкции по оплате" },
    sub:        { en: "Please complete your payment via Kaspi Bank to finalise your registration.", ru: "Пожалуйста, завершите оплату через Kaspi Bank для завершения регистрации." },
    feeLabel:   { en: "Total Registration Fee", ru: "Итоговый регистрационный взнос" },
    qrLabel:    { en: "Scan with Kaspi to Pay", ru: "Отсканируйте для оплаты через Kaspi" },
    qrAlt:      { en: "Kaspi QR Code",          ru: "QR-код Kaspi" },
    orLabel:    { en: "Or transfer manually via phone number (Kaspi, Halyk, Freedom):", ru: "Или переведите вручную по номеру телефона (Kaspi, Halyk, Freedom):" },
    accountNo:  { en: "+7 747 822 5091",   ru: "+7 747 822 5091" },
    reference:  { en: "Comments: Student Full Name", ru: "Комментарий: Полное Имя ученика" },
    confirmBtn: { en: "Confirm Payment and Submit", ru: "Подтвердить оплату и отправить" },
    cancelBtn:  { en: "Cancel",            ru: "Отмена" },
    disclaimer: { en: "Your application will be reviewed within 24 hours of payment confirmation. You will receive an email acknowledgement.", ru: "Ваша заявка будет рассмотрена в течение 24 часов после подтверждения оплаты. Вы получите подтверждение по электронной почте." },
    essaysLabel:{ en: "Selected competitions", ru: "Выбранные конкурсы" },
  },
  success: {
    headline: { en: "Application Received", ru: "Заявка получена" },
    body:     { en: "Thank you for your submission. The Russell Institute admissions office will review your application and contact you within 24 hours. Please retain your payment confirmation for your records.", ru: "Благодарим за вашу заявку. Приёмная комиссия The Russell Institute рассмотрит вашу заявку и свяжется с вами в течение 24 часов. Пожалуйста, сохраните подтверждение оплаты." },
    refLabel: { en: "Your reference:", ru: "Ваш номер заявки:" },
    newBtn:   { en: "Submit Another Application", ru: "Подать ещё одну заявку" },
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
      { en: "Competitions",        ru: "Конкурсы",        href: "#competitions" },
      { en: "Expert Board",        ru: "Совет экспертов", href: "#experts" },
      { en: "The Transcript",      ru: "Транскрипт",      href: "#transcript" },
      { en: "About the Institute", ru: "Об Институте",    href: "#about" },
      { en: "Register",            ru: "Регистрация",     href: "#registration" },
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

/* ── Pricing table ─────────────────────────────────────────────── */
const FEE_TABLE = { 1: 7500, 2: 10500, 3: 15000, 4: 22500 };

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
    .cc { background:#FFFEF9; border:1px solid #D8CEB8; transition:border-color 0.3s,box-shadow 0.3s; }
    .cc:hover { border-color:#1A2B45; box-shadow:0 8px 36px rgba(26,43,69,0.08); }
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
    .success-box { border:1px solid #2A5A2A; background:#F4FBF4; padding:48px; text-align:center; }
    .ftr { background:#0E1620; color:#7A8A9A; }
    .ftr a { color:#7A8A9A; text-decoration:none; transition:color 0.2s; }
    .ftr a:hover { color:#F9F7F2; }
    @media(max-width:900px){ .hdr-in{padding:0 20px;} .d-nav{display:none!important;} .m-grp{display:flex!important;} .eg{grid-template-columns:1fr 1fr!important;} }
    @media(max-width:580px){ .h-title{font-size:2.2rem!important;} .eg{grid-template-columns:1fr!important;} .cm{min-width:100%!important;} .modal-box{padding:28px 22px;} }
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
        <nav className="d-nav" style={{ display: "flex", alignItems: "center", gap: 30 }}>
          {keys.map(k => (
            <a key={k} href={"#" + k} className="nav-a" style={{ color: col }}>{t(COPY.nav[k], lang)}</a>
          ))}
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

function Competitions() {
  const lang = useLang();
  const ref  = useReveal();
  const c    = COPY.competitions;
  return (
    <section id="competitions" ref={ref} style={{ padding: "100px 40px", background: "#F9F7F2" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ maxWidth: 680, marginBottom: 72 }}>
          <div className="slbl rv" style={{ marginBottom: 20 }}>{t(c.label, lang)}</div>
          <h2 className="rv d1" style={{ fontFamily: "'EB Garamond',serif", fontSize: "2.9rem", fontWeight: 400, color: "#1A2B45", lineHeight: 1.12, marginBottom: 28 }}>{t(c.headline, lang)}</h2>
          <div className="orn rv d2"><span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.85rem", letterSpacing: "0.3em", whiteSpace: "nowrap" }}>* * *</span></div>
          <p className="rv d2" style={{ fontFamily: "'Lora',serif", fontSize: "0.9rem", color: "#5A6A7A", lineHeight: 1.88, marginTop: 24 }}>{t(c.body, lang)}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {COPY.comps.map((comp, i) => (
            <div key={comp.num} className={"cc rv d" + (i + 1)} style={{ padding: "44px 52px" }}>
              <div style={{ display: "flex", gap: 36, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "2.6rem", color: "#D8CEB8", lineHeight: 1, minWidth: 48, paddingTop: 4 }}>{comp.num}</div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ marginBottom: 14 }}><span className="slbl" style={{ fontSize: "0.6rem" }}>{t(comp.tag, lang)}</span></div>
                  <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.7rem", fontWeight: 500, color: "#1A2B45", marginBottom: 20, lineHeight: 1.18 }}>{t(comp.title, lang)}</h3>
                  <div style={{ borderLeft: "2px solid #D8CEB8", paddingLeft: 22 }}>
                    <p style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.02rem", fontStyle: "italic", color: "#3A4A5A", lineHeight: 1.78 }}>"{t(comp.q, lang)}"</p>
                  </div>
                </div>
                <div className="cm" style={{ minWidth: 175, display: "flex", flexDirection: "column", gap: 22 }}>
                  {[
                    { l: t(c.deadline, lang),    v: t(comp.due, lang) },
                    { l: t(c.wordCount, lang),   v: comp.wc + " " + t(c.words, lang) },
                    { l: t(c.eligibility, lang), v: t(c.level, lang) },
                  ].map(m => (
                    <div key={m.l}>
                      <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#9A8878", textTransform: "uppercase", marginBottom: 4 }}>{m.l}</div>
                      <div style={{ fontFamily: "'Lora',serif", fontSize: "0.8rem", color: "#1A2B45", lineHeight: 1.4 }}>{m.v}</div>
                    </div>
                  ))}
                  <a href="#registration" className="btn-o" style={{ marginTop: 4, textAlign: "center", fontSize: "0.6rem", padding: "10px 18px" }}>{t(c.submit, lang)}</a>
                </div>
              </div>
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

/* ── Payment Modal ─────────────────────────────────────────────── */
function PaymentModal({ isOpen, onClose, onConfirm, applicantName, feeDisplay, selectedCategories, lang }) {
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

        {/* Selected categories */}
        {selectedCategories && selectedCategories.length > 0 && (
          <div style={{ marginBottom: 24, padding: "14px 18px", background: "#F2EEE6", borderLeft: "3px solid #4A0E0E" }}>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#7A6A58", textTransform: "uppercase", marginBottom: 10 }}>
              {t(c.essaysLabel, lang)}
            </div>
            {selectedCategories.map((cat, i) => (
              <div key={i} style={{ fontFamily: "'Lora',serif", fontSize: "0.8rem", color: "#1A2B45", marginBottom: 4 }}>
                {i + 1}. {cat}
              </div>
            ))}
          </div>
        )}

        {/* Fee */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, padding: "16px 20px", border: "1px solid #1A2B45" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "#7A6A58", textTransform: "uppercase", marginBottom: 4 }}>{t(c.feeLabel, lang)}</div>
            <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "2rem", color: "#1A2B45", lineHeight: 1 }}>{feeDisplay}</div>
          </div>
          {selectedCategories && selectedCategories.length > 1 && (
            <div style={{ fontFamily: "'Lora',serif", fontSize: "0.72rem", color: "#4A0E0E", fontStyle: "italic", textAlign: "right" }}>
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
          <button onClick={onConfirm}
            style={{ flex: 1, background: "#1A2B45", color: "#F9F7F2", fontFamily: "'Cormorant SC',serif", fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", border: "none", padding: "16px 24px", cursor: "pointer", transition: "background 0.3s" }}
            onMouseOver={e => e.currentTarget.style.background = "#4A0E0E"}
            onMouseOut={e  => e.currentTarget.style.background = "#1A2B45"}>
            {t(c.confirmBtn, lang)}
          </button>
          <button onClick={onClose}
            style={{ background: "transparent", color: "#5A6A7A", fontFamily: "'Cormorant SC',serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid #D8CEB8", padding: "16px 24px", cursor: "pointer", transition: "all 0.25s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#1A2B45"; e.currentTarget.style.color = "#1A2B45"; }}
            onMouseOut={e  => { e.currentTarget.style.borderColor = "#D8CEB8"; e.currentTarget.style.color = "#5A6A7A"; }}>
            {t(c.cancelBtn, lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Field wrapper ─────────────────────────────────────────────── */
function Field({ id, label, children, error }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <label className="fi-label" htmlFor={id}>{label}</label>
      {children}
      {error && <div className="fi-err">{error}</div>}
    </div>
  );
}

/* ── Registration Form ─────────────────────────────────────────── */
function RegistrationForm() {
  const lang = useLang();
  const ref  = useReveal();
  const c    = COPY.regForm;

  /* categories is now an array of selected values */
  const [fields, setFields]               = useState({ name: "", email: "", phone: "", categories: [], school: "" });
  const [errors, setErrors]               = useState({});
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [legalTouched,  setLegalTouched]  = useState(false);
  const [showModal,  setShowModal]        = useState(false);
  const [submitted,  setSubmitted]        = useState(false);
  const [refNumber,  setRefNumber]        = useState("");

  /* Dynamic pricing */
  const selectedCount = fields.categories.length;
  const totalFee      = FEE_TABLE[selectedCount] || 0;
  const feeDisplay    = selectedCount > 0 ? totalFee.toLocaleString() + " KZT" : "-";

  const handleChange = (field, value) => {
    setFields(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  /* Toggle a category checkbox */
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
    if (!fields.school.trim())            next.school     = t(c.errRequired, lang);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    setLegalTouched(true);
    const fieldsOk = validate();
    if (!fieldsOk || !legalAccepted) return;
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    const ref  = "RI-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);
    const time = new Date().toLocaleString("ru-KZ", { timeZone: "Asia/Almaty" });

    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp:  time,
        name:       fields.name,
        email:      fields.email,
        phone:      fields.phone,
        categories: fields.categories.join("; "),
        school:     fields.school,
        fee:        totalFee,
        refNumber:  ref,
        lang:       lang,
      }),
    });

    setRefNumber(ref);
    setShowModal(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFields({ name: "", email: "", phone: "", categories: [], school: "" });
    setErrors({});
    setLegalAccepted(false);
    setLegalTouched(false);
    setSubmitted(false);
    setRefNumber("");
  };

  const discountRows = [
    { essays: t(c.disc2essays, lang), total: "10,500 KZT", save: t(c.disc2save, lang) },
    { essays: t(c.disc3essays, lang), total: "15,000 KZT", save: t(c.disc3save, lang) },
    { essays: t(c.disc4essays, lang), total: "22,500 KZT", save: t(c.disc4save, lang) },
  ];

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
          <div className="rv in success-box">
            <CheckCircle size={40} color="#2A5A2A" style={{ marginBottom: 20 }} />
            <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: "2rem", fontWeight: 400, color: "#1A3A1A", marginBottom: 16 }}>
              {t(COPY.success.headline, lang)}
            </h3>
            <p style={{ fontFamily: "'Lora',serif", fontSize: "0.9rem", color: "#3A5A3A", lineHeight: 1.85, maxWidth: 520, margin: "0 auto 24px" }}>
              {t(COPY.success.body, lang)}
            </p>
            <div style={{ marginBottom: 32, padding: "12px 24px", background: "#EEF6EE", border: "1px solid #A8C8A8", display: "inline-block" }}>
              <span style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "#3A5A3A" }}>
                {t(COPY.success.refLabel, lang)}
              </span>
              <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "1.2rem", color: "#1A3A1A", marginTop: 2 }}>{refNumber}</div>
            </div>
            <br />
            <button className="btn-o" onClick={handleReset} style={{ marginTop: 8 }}>
              {t(COPY.success.newBtn, lang)}
            </button>
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

              <Field id="phone" label={t(c.phoneLabel, lang)} error={errors.phone}>
                <input id="phone" type="tel" className={"fi" + (errors.phone ? " err" : "")}
                  placeholder={t(c.phonePlaceholder, lang)} value={fields.phone}
                  onChange={e => handleChange("phone", e.target.value)} />
              </Field>

              <div style={{ gridColumn: "1 / -1", marginBottom: 28 }}>
                <label className="fi-label">{t(c.catLabel, lang)}</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {c.cats.map(cat => {
                    const checked = fields.categories.includes(cat.val);
                    return (
                      <div key={cat.val}
                        className={"cat-row" + (checked ? " sel" : "")}
                        onClick={() => toggleCategory(cat.val)}>
                        <div className={"cat-chk" + (checked ? " sel" : "")}>
                          {checked && <span style={{ color: "#F9F7F2", fontSize: "11px", lineHeight: 1 }}>v</span>}
                        </div>
                        <span style={{ fontFamily: "'Lora',serif", fontSize: "0.84rem", color: "#1A2B45" }}>{t(cat, lang)}</span>
                      </div>
                    );
                  })}
                </div>
                {errors.categories && <div className="fi-err" style={{ marginTop: 8 }}>{errors.categories}</div>}
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field id="school" label={t(c.schoolLabel, lang)} error={errors.school}>
                  <input id="school" className={"fi" + (errors.school ? " err" : "")}
                    placeholder={t(c.schoolPlaceholder, lang)} value={fields.school}
                    onChange={e => handleChange("school", e.target.value)} />
                </Field>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E8E0D0", margin: "12px 0 32px" }} />

            {/* Legal checkbox */}
            <div style={{ marginBottom: 32 }}>
              <div className="legal-row">
                <div className="cb-wrap">
                  <input type="checkbox" className="cb-real" id="legal"
                    checked={legalAccepted}
                    onChange={e => { setLegalAccepted(e.target.checked); setLegalTouched(true); }} />
                  <label htmlFor="legal"
                    className={"cb-box " + (legalAccepted ? "checked " : "") + (legalTouched && !legalAccepted ? "cb-err" : "")}>
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

            {/* Discount table */}
            <div style={{ marginBottom: 24, border: "1px solid #C8A87A", background: "#FDFAF3", padding: "20px 24px" }}>
              <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#4A0E0E", marginBottom: 12 }}>
                {t(c.discountTitle, lang)}
              </div>
              <p style={{ fontFamily: "'Lora',serif", fontSize: "0.76rem", color: "#5A6A7A", lineHeight: 1.65, marginBottom: 14 }}>
                {t(c.discountSub, lang)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {discountRows.map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, borderBottom: i < 2 ? "1px solid #EEE4D0" : "none" }}>
                    <span style={{ fontFamily: "'Lora',serif", fontSize: "0.8rem", color: "#1A2B45" }}>{row.essays}</span>
                    <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "1rem", color: "#1A2B45" }}>{row.total}</span>
                    <span style={{ fontFamily: "'Lora',serif", fontSize: "0.72rem", color: "#4A0E0E", fontStyle: "italic" }}>{row.save}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live total — shown only when at least one category selected */}
            {selectedCount > 0 && (
              <div style={{ marginBottom: 20, padding: "16px 22px", background: "#1A2B45", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant SC',serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "#8A9AB8", textTransform: "uppercase", marginBottom: 4 }}>
                    {lang === "en"
                      ? "Total for " + selectedCount + " essay" + (selectedCount > 1 ? "s" : "")
                      : "Итого за " + selectedCount + " " + (selectedCount === 1 ? "эссе" : selectedCount < 5 ? "эссе" : "эссе")}
                  </div>
                  {selectedCount > 1 && (
                    <div style={{ fontFamily: "'Lora',serif", fontSize: "0.72rem", color: "#C8A87A", fontStyle: "italic" }}>
                      {lang === "en" ? "Discount applied" : "Скидка применена"}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "2rem", color: "#C8A87A", lineHeight: 1 }}>{feeDisplay}</div>
              </div>
            )}

            <button
              className={"pay-btn " + (legalAccepted ? "active" : "disabled")}
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
        applicantName={fields.name}
        feeDisplay={feeDisplay}
        selectedCategories={fields.categories}
        lang={lang}
      />
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────────── */
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

/* ── App Root ──────────────────────────────────────────────────── */
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
          <Competitions />
          <Experts />
          <Transcript />
          <RegistrationForm />
        </main>
        <Footer />
      </div>
    </LangCtx.Provider>
  );
}
