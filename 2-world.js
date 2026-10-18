// ================= KUTAA 2: Daandii asphalt, dachee, mana, mukkeen =================
const roadTex=tex(256,256,(g,w,h)=>{
  g.fillStyle='#2b2b2e';g.fillRect(0,0,w,h);
  for(let i=0;i<2500;i++){g.fillStyle='rgba('+(i%2?255:0)+','+(i%2?255:0)+','+(i%2?255:0)+',0.05)';g.fillRect(Math.random()*w,Math.random()*h,2,2)}
  g.fillStyle='#e8c200';g.fillRect(w/2-3,10,6,h/2-20);
  g.fillStyle='#fff';g.fillRect(6,0,5,h);g.fillRect(w-11,0,5,h);
});
roadTex.repeat.set(1,140);
const road=new THREE.Mesh(new THREE.PlaneGeometry(16,1400),new THREE.MeshLambertMaterial({map:roadTex}));
road.rotation.x=-Math.PI/2;scene.add(road);
const groundTex=tex(128,128,(g,w,h)=>{g.fillStyle='#6f8f3d';g.fillRect(0,0,w,h);for(let i=0;i<900;i++){g.fillStyle=['#5d7d31','#7e9a4a','#8a7a4a'][i%3];g.fillRect(Math.random()*w,Math.random()*h,3,3)}});
groundTex.repeat.set(300,300);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),new THREE.MeshLambertMaterial({map:groundTex}));
ground.rotation.x=-Math.PI/2;ground.position.y=-0.05;scene.add(ground);
[-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.BoxGeometry(3,0.2,1400),M(0x9a9a9a));w.position.set(s*9.5,0.05,0);scene.add(w)});

const colliders=[];
const winTex=tex(64,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#445';for(let y=8;y<h;y+=24)for(let x=6;x<w;x+=20)g.fillRect(x,y,12,14)});
function building(x,z,w,d,h,col,signText,signCol){
  const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:col,map:winTex}));
  b.position.set(x,h/2,z);scene.add(b);colliders.push({x,z,hw:w/2,hd:d/2});
  if(signText){
    const st=tex(512,128,(g,W,H)=>{g.fillStyle=signCol;g.fillRect(0,0,W,H);g.fillStyle='#fff';g.font='bold 64px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(signText,W/2,H/2)});
    const s=new THREE.Mesh(new THREE.PlaneGeometry(w*0.9,w*0.9/4),new THREE.MeshBasicMaterial({map:st}));
    const side=x<0?1:-1;
    s.position.set(x+side*(w/2+0.1),Math.min(h-2,7),z);s.rotation.y=side*Math.PI/2;scene.add(s);
  }
}
// Mana addaa (maqaa Naol)
building(-22,40,14,18,16,0xd9c9a8,'NAOL HOTEL','#a31621');
building(22,70,14,18,9,0xb0b0b0,'NAOL GARAGE','#1b4f9c');
building(-22,100,14,22,12,0xe0d8c0,'NAOL SHOPPING','#0a7d3b');
building(22,130,16,20,8,0xe8b04a,'MANA BARUMSAA','#7a3b9c');
// Manoota Finfinnee (Addis Ababa) fakkaatan
for(let i=0;i<46;i++){
  const z=-250+i*13+rnd(-3,3);
  const left=i%2===0;
  if(Math.abs(z-40)<16||Math.abs(z-70)<16||Math.abs(z-100)<18||Math.abs(z-130)<18)continue;
  const h=rnd(6,38);
  building((left?-1:1)*rnd(20,26),z,rnd(9,15),rnd(9,14),h,new THREE.Color().setHSL(rnd(0.05,0.12),0.2,rnd(0.55,0.85)));
}
// Mukkeen (gara baadiyaa/biyya Itoophiyaa)
function tree(x,z){
  const g=new THREE.Group();
  const t=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.35,3.5,6),M(0x5a3b1e));t.position.y=1.75;g.add(t);
  const c=new THREE.Mesh(new THREE.SphereGeometry(rnd(1.8,2.8),8,6),M(0x2f7a2f));c.scale.y=0.7;c.position.y=4.2;g.add(c);
  g.position.set(x,0,z);scene.add(g);
}
for(let i=0;i<160;i++){const s=Math.random()<0.5?-1:1;tree(s*rnd(12,70),rnd(-600,600))}
// Gaarreen fagoo
for(let i=0;i<14;i++){
  const m=new THREE.Mesh(new THREE.ConeGeometry(rnd(60,120),rnd(60,130),6),M(0x5f6f5a));
  m.position.set(rnd(-500,500),30,i%2?-650:650);scene.add(m);
}
// Namoota ally Oromiyaa qabatan (cuquliisaa: diimaa, adii, magariisa)
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
