(function initRoadlineCVModel(root, factory){
  const api = factory();
  if(typeof module === "object" && module.exports) module.exports = api;
  root.RoadlineCVModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createRoadlineCVModel(){
  "use strict";

  const SCHEMA_VERSION = 2;
  const PROFESSION_CODE = "truck_driver_ce";
  const SHARE_VERSION = 3;
  const LEGACY_SHARE_VERSIONS = new Set([1, 2]);
  const LOCALES = new Set(["ru", "uk", "en", "pl"]);
  const QUALIFICATION_STATUSES = new Set(["", "valid", "expired", "pending", "absent", "unknown"]);
  const EXPERIENCE_RANGES = new Set(["", "none", "lt_6m", "6_12m", "1_2y", "2_5y", "5y_plus"]);
  const EXPERIENCE_LEVELS = new Set(["unknown", "learning", "assisted", "independent"]);
  const EQUIPMENT_CODES = new Set([
    "tautliner", "reefer", "sea_container", "bdf", "hook_lift", "tanker",
    "silo", "car_carrier", "low_bed", "walking_floor"
  ]);
  const CARGO_CODES = new Set(["general", "refrigerated", "food_liquid", "dangerous_goods", "vehicles", "dry_bulk"]);
  const LANGUAGE_CODES = new Set(["ru", "uk", "pl", "en", "de", "nl", "fr"]);
  const LANGUAGE_LEVELS = new Set(["basic", "operational", "confident", "native"]);
  const ROUTE_TYPES = new Set(["local", "domestic", "international", "any"]);
  const ROUTE_REGIONS = new Set(["benelux", "scandinavia", "europe"]);
  const ROTATIONS = new Set(["", "daily", "weekends", "2_2", "3_1", "4_1", "negotiable"]);
  const HOME_TIME = new Set(["", "daily", "weekly", "rotation", "negotiable"]);
  const PREFERENCE_STATES = new Set(["", "accepted", "negotiable", "excluded"]);
  const OVERNIGHTS = new Set(["", "none", "1_2", "3_5", "longer", "negotiable"]);
  const AVAILABILITY_TYPES = new Set(["", "now", "2_weeks", "4_weeks", "date", "not_looking"]);
  const ADR_SPECIALISATIONS = new Set(["base", "tank", "class_1", "class_7"]);
  const CPC_TYPES = new Set(["", "eu_code_95", "uk_national", "uk_international", "other", "unknown"]);
  const TRAINING_CODES = new Set(["adr", "equipment", "routes"]);
  const CV_SECTIONS = new Set(["qualifications", "experience", "languages", "preferences", "history"]);
  const CONTACT_TYPES = new Set(["", "phone", "email", "messenger"]);

  function localDateString(date){
    const value = date instanceof Date ? date : new Date(date || Date.now());
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isoNow(now){
    const value = now instanceof Date ? now : new Date(now || Date.now());
    return Number.isNaN(value.getTime()) ? new Date().toISOString() : value.toISOString();
  }

  function cleanString(value, maxLength){
    if(typeof value !== "string") return "";
    return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
  }

  function containsContactData(value, options = {}){
    const text = cleanString(value, 240);
    if(!text) return false;
    const digitCount = (text.match(/\d/g) || []).length;
    const urlPattern = /(?:https?:\/\/|www\.|(?:t|wa)\.me\/|telegram\.me\/|(?:[a-z0-9-]+\.)+(?:[a-z]{2,24}|рф|укр|бел|рус)(?:[/?#:]|$))/i;
    const contactWordPattern = /(?:^|[\s,;:|])(?:e-?mail|mail|phone|tel(?:ephone)?\.?|whats?app|telegram|signal|viber|messenger|contact|kontakt|telefon|телефон|тел\.?|почт[аы]|емейл|контакт|телеграм|вайбер|ватсап|зв['’]?язок)(?=$|[\s,;:|])/i;
    const obfuscatedEmailPattern = /(?:\[at\]|\(at\)|\sat\s).*(?:\[dot\]|\(dot\)|\sdot\s)/i;
    const exactAddressPattern = /(?:^|[\s,;])(?:ul(?:ica)?\.?|aleja|street|road|avenue|улица|ул\.?|вулиця|вул\.?)\s+\S+/i;
    const postalCodePattern = /\b\d{2}[- ]\d{3}\b/;
    return text.includes("@") || digitCount >= 6 || urlPattern.test(text) || contactWordPattern.test(text)
      || obfuscatedEmailPattern.test(text)
      || (options.rejectAddress === true && (/\d/.test(text) || exactAddressPattern.test(text) || postalCodePattern.test(text)));
  }

  function cleanPublicText(value, maxLength, options = {}){
    const text = cleanString(value, maxLength);
    return containsContactData(text, options) ? "" : text;
  }

  function cleanPublicDisplayName(value){
    return cleanPublicText(value, 40);
  }

  function cleanDate(value){
    const text = cleanString(value, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
  }

  function enumValue(value, allowed, fallback = ""){
    return allowed.has(value) ? value : fallback;
  }

  function cleanCountryCode(value){
    const code = cleanString(value, 16).toUpperCase();
    return /^[A-Z]{2}$/.test(code) ? code : "";
  }

  function uniqueEnums(values, allowed, limit = 30){
    if(!Array.isArray(values)) return [];
    return [...new Set(values.filter(value=>allowed.has(value)))].slice(0, limit);
  }

  function emptyQualification(type){
    return { type, status:"", issuingCountry:"", validUntil:"", scope:"", selfDeclared:true };
  }

  function createEmptyProfile(locale = "en", now){
    const safeLocale = LOCALES.has(locale) ? locale : "en";
    return {
      schemaVersion: SCHEMA_VERSION,
      professionCode: PROFESSION_CODE,
      locale: safeLocale,
      updatedAt: isoNow(now),
      publicIdentity: { displayName:"" },
      qualifications: {
        ce: emptyQualification("ce_licence"),
        cpc: { ...emptyQualification("driver_cpc"), cpcType:"" },
        tachograph: emptyQualification("tachograph_card"),
        adr: { ...emptyQualification("adr"), specialisations:[] }
      },
      experience: {
        ceRange:"",
        equipmentAnswer:"",
        equipment:[],
        cargo:[],
        employmentHistory:[]
      },
      workingLanguages:[],
      preferences: {
        baseCountry:"",
        baseCity:"",
        routeTypes:[],
        routeCountries:[],
        routeRegions:[],
        rotation:"",
        homeTime:"",
        shifts:{ day:"", night:"", weekends:"" },
        overnights:"",
        availability:{ type:"", date:"" }
      },
      training:[],
      privateIdentity: {
        cvName:"",
        contact:{ type:"", value:"", bestTime:"" }
      },
      cvVariant: {
        locale:safeLocale,
        sections:["qualifications", "experience", "languages", "preferences"],
        recipient:""
      },
      migration:null
    };
  }

  function sanitizeQualification(raw, type){
    const value = raw && typeof raw === "object" ? raw : {};
    return {
      type,
      status:enumValue(value.status, QUALIFICATION_STATUSES),
      issuingCountry:cleanString(value.issuingCountry, 2).toUpperCase(),
      validUntil:cleanDate(value.validUntil),
      scope:cleanString(value.scope, 40),
      selfDeclared:true
    };
  }

  function sanitizeProfile(raw, options = {}){
    const value = raw && typeof raw === "object" ? raw : {};
    const locale = LOCALES.has(value.locale) ? value.locale : (LOCALES.has(options.locale) ? options.locale : "en");
    const profile = createEmptyProfile(locale, options.now);
    profile.updatedAt = typeof value.updatedAt === "string" && !Number.isNaN(Date.parse(value.updatedAt))
      ? value.updatedAt
      : profile.updatedAt;
    profile.publicIdentity.displayName = cleanPublicDisplayName(value.publicIdentity && value.publicIdentity.displayName);

    const qualifications = value.qualifications && typeof value.qualifications === "object" ? value.qualifications : {};
    profile.qualifications.ce = sanitizeQualification(qualifications.ce, "ce_licence");
    profile.qualifications.cpc = {
      ...sanitizeQualification(qualifications.cpc, "driver_cpc"),
      cpcType:enumValue(qualifications.cpc && qualifications.cpc.cpcType, CPC_TYPES)
    };
    profile.qualifications.tachograph = sanitizeQualification(qualifications.tachograph, "tachograph_card");
    profile.qualifications.adr = {
      ...sanitizeQualification(qualifications.adr, "adr"),
      specialisations:uniqueEnums(qualifications.adr && qualifications.adr.specialisations, ADR_SPECIALISATIONS, 4)
    };

    const experience = value.experience && typeof value.experience === "object" ? value.experience : {};
    profile.experience.ceRange = enumValue(experience.ceRange, EXPERIENCE_RANGES);
    profile.experience.equipmentAnswer = experience.equipmentAnswer === "none" || experience.equipmentAnswer === "selected"
      ? experience.equipmentAnswer
      : "";
    if(Array.isArray(experience.equipment)){
      const seen = new Set();
      profile.experience.equipment = experience.equipment.reduce((items, item)=>{
        if(!item || typeof item !== "object" || !EQUIPMENT_CODES.has(item.code) || seen.has(item.code)) return items;
        seen.add(item.code);
        items.push({ code:item.code, level:enumValue(item.level, EXPERIENCE_LEVELS, "unknown") });
        return items;
      }, []).slice(0, 12);
    }
    if(profile.experience.equipmentAnswer === "none") profile.experience.equipment = [];
    if(Array.isArray(experience.cargo)){
      const seenCargo = new Set();
      profile.experience.cargo = experience.cargo.reduce((items, item)=>{
        if(!item || typeof item !== "object" || !CARGO_CODES.has(item.code) || seenCargo.has(item.code)) return items;
        seenCargo.add(item.code);
        items.push({ code:item.code, level:enumValue(item.level, EXPERIENCE_LEVELS, "unknown") });
        return items;
      }, []).slice(0, 6);
    }
    if(profile.experience.equipmentAnswer === "none") profile.experience.cargo = [];
    if(Array.isArray(experience.employmentHistory)){
      profile.experience.employmentHistory = experience.employmentHistory.slice(0, 5).map(item=>({
        employer:cleanString(item && item.employer, 80),
        role:cleanString(item && item.role, 80),
        startMonth:/^\d{4}-\d{2}$/.test(item && item.startMonth || "") ? item.startMonth : "",
        endMonth:/^\d{4}-\d{2}$/.test(item && item.endMonth || "") ? item.endMonth : "",
        summary:cleanString(item && item.summary, 240)
      }));
    }

    if(Array.isArray(value.workingLanguages)){
      const seen = new Set();
      profile.workingLanguages = value.workingLanguages.reduce((items, item)=>{
        if(!item || typeof item !== "object" || !LANGUAGE_CODES.has(item.code) || seen.has(item.code)) return items;
        seen.add(item.code);
        items.push({ code:item.code, level:enumValue(item.level, LANGUAGE_LEVELS, "basic") });
        return items;
      }, []).slice(0, 7);
    }

    const preferences = value.preferences && typeof value.preferences === "object" ? value.preferences : {};
    profile.preferences.baseCountry = cleanCountryCode(preferences.baseCountry);
    profile.preferences.baseCity = cleanString(preferences.baseCity, 80);
    profile.preferences.routeTypes = uniqueEnums(preferences.routeTypes, ROUTE_TYPES, 4);
    profile.preferences.routeCountries = Array.isArray(preferences.routeCountries)
      ? [...new Set(preferences.routeCountries.map(cleanCountryCode).filter(Boolean))].slice(0, 20)
      : [];
    profile.preferences.routeRegions = uniqueEnums(preferences.routeRegions, ROUTE_REGIONS, 3);
    profile.preferences.rotation = enumValue(preferences.rotation, ROTATIONS);
    profile.preferences.homeTime = enumValue(preferences.homeTime, HOME_TIME);
    const shifts = preferences.shifts && typeof preferences.shifts === "object" ? preferences.shifts : {};
    profile.preferences.shifts = {
      day:enumValue(shifts.day, PREFERENCE_STATES),
      night:enumValue(shifts.night, PREFERENCE_STATES),
      weekends:enumValue(shifts.weekends, PREFERENCE_STATES)
    };
    profile.preferences.overnights = enumValue(preferences.overnights, OVERNIGHTS);
    const availability = preferences.availability && typeof preferences.availability === "object" ? preferences.availability : {};
    profile.preferences.availability = {
      type:enumValue(availability.type, AVAILABILITY_TYPES),
      date:cleanDate(availability.date)
    };
    if(profile.preferences.availability.type !== "date") profile.preferences.availability.date = "";

    profile.training = uniqueEnums(value.training, TRAINING_CODES, 3);
    const privateIdentity = value.privateIdentity && typeof value.privateIdentity === "object" ? value.privateIdentity : {};
    const contact = privateIdentity.contact && typeof privateIdentity.contact === "object" ? privateIdentity.contact : {};
    profile.privateIdentity = {
      cvName:cleanString(privateIdentity.cvName, 80),
      contact:{
        type:enumValue(contact.type, CONTACT_TYPES),
        value:cleanString(contact.value, 120),
        bestTime:cleanString(contact.bestTime, 80)
      }
    };

    const cvVariant = value.cvVariant && typeof value.cvVariant === "object" ? value.cvVariant : {};
    profile.cvVariant = {
      locale:LOCALES.has(cvVariant.locale) ? cvVariant.locale : locale,
      sections:uniqueEnums(cvVariant.sections, CV_SECTIONS, 5),
      recipient:cleanString(cvVariant.recipient, 100)
    };
    if(!profile.cvVariant.sections.length) profile.cvVariant.sections = ["qualifications", "experience", "languages", "preferences"];
    const migration = value.migration && typeof value.migration === "object" ? value.migration : null;
    if(migration && migration.source === "roadline_cv_answers_v1"){
      const legacy = migration.legacyAnswers && typeof migration.legacyAnswers === "object" ? migration.legacyAnswers : {};
      const legacyWorkTypes = new Set(["intl", "local"]);
      const legacyExperience = new Set(["0-1", "1-3", "3-5", "5+"]);
      const legacyTrailers = new Set(["tautliner", "reefer", "container", "tanker", "carcarrier", "lowbed"]);
      const legacyRegions = new Set(["PL", "DE", "FR", "BENELUX", "SCAN", "EU"]);
      const legacySchedules = new Set(["2/2", "3/1", "4/1", "weekends", "any"]);
      const legacyDocuments = new Set(["code95", "card", "adr"]);
      const legacyEuStatuses = new Set(["euCitizen", "karta", "visa", "process"]);
      profile.migration = {
        source:"roadline_cv_answers_v1",
        legacyAnswers:{
          workType:enumValue(legacy.workType, legacyWorkTypes),
          experience:enumValue(legacy.experience, legacyExperience),
          trailers:uniqueEnums(legacy.trailers, legacyTrailers, 6),
          regions:uniqueEnums(legacy.regions, legacyRegions, 6),
          schedule:enumValue(legacy.schedule, legacySchedules),
          documents:uniqueEnums(legacy.documents, legacyDocuments, 3),
          statusEU:enumValue(legacy.statusEU, legacyEuStatuses)
        }
      };
    }
    return profile;
  }

  const legacyExperienceMap = {
    "0-1":"lt_6m",
    "1-3":"1_2y",
    "3-5":"2_5y",
    "5+":"5y_plus"
  };
  const legacyEquipmentMap = {
    tautliner:"tautliner",
    reefer:"reefer",
    container:"sea_container",
    tanker:"tanker",
    carcarrier:"car_carrier",
    lowbed:"low_bed"
  };

  function migrateLegacyAnswers(answers, options = {}){
    const raw = answers && typeof answers === "object" ? answers : {};
    const profile = createEmptyProfile(options.locale || "en", options.now);
    profile.migration = {
      source:"roadline_cv_answers_v1",
      legacyAnswers:{
        workType:raw.workType,
        experience:raw.experience,
        trailers:Array.isArray(raw.trailers) ? raw.trailers : [],
        regions:Array.isArray(raw.regions) ? raw.regions : [],
        schedule:raw.schedule,
        documents:Array.isArray(raw.documents) ? raw.documents : [],
        statusEU:raw.statusEU
      }
    };
    // A legacy contact name remains private. It must not become a public alias.
    profile.publicIdentity.displayName = "";
    profile.privateIdentity.cvName = cleanString(raw.contactName, 80);
    if(raw.contactPhone){
      profile.privateIdentity.contact.type = "phone";
      profile.privateIdentity.contact.value = cleanString(raw.contactPhone, 120);
    }

    profile.qualifications.ce.status = "unknown";
    profile.qualifications.cpc.status = "unknown";
    profile.qualifications.tachograph.status = "unknown";
    profile.qualifications.adr.status = "unknown";
    if(Array.isArray(raw.documents)){
      // The old form recorded a declaration of possession, not validity.
      // Keep status unknown until the driver supplies a current status/date.
      if(raw.documents.includes("code95")) profile.qualifications.cpc.scope = "legacy_declared";
      if(raw.documents.includes("card")) profile.qualifications.tachograph.scope = "legacy_declared";
      if(raw.documents.includes("adr")) profile.qualifications.adr.scope = "legacy_declared";
    }

    profile.experience.ceRange = legacyExperienceMap[raw.experience] || "";
    const legacyEquipment = Array.isArray(raw.trailers)
      ? raw.trailers.map(code=>legacyEquipmentMap[code]).filter(Boolean)
      : [];
    profile.experience.equipmentAnswer = legacyEquipment.length ? "selected" : "";
    profile.experience.equipment = [...new Set(legacyEquipment)].map(code=>({ code, level:"unknown" }));

    if(raw.workType === "intl") profile.preferences.routeTypes = ["international"];
    if(raw.workType === "local") profile.preferences.routeTypes = ["domestic"];
    const regionMap = { PL:"PL", DE:"DE", FR:"FR" };
    const routeRegionMap = { BENELUX:"benelux", SCAN:"scandinavia", EU:"europe" };
    if(Array.isArray(raw.regions)){
      profile.preferences.routeCountries = [...new Set(raw.regions.map(code=>regionMap[code]).filter(Boolean))];
      profile.preferences.routeRegions = [...new Set(raw.regions.map(code=>routeRegionMap[code]).filter(Boolean))];
    }
    const rotationMap = { "2/2":"2_2", "3/1":"3_1", "4/1":"4_1", weekends:"weekends", any:"negotiable" };
    profile.preferences.rotation = rotationMap[raw.schedule] || "";
    // Do not infer overnights, shifts, home time, or current work rights from legacy fields.
    // The original EU status remains only in local migration metadata for lossless review.
    return sanitizeProfile(profile, options);
  }

  function backfillLegacyMigration(rawProfile, answers, options = {}){
    const profile = sanitizeProfile(rawProfile, options);
    if(profile.migration) return profile;
    const migrated = migrateLegacyAnswers(answers, options);
    profile.migration = migrated.migration;
    profile.preferences.routeRegions = [...new Set([
      ...profile.preferences.routeRegions,
      ...migrated.preferences.routeRegions
    ])];
    return sanitizeProfile(profile, options);
  }

  function effectiveQualificationStatus(qualification, today = localDateString()){
    if(!qualification || typeof qualification !== "object") return "unknown";
    if(qualification.status === "valid" && qualification.validUntil && qualification.validUntil < today) return "expired";
    return qualification.status || "unknown";
  }

  function publicAvailability(availability){
    if(!availability || !AVAILABILITY_TYPES.has(availability.type) || !availability.type) return { type:"unknown", period:"" };
    return {
      type:availability.type,
      period:availability.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(availability.date || "")
        ? availability.date.slice(0, 7)
        : ""
    };
  }

  function buildPublicProfile(rawProfile, options = {}){
    const profile = sanitizeProfile(rawProfile, options);
    const today = options.today || localDateString(options.now);
    const publicCity = cleanPublicText(profile.preferences.baseCity, 80, { rejectAddress:true });
    return {
      publicProfileVersion:1,
      professionCode:PROFESSION_CODE,
      displayName:profile.publicIdentity.displayName || "Driver C+E",
      updatedOn:(profile.updatedAt || "").slice(0, 10),
      qualifications:{
        ce:{ status:effectiveQualificationStatus(profile.qualifications.ce, today) },
        cpc:{
          status:effectiveQualificationStatus(profile.qualifications.cpc, today),
          cpcType:profile.qualifications.cpc.cpcType || "unknown"
        },
        tachograph:{ status:effectiveQualificationStatus(profile.qualifications.tachograph, today) },
        adr:{
          status:effectiveQualificationStatus(profile.qualifications.adr, today),
          specialisations:[...profile.qualifications.adr.specialisations]
        }
      },
      experience:{
        ceRange:profile.experience.ceRange || "unknown",
        equipment:profile.experience.equipment.map(item=>({ code:item.code, level:item.level })),
        cargo:profile.experience.cargo.map(item=>({ code:item.code, level:item.level }))
      },
      workingLanguages:profile.workingLanguages.map(item=>({ code:item.code, level:item.level })),
      region:{ country:cleanCountryCode(profile.preferences.baseCountry), city:publicCity },
      routes:{
        types:[...profile.preferences.routeTypes],
        countries:[...profile.preferences.routeCountries],
        regions:[...profile.preferences.routeRegions]
      },
      preferences:{
        rotation:profile.preferences.rotation || "unknown",
        homeTime:profile.preferences.homeTime || "unknown",
        shifts:{ ...profile.preferences.shifts },
        overnights:profile.preferences.overnights || "unknown",
        availability:publicAvailability(profile.preferences.availability)
      },
      training:[...profile.training]
    };
  }

  function sanitizePublicProfile(raw){
    const value = raw && typeof raw === "object" ? raw : {};
    const result = buildPublicProfile(createEmptyProfile("en"));
    result.displayName = cleanPublicDisplayName(value.displayName) || "Driver C+E";
    result.updatedOn = cleanDate(value.updatedOn);
    const q = value.qualifications && typeof value.qualifications === "object" ? value.qualifications : {};
    ["ce", "tachograph"].forEach(code=>{
      result.qualifications[code].status = enumValue(q[code] && q[code].status, QUALIFICATION_STATUSES, "unknown") || "unknown";
    });
    result.qualifications.cpc.status = enumValue(q.cpc && q.cpc.status, QUALIFICATION_STATUSES, "unknown") || "unknown";
    result.qualifications.cpc.cpcType = enumValue(q.cpc && q.cpc.cpcType, CPC_TYPES, "unknown") || "unknown";
    result.qualifications.adr.status = enumValue(q.adr && q.adr.status, QUALIFICATION_STATUSES, "unknown") || "unknown";
    result.qualifications.adr.specialisations = uniqueEnums(q.adr && q.adr.specialisations, ADR_SPECIALISATIONS, 4);

    const experience = value.experience && typeof value.experience === "object" ? value.experience : {};
    result.experience.ceRange = enumValue(experience.ceRange, new Set([...EXPERIENCE_RANGES, "unknown"]), "unknown") || "unknown";
    result.experience.equipment = Array.isArray(experience.equipment)
      ? experience.equipment.filter(item=>item && EQUIPMENT_CODES.has(item.code)).slice(0, 12).map(item=>({
          code:item.code,
          level:enumValue(item.level, EXPERIENCE_LEVELS, "unknown")
        }))
      : [];
    result.experience.cargo = Array.isArray(experience.cargo)
      ? experience.cargo.filter(item=>item && CARGO_CODES.has(item.code)).slice(0, 6).map(item=>({
          code:item.code,
          level:enumValue(item.level, EXPERIENCE_LEVELS, "unknown")
        }))
      : [];
    result.workingLanguages = Array.isArray(value.workingLanguages)
      ? value.workingLanguages.filter(item=>item && LANGUAGE_CODES.has(item.code)).slice(0, 7).map(item=>({
          code:item.code,
          level:enumValue(item.level, LANGUAGE_LEVELS, "basic")
        }))
      : [];
    const region = value.region && typeof value.region === "object" ? value.region : {};
    result.region = {
      country:cleanCountryCode(region.country),
      city:cleanPublicText(region.city, 80, { rejectAddress:true })
    };
    const routes = value.routes && typeof value.routes === "object" ? value.routes : {};
    result.routes = {
      types:uniqueEnums(routes.types, ROUTE_TYPES, 4),
      countries:Array.isArray(routes.countries)
        ? [...new Set(routes.countries.map(cleanCountryCode).filter(Boolean))].slice(0, 20)
        : [],
      regions:uniqueEnums(routes.regions, ROUTE_REGIONS, 3)
    };
    const preferences = value.preferences && typeof value.preferences === "object" ? value.preferences : {};
    const shifts = preferences.shifts && typeof preferences.shifts === "object" ? preferences.shifts : {};
    result.preferences = {
      rotation:enumValue(preferences.rotation, new Set([...ROTATIONS, "unknown"]), "unknown") || "unknown",
      homeTime:enumValue(preferences.homeTime, new Set([...HOME_TIME, "unknown"]), "unknown") || "unknown",
      shifts:{
        day:enumValue(shifts.day, new Set([...PREFERENCE_STATES, "unknown"]), "unknown") || "unknown",
        night:enumValue(shifts.night, new Set([...PREFERENCE_STATES, "unknown"]), "unknown") || "unknown",
        weekends:enumValue(shifts.weekends, new Set([...PREFERENCE_STATES, "unknown"]), "unknown") || "unknown"
      },
      overnights:enumValue(preferences.overnights, new Set([...OVERNIGHTS, "unknown"]), "unknown") || "unknown",
      availability:publicAvailability(preferences.availability)
    };
    result.training = uniqueEnums(value.training, TRAINING_CODES, 3);
    return result;
  }

  function bytesToBase64(bytes){
    if(typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
    let binary = "";
    bytes.forEach(byte=>{ binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function base64ToBytes(value){
    if(typeof Buffer !== "undefined") return Uint8Array.from(Buffer.from(value, "base64"));
    const binary = atob(value);
    return Uint8Array.from(binary, char=>char.charCodeAt(0));
  }

  function encodePublicProfile(publicProfile){
    const json = JSON.stringify({ v:SHARE_VERSION, publicProfile:sanitizePublicProfile(publicProfile) });
    return bytesToBase64(new TextEncoder().encode(json)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decodeSharedProfile(value, options = {}){
    try{
      if(typeof value !== "string" || !value || value.length > 24000) return null;
      const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      const data = JSON.parse(new TextDecoder().decode(base64ToBytes(padded)));
      if(data && data.v === SHARE_VERSION && data.publicProfile){
        return { version:SHARE_VERSION, wasLegacy:false, publicProfile:sanitizePublicProfile(data.publicProfile) };
      }
      if(data && LEGACY_SHARE_VERSIONS.has(data.v) && data.answers && typeof data.answers === "object"){
        const migrated = migrateLegacyAnswers(data.answers, options);
        return { version:data.v, wasLegacy:true, publicProfile:buildPublicProfile(migrated, options) };
      }
      return null;
    }catch(error){
      return null;
    }
  }

  function validateDraft(rawProfile){
    const profile = sanitizeProfile(rawProfile);
    const errors = [];
    if(!profile.qualifications.ce.status) errors.push("qualification_ce");
    return { valid:errors.length === 0, errors };
  }

  function validateProfessionalProfile(rawProfile){
    const profile = sanitizeProfile(rawProfile);
    const errors = [];
    if(!profile.qualifications.ce.status) errors.push("qualification_ce");
    if(!profile.qualifications.cpc.status) errors.push("qualification_cpc");
    if(!profile.qualifications.tachograph.status) errors.push("qualification_tachograph");
    if(!profile.experience.ceRange) errors.push("experience_range");
    if(!profile.experience.equipmentAnswer) errors.push("equipment_answer");
    if(profile.experience.equipmentAnswer === "selected" && !profile.experience.equipment.length) errors.push("equipment_selection");
    if(!profile.workingLanguages.length) errors.push("working_languages");
    if(!profile.preferences.baseCountry) errors.push("base_country");
    if(!profile.preferences.routeTypes.length) errors.push("route_types");
    if(!profile.preferences.rotation) errors.push("rotation");
    if(!profile.preferences.homeTime) errors.push("home_time");
    if(!profile.preferences.shifts.day || !profile.preferences.shifts.night || !profile.preferences.shifts.weekends) errors.push("shifts");
    if(!profile.preferences.overnights) errors.push("overnights");
    if(!profile.preferences.availability.type) errors.push("availability");
    if(profile.preferences.availability.type === "date" && !profile.preferences.availability.date) errors.push("availability_date");
    return { valid:errors.length === 0, errors };
  }

  function validateAddressedCV(rawProfile){
    const profile = sanitizeProfile(rawProfile);
    const result = validateProfessionalProfile(profile);
    const errors = [...result.errors];
    if(profile.privateIdentity.cvName.length < 2) errors.push("cv_name");
    const contact = profile.privateIdentity.contact;
    if(!contact.type || !contact.value) errors.push("contact");
    if(contact.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value)) errors.push("contact_email");
    if(contact.type === "phone" && contact.value.replace(/\D/g, "").length < 6) errors.push("contact_phone");
    return { valid:errors.length === 0, errors:[...new Set(errors)] };
  }

  function validateStep(rawProfile, step){
    const profile = sanitizeProfile(rawProfile);
    const errors = [];
    if(step === 0){
      if(!profile.qualifications.ce.status) errors.push("qualification_ce");
      if(!profile.qualifications.cpc.status) errors.push("qualification_cpc");
      if(!profile.qualifications.tachograph.status) errors.push("qualification_tachograph");
    }
    if(step === 1){
      if(!profile.experience.ceRange) errors.push("experience_range");
      if(!profile.experience.equipmentAnswer) errors.push("equipment_answer");
      if(profile.experience.equipmentAnswer === "selected" && !profile.experience.equipment.length) errors.push("equipment_selection");
    }
    if(step === 2 && !profile.workingLanguages.length) errors.push("working_languages");
    if(step === 3){
      if(!profile.preferences.baseCountry) errors.push("base_country");
      if(!profile.preferences.routeTypes.length) errors.push("route_types");
    }
    if(step === 4){
      if(!profile.preferences.rotation) errors.push("rotation");
      if(!profile.preferences.homeTime) errors.push("home_time");
      if(!profile.preferences.shifts.day || !profile.preferences.shifts.night || !profile.preferences.shifts.weekends) errors.push("shifts");
      if(!profile.preferences.overnights) errors.push("overnights");
      if(!profile.preferences.availability.type) errors.push("availability");
      if(profile.preferences.availability.type === "date" && !profile.preferences.availability.date) errors.push("availability_date");
    }
    return { valid:errors.length === 0, errors };
  }

  return {
    SCHEMA_VERSION,
    PROFESSION_CODE,
    SHARE_VERSION,
    createEmptyProfile,
    sanitizeProfile,
    migrateLegacyAnswers,
    backfillLegacyMigration,
    buildPublicProfile,
    sanitizePublicProfile,
    encodePublicProfile,
    decodeSharedProfile,
    effectiveQualificationStatus,
    localDateString,
    validateDraft,
    validateProfessionalProfile,
    validateAddressedCV,
    validateStep
  };
});
