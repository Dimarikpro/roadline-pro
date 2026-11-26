(function initRoadlineCV(){
  "use strict";

  const model = globalThis.RoadlineCVModel;
  if(!model) throw new Error("RoadlineCVModel is required");

  const PROFILE_KEY = "roadline_cv_profile_v2";
  const LEGACY_KEY = "roadline_cv_answers_v1";
  const LANG_KEY = "roadline_lang";
  const STEP_KEY = "roadline_cv_step_v2";
  const SHARE_PARAM = "profile";
  const STEP_COUNT = 6;
  const LOCALES = ["ru", "uk", "en", "pl"];

  const TEXT = {
    ru:{
      language:"Язык", eyebrow:"ROADLINE CV 2.0", heroTitle:"Профессиональный профиль водителя C+E",
      heroCopy:"Квалификации, реальный опыт и условия работы — отдельно и без лишних данных.", start:"Создать профиль", seeOutputs:"Как выглядит результат",
      localFirst:"Черновик остаётся в этом браузере", localFirstCopy:"Контакт не нужен для сохранения. В публичный preview он не попадёт.",
      publicPreview:"ПУБЛИЧНЫЙ PREVIEW", sharedNotice:"Это профессиональная карточка без контактов. Она доступна только для чтения и не является проверенной квалификацией.", buildOwn:"Создать свой профиль",
      selfDeclared:"Заявлено водителем", profileProgress:"ПРОФИЛЬ", draftTitle:"Автосохранение", draftCopy:"Данные хранятся локально. На общем телефоне удалите черновик после экспорта.",
      back:"Назад", next:"Далее", viewResults:"К результатам", twoOutputs:"ДВА РЕЗУЛЬТАТА", outputsTitle:"Один источник фактов — разные уровни доступа",
      outputsCopy:"Публичный preview исключает контакты по схеме. Адресное CV создаётся только после вашего выбора.", deleteDraft:"Удалить черновик",
      publicProfile:"Публичный preview", privateCv:"Адресное CV", publicContains:"В preview входят", publicContainsCopy:"Псевдоним, профессиональные статусы, опыт, языки, регион и общие условия. Без имени, контакта, работодателей и точных дат.",
      copyText:"Копировать текст", copyPreviewLink:"Копировать preview-ссылку", linkWarning:"Ссылка кодирует разрешённые поля, но не является шифрованием и не может быть отозвана. Не публикуйте её, если не хотите раскрывать карточку.",
      cvLanguage:"Язык CV", recipient:"Получатель (необязательно)", recipientPlaceholder:"Название компании или вакансии", sections:"Разделы CV", qualifications:"Квалификации", experience:"Опыт", languages:"Языки", preferences:"Условия", history:"История работы",
      copyCv:"Копировать CV", printCv:"Печать / сохранить PDF", footerCopy:"Локальный профессиональный профиль. Без загрузки документов.", saved:"Сохранено локально", migrated:"Старый черновик перенесён в CV 2.0", step:"Шаг", of:"из",
      completeStep:"Ответьте на отмеченные вопросы. «Не знаю» — допустимый ответ.", draftIncomplete:"Сначала заполните профессиональную часть профиля.", cvIncomplete:"Для адресного CV укажите имя и один корректный канал связи.", copied:"Скопировано", copyFailed:"Не удалось скопировать", deleteConfirm:"Удалить локальные данные CV 2.0 и старый черновик с этого устройства?", deleted:"Черновик удалён", previewReady:"Preview готов: контакты и работодатели исключены.",
      profession:"Профессиональное направление", professionValue:"Водитель грузового автомобиля C+E", status:"Статус", country:"Страна выдачи", validUntil:"Действует до", optionalDetails:"Необязательные детали документа", cpcType:"Тип квалификации", adrSpecialisations:"Специализации ADR", noUpload:"Номера и файлы документов не запрашиваются.",
      ceStatus:"Категория C+E", cpcStatus:"Профессиональная квалификация / Code 95 / CPC", tachoStatus:"Карта цифрового тахографа", adrStatus:"ADR (если применимо)",
      ceExperience:"Фактический опыт вождения C+E", ceExperienceHelp:"Укажите практику, а не дату получения прав.", equipmentAnswer:"Есть ли опыт с конкретным оборудованием?", equipment:"Оборудование", equipmentHelp:"Цистерна не означает ADR; морской контейнер, BDF и hook-lift разделены.", cargo:"Типы груза", cargoHelp:"Груз хранится отдельно от оборудования и квалификаций.", experienceLevel:"Уровень самостоятельности", noneEquipment:"Нет практического опыта", selectEquipment:"Выбрать оборудование",
      cargoRow:"Грузы",
      optionalHistory:"История работы — необязательно", optionalHistoryCopy:"Для расширенного адресного CV. Работодатели никогда не попадают в публичный preview.", addJob:"Добавить место работы", employer:"Организация", role:"Роль", startMonth:"Начало", endMonth:"Окончание", taskSummary:"Оборудование и задачи", remove:"Удалить", training:"Готовность учиться", trainingCopy:"Показывается, когда квалификация или практика требуют уточнения.",
      workingLanguages:"Рабочие языки", workingLanguagesHelp:"Язык интерфейса не добавляется автоматически. Выберите язык и уровень общения на работе.", addLanguage:"Добавить язык", level:"Уровень",
      baseCountry:"Предпочтительная страна / база", baseCity:"Город или регион (без точного адреса)", routes:"Желаемые маршруты", routeRegions:"Регионы маршрутов — необязательно", routeCountries:"Страны маршрутов — необязательно", geographyHelp:"Это предпочтения по работе, а не гражданство и не право на работу.",
      rotation:"Система работы", homeTime:"Возвращение домой", dayShift:"Дневные смены", nightShift:"Ночные смены", weekends:"Работа в выходные", overnights:"Ночёвки в рейсе", availability:"Когда готовы приступить", availabilityDate:"Точная дата (в public будет только месяц)",
      displayName:"Имя для публичной карточки", displayNameHelp:"Псевдоним или короткое профессиональное имя. Контакт сюда не вводите.", cvName:"Имя для адресного CV", contactType:"Один выбранный канал связи", contactValue:"Контакт", bestTime:"Удобное время / часовой пояс", privateOnly:"Эти данные остаются приватными и появляются только в адресном CV.", reviewReady:"Профессиональная часть заполнена", reviewNotReady:"Профессиональная часть ещё не заполнена", contactOptional:"Контакт можно добавить позже; он не нужен для черновика и public preview.",
      profile:"Профиль", documents:"Профессиональные статусы", actualExperience:"Фактический опыт C+E", equipmentRow:"Оборудование", workingLanguageRow:"Рабочие языки", base:"База", routeType:"Маршруты", conditions:"Условия работы", availabilityRow:"Доступность", contact:"Контакт", recipientRow:"Получатель", generated:"Сформировано", trainingRow:"Готовность к обучению", unknown:"Не указано", noData:"Нет данных", publicUpdated:"Актуально на", sectionsSelected:"Разделы", cvReady:"CV готово к копированию и печати", cvNeedsContact:"Добавьте имя и один контакт на шаге 6", printHint:"Откроется системная печать; выберите «Сохранить как PDF».",
      stepNames:["Квалификации","Опыт","Языки","База и маршруты","Условия","Проверка"],
      stepTitles:["Профессиональные квалификации","Реальный опыт, а не только права","Рабочая коммуникация","Где и по каким маршрутам","Подходящие условия труда","Проверьте и выберите раскрытие"],
      stepIntros:["Статус каждого документа хранится отдельно. Можно ответить «не знаю», «учусь» или «нет».","Разделяем общий стаж, оборудование и уровень самостоятельности.","Добавьте языки, на которых можете общаться с диспетчером, складом и по документам.","Предпочтительная база не является адресом, гражданством или разрешением на работу.","Ночные смены, выходные и ночёвки — независимые условия.","Черновик и public preview не требуют контакта. Для адресного CV нужен один выбранный канал."]
    },
    uk:{
      language:"Мова", eyebrow:"ROADLINE CV 2.0", heroTitle:"Професійний профіль водія C+E", heroCopy:"Кваліфікації, реальний досвід та умови роботи — окремо й без зайвих даних.", start:"Створити профіль", seeOutputs:"Як виглядає результат",
      localFirst:"Чернетка залишається в цьому браузері", localFirstCopy:"Контакт не потрібен для збереження. У публічний preview він не потрапить.", publicPreview:"ПУБЛІЧНИЙ PREVIEW", sharedNotice:"Це професійна картка без контактів. Вона доступна лише для читання й не є перевіреною кваліфікацією.", buildOwn:"Створити свій профіль", selfDeclared:"Заявлено водієм", profileProgress:"ПРОФІЛЬ", draftTitle:"Автозбереження", draftCopy:"Дані зберігаються локально. На спільному телефоні видаліть чернетку після експорту.",
      back:"Назад", next:"Далі", viewResults:"До результатів", twoOutputs:"ДВА РЕЗУЛЬТАТИ", outputsTitle:"Одне джерело фактів — різні рівні доступу", outputsCopy:"Публічний preview виключає контакти за схемою. Адресне CV створюється лише після вашого вибору.", deleteDraft:"Видалити чернетку", publicProfile:"Публічний preview", privateCv:"Адресне CV", publicContains:"У preview входять", publicContainsCopy:"Псевдонім, професійні статуси, досвід, мови, регіон і загальні умови. Без імені, контакту, роботодавців і точних дат.", copyText:"Копіювати текст", copyPreviewLink:"Копіювати preview-посилання", linkWarning:"Посилання кодує дозволені поля, але не є шифруванням і не може бути відкликане. Не публікуйте його, якщо не хочете розкривати картку.",
      cvLanguage:"Мова CV", recipient:"Одержувач (необов’язково)", recipientPlaceholder:"Назва компанії або вакансії", sections:"Розділи CV", qualifications:"Кваліфікації", experience:"Досвід", languages:"Мови", preferences:"Умови", history:"Історія роботи", copyCv:"Копіювати CV", printCv:"Друк / зберегти PDF", footerCopy:"Локальний професійний профіль. Без завантаження документів.", saved:"Збережено локально", migrated:"Стару чернетку перенесено до CV 2.0", step:"Крок", of:"з", completeStep:"Дайте відповіді на позначені питання. «Не знаю» — допустима відповідь.", draftIncomplete:"Спочатку заповніть професійну частину профілю.", cvIncomplete:"Для адресного CV вкажіть ім’я та один коректний канал зв’язку.", copied:"Скопійовано", copyFailed:"Не вдалося скопіювати", deleteConfirm:"Видалити локальні дані CV 2.0 і стару чернетку з цього пристрою?", deleted:"Чернетку видалено", previewReady:"Preview готовий: контакти та роботодавці виключені.",
      profession:"Професійний напрям", professionValue:"Водій вантажного автомобіля C+E", status:"Статус", country:"Країна видачі", validUntil:"Дійсний до", optionalDetails:"Необов’язкові деталі документа", cpcType:"Тип кваліфікації", adrSpecialisations:"Спеціалізації ADR", noUpload:"Номери й файли документів не запитуються.", ceStatus:"Категорія C+E", cpcStatus:"Професійна кваліфікація / Code 95 / CPC", tachoStatus:"Картка цифрового тахографа", adrStatus:"ADR (якщо застосовно)",
      ceExperience:"Фактичний досвід водіння C+E", ceExperienceHelp:"Вкажіть практику, а не дату отримання прав.", equipmentAnswer:"Чи є досвід із конкретним обладнанням?", equipment:"Обладнання", equipmentHelp:"Цистерна не означає ADR; морський контейнер, BDF і hook-lift розділені.", cargo:"Типи вантажу", cargoHelp:"Вантаж зберігається окремо від обладнання та кваліфікацій.", cargoRow:"Вантажі", experienceLevel:"Рівень самостійності", noneEquipment:"Немає практичного досвіду", selectEquipment:"Вибрати обладнання", optionalHistory:"Історія роботи — необов’язково", optionalHistoryCopy:"Для розширеного адресного CV. Роботодавці ніколи не потрапляють у public preview.", addJob:"Додати місце роботи", employer:"Організація", role:"Роль", startMonth:"Початок", endMonth:"Завершення", taskSummary:"Обладнання та завдання", remove:"Видалити", training:"Готовність навчатися", trainingCopy:"Показується, коли кваліфікація або практика потребують уточнення.",
      workingLanguages:"Робочі мови", workingLanguagesHelp:"Мова інтерфейсу не додається автоматично. Виберіть мову та рівень спілкування на роботі.", addLanguage:"Додати мову", level:"Рівень", baseCountry:"Бажана країна / база", baseCity:"Місто або регіон (без точної адреси)", routes:"Бажані маршрути", routeRegions:"Регіони маршрутів — необов’язково", routeCountries:"Країни маршрутів — необов’язково", geographyHelp:"Це робочі вподобання, а не громадянство чи право на роботу.",
      rotation:"Система роботи", homeTime:"Повернення додому", dayShift:"Денні зміни", nightShift:"Нічні зміни", weekends:"Робота у вихідні", overnights:"Ночівлі в рейсі", availability:"Коли готові почати", availabilityDate:"Точна дата (у public буде лише місяць)", displayName:"Ім’я для публічної картки", displayNameHelp:"Псевдонім або коротке професійне ім’я. Контакт сюди не вводьте.", cvName:"Ім’я для адресного CV", contactType:"Один вибраний канал зв’язку", contactValue:"Контакт", bestTime:"Зручний час / часовий пояс", privateOnly:"Ці дані залишаються приватними й з’являються лише в адресному CV.", reviewReady:"Професійну частину заповнено", reviewNotReady:"Професійну частину ще не заповнено", contactOptional:"Контакт можна додати пізніше; він не потрібен для чернетки та public preview.",
      profile:"Профіль", documents:"Професійні статуси", actualExperience:"Фактичний досвід C+E", equipmentRow:"Обладнання", workingLanguageRow:"Робочі мови", base:"База", routeType:"Маршрути", conditions:"Умови роботи", availabilityRow:"Доступність", contact:"Контакт", recipientRow:"Одержувач", generated:"Сформовано", trainingRow:"Готовність до навчання", unknown:"Не вказано", noData:"Немає даних", publicUpdated:"Актуально на", sectionsSelected:"Розділи", cvReady:"CV готове до копіювання й друку", cvNeedsContact:"Додайте ім’я та один контакт на кроці 6", printHint:"Відкриється системний друк; виберіть «Зберегти як PDF».",
      stepNames:["Кваліфікації","Досвід","Мови","База і маршрути","Умови","Перевірка"], stepTitles:["Професійні кваліфікації","Реальний досвід, а не лише права","Робоча комунікація","Де і якими маршрутами","Відповідні умови праці","Перевірте та виберіть розкриття"], stepIntros:["Статус кожного документа зберігається окремо. Можна відповісти «не знаю», «навчаюся» або «немає».","Розділяємо загальний стаж, обладнання та рівень самостійності.","Додайте мови спілкування з диспетчером, складом і для документів.","Бажана база не є адресою, громадянством або дозволом на роботу.","Нічні зміни, вихідні та ночівлі — незалежні умови.","Чернетка й public preview не потребують контакту. Для адресного CV потрібен один канал."]
    },
    en:{
      language:"Language", eyebrow:"ROADLINE CV 2.0", heroTitle:"Professional C+E driver profile", heroCopy:"Qualifications, actual experience and work preferences — kept separate and free of unnecessary data.", start:"Build profile", seeOutputs:"See the outputs", localFirst:"Your draft stays in this browser", localFirstCopy:"A contact is not required to save. It is never included in the public preview.", publicPreview:"PUBLIC PREVIEW", sharedNotice:"This is a read-only professional card without contact details. It is not a verified qualification.", buildOwn:"Build my profile", selfDeclared:"Self-declared", profileProgress:"PROFILE", draftTitle:"Autosave", draftCopy:"Data is stored locally. On a shared phone, delete the draft after exporting.",
      back:"Back", next:"Next", viewResults:"View results", twoOutputs:"TWO OUTPUTS", outputsTitle:"One source of facts — different access levels", outputsCopy:"The public preview excludes contacts by schema. A targeted CV is created only after your choice.", deleteDraft:"Delete draft", publicProfile:"Public preview", privateCv:"Targeted CV", publicContains:"The preview contains", publicContainsCopy:"Alias, professional statuses, experience, languages, region and general preferences. No name, contact, employers or exact dates.", copyText:"Copy text", copyPreviewLink:"Copy preview link", linkWarning:"The link encodes allowed fields, but it is not encryption and cannot be revoked. Do not publish it unless you want to disclose the card.",
      cvLanguage:"CV language", recipient:"Recipient (optional)", recipientPlaceholder:"Company or vacancy name", sections:"CV sections", qualifications:"Qualifications", experience:"Experience", languages:"Languages", preferences:"Preferences", history:"Employment history", copyCv:"Copy CV", printCv:"Print / save PDF", footerCopy:"Local professional profile. No document uploads.", saved:"Saved locally", migrated:"Old draft migrated to CV 2.0", step:"Step", of:"of", completeStep:"Answer the marked questions. “Unknown” is a valid answer.", draftIncomplete:"Complete the professional profile first.", cvIncomplete:"A targeted CV needs a name and one valid contact channel.", copied:"Copied", copyFailed:"Could not copy", deleteConfirm:"Delete CV 2.0 data and the old draft from this device?", deleted:"Draft deleted", previewReady:"Preview ready: contacts and employers are excluded.",
      profession:"Professional track", professionValue:"C+E truck driver", status:"Status", country:"Issuing country", validUntil:"Valid until", optionalDetails:"Optional document details", cpcType:"Qualification type", adrSpecialisations:"ADR specialisations", noUpload:"Document numbers and files are not requested.", ceStatus:"C+E licence", cpcStatus:"Driver CPC / Code 95 / professional qualification", tachoStatus:"Digital tachograph driver card", adrStatus:"ADR (when relevant)",
      ceExperience:"Actual C+E driving experience", ceExperienceHelp:"Report hands-on practice, not the licence issue date.", equipmentAnswer:"Do you have experience with specific equipment?", equipment:"Equipment", equipmentHelp:"A tanker does not mean ADR; sea containers, BDF and hook-lift are separate.", cargo:"Cargo types", cargoHelp:"Cargo is stored separately from equipment and qualifications.", cargoRow:"Cargo", experienceLevel:"Independence level", noneEquipment:"No practical equipment experience", selectEquipment:"Select equipment", optionalHistory:"Employment history — optional", optionalHistoryCopy:"For the extended targeted CV. Employers are never included in the public preview.", addJob:"Add employment", employer:"Organisation", role:"Role", startMonth:"Start", endMonth:"End", taskSummary:"Equipment and tasks", remove:"Remove", training:"Willingness to train", trainingCopy:"Shown when a qualification or practical skill needs clarification.",
      workingLanguages:"Working languages", workingLanguagesHelp:"The interface language is not added automatically. Choose languages used with dispatch, warehouses and documents.", addLanguage:"Add language", level:"Level", baseCountry:"Preferred country / base", baseCity:"City or region (no exact address)", routes:"Preferred routes", routeRegions:"Route regions — optional", routeCountries:"Route countries — optional", geographyHelp:"These are work preferences, not citizenship or work authorisation.",
      rotation:"Work pattern", homeTime:"Home time", dayShift:"Day shifts", nightShift:"Night shifts", weekends:"Weekend work", overnights:"Nights away", availability:"Available to start", availabilityDate:"Exact date (public shows month only)", displayName:"Public card name", displayNameHelp:"An alias or short professional name. Do not enter a contact here.", cvName:"Name for targeted CV", contactType:"One selected contact channel", contactValue:"Contact", bestTime:"Preferred time / time zone", privateOnly:"These details stay private and appear only in the targeted CV.", reviewReady:"Professional profile is complete", reviewNotReady:"Professional profile is incomplete", contactOptional:"You can add a contact later; it is not needed for a draft or public preview.",
      profile:"Profile", documents:"Professional statuses", actualExperience:"Actual C+E experience", equipmentRow:"Equipment", workingLanguageRow:"Working languages", base:"Base", routeType:"Routes", conditions:"Work preferences", availabilityRow:"Availability", contact:"Contact", recipientRow:"Recipient", generated:"Generated", trainingRow:"Training", unknown:"Not provided", noData:"No data", publicUpdated:"Updated", sectionsSelected:"Sections", cvReady:"CV is ready to copy and print", cvNeedsContact:"Add a name and one contact on step 6", printHint:"System print will open; choose “Save as PDF”.",
      stepNames:["Qualifications","Experience","Languages","Base & routes","Preferences","Review"], stepTitles:["Professional qualifications","Actual practice, not just a licence","Working communication","Where and on which routes","Work preferences that fit","Review and choose disclosure"], stepIntros:["Each document has its own status. “Unknown”, “pending” and “absent” are valid answers.","Overall practice, equipment and independence are recorded separately.","Add languages used with dispatch, warehouses and documents.","A preferred base is not an address, citizenship or work authorisation.","Night shifts, weekends and nights away are separate preferences.","A draft and public preview need no contact. A targeted CV needs one selected channel."]
    },
    pl:{
      language:"Język", eyebrow:"ROADLINE CV 2.0", heroTitle:"Profesjonalny profil kierowcy C+E", heroCopy:"Kwalifikacje, rzeczywiste doświadczenie i warunki pracy — osobno, bez zbędnych danych.", start:"Utwórz profil", seeOutputs:"Zobacz wyniki", localFirst:"Wersja robocza zostaje w tej przeglądarce", localFirstCopy:"Kontakt nie jest potrzebny do zapisu i nie trafia do publicznego podglądu.", publicPreview:"PUBLICZNY PODGLĄD", sharedNotice:"To karta zawodowa bez danych kontaktowych, tylko do odczytu. Nie potwierdza kwalifikacji.", buildOwn:"Utwórz mój profil", selfDeclared:"Deklaracja kierowcy", profileProgress:"PROFIL", draftTitle:"Autozapis", draftCopy:"Dane są zapisane lokalnie. Na wspólnym telefonie usuń wersję roboczą po eksporcie.",
      back:"Wstecz", next:"Dalej", viewResults:"Zobacz wyniki", twoOutputs:"DWA WYNIKI", outputsTitle:"Jedno źródło faktów — różne poziomy dostępu", outputsCopy:"Publiczny podgląd wyklucza kontakty według schematu. CV dla adresata powstaje dopiero po Twoim wyborze.", deleteDraft:"Usuń wersję roboczą", publicProfile:"Publiczny podgląd", privateCv:"CV dla adresata", publicContains:"Podgląd zawiera", publicContainsCopy:"Pseudonim, statusy zawodowe, doświadczenie, języki, region i ogólne warunki. Bez imienia, kontaktu, pracodawców i dokładnych dat.", copyText:"Kopiuj tekst", copyPreviewLink:"Kopiuj link podglądu", linkWarning:"Link koduje dozwolone pola, ale nie jest szyfrowaniem i nie można go unieważnić. Nie publikuj go, jeśli nie chcesz ujawniać karty.",
      cvLanguage:"Język CV", recipient:"Adresat (opcjonalnie)", recipientPlaceholder:"Nazwa firmy lub wakatu", sections:"Sekcje CV", qualifications:"Kwalifikacje", experience:"Doświadczenie", languages:"Języki", preferences:"Warunki", history:"Historia zatrudnienia", copyCv:"Kopiuj CV", printCv:"Drukuj / zapisz PDF", footerCopy:"Lokalny profil zawodowy. Bez przesyłania dokumentów.", saved:"Zapisano lokalnie", migrated:"Stara wersja robocza przeniesiona do CV 2.0", step:"Krok", of:"z", completeStep:"Odpowiedz na oznaczone pytania. „Nie wiem” jest poprawną odpowiedzią.", draftIncomplete:"Najpierw uzupełnij zawodową część profilu.", cvIncomplete:"CV dla adresata wymaga imienia i jednego poprawnego kanału kontaktu.", copied:"Skopiowano", copyFailed:"Nie udało się skopiować", deleteConfirm:"Usunąć dane CV 2.0 i starą wersję roboczą z tego urządzenia?", deleted:"Wersję roboczą usunięto", previewReady:"Podgląd gotowy: kontakty i pracodawcy są wykluczeni.",
      profession:"Kierunek zawodowy", professionValue:"Kierowca samochodu ciężarowego C+E", status:"Status", country:"Kraj wydania", validUntil:"Ważne do", optionalDetails:"Opcjonalne dane dokumentu", cpcType:"Typ kwalifikacji", adrSpecialisations:"Specjalizacje ADR", noUpload:"Nie prosimy o numery ani pliki dokumentów.", ceStatus:"Prawo jazdy C+E", cpcStatus:"Kwalifikacja zawodowa / kod 95 / Driver CPC", tachoStatus:"Karta kierowcy do tachografu", adrStatus:"ADR (jeśli dotyczy)",
      ceExperience:"Rzeczywiste doświadczenie C+E", ceExperienceHelp:"Podaj praktykę, nie datę uzyskania prawa jazdy.", equipmentAnswer:"Masz doświadczenie z konkretnym sprzętem?", equipment:"Sprzęt", equipmentHelp:"Cysterna nie oznacza ADR; kontener morski, BDF i hakowiec są rozdzielone.", cargo:"Rodzaje ładunku", cargoHelp:"Ładunek jest zapisany osobno od sprzętu i kwalifikacji.", cargoRow:"Ładunki", experienceLevel:"Poziom samodzielności", noneEquipment:"Brak praktycznego doświadczenia", selectEquipment:"Wybierz sprzęt", optionalHistory:"Historia zatrudnienia — opcjonalnie", optionalHistoryCopy:"Do rozszerzonego CV dla adresata. Pracodawcy nigdy nie trafiają do publicznego podglądu.", addJob:"Dodaj zatrudnienie", employer:"Organizacja", role:"Rola", startMonth:"Początek", endMonth:"Koniec", taskSummary:"Sprzęt i zadania", remove:"Usuń", training:"Gotowość do nauki", trainingCopy:"Pokazywana, gdy kwalifikacja lub praktyka wymaga doprecyzowania.",
      workingLanguages:"Języki w pracy", workingLanguagesHelp:"Język interfejsu nie jest dodawany automatycznie. Wybierz języki do kontaktu z dyspozytorem, magazynem i dokumentami.", addLanguage:"Dodaj język", level:"Poziom", baseCountry:"Preferowany kraj / baza", baseCity:"Miasto lub region (bez dokładnego adresu)", routes:"Preferowane trasy", routeRegions:"Regiony tras — opcjonalnie", routeCountries:"Kraje tras — opcjonalnie", geographyHelp:"To preferencje pracy, nie obywatelstwo ani prawo do pracy.",
      rotation:"System pracy", homeTime:"Powroty do domu", dayShift:"Zmiany dzienne", nightShift:"Zmiany nocne", weekends:"Praca w weekendy", overnights:"Noclegi w trasie", availability:"Dostępność od", availabilityDate:"Dokładna data (publicznie tylko miesiąc)", displayName:"Nazwa publicznej karty", displayNameHelp:"Pseudonim lub krótka nazwa zawodowa. Nie wpisuj tu kontaktu.", cvName:"Imię do CV dla adresata", contactType:"Jeden wybrany kanał kontaktu", contactValue:"Kontakt", bestTime:"Dogodny czas / strefa czasowa", privateOnly:"Te dane pozostają prywatne i pojawiają się tylko w CV dla adresata.", reviewReady:"Część zawodowa jest kompletna", reviewNotReady:"Część zawodowa nie jest kompletna", contactOptional:"Kontakt można dodać później; nie jest potrzebny do wersji roboczej ani publicznego podglądu.",
      profile:"Profil", documents:"Statusy zawodowe", actualExperience:"Rzeczywiste doświadczenie C+E", equipmentRow:"Sprzęt", workingLanguageRow:"Języki w pracy", base:"Baza", routeType:"Trasy", conditions:"Warunki pracy", availabilityRow:"Dostępność", contact:"Kontakt", recipientRow:"Adresat", generated:"Utworzono", trainingRow:"Gotowość do szkolenia", unknown:"Nie podano", noData:"Brak danych", publicUpdated:"Aktualne na", sectionsSelected:"Sekcje", cvReady:"CV jest gotowe do kopiowania i druku", cvNeedsContact:"Dodaj imię i jeden kontakt w kroku 6", printHint:"Otworzy się druk systemowy; wybierz „Zapisz jako PDF”.",
      stepNames:["Kwalifikacje","Doświadczenie","Języki","Baza i trasy","Warunki","Sprawdzenie"], stepTitles:["Kwalifikacje zawodowe","Praktyka, nie tylko prawo jazdy","Komunikacja w pracy","Gdzie i na jakich trasach","Pasujące warunki pracy","Sprawdź i wybierz zakres danych"], stepIntros:["Każdy dokument ma osobny status. „Nie wiem”, „w trakcie” i „brak” są poprawnymi odpowiedziami.","Ogólna praktyka, sprzęt i samodzielność są zapisane osobno.","Dodaj języki używane z dyspozytorem, magazynem i w dokumentach.","Preferowana baza nie jest adresem, obywatelstwem ani prawem do pracy.","Nocne zmiany, weekendy i noclegi to osobne warunki.","Wersja robocza i publiczny podgląd nie wymagają kontaktu. CV dla adresata wymaga jednego kanału."]
    }
  };

  const VALUE_LABELS = {
    status:{
      valid:{ru:"Действует",uk:"Дійсний",en:"Valid",pl:"Ważny"}, expired:{ru:"Истёк",uk:"Закінчився",en:"Expired",pl:"Wygasł"}, pending:{ru:"Учусь / ожидаю",uk:"Навчаюся / очікую",en:"Pending / training",pl:"W trakcie / szkolę się"}, absent:{ru:"Нет",uk:"Немає",en:"Absent",pl:"Brak"}, unknown:{ru:"Не знаю",uk:"Не знаю",en:"Unknown",pl:"Nie wiem"}, "":{ru:"Не указано",uk:"Не вказано",en:"Not provided",pl:"Nie podano"}
    },
    cpc:{ eu_code_95:{ru:"EU Code 95",uk:"EU Code 95",en:"EU Code 95",pl:"Kod 95 UE"}, uk_national:{ru:"UK National CPC",uk:"UK National CPC",en:"UK National CPC",pl:"UK National CPC"}, uk_international:{ru:"UK International CPC",uk:"UK International CPC",en:"UK International CPC",pl:"UK International CPC"}, other:{ru:"Другая",uk:"Інша",en:"Other",pl:"Inna"}, unknown:{ru:"Не знаю",uk:"Не знаю",en:"Unknown",pl:"Nie wiem"} },
    adr:{ base:{ru:"ADR базовый",uk:"ADR базовий",en:"ADR basic",pl:"ADR podstawowy"}, tank:{ru:"ADR цистерны",uk:"ADR цистерни",en:"ADR tanks",pl:"ADR cysterny"}, class_1:{ru:"Класс 1",uk:"Клас 1",en:"Class 1",pl:"Klasa 1"}, class_7:{ru:"Класс 7",uk:"Клас 7",en:"Class 7",pl:"Klasa 7"} },
    experience:{ none:{ru:"Нет практики",uk:"Немає практики",en:"No practice",pl:"Brak praktyki"}, lt_6m:{ru:"Менее 6 месяцев",uk:"Менше 6 місяців",en:"Under 6 months",pl:"Mniej niż 6 miesięcy"}, "6_12m":{ru:"6–12 месяцев",uk:"6–12 місяців",en:"6–12 months",pl:"6–12 miesięcy"}, "1_2y":{ru:"1–2 года",uk:"1–2 роки",en:"1–2 years",pl:"1–2 lata"}, "2_5y":{ru:"2–5 лет",uk:"2–5 років",en:"2–5 years",pl:"2–5 lat"}, "5y_plus":{ru:"Более 5 лет",uk:"Понад 5 років",en:"5+ years",pl:"Ponad 5 lat"}, unknown:{ru:"Не указано",uk:"Не вказано",en:"Not provided",pl:"Nie podano"} },
    equipment:{ tautliner:{ru:"Тент / штора",uk:"Тент / штора",en:"Tautliner / curtain",pl:"Plandeka"}, reefer:{ru:"Рефрижератор",uk:"Рефрижератор",en:"Reefer",pl:"Chłodnia"}, sea_container:{ru:"Морской контейнер",uk:"Морський контейнер",en:"Sea container",pl:"Kontener morski"}, bdf:{ru:"BDF / Wechselbrücke",uk:"BDF / Wechselbrücke",en:"BDF / swap body",pl:"BDF / nadwozie wymienne"}, hook_lift:{ru:"Hook-lift / крюковой",uk:"Hook-lift / гаковий",en:"Hook-lift",pl:"Hakowiec"}, tanker:{ru:"Цистерна",uk:"Цистерна",en:"Tanker",pl:"Cysterna"}, silo:{ru:"Силос",uk:"Силос",en:"Silo",pl:"Silos"}, car_carrier:{ru:"Автовоз",uk:"Автовоз",en:"Car carrier",pl:"Autotransporter"}, low_bed:{ru:"Низкорамник",uk:"Низькорамний",en:"Low-bed",pl:"Niskopodwozie"}, walking_floor:{ru:"Подвижный пол",uk:"Рухома підлога",en:"Walking floor",pl:"Ruchoma podłoga"} },
    cargo:{ general:{ru:"Генеральный груз",uk:"Генеральний вантаж",en:"General freight",pl:"Ładunek ogólny"}, refrigerated:{ru:"Температурный груз",uk:"Температурний вантаж",en:"Temperature-controlled",pl:"Ładunek chłodniczy"}, food_liquid:{ru:"Пищевая жидкость",uk:"Харчова рідина",en:"Food-grade liquid",pl:"Płyn spożywczy"}, dangerous_goods:{ru:"Опасный груз",uk:"Небезпечний вантаж",en:"Dangerous goods",pl:"Towary niebezpieczne"}, vehicles:{ru:"Автомобили",uk:"Автомобілі",en:"Vehicles",pl:"Pojazdy"}, dry_bulk:{ru:"Сыпучий груз",uk:"Сипучий вантаж",en:"Dry bulk",pl:"Ładunek sypki"} },
    level:{ unknown:{ru:"Нужно уточнить",uk:"Потрібно уточнити",en:"Needs clarification",pl:"Do ustalenia"}, learning:{ru:"Учусь",uk:"Навчаюся",en:"Learning",pl:"Uczę się"}, assisted:{ru:"С наставником",uk:"З наставником",en:"With support",pl:"Z pomocą"}, independent:{ru:"Самостоятельно",uk:"Самостійно",en:"Independent",pl:"Samodzielnie"} },
    language:{ ru:{ru:"Русский",uk:"Російська",en:"Russian",pl:"Rosyjski"}, uk:{ru:"Украинский",uk:"Українська",en:"Ukrainian",pl:"Ukraiński"}, pl:{ru:"Польский",uk:"Польська",en:"Polish",pl:"Polski"}, en:{ru:"Английский",uk:"Англійська",en:"English",pl:"Angielski"}, de:{ru:"Немецкий",uk:"Німецька",en:"German",pl:"Niemiecki"}, nl:{ru:"Нидерландский",uk:"Нідерландська",en:"Dutch",pl:"Niderlandzki"}, fr:{ru:"Французский",uk:"Французька",en:"French",pl:"Francuski"} },
    languageLevel:{ basic:{ru:"Базовый",uk:"Базовий",en:"Basic",pl:"Podstawowy"}, operational:{ru:"Рабочий",uk:"Робочий",en:"Operational",pl:"Roboczy"}, confident:{ru:"Уверенный",uk:"Впевнений",en:"Confident",pl:"Swobodny"}, native:{ru:"Родной",uk:"Рідний",en:"Native",pl:"Ojczysty"} },
    country:{ ZZ:{ru:"Открыт к предложениям",uk:"Відкритий до пропозицій",en:"Open to offers",pl:"Otwarty na oferty"}, PL:{ru:"Польша",uk:"Польща",en:"Poland",pl:"Polska"}, DE:{ru:"Германия",uk:"Німеччина",en:"Germany",pl:"Niemcy"}, NL:{ru:"Нидерланды",uk:"Нідерланди",en:"Netherlands",pl:"Niderlandy"}, BE:{ru:"Бельгия",uk:"Бельгія",en:"Belgium",pl:"Belgia"}, FR:{ru:"Франция",uk:"Франція",en:"France",pl:"Francja"}, GB:{ru:"Великобритания",uk:"Велика Британія",en:"United Kingdom",pl:"Wielka Brytania"}, ES:{ru:"Испания",uk:"Іспанія",en:"Spain",pl:"Hiszpania"}, IT:{ru:"Италия",uk:"Італія",en:"Italy",pl:"Włochy"}, CZ:{ru:"Чехия",uk:"Чехія",en:"Czechia",pl:"Czechy"} },
    route:{ local:{ru:"Местные",uk:"Місцеві",en:"Local",pl:"Lokalne"}, domestic:{ru:"По стране",uk:"По країні",en:"Domestic",pl:"Krajowe"}, international:{ru:"Международные",uk:"Міжнародні",en:"International",pl:"Międzynarodowe"}, any:{ru:"Любые / обсуждается",uk:"Будь-які / обговорюється",en:"Any / negotiable",pl:"Dowolne / do ustalenia"} },
    routeRegion:{ benelux:{ru:"Бенилюкс",uk:"Бенілюкс",en:"Benelux",pl:"Benelux"}, scandinavia:{ru:"Скандинавия",uk:"Скандинавія",en:"Scandinavia",pl:"Skandynawia"}, europe:{ru:"Вся Европа",uk:"Уся Європа",en:"All Europe",pl:"Cała Europa"} },
    rotation:{ daily:{ru:"Ежедневно домой",uk:"Щодня додому",en:"Daily home",pl:"Codziennie w domu"}, weekends:{ru:"Выходные дома",uk:"Вихідні вдома",en:"Weekends home",pl:"Weekendy w domu"}, "2_2":{ru:"2/2",uk:"2/2",en:"2/2",pl:"2/2"}, "3_1":{ru:"3/1",uk:"3/1",en:"3/1",pl:"3/1"}, "4_1":{ru:"4/1",uk:"4/1",en:"4/1",pl:"4/1"}, negotiable:{ru:"Обсуждается",uk:"Обговорюється",en:"Negotiable",pl:"Do ustalenia"}, unknown:{ru:"Не указано",uk:"Не вказано",en:"Not provided",pl:"Nie podano"} },
    homeTime:{ daily:{ru:"Каждый день",uk:"Щодня",en:"Daily",pl:"Codziennie"}, weekly:{ru:"Каждую неделю",uk:"Щотижня",en:"Weekly",pl:"Co tydzień"}, rotation:{ru:"После ротации",uk:"Після ротації",en:"After rotation",pl:"Po rotacji"}, negotiable:{ru:"Обсуждается",uk:"Обговорюється",en:"Negotiable",pl:"Do ustalenia"}, unknown:{ru:"Не указано",uk:"Не вказано",en:"Not provided",pl:"Nie podano"} },
    pref:{ accepted:{ru:"Готов",uk:"Готовий",en:"Accepted",pl:"Akceptuję"}, negotiable:{ru:"Обсуждается",uk:"Обговорюється",en:"Negotiable",pl:"Do ustalenia"}, excluded:{ru:"Не подходит",uk:"Не підходить",en:"Excluded",pl:"Nie"}, "":{ru:"Не указано",uk:"Не вказано",en:"Not provided",pl:"Nie podano"} },
    overnight:{ none:{ru:"Без ночёвок",uk:"Без ночівель",en:"No nights away",pl:"Bez noclegów"}, "1_2":{ru:"1–2 ночи",uk:"1–2 ночі",en:"1–2 nights",pl:"1–2 noce"}, "3_5":{ru:"3–5 ночей",uk:"3–5 ночей",en:"3–5 nights",pl:"3–5 nocy"}, longer:{ru:"Дольше недели",uk:"Довше тижня",en:"Longer periods",pl:"Dłuższe okresy"}, negotiable:{ru:"Обсуждается",uk:"Обговорюється",en:"Negotiable",pl:"Do ustalenia"}, unknown:{ru:"Не указано",uk:"Не вказано",en:"Not provided",pl:"Nie podano"} },
    availability:{ now:{ru:"Сразу",uk:"Одразу",en:"Immediately",pl:"Od zaraz"}, "2_weeks":{ru:"Через 2 недели",uk:"Через 2 тижні",en:"In 2 weeks",pl:"Za 2 tygodnie"}, "4_weeks":{ru:"Через 4 недели",uk:"Через 4 тижні",en:"In 4 weeks",pl:"Za 4 tygodnie"}, date:{ru:"В выбранную дату",uk:"У вибрану дату",en:"On a chosen date",pl:"W wybranym terminie"}, not_looking:{ru:"Пока не ищу",uk:"Поки не шукаю",en:"Not looking now",pl:"Obecnie nie szukam"}, unknown:{ru:"Не указано",uk:"Не вказано",en:"Not provided",pl:"Nie podano"} },
    contact:{ phone:{ru:"Телефон",uk:"Телефон",en:"Phone",pl:"Telefon"}, email:{ru:"E-mail",uk:"E-mail",en:"Email",pl:"E-mail"}, messenger:{ru:"Мессенджер",uk:"Месенджер",en:"Messenger",pl:"Komunikator"} },
    training:{ adr:{ru:"ADR",uk:"ADR",en:"ADR",pl:"ADR"}, equipment:{ru:"Новое оборудование",uk:"Нове обладнання",en:"New equipment",pl:"Nowy sprzęt"}, routes:{ru:"Новые маршруты",uk:"Нові маршрути",en:"New routes",pl:"Nowe trasy"} }
  };

  function detectLocale(){
    const saved = localStorage.getItem(LANG_KEY);
    if(LOCALES.includes(saved)) return saved;
    const raw = (navigator.language || "en").toLowerCase();
    if(raw.startsWith("ru")) return "ru";
    if(raw.startsWith("uk")) return "uk";
    if(raw.startsWith("pl")) return "pl";
    return "en";
  }

  function t(key, locale = state.lang){ return (TEXT[locale] && TEXT[locale][key]) || TEXT.en[key] || key; }
  function valueLabel(group, code, locale = state.lang){
    const item = VALUE_LABELS[group] && VALUE_LABELS[group][code];
    return item ? (item[locale] || item.en) : (code || t("unknown", locale));
  }
  function node(tag, className, text){
    const element = document.createElement(tag);
    if(className) element.className = className;
    if(text !== undefined) element.textContent = text;
    return element;
  }
  function option(value, label){ const item = document.createElement("option"); item.value = value; item.textContent = label; return item; }

  let migrationNotice = false;
  function loadProfile(locale){
    try{
      const raw = localStorage.getItem(PROFILE_KEY);
      if(raw){
        const profile = model.sanitizeProfile(JSON.parse(raw), {locale});
        const legacy = localStorage.getItem(LEGACY_KEY);
        if(!profile.migration && legacy){
          try{
            const restored = model.backfillLegacyMigration(profile, JSON.parse(legacy), {locale});
            localStorage.setItem(PROFILE_KEY, JSON.stringify(restored));
            migrationNotice = true;
            return restored;
          }catch(error){ return profile; }
        }
        return profile;
      }
    }catch(error){ /* use a clean profile */ }
    try{
      const legacy = localStorage.getItem(LEGACY_KEY);
      if(legacy){
        const migrated = model.migrateLegacyAnswers(JSON.parse(legacy), {locale});
        localStorage.setItem(PROFILE_KEY, JSON.stringify(migrated));
        JSON.parse(localStorage.getItem(PROFILE_KEY));
        migrationNotice = true;
        return migrated;
      }
    }catch(error){ /* preserve legacy data and start without deleting it */ }
    return model.createEmptyProfile(locale);
  }

  function loadShared(){
    const current = new URL(location.href);
    const encoded = current.searchParams.get(SHARE_PARAM);
    if(!encoded) return null;
    const decoded = model.decodeSharedProfile(encoded, {locale:detectLocale()});
    if(!decoded) return null;
    const safe = new URL(current.origin + current.pathname);
    safe.searchParams.set(SHARE_PARAM, model.encodePublicProfile(decoded.publicProfile));
    safe.hash = "public-profile";
    if(safe.href !== current.href) history.replaceState(null, "", safe);
    return decoded.publicProfile;
  }

  const sharedProfile = loadShared();
  const initialLang = detectLocale();
  const storedStep = Number(localStorage.getItem(STEP_KEY));
  const state = {
    lang:initialLang,
    profile:loadProfile(initialLang),
    step:Number.isInteger(storedStep) && storedStep >= 0 && storedStep < STEP_COUNT ? storedStep : 0,
    sharedProfile,
    toastTimer:null
  };

  function toast(message){
    const target = document.getElementById("toast");
    target.textContent = message;
    target.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(()=>target.classList.remove("show"), 2200);
  }

  function saveProfile(){
    state.profile.locale = state.lang;
    state.profile.updatedAt = new Date().toISOString();
    state.profile = model.sanitizeProfile(state.profile, {locale:state.lang});
    localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
    localStorage.setItem(STEP_KEY, String(state.step));
    const status = document.getElementById("saveState");
    status.textContent = t("saved");
    renderOutputs();
  }

  function update(mutator, rerender = false){
    mutator(state.profile);
    saveProfile();
    if(rerender) renderStep();
  }

  function applyTranslations(){
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(element=>{ element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element=>{ element.placeholder = t(element.dataset.i18nPlaceholder); });
    document.getElementById("langSelect").value = state.lang;
  }

  let generatedFieldId = 0;
  function makeField(labelText, input, helpText){
    const wrap = node("div", "field");
    const label = node("label", "", labelText);
    if(!input.id) input.id = `roadline-field-${++generatedFieldId}`;
    label.htmlFor = input.id;
    if(input.id) label.htmlFor = input.id;
    wrap.append(label, input);
    if(helpText) wrap.append(node("p", "field-help", helpText));
    return wrap;
  }

  function makeRadioGroup(config){
    const fieldset = node("fieldset", "field-group");
    const legend = node("legend", "field-label", config.label);
    fieldset.appendChild(legend);
    if(config.help) fieldset.appendChild(node("p", "field-help", config.help));
    const grid = node("div", `option-grid ${config.three ? "three" : ""}`);
    config.options.forEach(item=>{
      const label = node("label", "option-card");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = config.name;
      input.value = item.value;
      input.checked = config.value === item.value;
      input.addEventListener("change", ()=>config.onChange(item.value));
      label.append(input, node("span", "", item.label));
      grid.appendChild(label);
    });
    fieldset.appendChild(grid);
    return fieldset;
  }

  function makeCheckboxGroup(config){
    const fieldset = node("fieldset", "field-group");
    fieldset.appendChild(node("legend", "field-label", config.label));
    if(config.help) fieldset.appendChild(node("p", "field-help", config.help));
    const grid = node("div", `option-grid ${config.three ? "three" : ""}`);
    config.options.forEach(item=>{
      const label = node("label", "option-card");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = item.value;
      input.checked = config.values.includes(item.value);
      input.addEventListener("change", ()=>{
        let next = config.values.filter(value=>value !== item.value);
        if(input.checked) next.push(item.value);
        config.onChange(next, item.value, input.checked);
      });
      label.append(input, node("span", "", item.label));
      grid.appendChild(label);
    });
    fieldset.appendChild(grid);
    return fieldset;
  }

  function makeSelect(id, items, selected, includeBlank = true){
    const select = document.createElement("select");
    select.id = id;
    select.className = "select-control";
    if(includeBlank) select.appendChild(option("", "—"));
    items.forEach(item=>select.appendChild(option(item.value, item.label)));
    select.value = selected || "";
    return select;
  }

  function statusOptions(includeEmpty = false){
    const codes = includeEmpty ? ["", "valid", "expired", "pending", "absent", "unknown"] : ["valid", "expired", "pending", "absent", "unknown"];
    return codes.map(value=>({value,label:valueLabel("status", value)}));
  }

  function renderQualification(container, code, labelKey, extra){
    const qualification = state.profile.qualifications[code];
    const section = node("section", "subsection qualification-block");
    section.appendChild(makeRadioGroup({
      name:`status-${code}`, label:t(labelKey), options:statusOptions(), value:qualification.status,
      onChange:value=>update(profile=>{ profile.qualifications[code].status = value; }, true)
    }));
    const details = node("details", "details-panel");
    if(qualification.issuingCountry || qualification.validUntil || (code === "cpc" && qualification.cpcType)) details.open = true;
    details.appendChild(node("summary", "", t("optionalDetails")));
    const grid = node("div", "details-grid");
    if(code === "cpc"){
      const cpc = makeSelect(`cpc-type`, ["eu_code_95","uk_national","uk_international","other","unknown"].map(value=>({value,label:valueLabel("cpc",value)})), qualification.cpcType);
      cpc.addEventListener("change", ()=>update(profile=>{ profile.qualifications.cpc.cpcType = cpc.value; }));
      grid.appendChild(makeField(t("cpcType"), cpc));
    }
    const country = document.createElement("input");
    country.id = `country-${code}`; country.className = "text-control"; country.maxLength = 2; country.value = qualification.issuingCountry; country.placeholder = "PL"; country.autocapitalize = "characters";
    country.addEventListener("input", ()=>update(profile=>{ profile.qualifications[code].issuingCountry = country.value.toUpperCase(); }));
    const date = document.createElement("input");
    date.id = `date-${code}`; date.className = "text-control"; date.type = "date"; date.value = qualification.validUntil;
    date.addEventListener("change", ()=>update(profile=>{ profile.qualifications[code].validUntil = date.value; }));
    grid.append(makeField(t("country"), country), makeField(t("validUntil"), date));
    if(extra) extra(grid, details);
    details.appendChild(grid);
    details.appendChild(node("p", "field-help", t("noUpload")));
    section.appendChild(details);
    container.appendChild(section);
  }

  function renderQualifications(container){
    const callout = node("div", "details-panel");
    callout.append(node("strong", "", t("profession")), node("p", "field-help", t("professionValue")));
    container.appendChild(callout);
    renderQualification(container, "ce", "ceStatus");
    renderQualification(container, "cpc", "cpcStatus");
    renderQualification(container, "tachograph", "tachoStatus");
    renderQualification(container, "adr", "adrStatus", (grid)=>{
      const wrapper = node("div", "wide");
      wrapper.appendChild(makeCheckboxGroup({
        label:t("adrSpecialisations"), values:state.profile.qualifications.adr.specialisations,
        options:["base","tank","class_1","class_7"].map(value=>({value,label:valueLabel("adr",value)})),
        onChange:values=>update(profile=>{ profile.qualifications.adr.specialisations = values; })
      }));
      grid.appendChild(wrapper);
    });
  }

  function renderExperience(container){
    container.appendChild(makeRadioGroup({
      name:"ce-range", label:t("ceExperience"), help:t("ceExperienceHelp"), three:true,
      value:state.profile.experience.ceRange,
      options:["none","lt_6m","6_12m","1_2y","2_5y","5y_plus"].map(value=>({value,label:valueLabel("experience",value)})),
      onChange:value=>update(profile=>{ profile.experience.ceRange = value; })
    }));
    container.appendChild(makeRadioGroup({
      name:"equipment-answer", label:t("equipmentAnswer"),
      value:state.profile.experience.equipmentAnswer,
      options:[{value:"none",label:t("noneEquipment")},{value:"selected",label:t("selectEquipment")}],
      onChange:value=>update(profile=>{
        profile.experience.equipmentAnswer = value;
        if(value === "none"){
          profile.experience.equipment = [];
          profile.experience.cargo = [];
        }
      }, true)
    }));
    if(state.profile.experience.equipmentAnswer === "selected"){
      const selectedCodes = state.profile.experience.equipment.map(item=>item.code);
      container.appendChild(makeCheckboxGroup({
        label:t("equipment"), help:t("equipmentHelp"), values:selectedCodes, three:true,
        options:Object.keys(VALUE_LABELS.equipment).map(value=>({value,label:valueLabel("equipment",value)})),
        onChange:values=>update(profile=>{
          profile.experience.equipment = values.map(code=>profile.experience.equipment.find(item=>item.code === code) || {code,level:"unknown"});
        }, true)
      }));
      if(state.profile.experience.equipment.length){
        const list = node("div", "equipment-list");
        state.profile.experience.equipment.forEach(item=>{
          const row = node("div", "equipment-row");
          row.appendChild(node("strong", "", valueLabel("equipment", item.code)));
          const select = makeSelect(`equipment-level-${item.code}`, ["unknown","learning","assisted","independent"].map(value=>({value,label:valueLabel("level",value)})), item.level, false);
          select.addEventListener("change", ()=>update(profile=>{
            const target = profile.experience.equipment.find(current=>current.code === item.code);
            if(target) target.level = select.value;
          }, true));
          row.appendChild(makeField(t("experienceLevel"), select));
          list.appendChild(row);
        });
        container.appendChild(list);
      }
      const selectedCargo = state.profile.experience.cargo.map(item=>item.code);
      container.appendChild(makeCheckboxGroup({
        label:t("cargo"), help:t("cargoHelp"), values:selectedCargo, three:true,
        options:Object.keys(VALUE_LABELS.cargo).map(value=>({value,label:valueLabel("cargo",value)})),
        onChange:values=>update(profile=>{
          profile.experience.cargo = values.map(code=>profile.experience.cargo.find(item=>item.code === code) || {code,level:"unknown"});
        }, true)
      }));
      if(state.profile.experience.cargo.length){
        const cargoList = node("div", "equipment-list");
        state.profile.experience.cargo.forEach(item=>{
          const row = node("div", "equipment-row");
          row.appendChild(node("strong", "", valueLabel("cargo", item.code)));
          const select = makeSelect(`cargo-level-${item.code}`, ["unknown","learning","assisted","independent"].map(value=>({value,label:valueLabel("level",value)})), item.level, false);
          select.addEventListener("change", ()=>update(profile=>{
            const target = profile.experience.cargo.find(current=>current.code === item.code);
            if(target) target.level = select.value;
          }, true));
          row.appendChild(makeField(t("experienceLevel"), select));
          cargoList.appendChild(row);
        });
        container.appendChild(cargoList);
      }
    }

    const needsTraining = state.profile.qualifications.adr.status !== "valid" ||
      [...state.profile.experience.equipment, ...state.profile.experience.cargo].some(item=>item.level !== "independent");
    if(needsTraining){
      container.appendChild(makeCheckboxGroup({
        label:t("training"), help:t("trainingCopy"), values:state.profile.training,
        options:["adr","equipment","routes"].map(value=>({value,label:valueLabel("training",value)})),
        onChange:values=>update(profile=>{ profile.training = values; })
      }));
    }

    const historySection = node("section", "subsection");
    historySection.append(node("h3", "", t("optionalHistory")), node("p", "", t("optionalHistoryCopy")));
    const list = node("div", "history-list");
    state.profile.experience.employmentHistory.forEach((entry,index)=>{
      const card = node("div", "history-card");
      const fields = [
        ["employer", "text", "employer"], ["role", "text", "role"], ["startMonth", "month", "startMonth"], ["endMonth", "month", "endMonth"]
      ];
      fields.forEach(([key,type,labelKey])=>{
        const input = document.createElement("input"); input.type = type; input.className = "text-control"; input.value = entry[key] || ""; input.maxLength = 80;
        input.addEventListener("input", ()=>update(profile=>{ profile.experience.employmentHistory[index][key] = input.value; }));
        card.appendChild(makeField(t(labelKey), input));
      });
      const summary = document.createElement("textarea"); summary.className = "text-control"; summary.maxLength = 240; summary.value = entry.summary || "";
      summary.addEventListener("input", ()=>update(profile=>{ profile.experience.employmentHistory[index].summary = summary.value; }));
      const wide = makeField(t("taskSummary"), summary); wide.classList.add("wide"); card.appendChild(wide);
      const remove = node("button", "remove-button wide", t("remove")); remove.type = "button";
      remove.addEventListener("click", ()=>update(profile=>{ profile.experience.employmentHistory.splice(index,1); }, true));
      card.appendChild(remove); list.appendChild(card);
    });
    historySection.appendChild(list);
    const add = node("button", "button ghost", t("addJob")); add.type = "button";
    add.addEventListener("click", ()=>update(profile=>{ profile.experience.employmentHistory.push({employer:"",role:"",startMonth:"",endMonth:"",summary:""}); }, true));
    historySection.appendChild(add); container.appendChild(historySection);
  }

  function renderLanguages(container){
    container.appendChild(node("p", "field-help", t("workingLanguagesHelp")));
    const values = state.profile.workingLanguages.map(item=>item.code);
    container.appendChild(makeCheckboxGroup({
      label:t("workingLanguages"), values, three:true,
      options:Object.keys(VALUE_LABELS.language).map(value=>({value,label:valueLabel("language",value)})),
      onChange:next=>update(profile=>{ profile.workingLanguages = next.map(code=>profile.workingLanguages.find(item=>item.code === code) || {code,level:"operational"}); }, true)
    }));
    const list = node("div", "language-list");
    state.profile.workingLanguages.forEach(item=>{
      const row = node("div", "language-row");
      row.appendChild(node("strong", "", valueLabel("language",item.code)));
      const select = makeSelect(`language-level-${item.code}`, ["basic","operational","confident","native"].map(value=>({value,label:valueLabel("languageLevel",value)})), item.level, false);
      select.addEventListener("change", ()=>update(profile=>{
        const target = profile.workingLanguages.find(current=>current.code === item.code);
        if(target) target.level = select.value;
      }));
      row.appendChild(makeField(t("level"),select)); list.appendChild(row);
    });
    container.appendChild(list);
  }

  function countryOptions(){ return Object.keys(VALUE_LABELS.country).map(value=>({value,label:valueLabel("country",value)})); }

  function renderGeography(container){
    container.appendChild(node("p", "field-help", t("geographyHelp")));
    const grid = node("div", "details-grid");
    const country = makeSelect("base-country", countryOptions(), state.profile.preferences.baseCountry);
    country.addEventListener("change", ()=>update(profile=>{ profile.preferences.baseCountry = country.value; }));
    const city = document.createElement("input"); city.id = "base-city"; city.className = "text-control"; city.maxLength = 80; city.value = state.profile.preferences.baseCity;
    city.addEventListener("input", ()=>update(profile=>{ profile.preferences.baseCity = city.value; }));
    grid.append(makeField(t("baseCountry"),country), makeField(t("baseCity"),city)); container.appendChild(grid);
    container.appendChild(makeCheckboxGroup({
      label:t("routes"), values:state.profile.preferences.routeTypes,
      options:["local","domestic","international","any"].map(value=>({value,label:valueLabel("route",value)})),
      onChange:(values,changed,checked)=>update(profile=>{
        if(changed === "any" && checked) profile.preferences.routeTypes = ["any"];
        else profile.preferences.routeTypes = values.filter(value=>value !== "any");
      }, true)
    }));
    container.appendChild(makeCheckboxGroup({
      label:t("routeRegions"), values:state.profile.preferences.routeRegions, three:true,
      options:["benelux","scandinavia","europe"].map(value=>({value,label:valueLabel("routeRegion",value)})),
      onChange:values=>update(profile=>{ profile.preferences.routeRegions = values; })
    }));
    container.appendChild(makeCheckboxGroup({
      label:t("routeCountries"), values:state.profile.preferences.routeCountries, three:true,
      options:countryOptions().filter(item=>item.value !== "ZZ"),
      onChange:values=>update(profile=>{ profile.preferences.routeCountries = values; })
    }));
  }

  function renderPreferences(container){
    container.appendChild(makeRadioGroup({ name:"rotation", label:t("rotation"), three:true, value:state.profile.preferences.rotation,
      options:["daily","weekends","2_2","3_1","4_1","negotiable"].map(value=>({value,label:valueLabel("rotation",value)})),
      onChange:value=>update(profile=>{ profile.preferences.rotation = value; }) }));
    container.appendChild(makeRadioGroup({ name:"home-time", label:t("homeTime"), value:state.profile.preferences.homeTime,
      options:["daily","weekly","rotation","negotiable"].map(value=>({value,label:valueLabel("homeTime",value)})),
      onChange:value=>update(profile=>{ profile.preferences.homeTime = value; }) }));
    [["day","dayShift"],["night","nightShift"],["weekends","weekends"]].forEach(([key,labelKey])=>{
      container.appendChild(makeRadioGroup({ name:`shift-${key}`, label:t(labelKey), value:state.profile.preferences.shifts[key],
        options:["accepted","negotiable","excluded"].map(value=>({value,label:valueLabel("pref",value)})),
        onChange:value=>update(profile=>{ profile.preferences.shifts[key] = value; }) }));
    });
    container.appendChild(makeRadioGroup({ name:"overnights", label:t("overnights"), three:true, value:state.profile.preferences.overnights,
      options:["none","1_2","3_5","longer","negotiable"].map(value=>({value,label:valueLabel("overnight",value)})),
      onChange:value=>update(profile=>{ profile.preferences.overnights = value; }) }));
    container.appendChild(makeRadioGroup({ name:"availability", label:t("availability"), three:true, value:state.profile.preferences.availability.type,
      options:["now","2_weeks","4_weeks","date","not_looking"].map(value=>({value,label:valueLabel("availability",value)})),
      onChange:value=>update(profile=>{ profile.preferences.availability.type = value; if(value !== "date") profile.preferences.availability.date = ""; }, true) }));
    if(state.profile.preferences.availability.type === "date"){
      const date = document.createElement("input"); date.type = "date"; date.className = "text-control"; date.value = state.profile.preferences.availability.date;
      date.addEventListener("change", ()=>update(profile=>{ profile.preferences.availability.date = date.value; }));
      container.appendChild(makeField(t("availabilityDate"),date));
    }
  }

  function renderReview(container){
    const completion = model.validateProfessionalProfile(state.profile);
    const banner = node("div", "details-panel");
    banner.appendChild(node("strong", "", completion.valid ? t("reviewReady") : t("reviewNotReady")));
    banner.appendChild(node("p", "field-help", t("contactOptional")));
    container.appendChild(banner);
    const displayName = document.createElement("input"); displayName.className = "text-control"; displayName.maxLength = 40; displayName.value = state.profile.publicIdentity.displayName; displayName.placeholder = "Driver C+E";
    displayName.addEventListener("input", ()=>update(profile=>{ profile.publicIdentity.displayName = displayName.value; }));
    container.appendChild(makeField(t("displayName"),displayName,t("displayNameHelp")));
    const privateSection = node("section", "subsection");
    privateSection.append(node("h3", "", t("privateCv")), node("p", "", t("privateOnly")));
    const cvName = document.createElement("input"); cvName.className = "text-control"; cvName.maxLength = 80; cvName.autocomplete = "name"; cvName.value = state.profile.privateIdentity.cvName;
    cvName.addEventListener("input", ()=>update(profile=>{ profile.privateIdentity.cvName = cvName.value; }));
    privateSection.appendChild(makeField(t("cvName"),cvName));
    const contactType = makeSelect("contact-type", ["phone","email","messenger"].map(value=>({value,label:valueLabel("contact",value)})), state.profile.privateIdentity.contact.type);
    contactType.addEventListener("change", ()=>update(profile=>{ profile.privateIdentity.contact.type = contactType.value; }));
    const contactValue = document.createElement("input"); contactValue.className = "text-control"; contactValue.maxLength = 120; contactValue.value = state.profile.privateIdentity.contact.value; contactValue.autocomplete = "off";
    contactValue.addEventListener("input", ()=>update(profile=>{ profile.privateIdentity.contact.value = contactValue.value; }));
    const bestTime = document.createElement("input"); bestTime.className = "text-control"; bestTime.maxLength = 80; bestTime.value = state.profile.privateIdentity.contact.bestTime;
    bestTime.addEventListener("input", ()=>update(profile=>{ profile.privateIdentity.contact.bestTime = bestTime.value; }));
    const grid = node("div", "details-grid");
    grid.append(makeField(t("contactType"),contactType),makeField(t("contactValue"),contactValue),makeField(t("bestTime"),bestTime));
    privateSection.appendChild(grid); container.appendChild(privateSection);
  }

  const STEP_RENDERERS = [renderQualifications,renderExperience,renderLanguages,renderGeography,renderPreferences,renderReview];

  function renderStepNavigation(){
    const list = document.getElementById("stepList"); list.replaceChildren();
    t("stepNames").forEach((name,index)=>{
      const item = document.createElement("li");
      const button = document.createElement("button"); button.type = "button";
      if(index === state.step) button.classList.add("active");
      if(index < state.step || model.validateStep(state.profile,index).valid) button.classList.add("done");
      button.append(node("span","",String(index+1)),node("span","",name));
      button.addEventListener("click", ()=>{ state.step=index; localStorage.setItem(STEP_KEY,String(index)); renderStep(); document.getElementById("builder").scrollIntoView({behavior:"smooth"}); });
      item.appendChild(button); list.appendChild(item);
    });
  }

  function renderStep(){
    renderStepNavigation();
    document.getElementById("stepCount").textContent = `${t("step")} ${state.step+1} ${t("of")} ${STEP_COUNT}`;
    document.getElementById("stepTitle").textContent = t("stepTitles")[state.step];
    document.getElementById("stepIntro").textContent = t("stepIntros")[state.step];
    const progress = Math.round(((state.step+1)/STEP_COUNT)*100);
    document.getElementById("progressRing").style.setProperty("--progress",`${progress}%`);
    document.getElementById("progressValue").textContent = `${progress}%`;
    document.getElementById("progressBar").style.width = `${progress}%`;
    const area = document.getElementById("questionArea"); area.replaceChildren();
    STEP_RENDERERS[state.step](area);
    document.getElementById("backBtn").disabled = state.step === 0;
    document.getElementById("nextBtn").textContent = state.step === STEP_COUNT-1 ? t("viewResults") : t("next");
    document.getElementById("formError").hidden = true;
  }

  function renderSection(container, title, rows, extraClass){
    const filtered = rows.filter(row=>row && row.value !== "" && row.value !== null && row.value !== undefined);
    if(!filtered.length) return null;
    const section = node("section", `document-section ${extraClass || ""}`.trim());
    section.appendChild(node("h4", "", title));
    filtered.forEach(row=>{
      const line = node("div", "fact-row");
      line.append(node("span","key",row.key),node("span","value",row.value));
      section.appendChild(line);
    });
    container.appendChild(section); return section;
  }

  function formatQualification(q, code, locale, publicMode){
    let status = q.status || "unknown";
    let text = valueLabel("status",status,locale);
    if(code === "cpc" && q.cpcType && q.cpcType !== "unknown") text += ` · ${valueLabel("cpc",q.cpcType,locale)}`;
    if(code === "adr" && q.specialisations && q.specialisations.length) text += ` · ${q.specialisations.map(value=>valueLabel("adr",value,locale)).join(", ")}`;
    if(!publicMode && q.issuingCountry) text += ` · ${q.issuingCountry}`;
    if(!publicMode && q.validUntil) text += ` · ${t("validUntil",locale)} ${q.validUntil}`;
    return text;
  }

  function publicSections(dto, locale){
    const equipment = dto.experience.equipment.map(item=>`${valueLabel("equipment",item.code,locale)} — ${valueLabel("level",item.level,locale)}`).join("; ");
    const cargo = dto.experience.cargo.map(item=>`${valueLabel("cargo",item.code,locale)} — ${valueLabel("level",item.level,locale)}`).join("; ");
    const languages = dto.workingLanguages.map(item=>`${valueLabel("language",item.code,locale)} — ${valueLabel("languageLevel",item.level,locale)}`).join("; ");
    const baseParts = [valueLabel("country",dto.region.country,locale),dto.region.city].filter(Boolean);
    const routes = [dto.routes.types.map(value=>valueLabel("route",value,locale)).join(", "),dto.routes.regions.map(value=>valueLabel("routeRegion",value,locale)).join(", "),dto.routes.countries.map(value=>valueLabel("country",value,locale)).join(", ")].filter(Boolean).join(" · ");
    const shifts = `${t("dayShift",locale)}: ${valueLabel("pref",dto.preferences.shifts.day,locale)}; ${t("nightShift",locale)}: ${valueLabel("pref",dto.preferences.shifts.night,locale)}; ${t("weekends",locale)}: ${valueLabel("pref",dto.preferences.shifts.weekends,locale)}`;
    const availability = valueLabel("availability",dto.preferences.availability.type,locale) + (dto.preferences.availability.period ? ` · ${dto.preferences.availability.period}` : "");
    return [
      {id:"qualifications",title:t("qualifications",locale),rows:[
        {key:t("ceStatus",locale),value:formatQualification(dto.qualifications.ce,"ce",locale,true)},
        {key:t("cpcStatus",locale),value:formatQualification(dto.qualifications.cpc,"cpc",locale,true)},
        {key:t("tachoStatus",locale),value:formatQualification(dto.qualifications.tachograph,"tachograph",locale,true)},
        {key:t("adrStatus",locale),value:formatQualification(dto.qualifications.adr,"adr",locale,true)}
      ]},
      {id:"experience",title:t("experience",locale),rows:[{key:t("actualExperience",locale),value:valueLabel("experience",dto.experience.ceRange,locale)},{key:t("equipmentRow",locale),value:equipment || t("noData",locale)},{key:t("cargoRow",locale),value:cargo || t("noData",locale)}]},
      {id:"languages",title:t("languages",locale),rows:[{key:t("workingLanguageRow",locale),value:languages || t("noData",locale)}]},
      {id:"preferences",title:t("preferences",locale),rows:[
        {key:t("base",locale),value:baseParts.join(", ") || t("unknown",locale)}, {key:t("routeType",locale),value:routes || t("unknown",locale)},
        {key:t("rotation",locale),value:valueLabel("rotation",dto.preferences.rotation,locale)}, {key:t("homeTime",locale),value:valueLabel("homeTime",dto.preferences.homeTime,locale)},
        {key:t("conditions",locale),value:shifts}, {key:t("overnights",locale),value:valueLabel("overnight",dto.preferences.overnights,locale)}, {key:t("availabilityRow",locale),value:availability},
        {key:t("trainingRow",locale),value:dto.training.map(value=>valueLabel("training",value,locale)).join(", ")}
      ]}
    ];
  }

  function renderPublicDocument(grid,titleElement,dto,locale){
    titleElement.textContent = dto.displayName || "Driver C+E";
    grid.replaceChildren();
    publicSections(dto,locale).forEach(section=>renderSection(grid,section.title,section.rows));
  }

  function cvSections(profile, locale){
    const q = profile.qualifications;
    const equipment = profile.experience.equipment.map(item=>`${valueLabel("equipment",item.code,locale)} — ${valueLabel("level",item.level,locale)}`).join("; ");
    const cargo = profile.experience.cargo.map(item=>`${valueLabel("cargo",item.code,locale)} — ${valueLabel("level",item.level,locale)}`).join("; ");
    const languages = profile.workingLanguages.map(item=>`${valueLabel("language",item.code,locale)} — ${valueLabel("languageLevel",item.level,locale)}`).join("; ");
    const base = [valueLabel("country",profile.preferences.baseCountry,locale),profile.preferences.baseCity].filter(Boolean).join(", ");
    const routes = [profile.preferences.routeTypes.map(value=>valueLabel("route",value,locale)).join(", "),profile.preferences.routeRegions.map(value=>valueLabel("routeRegion",value,locale)).join(", "),profile.preferences.routeCountries.map(value=>valueLabel("country",value,locale)).join(", ")].filter(Boolean).join(" · ");
    const availability = valueLabel("availability",profile.preferences.availability.type || "unknown",locale) + (profile.preferences.availability.date ? ` · ${profile.preferences.availability.date}` : "");
    const shifts = `${t("dayShift",locale)}: ${valueLabel("pref",profile.preferences.shifts.day,locale)}; ${t("nightShift",locale)}: ${valueLabel("pref",profile.preferences.shifts.night,locale)}; ${t("weekends",locale)}: ${valueLabel("pref",profile.preferences.shifts.weekends,locale)}`;
    return [
      {id:"qualifications",title:t("qualifications",locale),rows:[
        {key:t("ceStatus",locale),value:formatQualification({...q.ce,status:model.effectiveQualificationStatus(q.ce)},"ce",locale,false)},
        {key:t("cpcStatus",locale),value:formatQualification({...q.cpc,status:model.effectiveQualificationStatus(q.cpc)},"cpc",locale,false)},
        {key:t("tachoStatus",locale),value:formatQualification({...q.tachograph,status:model.effectiveQualificationStatus(q.tachograph)},"tachograph",locale,false)},
        {key:t("adrStatus",locale),value:formatQualification({...q.adr,status:model.effectiveQualificationStatus(q.adr)},"adr",locale,false)}
      ]},
      {id:"experience",title:t("experience",locale),rows:[{key:t("actualExperience",locale),value:valueLabel("experience",profile.experience.ceRange || "unknown",locale)},{key:t("equipmentRow",locale),value:equipment},{key:t("cargoRow",locale),value:cargo}]},
      {id:"languages",title:t("languages",locale),rows:[{key:t("workingLanguageRow",locale),value:languages}]},
      {id:"preferences",title:t("preferences",locale),rows:[{key:t("base",locale),value:base},{key:t("routeType",locale),value:routes},{key:t("rotation",locale),value:valueLabel("rotation",profile.preferences.rotation || "unknown",locale)},{key:t("homeTime",locale),value:valueLabel("homeTime",profile.preferences.homeTime || "unknown",locale)},{key:t("conditions",locale),value:shifts},{key:t("overnights",locale),value:valueLabel("overnight",profile.preferences.overnights || "unknown",locale)},{key:t("availabilityRow",locale),value:availability},{key:t("trainingRow",locale),value:profile.training.map(value=>valueLabel("training",value,locale)).join(", ")}]},
      {id:"history",title:t("history",locale),history:profile.experience.employmentHistory.filter(entry=>entry.employer || entry.role || entry.startMonth || entry.endMonth || entry.summary)}
    ];
  }

  function selectedCvSections(){ return [...document.querySelectorAll('input[name="cvSection"]:checked')].map(input=>input.value); }

  function renderCV(){
    const locale = document.getElementById("cvLanguage").value || state.lang;
    const selected = selectedCvSections();
    const recipient = document.getElementById("cvRecipient").value.trim();
    state.profile.cvVariant = {locale,sections:selected,recipient};
    localStorage.setItem(PROFILE_KEY,JSON.stringify(model.sanitizeProfile(state.profile)));
    const title = state.profile.privateIdentity.cvName || "Driver C+E";
    document.getElementById("cvDocumentTitle").textContent = `${title} — C+E`;
    const recipientLine = document.getElementById("cvRecipientLine"); recipientLine.hidden = !recipient; recipientLine.textContent = recipient ? `${t("recipientRow",locale)}: ${recipient}` : "";
    document.getElementById("cvDate").textContent = `${t("generated",locale)}: ${model.localDateString()}`;
    const grid = document.getElementById("cvGrid"); grid.replaceChildren();
    cvSections(state.profile,locale).filter(section=>selected.includes(section.id)).forEach(section=>{
      if(section.id === "history"){
        if(!section.history.length) return;
        const block = node("section","document-section full"); block.appendChild(node("h4","",section.title));
        section.history.forEach(entry=>{
          const item = node("div","history-entry");
          item.appendChild(node("strong","",[entry.role,entry.employer].filter(Boolean).join(" — ") || t("history",locale)));
          item.appendChild(node("span","",[entry.startMonth,entry.endMonth].filter(Boolean).join(" — ")));
          if(entry.summary) item.appendChild(node("p","",entry.summary));
          block.appendChild(item);
        });
        grid.appendChild(block);
      }else renderSection(grid,section.title,section.rows);
    });
    renderSection(grid,t("contact",locale),[
      {key:t("contact",locale),value:[valueLabel("contact",state.profile.privateIdentity.contact.type,locale),state.profile.privateIdentity.contact.value].filter(Boolean).join(": ")},
      {key:t("bestTime",locale),value:state.profile.privateIdentity.contact.bestTime}
    ],"full");
    const validation = model.validateAddressedCV(state.profile);
    const sectionNames = selected.map(id=>t(id,locale)).join(", ");
    document.getElementById("exportSummary").textContent = validation.valid
      ? `${t("cvReady")} · ${t("language",locale)}: ${locale.toUpperCase()} · ${t("sectionsSelected",locale)}: ${sectionNames}${recipient ? ` · ${t("recipientRow",locale)}: ${recipient}` : ""}`
      : `${t("cvNeedsContact")} · ${t("language",locale)}: ${locale.toUpperCase()} · ${t("sectionsSelected",locale)}: ${sectionNames}`;
  }

  function renderOutputs(){
    const dto = model.buildPublicProfile(state.profile);
    renderPublicDocument(document.getElementById("publicGrid"),document.getElementById("publicDocumentTitle"),dto,state.lang);
    renderCV();
  }

  function documentText(container,title){
    const lines = [title];
    container.querySelectorAll(".document-section").forEach(section=>{
      const heading = section.querySelector("h4");
      if(heading) lines.push(`\n${heading.textContent}`);
      section.querySelectorAll(".fact-row").forEach(row=>{
        const key = row.querySelector(".key"); const value = row.querySelector(".value");
        if(key && value) lines.push(`${key.textContent}: ${value.textContent}`);
      });
      section.querySelectorAll(".history-entry").forEach(entry=>lines.push(entry.innerText.trim()));
    });
    return lines.join("\n");
  }

  async function copyText(text){
    try{ await navigator.clipboard.writeText(text); toast(t("copied")); return true; }
    catch(error){ toast(t("copyFailed")); return false; }
  }

  function ensureDraft(){
    const validation = model.validateDraft(state.profile);
    if(validation.valid) return true;
    toast(t("draftIncomplete"));
    const firstIncomplete = [0,1,2,3,4].find(index=>!model.validateStep(state.profile,index).valid);
    if(firstIncomplete !== undefined){ state.step=firstIncomplete; renderStep(); document.getElementById("builder").scrollIntoView({behavior:"smooth"}); }
    return false;
  }

  function setOutputTab(tab){
    const publicSelected = tab === "public";
    document.getElementById("publicPanel").hidden = !publicSelected;
    document.getElementById("cvPanel").hidden = publicSelected;
    document.getElementById("publicTab").setAttribute("aria-selected",String(publicSelected));
    document.getElementById("cvTab").setAttribute("aria-selected",String(!publicSelected));
    renderCV();
  }

  function renderShared(){
    const editor = document.getElementById("editorView");
    const intro = document.getElementById("intro");
    const shared = document.getElementById("sharedView");
    if(!state.sharedProfile){ editor.hidden=false; intro.hidden=false; shared.hidden=true; return; }
    editor.hidden=true; intro.hidden=true; shared.hidden=false;
    document.getElementById("sharedTitle").textContent = state.sharedProfile.displayName || "Driver C+E";
    renderPublicDocument(document.getElementById("sharedGrid"),document.getElementById("sharedDocumentTitle"),state.sharedProfile,state.lang);
  }

  document.getElementById("langSelect").addEventListener("change",event=>{
    state.lang = event.target.value;
    localStorage.setItem(LANG_KEY,state.lang);
    applyTranslations();
    renderStep(); renderOutputs(); renderShared();
  });

  document.getElementById("stepForm").addEventListener("submit",event=>{
    event.preventDefault();
    const validation = model.validateStep(state.profile,state.step);
    if(!validation.valid){ const error=document.getElementById("formError"); error.textContent=t("completeStep"); error.hidden=false; return; }
    if(state.step < STEP_COUNT-1){ state.step += 1; localStorage.setItem(STEP_KEY,String(state.step)); renderStep(); document.getElementById("builder").scrollIntoView({behavior:"smooth"}); }
    else{ renderOutputs(); document.getElementById("outputs").scrollIntoView({behavior:"smooth"}); }
  });
  document.getElementById("backBtn").addEventListener("click",()=>{ if(state.step>0){state.step-=1;localStorage.setItem(STEP_KEY,String(state.step));renderStep();} });
  document.getElementById("publicTab").addEventListener("click",()=>setOutputTab("public"));
  document.getElementById("cvTab").addEventListener("click",()=>setOutputTab("cv"));
  document.getElementById("cvLanguage").addEventListener("change",renderCV);
  document.getElementById("cvRecipient").addEventListener("input",renderCV);
  document.querySelectorAll('input[name="cvSection"]').forEach(input=>input.addEventListener("change",renderCV));
  document.getElementById("copyPublicTextBtn").addEventListener("click",()=>{
    if(!ensureDraft()) return;
    copyText(documentText(document.getElementById("publicGrid"),document.getElementById("publicDocumentTitle").textContent));
  });
  document.getElementById("copyPreviewLinkBtn").addEventListener("click",()=>{
    if(!ensureDraft()) return;
    const url = new URL(location.origin + location.pathname);
    url.searchParams.set(SHARE_PARAM,model.encodePublicProfile(model.buildPublicProfile(state.profile)));
    url.hash = "public-profile";
    copyText(url.toString()).then(success=>{if(success) toast(t("previewReady"));});
  });
  document.getElementById("copyCvBtn").addEventListener("click",()=>{
    if(!model.validateAddressedCV(state.profile).valid){toast(t("cvIncomplete"));state.step=5;renderStep();document.getElementById("builder").scrollIntoView({behavior:"smooth"});return;}
    copyText(documentText(document.getElementById("cvGrid"),document.getElementById("cvDocumentTitle").textContent));
  });
  document.getElementById("printCvBtn").addEventListener("click",()=>{
    if(!model.validateAddressedCV(state.profile).valid){toast(t("cvIncomplete"));state.step=5;renderStep();document.getElementById("builder").scrollIntoView({behavior:"smooth"});return;}
    toast(t("printHint")); setTimeout(()=>window.print(),250);
  });
  document.getElementById("deleteDraftBtn").addEventListener("click",()=>{
    if(!window.confirm(t("deleteConfirm"))) return;
    localStorage.removeItem(PROFILE_KEY); localStorage.removeItem(LEGACY_KEY); localStorage.removeItem(STEP_KEY);
    state.profile=model.createEmptyProfile(state.lang);state.step=0;renderStep();renderOutputs();toast(t("deleted"));
  });
  document.getElementById("buildOwnBtn").addEventListener("click",()=>{
    const url = new URL(location.origin + location.pathname); url.hash="builder"; history.replaceState(null,"",url);
    state.sharedProfile=null; renderShared(); renderStep(); renderOutputs(); document.getElementById("builder").scrollIntoView({behavior:"smooth"});
  });

  applyTranslations();
  document.getElementById("cvLanguage").value = state.profile.cvVariant.locale || state.lang;
  document.getElementById("cvRecipient").value = state.profile.cvVariant.recipient || "";
  document.querySelectorAll('input[name="cvSection"]').forEach(input=>{input.checked = state.profile.cvVariant.sections.includes(input.value);});
  renderStep(); renderOutputs(); renderShared();
  document.getElementById("saveState").textContent = migrationNotice ? t("migrated") : t("saved");
})();
