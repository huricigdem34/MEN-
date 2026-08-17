
function trTitleCase(text){
  return (text||"").toLocaleLowerCase("tr-TR").replace(/(^|[\s\-\/])([a-zçğıöşü])/gu,function(_,sep,ch){
    return sep+ch.toLocaleUpperCase("tr-TR");
  });
}

const menu=document.getElementById("menu"),categoryGrid=document.getElementById("categoryGrid"),productGrid=document.getElementById("productGrid"),menuTitle=document.getElementById("menuTitle"),backBtn=document.getElementById("backBtn"),modal=document.getElementById("detailModal");

const categories=[
 {name:"Meze Çeşitleri",img:"sezar.jpg",sub:"Sofraya sıcak bir başlangıç"},{name:"Aperatif Çeşitleri",img:"bonfrit.jpg",sub:"Paylaşmalık ve atıştırmalık lezzetler"},{name:"Omlet Çeşitleri",img:"alfredo.jpg",sub:"Güne lezzetli bir başlangıç"},{name:"Krep Çeşitleri",img:"alfredo.jpg",sub:"Fırından sıcak krep çeşitleri"},{name:"Menemen Çeşitleri",img:"tavuk.jpg",sub:"Tavadan sıcak klasikler"},{name:"Salata Çeşitleri",img:"sezar.jpg",sub:"Taze ve hafif seçenekler"},{name:"Makarna Çeşitleri",img:"spaghetti.jpg",sub:"Özel soslar ve reçeteler"},{name:"Tavuk Çeşitleri",img:"tavuk.jpg",sub:"Izgara ve özel soslar"},{name:"Et Yemeği Çeşitleri",img:"burger.jpg",sub:"Güçlü ve seçkin lezzetler"},{name:"Burger Çeşitleri",img:"burger.jpg",sub:"Doyurucu Lobby lezzetleri"},{name:"Çorba Çeşitleri",img:"corbalar.jpg",sub:"Günün sıcak çorba çeşitleri"},{name:"Kurudite Çeşitleri",img:"kurudite.jpg",sub:"Taze sebzeler ve eşlikçiler"},{name:"Meşrubat Çeşitleri",img:"mesrubatlar.jpg",sub:"Soğuk içecek ve meşrubat çeşitleri"},{name:"Sıcak İçecek Çeşitleri",img:"latte.jpg",sub:"Kahve ve çay çeşitleri"},{name:"Bitki Çayı Çeşitleri",img:"bitki-caylari.jpg",sub:"Doğal, aromatik ve rahatlatıcı bitki çayları"},{name:"Sıcak Kahve Çeşitleri",img:"sicak-kahveler.jpg",sub:"Espresso bazlı kahve çeşitleri"},{name:"Soğuk Kahve Çeşitleri",img:"soguk-kahveler.jpg",sub:"Buz gibi espresso bazlı kahveler"},{name:"Blend İçecek Çeşitleri",img:"smoothie-frozen.jpg",sub:"Smoothie, frozen ve milkshake çeşitleri"},{name:"Kokteyl Çeşitleri",img:"latte.jpg",sub:"Lobby bar seçkisi"},{name:"Bira Çeşitleri",img:"biralar.jpg",sub:"Bira çeşitleri"},{name:"Rakı Çeşitleri",img:"rakılar.jpg",sub:"Rakı çeşitleri"},{name:"Viski Çeşitleri",img:"viski.jpg",sub:"Viski çeşitleri"},{name:"Şarap Çeşitleri",img:"sarap.jpg",sub:"Şarap Çeşitleri"},{name:"İthal İçecek Çeşitleri",img:"ithal-icecekler.jpg",sub:"İthal içecek çeşitleri"},{name:"Şurup Çeşitleri",img:"ithal-icecekler.jpg",sub:"Sıcak ve soğuk kahvelerinize zengin bir tat katar"},
];
const P=(cat,name,img,desc,cal,gram,ing,all="Bilinen temel alerjen yoktur.",chef="Reçeteye uygun şekilde taze hazırlanarak servis edilir.")=>({cat,name,img,desc,cal,gram,ing,all,chef});

const PRICE_MAP = {
  "Hellim Peyniri":320,
  "Kavun":170,
  "Izgara Köfte":720,
  "Filet Steak":850,
  "Pepper Steak":850,
  "Mexican Steak":870,
  "Kaşarlı Köfte":750,
  "Soya Soslu Tavuk":440,
  "Kuzu Pirzola":850,
  "Köri Soslu Tavuk":440,
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
  "Fava":180,
  "Deniz Börülcesi":180,
  "Haydari":170,
  "Atom":180,
  "Havuç Tarator":170,
  "Patlıcan Gömme":170,
  "Arnavut Ciğeri":360,
  "Enginar":180,
  "Şakşuka":180,
  "Meyve Tabağı":200,
  "Domates salatalık ve peynir":280,
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
  "3 Litre Biraver":1240,
"Amsterdam 50 CL":300,
"Belfast 50 CL":230,
"Bavyera 1 LT":400,
"Becks 50 CL":230,
"Bomonti Filtresiz 50 CL":230,
"Bud 50 CL":240,
"Corona 33 CL":280,
"Efes Tombul 50 CL":220,
"Efes Fıçı 33 CL":140,
"Efes Fıçı 50 CL":210,
"Efes Fıçı 70 CL":290,
"Efes Malt 50 CL":220,
"Efes Özel Seri 50 CL":230,
"Efes Şişe 50 CL":220,
"Mexican Bardak":30,
"Mexican Bira":230,
"Miller 50 CL":280,
"Tek Rakı":260,
"Duble Rakı":400,
"Tekirdağ Altın Seri Tek":310,
"Tekirdağ Altın Seri Duble":420,
"Tekirdağ Altın Seri 20 CL":1000,
"Tekirdağ Altın Seri 35 CL":1500,
"Tekirdağ Altın Seri 50 CL":2000,
"Tekirdağ Altın Seri 70 CL":2550,
"Tekirdağ Altın Seri 100 CL":3500,
"Beylerbeyi 20 CL":1020,
"Beylerbeyi 35 CL":1550,
"Beylerbeyi 50 CL":2100,
"Beylerbeyi 70 CL":2600,
"Beylerbeyi 100 CL":3600,
"Efe Gold 20 CL":950,
"Efe Gold 35 CL":1500,
"Efe Gold 50 CL":2000,
"Efe Gold 70 CL":2550,
"Efe Gold 100 CL":3500,
"Kulüp Rakı 35 CL":1600,
"Kulüp Rakı 70 CL":2650,
"Yeni Rakı 20 CL":750,
"Yeni Rakı 35 CL":1290,
"Yeni Rakı 50 CL":1800,
"Yeni Rakı 70 CL":2250,
"Yeni Rakı 100 CL":2950,
"Tek Votka":290,
"Duble Votka":360,
"Tek Votka Enerji":330,
"Duble Votka Enerji":430,
"Absolut 35 CL":2100,
"Absolut 50 CL":2700,
"Absolut 70 CL":3250,
"Absolut 100 CL":4200,
"Tek Chivas":410,
"Double Chivas":550,
"Tek Jack Daniel's":410,
"Double Jack Daniel's":550,
"Chivas 35 CL":2500,
"Chivas 50 CL":3300,
"Chivas 70 CL":4100,
"Chivas 100 CL":5700,
"Jack Daniel's 35 CL":2500,
"Jack Daniel's 70 CL":4100,
"Olmeca 35 CL":1960,
"Olmeca 50 CL":2600,
"Olmeca 70 CL":3350,
"Tekila Shot":200,
"Blush Şişe 75 CL":2400,
"Blush Kadeh":630,
"Beyaz Kadeh":400,
"Kırmızı Kadeh":400,
"Beyaz Şişe 37.5 CL":800,
"Kırmızı Şişe 37.5 CL":800,
"Kırmızı Şişe 75 CL":1500,
"Beyaz Şişe 75 CL":1500,
"B-52":210,
"Baileys":400,
"Tek Cin":330,
"Double Cin":440,
"Jager":200,
"Malibu":340,
"Havuç":120,
"Kurudite":130,
"Salatalık":120,
"Turşu":120,
"Long Island Ice Tea":640,
"Sex on the Beach":580,
"Mojito":500,
"Margarita":620,
"Apple Martini":500,
"Beyazıt":680,
"Pina Colada":600,
"Bacardi Fizz":500,
"Peach Margarita":850,
"Demleme Çay":50,
"Demleme Fincan Çay":100,
"Sade Nescafe":110,
"Sütlü Nescafe":130,
"Sahlep":130,
"Adaçayı":130,
"Hibiskus":130,
"Ihlamur":130,
"Kış Çayı":130,
"Kuşburnu":130,
"Yeşil Çay":130,
"Americano":160,
"Caffe Latte":190,
"Cappuccino":200,
"Chocolate Mocha Latte":220,
"Espresso":150,
"Double Espresso":190,
"Hot Chocolate":130,
"Espresso Macchiato":190,
"Türk Kahvesi":100,
"Ice Americano":230,
"Ice Caramel Macchiato":230,
"Ice Chocolate Mocha":230,
"Ice Latte":230,
"Çilekli Frozen":200,
"Mangolu Frozen":200,
"Kivili Frozen":200,
"Karadutlu Frozen":200,
"Şeftalili Frozen":200,
"Meyve Kokteyli":200,
"Çikolatalı Milkshake":200,
"Vanilyalı Milkshake":200,
"Çilekli Milkshake":200,
"Çilekli Smoothie":230,
"Mangolu Smoothie":230,
"Kivili Smoothie":230,
"Karadutlu Smoothie":230,
"Şeftalili Smoothie":230,
"Ayran":80,
"Büyük Su":90,
"Cappy Şeftali":110,
"Cappy Vişne":110,
"Cappy Karışık":110,
"Churchill":100,
"Cola":110,
"Fanta":110,
"Sprite":110,
"Cool Berry":160,
"Cool Lime":160,
"Ice Tea Şeftali":110,
"Ice Tea Mango":110,
"Ice Tea Limon":110,
"Ice Tea Karpuz":110,
"Limonata":140,
"Elmalı Soda":90,
"Limon Soda":90,
"Karpuz Çilek Soda":90,
"Red Bull":190,
"Sade Soda":70,
"Su":40,
"Sıkma Portakal":160,
"Şalgam":90,
"Çilek":25,
"Çikolata":25,
"Karamel":25,
"Beyaz Çikolata":25,
"Fındık":25,
"Vanilya":25,
"Domates Çorbası":180,
"Kremalı Mantar Çorbası":190,
"Double Türk Kahvesi":200,
"Tekmilli Fava":190,
"Whiskey Sour":600,
"Mango Tango":720,
"Dirty Martini":600,
"Espresso Martini":550,
"Cosmopolitan":500,
"Negroni":550,
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
P("Meze Çeşitleri","Atom","atom.jpg","Acı biberli süzme yoğurt mezesi.","250 kcal","160 g","Süzme yoğurt, sarımsak, kuru acı biber, tereyağı, zeytinyağı, tuz.","Süt ve süt ürünleri."),
P("Meze Çeşitleri","Arnavut Ciğeri","arnavut-cigeri.jpg","Soğan salatası, domates ve limonla servis edilen dana ciğeri.","460 kcal","250 g (garnitür dahil)","Dana ciğeri, un, ayçiçek yağı, tuz, kuru soğan, sumak, maydanoz, limon, domates.","Gluten."),
P("Meze Çeşitleri","Fava","fava.jpg","Zeytinyağlı kuru bakla ezmesi.","290 kcal","150 g","Kuru bakla, soğan, zeytinyağı, su, şeker, tuz, limon suyu, dereotu."),
P("Meze Çeşitleri","Tekmilli Fava","tekmilli-fava.jpg","Zeytinyağlı kuru bakla ezmesi.","290 kcal","150 g","Kuru bakla, soğan, zeytinyağı, su, şeker, tuz, limon suyu, dereotu."),
P("Meze Çeşitleri","Haydari","haydari.jpg","Yoğun kıvamlı klasik yoğurt mezesi.","230 kcal","160 g","sarımsak, kuru nane, zeytinyağı, tuz.","Süt ve süt ürünleri."),
P("Meze Çeşitleri","Patlıcan Gömme","patlican-gomme.jpg","Köz patlıcan ve yoğurtla hazırlanan soğuk meze.","260 kcal","180 g","Közlenmiş patlıcan, közlenmiş biber, süzme yoğurt, sarımsak, zeytinyağı, limon suyu, tuz, maydanoz.","Süt ve süt ürünleri."),
P("Meze Çeşitleri","Kuru Cacık","kuru-cacik.jpg","Süzme yoğurt ve salatalıkla yoğun kıvamlı cacık.","190 kcal","185 g","Süzme yoğurt, salatalık, sarımsak, zeytinyağı, kuru nane, tuz.","Süt ve süt ürünleri."),
P("Meze Çeşitleri","Havuç Tarator","havuc-tarator.jpg","Sotelenmiş havuç, süzme yoğurt.","300 kcal","200 g","Havuç, süzme yoğurt, sarımsak, zeytinyağı, tuz, isteğe bağlı dereotu.","Süt ve süt ürünleri, ceviz."),
P("Meze Çeşitleri","Deniz Börülcesi","deniz-borulcesi.jpg","Sarımsaklı limon ve zeytinyağıyla servis edilir.","120 kcal","90–100 g","Deniz börülcesi, zeytinyağı, limon suyu, sarımsak."),
P("Meze Çeşitleri","Barbunya Pilaki","barbunya-pilaki.jpg","Zeytinyağlı barbunya ve havuç ile hazırlanan klasik meze.","240 kcal","180 g","Barbunya, havuç, soğan, domates, zeytinyağı, sarımsak, maydanoz.","Bilinen temel alerjen yoktur."),

P("Meze Çeşitleri","Şakşuka","saksuka.jpg","Kızarmış patlıcan ve biberlerin domates sosuyla buluştuğu geleneksel meze.","310 kcal","200 g","Patlıcan, patates, yeşil biber, domates sosu, sarımsak, zeytinyağı.","Bilinen temel alerjen yoktur."),

P("Meze Çeşitleri","Pancar","pancar.jpg","Haşlanmış pancarın servis edildiği soğuk meze.","210 kcal","170 g","Pancar, limon, sarımsak, zeytinyağı.","Süt ve süt ürünleri."),

P("Meze Çeşitleri","Peynir","peynir.jpg","Günlük peynir tabağı.","260 kcal","150 g","Beyaz peynir.","Süt ve süt ürünleri."),

P("Meze Çeşitleri","İthal Peynir Tabağı","ithal-peynir-tabagi.jpg","Seçkin ithal peynir çeşitleriyle hazırlanan özel tabak.","520 kcal","220 g","Brie, Gouda, Cheddar, Parmesan, Grissini.","Gluten, süt ve süt ürünleri."),

P("Meze Çeşitleri","Enginar","enginar.jpg","Zeytinyağlı enginar kalbi ve bezelye ile hazırlanır.","180 kcal","180 g","Enginar, bezelye, zeytinyağı.","Bilinen temel alerjen yoktur."),

P("Meze Çeşitleri","Domates salatalık ve peynir","dsp.jpg","Domates salatalık peynir.","340 kcal","220 g","İçeriğe göre değişebilir."),

P("Meze Çeşitleri","Meyve Tabağı","meyve-tabagi.jpg","Mevsim meyvelerinden hazırlanan ferah tabak.","190 kcal","350 g","Karpuz, kavun, üzüm, portakal, kivi, çilek.","Bilinen temel alerjen yoktur."),

P("Meze Çeşitleri","Ordövr Tabağı","ordovr-tabagi.jpg","Karışık peynir ve mezelerden oluşan başlangıç tabağı.","690 kcal","420 g","Peynir çeşitleri, 6 çeşit meze.","Süt ve süt ürünleri."),

P("Meze Çeşitleri","Karpuz","karpuz.jpg","Soğuk servis edilen dilim karpuz.","90 kcal","300 g","Karpuz.","Bilinen temel alerjen yoktur."),

P("Meze Çeşitleri","Kavun","kavun.jpg","Soğuk servis edilen taze kavun dilimleri.","110 kcal","300 g","Kavun.","Bilinen temel alerjen yoktur."),

P("Omlet Çeşitleri","Sade Omlet","sade-omlet.jpg","Tereyağında klasik omlet.","280 kcal","160 g","Yumurta, tereyağı, tuz, karabiber.","Yumurta, süt ve süt ürünleri."),
P("Omlet Çeşitleri","Kaşarlı Omlet","kasarli-omlet.jpg","Rendelenmiş kaşar peynirli omlet.","420 kcal","200 g","Yumurta, kaşar peyniri, tereyağı, tuz, karabiber.","Yumurta, süt ve süt ürünleri."),
P("Omlet Çeşitleri","Sucuklu Omlet","sucuklu-omlet.jpg","Kasap sucuklu omlet.","480 kcal","210 g","Yumurta, sucuk, tereyağı, tuz, karabiber.","Yumurta, süt ve süt ürünleri."),
P("Omlet Çeşitleri","Sahanda Yumurta","sahanda-yumurta.jpg","Tereyağında sahanda iki yumurta.","220 kcal","110 g","Yumurta, tereyağı, tuz, isteğe bağlı karabiber.","Yumurta, süt ve süt ürünleri."),
P("Omlet Çeşitleri","Sahanda Sucuklu Yumurta","sahanda-sucuklu-yumurta.jpg","Tereyağında sucuk ve sahanda yumurta.","420 kcal","160 g","Yumurta, sucuk, tereyağı, isteğe bağlı tuz ve karabiber.","Yumurta, süt ve süt ürünleri."),

P("Krep Çeşitleri","Tavuklu Krep","tavuklu-krep.jpg","Kremalı tavuk harcı ve kaşarla fırınlanan krep.","760 kcal","300 g","Un, yumurta, süt, sıvı yağ, tavuk göğsü, krema, kaşar, tuz, karabiber, kekik.","Gluten, yumurta, süt ve süt ürünleri."),
P("Krep Çeşitleri","Mantarlı Krep","mantarli-krep.jpg","Kremalı mantar harcı ve kaşarla fırınlanan krep.","680 kcal","390 g","Un, yumurta, süt, sıvı yağ, mantar, sarımsak, tereyağı, krema, kaşar, tuz, karabiber, kekik, maydanoz.","Gluten, yumurta, süt ve süt ürünleri."),
P("Krep Çeşitleri","Tavuklu Mantarlı Krep","tavuklu-mantarli-krep.jpg","Tavuk ve mantarlı kremalı harçla fırınlanan krep.","780 kcal","420 g","Un, yumurta, süt, sıvı yağ, tavuk, mantar, sarımsak, tereyağı, krema, kaşar, tuz, karabiber, kekik, maydanoz.","Gluten, yumurta, süt ve süt ürünleri."),

P("Menemen Çeşitleri","Sade Menemen","sade-menemen.jpg","Domates ve sivri biberle klasik menemen.","330 kcal","270 g","Yumurta, domates, yeşil sivri biber, tereyağı, zeytinyağı, tuz, isteğe bağlı karabiber ve pul biber.","Yumurta, süt ve süt ürünleri."),
P("Menemen Çeşitleri","Kaşarlı Menemen","kasarli-menemen.jpg","Kaşar peyniriyle zenginleştirilmiş menemen.","470 kcal","310 g","Yumurta, domates, yeşil sivri biber, kaşar, tereyağı, zeytinyağı, tuz, isteğe bağlı karabiber ve pul biber.","Yumurta, süt ve süt ürünleri."),

P("Salata Çeşitleri","Sezar Salatası","sezar-salatasi.jpg","Izgara tavuk, parmesan ve krutonlu Sezar salatası.","520 kcal","325 g","Izgara tavuk, marul, kruton, parmesan; Sezar sos: mayonez, hardal, limon suyu, sarımsak, zeytinyağı, Worcestershire sos, tuz, karabiber.","Gluten, süt ve süt ürünleri, yumurta, hardal; Worcestershire içeriğine göre balık içerebilir."),
P("Salata Çeşitleri","Çoban Salata","coban-salata.jpg","Günlük doğranmış taze sebzeler.","180 kcal","210 g","Domates, salatalık, yeşil sivri biber, soğan, maydanoz, zeytinyağı, limon suyu, tuz, isteğe bağlı sumak."),
P("Salata Çeşitleri","Kaşık Salata","kasik-salata.jpg","İnce doğranmış sebzeler ve nar ekşisi.","210 kcal","230 g","Domates, salatalık, yeşil sivri biber, soğan, roka, nar ekşisi, zeytinyağı, limon suyu, tuz, isteğe bağlı sumak."),
P("Salata Çeşitleri","Yeşil Salata","yesil-salata.jpg","Taze yeşilliklerden hafif salata.","150 kcal","175 g","Göbek marul, kıvırcık, roka, maydanoz, dereotu, salatalık, zeytinyağı, limon suyu, tuz."),
P("Salata Çeşitleri","Hellim Salatası","hellim-salatasi.jpg","Izgara hellim ve Mevsim yeşillikleri.","430 kcal","300 g","Hellim, göbek marul, Akdeniz yeşillikleri, roka, cherry domates, salatalık, kırmızı soğan, zeytinyağı, limon suyu, nar ekşisi, tuz, karabiber.","Süt ve süt ürünleri."),
P("Salata Çeşitleri","Tavuk Salatası","tavuk-salatasi.jpg","Izgara tavuk, taze yeşillikler ve özel sos ile hazırlanır.","480 kcal","320 g","Izgara tavuk, marul, roka, domates, salatalık, mısır, zeytinyağı.","Bilinen temel alerjen yoktur."),

P("Salata Çeşitleri","Greek Salata","greek-salata.jpg","Beyaz peynirli Akdeniz usulü Yunan salatası.","360 kcal","300 g","Domates, salatalık, beyaz peynir, zeytin, kırmızı soğan, kekik, zeytinyağı.","Süt ve süt ürünleri."),

P("Makarna Çeşitleri","Spaghetti Napoletana","spaghetti-napoletana.jpg","Domates ve sarımsaklı spaghetti.","560 kcal","300 g","Spaghetti, domates veya domates püresi, sarımsak, zeytinyağı, tuz, karabiber, şeker, isteğe bağlı parmesan.","Gluten; parmesan eklenirse süt ve süt ürünleri."),
P("Makarna Çeşitleri","Penne Chicken Mushroom","penne-chicken-mushroom.jpg","Kremalı tavuk ve mantarlı penne.","760 kcal","380 g","Penne, tavuk göğsü, mantar, sarımsak, sıvı yağ, tereyağı, krema, parmesan, tuz, karabiber, kekik, maydanoz.","Gluten, süt ve süt ürünleri."),
P("Makarna Çeşitleri","Spaghetti alla Bolognese","spaghetti-alla-bolognese.jpg","Dana kıymalı yoğun domates soslu spaghetti.","700 kcal","380 g","Spaghetti, dana kıyma, domates püresi, domates salçası, soğan, havuç, kereviz sapı, sarımsak, zeytinyağı, tuz, karabiber, kekik, şeker, parmesan.","Gluten, süt ve süt ürünleri; kereviz."),
P("Makarna Çeşitleri","Penne Arrabbiata","penne-arrabbiata.jpg","Acı pul biberli domates sosunda penne.","540 kcal","300 g","Penne, domates püresi, domates salçası, sarımsak, zeytinyağı, acı pul biber, tuz, karabiber, şeker, maydanoz, isteğe bağlı parmesan.","Gluten; parmesan eklenirse süt ve süt ürünleri."),
P("Makarna Çeşitleri","Penne alla Carbonara","penne-alla-carbonara.jpg","Dana jambon, parmesan ve kremalı penne.","820 kcal","330 g","Penne, dana jambon, parmesan, krema, tereyağı, isteğe bağlı sarımsak, karabiber, tuz.","Gluten."),

P("Tavuk Çeşitleri","Soya Soslu Tavuk","soya-soslu-tavuk.jpg","Soya sosu ve mantarla sotelenmiş tavuk.","520 kcal","330 g","Tavuk göğsü, soya sosu, mantar, yağ, tuz ve karabiber.","Soya; soya sosuna göre gluten içerebilir."),
P("Tavuk Çeşitleri","Köri Soslu Tavuk","kori-soslu-tavuk.jpg","Kremalı köri sosunda tavuk, çarliston biber ve kapya biber.","650 kcal","390 g","Tavuk, biber, sarımsak, tereyağı, sıvı yağ, krema, köri, tuz, karabiber.","Süt ve süt ürünleri;gluten."),
P("Tavuk Çeşitleri","Tavuk Şinitzel","tavuk-sinitzel.jpg","Çıtır pane tavuk, patates ve limon.","760 kcal","380 g (garnitür dahil)","Tavuk göğsü, un, yumurta, galeta unu, tuz, karabiber, isteğe bağlı kırmızı biber, kızartma yağı; patates, limon, maydanoz.","Gluten, yumurta."),
P("Tavuk Çeşitleri","Tavuk Fajita","tavuk-fajita.jpg","Renkli biberlerle yüksek ateşte sotelenmiş tavuk.","690 kcal","460 g (tortilla dahil)","Tavuk, kapya biber, yeşil biber, sarı biber, soğan, sıvı yağ, tereyağı, sarımsak, tuz, karabiber, kırmızı biber, kimyon, kekik; tortilla, limon.","Gluten, süt ve süt ürünleri."),
P("Tavuk Çeşitleri","Izgara Tavuk","ızgara-tavuk.jpg","Marine edilmiş ızgara tavuk.","430 kcal","315 g (garnitür dahil)","Tavuk göğsü, zeytinyağı, tuz, karabiber, kekik, kırmızı biber, isteğe bağlı sarımsak; soya sosu."),
P("Tavuk Çeşitleri","Tavuk Güveç","tavuk-guvec.jpg","Sebze ve kaşarla fırınlanan tavuk güveç.","620 kcal","460 g","Tavuk, soğan, kapya biber, yeşil biber, domates, domates salçası, sarımsak, tereyağı, zeytinyağı, kaşar, tuz, karabiber, kekik, kırmızı biber.","Süt ve süt ürünleri."),
P("Tavuk Çeşitleri","Mexican Tavuk","mexican-tavuk.jpg","Mısır ve kırmızı fasulyeli baharatlı tavuk.","590 kcal","410 g","Tavuk, soğan, sarımsak, biberler, domates püresi, mısır, haşlanmış kırmızı fasulye, tereyağı, zeytinyağı, kekik, acı pul biber."),
P("Tavuk Çeşitleri","Mantarlı Tavuk","mantarli-tavuk.jpg","Kremalı mantar soslu tavuk.","670 kcal","410 g","Tavuk, mantar, sarımsak, tereyağı, krema, tuz, karabiber, kekik.","Süt ve süt ürünleri."),

P("Et Yemeği Çeşitleri","Yaprak Kavurma","yaprak-kavurma.jpg","Dana bonfileden yüksek ateşte yaprak kavurma.","560 kcal","285 g","Dana bonfile, tereyağı, soya sosu, zeytinyağı, sarımsak, tuz, karabiber, kekik.","Süt ve süt ürünleri, Soya sosu."),
P("Et Yemeği Çeşitleri","Fillet Steak","fillet-steak.jpg","Tereyağı ve aromatik otlarla pişmiş dana bonfile.","780 kcal","460 g (garnitür dahil)","Dana bonfile, tereyağı, zeytinyağı, sarımsak, taze biberiye, taze kekik, tuz, karabiber; patates püresi.","Süt ve süt ürünleri."),
P("Et Yemeği Çeşitleri","Pepper Steak","pepper-steak.jpg","Kremalı tane karabiber soslu dana bonfile.","840 kcal","500 g (garnitür dahil)","Dana bonfile, mantar, zeytinyağı, tereyağı, tuz; sarımsak, tane karabiber, krema, demi-glace veya et suyu, ızgara sebze.","Süt ve süt ürünleri; isteğe bağlı hardal."),
P("Et Yemeği Çeşitleri","Mexican Steak","mexican-steak.jpg","Meksika soslu dana bonfile.","800 kcal","520 g (garnitür dahil)","Dana bonfile, zeytinyağı, tereyağı, tuz, karabiber; kapya biber, yeşil biber, kırmızı soğan, mısır, kırmızı fasulye, domates püresi, sarımsak, kimyon, kırmızı biber, acı pul biber.","Süt ve süt ürünleri."),
P("Et Yemeği Çeşitleri","Et Fajita","et-fajita.jpg","Renkli biberlerle yüksek ateşte sotelenmiş dana bonfile.","830 kcal","500 g (tortilla dahil)","Dana bonfile, kapya biber, sarı biber, yeşil biber, soğan, zeytinyağı, tereyağı, sarımsak, tuz, karabiber, kimyon, kırmızı biber, kekik; tortilla, limon, isteğe bağlı guacamole ve ekşi krema.","Gluten, süt ve süt ürünleri."),
P("Et Yemeği Çeşitleri","Izgara Köfte","izgara-kofte.jpg","Izgara dana köfte ve klasik garnitür.","760 kcal","430 g (garnitür dahil)","Dana kıyma, soğan, galeta unu, yumurta, sarımsak, tuz, karabiber, kimyon, kırmızı biber, maydanoz; patates, ızgara domates, biber, soğan piyazı.","Gluten, yumurta."),
P("Et Yemeği Çeşitleri","Kaşarlı Köfte","kasarli-kofte.jpg","Izgara dana köftelerinin içinde eritilmiş kaşar peyniri ile hazırlanır. Pilav, patates kızartması ve mevsim salatası ile servis edilir.","890 kcal","470 g","Dana kıyma, kaşar peyniri, soğan, galeta unu, yumurta, baharatlar.","Gluten, yumurta, süt ve süt ürünleri."),
P("Et Yemeği Çeşitleri","Kuzu Pirzola","kuzu-pirzola.jpg","Özel baharatlarla marine edilmiş kuzu pirzola. Pilav, patates kızartması ve mevsim salatası ile servis edilir.","760 kcal","300 g","Kuzu pirzola, zeytinyağı, sarımsak, kekik, biberiye.","Bilinen temel alerjen yoktur."),

P("Burger Çeşitleri","Hamburger","hamburger.jpg","Dana köfteli klasik hamburger.","720 kcal","360 g","Hamburger ekmeği, dana hamburger köftesi, marul, domates, kornişon turşu, tereyağı, isteğe bağlı sıvı yağ.","Gluten, süt ve süt ürünleri."),

P("Aperatif Çeşitleri","Anne Patatesi","anne-patatesi.jpg","klasik çıtır patates.","520 kcal","250 g","Patates."),
P("Aperatif Çeşitleri","Anne Patatesi Soslu","anne-patatesi-soslu.jpg","Özel soslarla servis edilen çıtır patates.","610 kcal","300 g","Patates, özel soslar."),
P("Aperatif Çeşitleri","Bira Tabağı","bira-tabagi.jpg","Sosis, bonfrit, sigara böreği, soğan halkası, kaşar pane.","1180 kcal","500 g","Karışık aperatifler.","Gluten, süt ürünleri."),
P("Aperatif Çeşitleri","Bonfrit","bonfrit.jpg","Çıtır patates kızartması.","480 kcal","220 g","Patates."),
P("Aperatif Çeşitleri","Hellim Peyniri","hellim-peyniri.jpg","Izgara hellim peyniri.","430 kcal","180 g","Hellim peyniri.","Süt ve süt ürünleri."),
P("Aperatif Çeşitleri","Kaşar Pane","kasar-pane.jpg","Pane kaplamalı kızarmış kaşar.","590 kcal","220 g","Kaşar peyniri.","Gluten, süt ürünleri."),
P("Aperatif Çeşitleri","Sigara Böreği","sigara-boregi.jpg","Peynirli sigara böreği.","510 kcal","180 g","Yufka, peynir.","Gluten, süt ürünleri."),
P("Aperatif Çeşitleri","Sosis Tabağı","sosis-tabagi.jpg","Izgara sosis tabağı.","670 kcal","350 g","Dana sosis."),
P("Aperatif Çeşitleri","Soğan Halkası","sogan-halkasi.jpg","Pane soğan halkaları.","450 kcal","200 g","Soğan.","Gluten."),
P("Aperatif Çeşitleri","Çıtır Tavuk","citir-tavuk.jpg","Pane çıtır tavuk parçaları.","720 kcal","300 g","Tavuk.","Gluten."),
P("Aperatif Çeşitleri","Çıtır Tavuk Sepeti","citir-tavuk-sepeti.jpg","Çıtır tavuk ve patates kızartması.","980 kcal","500 g","Tavuk, patates.","Gluten."),

P("Çorba Çeşitleri","Domates Çorbası","domates-corbasi.jpg","Taze domates ile hazırlanan, kaşar peyniri ve kruton ekmeği ile servis edilen sıcak çorba.","","1 Kase","Domates, Tereyağı, Un","Süt, Gluten içerir."),
P("Çorba Çeşitleri","Kremalı Mantar Çorbası","kremali-mantar-corbasi.jpg","Taze mantar ve krema ile hazırlanan yumuşak içimli çorba.","","1 Kase","Mantar, Krema, Tereyağı","Süt, Gluten içerir."),
  
P("Meşrubat Çeşitleri","Sıkma Portakal","sikma-portakal.jpg","Taze sıkılmış portakal suyu.","135 kcal","300 ml","Portakal","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Limonata","limonata.jpg","Taze limon ile hazırlanan ev yapımı limonata.","150 kcal","300 ml","Limon","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Meyve Kokteyli","meyve-kokteyli.jpg","Karışık meyvelerle hazırlanan içecek.","190 kcal","400 ml","Karışık Meyveler","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Cool Berry","cool-berry.jpg","Orman meyveli ferahlatıcı içecek.","120 kcal","400 ml","Meyve Aroması","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Cool Lime","cool-lime.jpg","Lime aromalı ferahlatıcı içecek.","110 kcal","400 ml","Lime","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Ayran","bos.jpg","Geleneksel soğuk ayran.","","1 Bardak","Yoğurt, Su, Tuz","Süt içerir."),
P("Meşrubat Çeşitleri","Büyük Su","bos.jpg","1 L doğal kaynak suyu.","","1 Litre","Doğal Kaynak Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Cappy Şeftali","bos.jpg","Meyve suyu.","","330 ml","Meyve Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Cappy Vişne","bos.jpg","Meyve suyu.","","330 ml","Meyve Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Cappy Karışık","bos.jpg","Meyve suyu.","","330 ml","Meyve Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Churchill","bos.jpg","Maden suyu, limon ve tuz ile hazırlanır.","","1 Bardak","Maden Suyu, Limon, Tuz","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Cola","bos.jpg","Soğuk gazlı içecek.","","330 ml","Gazlı İçecek","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Fanta","bos.jpg","Portakal aromalı gazlı içecek.","","330 ml","Gazlı İçecek","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Sprite","bos.jpg","Limon aromalı gazlı içecek.","","330 ml","Gazlı İçecek","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Ice Tea Limon","bos.jpg","Limon aromalı soğuk çay.","","330 ml","Soğuk Çay","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Ice Tea Şeftali","bos.jpg","Şeftali aromalı soğuk çay.","","330 ml","Soğuk Çay","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Ice Tea Mango","bos.jpg","Mango aromalı soğuk çay.","","330 ml","Soğuk Çay","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Ice Tea Karpuz","bos.jpg","Karpuz aromalı soğuk çay.","","330 ml","Soğuk Çay","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Elmalı Soda","bos.jpg","Meyve aromalı maden suyu.","","200 ml","Maden Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Limonlu Soda","bos.jpg","Meyve aromalı maden suyu.","","200 ml","Maden Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Karpuz Çilek Soda","bos.jpg","Meyve aromalı maden suyu.","","200 ml","Maden Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Red Bull","bos.jpg","Enerji içeceği.","","250 ml","Enerji İçeceği","Kafein içerir."),
P("Meşrubat Çeşitleri","Sade Soda","bos.jpg","Doğal maden suyu.","","200 ml","Maden Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Su","bos.jpg","Doğal kaynak suyu.","","500 ml","Doğal Kaynak Suyu","Bilinen temel alerjen yoktur."),
P("Meşrubat Çeşitleri","Şalgam","bos.jpg","Geleneksel şalgam suyu.","","300 ml","Şalgam","Bilinen temel alerjen yoktur."),
  
P("Blend İçecek Çeşitleri","Çilekli Frozen","cilekli-frozen.jpg","Çilek püresi ile hazırlanan frozen.","180 kcal","400 ml","Çilek püresi","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Mangolu Frozen","mangolu-frozen.jpg","Mango püresi ile hazırlanan frozen.","220 kcal","400 ml","Mango püresi","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Kivili Frozen","kivili-frozen.jpg","Kivi püresi ile hazırlanan frozen.","170 kcal","400 ml","Kivi püresi","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Karadutlu Frozen","karadutlu-frozen.jpg","Karadut püresi frozen.","200 kcal","400 ml","Karadut püresi","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Şeftalili Frozen","seftalili-frozen.jpg","Şeftali püresi frozen.","190 kcal","400 ml","Şeftali püresi","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Çilekli Milkshake","cilekli-milkshake.jpg","Soğuk ve kremamsı milkshake.","430 kcal","400 ml","Çilekli dondurma, Süt","Süt içerir."),
P("Blend İçecek Çeşitleri","Çikolatalı Milkshake","cikolatali-milkshake.jpg","Soğuk ve kremamsı milkshake.","510 kcal","400 ml","Çikolatalı dondurma, Süt","Süt içerir."),
P("Blend İçecek Çeşitleri","Vanilyalı Milkshake","vanilyali-milkshake.jpg","Soğuk ve kremamsı milkshake.","460 kcal","400 ml","Vanilyalı donduruma, Süt","Süt içerir."),
P("Blend İçecek Çeşitleri","Çilekli Smoothie","cilekli-smoothie.jpg","Çilekli smoothie.","190 kcal","400 ml","Çilek püresi, Yoğurt","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Mangolu Smoothie","mangolu-smoothie.jpg","Mangolu smoothie.","220 kcal","400 ml","Mango püresi, Yoğurt","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Kivili Smoothie","kivili-smoothie.jpg","Kivili smoothie.","170 kcal","400 ml","Kivi püresi, Yoğurt","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Karadutlu Smoothie","karadutlu-smoothie.jpg","Karadutlu smoothie.","200 kcal","400 ml","Karadut püresi, Yoğurt","Bilinen temel alerjen yoktur."),
P("Blend İçecek Çeşitleri","Şeftalili Smoothie","seftalili-smoothie.jpg","Şeftalili smoothie.","190 kcal","400 ml","Şeftali püresi, Yoğurt","Bilinen temel alerjen yoktur."), 

P("Soğuk Kahve Çeşitleri","Ice Americano","ice-americano.jpg","Buz ve espresso ile hazırlanan ferah Americano.","10 kcal","350 ml","Espresso, Su, Buz","Bilinen temel alerjen yoktur."),
P("Soğuk Kahve Çeşitleri","Ice Latte","ice-latte.jpg","Buzlu latte.","130 kcal","350 ml","Espresso, Süt, Buz","Süt içerir."),

P("Sıcak Kahve Çeşitleri","Americano","americano.jpg","Espresso bazlı sıcak kahve.","9 kcal","200 ml","Espresso, Sıcak Su","Bilinen temel alerjen yoktur."),
P("Sıcak Kahve Çeşitleri","Caffe Latte","caffe-latte.jpg","Espresso ve buharda ısıtılmış süt ile hazırlanır.","110 kcal","200 ml","Espresso, Süt","Süt içerir."),
P("Sıcak Kahve Çeşitleri","Cappuccino","cappuccino.jpg","Espresso, süt ve süt köpüğü ile hazırlanır.","90 kcal","200 ml","Espresso, Süt","Süt içerir."),
P("Sıcak Kahve Çeşitleri","Espresso","espresso.jpg","Yoğun aromalı tek shot espresso.","5 kcal","30 ml","Espresso","Bilinen temel alerjen yoktur."),
P("Sıcak Kahve Çeşitleri","Double Espresso","double-espresso.jpg","Çift shot espresso.","10 kcal","60 ml","Espresso","Bilinen temel alerjen yoktur."),
P("Sıcak Kahve Çeşitleri","Espresso Macchiato","espresso-macchiato.jpg","Süt köpüğü ile hazırlanan espresso.","15 kcal","60 ml","Espresso, Süt","Süt içerir."),
P("Sıcak Kahve Çeşitleri","Türk Kahvesi","turk-kahvesi.jpg","Geleneksel Türk kahvesi.","5 kcal","70 ml","Türk Kahvesi","Bilinen temel alerjen yoktur."),
P("Sıcak Kahve Çeşitleri","Double Türk Kahvesi","double-turk-kahvesi.jpg","Geleneksel Türk kahvesi.","10 kcal","140 ml","Türk Kahvesi","Bilinen temel alerjen yoktur."),

P("Şurup Çeşitleri","Çilek","bos.jpg","Sıcak ve soğuk kahvelerinize zengin bir tat katar.","","Çilek şurubu","Bilinen temel alerjen yoktur."),
P("Şurup Çeşitleri","Çikolata","bos.jpg","Sıcak ve soğuk kahvelerinize zengin bir tat katar.","","Çikolata şurubu","Bilinen temel alerjen yoktur."),
P("Şurup Çeşitleri","Karamel","bos.jpg","Sıcak ve soğuk kahvelerinize zengin bir tat katar.","","1 Fincan","Karamel şurubu","Bilinen temel alerjen yoktur."),
P("Şurup Çeşitleri","Beyaz Çikolata","bos.jpg","Sıcak ve soğuk kahvelerinize zengin bir tat katar.","","Beyaz çikolata şurubu","Bilinen temel alerjen yoktur."),
P("Şurup Çeşitleri","Fındık","bos.jpg","Sıcak ve soğuk kahvelerinize zengin bir tat katar.","","Fındık şurubu","Bilinen temel alerjen yoktur."),
P("Şurup Çeşitleri","Vanilya","bos.jpg","Sıcak ve soğuk kahvelerinize zengin bir tat katar.","","Vanilya şurubu","Bilinen temel alerjen yoktur."),
  
P("Bitki Çayı Çeşitleri","Adaçayı","bos.jpg","Doğal bitki özünü taşıyan, geleneksel demleme.","2 kcal","300 ml","Adaçayı","Bilinen temel alerjen yoktur."),
P("Bitki Çayı Çeşitleri","Hibiskus","bos.jpg","Meyvemsi aromasıyla dengeli bir demleme.","3 kcal","300 ml","Hibiskus","Bilinen temel alerjen yoktur."),
P("Bitki Çayı Çeşitleri","Ihlamur","bos.jpg","Özenle seçilen bitkiyle, geleneksel demleme.","2 kcal","300 ml","Ihlamur","Bilinen temel alerjen yoktur."),
P("Bitki Çayı Çeşitleri","Kış Çayı","bos.jpg","Soğuk günlere eşlik eden aromatik demleme.","5 kcal","300 ml","Bitki Karışımı","Bilinen temel alerjen yoktur."),
P("Bitki Çayı Çeşitleri","Kuşburnu","bos.jpg","Hafif ekşi, canlı aromasıylaferah bir demleme.","5 kcal","300 ml","Kuşburnu","Bilinen temel alerjen yoktur."),
P("Bitki Çayı Çeşitleri","Yeşil Çay","bos.jpg","Zarif ve dengeli demleme.","2 kcal","300 ml","Yeşil Çay","Bilinen temel alerjen yoktur."),
P("Bitki Çayı Çeşitleri","Relax","bos.jpg","Sakinliğe eşlik eden yumuşak bir harman.","3 kcal","300 ml","Relax","Bilinen temel alerjen yoktur."),
  
P("Sıcak İçecek Çeşitleri","Demleme Çay","demleme-cay.jpg","Geleneksel demleme siyah çay.","","1 Bardak","Siyah Çay","Bilinen temel alerjen yoktur."),
P("Sıcak İçecek Çeşitleri","Demleme Fincan Çay","demleme-fincan-cay.jpg","Demleme siyah çay fincanda servis edilir.","","1 Fincan","Siyah Çay","Bilinen temel alerjen yoktur."),
P("Sıcak İçecek Çeşitleri","Sade Nescafe","sade-nescafe.jpg","Sıcak suda hazırlanan klasik Nescafe.","","1 Fincan","Hazır Kahve","Bilinen temel alerjen yoktur."),
P("Sıcak İçecek Çeşitleri","Sütlü Nescafe","sutlu-nescafe.jpg","Süt ile hazırlanan yumuşak içimli Nescafe.","","1 Fincan","Hazır Kahve, Süt","Süt içerir."),
P("Sıcak İçecek Çeşitleri","Sahlep","sahlep.jpg","Tarçın ile servis edilen sıcak sahlep.","","1 Fincan","Sahlep, Süt","Süt içerir."),
P("Sıcak İçecek Çeşitleri","Hot Chocolate","hot-chocolate.jpg","Sıcak çikolata.","","1 Fincan","Süt, Çikolata","Süt içerir."),
  
P("Kokteyl Çeşitleri","Long Island Ice Tea","long-island-ice-tea.jpg","Vodka, cin ve ice tea ile hazırlanan klasik kokteyl. Tercihe göre kola ile servis edilir.","290 kcal","300 ml","Vodka, Bacardi, Portakal likörü, Cin, İce tea","Alkol içerir."),
P("Kokteyl Çeşitleri","Sex on the Beach","sex-on-the-beach.jpg","Meyvemsi aromalı ferah kokteyl.","326 kcal","250 ml","Vodka, Şeftali Likörü, Portakal suyu, Granedin, Tekila ","Alkol içerir."),
P("Kokteyl Çeşitleri","Mojito","mojito.jpg","Nane ve lime ile hazırlanan ferahlatıcı kokteyl.","217 kcal","300 ml","White rom, Esmer şeker, Nane, Limon, Soda","Alkol içerir."),
P("Kokteyl Çeşitleri","Margarita","margarita.jpg","Tekila bazlı klasik margarita.","275 kcal","180 ml","Tekila, Portakal likörü, Şeker şurubu, Limon","Alkol içerir."),
P("Kokteyl Çeşitleri","Apple Martini","apple-martini.jpg","Yeşil elma aromalı martini.","220 kcal","150 ml","Vodka, Martini, Elma suyu","Alkol içerir."),
P("Kokteyl Çeşitleri","Beyazıt","beyazit.jpg","Narenciye ile tamamlanan cesur bir harman.","290 kcal","200 ml","Votka, Cin, Tekila, Bacardi, Limon Suyu, Portakal Likörü, Sprite","Alkol içerir."),
P("Kokteyl Çeşitleri","Dirty Martini","dirty-martini.jpg","Zeytinin cesur dokunuşuyla eşsiz bir klasik.","175 kcal","150 ml","Cin, Zeytin suyu, Vermut dry","Alkol içerir."),
P("Kokteyl Çeşitleri","Espresso Martini","espresso-martini.jpg","Yoğun kahve karakteriyle unutulmaz bir deneyim.","290 kcal","150 ml","Votka, Kahve Likörü, Espresso, Şeker şurubu","Alkol içerir."),
P("Kokteyl Çeşitleri","Cosmopolitan","cosmopolitan.jpg","Meyvemsi karakteriyle pürüzsüz bir klasik.","150 kcal","150 ml","Votka, Portakal likörü, Limon suyu, Kızılcık suyu","Alkol içerir."),
P("Kokteyl Çeşitleri","Negroni","negroni.jpg","İkonik İtalyan kokteyl kültürününün simgesi.","185 kcal","90 ml","Cin, Campari, Şeker şurubu, Kırmızı şarap","Alkol içerir."),
P("Kokteyl Çeşitleri","Whiskey Sour","whiskey-sour.jpg","Yoğun aromalı, ekşi ve dengeli klasik.","210 kcal","150 ml","Viski, Limon suyu, Şeker şurubu","Alkol içerir."),
P("Kokteyl Çeşitleri","Mango Tango","mango-tango.jpg","Mango ve turunçgil aromalarıyla tropikal ferahlık.","230 kcal","180 ml","White rom, Portakal likörü, Mango suyu, Limon suyu, Şeker şurubu","Alkol içerir."),
  
P("Kurudite Çeşitleri","Havuç","bos.jpg","Taze havuç dilimleri.","","Porsiyon","Havuç","Bilinen temel alerjen yoktur."),
P("Kurudite Çeşitleri","Kurudite","bos.jpg","Taze havuç ve salatalık dilimlerinden oluşan kurudite tabağı.","","Porsiyon","Havuç, Salatalık","Bilinen temel alerjen yoktur."),
P("Kurudite Çeşitleri","Salatalık","bos.jpg","Taze salatalık dilimleri.","","Porsiyon","Salatalık","Bilinen temel alerjen yoktur."),
P("Kurudite Çeşitleri","Turşu","bos.jpg","Karışık turşu tabağı.","","Porsiyon","Karışık Turşu","Bilinen temel alerjen yoktur."),

P("İthal İçecek Çeşitleri","B-52","b-52.jpg","Klasik B-52 shot kokteyli.","150 kcal","60 ml","Kahve likörü, Kremalı Kakao Likörü, Portakal likörü","Alkol içerir."),
P("İthal İçecek Çeşitleri","Baileys","baileys.jpg","Kremalı Kakao Likörü.","200 kcal","100 ml","Kremalı Kakao Likörü","Süt içerir, Alkol içerir."),
P("İthal İçecek Çeşitleri","Tek Cin","bos.jpg","Tek ölçü cin.","","Tek","Cin","Alkol içerir."),
P("İthal İçecek Çeşitleri","Double Cin","bos.jpg","Duble ölçü cin.","","Duble","Cin","Alkol içerir."),
P("İthal İçecek Çeşitleri","Jager","bos.jpg","Jägermeister shot.","","Shot","Bitkisel likör","Alkol içerir."),
P("İthal İçecek Çeşitleri","Malibu","bos.jpg","Hindistan cevizi aromalı rom likörü.","","Kadeh","Rom Likörü","Alkol içerir."),
P("İthal İçecek Çeşitleri","Tekila","bos.jpg","Tekila shot.","","Shot","Tekila Shot","Alkol içerir."),
P("İthal İçecek Çeşitleri","Olmeca 35 CL","bos.jpg","35 CL Olmeca Tekila.","","35 CL","Tekila","Alkol içerir."),
P("İthal İçecek Çeşitleri","Olmeca 50 CL","bos.jpg","50 CL Olmeca Tekila.","","50 CL","Tekila","Alkol içerir."),
P("İthal İçecek Çeşitleri","Olmeca 70 CL","bos.jpg","70 CL Olmeca Tekila.","","70 CL","Tekila","Alkol içerir."),


P("Şarap Çeşitleri","Blush Kadeh","blush-kadeh.jpg","Kadeh Blush şarap.","","Kadeh","Şarap","Alkol içerir."),
P("Şarap Çeşitleri","Beyaz Kadeh","beyaz-kadeh.jpg","Kadeh servis edilir.","","Kadeh","Şarap","Alkol içerir."),
P("Şarap Çeşitleri","Kırmızı Kadeh","kirmizi-kadeh.jpg","Kadeh servis edilir.","","Kadeh","Şarap","Alkol içerir."),
P("Şarap Çeşitleri","Blush Şişe 75 CL","bos.jpg","75 CL Blush şarap.","","75 CL","Şarap","Alkol içerir."),
P("Şarap Çeşitleri","Beyaz Şişe 37.5 CL","bos.jpg","37.5 CL beyaz şarap.","","37.5 CL","Şarap","Alkol içerir."),
P("Şarap Çeşitleri","Kırmızı Şişe 37.5 CL","bos.jpg","37.5 CL  kırmızı şarap.","","37.5 CL","Şarap","Alkol içerir."),
P("Şarap Çeşitleri","Beyaz Şişe 75 CL","bos.jpg","75 CL beyaz şarap.","","75 CL","Şarap","Alkol içerir."),
P("Şarap Çeşitleri","Kırmızı Şişe 75 CL","bos.jpg","75 CL kırmızı şarap.","","75 CL","Şarap","Alkol içerir."),

P("Viski Çeşitleri","Tek Chivas","tek-viski.jpg","Tek ölçü Chivas Regal.","","Tek","Viski","Alkol içerir."),
P("Viski Çeşitleri","Double Chivas","double-viski.jpg","Duble ölçü Chivas Regal.","","Duble","Viski","Alkol içerir."),
P("Viski Çeşitleri","Tek Jack Daniel's","tek-viski.jpg","Tek ölçü Jack Daniel's.","","Tek","Viski","Alkol içerir."),
P("Viski Çeşitleri","Double Jack Daniel's","double-viski.jpg","Duble ölçü Jack Daniel's.","","Duble","Viski","Alkol içerir."),
P("Viski Çeşitleri","Chivas 35 CL","bos.jpg","35 CL Chivas Regal.","","35 CL","Viski","Alkol içerir."),
P("Viski Çeşitleri","Chivas 50 CL","bos.jpg","50 CL Chivas Regal.","","50 CL","Viski","Alkol içerir."),
P("Viski Çeşitleri","Chivas 70 CL","bos.jpg","70 CL Chivas Regal.","","70 CL","Viski","Alkol içerir."),
P("Viski Çeşitleri","Chivas 100 CL","bos.jpg","100 CL Chivas Regal.","","100 CL","Viski","Alkol içerir."),
P("Viski Çeşitleri","Jack Daniel's 35 CL","bos.jpg","35 CL Jack Daniel's.","","35 CL","Viski","Alkol içerir."),
P("Viski Çeşitleri","Jack Daniel's 70 CL","bos.jpg","70 CL Jack Daniel's.","","70 CL","Viski","Alkol içerir."),

P("İthal İçecek Çeşitleri","Tek Votka","bos.jpg","Tek ölçü votka.","","Tek","Votka","Alkol içerir."),
P("İthal İçecek Çeşitleri","Duble Votka","bos.jpg","Duble ölçü votka.","","Duble","Votka","Alkol içerir."),
P("İthal İçecek Çeşitleri","Tek Votka Enerji","bos.jpg","Enerji içeceği ile servis edilir.","","Tek","Votka, Enerji İçeceği","Alkol içerir."),
P("İthal İçecek Çeşitleri","Duble Votka Enerji","bos.jpg","Enerji içeceği ile servis edilir.","","Duble","Votka, Enerji İçeceği","Alkol içerir."),
P("İthal İçecek Çeşitleri","Absolut 35 CL","bos.jpg","35 CL Absolut Vodka.","","35 CL","Votka","Alkol içerir."),
P("İthal İçecek Çeşitleri","Absolut 50 CL","bos.jpg","50 CL Absolut Vodka.","","50 CL","Votka","Alkol içerir."),
P("İthal İçecek Çeşitleri","Absolut 70 CL","bos.jpg","70 CL Absolut Vodka.","","70 CL","Votka","Alkol içerir."),
P("İthal İçecek Çeşitleri","Absolut 100 CL","bos.jpg","100 CL Absolut Vodka.","","100 CL","Votka","Alkol içerir."),

P("Bira Çeşitleri","3 Litre Biraver","bos.jpg","3 litre bira. Soğuk servis edilir.","","3 Litre","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Amsterdam 50 CL","bos.jpg","50 CL bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Belfast 50 CL","bos.jpg","50 CL bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Bavyera 1 LT","bos.jpg","1 litre bira. Soğuk servis edilir.","","1 LT","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Becks 50 CL","bos.jpg","50 CL bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Bomonti Filtresiz 50 CL","bos.jpg","50 CL filtresiz bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Bud 50 CL","bos.jpg","50 CL bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Corona 33 CL","bos.jpg","33 CL bira. Soğuk servis edilir.","","33 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Efes Tombul 50 CL","bos.jpg","50 CL bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Efes Fıçı 33 CL","bos.jpg","33 CL fıçı bira. Soğuk servis edilir.","","33 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Efes Fıçı 50 CL","bos.jpg","50 CL fıçı bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Efes Fıçı 70 CL","bos.jpg","70 CL fıçı bira. Soğuk servis edilir.","","70 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Efes Malt 50 CL","bos.jpg","50 CL malt içeceği. Soğuk servis edilir.","","50 CL","Malt","Gluten içerir."),
P("Bira Çeşitleri","Efes Özel Seri 50 CL","bos.jpg","50 CL özel seri bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Efes Şişe 50 CL","bos.jpg","50 CL şişe bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Mexican Bardak","bos.jpg","Mexican bira servis bardağı.","","","",""),
P("Bira Çeşitleri","Mexican Bira","bos.jpg","Soğuk servis edilir.","","","Malt, şerbetçiotu, su","Gluten içerir."),
P("Bira Çeşitleri","Miller 50 CL","bos.jpg","50 CL bira. Soğuk servis edilir.","","50 CL","Malt, şerbetçiotu, su","Gluten içerir."),

P("Rakı Çeşitleri","Tek Rakı","bos.jpg","Tek ölçü rakı.","","Tek","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Duble Rakı","bos.jpg","Duble ölçü rakı.","","Duble","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Tekirdağ Altın Seri Tek","bos.jpg","Tek ölçü Tekirdağ Altın Seri.","","Tek","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Tekirdağ Altın Seri Duble","bos.jpg","Duble ölçü Tekirdağ Altın Seri.","","Duble","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Tekirdağ Altın Seri 20 CL","bos.jpg","20 CL Tekirdağ Altın Seri.","","20 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Tekirdağ Altın Seri 35 CL","bos.jpg","35 CL Tekirdağ Altın Seri.","","35 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Tekirdağ Altın Seri 50 CL","bos.jpg","50 CL Tekirdağ Altın Seri.","","50 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Tekirdağ Altın Seri 70 CL","bos.jpg","70 CL Tekirdağ Altın Seri.","","70 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Tekirdağ Altın Seri 100 CL","bos.jpg","100 CL Tekirdağ Altın Seri.","","100 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Beylerbeyi 20 CL","bos.jpg","20 CL Beylerbeyi Rakısı.","","20 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Beylerbeyi 35 CL","bos.jpg","35 CL Beylerbeyi Rakısı.","","35 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Beylerbeyi 50 CL","bos.jpg","50 CL Beylerbeyi Rakısı.","","50 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Beylerbeyi 70 CL","bos.jpg","70 CL Beylerbeyi Rakısı.","","70 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Beylerbeyi 100 CL","bos.jpg","100 CL Beylerbeyi Rakısı.","","100 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Efe Gold 20 CL","bos.jpg","20 CL Efe Gold Rakısı.","","20 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Efe Gold 35 CL","bos.jpg","35 CL Efe Gold Rakısı.","","35 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Efe Gold 50 CL","bos.jpg","50 CL Efe Gold Rakısı.","","50 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Efe Gold 70 CL","bos.jpg","70 CL Efe Gold Rakısı.","","70 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Efe Gold 100 CL","bos.jpg","100 CL Efe Gold Rakısı.","","100 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Kulüp Rakı 35 CL","bos.jpg","35 CL Kulüp Rakı.","","35 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Kulüp Rakı 70 CL","bos.jpg","70 CL Kulüp Rakı.","","70 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Yeni Rakı 20 CL","bos.jpg","20 CL Yeni Rakı.","","20 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Yeni Rakı 35 CL","bos.jpg","35 CL Yeni Rakı.","","35 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Yeni Rakı 50 CL","bos.jpg","50 CL Yeni Rakı.","","50 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Yeni Rakı 70 CL","bos.jpg","70 CL Yeni Rakı.","","70 CL","Rakı","Alkol içerir."),
P("Rakı Çeşitleri","Yeni Rakı 100 CL","bos.jpg","100 CL Yeni Rakı.","","100 CL","Rakı","Alkol içerir."),
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
const categoryClose = document.createElement("button");
categoryClose.className = "category-fixed-close";
categoryClose.innerHTML = "×";
categoryClose.setAttribute("aria-label", "Kategoriyi kapat");
categoryClose.hidden = true;
document.body.appendChild(categoryClose);

categoryClose.onclick = () => {
  const openSection = categoryGrid.querySelector(".accordion-category.open");

  if (openSection) {
    openSection.classList.remove("open");

    const productsBox = openSection.querySelector(".accordion-products");
    productsBox.innerHTML = "";

    categoryClose.hidden = false;
categoryClose.classList.add("show");

    openSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
};
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
     if(wasOpen){
  categoryClose.classList.remove("show");
       categoryClose.hidden = true;
}
     if(!wasOpen){
       const list=products.filter(p=>p.cat===section.dataset.cat);
       const box=section.querySelector(".accordion-products");
       box.innerHTML=list.map(productCard).join("");
       box.querySelectorAll(".product-card").forEach((card,i)=>{
         card.onclick=()=>openDetail(list[i]);
       });
       section.classList.add("open");
       categoryClose.hidden = false;
       categoryClose.classList.add("show");
       setTimeout(()=>section.scrollIntoView({behavior:"smooth",block:"start"}),80);
     }
   };
 });
}
function showCategory(cat){showCategories();const section=[...categoryGrid.querySelectorAll(".accordion-category")].find(x=>x.dataset.cat===cat);if(section)section.querySelector(".accordion-head").click()}
function openDetail(p){categoryClose.classList.remove("show");categoryClose.hidden=true;document.getElementById("modalImage").src=`assets/menu/${p.img}`;document.getElementById("modalCategory").textContent=p.cat.toUpperCase();document.getElementById("modalName").textContent=trTitleCase(p.name);document.getElementById("modalDesc").textContent=p.desc;document.getElementById("modalCal").textContent=p.cal;document.getElementById("modalGram").textContent=p.gram;document.getElementById("modalIngredients").textContent=(p.ing||"").split(",").map(function(item){return trTitleCase(item.trim());}).join(", ");document.getElementById("modalAllergens").innerHTML=allergenIconCards(p.all||p.allergen||p.allergens||"");modal.classList.remove("hidden")}
backBtn.onclick=showCategories;document.getElementById("closeModal").onclick=()=>{modal.classList.add("hidden");const openCategory=categoryGrid.querySelector(".accordion-category.open");if(openCategory){categoryClose.hidden=false;categoryClose.classList.add("show");}};modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};showCategories();
