<!DOCTYPE html>
<html lang="om">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<title>Naol Lambo</title>
<style>
*{box-sizing:border-box;-webkit-user-select:none;user-select:none;touch-action:none;-webkit-tap-highlight-color:transparent}
html,body{margin:0;height:100%;overflow:hidden;background:#111;font-family:Arial,sans-serif;color:#fff}
canvas{display:block}
#hud{position:fixed;top:10px;left:50%;transform:translateX(-50%);text-align:center;text-shadow:0 1px 5px #000;pointer-events:none}
#spd{font-size:42px;font-weight:700;line-height:1}
#hud small{font-size:13px;opacity:.85}
#arrow{position:fixed;top:88px;left:50%;transform:translateX(-50%);text-align:center;text-shadow:0 1px 5px #000;pointer-events:none;display:none;font-size:14px}
#aico{font-size:34px;color:#fc0;line-height:1}
.b{position:fixed;background:#0007;border:2px solid #fff6;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;backdrop-filter:blur(3px)}
.pulse{background:#fc0d;color:#000}
#gas{right:16px;bottom:24px;width:84px;height:116px;border-radius:26px;background:#1f9d4acc}
#brk{right:112px;bottom:24px;width:74px;height:74px;border-radius:22px;background:#c0282acc}
#lt{left:16px;bottom:34px;width:74px;height:74px}
#rt{left:104px;bottom:34px;width:74px;height:74px}
#wheel{position:fixed;left:10px;bottom:16px;width:176px;height:176px;display:none}
#wheel svg{width:100%;height:100%;filter:drop-shadow(0 4px 8px #000b)}
#gears{position:fixed;right:20px;bottom:152px;display:none;flex-direction:column;gap:6px}
.g{width:46px;height:38px;border-radius:10px;background:#0008;border:2px solid #fff5;display:flex;align-items:center;justify-content:center;font-weight:700}
.g.on{background:#fc0e;color:#000}
.s{width:52px;height:52px}
#cam{right:14px;top:14px}#dr{right:14px;top:74px}#en{right:14px;top:134px}
body.car #wheel{display:block}
body.car #gears{display:flex}
body.car .walk{display:none}
body:not(.car) .carui{display:none}
#err{position:fixed;left:10px;right:10px;top:50%;transform:translateY(-50%);background:#900;color:#fff;padding:14px;border-radius:10px;font-size:15px;display:none;z-index:99}
</style>
</head>
<body>
<div id="hud"><div id="spd">0</div><small>km/h · <b id="gear">N</b></small></div>
<div id="arrow"><div id="aico">▲</div><div id="atxt"></div></div>
<div id="wheel"><svg id="wsvg" viewBox="0 0 200 200">
<circle cx="100" cy="100" r="84" fill="none" stroke="#0c0c0e" stroke-width="24"/>
<circle cx="100" cy="100" r="84" fill="none" stroke="#3a3a40" stroke-width="3" stroke-dasharray="3 5"/>
<rect x="18" y="94" width="164" height="14" rx="6" fill="#1b1b1f"/>
<rect x="93" y="100" width="14" height="76" rx="6" fill="#1b1b1f"/>
<rect x="92" y="10" width="16" height="22" rx="3" fill="#ffc400"/>
<circle cx="100" cy="100" r="26" fill="#111" stroke="#ffc400" stroke-width="3"/>
<text x="100" y="108" text-anchor="middle" font-size="22" font-weight="700" fill="#ffc400" font-family="Arial">NL</text>
</svg></div>
<div class="b walk" id="lt">◀</div><div class="b walk" id="rt">▶</div>
<div class="b" id="brk">BRAKE</div><div class="b" id="gas">GAS</div>
<div id="gears"><div class="g" id="gR">R</div><div class="g" id="gN">N</div><div class="g" id="gD">D</div></div>
<div class="b s carui" id="cam">CAM</div><div class="b s" id="dr">DOOR</div><div class="b s" id="en">GALI</div>
<div id="err"></div>
<script>
window.onerror=function(m,s,l){var e=document.getElementById('err');e.style.display='block';e.textContent='Dogoggora: '+m+' (line '+l+')'};
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>window.THREE||document.write('<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"><\/script>')</script>
<script>
if(!window.THREE){var e=document.getElementById('err');e.style.display='block';e.textContent='Three.js hin fe\'amne. Interneetii ilaalii refresh godhi.'}
else{
// ================= KUTAA 1: Scene, samii, ifa (aduu), kaameraa =================
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,0.05,1500);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
scene.fog=new THREE.Fog(0xcfdfee,90,700);
const skyTex=(()=>{const c=document.createElement('canvas');c.width=16;c.height=256;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,256);
  gr.addColorStop(0,'#2a66c8');gr.addColorStop(0.42,'#78aeea');gr.addColorStop(0.5,'#cfdfee');gr.addColorStop(1,'#b4c4a8');g.fillStyle=gr;g.fillRect(0,0,16,256);return new THREE.CanvasTexture(c)})();
const dome=new THREE.Mesh(new THREE.SphereGeometry(1000,16,16),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide,fog:false,depthWrite:false}));
scene.add(dome);
try{
  const pm=new THREE.PMREMGenerator(renderer);const es=new THREE.Scene();
  es.add(new THREE.Mesh(new THREE.SphereGeometry(100,16,16),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide})));
  scene.environment=pm.fromScene(es,0.02).texture;
}catch(e){}
scene.add(new THREE.HemisphereLight(0xcfe3ff,0x806c4c,0.6));
const sun=new THREE.DirectionalLight(0xfff0d0,1.3);
sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
const sc=sun.shadow.camera;sc.left=-40;sc.right=40;sc.top=40;sc.bottom=-40;sc.near=1;sc.far=300;sun.shadow.bias=-0.0006;
scene.add(sun);scene.add(sun.target);

// ================= KUTAA 2: Daandii, dachee, manoota, mukkeen, namoota =================
function tex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t}
const M=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
const rnd=(a,b)=>a+Math.random()*(b-a);

const roadTex=tex(512,512,(g,w,h)=>{
  g.fillStyle='#35363b';g.fillRect(0,0,w,h);
  for(let i=0;i<9000;i++){const v=40+Math.random()*50|0;g.fillStyle='rgba('+v+','+v+','+(v+4)+',0.55)';g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}
  [0.27,0.73].forEach(p=>{const gr=g.createLinearGradient(w*(p-0.07),0,w*(p+0.07),0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(0.5,'rgba(0,0,0,0.28)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(w*(p-0.07),0,w*0.14,h)});
  g.strokeStyle='rgba(10,10,10,0.5)';g.lineWidth=1.2;
  for(let i=0;i<14;i++){let x=Math.random()*w,y=Math.random()*h;g.beginPath();g.moveTo(x,y);for(let k=0;k<6;k++){x+=rnd(-18,18);y+=rnd(6,22);g.lineTo(x,y)}g.stroke()}
  g.fillStyle='#e9c200';g.fillRect(w/2-3,40,6,h*0.38);
  g.fillStyle='#e8e8e8';g.fillRect(8,0,6,h);g.fillRect(w-14,0,6,h);
});
roadTex.repeat.set(1,140);
const road=new THREE.Mesh(new THREE.PlaneGeometry(16,1400),new THREE.MeshLambertMaterial({map:roadTex}));
road.rotation.x=-Math.PI/2;road.receiveShadow=true;scene.add(road);

const groundTex=tex(512,512,(g,w,h)=>{
  g.fillStyle='#6a8838';g.fillRect(0,0,w,h);
  const cols=['110,140,60','150,135,75','88,120,48','160,125,80','120,150,70'];
  for(let i=0;i<70;i++){const x=Math.random()*w,y=Math.random()*h,r=25+Math.random()*70,c=cols[i%5];
    const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+c+',0.55)');gr.addColorStop(1,'rgba('+c+',0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
  for(let i=0;i<14000;i++){g.fillStyle='rgba('+(50+Math.random()*70|0)+','+(85+Math.random()*80|0)+',35,0.4)';g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*1.5,3+Math.random()*6)}
});
groundTex.repeat.set(100,100);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),new THREE.MeshLambertMaterial({map:groundTex}));
ground.rotation.x=-Math.PI/2;ground.position.y=-0.05;ground.receiveShadow=true;scene.add(ground);
const dirtTex=tex(128,128,(g,w,h)=>{g.fillStyle='#8c7550';g.fillRect(0,0,w,h);for(let i=0;i<1500;i++){g.fillStyle='rgba('+(90+Math.random()*60|0)+','+(70+Math.random()*50|0)+',40,0.5)';g.fillRect(Math.random()*w,Math.random()*h,2,2)}});
dirtTex.repeat.set(2,140);
[-1,1].forEach(s=>{
  const d=new THREE.Mesh(new THREE.PlaneGeometry(6,1400),new THREE.MeshLambertMaterial({map:dirtTex}));d.rotation.x=-Math.PI/2;d.position.set(s*14,0.005,0);d.receiveShadow=true;scene.add(d);
  const w=new THREE.Mesh(new THREE.BoxGeometry(3,0.2,1400),M(0xa8a39a));w.position.set(s*9.5,0.05,0);w.receiveShadow=true;scene.add(w);
});

const colliders=[];
const winTex=tex(64,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);for(let y=8;y<h;y+=24)for(let x=6;x<w;x+=20){g.fillStyle=Math.random()<0.25?'#c9b27a':'#3b4656';g.fillRect(x,y,12,14)}});
function building(x,z,w,d,h,col,signText,signCol){
  const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:col,map:winTex}));
  b.position.set(x,h/2,z);b.castShadow=true;scene.add(b);colliders.push({x,z,hw:w/2,hd:d/2});
  if(signText){
    const st=tex(512,128,(g,W,H)=>{g.fillStyle=signCol;g.fillRect(0,0,W,H);g.strokeStyle='#fff';g.lineWidth=6;g.strokeRect(6,6,W-12,H-12);g.fillStyle='#fff';g.font='bold 62px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(signText,W/2,H/2+3)});
    const s=new THREE.Mesh(new THREE.PlaneGeometry(w*0.9,w*0.9/4),new THREE.MeshBasicMaterial({map:st}));
    const side=x<0?1:-1;s.position.set(x+side*(w/2+0.1),Math.min(h-2,7),z);s.rotation.y=side*Math.PI/2;scene.add(s);
  }
}
building(-22,40,14,18,16,0xd9c9a8,'NAOL HOTEL','#a31621');
building(22,70,14,18,9,0xb0b0b0,'NAOL GARAGE','#1b4f9c');
building(-22,100,14,22,12,0xe0d8c0,'NAOL SHOPPING','#0a7d3b');
building(22,130,16,20,8,0xe8b04a,'MANA BARUMSAA','#7a3b9c');
for(let i=0;i<46;i++){
  const z=-250+i*13+rnd(-3,3),left=i%2===0;
  if(Math.abs(z-40)<16||Math.abs(z-70)<16||Math.abs(z-100)<18||Math.abs(z-130)<18)continue;
  building((left?-1:1)*rnd(20,26),z,rnd(9,15),rnd(9,14),rnd(6,38),new THREE.Color().setHSL(rnd(0.05,0.12),0.2,rnd(0.55,0.85)));
}
function tree(x,z){
  const g=new THREE.Group();
  const t=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.38,rnd(3,4.5),6),M(0x5a3b1e));t.position.y=2;g.add(t);
  const c=new THREE.Mesh(new THREE.SphereGeometry(rnd(2.2,3.4),9,6),M(new THREE.Color().setHSL(rnd(0.24,0.33),0.5,rnd(0.2,0.3))));c.scale.set(1.4,0.55,1.4);c.position.y=4.6;c.castShadow=true;g.add(c);
  g.position.set(x,0,z);scene.add(g);
}
for(let i=0;i<170;i++){const s=Math.random()<0.5?-1:1;tree(s*rnd(17,80),rnd(-600,600))}
const lampM=M(0x444444);
for(let z=-300;z<=500;z+=40)[-1,1].forEach(s=>{
  const p=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.09,7,6),lampM);p.position.set(s*8.4,3.5,z);scene.add(p);
  const a=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.08,0.12),lampM);a.position.set(s*7.8,7,z);scene.add(a);
});
for(let i=0;i<22;i++){
  const m=new THREE.Mesh(new THREE.SphereGeometry(1,14,8),M(new THREE.Color().setHSL(0.35,0.18,rnd(0.42,0.52))));
  m.scale.set(rnd(140,320),rnd(40,100),rnd(120,200));
  const s=i%2?1:-1;m.position.set(s*rnd(550,950),0,-650+(i/22)*1350);scene.add(m);
}
const people=[];
function person(x,z){
  const g=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.9,0.3),M(Math.random()*0xffffff));body.position.y=1.1;g.add(body);
  const legs=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.7,0.25),M(0x223344));legs.position.y=0.35;g.add(legs);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,8),M(0x6b4226));head.position.y=1.8;g.add(head);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,2.4,4),M(0x333333));pole.position.set(0.35,1.5,0);g.add(pole);
  ['#d62828','#ffffff','#2a9d3f'].forEach((c,i)=>{const f=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.2),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));f.position.set(0.8,2.55-i*0.2,0);g.add(f)});
  g.position.set(x,0.15,z);g.userData.dir=Math.random()<0.5?1:-1;scene.add(g);people.push(g);
}
for(let i=0;i<24;i++)person((Math.random()<0.5?-1:1)*9.5,rnd(-100,250));

// ================= KUTAA 3: Konkolaata "Naol Lambo" (bifa Lamborghini) =================
const car=new THREE.Group();scene.add(car);
const paint=new THREE.MeshStandardMaterial({color:0xffb400,metalness:0.65,roughness:0.28,envMapIntensity:1.3});
const darkM=new THREE.MeshStandardMaterial({color:0x07080a,metalness:0.3,roughness:0.55});
const glassM=new THREE.MeshStandardMaterial({color:0x0b1620,metalness:0.95,roughness:0.04,envMapIntensity:1.6});
const chromeM=new THREE.MeshStandardMaterial({color:0xd0d4da,metalness:1,roughness:0.2});
const flatM=new THREE.MeshStandardMaterial({color:0x0c0c0e,roughness:0.9,side:THREE.DoubleSide});
const leather=new THREE.MeshStandardMaterial({color:0x151515,roughness:0.8});
function sh(pts,holes){const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));
  if(holes)holes.forEach(h=>{const q=new THREE.Path();h.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));s.holes.push(q)});return s}
function add(parent,geo,mat,x,y,z,cast){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(cast)m.castShadow=true;parent.add(m);return m}

const prof=sh([[-2.3,0.28],[2.3,0.28],[2.35,0.5],[2.0,0.62],[0.8,0.72],[-0.1,1.1],[-1.0,1.1],[-2.0,0.9],[-2.3,0.8]]);
const bg=new THREE.ExtrudeGeometry(prof,{depth:1.7,bevelEnabled:true,bevelThickness:0.1,bevelSize:0.1,bevelSegments:4,curveSegments:1});
bg.translate(0,0,-0.85);
const body=new THREE.Mesh(bg,paint);body.rotation.y=-Math.PI/2;body.castShadow=true;car.add(body);
add(car,new THREE.PlaneGeometry(1.5,0.97),glassM,0,1.025,0.393).rotation.x=-1.19;
add(car,new THREE.PlaneGeometry(1.4,1.02),glassM,0,1.098,-1.52).rotation.x=-1.77;
[-1,1].forEach(s=>{
  const hl=add(car,new THREE.BoxGeometry(0.5,0.05,0.12),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffee,emissiveIntensity:2}),s*0.62,0.6,2.27);hl.rotation.x=0.35;
  add(car,new THREE.CylinderGeometry(0.07,0.07,0.2,12),chromeM,s*0.4,0.38,-2.45).rotation.x=Math.PI/2;
  add(car,new THREE.BoxGeometry(0.18,0.1,0.12),paint,s*1.05,0.9,0.5,true);
  add(car,new THREE.BoxGeometry(0.05,0.28,0.2),darkM,s*0.7,0.92,-2.15);
});
add(car,new THREE.BoxGeometry(1.4,0.06,0.05),new THREE.MeshStandardMaterial({color:0xff1111,emissive:0xff0000,emissiveIntensity:2}),0,0.7,-2.42);
add(car,new THREE.BoxGeometry(1.0,0.14,0.1),darkM,0,0.36,2.43);
add(car,new THREE.BoxGeometry(1.9,0.04,0.3),darkM,0,0.2,2.3);
add(car,new THREE.BoxGeometry(1.5,0.1,0.1),darkM,0,0.3,-2.4);
add(car,new THREE.BoxGeometry(1.8,0.05,0.38),paint,0,1.04,-2.2,true);
const logoTex=tex(128,128,(g,w,h)=>{g.fillStyle='#111';g.fillRect(0,0,w,h);g.strokeStyle='#ffc400';g.lineWidth=7;g.beginPath();g.arc(64,64,54,0,7);g.stroke();g.fillStyle='#ffc400';g.font='bold 54px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('NL',64,67)});
add(car,new THREE.PlaneGeometry(0.62,0.62),new THREE.MeshBasicMaterial({map:logoTex}),0,0.775,1.5).rotation.x=-Math.PI/2+0.083;
const nameTex=tex(256,64,(g,w,h)=>{g.fillStyle='#111';g.fillRect(0,0,w,h);g.fillStyle='#ffc400';g.font='bold 38px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('NAOL LAMBO',w/2,h/2+2)});
const plate=add(car,new THREE.PlaneGeometry(0.9,0.22),new THREE.MeshBasicMaterial({map:nameTex}),0,0.5,-2.43);plate.rotation.y=Math.PI;

const wheels=[],frontWheels=[];
[[-1,1.45],[1,1.45],[-1,-1.45],[1,-1.45]].forEach(([s,z])=>{
  const g=new THREE.Group(),inner=new THREE.Group();g.add(inner);
  const tire=new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.28,28),new THREE.MeshStandardMaterial({color:0x111111,roughness:0.9}));tire.rotation.z=Math.PI/2;tire.castShadow=true;inner.add(tire);
  const face=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.26,0.3,24),darkM);face.rotation.z=Math.PI/2;inner.add(face);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.03,8,28),chromeM);ring.rotation.y=Math.PI/2;ring.position.x=s*0.15;inner.add(ring);
  for(let i=0;i<5;i++){const sp=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.5,0.05),chromeM);sp.position.x=s*0.155;sp.rotation.x=i*Math.PI/5;inner.add(sp)}
  add(inner,new THREE.BoxGeometry(0.05,0.12,0.1),new THREE.MeshStandardMaterial({color:0xcc1111}),s*0.1,0.2,0.1);
  g.position.set(s*0.88,0.38,z);car.add(g);wheels.push(inner);if(z>0)frontWheels.push(g);
  const arch=new THREE.Mesh(new THREE.CircleGeometry(0.47,24),flatM);arch.rotation.y=Math.PI/2;arch.position.set(s*0.956,0.38,z);car.add(arch);
});

const FD=[[0,0.3],[0.9,0.3],[0.9,1.1],[0.85,1.1],[0,0.74]],FG=[[0.2,0.76],[0.8,0.76],[0.82,1.06],[0.2,0.81]];
const RD=[[0,0.3],[0.95,0.3],[0.95,1.076],[0.83,1.1],[0,1.1]],RG=[[0.1,0.76],[0.85,0.76],[0.85,1.05],[0.1,1.05]];
const doors=[];
[[1,0.75,FD,FG],[1,-0.17,RD,RG],[-1,0.75,FD,FG],[-1,-0.17,RD,RG]].forEach(([s,hz,D,G])=>{
  const piv=new THREE.Group();piv.position.set(s*0.97,0,hz);piv.scale.x=s;
  const dg=new THREE.ExtrudeGeometry(sh(D,[G]),{depth:0.04,bevelEnabled:false});dg.translate(0,0,-0.02);
  const dm=new THREE.Mesh(dg,paint);dm.rotation.y=Math.PI/2;dm.castShadow=true;piv.add(dm);
  const gm=new THREE.Mesh(new THREE.ShapeGeometry(sh(G)),glassM);gm.rotation.y=Math.PI/2;gm.position.x=0.025;piv.add(gm);
  add(piv,new THREE.BoxGeometry(0.03,0.04,0.16),chromeM,0.03,0.78,-0.78);
  piv.userData={s,open:0};car.add(piv);doors.push(piv);
});
let doorsOpen=false;

const interior=new THREE.Group();car.add(interior);
add(interior,new THREE.PlaneGeometry(1.7,3.8),flatM,0,0.33,-0.2).rotation.x=-Math.PI/2;
add(interior,new THREE.PlaneGeometry(1.7,0.95),flatM,0,1.13,-0.52).rotation.x=-Math.PI/2;
add(interior,new THREE.BoxGeometry(1.6,0.12,0.4),leather,0,0.8,0.5);
[0.4,-0.4].forEach(x=>{
  add(interior,new THREE.BoxGeometry(0.46,0.12,0.5),leather,x,0.5,-0.45);
  add(interior,new THREE.BoxGeometry(0.46,0.6,0.12),leather,x,0.8,-0.72).rotation.x=-0.25;
  add(interior,new THREE.BoxGeometry(0.2,0.14,0.1),leather,x,1.1,-0.78);
});
add(interior,new THREE.BoxGeometry(1.6,0.12,0.5),leather,0,0.5,-1.45);
add(interior,new THREE.BoxGeometry(1.6,0.5,0.1),leather,0,0.78,-1.72).rotation.x=-0.2;
add(interior,new THREE.BoxGeometry(0.2,0.18,0.9),leather,0,0.45,-0.2);
const wheelG=new THREE.Group();wheelG.position.set(0.4,0.9,0.2);wheelG.rotation.x=0.4;interior.add(wheelG);
const wheelSpin=new THREE.Group();wheelG.add(wheelSpin);
add(wheelSpin,new THREE.TorusGeometry(0.15,0.022,10,28),leather,0,0,0);
add(wheelSpin,new THREE.BoxGeometry(0.3,0.03,0.02),leather,0,0,0);
add(wheelSpin,new THREE.BoxGeometry(0.03,0.15,0.02),leather,0,-0.075,0);
add(wheelSpin,new THREE.BoxGeometry(0.025,0.04,0.03),new THREE.MeshStandardMaterial({color:0xffc400,emissive:0x664400}),0,0.15,0);
add(wheelSpin,new THREE.CylinderGeometry(0.045,0.045,0.03,16),darkM,0,0,0).rotation.x=Math.PI/2;
const dashCv=document.createElement('canvas');dashCv.width=300;dashCv.height=100;
const dctx=dashCv.getContext('2d'),dashTex=new THREE.CanvasTexture(dashCv);
const cluster=add(interior,new THREE.PlaneGeometry(0.3,0.1),new THREE.MeshBasicMaterial({map:dashTex}),0.4,0.915,0.5);
cluster.rotation.y=Math.PI;cluster.rotation.x=0.3;
function drawDash(sp,g,r){
  dctx.fillStyle='#05080c';dctx.fillRect(0,0,300,100);
  dctx.fillStyle='#222';dctx.fillRect(10,8,280,10);dctx.fillStyle=r>6800?'#f33':'#0cf';dctx.fillRect(10,8,280*Math.min(1,r/8000),10);
  dctx.fillStyle='#fff';dctx.font='bold 52px Arial';dctx.textAlign='left';dctx.fillText(Math.round(sp*3.6),14,76);
  dctx.font='16px Arial';dctx.fillText('km/h',112,76);dctx.fillStyle='#fc0';dctx.font='bold 44px Arial';dctx.textAlign='right';dctx.fillText(g,286,76);
  dashTex.needsUpdate=true;
}
const C={x:3.5,z:0,rot:0,speed:0};
car.position.set(C.x,0,C.z);

// ================= KUTAA 4: Namicha taphataa (uffata adii + jeans) =================
const player=new THREE.Group();scene.add(player);
const skin=M(0x6b4226);
const torso=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.7,0.3),M(0xffffff));torso.position.y=1.3;torso.castShadow=true;player.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(0.2,12,12),skin);head.position.y=1.85;player.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(0.21,12,8,0,Math.PI*2,0,Math.PI/2),M(0x111111));hair.position.y=1.9;player.add(hair);
const chain=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.015,6,12),M(0xffd700));chain.position.set(0,1.55,0.16);chain.rotation.x=1.2;player.add(chain);
const mk=(x,col)=>{const g=new THREE.Group();const m=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.8,0.22),M(col));m.position.y=-0.4;m.castShadow=true;g.add(m);g.position.set(x,0.85,0);player.add(g);return g};
const legL=mk(-0.14,0x2f5d9e),legR=mk(0.14,0x2f5d9e);
const armL=mk(-0.38,0x6b4226),armR=mk(0.38,0x6b4226);armL.position.y=1.6;armR.position.y=1.6;
const P={x:-0.5,z:-7,rot:0,walk:0};
let inCar=false;

// ================= KUTAA 5: Sagalee motoora (V8/V10 fakkaatu) + qilleensa + taayirii =================
let actx,oscs,lp,master,noiseG,windF;
let rpm=900,egear=1,shiftT=0;
function startAudio(){
  if(actx){if(actx.state==='suspended')actx.resume();return}
  actx=new (window.AudioContext||window.webkitAudioContext)();
  master=actx.createGain();master.gain.value=0;
  const dist=actx.createWaveShaper(),cv=new Float32Array(1024);
  for(let i=0;i<1024;i++){cv[i]=Math.tanh((i/512-1)*3)}dist.curve=cv;
  lp=actx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.Q.value=2;
  const mix=actx.createGain();
  oscs=[['sawtooth',1,0.5],['sawtooth',2.003,0.3],['square',0.5,0.4],['sawtooth',3.01,0.12]].map(a=>{
    const o=actx.createOscillator();o.type=a[0];const g=actx.createGain();g.gain.value=a[2];o.connect(g);g.connect(mix);o.start();return {o:o,m:a[1]}});
  mix.connect(dist);dist.connect(lp);lp.connect(master);master.connect(actx.destination);
  const buf=actx.createBuffer(1,actx.sampleRate*2,actx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const ns=actx.createBufferSource();ns.buffer=buf;ns.loop=true;
  windF=actx.createBiquadFilter();windF.type='bandpass';windF.frequency.value=500;windF.Q.value=0.6;
  noiseG=actx.createGain();noiseG.gain.value=0;ns.connect(windF);windF.connect(noiseG);noiseG.connect(actx.destination);ns.start();
}
function engineSound(speed,thr,on,dt){
  const sp=Math.abs(speed);
  const g=Math.min(6,Math.floor(sp/12)+1);
  if(g!==egear){egear=g;shiftT=0.18}
  if(shiftT>0)shiftT-=dt;
  const into=(sp-(g-1)*12)/12;
  let target=on?1000+into*6500*(0.6+0.4*thr)+thr*500:900;
  if(shiftT>0)target-=1500;
  rpm+=(target-rpm)*Math.min(1,dt*6);
  if(!actx)return;
  const t=actx.currentTime,f=rpm/60*4;
  oscs.forEach(x=>x.o.frequency.setTargetAtTime(f*x.m,t,0.04));
  lp.frequency.setTargetAtTime(500+rpm*0.55,t,0.05);
  master.gain.setTargetAtTime(on?(0.08+thr*0.1)*(shiftT>0?0.4:1):0,t,0.08);
  noiseG.gain.setTargetAtTime(on?Math.min(0.22,sp/70*0.22):0,t,0.1);
  windF.frequency.setTargetAtTime(300+sp*10,t,0.1);
}

// ================= KUTAA 6: Of-too'annoo (steering wheel, pedals, keyboard) =================
const $=id=>document.getElementById(id);
const K={};let gear='N',camMode=0,steerVal=0;
let wAng=0,wTouch=false,wLast=0;
function setGear(g){
  if(!inCar||Math.abs(C.speed)<2){gear=g;['R','N','D'].forEach(x=>$('g'+x).classList.toggle('on',x===g))}
}
function toggleDoors(){doorsOpen=!doorsOpen}
function enterExit(){
  startAudio();
  if(!inCar){
    if(Math.hypot(P.x-C.x,P.z-C.z)<5){
      inCar=true;player.visible=false;doorsOpen=true;setTimeout(()=>{doorsOpen=false},900);
      document.body.classList.add('car');$('en').textContent='BAHI';setGear('D');
    }
  }else if(Math.abs(C.speed)<3){
    inCar=false;doorsOpen=true;setTimeout(()=>{doorsOpen=false},1200);
    P.x=C.x+Math.cos(C.rot)*2.4;P.z=C.z-Math.sin(C.rot)*2.4;P.rot=C.rot;
    player.visible=true;C.speed=0;wAng=0;
    document.body.classList.remove('car');$('en').textContent='GALI';
  }
}
addEventListener('keydown',e=>{K[e.code]=true;startAudio();
  if(e.code==='KeyE')enterExit();if(e.code==='KeyF')toggleDoors();if(e.code==='KeyC')camMode=(camMode+1)%4;
  if(e.code==='Digit1')setGear('R');if(e.code==='Digit2')setGear('N');if(e.code==='Digit3')setGear('D')});
addEventListener('keyup',e=>K[e.code]=false);
addEventListener('pointerdown',startAudio);
function hold(id,code){const el=$(id);
  const on=e=>{e.preventDefault();K[code]=true;startAudio()},off=e=>{e.preventDefault();K[code]=false};
  el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointerleave',off);el.addEventListener('pointercancel',off)}
hold('gas','ArrowUp');hold('brk','ArrowDown');hold('lt','ArrowLeft');hold('rt','ArrowRight');
const tap=(id,fn)=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();startAudio();fn()});
tap('gR',()=>setGear('R'));tap('gN',()=>setGear('N'));tap('gD',()=>setGear('D'));
tap('dr',toggleDoors);tap('en',enterExit);tap('cam',()=>{camMode=(camMode+1)%4});
const wheelEl=$('wheel');
const wA=e=>{const r=wheelEl.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))};
wheelEl.addEventListener('pointerdown',e=>{e.preventDefault();try{wheelEl.setPointerCapture(e.pointerId)}catch(x){}wTouch=true;wLast=wA(e);startAudio()});
wheelEl.addEventListener('pointermove',e=>{
  if(!wTouch)return;const a=wA(e);let d=a-wLast;
  while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  wAng=Math.max(-2.4,Math.min(2.4,wAng+d));wLast=a;
});
['pointerup','pointercancel'].forEach(t=>wheelEl.addEventListener(t,()=>{wTouch=false}));
setGear('N');

// ================= KUTAA 7: Loop ijoo, fiigicha, kaameraa (kaameraa 4) =================
const clock=new THREE.Clock();
let camYaw=0,frame=0,thr=0;
const _t=new THREE.Vector3(),_l=new THREE.Vector3();
function lerpAng(a,b,t){const d=((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return a+d*Math.min(1,t)}
function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),0.05);frame++;
  const up=K.ArrowUp||K.KeyW,dn=K.ArrowDown||K.KeyS,lf=K.ArrowLeft||K.KeyA,rt=K.ArrowRight||K.KeyD;
  thr+=((up?1:0)-thr)*Math.min(1,dt*5);

  if(inCar){
    if(!wTouch){
      const kb=(lf?1:0)-(rt?1:0);
      if(kb)wAng+=(-kb*1.7-wAng)*Math.min(1,dt*3);
      else wAng*=Math.exp(-dt*(2.5+Math.abs(C.speed)*0.12));
    }
    wAng=Math.max(-2.4,Math.min(2.4,wAng));steerVal=-wAng/2.4;
    if(up&&gear==='D'){C.speed+=(C.speed<0?20:10.5*Math.max(0,1-C.speed/78))*dt}
    if(up&&gear==='R'){C.speed-=(C.speed>0?20:5*Math.max(0,1-(-C.speed)/10))*dt}
    if(dn){const b=30*dt;C.speed=Math.abs(C.speed)<b?0:C.speed-Math.sign(C.speed)*b}
    const drag=(0.5+0.0022*C.speed*C.speed+(!up&&gear!=='N'?0.8:0))*dt;
    C.speed=Math.abs(C.speed)<drag?0:C.speed-Math.sign(C.speed)*drag;
    const sp=Math.abs(C.speed);
    const delta=steerVal*0.55/(1+sp*0.045);
    C.rot+=C.speed*Math.tan(delta)/2.9*dt;
    const ox=C.x,oz=C.z;
    C.x+=Math.sin(C.rot)*C.speed*dt;C.z+=Math.cos(C.rot)*C.speed*dt;
    for(const b of colliders){if(Math.abs(C.x-b.x)<b.hw+1.3&&Math.abs(C.z-b.z)<b.hd+2.5){C.x=ox;C.z=oz;C.speed*=-0.3;break}}
    wheels.forEach(w=>w.rotation.x+=C.speed*dt/0.38);
    frontWheels.forEach(g=>g.rotation.y=steerVal*0.45);
    wheelSpin.rotation.z=wAng;
    $('wsvg').style.transform='rotate('+wAng+'rad)';
    $('spd').textContent=Math.round(sp*3.6);
    $('gear').textContent=gear==='D'?'D'+egear:gear;
    engineSound(C.speed,thr,true,dt);
    if(frame%3===0&&camMode>=2)drawDash(sp,gear==='D'?'D'+egear:gear,rpm);
  }else{
    P.rot+=((lf?1:0)-(rt?1:0))*dt*2.2;
    const v=(up?1:0)-(dn?1:0);
    P.x+=Math.sin(P.rot)*v*4.5*dt;P.z+=Math.cos(P.rot)*v*4.5*dt;P.walk+=Math.abs(v)*dt*8;
    legL.rotation.x=Math.sin(P.walk)*0.6*Math.abs(v);legR.rotation.x=-legL.rotation.x;
    armL.rotation.x=-legL.rotation.x;armR.rotation.x=legL.rotation.x;
    player.position.set(P.x,0.1,P.z);player.rotation.y=P.rot;
    C.speed*=1-2*dt;engineSound(0,0,false,dt);
    $('spd').textContent='0';$('gear').textContent=gear;
    const dx=C.x-P.x,dz=C.z-P.z,dist=Math.hypot(dx,dz);
    $('arrow').style.display='block';
    if(dist>5){$('aico').style.display='block';$('aico').style.transform='rotate('+(-(Math.atan2(dx,dz)-P.rot))+'rad)';$('atxt').textContent='Konkolaata: '+Math.round(dist)+' m'}
    else{$('aico').style.display='none';$('atxt').textContent='GALI tuqi'}
    $('en').classList.toggle('pulse',dist<=5);
  }
  if(inCar)$('arrow').style.display='none';
  car.position.set(C.x,0,C.z);car.rotation.y=C.rot;
  let anyOpen=false;
  doors.forEach(d=>{const t=doorsOpen?1:0;d.userData.open+=(t-d.userData.open)*Math.min(1,dt*6);d.rotation.y=-d.userData.s*d.userData.open;if(d.userData.open>0.03)anyOpen=true});
  interior.visible=(inCar&&camMode>=2)||anyOpen;
  people.forEach(p=>{p.position.z+=p.userData.dir*dt*1.2;p.rotation.y=p.userData.dir>0?0:Math.PI;if(p.position.z>260||p.position.z<-110)p.userData.dir*=-1});

  const sp2=Math.abs(C.speed);
  if(inCar&&camMode>=2){
    const lx=0.4*(camMode===3?1:0),ly=0.98,lz=camMode===3?-0.35:1.2;
    car.updateMatrixWorld(true);
    _t.set(lx,ly,lz);car.localToWorld(_t);camera.position.copy(_t);
    _l.set(steerVal*(camMode===3?1.5:0.8),ly-(camMode===3?0.5:0.3),lz+10);car.localToWorld(_l);camera.lookAt(_l);
    const f=(camMode===3?62:70)+sp2*0.12;camera.fov+=(f-camera.fov)*Math.min(1,dt*4);
  }else{
    const tr=inCar?C.rot:P.rot,tx=inCar?C.x:P.x,tz=inCar?C.z:P.z;
    camYaw=lerpAng(camYaw,tr,dt*(inCar?3.5:6));
    const d=inCar?(camMode===1?13:7.5):4.2,h=inCar?(camMode===1?4.6:2.5):2.2;
    camera.position.set(tx-Math.sin(camYaw)*d,h,tz-Math.cos(camYaw)*d);
    camera.lookAt(tx+Math.sin(tr)*(inCar?3:0),inCar?1.0:1.4,tz+Math.cos(tr)*(inCar?3:0));
    const f=62+(inCar?sp2*0.22:0);camera.fov+=(f-camera.fov)*Math.min(1,dt*4);
  }
  camera.updateProjectionMatrix();
  dome.position.copy(camera.position);
  const fx=inCar?C.x:P.x,fz=inCar?C.z:P.z;
  sun.position.set(fx-60,90,fz+40);sun.target.position.set(fx,0,fz);
  renderer.render(scene,camera);
}
camYaw=P.rot;
camera.position.set(P.x,2.2,P.z-4.2);
loop();
}
</script>
</body>
</html>
