// ================= KUTAA 6: Of-too'annoo (keyboard + bilbila) =================
const K={};let gear='N';
function setGear(g){if(Math.abs(C.speed)<2||!inCar){gear=g;document.getElementById('gear').textContent=g;['N','D','R'].forEach(x=>document.getElementById('g'+x).classList.toggle('on',x===g))}}
function toggleDoors(){doorsOpen=!doorsOpen}
function enterExit(){
  startAudio();
  const dx=P.x-C.x,dz=P.z-C.z;
  if(!inCar){
    if(Math.hypot(dx,dz)<5){inCar=true;doorsOpen=true;setTimeout(()=>{doorsOpen=false},900);player.visible=false}
  }else if(Math.abs(C.speed)<3){
    inCar=false;doorsOpen=true;setTimeout(()=>{doorsOpen=false},1200);
    P.x=C.x-Math.cos(C.rot)*2.4;P.z=C.z+Math.sin(C.rot)*2.4;P.rot=C.rot;player.visible=true;C.speed=0;
  }
}
addEventListener('keydown',e=>{K[e.code]=true;startAudio();
  if(e.code==='KeyE')enterExit();if(e.code==='KeyF')toggleDoors();
  if(e.code==='Digit1')setGear('N');if(e.code==='Digit2')setGear('D');if(e.code==='Digit3')setGear('R')});
addEventListener('keyup',e=>K[e.code]=false);
function hold(id,code){const el=document.getElementById(id);
  const on=e=>{e.preventDefault();K[code]=true;startAudio()},off=e=>{e.preventDefault();K[code]=false};
  el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointerleave',off);el.addEventListener('pointercancel',off)}
hold('gas','ArrowUp');hold('brk','ArrowDown');hold('lt','ArrowLeft');hold('rt','ArrowRight');
const tap=(id,fn)=>document.getElementById(id).addEventListener('pointerdown',e=>{e.preventDefault();startAudio();fn()});
tap('gN',()=>setGear('N'));tap('gD',()=>setGear('D'));tap('gR',()=>setGear('R'));
tap('dr',toggleDoors);tap('en',enterExit);
setGear('N');
