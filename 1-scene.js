// ================= KUTAA 1: Scene, ifa, kaameraa =================
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9ccbff);
scene.fog=new THREE.Fog(0x9ccbff,60,420);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,0.1,1200);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
scene.add(new THREE.HemisphereLight(0xffffff,0x6b5a3a,0.8));
const sun=new THREE.DirectionalLight(0xffe2b0,0.9);sun.position.set(-80,120,60);scene.add(sun);

function tex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const M=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
const rnd=(a,b)=>a+Math.random()*(b-a);
