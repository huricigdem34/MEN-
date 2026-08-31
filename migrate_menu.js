// One-off parser: safely evaluates the original app.js data structures
// (categories, PRICE_MAP, products) in a sandboxed VM with DOM stubbed out,
// then writes a Supabase-ready SQL seed file.

const fs = require('fs')
const vm = require('vm')

const APP_JS_PATH = process.argv[2] || './app.js'
const OUT_PATH = process.argv[3] || './menu_seed.sql'
const IMAGE_BASE_URL = process.argv[4] || 'https://lobbygarden.com/assets/menu/'

const source = fs.readFileSync(APP_JS_PATH, 'utf8')

const sandbox = {
  document: {
    getElementById: () => ({ style: {}, classList: { add() {}, remove() {} } }),
    createElement: () => ({ classList: { add() {}, remove() {} }, setAttribute() {}, style: {} }),
    body: { appendChild() {}, style: {} },
  },
  window: {},
  console,
}
vm.createContext(sandbox)
vm.runInContext(source + '\nthis.categories = categories; this.PRICE_MAP = PRICE_MAP; this.products = products;', sandbox)

const { categories, PRICE_MAP, products: rawProducts } = sandbox
const products = rawProducts.filter(Boolean)

function sqlEscape(str) {
  if (str === undefined || str === null) return ''
  return String(str).replace(/'/g, "''")
}

function toPgArray(items) {
  const escaped = items.map((i) => `"${i.replace(/"/g, '\\"')}"`)
  return `'{${escaped.join(',')}}'`
}

// Build a category -> image_url lookup from the categories array
const categoryImageMap = {}
for (const c of categories) {
  categoryImageMap[c.name] = `${IMAGE_BASE_URL}${c.img}`
}

// Track sort_order per category (order of appearance in the products array)
const sortCounters = {}

let sql = `-- Auto-generated from the original app.js static menu.
-- Review before running. Image URLs assume they remain hosted at lobbygarden.com —
-- update IMAGE_BASE_URL and re-run if that's not the case.

`

let count = 0
for (const p of products) {
  const price = PRICE_MAP[p.name] ?? 0
  const sortOrder = sortCounters[p.cat] ?? 0
  sortCounters[p.cat] = sortOrder + 1

  const allergensList = (p.all || '')
    .replace(/\.$/, '')
    .split(/[,•|;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/bilinen temel alerjen yoktur/i.test(s))

  const imageUrl = `${IMAGE_BASE_URL}${p.img}`
  const categoryImageUrl = categoryImageMap[p.cat] || imageUrl

  sql += `INSERT INTO public.menu_items
  (name, description, category, price, grammage, allergens, image_url, is_available, sort_order, calories, ingredients, chef_note, category_image_url)
VALUES (
  '${sqlEscape(p.name)}',
  '${sqlEscape(p.desc)}',
  '${sqlEscape(p.cat)}',
  ${Number(price)},
  '${sqlEscape(p.gram)}',
  ${allergensList.length ? toPgArray(allergensList) : "'{}'"},
  '${sqlEscape(imageUrl)}',
  true,
  ${sortOrder},
  '${sqlEscape(p.cal)}',
  '${sqlEscape(p.ing)}',
  '${sqlEscape(p.chef)}',
  '${sqlEscape(categoryImageUrl)}'
);
`
  count++
}

fs.writeFileSync(OUT_PATH, sql, 'utf8')
console.log(`Wrote ${count} INSERT statements to ${OUT_PATH}`)
console.log(`Categories found: ${categories.length}`)
