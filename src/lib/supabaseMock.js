// TEMPORARY MOCK — in-memory fake Supabase client so you can test the UI
// without a real Supabase project. Data resets on page refresh. No real
// auth check — any email/password logs you in.

const CATEGORY_SEED = [
  ['Meze Çeşitleri', 'Mezeler & Aperatifler'], ['Aperatif Çeşitleri', 'Mezeler & Aperatifler'],
  ['Omlet Çeşitleri', 'Ana Yemekler'], ['Krep Çeşitleri', 'Ana Yemekler'],
  ['Menemen Çeşitleri', 'Ana Yemekler'], ['Salata Çeşitleri', 'Ana Yemekler'],
  ['Makarna Çeşitleri', 'Ana Yemekler'], ['Tavuk Çeşitleri', 'Ana Yemekler'],
  ['Et Yemeği Çeşitleri', 'Ana Yemekler'], ['Burger Çeşitleri', 'Ana Yemekler'],
  ['Çorba Çeşitleri', 'Ana Yemekler'], ['Kurudite Çeşitleri', 'Mezeler & Aperatifler'],
  ['Meşrubat Çeşitleri', 'İçecekler'], ['Sıcak İçecek Çeşitleri', 'İçecekler'],
  ['Bitki Çayı Çeşitleri', 'İçecekler'], ['Sıcak Kahve Çeşitleri', 'İçecekler'],
  ['Soğuk Kahve Çeşitleri', 'İçecekler'], ['Blend İçecek Çeşitleri', 'İçecekler'],
  ['Kokteyl Çeşitleri', 'İçecekler'], ['Bira Çeşitleri', 'İçecekler'],
  ['Rakı Çeşitleri', 'İçecekler'], ['Viski Çeşitleri', 'İçecekler'],
  ['Şarap Çeşitleri', 'İçecekler'], ['İthal İçecek Çeşitleri', 'İçecekler'],
  ['Şurup Çeşitleri', 'İçecekler'],
]

const tables = {
  categories: CATEGORY_SEED.map(([name, group_name], i) => ({
    id: crypto.randomUUID(), name, group_name, name_en: '', sort_order: i, created_at: new Date().toISOString(),
  })),
  settings: [
    { id: crypto.randomUUID(), key: 'wifi_password', value: '', updated_at: new Date().toISOString() },
    { id: crypto.randomUUID(), key: 'reservation_phone', value: '', updated_at: new Date().toISOString() },
  ],
  menu_items: [
    {
      id: crypto.randomUUID(),
      name: 'Arnavut Ciğeri',
      description: 'Soğan salatası, domates ve limonla servis edilen dana ciğeri.',
      category: 'Meze Çeşitleri',
      price: 360,
      grammage: '250 g (garnitür dahil)',
      allergens: ['Gluten'],
      image_url: '',
      is_available: true,
      sort_order: 0,
      is_featured: true,
      deleted_at: null,
      calories: '460 kcal',
      ingredients: 'Dana ciğeri, un, ayçiçek yağı, tuz, kuru soğan, sumak, maydanoz, limon, domates.',
      chef_note: 'Reçeteye uygun şekilde taze hazırlanarak servis edilir.',
      name_en: '', description_en: '', ingredients_en: '', chef_note_en: '',
    },
    {
      id: crypto.randomUUID(),
      name: 'Hellim Salatası',
      description: 'Izgara hellim peyniri ile taze mevsim salatası.',
      category: 'Salata Çeşitleri',
      price: 340,
      grammage: '220 g',
      allergens: ['Süt ve süt ürünleri'],
      image_url: '',
      is_available: true,
      sort_order: 0,
      is_featured: true,
      deleted_at: null,
      calories: '390 kcal',
      ingredients: 'Hellim peyniri, marul, roka, domates, salatalık, zeytinyağı, limon.',
      chef_note: '',
      name_en: 'Halloumi Salad', description_en: 'Grilled halloumi cheese with fresh seasonal salad.',
      ingredients_en: '', chef_note_en: '',
    },
    {
      id: crypto.randomUUID(),
      name: 'Çikolatalı Milkshake',
      description: 'Yoğun çikolatalı, soğuk servis milkshake.',
      category: 'Blend İçecek Çeşitleri',
      price: 210,
      grammage: '350 ml',
      allergens: ['Süt ve süt ürünleri'],
      image_url: '',
      is_available: false,
      sort_order: 0,
      is_featured: false,
      deleted_at: null,
      calories: '520 kcal',
      ingredients: 'Süt, çikolata, dondurma, şeker.',
      chef_note: '',
      name_en: '', description_en: '', ingredients_en: '', chef_note_en: '',
    },
  ],
}

function buildQuery(table) {
  let filters = []
  let orderFields = []
  const query = {
    order(field, opts) {
      orderFields.push({ field, ascending: opts?.ascending !== false })
      return query
    },
    eq(field, value) {
      filters.push((row) => row[field] === value)
      return query
    },
    is(field, value) {
      filters.push((row) => (row[field] ?? null) === value)
      return query
    },
    then(resolve) {
      let data = tables[table].filter((row) => filters.every((f) => f(row)))
      for (const { field, ascending } of [...orderFields].reverse()) {
        data = [...data].sort((a, b) => {
          if (a[field] < b[field]) return ascending ? -1 : 1
          if (a[field] > b[field]) return ascending ? 1 : -1
          return 0
        })
      }
      resolve({ data, error: null })
    },
  }
  return query
}

export const supabase = {
  from(table) {
    if (!tables[table]) tables[table] = []
    return {
      select() {
        return buildQuery(table)
      },
      insert(payload) {
        tables[table].push({ id: crypto.randomUUID(), sort_order: 0, created_at: new Date().toISOString(), ...payload })
        return Promise.resolve({ error: null })
      },
      update(payload) {
        let targetId = null
        let targetKey = null
        const chain = {
          eq(field, value) {
            if (field === 'id') targetId = value
            if (field === 'key') targetKey = value
            tables[table] = tables[table].map((row) => {
              const matches = (targetId !== null && row.id === targetId) || (targetKey !== null && row.key === targetKey)
              return matches ? { ...row, ...payload } : row
            })
            return Promise.resolve({ error: null })
          },
        }
        return chain
      },
      delete() {
        return {
          eq(field, value) {
            tables[table] = tables[table].filter((row) => row[field] !== value)
            return Promise.resolve({ error: null })
          },
        }
      },
    }
  },
  storage: {
    from() {
      return {
        upload() {
          return Promise.resolve({ error: null })
        },
        getPublicUrl() {
          return { data: { publicUrl: '' } }
        },
      }
    },
  },
  auth: {
    signInWithPassword() {
      return Promise.resolve({ data: { session: { user: { email: 'demo@local' } } }, error: null })
    },
    getSession() {
      return Promise.resolve({ data: { session: { user: { email: 'demo@local' } } } })
    },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } } }
    },
    signOut() {
      return Promise.resolve({ error: null })
    },
  },
}
