
function trTitleCase(text){
  return (text||"").toLocaleLowerCase("tr-TR").replace(/(^|[\s\-\/])([a-zçğıöşü])/gu,function(_,sep,ch){
    return sep+ch.toLocaleUpperCase("tr-TR");
  });
}

const menu=document.getElementById("menu"),categoryGrid=document.getElementById("categoryGrid"),productGrid=document.getElementById("productGrid"),menuTitle=document.getElementById("menuTitle"),backBtn=document.getElementById("backBtn"),modal=document.getElementById("detailModal");

const categories=[
 {name:"Mezeler",img:"sezar.jpg",sub:"Sofraya sıcak bir başlangıç"},{name:"Omletler",img:"alfredo.jpg",sub:"Güne lezzetli bir başlangıç"},{name:"Krepler",img:"alfredo.jpg",sub:"Fırından sıcak krep çeşitleri"},{name:"Menemenler",img:"tavuk.jpg",sub:"Tavadan sıcak klasikler"},{name:"Salatalar",img:"sezar.jpg",sub:"Taze ve hafif seçenekler"},{name:"Makarnalar",img:"spaghetti.jpg",sub:"Özel soslar ve reçeteler"},{name:"Tavuklar",img:"tavuk.jpg",sub:"Izgara ve özel soslar"},{name:"Et Yemekleri",img:"burger.jpg",sub:"Güçlü ve seçkin lezzetler"},{name:"Aperatifler",img:"bonfrit.jpg",sub:"Paylaşmalık ve atıştırmalık lezzetler"},{name:"Burgerler",img:"burger.jpg",sub:"Doyurucu Lobby lezzetleri"},{name:"Sıcak İçecekler",img:"latte.jpg",sub:"Kahve ve çay çeşitleri"},{name:"Soğuk İçecekler",img:"latte.jpg",sub:"Ferahlatan seçenekler"},{name:"Kokteyller",img:"latte.jpg",sub:"Lobby bar seçkisi"}
];
const P=(cat,name,img,desc,cal,gram,ing,all="Bilinen temel alerjen yoktur.",chef="Reçeteye uygun şekilde taze hazırlanarak servis edilir.")=>({cat,name,img,desc,cal,gram,ing,all,chef});

const PRICE_MAP = {
  "Izgara Köfte":720,
  "Filet Steak":850,
  "Pepper Steak":850,
  "Mexican Steak":870,
  "Kaşarlı Köfte":750,
  "Soya Soslu Tavuk":440,
  "Kuzu Pirzola":850,
  "Köri Soslu Tavuk":420,
  "Tavuk Şinitzel":440,
  "Izgara Tavuk":440,
  "Mexican Tavuk":500,
  "Mantarlı Tavuk":440,
  "Yaprak Kavurma":850,
  "Tavuk Fajita":520,
  "Et Fajita":850,
  "Tavuk Güveç":440,
  "Tavuklu Krep":430,
  "Mantarlı Krep":430,
  "Tavuklu Mantarlı Krep":450,
  "Kaşarlı Omlet":200,
  "Sucuklu Omlet":260,
  "Sade Omlet":140,
  "Sahanda Yumurta":120,
  "Sahanda Sucuklu Yumurta":260,
  "Sade Menemen":200,
  "Kaşarlı Menemen":220,
  "Anne Patatesi":240,
  "Anne Patatesi Soslu":260,
  "Yeşil Salata":170,
  "Sezar Salatası":380,
  "Çoban Salata":180,
  "Kaşık Salata":180,
  "Hellim Salatası":340,
  "Penne Chicken Mushroom":360,
  "Spaghetti alla Bolognese":460,
  "Penne Arrabbiata":380,
  "Penne alla Carbonara":380,
  "Spaghetti Napoletana":220,
  "Hamburger":420,
  "Bonfrit":200,
  "Soğan Halkası":240,
  "Sosis Tabağı":320,
  "Sigara Böreği":220,
  "Çıtır Tavuk":440,
  "Çıtır Tavuk Sepeti":420,
  "Bira Tabağı":420,
  "Kaşar Pane":300,
  "Fava":170,
  "Deniz Börülcesi":180,
  "Haydari":170,
  "Atom":180,
  "Havuç Tarator":170,
  "Patlıcan Gömme":170,
  "Arnavut Ciğeri":360,
  "Enginar":180,
  "Şakşuka":180,
  "Meyve Tabağı":200,
  "DSP":280,
  "Karpuz":170,
  "Ordövr Tabağı":900,
  "İthal Peynir Tabağı":900,
  "Pancar":170,
  "Peynir":240,
  "Yoğurt":160,
  "Barbunya Pilaki":180,
  "Kuru Cacık":180,
  "Tavuk Salatası":360,
  "Greek Salata":340,
  "Kaşarlı Köfte":750,
  "Kuzu Pirzola":850,
};

function nutritionGrid(p){
 const raw=(p.nutrition||"").toString();
 const get=(rx)=>{const m=raw.match(rx);return m?m[1].trim():"—"};
 return `<div class="nutrition-title">BESİN DEĞERLERİ (1 PORSİYON)</div>
 <div class="nutrition-grid">
 <div><span>Kalori</span><strong>${get(/(?:kalori\s*:?\s*)?(\d+\s*kcal)/i)}</strong></div>
 <div><span>Protein</span><strong>${get(/protein\s*:?\s*([^,;|]+)/i)}</strong></div>
 <div><span>Karbonhidrat</span><strong>${get(/karbonhidrat\s*:?\s*([^,;|]+)/i)}</strong></div>
 <div><span>Yağ</span><strong>${get(/yağ\s*:?\s*([^,;|]+)/i)}</strong></div>
 </div>`;
}


const allergenIcons={
 gluten:`<svg viewBox="0 0 64 64"><path d="M32 7v50M32 18C22 17 18 12 17 7c9 1 14 5 15 11Zm0 10c-9-1-14-5-15-11 9 1 14 5 15 11Zm0 10c-9-1-14-5-15-11 9 1 14 5 15 11Zm0 10c-9-1-14-5-15-11 9 1 14 5 15 11Zm0-30c9-1 14-5 15-11-9 1-14 5-15 11Zm0 10c9-1 14-5 15-11-9 1-14 5-15 11Zm0 10c9-1 14-5 15-11-9 1-14 5-15 11Z"/></svg>`,
 milk:`<svg viewBox="0 0 64 64"><path d="M22 8h20v10l6 8v30H16V26l6-8Z"/><path d="M22 18h20M16 27h32"/><path d="M32 33c-5 7-7 10-7 14a7 7 0 0 0 14 0c0-4-2-7-7-14Z"/></svg>`,
 egg:`<svg viewBox="0 0 64 64"><path d="M32 8c-10 0-19 23-19 34 0 9 8 15 19 15s19-6 19-15C51 31 42 8 32 8Z"/></svg>`,
 fish:`<svg viewBox="0 0 64 64"><path d="M10 32c10-13 25-17 39-6l7-7v26l-7-7c-14 11-29 7-39-6Z"/><circle cx="41" cy="28" r="2"/><path d="M17 32h18"/></svg>`,
 crustaceans:`<svg viewBox="0 0 64 64"><path d="M32 20c-10-9-23-2-21 9 2 10 12 18 21 18s19-8 21-18c2-11-11-18-21-9Z"/><path d="M21 21 14 12m29 9 7-9M25 31h14M32 20v27M15 37l-7 6m41-6 7 6"/></svg>`,
 mustard:`<svg viewBox="0 0 64 64"><path d="M25 8h14v9l5 7v32H20V24l5-7Z"/><path d="M25 17h14M20 29h24"/></svg>`,
 peanuts:`<svg viewBox="0 0 64 64"><path d="M23 11c9-2 15 6 13 14-2 7 8 7 9 15 2 10-8 17-17 12-6-3-6-10-4-15 2-6-8-7-9-15-1-5 3-10 8-11Z"/><path d="M20 20c5 3 9 3 14 0m-9 16c5 3 10 3 15 0"/></svg>`,
 sesame:`<svg viewBox="0 0 64 64"><path d="M18 18c8 1 12 7 10 15-8-1-12-7-10-15Zm28 0c-8 1-12 7-10 15 8-1 12-7 10-15ZM25 40c7-4 14-2 18 5-7 4-14 2-18-5Z"/></svg>`,
 soy:`<svg viewBox="0 0 64 64"><path d="M13 37c5-15 17-24 30-19 11 4 12 18 4 27-8 9-25 10-34-8Z"/><circle cx="24" cy="35" r="5"/><circle cx="36" cy="29" r="5"/><circle cx="40" cy="41" r="4"/></svg>`,
 celery:`<svg viewBox="0 0 64 64"><path d="M25 56V24m7 32V18m7 38V25"/><path d="M25 26c-9-3-12-9-10-17 8 1 12 7 10 17Zm7-7c-7-5-8-12-4-18 7 3 9 10 4 18Zm7 8c9-3 12-9 10-17-8 1-12 7-10 17Z"/></svg>`,
 sulphites:`<svg viewBox="0 0 64 64"><path d="M26 8h12v14l12 22c3 6-1 12-8 12H22c-7 0-11-6-8-12l12-22Z"/><path d="M22 39h20"/><circle cx="28" cy="46" r="2"/><circle cx="37" cy="49" r="2"/></svg>`,
 nuts:`<svg viewBox="0 0 64 64"><path d="M32 8c-8 8-14 18-14 29 0 12 7 19 14 19s14-7 14-19C46 26 40 16 32 8Z"/><path d="M32 9v47M24 28c5 2 8 6 8 12m8-12c-5 2-8 6-8 12"/></svg>`,
 default:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22"/><path d="M32 18v18m0 9v1"/></svg>`
};
function allergenType(s){
 const t=s.toLocaleLowerCase("tr-TR");
 if(/gluten|buğday/.test(t))return"gluten"; if(/süt|tereyağ|krema|yoğurt|peynir|kaşar|cheddar/.test(t))return"milk";
 if(/yumurta/.test(t))return"egg"; if(/balık|ton balığı|ançüez/.test(t))return"fish";
 if(/kabuklu|karides|yengeç|ıstakoz/.test(t))return"crustaceans"; if(/yer fıstığı|fıstık/.test(t))return"peanuts";
 if(/susam/.test(t))return"sesame"; if(/soya/.test(t))return"soy"; if(/hardal/.test(t))return"mustard";
 if(/kereviz/.test(t))return"celery"; if(/sülfit/.test(t))return"sulphites"; if(/sert kabuklu|badem|ceviz|fındık/.test(t))return"nuts";
 return"default";
}
function allergenIconCards(text){
 if(!text)return `<span class="allergen-none">Belirtilen alerjen yok</span>`;
 return `<div class="allergen-icons">${text.split(/[,•|;]+/).map(x=>x.trim()).filter(Boolean).map(x=>`<div class="allergen-icon-item"><span class="allergen-line-icon">${allergenIcons[allergenType(x)]}</span><span>${x}</span></div>`).join("")}</div>`;
}

const ingredientIcons={
 meat:`<svg viewBox="0 0 64 64"><path d="M16 37c-5-8 1-20 12-22 10-2 19 3 21 11 2 7-2 15-10 19-9 5-18 1-23-8Z"/><path d="M24 29c3-5 10-7 15-3 4 3 3 9-1 12-5 4-12 2-15-3"/><circle cx="35" cy="31" r="3"/></svg>`,
 chicken:`<svg viewBox="0 0 64 64"><path d="M20 38c-7-7-4-19 5-24 9-5 20 0 22 9 2 8-4 17-13 19-5 1-10 0-14-4Z"/><path d="M18 39 9 48m2-7 6 6m-8-1 5 5"/></svg>`,
 cheese:`<svg viewBox="0 0 64 64"><path d="M10 27 34 13l20 13v25H10Z"/><path d="M10 27h44M34 13v14"/><circle cx="25" cy="37" r="3"/><circle cx="43" cy="43" r="4"/><circle cx="19" cy="47" r="2"/></svg>`,
 onion:`<svg viewBox="0 0 64 64"><path d="M32 14c1 8 13 11 13 25 0 9-6 15-13 15s-13-6-13-15c0-14 12-17 13-25Z"/><path d="M32 14c-5 5-7 9-7 14m7-14c5 5 7 9 7 14M27 11c2 3 3 5 5 7 2-2 3-4 5-7"/></svg>`,
 pepper:`<svg viewBox="0 0 64 64"><path d="M34 18c2-5 6-7 11-7"/><path d="M34 20c-9-5-19 2-18 13 1 12 9 21 16 20 8 0 16-10 17-21 1-10-7-16-15-12Z"/><path d="M31 22c-2 10-1 20 2 29"/></svg>`,
 tomato:`<svg viewBox="0 0 64 64"><circle cx="32" cy="35" r="18"/><path d="m32 17-5-6m5 6 5-6m-5 6-8 1m8-1 8 1"/><path d="M22 31c5 3 15 3 20 0"/></svg>`,
 mushroom:`<svg viewBox="0 0 64 64"><path d="M12 31c2-12 10-19 20-19s18 7 20 19Z"/><path d="M26 31v17c0 4 12 4 12 0V31"/><path d="M19 27c3-4 7-6 13-6s10 2 13 6"/></svg>`,
 egg:`<svg viewBox="0 0 64 64"><path d="M32 9c-9 0-18 21-18 31 0 9 8 15 18 15s18-6 18-15C50 30 41 9 32 9Z"/><circle cx="32" cy="39" r="8"/></svg>`,
 milk:`<svg viewBox="0 0 64 64"><path d="M21 17h22l5 9v28H16V26Z"/><path d="M21 17v-6h20v6M16 26h32"/><path d="M32 32c-5 6-7 9-7 13a7 7 0 0 0 14 0c0-4-2-7-7-13Z"/></svg>`,
 sauce:`<svg viewBox="0 0 64 64"><path d="M25 11h14v8l5 7v27H20V26l5-7Z"/><path d="M25 19h14M20 30h24"/><path d="M27 38c4-3 7 3 10 0"/></svg>`,
 greens:`<svg viewBox="0 0 64 64"><path d="M32 53V25"/><path d="M31 34C17 34 13 22 13 13c11 0 21 5 21 17"/><path d="M33 41c14 0 18-12 18-21-11 0-21 5-21 17"/></svg>`,
 bread:`<svg viewBox="0 0 64 64"><path d="M13 29c0-9 8-16 19-16s19 7 19 16v21H13Z"/><path d="M22 22c2 2 3 5 3 8m7-12c2 3 3 6 3 10m8-5c-2 2-3 5-3 8"/></svg>`,
 pasta:`<svg viewBox="0 0 64 64"><path d="M12 23h40l-5 28H17Z"/><path d="M19 17c5 8 8-7 13 0s8-7 13 0"/><path d="M21 30c7 5 15-5 22 0m-20 8c6 5 12-5 18 0"/></svg>`,
 coffee:`<svg viewBox="0 0 64 64"><path d="M14 25h32v17c0 8-7 12-16 12S14 50 14 42Z"/><path d="M46 29h4c8 0 8 13 0 13h-4M23 18c-5-5 5-7 0-12m10 12c-5-5 5-7 0-12"/></svg>`,

 carrot:`<svg viewBox="0 0 64 64"><path d="M27 20c7 0 14 5 16 12L27 55c-5-9-9-17-9-24 0-6 4-11 9-11Z"/><path d="M28 20c-1-6-5-9-10-11m10 11c3-6 7-9 13-10m-13 10c5-3 10-4 15-2"/><path d="m23 30 8 3m-6 7 7 3"/></svg>`,
 potato:`<svg viewBox="0 0 64 64"><path d="M14 35c0-12 9-22 22-22 11 0 17 8 16 18-1 13-9 22-22 22-10 0-16-7-16-18Z"/><circle cx="27" cy="27" r="2"/><circle cx="40" cy="36" r="2"/><path d="M23 43c3 2 6 2 9 0"/></svg>`,
 garlic:`<svg viewBox="0 0 64 64"><path d="M32 14c-2 8-14 10-14 25 0 10 7 15 14 15s14-5 14-15c0-15-12-17-14-25Z"/><path d="M32 15V8m-8 34c3 3 5 4 8 4s5-1 8-4M32 24v22"/></svg>`,
 lemon:`<svg viewBox="0 0 64 64"><path d="M13 34c5-14 18-22 31-17 7 3 10 11 7 18-5 13-18 20-30 16-8-3-11-10-8-17Z"/><path d="M19 37c7-8 16-13 26-15M29 47c1-9 5-17 12-23"/></svg>`,
 olive:`<svg viewBox="0 0 64 64"><path d="M31 16c10-6 20 1 18 11-2 11-15 20-24 15-8-5-4-20 6-26Z"/><path d="M33 15c4-5 8-7 14-7"/><path d="M34 14c-8-2-14 1-17 7 7 2 13 0 17-7Z"/></svg>`,
 corn:`<svg viewBox="0 0 64 64"><path d="M32 10c9 5 13 13 11 25-2 11-6 18-11 20-5-2-9-9-11-20-2-12 2-20 11-25Z"/><path d="M25 22h14M23 30h18M23 38h18M27 16v31m10-31v31"/><path d="M21 29c-7 5-8 14-5 22m27-22c7 5 8 14 5 22"/></svg>`,
 avocado:`<svg viewBox="0 0 64 64"><path d="M32 9c-7 0-8 12-15 22-7 11-1 24 15 24s22-13 15-24C40 21 39 9 32 9Z"/><circle cx="32" cy="39" r="9"/></svg>`,
 fish:`<svg viewBox="0 0 64 64"><path d="M11 32c10-14 26-17 39-6l7-7v26l-7-7c-13 11-29 8-39-6Z"/><circle cx="42" cy="29" r="2"/><path d="M18 32h18m-7-8 7 8-7 8"/></svg>`,
 shrimp:`<svg viewBox="0 0 64 64"><path d="M48 18c-12-8-28-2-31 10-3 12 7 23 19 21 9-1 15-9 13-17-2-7-10-10-16-7-5 2-6 9-2 13 3 3 8 2 10-1"/><path d="M47 17 55 11m-7 8 8 2M19 38l-8 7m11-2-4 9"/></svg>`,
 rice:`<svg viewBox="0 0 64 64"><path d="M12 31h40c-1 14-8 22-20 22S13 45 12 31Z"/><path d="M17 29c5-9 25-9 30 0"/><path d="M22 24c2-5 5-8 9-11m1 10c2-5 5-8 9-11"/></svg>`,
 sugar:`<svg viewBox="0 0 64 64"><path d="m15 24 17-10 17 10-17 10Z"/><path d="M15 24v20l17 10 17-10V24M32 34v20"/><circle cx="25" cy="27" r="1"/><circle cx="38" cy="24" r="1"/></svg>`,
 chocolate:`<svg viewBox="0 0 64 64"><path d="M15 12h34v42H15Z"/><path d="M15 26h34M15 40h34M26 12v42m12-42v42"/><path d="m42 40 7 7"/></svg>`,
 fruit:`<svg viewBox="0 0 64 64"><circle cx="27" cy="35" r="16"/><circle cx="40" cy="38" r="13"/><path d="M31 19c0-6 4-10 10-12"/><path d="M31 18c6-5 13-4 17 1-7 4-12 4-17-1Z"/></svg>`,

 default:`<svg viewBox="0 0 64 64"><path d="M32 9c4 8 15 13 15 27a15 15 0 0 1-30 0c0-14 11-19 15-27Z"/><path d="M24 38c5 4 11 4 16 0"/></svg>`
};
function ingredientType(text){
 const t=text.toLocaleLowerCase("tr-TR");
 if(/dana|bonfile|köfte|kıyma|et\b|ciğer/.test(t))return "meat";
 if(/tavuk/.test(t))return "chicken";
 if(/peynir|kaşar|parmesan|cheddar|hellim/.test(t))return "cheese";
 if(/soğan/.test(t))return "onion";
 if(/biber|paprika/.test(t))return "pepper";
 if(/domates|salça/.test(t))return "tomato";
 if(/mantar/.test(t))return "mushroom";
 if(/yumurta/.test(t))return "egg";
 if(/süt|krema|yoğurt|tereyağı/.test(t))return "milk";
 if(/sos|mayonez|hardal|ketçap/.test(t))return "sauce";
 if(/marul|maydanoz|dereotu|fesleğen|roka|nane|yeşillik/.test(t))return "greens";
 if(/ekmek|tortilla|un/.test(t))return "bread";
 if(/makarna|penne|spaghetti|fettuccine/.test(t))return "pasta";
 if(/kahve|espresso/.test(t))return "coffee";
 if(/havuç/.test(t))return "carrot";
 if(/patates/.test(t))return "potato";
 if(/sarımsak/.test(t))return "garlic";
 if(/limon/.test(t))return "lemon";
 if(/zeytin/.test(t))return "olive";
 if(/mısır/.test(t))return "corn";
 if(/avokado/.test(t))return "avocado";
 if(/balık|ton balığı|ançüez/.test(t))return "fish";
 if(/karides/.test(t))return "shrimp";
 if(/pirinç|pilav/.test(t))return "rice";
 if(/şeker/.test(t))return "sugar";
 if(/çikolata|kakao/.test(t))return "chocolate";
 if(/çilek|mango|kivi|karadut|şeftali|elma|portakal/.test(t))return "fruit";
 return "default";
}
function ingredientIconCards(text){
 if(!text)return "";
 const parts=text.split(/[,•|;]+/).map(x=>x.trim()).filter(Boolean).slice(0,6);
 return `<div class="ingredient-icons">${parts.map(item=>{
   const type=ingredientType(item);
   const label=item.split(":")[0].replace(/\([^)]*\)/g,"").trim();
   return `<div class="ingredient-icon-item"><span class="ingredient-line-icon">${ingredientIcons[type]||ingredientIcons.default}</span><span>${label}</span></div>`;
 }).join("")}</div>`;
}

const products=[
// Yalnızca kullanıcının gerçek reçete dosyalarındaki yemekler
P("Mezeler","Atom","atom.jpg","Acı biberli süzme yoğurt mezesi.","250 kcal","160 g","Süzme yoğurt, sarımsak, kuru acı biber, tereyağı, zeytinyağı, tuz.","Süt ve süt ürünleri."),
P("Mezeler","Arnavut Ciğeri","arnavut-cigeri.jpg","Soğan salatası ve limonla servis edilen dana ciğeri.","460 kcal","250 g (garnitür dahil)","Dana ciğeri, un, ayçiçek yağı, tuz, kuru soğan, sumak, maydanoz, limon.","Gluten."),
P("Mezeler","Fava","fava.jpg","Zeytinyağlı kuru bakla ezmesi.","290 kcal","150 g","Kuru bakla 70 g, soğan 25 g, zeytinyağı 25 ml, su, şeker 2 g, tuz 2 g, limon suyu 5 ml, dereotu 3 g."),
P("Mezeler","Haydari","haydari.jpg","Yoğun kıvamlı klasik yoğurt mezesi.","230 kcal","160 g","Süzme yoğurt 120 g, beyaz peynir 25 g, sarımsak 3 g, dereotu 4 g, kuru nane 1 g, zeytinyağı 8 ml, tuz 1 g.","Süt ve süt ürünleri."),
P("Mezeler","Patlıcan Gömme","patlican-gomme.jpg","Köz patlıcan, yoğurt ve tahinle hazırlanan soğuk meze.","260 kcal","180 g","Közlenmiş patlıcan 100 g, süzme yoğurt 60 g, sarımsak 3 g, tahin 10 g, zeytinyağı 15 ml, limon suyu 5 ml, tuz 2 g, maydanoz.","Süt ve süt ürünleri, susam."),
P("Mezeler","Kuru Cacık","kuru-cacik.jpg","Süzme yoğurt ve salatalıkla yoğun kıvamlı cacık.","190 kcal","185 g","Süzme yoğurt 120 g, salatalık 50 g, sarımsak 3 g, zeytinyağı 13 ml, dereotu 3 g, kuru nane, tuz 2 g.","Süt ve süt ürünleri."),
P("Mezeler","Havuç Tarator","havuc-tarator.jpg","Sotelenmiş havuç, süzme yoğurt ve ceviz.","300 kcal","200 g","Havuç 80 g, süzme yoğurt 100 g, sarımsak 3 g, zeytinyağı 15 ml, ceviz 13 g, tuz 2 g, isteğe bağlı dereotu.","Süt ve süt ürünleri, ceviz."),
P("Mezeler","Deniz Börülcesi","deniz-borulcesi.jpg","Sarımsaklı limon ve zeytinyağıyla servis edilir.","120 kcal","90–100 g","Deniz börülcesi 100 g, zeytinyağı 10 ml, limon suyu 10 ml, sarımsak 3 g."),
P("Mezeler","Barbunya Pilaki","barbunya-pilaki.jpg","Zeytinyağlı barbunya, havuç ve patates ile hazırlanan klasik meze.","240 kcal","180 g","Barbunya, havuç, patates, soğan, domates, zeytinyağı, sarımsak, maydanoz.","Bilinen temel alerjen yoktur."),

P("Mezeler","Şakşuka","saksuka.jpg","Kızarmış patlıcan ve biberlerin domates sosuyla buluştuğu geleneksel meze.","310 kcal","200 g","Patlıcan, kabak, yeşil biber, domates sosu, sarımsak, zeytinyağı.","Bilinen temel alerjen yoktur."),

P("Mezeler","Pancar","pancar.jpg","Haşlanmış pancarın sarımsaklı yoğurt ile servis edildiği soğuk meze.","210 kcal","170 g","Pancar, süzme yoğurt, sarımsak, zeytinyağı.","Süt ve süt ürünleri."),

P("Mezeler","Yoğurt","yogurt.jpg","Süzme yoğurt üzerine zeytinyağı ile servis edilir.","170 kcal","150 g","Süzme yoğurt.","Süt ve süt ürünleri."),

P("Mezeler","Peynir","peynir.jpg","Günlük beyaz peynir tabağı.","260 kcal","150 g","Beyaz peynir.","Süt ve süt ürünleri."),

P("Mezeler","İthal Peynir Tabağı","ithal-peynir-tabagi.jpg","Seçkin ithal peynir çeşitleriyle hazırlanan özel tabak.","520 kcal","220 g","Brie, Gouda, Cheddar, Parmesan, Grissini.","Gluten, süt ve süt ürünleri."),

P("Mezeler","Enginar","enginar.jpg","Zeytinyağlı enginar kalbi, bezelye ve havuç ile hazırlanır.","180 kcal","180 g","Enginar, bezelye, havuç, patates, zeytinyağı.","Bilinen temel alerjen yoktur."),

P("Mezeler","DSP","dsp.jpg","Domates salatalık peynir.","340 kcal","220 g","İçeriğe göre değişebilir."),

P("Mezeler","Meyve Tabağı","meyve-tabagi.jpg","Mevsim meyvelerinden hazırlanan ferah tabak.","190 kcal","350 g","Karpuz, kavun, üzüm, portakal, kivi, çilek.","Bilinen temel alerjen yoktur."),

P("Mezeler","Ordövr Tabağı","ordovr-tabagi.jpg","Karışık peynir, şarküteri ve garnitürlerden oluşan başlangıç tabağı.","690 kcal","420 g","Peynir çeşitleri, salam, zeytin, turşu, domates, salatalık.","Süt ve süt ürünleri."),

P("Mezeler","Karpuz","karpuz.jpg","Soğuk servis edilen dilim karpuz.","90 kcal","300 g","Karpuz.","Bilinen temel alerjen yoktur."),

P("Mezeler","Kavun","kavun.jpg","Soğuk servis edilen taze kavun dilimleri.","110 kcal","300 g","Kavun.","Bilinen temel alerjen yoktur."),

P("Omletler","Sade Omlet","sade-omlet.jpg","Tereyağında klasik omlet.","280 kcal","160 g","Yumurta 3 adet (150 g), tereyağı 10 g, tuz 2 g, karabiber 1 g.","Yumurta, süt ve süt ürünleri."),
P("Omletler","Kaşarlı Omlet","kasarli-omlet.jpg","Rendelenmiş kaşar peynirli omlet.","420 kcal","200 g","Yumurta 3 adet (150 g), kaşar peyniri 40 g, tereyağı 10 g, tuz 2 g, karabiber 1 g.","Yumurta, süt ve süt ürünleri."),
P("Omletler","Sucuklu Omlet","sucuklu-omlet.jpg","Hafif kızartılmış sucuklu omlet.","480 kcal","210 g","Yumurta 3 adet (150 g), sucuk 50 g, tereyağı 10 g, tuz 1 g, karabiber 1 g.","Yumurta, süt ve süt ürünleri."),
P("Omletler","Sahanda Yumurta","sahanda-yumurta.jpg","Tereyağında sahanda iki yumurta.","220 kcal","110 g","Yumurta 2 adet (100 g), tereyağı 10 g, tuz 1 g, isteğe bağlı karabiber.","Yumurta, süt ve süt ürünleri."),
P("Omletler","Sahanda Sucuklu Yumurta","sahanda-sucuklu-yumurta.jpg","Tereyağında sucuk ve sahanda yumurta.","420 kcal","160 g","Yumurta 2 adet (100 g), sucuk 50 g, tereyağı 10 g, isteğe bağlı tuz ve karabiber.","Yumurta, süt ve süt ürünleri."),

P("Krepler","Tavuklu Krep","tavuklu-krep.jpg","Kremalı tavuk harcı ve kaşarla fırınlanan krep.","760 kcal","420 g","Un 50 g, yumurta 1 adet, süt 100 ml, sıvı yağ 15 ml, tavuk göğsü 120 g, mantar 50 g, soğan 20 g, kapya biber 20 g, yeşil biber 15 g, krema 40 ml, kaşar 30 g, tuz, karabiber, kekik.","Gluten, yumurta, süt ve süt ürünleri."),
P("Krepler","Mantarlı Krep","mantarli-krep.jpg","Kremalı mantar harcı ve kaşarla fırınlanan krep.","680 kcal","390 g","Un 50 g, yumurta 1 adet, süt 100 ml, sıvı yağ 5 ml, mantar 120 g, soğan 20 g, sarımsak 3 g, tereyağı 10 g, krema 50 ml, kaşar 30 g, tuz, karabiber, kekik, maydanoz.","Gluten, yumurta, süt ve süt ürünleri."),
P("Krepler","Tavuklu Mantarlı Krep","tavuklu-mantarli-krep.jpg","Tavuk ve mantarlı kremalı harçla fırınlanan krep.","780 kcal","420 g","Un 50 g, yumurta 1 adet, süt 100 ml, sıvı yağ 5 ml, tavuk 100 g, mantar 80 g, soğan 20 g, sarımsak 3 g, tereyağı 10 g, krema 50 ml, kaşar 30 g, tuz, karabiber, kekik, maydanoz.","Gluten, yumurta, süt ve süt ürünleri."),

P("Menemenler","Sade Menemen","sade-menemen.jpg","Domates ve sivri biberle klasik menemen.","330 kcal","270 g","Yumurta 2 adet (100 g), domates 120 g, yeşil sivri biber 30 g, tereyağı 10 g, zeytinyağı 5 ml, tuz 2 g, isteğe bağlı karabiber ve pul biber.","Yumurta, süt ve süt ürünleri."),
P("Menemenler","Kaşarlı Menemen","kasarli-menemen.jpg","Kaşar peyniriyle zenginleştirilmiş menemen.","470 kcal","310 g","Yumurta 2 adet (100 g), domates 120 g, yeşil sivri biber 30 g, kaşar 40 g, tereyağı 10 g, zeytinyağı 5 ml, tuz 2 g, isteğe bağlı karabiber ve pul biber.","Yumurta, süt ve süt ürünleri."),

P("Salatalar","Sezar Salatası","sezar-salatasi.jpg","Izgara tavuk, parmesan ve krutonlu Sezar salatası.","520 kcal","325 g","Izgara tavuk 120 g, marul 100 g, kruton 25 g, parmesan 20 g; Sezar sos: mayonez 25 g, hardal 5 g, limon suyu 10 ml, sarımsak 3 g, zeytinyağı 10 ml, Worcestershire sos 5 ml, tuz, karabiber.","Gluten, süt ve süt ürünleri, yumurta, hardal; Worcestershire içeriğine göre balık içerebilir."),
P("Salatalar","Çoban Salata","coban-salata.jpg","Günlük doğranmış taze sebzeler.","180 kcal","210 g","Domates 80 g, salatalık 60 g, yeşil sivri biber 20 g, soğan 20 g, maydanoz 5 g, zeytinyağı 10 ml, limon suyu 10 ml, tuz 2 g, isteğe bağlı sumak."),
P("Salatalar","Kaşık Salata","kasik-salata.jpg","İnce doğranmış sebzeler ve nar ekşisi.","210 kcal","230 g","Domates 80 g, salatalık 60 g, kapya biber 20 g, yeşil sivri biber 15 g, soğan 20 g, maydanoz 8 g, nar ekşisi 10 ml, zeytinyağı 10 ml, limon suyu 5 ml, tuz 2 g, isteğe bağlı sumak."),
P("Salatalar","Yeşil Salata","yesil-salata.jpg","Taze yeşilliklerden hafif salata.","150 kcal","175 g","Göbek marul 50 g, kıvırcık 40 g, roka 15 g, maydanoz 5 g, dereotu 3 g, salatalık 40 g, zeytinyağı 10 ml, limon suyu 10 ml, tuz 2 g."),
P("Salatalar","Hellim Salatası","hellim-salatasi.jpg","Izgara hellim ve Akdeniz yeşillikleri.","430 kcal","300 g","Hellim 80 g, göbek marul 50 g, Akdeniz yeşillikleri 30 g, roka 15 g, cherry domates 50 g, salatalık 40 g, kırmızı soğan 15 g, zeytinyağı 10 ml, limon suyu 10 ml, nar ekşisi 5 ml, tuz, karabiber.","Süt ve süt ürünleri."),
P("Salatalar","Tavuk Salatası","tavuk-salatasi.jpg","Izgara tavuk, taze yeşillikler ve özel sos ile hazırlanır.","480 kcal","320 g","Izgara tavuk, marul, roka, domates, salatalık, mısır, zeytinyağı.","Bilinen temel alerjen yoktur."),

P("Salatalar","Greek Salata","greek-salata.jpg","Beyaz peynirli Akdeniz usulü Yunan salatası.","360 kcal","300 g","Domates, salatalık, beyaz peynir, zeytin, kırmızı soğan, kekik, zeytinyağı.","Süt ve süt ürünleri."),

P("Makarnalar","Spaghetti Napoletana","spaghetti-napoletana.jpg","Domates, sarımsak ve fesleğenli spaghetti.","560 kcal","300 g","Spaghetti 100 g, domates veya domates püresi 150 g, domates salçası 10 g, sarımsak 5 g, zeytinyağı 15 ml, fesleğen 5 g, tuz 3 g, karabiber 1 g, şeker 2 g, isteğe bağlı parmesan 15 g.","Gluten; parmesan eklenirse süt ve süt ürünleri."),
P("Makarnalar","Penne Chicken Mushroom","penne-chicken-mushroom.jpg","Kremalı tavuk ve mantarlı penne.","760 kcal","380 g","Penne 100 g, tavuk göğsü 100 g, mantar 70 g, soğan 20 g, sarımsak 5 g, sıvı yağ 10 ml, tereyağı 10 g, krema 80 ml, parmesan 15 g, tuz 3 g, karabiber 1 g, kekik 1 g, maydanoz 3 g.","Gluten, süt ve süt ürünleri."),
P("Makarnalar","Spaghetti alla Bolognese","spaghetti-alla-bolognese.jpg","Dana kıymalı yoğun domates soslu spaghetti.","700 kcal","380 g","Spaghetti 100 g, dana kıyma 100 g, domates püresi 120 g, domates salçası 10 g, soğan 30 g, havuç 20 g, kereviz sapı 15 g, sarımsak 5 g, zeytinyağı 15 ml, tuz, karabiber, kekik, şeker, parmesan 15 g.","Gluten, süt ve süt ürünleri; kereviz."),
P("Makarnalar","Penne Arrabbiata","penne-arrabbiata.jpg","Acı pul biberli domates sosunda penne.","540 kcal","300 g","Penne 100 g, domates püresi, domates salçası, sarımsak, zeytinyağı, acı pul biber, tuz, karabiber, şeker, maydanoz, isteğe bağlı parmesan.","Gluten; parmesan eklenirse süt ve süt ürünleri."),
P("Makarnalar","Penne alla Carbonara","penne-alla-carbonara.jpg","Füme et, yumurta sarısı, parmesan ve kremalı penne.","820 kcal","330 g","Penne 100 g, dana veya hindi füme 50 g, yumurta sarısı 2 adet (40 g), parmesan 25 g, krema 50 ml, tereyağı 10 g, isteğe bağlı sarımsak 3 g, karabiber 2 g, tuz 2 g.","Gluten, yumurta, süt ve süt ürünleri."),

P("Tavuklar","Soya Soslu Tavuk","soya-soslu-tavuk.jpg","Soya sosu ve sebzelerle sotelenmiş tavuk.","520 kcal","330 g","Tavuk göğsü 180 g, soya sosu, sebzeler, yağ ve reçetedeki baharatlar.","Soya; soya sosuna göre gluten içerebilir."),
P("Tavuklar","Köri Soslu Tavuk","kori-soslu-tavuk.jpg","Kremalı köri sosunda tavuk ve mantar.","650 kcal","390 g","Tavuk 180 g, mantar 50 g, soğan 30 g, sarımsak 5 g, tereyağı 10 g, sıvı yağ 10 ml, krema 100 ml, köri 5 g, tuz 2 g, karabiber 1 g, isteğe bağlı un 5 g.","Süt ve süt ürünleri; un eklenirse gluten."),
P("Tavuklar","Tavuk Şinitzel","tavuk-sinitzel.jpg","Çıtır pane tavuk, patates ve limon.","760 kcal","380 g (garnitür dahil)","Tavuk göğsü 180 g, un 30 g, yumurta 1 adet, galeta unu 60 g, tuz 2 g, karabiber 1 g, isteğe bağlı kırmızı biber, kızartma yağı; patates 120 g, limon, maydanoz.","Gluten, yumurta."),
P("Tavuklar","Tavuk Fajita","tavuk-fajita.jpg","Renkli biberlerle yüksek ateşte sotelenmiş tavuk.","690 kcal","460 g (tortilla dahil)","Tavuk 180 g, kapya biber 40 g, yeşil biber 40 g, sarı biber 40 g, soğan 50 g, sıvı yağ 15 ml, tereyağı 10 g, sarımsak 5 g, tuz, karabiber, kırmızı biber, kimyon, kekik; tortilla 2 adet (80 g), limon.","Gluten, süt ve süt ürünleri."),
P("Tavuklar","Izgara Tavuk","izgara-tavuk.jpg","Marine edilmiş ızgara tavuk ve közlenmiş sebzeler.","430 kcal","315 g (garnitür dahil)","Tavuk göğsü 200 g, zeytinyağı 10 ml, tuz 2 g, karabiber 1 g, kekik 1 g, kırmızı biber 1 g, isteğe bağlı sarımsak 3 g; ızgara sebze 100 g, limon 15 g."),
P("Tavuklar","Tavuk Güveç","tavuk-guvec.jpg","Sebze ve kaşarla fırınlanan tavuk güveç.","620 kcal","460 g","Tavuk 180 g, soğan 40 g, kapya biber 30 g, yeşil biber 30 g, domates 100 g, domates salçası 10 g, sarımsak 5 g, tereyağı 10 g, zeytinyağı 10 ml, kaşar 40 g, tuz, karabiber, kekik, kırmızı biber.","Süt ve süt ürünleri."),
P("Tavuklar","Mexican Tavuk","mexican-tavuk.jpg","Mısır ve kırmızı fasulyeli baharatlı tavuk.","590 kcal","410 g","Tavuk, soğan, sarımsak, biberler, domates püresi, mısır, haşlanmış kırmızı fasulye, tereyağı, zeytinyağı, kekik, acı pul biber."),
P("Tavuklar","Mantarlı Tavuk","mantarli-tavuk.jpg","Kremalı mantar soslu tavuk.","670 kcal","410 g","Tavuk 180 g, mantar 100 g, soğan 30 g, sarımsak 5 g, tereyağı 10 g, zeytinyağı 10 ml, krema 80 ml, tuz 2 g, karabiber 1 g, kekik 1 g, maydanoz 3 g.","Süt ve süt ürünleri."),

P("Et Yemekleri","Yaprak Kavurma","yaprak-kavurma.jpg","Dana bonfileden yüksek ateşte yaprak kavurma.","560 kcal","285 g","Dana bonfile 180 g, tereyağı 15 g, zeytinyağı 10 ml, soğan 40 g, sarımsak 5 g, yeşil sivri biber 30 g, tuz 2 g, karabiber 1 g, kekik 1 g.","Süt ve süt ürünleri."),
P("Et Yemekleri","Filet Steak","fillet-steak.jpg","Tereyağı ve aromatik otlarla pişmiş dana bonfile.","780 kcal","460 g (garnitür dahil)","Dana bonfile 220 g, tereyağı 15 g, zeytinyağı 10 ml, sarımsak 5 g, taze biberiye 3 g, taze kekik 2 g, tuz 3 g, karabiber 2 g; patates püresi 120 g, ızgara sebze 80 g.","Süt ve süt ürünleri."),
P("Et Yemekleri","Pepper Steak","pepper-steak.jpg","Kremalı tane karabiber soslu dana bonfile.","840 kcal","500 g (garnitür dahil)","Dana bonfile 220 g, zeytinyağı 10 ml, tereyağı 25 g, tuz; arpacık soğan 20 g, sarımsak 3 g, tane karabiber 5 g, krema 80 ml, demi-glace veya et suyu 50 ml, isteğe bağlı Dijon hardalı 5 g; patates püresi 120 g, ızgara sebze 80 g.","Süt ve süt ürünleri; isteğe bağlı hardal."),
P("Et Yemekleri","Mexican Steak","mexican-steak.jpg","Meksika soslu dana bonfile.","800 kcal","520 g (garnitür dahil)","Dana bonfile 220 g, zeytinyağı 10 ml, tereyağı 10 g, tuz, karabiber; kapya biber 40 g, yeşil biber 30 g, kırmızı soğan 40 g, mısır 30 g, kırmızı fasulye 40 g, domates püresi 60 g, sarımsak 5 g, kimyon, kırmızı biber, acı pul biber, kekik; patates 120 g.","Süt ve süt ürünleri."),
P("Et Yemekleri","Et Fajita","et-fajita.jpg","Renkli biberlerle yüksek ateşte sotelenmiş dana bonfile.","830 kcal","500 g (tortilla dahil)","Dana bonfile 180 g, kapya biber 40 g, sarı biber 40 g, yeşil biber 40 g, soğan 50 g, zeytinyağı 15 ml, tereyağı 10 g, sarımsak 5 g, tuz, karabiber, kimyon, kırmızı biber, kekik; tortilla 2 adet (80 g), limon, isteğe bağlı guacamole ve ekşi krema.","Gluten, süt ve süt ürünleri."),
P("Et Yemekleri","Izgara Köfte","izgara-kofte.jpg","Izgara dana köfte ve klasik garnitür.","760 kcal","430 g (garnitür dahil)","Dana kıyma 180 g, soğan 30 g, galeta unu 15 g, yumurta 25 g, sarımsak 3 g, tuz 2 g, karabiber 1 g, kimyon 1 g, kırmızı biber 1 g, maydanoz 5 g; patates 120 g, ızgara domates 50 g, biber 30 g, soğan piyazı 30 g.","Gluten, yumurta."),
P("Et Yemekleri","Kaşarlı Köfte","kasarli-kofte.jpg","Izgara dana köftelerinin üzerine eritilmiş kaşar peyniri ile hazırlanır. Pilav, patates kızartması ve mevsim salatası ile servis edilir.","890 kcal","470 g","Dana kıyma, kaşar peyniri, soğan, galeta unu, yumurta, baharatlar.","Gluten, yumurta, süt ve süt ürünleri."),
P("Et Yemekleri","Kuzu Pirzola","kuzu-pirzola.jpg","Özel baharatlarla marine edilmiş kuzu pirzola. Pilav, patates kızartması ve mevsim salatası ile servis edilir.","760 kcal","300 g","Kuzu pirzola, zeytinyağı, sarımsak, kekik, biberiye.","Bilinen temel alerjen yoktur."),

P("Burgerler","Hamburger","hamburger.jpg","Dana köfteli klasik hamburger.","720 kcal","360 g","Hamburger ekmeği 1 adet (80 g), dana hamburger köftesi 150 g, cheddar 20 g, marul 15 g, domates 30 g, kornişon turşu 20 g, tereyağı 5 g, isteğe bağlı sıvı yağ 5 ml.","Gluten, süt ve süt ürünleri."),
P("Aperatifler","Anne Patatesi","anne-patatesi.jpg","Özel baharatlı çıtır patates.","520 kcal","250 g","Patates, baharat."),
P("Aperatifler","Anne Patatesi Soslu","anne-patatesi-soslu.jpg","Özel soslarla servis edilen çıtır patates.","610 kcal","300 g","Patates, özel soslar."),
P("Aperatifler","Bira Tabağı","bira-tabagi.jpg","Sosis, bonfrit, sigara böreği, soğan halkası, kaşar pane ve turşu.","1180 kcal","750 g","Karışık aperatifler.","Gluten, süt ürünleri."),
P("Aperatifler","Bonfrit","bonfrit.jpg","Çıtır patates kızartması.","480 kcal","220 g","Patates."),
P("Aperatifler","Hellim Peyniri","hellim-peyniri.jpg","Izgara hellim peyniri.","430 kcal","180 g","Hellim peyniri.","Süt ve süt ürünleri."),
P("Aperatifler","Kaşar Pane","kasar-pane.jpg","Pane kaplamalı kızarmış kaşar.","590 kcal","220 g","Kaşar peyniri.","Gluten, süt ürünleri."),
P("Aperatifler","Sigara Böreği","sigara-boregi.jpg","Peynirli sigara böreği.","510 kcal","180 g","Yufka, peynir.","Gluten, süt ürünleri."),
P("Aperatifler","Sosis Tabağı","sosis-tabagi.jpg","Izgara sosis tabağı.","670 kcal","350 g","Dana sosis."),
P("Aperatifler","Soğan Halkası","sogan-halkasi.jpg","Pane soğan halkaları.","450 kcal","200 g","Soğan.","Gluten."),
P("Aperatifler","Çıtır Tavuk","citir-tavuk.jpg","Pane çıtır tavuk parçaları.","720 kcal","300 g","Tavuk.","Gluten."),
P("Aperatifler","Çıtır Tavuk Sepeti","citir-tavuk-sepeti.jpg","Çıtır tavuk ve patates kızartması.","980 kcal","500 g","Tavuk, patates.","Gluten."),

...['Americano','Latte','Cappuccino','Caramel Macchiato','Chocolate Mocha','White Mocha','Espresso','Double Espresso','Hot Chocolate','Macchiato','Turkish Coffee','Demleme Fincan Çay','Demleme Çay','Nescafe','Sütlü Nescafe','Sahlep','Ada Çayı','Hibiscus','Ihlamur','Kış Çayı','Kuşburnu','Yeşil Çay'].map(n=>P("Sıcak İçecekler",n,"latte.jpg","Sıcak servis edilen içecek.","kalori değeri içeriğe göre değişir","Servis ölçüsüne göre",n,n.match(/Latte|Cappuccino|Macchiato|Mocha|Chocolate|Nescafe|Sahlep/) ? "Süt ve süt ürünleri içerebilir." : "Bilinen temel alerjen yoktur.")),
...['Iced Americano','Iced Caramel Macchiato','Iced Chocolate Mocha','Iced Latte','Frozen Çilek','Frozen Mango','Frozen Kivi','Frozen Karadut','Frozen Şeftali','Meyve Kokteyli Elma','Meyve Kokteyli Portakal','Milkshake Çilek','Milkshake Vanilya','Milkshake Çikolata','Smoothie Çilek','Smoothie Mango','Smoothie Kivi','Smoothie Karadut','Smoothie Şeftali','Ayran','Büyük Su','Su','Cappy Şeftali','Cappy Vişne','Cappy Karışık','Cappy Elma','Churchill','Cola','Fanta','Sprite','Cool Berry','Cool Lime','Ice Tea Şeftali','Ice Tea Karpuz','Ice Tea Mango','Meyveli Soda Karpuz Çilek','Meyveli Soda Elma','Meyveli Soda Limon','Sade Soda'].map(n=>P("Soğuk İçecekler",n,"latte.jpg","Soğuk servis edilen ferahlatıcı içecek.","kalori değeri içeriğe göre değişir","Servis ölçüsüne göre",n,n.match(/Latte|Macchiato|Mocha|Milkshake|Ayran/) ? "Süt ve süt ürünleri içerebilir." : "İçeriğe göre değişebilir.")),
P("Kokteyller","Apple Martini","apple-martini.jpg","Elma suyu ve votka bazlı kokteyl.","kalori değeri reçeteye göre değişir","9 cl","Martini 3 cl, votka 1 cl, elma suyu 5 cl.","İçeriğe göre değişebilir.","Soğuk servis edilir."),
P("Kokteyller","Bacardi Fizz","bacardi-fizz.jpg","Bacardi ve limon bazlı ferah kokteyl.","kalori değeri reçeteye göre değişir","7 cl","Bacardi 2 cl, limon suyu 3,5 cl, şeker şurubu 1,5 cl.","İçeriğe göre değişebilir.","Soğuk servis edilir."),
P("Kokteyller","Beyazı","beyazi.jpg","Votka, cin ve portakal likörlü kokteyl.","kalori değeri reçeteye göre değişir","12,5 cl","Votka 5 cl, limon suyu 2 cl, cin 1 cl, portakal likörü 2,5 cl, tequila 2 cl, Bacardi 1 cl; Sprite ile servis.","İçeriğe göre değişebilir.","Soğuk servis edilir."),
P("Kokteyller","Pina Colada","pina-colada.jpg","Ananas ve Malibu aromalı kremalı kokteyl.","kalori değeri reçeteye göre değişir","18 cl","Krema 2 bar kaşığı, ananas suyu 10 cl, süt 4 cl, Bacardi 4 cl, Malibu 4 cl.","Süt ve süt ürünleri.","Soğuk servis edilir."),
P("Kokteyller","Mojito","mojito.jpg","Bacardi, limon ve esmer şekerli klasik kokteyl.","kalori değeri reçeteye göre değişir","Servis ölçüsüne göre","Bacardi 4 cl, esmer şeker 1 bar kaşığı, limon suyu 2 cl, yaprak nane; soda ile servis.","İçeriğe göre değişebilir.","Nane ve soda ile soğuk servis edilir."),
P("Kokteyller","Margarita","margarita.jpg","Tequila ve portakal likörlü narenciye kokteyli.","kalori değeri reçeteye göre değişir","14 cl","Tequila 8 cl, portakal likörü 2 cl, limon suyu 2 cl, şeker şurubu 2 cl.","İçeriğe göre değişebilir.","Soğuk servis edilir."),
P("Kokteyller","Peach Margarita","peach-margarita.jpg","Şeftalili margarita.","kalori değeri reçeteye göre değişir","Servis ölçüsüne göre","Portakal likörü 2 cl, Archers 1,5 cl, tequila 4 cl, 3 dilim şeftali.","İçeriğe göre değişebilir.","Soğuk servis edilir."),
P("Kokteyller","Long Island","long-island.jpg","Çoklu distile içki bazlı klasik kokteyl.","kalori değeri reçeteye göre değişir","10 cl + kola","Votka 4 cl, Bacardi 2 cl, cin 2 cl, portakal likörü 2 cl; kola ile servis.","İçeriğe göre değişebilir.","Kola ile soğuk servis edilir.")

,
];
function openMenu(){document.getElementById("intro").style.display="none";document.getElementById("welcome").style.display="none";menu.style.display="block";document.body.style.overflow="auto";showCategories()} window.openMenu=openMenu;
function productCard(p){
  const price = PRICE_MAP[p.name] ?? "";

  return `
  <article class="product-card">

    <img class="product-image"
         src="assets/menu/${p.img}"
         alt="${trTitleCase(p.name)}"
         loading="lazy">

    <div class="product-info">

      <small>${p.cat.toUpperCase()}</small>

      <h3>${trTitleCase(p.name)}</h3>

      <p>${p.desc}</p>

      <div class="product-bottom">

        <strong class="price">
          ${price ? price + " ₺" : ""}
        </strong>

        <span class="detail-pill">
          İçerik • Alerjen
        </span>

      </div>

    </div>

  </article>`;
}
function showCategories(){
 menuTitle.textContent="Menümüz";backBtn.style.visibility="hidden";productGrid.classList.add("hidden");categoryGrid.classList.remove("hidden");
 categoryGrid.innerHTML=categories.map(c=>`<section class="accordion-category" data-cat="${trTitleCase(c.name)}"><button class="accordion-head" type="button"><span>${trTitleCase(c.name)}</span><b>⌄</b></button><div class="accordion-products"></div></section>`).join("");
 categoryGrid.querySelectorAll(".accordion-category").forEach(section=>{
   section.querySelector(".accordion-head").onclick=()=>{
     const wasOpen=section.classList.contains("open");
     categoryGrid.querySelectorAll(".accordion-category.open").forEach(x=>{
       x.classList.remove("open");
       x.querySelector(".accordion-products").innerHTML="";
     });
     if(!wasOpen){
       const list=products.filter(p=>p.cat===section.dataset.cat);
       const box=section.querySelector(".accordion-products");
       box.innerHTML=list.map(productCard).join("");
       box.querySelectorAll(".product-card").forEach((card,i)=>{
         card.onclick=()=>openDetail(list[i]);
       });
       section.classList.add("open");
       setTimeout(()=>section.scrollIntoView({behavior:"smooth",block:"start"}),80);
     }
   };
 });
}
function showCategory(cat){showCategories();const section=[...categoryGrid.querySelectorAll(".accordion-category")].find(x=>x.dataset.cat===cat);if(section)section.querySelector(".accordion-head").click()}
function openDetail(p){document.getElementById("modalImage").src=`assets/menu/${p.img}`;document.getElementById("modalCategory").textContent=p.cat.toUpperCase();document.getElementById("modalName").textContent=trTitleCase(p.name);document.getElementById("modalDesc").textContent=p.desc;document.getElementById("modalCal").textContent=p.cal;document.getElementById("modalGram").textContent=p.gram;document.getElementById("modalIngredients").textContent=(p.ing||"").split(",").map(function(item){return trTitleCase(item.trim());}).join(", ");document.getElementById("modalAllergens").innerHTML=allergenIconCards(p.all||p.allergen||p.allergens||"");document.getElementById("modalChef").textContent=p.chef;modal.classList.remove("hidden")}
backBtn.onclick=showCategories;document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};showCategories();
