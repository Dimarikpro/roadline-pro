// cv.js
/* =========================
   1) Language engine
========================= */
const LS_LANG_KEY = "roadline_lang";
function normalizeLang(raw){
  const l = (raw || "en").toLowerCase();
  if (l.startsWith("pl")) return "pl";
  if (l.startsWith("uk")) return "uk";
  if (l.startsWith("ru") || l.startsWith("be")) return "ru";
  return "en";
}
function detectLang(){
  const saved = localStorage.getItem(LS_LANG_KEY);
  if(saved) return saved;
  return normalizeLang(navigator.language || (navigator.languages && navigator.languages[0]) || "en");
}
function setLang(lang){
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-lang]").forEach(el=>{
    el.classList.toggle("active", el.dataset.lang === lang);
  });
  document.querySelectorAll("[data-lang-inline]").forEach(el=>{
    el.classList.toggle("active", el.dataset.langInline === lang);
  });

  const sel = document.getElementById("langSelect");
  if(sel) sel.value = lang;

  localStorage.setItem(LS_LANG_KEY, lang);
  state.lang = lang;

  updateUIStrings();
  renderQuestion();
  renderResume();
  updateShareLinks();
}

/* =========================
   2) Toast
========================= */
const toastEl = document.getElementById("toast");
let toastTimer = null;
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toastEl.classList.remove("show"), 1400);
}

/* =========================
   3) Question bank (EDIT HERE)
========================= */
const LS_ANS_KEY = "roadline_cv_answers_v1";
const QUESTION_BANK = [
  {
    id: "workType",
    type: "single",
    label: { ru:"Тип работы", uk:"Тип роботи", en:"Work type", pl:"Rodzaj pracy" },
    options: [
      { value:"intl",  label:{ru:"Международка", uk:"Міжнародка", en:"International", pl:"Międzynarodowe"}, note:{ru:"EU routes", uk:"Маршрути ЄС", en:"EU routes", pl:"Trasy EU"} },
      { value:"local", label:{ru:"Работа по стране", uk:"По країні", en:"Domestic", pl:"Krajowe"}, note:{ru:"внутри страны", uk:"в межах країни", en:"within one country", pl:"w jednym kraju"} }
    ]
  },
  {
    id: "experience",
    type: "single",
    label: { ru:"Опыт на C+E", uk:"Досвід на C+E", en:"C+E experience", pl:"Doświadczenie C+E" },
    options: [
      { value:"0-1", label:{ru:"до 1 года", uk:"до 1 року", en:"up to 1 year", pl:"do 1 roku"} },
      { value:"1-3", label:{ru:"1–3 года", uk:"1–3 роки", en:"1–3 years", pl:"1–3 lata"} },
      { value:"3-5", label:{ru:"3–5 лет", uk:"3–5 років", en:"3–5 years", pl:"3–5 lat"} },
      { value:"5+",  label:{ru:"более 5 лет", uk:"понад 5 років", en:"5+ years", pl:"ponad 5 lat"} }
    ]
  },
  {
    id: "trailers",
    type: "multi",
    label: { ru:"Тип прицепа", uk:"Тип напівпричепа", en:"Trailer type", pl:"Typ naczepy" },
    options: [
      { value:"tautliner", label:{ru:"Тент", uk:"Тент", en:"Tautliner", pl:"Plandeka"}, note:{ru:"tautliner / plandeka", uk:"tautliner / plandeka", en:"tautliner", pl:"plandeka"} },
      { value:"reefer",    label:{ru:"Рефрижератор", uk:"Рефрижератор", en:"Reefer", pl:"Chłodnia"}, note:{ru:"chłodnia / reefer", uk:"chłodnia / reefer", en:"reefer", pl:"chłodnia"} },
      { value:"container", label:{ru:"Контейнер", uk:"Контейнер", en:"Container", pl:"Kontener"} },
      { value:"tanker",    label:{ru:"Цистерна", uk:"Цистерна", en:"Tanker", pl:"Cysterna"} },
      { value:"carcarrier",label:{ru:"Автовоз", uk:"Автовоз", en:"Car carrier", pl:"Autotransporter"} },
      { value:"lowbed",    label:{ru:"Низкорамник", uk:"Низькорамний", en:"Low-bed", pl:"Niskopodwoziowa"} }
    ]
  },
  {
    id: "regions",
    type: "multi",
    label: { ru:"География", uk:"Географія", en:"Regions", pl:"Regiony" },
    options: [
      { value:"PL",      label:{ru:"Польша", uk:"Польща", en:"Poland", pl:"Polska"} },
      { value:"DE",      label:{ru:"Германия", uk:"Німеччина", en:"Germany", pl:"Niemcy"} },
      { value:"FR",      label:{ru:"Франция", uk:"Франція", en:"France", pl:"Francja"} },
      { value:"BENELUX", label:{ru:"Бенилюкс", uk:"Бенілюкс", en:"Benelux", pl:"Benelux"} },
      { value:"SCAN",    label:{ru:"Скандинавия", uk:"Скандинавія", en:"Scandinavia", pl:"Skandynawia"} },
      { value:"EU",      label:{ru:"Вся Европа", uk:"Уся Європа", en:"All Europe", pl:"Cała Europa"} }
    ]
  },
  {
    id: "schedule",
    type: "single",
    label: { ru:"Формат работы", uk:"Формат роботи", en:"Work rotation", pl:"System pracy" },
    options: [
      { value:"2/2",     label:{ru:"2/2", uk:"2/2", en:"2/2", pl:"2/2"} },
      { value:"3/1",     label:{ru:"3/1", uk:"3/1", en:"3/1", pl:"3/1"} },
      { value:"4/1",     label:{ru:"4/1", uk:"4/1", en:"4/1", pl:"4/1"} },
      { value:"weekends",label:{ru:"Выходные дома", uk:"Вихідні вдома", en:"Weekends home", pl:"Weekendy w domu"} },
      { value:"any",     label:{ru:"Без разницы", uk:"Без різниці", en:"Any", pl:"Dowolnie"} }
    ]
  },
  {
    id: "documents",
    type: "multi",
    label: { ru:"Документы", uk:"Документи", en:"Documents", pl:"Dokumenty" },
    options: [
      { value:"code95", label:{ru:"Code 95", uk:"Code 95", en:"Code 95", pl:"Code 95"} },
      { value:"card",   label:{ru:"Карта водителя", uk:"Карта водія", en:"Driver card", pl:"Karta kierowcy"} },
      { value:"adr",    label:{ru:"ADR", uk:"ADR", en:"ADR", pl:"ADR"} }
    ]
  },
  {
    id: "statusEU",
    type: "single",
    label: { ru:"Статус в ЕС (право на работу)", uk:"Статус в ЄС (право на роботу)", en:"EU work status", pl:"Status pracy w UE" },
    options: [
      { value:"euCitizen", label:{ru:"Гражданство ЕС", uk:"Громадянство ЄС", en:"EU citizenship", pl:"Obywatelstwo UE"} },
      { value:"karta",     label:{ru:"Карта побыту / ВНЖ", uk:"Karta pobytu / ВНЖ", en:"Residence card", pl:"Karta pobytu"} },
      { value:"visa",      label:{ru:"Рабочая виза/разрешение", uk:"Робоча віза/дозвіл", en:"Work visa/permit", pl:"Wiza/zezwolenie"} },
      { value:"process",   label:{ru:"В процессе оформления", uk:"У процесі оформлення", en:"In progress", pl:"W trakcie"} }
    ]
  },
  { id:"contact", type:"contact", label:{ru:"Контакт", uk:"Контакт", en:"Contact", pl:"Kontakt"} }
];

/* =========================
   4) State
========================= */
function loadAnswers(){
  try{
    const raw = localStorage.getItem(LS_ANS_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}
function saveAnswers(){
  localStorage.setItem(LS_ANS_KEY, JSON.stringify(state.answers));
}
const state = {
  lang: detectLang(),
  step: 0,
  answers: loadAnswers()
};

/* =========================
   5) Helpers
========================= */
function getText(ru, uk, en, pl){
  const m = {ru, uk, en, pl};
  return m[state.lang] || en;
}
function scrollIntoViewSmooth(selector){
  const el = document.querySelector(selector);
  if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
}

/* =========================
   6) UI Strings
========================= */
function updateUIStrings(){
  document.getElementById("backBtn").textContent = getText("Назад","Назад","Back","Wstecz");
  document.getElementById("nextBtn").textContent = getText("Далее","Далі","Next","Dalej");
  document.getElementById("resetAllBtn").textContent = getText("Сбросить ответы","Скинути відповіді","Reset answers","Resetuj odpowiedzi");
  document.getElementById("copyLinkBtn").textContent = getText("Скопировать ссылку","Скопіювати посилання","Copy link","Kopiuj link");
  document.getElementById("copyTextBtn").textContent = getText("Скопировать текст","Скопіювати текст","Copy text","Kopiuj tekst");
  document.getElementById("editBtn").textContent = getText("Редактировать ответы","Редагувати відповіді","Edit answers","Edytuj odpowiedzi");
}

/* =========================
   7) Wizard rendering
========================= */
const questionArea = document.getElementById("questionArea");
const stepPill = document.getElementById("stepPill");
const stepBar = document.getElementById("stepBar");

function totalSteps(){ return QUESTION_BANK.length; }

function renderQuestion(){
  const q = QUESTION_BANK[state.step];
  const total = totalSteps();
  const stepN = state.step + 1;

  stepPill.textContent = getText(`Шаг ${stepN}/${total}`, `Крок ${stepN}/${total}`, `Step ${stepN}/${total}`, `Krok ${stepN}/${total}`);
  stepBar.style.width = `${Math.round((state.step / (total-1)) * 100)}%`;

  questionArea.innerHTML = "";

  const title = document.createElement("div");
  title.className = "qTitle";
  title.textContent = (q.label[state.lang] || q.label.en);
  questionArea.appendChild(title);

  if(q.type === "single" || q.type === "multi"){
    const wrap = document.createElement("div");
    wrap.className = "options";

    const current = state.answers[q.id] ?? (q.type === "multi" ? [] : "");

    q.options.forEach(opt=>{
      const row = document.createElement("label");
      row.className = "opt";

      const input = document.createElement("input");
      input.type = (q.type === "multi") ? "checkbox" : "radio";
      input.name = q.id;
      input.value = opt.value;

      if(q.type === "multi"){
        input.checked = Array.isArray(current) && current.includes(opt.value);
      }else{
        input.checked = current === opt.value;
      }

      const textBox = document.createElement("div");
      const lbl = document.createElement("div");
      lbl.className = "lbl";
      lbl.textContent = (opt.label[state.lang] || opt.label.en);
      textBox.appendChild(lbl);

      if(opt.note){
        const sub = document.createElement("div");
        sub.className = "sub";
        sub.textContent = (opt.note[state.lang] || opt.note.en);
        textBox.appendChild(sub);
      }

      row.appendChild(input);
      row.appendChild(textBox);

      row.addEventListener("click", (e)=>{
        if(e.target.tagName.toLowerCase() !== "input"){
          if(q.type !== "multi") input.checked = true;
          else input.checked = !input.checked;
        }

        if(q.type === "multi"){
          const arr = new Set(Array.isArray(state.answers[q.id]) ? state.answers[q.id] : []);
          if(input.checked) arr.add(opt.value); else arr.delete(opt.value);
          state.answers[q.id] = Array.from(arr);
        }else{
          state.answers[q.id] = opt.value;
        }
        saveAnswers();
        renderResume();
        updateShareLinks();
      });

      wrap.appendChild(row);
    });

    questionArea.appendChild(wrap);
  }

  if(q.type === "contact"){
    const box = document.createElement("div");
    box.className = "stack";
    box.style.gap = "10px";
    box.style.marginTop = "8px";

    const name = document.createElement("input");
    name.className = "input";
    name.placeholder = getText("Имя","Ім’я","Name","Imię");
    name.value = state.answers.contactName || "";

    const phone = document.createElement("input");
    phone.className = "input";
    phone.placeholder = getText("Телефон / WhatsApp / Telegram","Телефон / WhatsApp / Telegram","Phone / WhatsApp / Telegram","Telefon / WhatsApp / Telegram");
    phone.value = state.answers.contactPhone || "";

    name.addEventListener("input", ()=>{
      state.answers.contactName = name.value.trim();
      saveAnswers(); renderResume(); updateShareLinks();
    });
    phone.addEventListener("input", ()=>{
      state.answers.contactPhone = phone.value.trim();
      saveAnswers(); renderResume(); updateShareLinks();
    });

    box.appendChild(name);
    box.appendChild(phone);
    questionArea.appendChild(box);
  }

  const backBtn = document.getElementById("backBtn");
  backBtn.disabled = state.step === 0;
  backBtn.style.opacity = state.step === 0 ? .55 : 1;
}

function validateStep(){
  const q = QUESTION_BANK[state.step];
  if(q.type === "single") return !!state.answers[q.id];
  if(q.type === "multi") return Array.isArray(state.answers[q.id]) && state.answers[q.id].length > 0;
  if(q.type === "contact"){
    return (state.answers.contactName && state.answers.contactName.length >= 2) &&
           (state.answers.contactPhone && state.answers.contactPhone.length >= 6);
  }
  return true;
}

document.getElementById("nextBtn").addEventListener("click", ()=>{
  if(!validateStep()){
    toast(getText("Заполни этот шаг","Заповни цей крок","Complete this step","Uzupełnij ten krok"));
    return;
  }
  if(state.step < totalSteps()-1){
    state.step++;
    renderQuestion();
    scrollIntoViewSmooth("#builder");
  }else{
    scrollIntoViewSmooth("#result");
  }
});

document.getElementById("backBtn").addEventListener("click", ()=>{
  if(state.step > 0){
    state.step--;
    renderQuestion();
    scrollIntoViewSmooth("#builder");
  }
});

function resetAll(){
  state.answers = {};
  state.step = 0;
  saveAnswers();
  renderQuestion();
  renderResume();
  updateShareLinks();
  toast(getText("Сброшено","Скинуто","Reset","Zresetowano"));
}
document.getElementById("resetAllBtn").addEventListener("click", resetAll);

["startBtnRu","startBtnUk","startBtnEn","startBtnPl"].forEach(id=>{
  const el = document.getElementById(id);
  if(el){
    el.addEventListener("click", ()=> scrollIntoViewSmooth("#builder"));
  }
});
document.getElementById("editBtn").addEventListener("click", ()=> scrollIntoViewSmooth("#builder"));

/* =========================
   8) Resume preview
========================= */
const resumeTitle = document.getElementById("resumeTitle");
const resumeGrid = document.getElementById("resumeGrid");

function labelFromOption(qid, value){
  const q = QUESTION_BANK.find(x=>x.id===qid);
  if(!q) return value;
  const opt = (q.options || []).find(o=>o.value===value);
  if(!opt) return value;
  return (opt.label[state.lang] || opt.label.en);
}
function labelsFromMulti(qid, arr){
  if(!Array.isArray(arr)) return [];
  return arr.map(v=>labelFromOption(qid, v));
}

function renderResume(){
  const name = state.answers.contactName || "—";
  resumeTitle.textContent = `${name} — DRIVER C+E`;

  const workType = state.answers.workType ? labelFromOption("workType", state.answers.workType) : "—";
  const exp = state.answers.experience ? labelFromOption("experience", state.answers.experience) : "—";
  const trailers = labelsFromMulti("trailers", state.answers.trailers);
  const regions = labelsFromMulti("regions", state.answers.regions);
  const schedule = state.answers.schedule ? labelFromOption("schedule", state.answers.schedule) : "—";
  const docs = labelsFromMulti("documents", state.answers.documents);
  const status = state.answers.statusEU ? labelFromOption("statusEU", state.answers.statusEU) : "—";
  const phone = state.answers.contactPhone || "—";

  const blocks = [
    { k: getText("Профиль","Профіль","Profile","Profil"), v: `Driver C+E • ${workType} • ${exp}` },
    { k: getText("Техника / прицеп","Техніка / напівпричіп","Equipment / trailer","Sprzęt / naczepa"), v: trailers.length ? trailers.join(", ") : "—" },
    { k: getText("Маршруты","Маршрути","Routes","Trasy"), v: regions.length ? regions.join(", ") : "—" },
    { k: getText("График","Графік","Rotation","System"), v: schedule },
    { k: getText("Документы","Документи","Documents","Dokumenty"), v: docs.length ? docs.join(", ") : "—" },
    { k: getText("Статус в ЕС","Статус в ЄС","EU status","Status w UE"), v: status },
    { k: getText("Контакт","Kontakt","Contact","Kontakt"), v: phone }
  ];

  resumeGrid.innerHTML = "";
  blocks.forEach(b=>{
    const kv = document.createElement("div");
    kv.className = "kv";
    const k = document.createElement("div");
    k.className = "k"; k.textContent = b.k;
    const v = document.createElement("div");
    v.className = "v"; v.textContent = b.v;
    kv.appendChild(k); kv.appendChild(v);
    resumeGrid.appendChild(kv);
  });
}

/* =========================
   9) Sharing
========================= */
const tgShare = document.getElementById("tgShare");
const waShare = document.getElementById("waShare");
const fbShare = document.getElementById("fbShare");

function buildShareText(){
  const url = location.href.split("#")[0] + "#builder";
  return getText(
    `Я сделал профессиональное резюме водителя C+E за 3 минуты. Бесплатно. Без регистрации.\n\nСделай себе тоже: ${url}`,
    `Я зробив професійне резюме водія C+E за 3 хвилини. Безкоштовно. Без реєстрації.\n\nЗроби собі теж: ${url}`,
    `I built a professional C+E driver resume in 3 minutes. Free. No registration.\n\nTry it: ${url}`,
    `Zrobiłem profesjonalne CV kierowcy C+E w 3 minuty. Za darmo. Bez rejestracji.\n\nSprawdź: ${url}`
  );
}
function updateShareLinks(){
  const url = location.href.split("#")[0] + "#builder";
  const text = encodeURIComponent(buildShareText());
  tgShare.href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
  waShare.href = `https://wa.me/?text=${text}`;
  fbShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

document.getElementById("copyLinkBtn").addEventListener("click", async ()=>{
  const url = location.href.split("#")[0] + "#builder";
  try{
    await navigator.clipboard.writeText(url);
    toast(getText("Ссылка скопирована","Посилання скопійовано","Link copied","Link skopiowany"));
  }catch(e){
    toast(getText("Не удалось скопировать","Не вдалося скопіювати","Copy failed","Nie udało się skopiować"));
  }
});
document.getElementById("copyTextBtn").addEventListener("click", async ()=>{
  try{
    await navigator.clipboard.writeText(buildShareText());
    toast(getText("Текст скопирован","Текст скопійовано","Text copied","Tekst skopiowany"));
  }catch(e){
    toast(getText("Не удалось скопировать","Не вдалося скopiować","Copy failed","Nie udało się skopiować"));
  }
});

/* =========================
   10) Scroll spy + meter progress
========================= */
const sections = ["intro","how","builder","result"].map(id=>document.getElementById(id));
const navLinks = Array.from(document.querySelectorAll(".menu a[data-nav]"));

function setActiveNav(id){
  navLinks.forEach(a=> a.classList.toggle("active", a.dataset.nav === id));
}
function onScroll(){
  let current = "intro";
  for(const s of sections){
    const r = s.getBoundingClientRect();
    if(r.top <= 110) current = s.id;
  }
  setActiveNav(current);

  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const t = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

  const path = document.getElementById("meterProgress");
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len * (1 - t)}`;
}
window.addEventListener("scroll", onScroll, {passive:true});

/* =========================
   11) Meter ticks
========================= */
(function renderTicks(){
  const svg = document.querySelector(".bg-meter svg");
  const g = svg.querySelector(".ticks");
  const cx=300, cy=420, r=220;
  const start = Math.PI;
  const end = 0;
  const n=24;
  for(let i=0;i<=n;i++){
    const a = start + (end-start)*(i/n);
    const x1 = cx + Math.cos(a)*(r-2);
    const y1 = cy + Math.sin(a)*(r-2);
    const x2 = cx + Math.cos(a)*(r-22);
    const y2 = cy + Math.sin(a)*(r-22);
    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    g.appendChild(line);
  }
})();

/* =========================
   12) Init
========================= */
document.getElementById("langSelect").addEventListener("change", (e)=> setLang(e.target.value));

document.getElementById("gdpr").addEventListener("change", (e)=>{
  state.answers.gdpr = !!e.target.checked;
  saveAnswers();
});

setLang(state.lang);
updateUIStrings();
renderQuestion();
renderResume();
updateShareLinks();
onScroll();
