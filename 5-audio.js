// ================= KUTAA 5: Sagalee motoora (Ferrari/Lambo fakkaatu) =================
let actx,o1,o2,og;
function startAudio(){
  if(actx)return;
  actx=new (window.AudioContext||window.webkitAudioContext)();
  o1=actx.createOscillator();o1.type='sawtooth';
  o2=actx.createOscillator();o2.type='square';
  og=actx.createGain();og.gain.value=0;
  const f=actx.createBiquadFilter();f.type='lowpass';f.frequency.value=1800;
  o1.connect(f);o2.connect(f);f.connect(og);og.connect(actx.destination);
  o1.start();o2.start();
}
function engineSound(speed,gas){
  if(!actx)return;
  const rpm=Math.min(1,(Math.abs(speed)%20)/20+Math.abs(speed)/120)+(gas?0.15:0);
  const f=70+rpm*380+Math.abs(speed)*1.5;
  o1.frequency.setTargetAtTime(f,actx.currentTime,0.05);
  o2.frequency.setTargetAtTime(f*2.01,actx.currentTime,0.05);
  og.gain.setTargetAtTime(inCar?(0.05+(gas?0.06:0)):0,actx.currentTime,0.1);
}
