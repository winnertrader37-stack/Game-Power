// ================= KUTAA 3: Konkolaata "Naol Lambo" =================
const car=new THREE.Group();scene.add(car);
const bodyMat=M(0xffc400);
const lower=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.55,4.7),bodyMat);lower.position.y=0.6;car.add(lower);
const hood=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.18,1.6),bodyMat);hood.position.set(0,0.95,1.5);car.add(hood);
const cab=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.55,2.1),new THREE.MeshLambertMaterial({color:0x111a22}));cab.position.set(0,1.2,-0.3);car.add(cab);
const roof=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.08,1.6),bodyMat);roof.position.set(0,1.5,-0.3);car.add(roof);
const spoiler=new THREE.Mesh(new THREE.BoxGeometry(2,0.07,0.5),M(0x111111));spoiler.position.set(0,1.25,-2.3);car.add(spoiler);
// Logo Naol Lambo (gubbaa hood irra)
const logoTex=tex(128,128,(g,w,h)=>{g.fillStyle='#111';g.fillRect(0,0,w,h);g.strokeStyle='#ffc400';g.lineWidth=6;g.beginPath();g.arc(64,64,54,0,7);g.stroke();g.fillStyle='#ffc400';g.font='bold 54px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('NL',64,66)});
const logo=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.7),new THREE.MeshBasicMaterial({map:logoTex}));
logo.rotation.x=-Math.PI/2;logo.position.set(0,1.05,1.6);car.add(logo);
const nameTex=tex(256,64,(g,w,h)=>{g.fillStyle='#111';g.fillRect(0,0,w,h);g.fillStyle='#ffc400';g.font='bold 38px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('NAOL LAMBO',w/2,h/2)});
const plate=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.22),new THREE.MeshBasicMaterial({map:nameTex}));plate.position.set(0,0.5,2.36);car.add(plate);
[-0.7,0.7].forEach(x=>{const l=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.1,0.05),new THREE.MeshBasicMaterial({color:0xffffee}));l.position.set(x,0.8,2.36);car.add(l);
  const r=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.1,0.05),new THREE.MeshBasicMaterial({color:0xff1111}));r.position.set(x,0.8,-2.36);car.add(r)});
// Ijaarsa ruuxaa (wheels)
const wheels=[];
[[-1.02,1.5],[1.02,1.5],[-1.02,-1.5],[1.02,-1.5]].forEach(p=>{
  const g=new THREE.Group();
  const m=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.3,16),M(0x151515));m.rotation.z=Math.PI/2;g.add(m);
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,0.32,8),M(0xcccccc));rim.rotation.z=Math.PI/2;g.add(rim);
  g.position.set(p[0],0.42,p[1]);car.add(g);wheels.push(g);
});
// Balbala 4 (hundi isaa banamee cufama)
const doors=[];
[[-1,0.55],[-1,-0.7],[1,0.55],[1,-0.7]].forEach(d=>{
  const pivot=new THREE.Group();pivot.position.set(d[0]*1.01,0.9,d[1]);
  const m=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.8,1.2),bodyMat);m.position.z=-0.6;pivot.add(m);
  const gl=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.35,0.9),new THREE.MeshLambertMaterial({color:0x223344}));gl.position.set(0,0.3,-0.6);pivot.add(gl);
  pivot.userData.side=d[0];pivot.userData.open=0;car.add(pivot);doors.push(pivot);
});
let doorsOpen=false;
const C={x:4,z:0,rot:0,speed:0};
car.position.set(C.x,0,C.z);
