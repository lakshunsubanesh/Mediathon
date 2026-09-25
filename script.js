const progressBar=document.getElementById("progressBar");
const clock=document.getElementById("clock");
const begin=document.getElementById("beginBtn");
const compare=document.getElementById("compare");
const before=compare.querySelector(".compare-before");
const handle=compare.querySelector(".compare-handle");

function updateProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progressBar.style.width=(window.scrollY/max*100)+"%";
}
window.addEventListener("scroll",updateProgress,{passive:true});
updateProgress();

begin.addEventListener("click",()=>document.querySelector(".chapter-one").scrollIntoView({behavior:"smooth"}));

function updateClock(){
  const now=new Date();
  clock.textContent=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
}
updateClock(); setInterval(updateClock,30000);

let dragging=false;
let compareFrame=0;
let compareTarget=50;
let compareCurrent=50;

function renderCompare(){
  compareFrame=0;
  compareCurrent += (compareTarget-compareCurrent)*0.42;
  if(Math.abs(compareTarget-compareCurrent)<0.05) compareCurrent=compareTarget;
  compare.style.setProperty("--split", compareCurrent+"%");
  if(Math.abs(compareTarget-compareCurrent)>=0.05){
    compareFrame=requestAnimationFrame(renderCompare);
  }
}

function setCompare(clientX){
  const r=compare.getBoundingClientRect();
  let pct=((clientX-r.left)/r.width)*100;
  compareTarget=Math.max(0.5,Math.min(99.5,pct));
  compare.classList.add("has-moved");
  if(!compareFrame) compareFrame=requestAnimationFrame(renderCompare);
}

function startCompare(e){
  dragging=true;
  compare.classList.add("is-dragging");
  if(e.pointerId!==undefined && compare.setPointerCapture){
    try{compare.setPointerCapture(e.pointerId)}catch(_){}
  }
  setCompare(e.clientX);
  e.preventDefault();
}
function moveCompare(e){
  if(!dragging) return;
  setCompare(e.clientX);
  e.preventDefault();
}
function endCompare(e){
  dragging=false;
  compare.classList.remove("is-dragging");
  if(e && e.pointerId!==undefined && compare.releasePointerCapture){
    try{compare.releasePointerCapture(e.pointerId)}catch(_){}
  }
}

compare.addEventListener("pointerdown",startCompare,{passive:false});
compare.addEventListener("pointermove",moveCompare,{passive:false});
compare.addEventListener("pointerup",endCompare);
compare.addEventListener("pointercancel",endCompare);
compare.addEventListener("lostpointercapture",endCompare);
compare.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowLeft" || e.key==="ArrowRight"){
    compareTarget += e.key==="ArrowRight" ? 3 : -3;
    compareTarget=Math.max(.5,Math.min(99.5,compareTarget));
    compare.classList.add("has-moved");
    if(!compareFrame) compareFrame=requestAnimationFrame(renderCompare);
    e.preventDefault();
  }
});

// Cinematic scroll reveals
const revealTargets = document.querySelectorAll(
  ".chapter-label,.chapter-title,.split,.wide-photo,.center-intro,.mosaic figure,.statement,.quiet-intro,.quiet-grid figure,.full-quote,.absence-copy,.compare,.absence-line,.memory-reel,.ending-copy,footer"
);
revealTargets.forEach(el=>el.classList.add("reveal"));
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12, rootMargin:"0px 0px -8% 0px"});
revealTargets.forEach(el=>revealObserver.observe(el));

// Gentle photo parallax
const photos = document.querySelectorAll(".photo");
window.addEventListener("scroll",()=>{
  const vh = innerHeight;
  photos.forEach((el)=>{
    const r = el.getBoundingClientRect();
    if(r.bottom>0 && r.top<vh){
      const p=(vh-r.top)/(vh+r.height);
      el.style.setProperty("--photo-shift", `${(p-.5)*12}px`);
    }
  });
},{passive:true});

// Make the compare handle draggable by touch/mouse without selecting the page.
compare.addEventListener("dblclick",()=>setCompare(compare.getBoundingClientRect().left + compare.getBoundingClientRect().width*.5));

/* =========================================================
   CHAPTER HIGHLIGHTING
   Marks whichever section is currently centered in view, and
   gently pulses the sun orb's scale as the page scrolls.
   ========================================================= */
const sections = [...document.querySelectorAll(".story-section")];

function highlightActiveSection(){
  const orb=document.querySelector(".sun-orb");
  const p=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--day-progress"))||0;
  if(orb) orb.style.transform=`translate(-50%,-50%) scale(${1 + Math.sin(p*Math.PI)*.1})`;

  sections.forEach(sec=>{
    const r=sec.getBoundingClientRect();
    const active=r.top < innerHeight*.55 && r.bottom > innerHeight*.35;
    sec.classList.toggle("story-active",active);
  });
}
window.addEventListener("scroll",highlightActiveSection,{passive:true});
window.addEventListener("resize",highlightActiveSection);
highlightActiveSection();

/* =========================================================
   LAZY SECTION LOADING + SMOOTH CHRONOLOGICAL SCROLL
   Sections become active only when the viewer reaches them.
   Images do not request their file until their section is near.
   ========================================================= */
(() => {
  const doc = document.documentElement;
  const storySections = [...document.querySelectorAll(".lazy-section")];
  const lazyImages = [...document.querySelectorAll(".lazy-img")];
  let ticking = false;
  let lastScrollY = window.scrollY;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.addEventListener("load", () => img.classList.add("is-loaded"), {once:true});
        // SVG should be instant, but keep a fallback in case of cached rendering.
        requestAnimationFrame(() => img.classList.add("is-loaded"));
      }
      observer.unobserve(img);
    });
  }, {rootMargin:"220px 0px", threshold:0.01});

  lazyImages.forEach(img => imageObserver.observe(img));

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-loaded");
      observer.unobserve(entry.target);
    });
  }, {rootMargin:"140px 0px 10% 0px", threshold:0.02});

  storySections.forEach(section => sectionObserver.observe(section));

  // Real timestamps from the photographs: one walk, 17:06 to 17:30.
  const timeline = [
    {p:0.00, time:"17:06 PM"},
    {p:0.13, time:"17:09 PM"},
    {p:0.28, time:"17:12 PM"},
    {p:0.42, time:"17:15 PM"},
    {p:0.58, time:"17:18 PM"},
    {p:0.69, time:"17:20 PM"},
    {p:0.78, time:"17:23 PM"},
    {p:0.86, time:"17:26 PM"},
    {p:0.93, time:"17:28 PM"},
    {p:1.00, time:"17:30 PM"}
  ];
  const storyTime = document.getElementById("storyTime");

  const lerp = (a,b,t) => a + (b-a)*t;
  let displayed = 0;

  function update() {
    ticking = false;
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    const p = Math.max(0, Math.min(1, scrollY / max));

    // Slow, damped movement makes the sun/sky feel less mechanical.
    displayed = lerp(displayed, p, .11);

    doc.style.setProperty("--day-progress", displayed.toFixed(4));

    // The whole story is already golden hour, so blue-hour dusk
    // starts settling in from the midpoint and deepens by 17:30.
    const night = Math.max(0, Math.min(1, (displayed - .5) / .5));
    doc.style.setProperty("--night-alpha", night.toFixed(3));

    if (storyTime) {
      let a = timeline[0], b = timeline[timeline.length-1];
      for (let i=0;i<timeline.length-1;i++) {
        if (displayed >= timeline[i].p && displayed <= timeline[i+1].p) {
          a = timeline[i]; b = timeline[i+1]; break;
        }
      }
      storyTime.textContent = displayed < (a.p+b.p)/2 ? a.time : b.time;
    }

    // Tiny depth effect only on elements currently near the viewport.
    document.querySelectorAll(".photo").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > innerHeight + 80) return;
      const local = (innerHeight/2 - (r.top + r.height/2)) / Math.max(1,r.height);
      el.style.setProperty("--photo-shift", `${Math.max(-8,Math.min(8,local*8))}px`);
    });
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", requestUpdate, {passive:true});
  window.addEventListener("resize", requestUpdate);
  requestUpdate();

  // Reveal narrative copy a little after the section itself enters.
  const copyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      [...entry.target.querySelectorAll(".reveal")].forEach((el,i) => {
        setTimeout(() => el.classList.add("visible"), i*90);
      });
      copyObserver.unobserve(entry.target);
    });
  }, {rootMargin:"100px 0px", threshold:.03});
  storySections.forEach(s => copyObserver.observe(s));

  // Respect reduced-motion settings.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    doc.style.scrollBehavior = "auto";
  }
})();

compare.setAttribute("role","slider");
compare.setAttribute("aria-label","Compare today and someday photographs");
compare.setAttribute("tabindex","0");
compare.setAttribute("aria-valuemin","0");
compare.setAttribute("aria-valuemax","100");
compare.setAttribute("aria-valuenow","50");

const compareObserver = new MutationObserver(()=>{
  const split=parseFloat(getComputedStyle(compare).getPropertyValue("--split"))||50;
  compare.setAttribute("aria-valuenow",String(Math.round(split)));
});
compareObserver.observe(compare,{attributes:true,attributeFilter:["style"]});
