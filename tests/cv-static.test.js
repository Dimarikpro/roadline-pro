"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "cv", "cv.js"), "utf8");
const html = fs.readFileSync(path.join(root, "cv", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "cv", "cv.css"), "utf8");

function objectLiteralAfter(marker){
  const markerIndex = appSource.indexOf(marker);
  assert.notEqual(markerIndex, -1, `${marker} is present`);
  const start = appSource.indexOf("{", markerIndex + marker.length);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for(let index = start; index < appSource.length; index += 1){
    const char = appSource[index];
    if(quote){
      if(escaped) escaped = false;
      else if(char === "\\") escaped = true;
      else if(char === quote) quote = "";
      continue;
    }
    if(char === "\"" || char === "'" || char === "`"){
      quote = char;
      continue;
    }
    if(char === "{") depth += 1;
    if(char === "}"){
      depth -= 1;
      if(depth === 0) return appSource.slice(start, index + 1);
    }
  }
  throw new Error(`unterminated object after ${marker}`);
}

test("RU, UK, EN and PL dictionaries have the same complete UI key set", ()=>{
  const text = vm.runInNewContext(`(${objectLiteralAfter("const TEXT =")})`, Object.create(null));
  assert.deepEqual(Object.keys(text).sort(), ["en", "pl", "ru", "uk"]);
  const expected = Object.keys(text.en).sort();
  for(const locale of ["ru", "uk", "en", "pl"]){
    assert.deepEqual(Object.keys(text[locale]).sort(), expected, `${locale} UI keys differ from EN`);
    for(const key of expected) assert.notEqual(text[locale][key], "", `${locale}.${key} is empty`);
  }
});

test("every professional value label is translated in all four locales", ()=>{
  const labels = vm.runInNewContext(`(${objectLiteralAfter("const VALUE_LABELS =")})`, Object.create(null));
  for(const [group, entries] of Object.entries(labels)){
    for(const [code, translations] of Object.entries(entries)){
      assert.deepEqual(Object.keys(translations).sort(), ["en", "pl", "ru", "uk"], `${group}.${code} locale set`);
      for(const locale of ["ru", "uk", "en", "pl"]){
        assert.equal(typeof translations[locale], "string");
        assert.ok(translations[locale].length > 0, `${group}.${code}.${locale} is empty`);
      }
    }
  }
});

test("HTML exposes all four UI languages and privacy-safe shared-page defaults", ()=>{
  for(const locale of ["ru", "uk", "en", "pl"]) assert.match(html, new RegExp(`<option value="${locale}"`));
  assert.match(html, /<meta name="referrer" content="no-referrer">/);
  assert.ok(html.indexOf("cv-model.js") < html.indexOf("cv.js"), "model loads before the UI application");
});

test("rendering code avoids executable HTML sinks", ()=>{
  for(const sink of [/\.innerHTML\s*=/, /insertAdjacentHTML\s*\(/, /document\.write\s*\(/, /\beval\s*\(/, /new Function\s*\(/]){
    assert.doesNotMatch(appSource, sink);
  }
});

test("print stylesheet hides export controls and the public profile", ()=>{
  const printBlock = css.slice(css.indexOf("@media print"));
  for(const selector of ["#publicPanel", "#outputs .section-heading", "#outputs .output-tabs", "#cvPanel .cv-controls", "#cvPanel .export-summary", "#cvPanel .cv-actions"]){
    assert.ok(printBlock.includes(selector), `print CSS hides ${selector}`);
  }
  assert.match(printBlock, /#cvDocument\s*\{[^}]*display:block\s*!important/s);
});
