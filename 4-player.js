// ================= KUTAA 4: Namicha taphataa (uffata adii + jeans) =================
const player=new THREE.Group();scene.add(player);
const skin=M(0x6b4226);
const torso=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.7,0.3),M(0xffffff));torso.position.y=1.3;player.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(0.2,12,12),skin);head.position.y=1.85;player.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(0.21,12,8,0,Math.PI*2,0,Math.PI/2),M(0x111111));hair.position.y=1.9;player.add(hair);
const chain=new THREE.Mesh(new THREE.TorusGeometry(0.12,0.015,6,12),M(0xffd700));chain.position.set(0,1.55,0.16);chain.rotation.x=1.2;player.add(chain);
const mk=(x,col)=>{const g=new THREE.Group();const m=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.8,0.22),M(col));m.position.y=-0.4;g.add(m);g.position.set(x,0.85,0);player.add(g);return g};
const legL=mk(-0.14,0x2f5d9e),legR=mk(0.14,0x2f5d9e);
const armL=mk(-0.38,0x6b4226),armR=mk(0.38,0x6b4226);armL.position.y=1.6;armR.position.y=1.6;
const P={x:-1,z:-6,rot:0,walk:0};
let inCar=false;
