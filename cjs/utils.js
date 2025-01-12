'use strict';
const plain = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('plain-tag'));
const {asStatic, asParams} = require('static-params/sql');

const error = (rej, reason) => {
  const code = 'SQLITE_ERROR';
  const error = new Error(code + ': ' + reason);
  error.code = code;
  rej(error);
  return '';
};
exports.error = error;

const raw = (..._) => asStatic(plain(..._));
exports.raw = raw;

const sql = (rej, _) => {
  const [template, ...values] = asParams(..._);
  const sql = [template[0]];
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    switch (typeof value) {
      case 'string':
        sql.push("'" + value.replace(/'/g, "''") + "'");
        break;
      case 'number':
        if (!isFinite(value))
          return error(rej, 'invalid number ' + value);
      case 'boolean':
        sql.push(+value);
        break;
      case 'undefined':
      case 'object':
        if (!value) {
          sql.push('NULL');
          break;
        }
        else if (value instanceof Date) {
          sql.push("'" + value.toISOString() + "'");
          break;
        }
      default:
        return error(rej, 'incompatible value');
    }
    sql.push(template[i + 1]);
  }
  const query = sql.join('').trim();
  return query.length ? query : error(rej, 'empty query');
};
exports.sql = sql;
