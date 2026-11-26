"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const cvRoot = path.join(root, "cv");
const html = fs.readFileSync(path.join(cvRoot, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(cvRoot, "cv.js"), "utf8");

test("application entrypoint and required assets exist", ()=>{
  for(const relativePath of ["index.html", "cv.css", "cv-model.js", "cv.js"]){
    assert.equal(fs.existsSync(path.join(cvRoot, relativePath)), true, `${relativePath} exists`);
  }

  const localAssets = [...html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)="([^"]+)"/g)]
    .map(match=>match[1])
    .filter(value=>!value.startsWith("http") && !value.startsWith("#"));
  for(const asset of localAssets){
    assert.equal(fs.existsSync(path.resolve(cvRoot, asset)), true, `${asset} referenced by index.html exists`);
  }
});

test("HTML ids are unique and cover every static getElementById lookup", ()=>{
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML ids are unique");

  const requiredIds = [...new Set([...appSource.matchAll(/getElementById\("([^"]+)"\)/g)].map(match=>match[1]))];
  for(const id of requiredIds) assert.ok(ids.includes(id), `#${id} exists in index.html`);
});

test("model loads before UI code and scripts avoid inline event handlers", ()=>{
  assert.ok(html.indexOf('src="./cv-model.js"') < html.indexOf('src="./cv.js"'));
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
});
