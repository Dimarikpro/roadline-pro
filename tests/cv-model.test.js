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
  profile.preferences.rotation = "2_2";
  profile.preferences.homeTime = "rotation";
  profile.preferences.shifts = {day:"accepted",night:"excluded",weekends:"negotiable"};
  profile.preferences.overnights = "1_2";
  profile.preferences.availability = {type:"date",date:"2026-12-15"};
  profile.training = ["adr"];
  return profile;
}

test("migrates v1 without inferring work rights, overnights, ADR validity or container subtype", ()=>{
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
  assert.equal(migrated.preferences.overnights, "");
  assert.deepEqual(migrated.preferences.shifts, {day:"",night:"",weekends:""});
  assert.equal("statusEU" in migrated, false);
});

test("public allowlist excludes private identity and employment history", ()=>{
  const profile = completeProfile();
  profile.privateIdentity = {cvName:"Private Name",contact:{type:"email",value:"private@example.com",bestTime:"18:00"}};
  profile.experience.employmentHistory = [{employer:"Secret Employer",role:"Driver",startMonth:"2024-01",endMonth:"2025-02",summary:"Private route"}];
  profile.passportNumber = "ABC123";

  const publicProfile = model.buildPublicProfile(profile, {today:"2026-11-26"});
  const serialized = JSON.stringify(publicProfile);
  assert.equal(serialized.includes("Private Name"), false);
  assert.equal(serialized.includes("private@example.com"), false);
  assert.equal(serialized.includes("Secret Employer"), false);
  assert.equal(serialized.includes("ABC123"), false);
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
  const unsupported = Buffer.from(JSON.stringify({v:999,publicProfile:{displayName:"x"}})).toString("base64url");
  assert.equal(model.decodeSharedProfile(unsupported), null);
});
