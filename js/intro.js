let stage=0;
const intro=document.getElementById("intro");
const welcome=document.getElementById("welcome");
const bulbs=document.querySelectorAll(".edison");
const overlay=document.querySelector(".overlay");
const touch=document.querySelector(".touch");

document.addEventListener("click",()=>{
 if(stage!==0)return;
 stage=1;
 if(touch){touch.style.transition=".5s";touch.style.opacity="0"}
 bulbs.forEach((bulb,index)=>{
   setTimeout(()=>{
     bulb.classList.add("on");
     intro.classList.remove(...[1,2,3,4,5,6,7].map(n=>`light-${n}`));
     intro.classList.add(`light-${index+1}`);
     const darkness=Math.max(.16,.68-((index+1)*.075));
     overlay.style.background=`rgba(0,0,0,${darkness})`;
   },index*320);
 });
 setTimeout(()=>{
   intro.style.transition="1.1s";intro.style.opacity="0";
   setTimeout(()=>{
     intro.style.display="none";
     welcome.style.opacity="1";
     welcome.style.pointerEvents="auto";
     welcome.classList.add("cinematic");
   },1000);
 },3000);
 setTimeout(()=>{ if (typeof window.openMenu === "function") window.openMenu(); },6200);
});