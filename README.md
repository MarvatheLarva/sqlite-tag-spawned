# sqlite-tag-spawned

[![build status](https://github.com/WebReflection/sqlite-tag-spawned/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/sqlite-tag-spawned/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/sqlite-tag-spawned/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/sqlite-tag-spawned?branch=main)

The same [sqlite-tag](https://github.com/WebReflection/sqlite-tag#readme) ease but without the native [sqlite3](https://www.npmjs.com/package/sqlite3) dependency, aiming to replace [dblite](https://github.com/WebReflection/dblite#readme).

```js
import SQLiteTagSpawned from 'sqlite-tag-spawned';
// const SQLiteTagSpawned = require('sqlite-tag-spawned');

const {query, get, all, raw, transaction} = SQLiteTagSpawned('./db.sql');

// single query as any info
console.log(await query`.databases`);

// single query as SQL
await query`CREATE TABLE IF NOT EXISTS names (
  id INTEGER PRIMARY KEY,
  name TEXT
)`;

// transaction
const populate = transaction();
for (let i = 0; i < 2; i++)
  populate`INSERT INTO names (name) VALUES (${'Name' + i})`;
await populate.commit();

// get single row (works with LIMIT 1 too, of course)
await get`SELECT name FROM names`;
// { name: 'Name0' }

// get all results, if any, or an empty array
await all`SELECT * FROM names`;
// [ { id: 1, name: 'Name0' }, { id: 2, name: 'Name1' } ]
```

### Differently from dblite

  * requires **SQLite 3.33** or higher (it uses the `-json` output mode)
  * each query is a spawn call except for transactions
  * performance still similar to sqlite3 native module