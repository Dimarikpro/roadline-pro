"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const model = require("../cv/cv-model.js");

function completeProfile(){
  const profile = model.createEmptyProfile("en", new Date("2026-11-26T12:00:00Z"));
  profile.publicIdentity.displayName = "Northbound driver";
  profile.qualifications.ce.status = "valid";
  profile.qualifications.cpc.status = "valid";
  profile.qualifications.cpc.cpcType = "eu_code_95";
  profile.qualifications.tachograph.status = "valid";
  profile.qualifications.adr.status = "absent";
  profile.experience.ceRange = "1_2y";
  profile.experience.equipmentAnswer = "selected";
  profile.experience.equipment = [{code:"tanker",level:"learning"}];
  profile.experience.cargo = [{code:"food_liquid",level:"assisted"}];
  profile.workingLanguages = [{code:"pl",level:"operational"}];
  profile.preferences.baseCountry = "PL";
  profile.preferences.baseCity = "Poznań";
  profile.preferences.routeTypes = ["international"];
  profile.preferences.routeCountries = ["DE", "NL"];
  profile.preferences.routeRegions = ["benelux"];
  profile.preferences.rotation = "2_2";
  profile.preferences.homeTime = "rotation";
  profile.preferences.shifts = {day:"accepted",night:"excluded",weekends:"negotiable"};
  profile.preferences.overnights = "1_2";
  profile.preferences.availability = {type:"date",date:"2026-12-15"};
  profile.training = ["adr"];
  return profile;
}

test("migrates every v1 field without inferring current work rights, overnights, ADR validity or container subtype", ()=>{
  const legacy = {
    workType:"intl",
    experience:"1-3",
    trailers:["container", "tanker"],
    regions:["PL", "DE", "EU"],
    schedule:"3/1",
    documents:["code95", "card", "adr"],
    statusEU:"euCitizen",
    contactName:"Jan Kowalski",
    contactPhone:"+48 600 000 000"
  };
  const migrated = model.migrateLegacyAnswers(legacy, {locale:"pl", now:new Date("2026-11-26T12:00:00Z")});

  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.privateIdentity.cvName, "Jan Kowalski");
  assert.equal(migrated.privateIdentity.contact.value, "+48 600 000 000");
  assert.equal(migrated.publicIdentity.displayName, "");
  assert.equal(migrated.qualifications.adr.status, "unknown");
  assert.equal(migrated.qualifications.adr.scope, "legacy_declared");
  assert.deepEqual(migrated.experience.equipment, [
    {code:"sea_container",level:"unknown"},
    {code:"tanker",level:"unknown"}
  ]);
  assert.deepEqual(migrated.preferences.routeCountries, ["PL", "DE"]);
  assert.deepEqual(migrated.preferences.routeRegions, ["europe"]);
  assert.equal(migrated.preferences.overnights, "");
  assert.deepEqual(migrated.preferences.shifts, {day:"",night:"",weekends:""});
  assert.equal("statusEU" in migrated, false);
  assert.deepEqual(migrated.migration, {
    source:"roadline_cv_answers_v1",
    legacyAnswers:{
      workType:"intl",
      experience:"1-3",
      trailers:["container", "tanker"],
      regions:["PL", "DE", "EU"],
      schedule:"3/1",
      documents:["code95", "card", "adr"],
      statusEU:"euCitizen"
    }
  });
});

test("migrates all legacy region choices into active v2 route fields", ()=>{
  const migrated = model.migrateLegacyAnswers({
    regions:["PL", "DE", "FR", "BENELUX", "SCAN", "EU"]
  });
  assert.deepEqual(migrated.preferences.routeCountries, ["PL", "DE", "FR"]);
  assert.deepEqual(migrated.preferences.routeRegions, ["benelux", "scandinavia", "europe"]);
});

test("repairs profiles already migrated by an earlier v2 build without overwriting current answers", ()=>{
  const previousV2 = completeProfile();
  previousV2.preferences.routeRegions = [];
  previousV2.preferences.rotation = "4_1";
  const restored = model.backfillLegacyMigration(previousV2, {
    workType:"local",
    experience:"5+",
    regions:["BENELUX", "SCAN"],
    schedule:"2/2",
    statusEU:"karta"
  });

  assert.deepEqual(restored.preferences.routeRegions, ["benelux", "scandinavia"]);
  assert.equal(restored.preferences.rotation, "4_1");
  assert.equal(restored.experience.ceRange, "1_2y");
  assert.equal(restored.migration.legacyAnswers.statusEU, "karta");
});

test("public allowlist excludes private identity and employment history", ()=>{
  const profile = completeProfile();
  profile.privateIdentity = {cvName:"Private Name",contact:{type:"email",value:"private@example.com",bestTime:"18:00"}};
  profile.experience.employmentHistory = [{employer:"Secret Employer",role:"Driver",startMonth:"2024-01",endMonth:"2025-02",summary:"Private route"}];
  profile.migration = {source:"roadline_cv_answers_v1",legacyAnswers:{statusEU:"visa",documents:["adr"]}};
  profile.passportNumber = "ABC123";

  const publicProfile = model.buildPublicProfile(profile, {today:"2026-11-26"});
  const serialized = JSON.stringify(publicProfile);
  assert.equal(serialized.includes("Private Name"), false);
  assert.equal(serialized.includes("private@example.com"), false);
  assert.equal(serialized.includes("Secret Employer"), false);
  assert.equal(serialized.includes("ABC123"), false);
  assert.equal(serialized.includes("visa"), false);
  assert.equal(publicProfile.displayName, "Northbound driver");
  assert.deepEqual(publicProfile.experience.equipment, [{code:"tanker",level:"learning"}]);
  assert.deepEqual(publicProfile.experience.cargo, [{code:"food_liquid",level:"assisted"}]);
});

test("contact-like public display names fail closed", ()=>{
  const profile = completeProfile();
  profile.publicIdentity.displayName = "Call +48 600 123 456";
  assert.equal(model.buildPublicProfile(profile).displayName, "Driver C+E");
  profile.publicIdentity.displayName = "driver@example.com";
  assert.equal(model.buildPublicProfile(profile).displayName, "Driver C+E");
  profile.publicIdentity.displayName = "https://t.me/northbound";
  assert.equal(model.buildPublicProfile(profile).displayName, "Driver C+E");
  profile.publicIdentity.displayName = "WhatsApp Northbound";
  assert.equal(model.buildPublicProfile(profile).displayName, "Driver C+E");
});

test("contact details and exact addresses in the public city field fail closed", ()=>{
  const unsafeCities = [
    "Warsaw, +48 600 123 456",
    "driver@example.com",
    "https://example.com/driver",
    "bit.ly/roadline-driver",
    "t.me/roadline_driver",
    "@roadline_driver",
    "WhatsApp: roadline_driver",
    "name [at] example [dot] com",
    "Warszawa, ul. Długa 12",
    "Warszawa, Długa 12",
    "00-001 Warszawa"
  ];

  for(const city of unsafeCities){
    const profile = completeProfile();
    profile.preferences.baseCity = city;
    assert.equal(model.buildPublicProfile(profile).region.city, "", `public DTO leaked ${city}`);
  }

  const profile = completeProfile();
  profile.preferences.baseCity = "Poznań";
  assert.equal(model.buildPublicProfile(profile).region.city, "Poznań");
});

test("public DTO and encoded URL remove contacts hidden in unexpected fields", ()=>{
  const profile = completeProfile();
  profile.publicIdentity.displayName = "Telegram @private_driver";
  profile.preferences.baseCity = "Berlin, phone +49 151 23456789";
  profile.privateIdentity = {cvName:"Private Name",contact:{type:"email",value:"private@example.com",bestTime:"18:00"}};
  profile.experience.employmentHistory = [{
    employer:"Secret Employer https://employer.example",
    role:"Driver",
    startMonth:"2024-01",
    endMonth:"2025-02",
    summary:"Signal @private_driver"
  }];
  profile.publicBio = "WhatsApp +48 600 123 456";
  profile.documents = [{number:"DOC-SECRET",url:"https://documents.example/private"}];
  profile.preferences.routeCountries = ["DE", "driver@example.com"];
  profile.preferences.baseCountry = "+4";

  const publicProfile = model.buildPublicProfile(profile);
  assert.equal(publicProfile.displayName, "Driver C+E");
  assert.deepEqual(publicProfile.region, {country:"",city:""});
  assert.deepEqual(publicProfile.routes.countries, ["DE"]);

  const encoded = model.encodePublicProfile(publicProfile);
  const decodedText = Buffer.from(encoded, "base64url").toString("utf8");
  for(const forbidden of [
    "private_driver", "+49 151", "Private Name", "private@example.com", "Secret Employer",
    "employer.example", "WhatsApp", "+48 600", "DOC-SECRET", "documents.example"
  ]){
    assert.equal(decodedText.includes(forbidden), false, `public URL leaked ${forbidden}`);
  }
});

test("share sanitizer removes contact data from otherwise valid public DTO fields", ()=>{
  const publicProfile = model.buildPublicProfile(completeProfile());
  publicProfile.displayName = "driver@example.com";
  publicProfile.region.city = "www.example.com/profile";
  publicProfile.region.country = "+4";

  const decoded = model.decodeSharedProfile(model.encodePublicProfile(publicProfile));
  assert.equal(decoded.publicProfile.displayName, "Driver C+E");
  assert.deepEqual(decoded.publicProfile.region, {country:"",city:""});
});

test("share decoder sanitizes injected fields and reads legacy links without contacts", ()=>{
  const publicProfile = model.buildPublicProfile(completeProfile());
  publicProfile.phone = "+48 111 222 333";
  publicProfile.qualifications.ce.number = "SECRET";
  const decoded = model.decodeSharedProfile(model.encodePublicProfile(publicProfile));
  const serialized = JSON.stringify(decoded.publicProfile);
  assert.equal(serialized.includes("111 222"), false);
  assert.equal(serialized.includes("SECRET"), false);

  const legacyPayload = Buffer.from(JSON.stringify({
    v:2,
    answers:{workType:"intl",experience:"1-3",trailers:["tanker"],regions:["PL"],schedule:"2/2",documents:["adr"],statusEU:"visa",contactName:"Legacy Person",contactPhone:"+48 999"}
  })).toString("base64url");
  const legacyDecoded = model.decodeSharedProfile(legacyPayload, {locale:"en"});
  assert.equal(legacyDecoded.wasLegacy, true);
  assert.equal(JSON.stringify(legacyDecoded.publicProfile).includes("Legacy Person"), false);
  assert.equal(JSON.stringify(legacyDecoded.publicProfile).includes("+48 999"), false);
});

test("draft and public preview do not require contact, targeted CV does", ()=>{
  const profile = completeProfile();
  assert.equal(model.validateDraft(profile).valid, true);
  assert.equal(model.validateAddressedCV(profile).valid, false);
  profile.privateIdentity.cvName = "Alex Driver";
  profile.privateIdentity.contact = {type:"email",value:"alex@example.com",bestTime:""};
  assert.equal(model.validateAddressedCV(profile).valid, true);
});

test("minimal professional card needs only a C+E answer while targeted CV keeps full requirements", ()=>{
  const profile = model.createEmptyProfile("en");
  assert.deepEqual(model.validateDraft(profile), {valid:false,errors:["qualification_ce"]});

  profile.qualifications.ce.status = "unknown";
  assert.deepEqual(model.validateDraft(profile), {valid:true,errors:[]});
  assert.equal(model.validateProfessionalProfile(profile).valid, false);

  profile.privateIdentity.cvName = "Alex Driver";
  profile.privateIdentity.contact = {type:"email",value:"alex@example.com",bestTime:""};
  const addressed = model.validateAddressedCV(profile);
  assert.equal(addressed.valid, false);
  for(const required of ["qualification_cpc", "qualification_tachograph", "experience_range", "working_languages", "base_country", "route_types", "rotation", "home_time", "shifts", "overnights", "availability"]){
    assert.ok(addressed.errors.includes(required), `targeted CV still requires ${required}`);
  }
});

test("encoded public links contain only the public allowlist and no private source values", ()=>{
  const profile = completeProfile();
  profile.publicIdentity.displayName = "";
  profile.privateIdentity = {cvName:"Private Name",contact:{type:"email",value:"private@example.com",bestTime:"after 18:00"}};
  profile.experience.employmentHistory = [{employer:"Secret Employer",role:"Driver",startMonth:"2024-01",endMonth:"2025-02",summary:"Private summary"}];
  profile.qualifications.ce.issuingCountry = "PL";
  profile.qualifications.ce.validUntil = "2030-01-02";
  profile.qualifications.ce.documentNumber = "CE-SECRET";
  profile.migration = {source:"roadline_cv_answers_v1",legacyAnswers:{statusEU:"visa",documents:["adr"]}};

  const encoded = model.encodePublicProfile(model.buildPublicProfile(profile));
  const decodedText = Buffer.from(encoded, "base64url").toString("utf8");
  for(const forbidden of ["Private Name", "private@example.com", "after 18:00", "Secret Employer", "Private summary", "2030-01-02", "CE-SECRET", "statusEU", "visa"]){
    assert.equal(decodedText.includes(forbidden), false, `public payload leaked ${forbidden}`);
  }
  const decoded = model.decodeSharedProfile(encoded);
  assert.equal(decoded.publicProfile.displayName, "Driver C+E");
  assert.deepEqual(decoded.publicProfile.routes.regions, ["benelux"]);
});

test("expired dates are compared as local calendar dates and exact availability is not public", ()=>{
  const profile = completeProfile();
  profile.qualifications.ce.status = "valid";
  profile.qualifications.ce.validUntil = "2026-11-25";
  const publicProfile = model.buildPublicProfile(profile, {today:"2026-11-26"});
  assert.equal(publicProfile.qualifications.ce.status, "expired");
  assert.deepEqual(publicProfile.preferences.availability, {type:"date",period:"2026-12"});
  assert.equal(JSON.stringify(publicProfile).includes("2026-12-15"), false);
});

test("malformed and unsupported share payloads fail closed", ()=>{
  assert.equal(model.decodeSharedProfile("not-base64"), null);
  assert.equal(model.decodeSharedProfile("A".repeat(24001)), null);
  assert.equal(model.decodeSharedProfile(Buffer.from("{broken", "utf8").toString("base64url")), null);
  const unsupported = Buffer.from(JSON.stringify({v:999,publicProfile:{displayName:"x"}})).toString("base64url");
  assert.equal(model.decodeSharedProfile(unsupported), null);
});
