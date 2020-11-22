"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.disconnect = disconnect;
exports.addForm = addForm;
exports.getForms = getForms;
exports.modifyForms = modifyForms;
exports.removeForms = removeForms;
exports.clearForms = clearForms;
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.clearUsers = clearUsers;

var _Form = _interopRequireDefault(require("./Form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mysql = require('mysql');

const dbConfig = require('../routes/db_connect').config;
const tableForm = 'evaluation_db';
const tableUser = 'user_db';
let connection = mysql.createConnection(dbConfig);

function connect() {
  return new Promise((resolve, reject) => {
    connection.connect(error => {
      if (error) reject(error);
      resolve();
    });
  });
}

function disconnect() {
  return new Promise((resolve, reject) => {
    connection.end(error => {
      if (error) reject(error);
      resolve();
    });
  });
}

function addForm(form) {
  return singleQuery(insertInto(tableForm, form));
}

async function getForms(queryInfo) {
  const queryResult = await singleQuery(selectFrom(tableForm, queryInfo));
  let result = [];

  for (const q of queryResult) {
    result.push(new _Form.default(q));
  }

  return result;
}

async function modifyForms(queryInfo, valueInfo) {
  return await singleQuery(updateSet(tableForm, valueInfo, queryInfo));
}

async function removeForms(queryInfo) {
  return await singleQuery(deleteFrom(tableForm, queryInfo));
}

async function clearForms() {
  return await singleQuery(deleteFrom(tableForm));
}

async function addUser(userInfo) {
  return await singleQuery(insertInto(tableUser, userInfo));
}

async function getUser(queryInfo) {
  return await singleQuery(selectFrom(tableUser, queryInfo));
}

async function getUsers() {
  return await singleQuery(selectFrom(tableUser));
}

async function clearUsers() {
  return await singleQuery(deleteFrom(tableUser));
}

function singleQuery(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

function selectFrom(table, query, column) {
  let columnString;
  if (typeof column === 'undefined' || column.length == 0) columnString = "*";else columnString = column.map(value => mysql.escapeId(value)).join(",");
  return `SELECT ${columnString} FROM ${mysql.escapeId(table)} ${where(query)};`;
}

function insertInto(table, obj) {
  let attributes = [];
  let values = [];

  for (const key in obj) {
    attributes.push(mysql.escapeId(key));
    values.push(mysql.escape(obj[key]));
  }

  return `INSERT INTO ${mysql.escapeId(table)}(${attributes.join(",")}) VALUES (${values.join(",")});`;
}

function updateSet(table, value, query) {
  return `UPDATE ${mysql.escapeId(table)} ${set(value)} ${where(query)};`;
}

function deleteFrom(table, query) {
  return `DELETE FROM ${mysql.escapeId(table)} ${where(query)};`;
}

function where(query) {
  if (typeof query === "undefined" || query.length == 0) return "";
  let filters = [];

  for (const key in query) {
    filters.push(`${mysql.escapeId(key)}=${mysql.escape(query[key])}`);
  }

  return `WHERE ${filters.join(" AND ")}`;
}

function set(value) {
  let modifiers = [];

  for (const key in value) {
    modifiers.push(`${mysql.escapeId(key)}=${mysql.escape(value[key])}`);
  }

  return `SET ${modifiers.join(",")}`;
}