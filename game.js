import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const mount = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#222746');
scene.fog = new THREE.FogExp2('#222746', 0.027);
const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
camera.position.set(0, 9.5, 12.5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight('#b9c9ed', '#423b56', 2.0));
const moonLight = new THREE.DirectionalLight('#e4d7ff', 2.3);
moonLight.position.set(-5, 10, 4); moonLight.castShadow = true;
moonLight.shadow.mapSize.set(1024, 1024); moonLight.shadow.camera.left = -14; moonLight.shadow.camera.right = 14; moonLight.shadow.camera.top = 16; moonLight.shadow.camera.bottom = -16;
scene.add(moonLight);
const warmLight = new THREE.PointLight('#ffbb7a', 14, 14, 2); warmLight.position.set(0, 3, -8); scene.add(warmLight);
const mat = (color, roughness = .8, emissive = null, intensity = 0) => new THREE.MeshStandardMaterial({ color, roughness, emissive: emissive || color, emissiveIntensity: intensity });
const groundMat = mat('#454a68');
const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), groundMat);
ground.rotation.x = -Math.PI / 2; ground.position.y = -0.09; ground.receiveShadow = true; scene.add(ground);
const pathMat = mat('#77728d');
const path = new THREE.Mesh(new THREE.PlaneGeometry(7.7, 29), pathMat);
path.rotation.x = -Math.PI / 2; path.position.set(0, -0.055, -1); path.receiveShadow = true; scene.add(path);
const stoneMat = mat('#aaa1b5');
for (let i = 0; i < 13; i++) {
  const z = 10 - i * 1.8;
  const stone = new THREE.Mesh(new THREE.BoxGeometry(1.05, .09, 1.05), stoneMat);
  stone.position.set(Math.sin(i * 2.7) * .32, .015, z); stone.rotation.y = Math.sin(i) * .1; stone.receiveShadow = true; stone.castShadow = true; scene.add(stone);
}
const trunkMat = mat('#423b51'), pinkMat = mat('#e0a9c5'), palePink = mat('#f2c5d6'), leavesMat = mat('#5d5775');
function addTree(x, z, scale = 1) {
  const tree = new THREE.Group(); tree.position.set(x, 0, z); tree.scale.setScalar(scale); scene.add(tree);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.13, .22, 2.3, 7), trunkMat); trunk.position.y = 1.12; trunk.rotation.z = x > 0 ? -.16 : .16; trunk.castShadow = true; tree.add(trunk);
  for (let i = 0; i < 4; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(.045, .09, 1.1, 6), trunkMat);
    b.position.set((i % 2 ? 1 : -1) * (.28 + i * .025), 1.75 + i * .12, 0); b.rotation.z = (i % 2 ? -1 : 1) * .65; tree.add(b);
  }
  for (let i = 0; i < 6; i++) {
    const blossom = new THREE.Mesh(new THREE.IcosahedronGeometry(.48 + Math.random() * .28, 1), i % 2 ? pinkMat : palePink);
    blossom.position.set((Math.random() - .5) * 1.75, 2 + Math.random() * 1.45, (Math.random() - .5) * .9);
    blossom.scale.y = .75; blossom.castShadow = true; tree.add(blossom);
  }
  const low = new THREE.Mesh(new THREE.IcosahedronGeometry(.6, 1), leavesMat); low.position.set(x > 0 ? -.55 : .5, .47, .12); low.scale.set(1.2, .7, .8); tree.add(low);
  return tree;
}
for (const [x,z,s] of [[-5,-8,1.3],[5,-7,1.35],[-5.7,-2,1.05],[5.3,-1,1.2],[-5,4,1.1],[5,5,1.2],[-8,-5,1.5],[8,-3,1.4],[-8,2,1.1],[8,3,1.1]]) addTree(x,z,s);

// A small, lantern-lit shrine anchors the far end of the path.
const shrine = new THREE.Group(); shrine.position.set(0, 0, -11.2); scene.add(shrine);
const wood = mat('#49354b'), roofMat = mat('#a76778'), gold = mat('#eac99b', .35, '#f4c985', .4);
function box(parent, size, material, pos, rot = [0,0,0]) { const m = new THREE.Mesh(new THREE.BoxGeometry(...size), material); m.position.set(...pos); m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; }
box(shrine,[2.8,.22,1.55],stoneMat,[0,.15,0]);
for (const x of [-.9,.9]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,2,8),wood); p.position.set(x,1.15,0); p.castShadow=true; shrine.add(p); }
box(shrine,[2.6,.18,.16],wood,[0,2.1,0]);
const roof = new THREE.Mesh(new THREE.ConeGeometry(2.05,.8,4),roofMat); roof.position.set(0,2.55,0); roof.rotation.y=Math.PI/4; roof.scale.set(1.25,1,1); roof.castShadow=true; shrine.add(roof);
const shrineGlow = new THREE.PointLight('#ffc780', 9, 8, 2); shrineGlow.position.set(0,1.25,.4); shrine.add(shrineGlow);
const altar = new THREE.Mesh(new THREE.OctahedronGeometry(.42,1),gold); altar.position.set(0,1.15,.28); shrine.add(altar);

// Low garden lanterns along the path.
const lanternGlowMat = new THREE.MeshStandardMaterial({color:'#ffdcac', emissive:'#ffb45c', emissiveIntensity:2.5, roughness:.3});
for (const [x,z] of [[-2.25,7],[2.25,3],[-2.25,-1],[2.25,-5],[-2.25,-9]]) {
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,.68,8),wood); stand.position.set(x,.34,z); stand.castShadow=true; scene.add(stand);
  const shade = new THREE.Mesh(new THREE.BoxGeometry(.52,.46,.52),lanternGlowMat); shade.position.set(x,.83,z); shade.castShadow=true; scene.add(shade);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(.42,.2,4),roofMat); cap.position.set(x,1.17,z); cap.rotation.y=Math.PI/4; scene.add(cap);
  const glow = new THREE.PointLight('#ffbd79',3.3,4,2); glow.position.set(x,.95,z); scene.add(glow);
}

// Yuna is a fully dressed adult wayfarer in a layered travel robe.
const player = new THREE.Group(); scene.add(player); player.position.set(0,0,9.1);
const robeMat=mat('#637da9'), robeLight=mat('#91a4c4'), sashMat=mat('#d9a876'), skinMat=mat('#f2c6ae'), hairMat=mat('#312b47'), darkMat=mat('#342d42');
const robe = new THREE.Mesh(new THREE.CylinderGeometry(.28,.48,1.05,10),robeMat); robe.position.y=.79; robe.castShadow=true; player.add(robe);
const collar = new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,.18,10),robeLight); collar.position.y=1.36; collar.castShadow=true; player.add(collar);
const sash = new THREE.Mesh(new THREE.TorusGeometry(.34,.055,7,12),sashMat); sash.rotation.x=Math.PI/2; sash.position.y=.8; player.add(sash);
const head = new THREE.Mesh(new THREE.SphereGeometry(.31,16,12),skinMat); head.position.y=1.62; head.scale.set(.85,1.1,.9); head.castShadow=true; player.add(head);
const hair = new THREE.Mesh(new THREE.SphereGeometry(.34,14,10),hairMat); hair.position.set(0,1.82,-.055); hair.scale.set(1.02,.86,1); hair.castShadow=true; player.add(hair);
const hairTail = new THREE.Mesh(new THREE.ConeGeometry(.19,.62,8),hairMat); hairTail.position.set(0,1.32,-.23); hairTail.rotation.x=-.25; player.add(hairTail);
const fringe = new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),hairMat); fringe.position.set(0,1.66,.23); fringe.scale.set(1,.42,.45); player.add(fringe);
for (const x of [-.085,.085]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(.028,8,8),mat('#604b65')); eye.position.set(x,1.64,.255); player.add(eye); }
for (const side of [-1,1]) {
  const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(.13,.5,4,8),robeLight); sleeve.position.set(side*.34,1.03,0); sleeve.rotation.z=side*-.42; sleeve.castShadow=true; player.add(sleeve);
  const hand = new THREE.Mesh(new THREE.SphereGeometry(.095,9,8),skinMat); hand.position.set(side*.46,.75,.03); player.add(hand);
  const shoe = new THREE.Mesh(new THREE.BoxGeometry(.23,.12,.34),darkMat); shoe.position.set(side*.22,.12,.06); shoe.castShadow=true; player.add(shoe);
}
player.traverse(o=>{if(o.isMesh){o.castShadow=true}});

const petalMat = new THREE.MeshStandardMaterial({color:'#fff1d2',emissive:'#ffbf78',emissiveIntensity:1.75,roughness:.28,metalness:.1});
const petals=[];
for(const [x,z] of [[-1.4,6.1],[1.55,3.8],[0,1.15],[-1.55,-1.7],[1.35,-4.4],[-.65,-7.2],[1.5,-9.4],[-2.15,-5.7]]){
  const g=new THREE.Group(); g.position.set(x,.85,z);
  const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.28,0),petalMat); crystal.scale.set(.72,1.25,.55); crystal.castShadow=true; g.add(crystal);
  const halo=new THREE.Mesh(new THREE.TorusGeometry(.36,.018,6,24),new THREE.MeshBasicMaterial({color:'#f9d9a8',transparent:true,opacity:.72})); halo.rotation.x=Math.PI/2; g.add(halo);
  const light=new THREE.PointLight('#ffd392',.8,2.4,2); g.add(light); scene.add(g); petals.push({group:g,baseY:.85,got:false});
}

const ghosts=[];
const ghostMat=new THREE.MeshStandardMaterial({color:'#99a5d6',emissive:'#5c70b2',emissiveIntensity:.75,transparent:true,opacity:.84,roughness:.35});
const ghostGlow=new THREE.MeshBasicMaterial({color:'#a9c5ff'});
for(const [x,z] of [[2.3,-1.3],[-2.45,-5.3],[2.5,6.2]]){
  const g=new THREE.Group(); g.position.set(x,.7,z);
  const body=new THREE.Mesh(new THREE.SphereGeometry(.48,12,10),ghostMat); body.scale.set(.88,1.05,.72); g.add(body);
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.29,.55,8),ghostMat); tail.position.y=-.48; tail.rotation.x=Math.PI; g.add(tail);
  for(const ex of [-.13,.13]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),ghostGlow);eye.position.set(ex,.05,.39);g.add(eye)}
  const glow=new THREE.PointLight('#8299f5',1.8,3,2);glow.position.y=.1;g.add(glow);
  scene.add(g); ghosts.push({group:g,phase:Math.random()*6,home:new THREE.Vector3(x,0,z)});
}

const keys=new Set();
let started=false, ended=false, petalsFound=0, health=3, invulnerable=0, dashTime=0, dashCooldown=0, time=0;
let moveX=0,moveZ=0,joyPointer=null,audioCtx=null;
const soundButton=document.querySelector('#sound-toggle');
let soundOn=false;
function playTone(freq=660,duration=.13){
  if(!soundOn)return;
  try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.055,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration)}catch{}
}
soundButton.addEventListener('click',()=>{soundOn=!soundOn;soundButton.textContent=soundOn?'♫':'♪';soundButton.style.color=soundOn?'#f0c990':'';if(soundOn)playTone(540)});
const toastEl=document.querySelector('#toast');let toastTimer;
function toast(text){toastEl.textContent=text;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),1350)}
function refreshHud(){document.querySelector('#petal-count').textContent=petalsFound;document.querySelector('#progress-fill').style.width=`${petalsFound/8*100}%`;[...document.querySelectorAll('#hearts span')].forEach((el,i)=>el.classList.toggle('lost',i>=health))}
function finish(won){if(ended)return;ended=true;document.querySelector('#end-title').innerHTML=won?'A wish<br><em>answered.</em>':'The night<br><em>continues.</em>';document.querySelector('#end-eyebrow').textContent=won?'THE SHRINE REMEMBERS':'THE SPIRITS WERE TOO MUCH';document.querySelector('#end-copy').textContent=won?'The moon petals have found their way home. Yuna’s quiet journey is complete.':'The shadows fade at dawn. Gather your courage and walk the path again.';document.querySelector('#end-overlay').classList.remove('hidden')}
function doDash(){if(!started||ended||dashCooldown>0)return;dashTime=.24;dashCooldown=1.05;invulnerable=Math.max(invulnerable,.45);playTone(380,.2)}
document.querySelector('#start-button').addEventListener('click',()=>{started=true;document.querySelector('#start-overlay').classList.add('hidden');document.querySelector('#hint').textContent='WASD to move · SPACE to dash';toast('The lantern path is open');playTone(520)});
document.querySelector('#restart-button').addEventListener('click',()=>location.reload());
document.querySelector('#dash-button').addEventListener('pointerdown',e=>{e.preventDefault();doDash()});
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d'].includes(k))e.preventDefault();keys.add(k);if(k===' '||k==='shift')doDash()},{passive:false});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
const joystick=document.querySelector('#joystick'),knob=document.querySelector('#joy-knob');
function joystickMove(e){const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=34,len=Math.hypot(dx,dy),scale=Math.min(1,max/(len||1));moveX=dx*scale/max;moveZ=dy*scale/max;knob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`}
joystick.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;joystick.setPointerCapture(joyPointer);joystickMove(e)});
joystick.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)joystickMove(e)});
function joystickEnd(){joyPointer=null;moveX=moveZ=0;knob.style.transform='translate(0,0)'}
joystick.addEventListener('pointerup',joystickEnd);joystick.addEventListener('pointercancel',joystickEnd);

function resize(){const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?52:43;camera.updateProjectionMatrix()}
window.addEventListener('resize',resize);resize();
setTimeout(()=>document.querySelector('#loading').classList.add('done'),450);

const dust=[];
const dustMat=new THREE.MeshBasicMaterial({color:'#f5d6b1',transparent:true,opacity:.55});
for(let i=0;i<36;i++){const mote=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.025,5,5),dustMat);mote.position.set((Math.random()-.5)*12,Math.random()*3,(Math.random()-.5)*24);scene.add(mote);dust.push({mesh:mote,phase:Math.random()*9,speed:.25+Math.random()*.4})}
const lastMove=new THREE.Vector2(0,-1);
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.035);time+=dt;
  for(let i=0;i<petals.length;i++){const p=petals[i];if(!p.got){p.group.rotation.y+=dt*.8;p.group.position.y=p.baseY+Math.sin(time*2.2+i)*.12}}
  ghosts.forEach((ghost,i)=>{const g=ghost.group;ghost.phase+=dt;let dx=player.position.x-g.position.x,dz=player.position.z-g.position.z,dist=Math.hypot(dx,dz);let vx=0,vz=0;if(started&&!ended&&dist<7){vx=dx/(dist||1);vz=dz/(dist||1)}else{vx=Math.sin(ghost.phase*.7+i)*.38;vz=Math.cos(ghost.phase*.55+i)*.32}g.position.x+=vx*dt*.8;g.position.z+=vz*dt*.8;g.position.y=.68+Math.sin(time*2.2+ghost.phase)*.18;g.rotation.y=Math.atan2(vx,vz);if(started&&!ended&&dist<.82&&invulnerable<=0){health--;invulnerable=.95;refreshHud();playTone(170,.22);toast(health?'A spirit brushed past you':'The spirits grow bolder');g.position.set(ghost.home.x,.7,ghost.home.z);if(health<=0)finish(false)}});
  dust.forEach((d,i)=>{d.mesh.position.y=.45+((time*d.speed+d.phase)%2.8);d.mesh.position.x+=Math.sin(time*.7+d.phase)*dt*.12;d.mesh.material.opacity=.25+Math.sin(time*2+d.phase)*.18});
  if(started&&!ended){
    let x=moveX,z=moveZ;
    if(keys.has('a')||keys.has('arrowleft'))x-=1;if(keys.has('d')||keys.has('arrowright'))x+=1;
    if(keys.has('w')||keys.has('arrowup'))z-=1;if(keys.has('s')||keys.has('arrowdown'))z+=1;
    const len=Math.hypot(x,z);if(len>1){x/=len;z/=len}
    if(Math.hypot(x,z)>.08){lastMove.set(x,z);player.rotation.y=Math.atan2(x,z)}
    if(dashCooldown>0)dashCooldown-=dt;if(dashTime>0)dashTime-=dt;if(invulnerable>0)invulnerable-=dt;
    const speed=dashTime>0?8.5:3.25;
    player.position.x=THREE.MathUtils.clamp(player.position.x+x*speed*dt,-3.15,3.15);
    player.position.z=THREE.MathUtils.clamp(player.position.z+z*speed*dt,-11.6,10.4);
    player.position.y=Math.sin(time*7)*.025;
    player.visible=invulnerable<=0||Math.floor(time*15)%2===0;
    for(const p of petals){if(!p.got&&Math.hypot(player.position.x-p.group.position.x,player.position.z-p.group.position.z)<.72){p.got=true;scene.remove(p.group);petalsFound++;refreshHud();playTone(660+petalsFound*45,.2);toast(petalsFound===8?'The shrine is awake!':`Moon petal found · ${petalsFound}/8`);if(petalsFound===8){shrineGlow.intensity=25;shrineGlow.distance=13;altar.material=gold;finish(true)}}}
  }else if(!started){player.position.y=Math.sin(time*1.6)*.025}
  const target=new THREE.Vector3(player.position.x*.48,player.position.y+8.8,player.position.z+11.1);
  camera.position.lerp(target,1-Math.exp(-dt*2.2));camera.lookAt(player.position.x*.24,.6,player.position.z-1.6);
  warmLight.intensity=13+Math.sin(time*2)*1.3;
  renderer.render(scene,camera);
}
animate();
