/* nav: solid after scrolling past the top */
(function(){
  var nav=document.querySelector('.nav');if(!nav)return;
  function s(){nav.classList.toggle('solid',scrollY>40);}
  s();addEventListener('scroll',s,{passive:true});
})();

/* mobile drawer */
(function(){
  var btn=document.querySelector('.menu-btn'),dr=document.getElementById('drawer');if(!btn||!dr)return;
  function open(){dr.hidden=false;document.body.style.overflow='hidden';btn.setAttribute('aria-expanded','true');dr.querySelector('a').focus();}
  function close(){dr.hidden=true;document.body.style.overflow='';btn.setAttribute('aria-expanded','false');}
  btn.addEventListener('click',open);
  dr.querySelector('.close').addEventListener('click',close);
  [].forEach.call(dr.querySelectorAll('a'),function(a){a.addEventListener('click',close);});
  addEventListener('keydown',function(e){if(!dr.hidden&&e.key==='Escape')close();});
})();

/* reveal on scroll */
(function(){
  var els=[].slice.call(document.querySelectorAll('.rv'));
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){io.observe(e);});
})();

/* background videos: play only while visible (saves battery and data) */
(function(){
  var vs=[].slice.call(document.querySelectorAll('video[data-auto]'));
  if(!vs.length)return;
  vs.forEach(function(v){v.muted=true;v.setAttribute('muted','');});
  if(!('IntersectionObserver' in window)){vs.forEach(function(v){v.play().catch(function(){});});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
    if(e.isIntersecting){if(v.preload==='none')v.preload='auto';var p=v.play();if(p&&p.catch)p.catch(function(){});}else if(!v.paused)v.pause();});},{threshold:.15});
  vs.forEach(function(v){io.observe(v);});
})();

/* rotating renders */
(function(){
  [].forEach.call(document.querySelectorAll('.rot-frame'),function(fr){
    var ims=[].slice.call(fr.querySelectorAll('img')),i=0;
    if(ims.length<2||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    setInterval(function(){ims[i].classList.remove('on');i=(i+1)%ims.length;ims[i].loading='eager';ims[i].classList.add('on');ims[(i+1)%ims.length].loading='eager';},5000);
  });
})();

/* contact form: compose an email to contact@murcielaco.com in the visitor's mail app */
(function(){
  var f=document.getElementById('contactForm');if(!f)return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var g=function(n){return (f.elements[n].value||'').trim();};
    var name=(g('first')+' '+g('last')).trim();
    var subject='Project inquiry'+(name?' — '+name:'');
    var body=g('message')+'\n\n'+name+(g('email')?'\n'+g('email'):'');
    location.href='mailto:contact@murcielaco.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();

/* Instagram gallery: official embeds, cropped so only the media shows */
(function(){
  var gal=document.getElementById('gallery');if(!gal)return;
  var track=document.getElementById('track'),count=document.getElementById('count'),opener=document.getElementById('openGallery');
  var IG_POSTS=["p/DPUTx77AQms","p/DdWc3Pkkfd-","p/DbCPbv6jndx","reel/DbCLwjBOyzp","p/DZHDxR9jkQN","p/DYkAlNSDg88","p/DYhdeR6DjDM","reel/DU6_JayDhDV","p/DU8VieSjiGE","reel/DVT4_9jDksA","p/DU0oTE7DtAM","p/DU5VJ6NDhoR","reel/DPUKiRlDUdC","reel/DSdN_2yEkxX","p/DQZcGl-jYhV","reel/DQZd_qFjWXs","reel/DRFFaKtDWLA","p/DHGu8xmib4q","reel/DLaOl4-s_Na","reel/DLYei-mPuGw","p/DITqQhAu8x5","reel/CwIdH3yBbMn","reel/DLSOg9IRQJS","p/DLfl7fcxr4Y","p/DU2hxfCDlca"];
  track.innerHTML=IG_POSTS.map(function(p,i){
    return '<figure class="slide"><div class="igwrap"><iframe data-src="https://www.instagram.com/'+p+'/embed/" title="Instagram post '+(i+1)+' by @murcielaco" allowtransparency="true" scrolling="no" allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"></iframe></div></figure>';
  }).join('');
  var slides=[].slice.call(track.querySelectorAll('.slide')),cur=0,IGH=55,IGF=156;
  function fit(sl){
    var wrap=sl.querySelector('.igwrap'),f=wrap.querySelector('iframe');
    var Ws=sl.clientWidth-8,Hs=sl.clientHeight;if(!Ws||!Hs)return;
    var r=sl._r||1.25,w=Math.floor(Math.min(Ws,520,Hs/r));
    if(sl._w!==w){sl._w=w;f.style.width=(w+2)+'px';}
    var t=sl._t||(IGH+IGF+Math.round(w*r)+4),mh=Math.max(40,t-IGH-IGF);
    f.style.height=t+'px';f.style.top=(-IGH)+'px';
    wrap.style.width=w+'px';wrap.style.height=Math.min(mh,Hs)+'px';
  }
  addEventListener('message',function(e){
    if(!/instagram\.com$/.test((e.origin||'').replace(/^https?:\/\//,'')))return;
    var d=e.data;try{if(typeof d==='string')d=JSON.parse(d);}catch(_){return;}
    if(!d||d.type!=='MEASURE'||!d.details||!d.details.height)return;
    slides.forEach(function(sl){var f=sl.querySelector('iframe');if(f&&f.contentWindow===e.source){
      sl._t=d.details.height;var mh=sl._t-IGH-IGF;if(sl._w&&mh>0)sl._r=mh/sl._w;
      var Hs=sl.clientHeight;if(Hs&&mh>Hs+2)sl._t=0;fit(sl);}});
  });
  function load(){[cur-1,cur,cur+1,cur+2].forEach(function(k){var s=slides[k];if(!s)return;[].forEach.call(s.querySelectorAll('[data-src]'),function(m){m.src=m.dataset.src;m.removeAttribute('data-src');});});}
  function pos(){track.style.setProperty('--x',-(slides[cur].offsetLeft-slides[0].offsetLeft)+'px');}
  function update(){count.textContent=(cur+1)+' / '+slides.length;load();}
  function go(d){cur=Math.max(0,Math.min(slides.length-1,cur+d));pos();update();}
  function open(){gal.hidden=false;document.body.style.overflow='hidden';cur=0;track.style.setProperty('--x','0px');slides.forEach(fit);update();}
  function close(){gal.hidden=true;document.body.style.overflow='';opener.focus();}
  opener.addEventListener('click',open);
  document.getElementById('closeGallery').addEventListener('click',close);
  document.getElementById('prev').addEventListener('click',function(){go(-1);});
  document.getElementById('next').addEventListener('click',function(){go(1);});
  addEventListener('resize',function(){if(!gal.hidden){slides.forEach(fit);pos();}});
  var tx=null,ty=0;
  track.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
  track.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))go(dx<0?1:-1);},{passive:true});
  addEventListener('keydown',function(e){if(gal.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);});
})();
