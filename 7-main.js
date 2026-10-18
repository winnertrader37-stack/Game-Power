// ================= KUTAA 7: Loop ijoo taphaa =================
const clock=new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),0.05);
  const up=K.ArrowUp||K.KeyW,dn=K.ArrowDown||K.KeyS,lf=K.ArrowLeft||K.KeyA,rt=K.ArrowRight||K.KeyD;
  const steer=(lf?1:0)-(rt?1:0);

  if(inCar){
    // fiigicha
    const max=gear==='R'?12:70;
    if(up){ if(gear==='D')C.speed+=16*dt; else if(gear==='R')C.speed-=8*dt }
    if(dn){ C.speed-=Math.sign(C.speed)*Math.min(Math.abs(C.speed),28*dt) }
    if(!up&&!dn)C.speed*=1-0.4*dt;
    if(gear==='N'&&!dn)C.speed*=1-0.3*dt;
    C.speed=Math.max(-12,Math.min(max,C.speed));
    C.rot+=steer*dt*Math.min(1.6,Math.abs(C.speed)/6)*Math.sign(C.speed||1)*(Math.abs(C.speed)>0.3?1:0);
    const ox=C.x,oz=C.z;
    C.x+=Math.sin(C.rot)*C.speed*dt;C.z+=Math.cos(C.rot)*C.speed*dt;
    for(const b of colliders){if(Math.abs(C.x-b.x)<b.hw+1.4&&Math.abs(C.z-b.z)<b.hd+2.4){C.x=ox;C.z=oz;C.speed*=-0.3;break}}
    wheels.forEach(w=>w.rotation.x+=C.speed*dt/0.42);
    document.getElementById('spd').textContent=Math.round(Math.abs(C.speed)*3.6);
    engineSound(C.speed,up);
  }else{
    // deemuu
    P.rot+=steer*dt*2.2;
    const v=(up?1:0)-(dn?1:0);
    P.x+=Math.sin(P.rot)*v*4.5*dt;P.z+=Math.cos(P.rot)*v*4.5*dt;
    P.walk+=Math.abs(v)*dt*8;
    legL.rotation.x=Math.sin(P.walk)*0.6*Math.abs(v);legR.rotation.x=-legL.rotation.x;
    armL.rotation.x=-legL.rotation.x;armR.rotation.x=legL.rotation.x;
    player.position.set(P.x,0.1,P.z);player.rotation.y=P.rot;
    C.speed*=1-2*dt;engineSound(0,false);
    document.getElementById('spd').textContent='0';
  }
  car.position.set(C.x,0,C.z);car.rotation.y=C.rot;
  doors.forEach(d=>{const t=doorsOpen?1:0;d.userData.open+=(t-d.userData.open)*Math.min(1,dt*6);d.rotation.y=-d.userData.side*d.userData.open})
  people.forEach(p=>{p.position.z+=p.userData.dir*dt*1.2;p.rotation.y=p.userData.dir>0?0:Math.PI;if(p.position.z>260||p.position.z<-110)p.userData.dir*=-1});

  // kaameraa
  const tx=inCar?C.x:P.x,tz=inCar?C.z:P.z,tr=inCar?C.rot:P.rot,dist=inCar?9:4.5,hh=inCar?3.6:2.4;
  const cx=tx-Math.sin(tr)*dist,cz=tz-Math.cos(tr)*dist;
  camera.position.x+=(cx-camera.position.x)*Math.min(1,dt*5);
  camera.position.z+=(cz-camera.position.z)*Math.min(1,dt*5);
  camera.position.y+=(hh-camera.position.y)*Math.min(1,dt*3);
  camera.lookAt(tx,1.2,tz);
  renderer.render(scene,camera);
}
camera.position.set(P.x,2.4,P.z-4.5);
loop();
