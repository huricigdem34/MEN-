const fs = require('fs')
const products = require('./products_full.json')
const categories = require('./categories_full.json')
const { T, CATEGORY_TRANSLATIONS, CHEF_NOTE_EN } = require('./translations.js')

function esc(str) {
  if (str === undefined || str === null) return ''
  return String(str).replace(/'/g, "''")
}

let sql = `-- Auto-generated: fills name_en / description_en / ingredients_en / chef_note_en
-- for all 231 products (matched by exact Turkish name), and name_en for
-- all 25 categories. Safe to re-run.

`

for (const p of products) {
  const tr = T[p.name]
  sql += `UPDATE public.menu_items SET
  name_en = '${esc(tr.name_en)}',
  description_en = '${esc(tr.description_en)}',
  ingredients_en = '${esc(tr.ingredients_en)}',
  chef_note_en = '${esc(CHEF_NOTE_EN)}'
WHERE name = '${esc(p.name)}';
`
}

sql += '\n-- Category name translations\n'
for (const c of categories) {
  const en = CATEGORY_TRANSLATIONS[c.name]
  sql += `UPDATE public.categories SET name_en = '${esc(en)}' WHERE name = '${esc(c.name)}';\n`
}

fs.writeFileSync('/home/claude/menu-admin/supabase_migration_007_translations.sql', sql)
console.log('Wrote', products.length, 'product translations and', categories.length, 'category translations')
