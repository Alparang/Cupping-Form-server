"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.getByAttribute = getByAttribute;
exports.getSimilar = getSimilar;
exports.getSimilarByAttribute = getSimilarByAttribute;

var queryProcessor = _interopRequireWildcard(require("./queryProcessor"));

var metafields = _interopRequireWildcard(require("./metafields.json"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const fields = Object.keys(metafields);
const lowerCasedFields = fields.map(value => value.toLowerCase());

const {
  horizontalAttributes
} = require("./fields.json");

async function get() {
  let forms = await queryProcessor.getForms();
  forms.sort((a, b) => b.finalScore - a.finalScore);
  return forms;
}

async function getByAttribute(attributes) {
  let forms = await queryProcessor.getForms();
  let scores = [];

  for (const form of forms) {
    const score = attributes.reduce((prev, curr) => {
      return prev + form[fixCase(curr)];
    }, 0);
    scores.push({
      score,
      form
    });
  }

  scores.sort((a, b) => b.score - a.score);
  return scores.map(value => value.form);
}

async function getSimilar(form) {
  let forms = await queryProcessor.getForms();
  forms = forms.filter(f => f.evaluation_index != form.evaluation_index);
  return sortFormsByDistance(forms, form);
}

async function getSimilarByAttribute(form, attributes) {
  let forms = await queryProcessor.getForms();
  forms = forms.filter(f => f.evaluation_index != form.evaluation_index);
  return sortFormsByDistance(forms, form, attributes);
}

function sortFormsByDistance(forms, anchorForm, keyAttributes = []) {
  let distances = [];

  for (const f of forms) {
    const distance = getFormDistance(anchorForm, f, keyAttributes);
    distances.push({
      distance,
      form: f
    });
  }

  distances.sort((a, b) => a.distance - b.distance);
  return distances.map(value => value.form);
}

function getFormDistance(a, b, keyAttributes = []) {
  let result = 0;
  const p = 2;
  keyAttributes = keyAttributes.map(value => fixCase(value));

  for (const attr of horizontalAttributes) {
    const metafield = metafields[attr];
    const isKey = keyAttributes.includes(attr);
    const aAttr = isKey ? metafield.max : a[attr];
    let term;

    if (typeof aAttr === 'number') {
      if (typeof b[attr] === 'number') {
        // 일반 거리
        term = aAttr - b[attr];
      } else {
        // 가장 멀도록 b[attr] 조정
        term = Math.max(aAttr - metafield.min, metafield.max - aAttr);
      }
    } else {
      if (typeof b[attr] === 'number') {
        // b[attr]가 높을 수록 가깝게
        term = metafield.max - b[attr];
      } else {
        // 없으면 최대로
        term = metafield.max - metafield.min;
      }
    }

    term /= metafield.max - metafield.min;
    if (isKey) term *= 0.5;
    result += Math.pow(Math.abs(term), p);
  }

  return result;
}

function fixCase(attribute) {
  const fi = lowerCasedFields.indexOf(attribute.toLowerCase());
  if (fi == -1) throw `일치하는 case가 존재하지 않습니다: ${attribute}`;
  return fields[fi];
}