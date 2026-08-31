// Ported 1:1 from the original static site's js/app.js — same SVG icons,
// same Turkish keyword-matching logic for allergens and ingredients.

export const allergenIcons = {
  gluten: `<svg viewBox="0 0 64 64"><path d="M32 7v50M32 18C22 17 18 12 17 7c9 1 14 5 15 11Zm0 10c-9-1-14-5-15-11 9 1 14 5 15 11Zm0 10c-9-1-14-5-15-11 9 1 14 5 15 11Zm0 10c-9-1-14-5-15-11 9 1 14 5 15 11Zm0-30c9-1 14-5 15-11-9 1-14 5-15 11Zm0 10c9-1 14-5 15-11-9 1-14 5-15 11Zm0 10c9-1 14-5 15-11-9 1-14 5-15 11Z"/></svg>`,
  milk: `<svg viewBox="0 0 64 64"><path d="M22 8h20v10l6 8v30H16V26l6-8Z"/><path d="M22 18h20M16 27h32"/><path d="M32 33c-5 7-7 10-7 14a7 7 0 0 0 14 0c0-4-2-7-7-14Z"/></svg>`,
  egg: `<svg viewBox="0 0 64 64"><path d="M32 8c-10 0-19 23-19 34 0 9 8 15 19 15s19-6 19-15C51 31 42 8 32 8Z"/></svg>`,
  fish: `<svg viewBox="0 0 64 64"><path d="M10 32c10-13 25-17 39-6l7-7v26l-7-7c-14 11-29 7-39-6Z"/><circle cx="41" cy="28" r="2"/><path d="M17 32h18"/></svg>`,
  crustaceans: `<svg viewBox="0 0 64 64"><path d="M32 20c-10-9-23-2-21 9 2 10 12 18 21 18s19-8 21-18c2-11-11-18-21-9Z"/><path d="M21 21 14 12m29 9 7-9M25 31h14M32 20v27M15 37l-7 6m41-6 7 6"/></svg>`,
  mustard: `<svg viewBox="0 0 64 64"><path d="M25 8h14v9l5 7v32H20V24l5-7Z"/><path d="M25 17h14M20 29h24"/></svg>`,
  peanuts: `<svg viewBox="0 0 64 64"><path d="M23 11c9-2 15 6 13 14-2 7 8 7 9 15 2 10-8 17-17 12-6-3-6-10-4-15 2-6-8-7-9-15-1-5 3-10 8-11Z"/><path d="M20 20c5 3 9 3 14 0m-9 16c5 3 10 3 15 0"/></svg>`,
  sesame: `<svg viewBox="0 0 64 64"><path d="M18 18c8 1 12 7 10 15-8-1-12-7-10-15Zm28 0c-8 1-12 7-10 15 8-1 12-7 10-15ZM25 40c7-4 14-2 18 5-7 4-14 2-18-5Z"/></svg>`,
  soy: `<svg viewBox="0 0 64 64"><path d="M13 37c5-15 17-24 30-19 11 4 12 18 4 27-8 9-25 10-34-8Z"/><circle cx="24" cy="35" r="5"/><circle cx="36" cy="29" r="5"/><circle cx="40" cy="41" r="4"/></svg>`,
  celery: `<svg viewBox="0 0 64 64"><path d="M25 56V24m7 32V18m7 38V25"/><path d="M25 26c-9-3-12-9-10-17 8 1 12 7 10 17Zm7-7c-7-5-8-12-4-18 7 3 9 10 4 18Zm7 8c9-3 12-9 10-17-8 1-12 7-10 17Z"/></svg>`,
  sulphites: `<svg viewBox="0 0 64 64"><path d="M26 8h12v14l12 22c3 6-1 12-8 12H22c-7 0-11-6-8-12l12-22Z"/><path d="M22 39h20"/><circle cx="28" cy="46" r="2"/><circle cx="37" cy="49" r="2"/></svg>`,
  nuts: `<svg viewBox="0 0 64 64"><path d="M32 8c-8 8-14 18-14 29 0 12 7 19 14 19s14-7 14-19C46 26 40 16 32 8Z"/><path d="M32 9v47M24 28c5 2 8 6 8 12m8-12c-5 2-8 6-8 12"/></svg>`,
  default: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22"/><path d="M32 18v18m0 9v1"/></svg>`,
}

export function allergenType(s) {
  const t = (s || '').toLocaleLowerCase('tr-TR')
  if (/gluten|buğday/.test(t)) return 'gluten'
  if (/süt|tereyağ|krema|yoğurt|peynir|kaşar|cheddar/.test(t)) return 'milk'
  if (/yumurta/.test(t)) return 'egg'
  if (/balık|ton balığı|ançüez/.test(t)) return 'fish'
  if (/kabuklu|karides|yengeç|ıstakoz/.test(t)) return 'crustaceans'
  if (/yer fıstığı|fıstık/.test(t)) return 'peanuts'
  if (/susam/.test(t)) return 'sesame'
  if (/soya/.test(t)) return 'soy'
  if (/hardal/.test(t)) return 'mustard'
  if (/kereviz/.test(t)) return 'celery'
  if (/sülfit/.test(t)) return 'sulphites'
  if (/sert kabuklu|badem|ceviz|fındık/.test(t)) return 'nuts'
  return 'default'
}

export const ingredientIcons = {
  meat: `<svg viewBox="0 0 64 64"><path d="M16 37c-5-8 1-20 12-22 10-2 19 3 21 11 2 7-2 15-10 19-9 5-18 1-23-8Z"/><path d="M24 29c3-5 10-7 15-3 4 3 3 9-1 12-5 4-12 2-15-3"/><circle cx="35" cy="31" r="3"/></svg>`,
  chicken: `<svg viewBox="0 0 64 64"><path d="M20 38c-7-7-4-19 5-24 9-5 20 0 22 9 2 8-4 17-13 19-5 1-10 0-14-4Z"/><path d="M18 39 9 48m2-7 6 6m-8-1 5 5"/></svg>`,
  cheese: `<svg viewBox="0 0 64 64"><path d="M10 27 34 13l20 13v25H10Z"/><path d="M10 27h44M34 13v14"/><circle cx="25" cy="37" r="3"/><circle cx="43" cy="43" r="4"/><circle cx="19" cy="47" r="2"/></svg>`,
  onion: `<svg viewBox="0 0 64 64"><path d="M32 14c1 8 13 11 13 25 0 9-6 15-13 15s-13-6-13-15c0-14 12-17 13-25Z"/><path d="M32 14c-5 5-7 9-7 14m7-14c5 5 7 9 7 14M27 11c2 3 3 5 5 7 2-2 3-4 5-7"/></svg>`,
  pepper: `<svg viewBox="0 0 64 64"><path d="M34 18c2-5 6-7 11-7"/><path d="M34 20c-9-5-19 2-18 13 1 12 9 21 16 20 8 0 16-10 17-21 1-10-7-16-15-12Z"/><path d="M31 22c-2 10-1 20 2 29"/></svg>`,
  tomato: `<svg viewBox="0 0 64 64"><circle cx="32" cy="35" r="18"/><path d="m32 17-5-6m5 6 5-6m-5 6-8 1m8-1 8 1"/><path d="M22 31c5 3 15 3 20 0"/></svg>`,
  mushroom: `<svg viewBox="0 0 64 64"><path d="M12 31c2-12 10-19 20-19s18 7 20 19Z"/><path d="M26 31v17c0 4 12 4 12 0V31"/><path d="M19 27c3-4 7-6 13-6s10 2 13 6"/></svg>`,
  egg: `<svg viewBox="0 0 64 64"><path d="M32 9c-9 0-18 21-18 31 0 9 8 15 18 15s18-6 18-15C50 30 41 9 32 9Z"/><circle cx="32" cy="39" r="8"/></svg>`,
  milk: `<svg viewBox="0 0 64 64"><path d="M21 17h22l5 9v28H16V26Z"/><path d="M21 17v-6h20v6M16 26h32"/><path d="M32 32c-5 6-7 9-7 13a7 7 0 0 0 14 0c0-4-2-7-7-13Z"/></svg>`,
  sauce: `<svg viewBox="0 0 64 64"><path d="M25 11h14v8l5 7v27H20V26l5-7Z"/><path d="M25 19h14M20 30h24"/><path d="M27 38c4-3 7 3 10 0"/></svg>`,
  greens: `<svg viewBox="0 0 64 64"><path d="M32 53V25"/><path d="M31 34C17 34 13 22 13 13c11 0 21 5 21 17"/><path d="M33 41c14 0 18-12 18-21-11 0-21 5-21 17"/></svg>`,
  bread: `<svg viewBox="0 0 64 64"><path d="M13 29c0-9 8-16 19-16s19 7 19 16v21H13Z"/><path d="M22 22c2 2 3 5 3 8m7-12c2 3 3 6 3 10m8-5c-2 2-3 5-3 8"/></svg>`,
  pasta: `<svg viewBox="0 0 64 64"><path d="M12 23h40l-5 28H17Z"/><path d="M19 17c5 8 8-7 13 0s8-7 13 0"/><path d="M21 30c7 5 15-5 22 0m-20 8c6 5 12-5 18 0"/></svg>`,
  coffee: `<svg viewBox="0 0 64 64"><path d="M14 25h32v17c0 8-7 12-16 12S14 50 14 42Z"/><path d="M46 29h4c8 0 8 13 0 13h-4M23 18c-5-5 5-7 0-12m10 12c-5-5 5-7 0-12"/></svg>`,
  carrot: `<svg viewBox="0 0 64 64"><path d="M27 20c7 0 14 5 16 12L27 55c-5-9-9-17-9-24 0-6 4-11 9-11Z"/><path d="M28 20c-1-6-5-9-10-11m10 11c3-6 7-9 13-10m-13 10c5-3 10-4 15-2"/><path d="m23 30 8 3m-6 7 7 3"/></svg>`,
  potato: `<svg viewBox="0 0 64 64"><path d="M14 35c0-12 9-22 22-22 11 0 17 8 16 18-1 13-9 22-22 22-10 0-16-7-16-18Z"/><circle cx="27" cy="27" r="2"/><circle cx="40" cy="36" r="2"/><path d="M23 43c3 2 6 2 9 0"/></svg>`,
  garlic: `<svg viewBox="0 0 64 64"><path d="M32 14c-2 8-14 10-14 25 0 10 7 15 14 15s14-5 14-15c0-15-12-17-14-25Z"/><path d="M32 15V8m-8 34c3 3 5 4 8 4s5-1 8-4M32 24v22"/></svg>`,
  lemon: `<svg viewBox="0 0 64 64"><path d="M13 34c5-14 18-22 31-17 7 3 10 11 7 18-5 13-18 20-30 16-8-3-11-10-8-17Z"/><path d="M19 37c7-8 16-13 26-15M29 47c1-9 5-17 12-23"/></svg>`,
  olive: `<svg viewBox="0 0 64 64"><path d="M31 16c10-6 20 1 18 11-2 11-15 20-24 15-8-5-4-20 6-26Z"/><path d="M33 15c4-5 8-7 14-7"/><path d="M34 14c-8-2-14 1-17 7 7 2 13 0 17-7Z"/></svg>`,
  corn: `<svg viewBox="0 0 64 64"><path d="M32 10c9 5 13 13 11 25-2 11-6 18-11 20-5-2-9-9-11-20-2-12 2-20 11-25Z"/><path d="M25 22h14M23 30h18M23 38h18M27 16v31m10-31v31"/><path d="M21 29c-7 5-8 14-5 22m27-22c7 5 8 14 5 22"/></svg>`,
  avocado: `<svg viewBox="0 0 64 64"><path d="M32 9c-7 0-8 12-15 22-7 11-1 24 15 24s22-13 15-24C40 21 39 9 32 9Z"/><circle cx="32" cy="39" r="9"/></svg>`,
  fish: `<svg viewBox="0 0 64 64"><path d="M11 32c10-14 26-17 39-6l7-7v26l-7-7c-13 11-29 8-39-6Z"/><circle cx="42" cy="29" r="2"/><path d="M18 32h18m-7-8 7 8-7 8"/></svg>`,
  shrimp: `<svg viewBox="0 0 64 64"><path d="M48 18c-12-8-28-2-31 10-3 12 7 23 19 21 9-1 15-9 13-17-2-7-10-10-16-7-5 2-6 9-2 13 3 3 8 2 10-1"/><path d="M47 17 55 11m-7 8 8 2M19 38l-8 7m11-2-4 9"/></svg>`,
  rice: `<svg viewBox="0 0 64 64"><path d="M12 31h40c-1 14-8 22-20 22S13 45 12 31Z"/><path d="M17 29c5-9 25-9 30 0"/><path d="M22 24c2-5 5-8 9-11m1 10c2-5 5-8 9-11"/></svg>`,
  sugar: `<svg viewBox="0 0 64 64"><path d="m15 24 17-10 17 10-17 10Z"/><path d="M15 24v20l17 10 17-10V24M32 34v20"/><circle cx="25" cy="27" r="1"/><circle cx="38" cy="24" r="1"/></svg>`,
  chocolate: `<svg viewBox="0 0 64 64"><path d="M15 12h34v42H15Z"/><path d="M15 26h34M15 40h34M26 12v42m12-42v42"/><path d="m42 40 7 7"/></svg>`,
  fruit: `<svg viewBox="0 0 64 64"><circle cx="27" cy="35" r="16"/><circle cx="40" cy="38" r="13"/><path d="M31 19c0-6 4-10 10-12"/><path d="M31 18c6-5 13-4 17 1-7 4-12 4-17-1Z"/></svg>`,
  default: `<svg viewBox="0 0 64 64"><path d="M32 9c4 8 15 13 15 27a15 15 0 0 1-30 0c0-14 11-19 15-27Z"/><path d="M24 38c5 4 11 4 16 0"/></svg>`,
}

export function ingredientType(text) {
  const t = (text || '').toLocaleLowerCase('tr-TR')
  if (/dana|bonfile|köfte|kıyma|et\b|ciğer/.test(t)) return 'meat'
  if (/tavuk/.test(t)) return 'chicken'
  if (/peynir|kaşar|parmesan|cheddar|hellim/.test(t)) return 'cheese'
  if (/soğan/.test(t)) return 'onion'
  if (/biber|paprika/.test(t)) return 'pepper'
  if (/domates|salça/.test(t)) return 'tomato'
  if (/mantar/.test(t)) return 'mushroom'
  if (/yumurta/.test(t)) return 'egg'
  if (/süt|krema|yoğurt|tereyağı/.test(t)) return 'milk'
  if (/sos|mayonez|hardal|ketçap/.test(t)) return 'sauce'
  if (/marul|maydanoz|dereotu|fesleğen|roka|nane|yeşillik/.test(t)) return 'greens'
  if (/ekmek|tortilla|un/.test(t)) return 'bread'
  if (/makarna|penne|spaghetti|fettuccine/.test(t)) return 'pasta'
  if (/kahve|espresso/.test(t)) return 'coffee'
  if (/havuç/.test(t)) return 'carrot'
  if (/patates/.test(t)) return 'potato'
  if (/sarımsak/.test(t)) return 'garlic'
  if (/limon/.test(t)) return 'lemon'
  if (/zeytin/.test(t)) return 'olive'
  if (/mısır/.test(t)) return 'corn'
  if (/avokado/.test(t)) return 'avocado'
  if (/balık|ton balığı|ançüez/.test(t)) return 'fish'
  if (/karides/.test(t)) return 'shrimp'
  if (/pirinç|pilav/.test(t)) return 'rice'
  if (/şeker/.test(t)) return 'sugar'
  if (/çikolata|kakao/.test(t)) return 'chocolate'
  if (/çilek|mango|kivi|karadut|şeftali|elma|portakal/.test(t)) return 'fruit'
  return 'default'
}

function trTitleCase(text) {
  return (text || '').toLocaleLowerCase('tr-TR').replace(/(^|[\s\-/])([a-zçğıöşü])/gu, (_, sep, ch) =>
    sep + ch.toLocaleUpperCase('tr-TR')
  )
}

export { trTitleCase }
