import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('previewCanvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const groups = {
  base: [],
  corpo: [],
  arm: [],
  tampo: [],
  feet: []
};

let originalTampoMaterials = [];
let originalBaseMaterials = [];
let originalCorpoMaterials = [];
let originalArmMaterials = [];
let originalFeetMaterials = [];



let mixer;
const actions = {};

// TEXTURAS
const textureLoader = new THREE.TextureLoader();

const textures = {

  madeira_branca: {
    albedo: textureLoader.load('../models/textures/madeira-branca/oldplywood-albedo.png'),
    roughness: textureLoader.load('../models/textures/madeira-branca/oldplywood-rough.png'),
    metalness: textureLoader.load('../models/textures/madeira-branca/oldplywood-metal.png'),
    normal: textureLoader.load('../models/textures/madeira-branca/oldplywood-normal-ogl.png')
  },

  madeira_cherry: {
    albedo: textureLoader.load('../models/textures/madeira-cherry/cherry-wood-veneer2-albedo.png'),
    roughness: textureLoader.load('../models/textures/madeira-cherry/cherry-wood-veneer2-Roughness.png'),
    normal: textureLoader.load('../models/textures/madeira-cherry/cherry-wood-veneer2-Normal-ogl.png'),
    metalness: textureLoader.load('../models/textures/madeira-cherry/cherry-wood-veneer2-Metallic.png'),
  },
  bamboo: {
    albedo: textureLoader.load('../models/textures/bamboo/bamboo-wood-semigloss-albedo.png'),
    roughness: textureLoader.load('../models/textures/bamboo/bamboo-wood-semigloss-roughness.png'),
    normal: textureLoader.load('../models/textures/bamboo/bamboo-wood-semigloss-normal.png'),
    metalness: textureLoader.load('../models/textures/bamboo/bamboo-wood-semigloss-metal.png'),
  },
  granito: {
    albedo: textureLoader.load('../models/textures/granito/cloudy-veined-quartz-light_albedo.png'),
    roughness: textureLoader.load('../models/textures/granito/cloudy-veined-quartz-light_roughness.png'),
    normal: textureLoader.load('../models/textures/granito/cloudy-veined-quartz-light_normal-ogl.png'),
    metalness: textureLoader.load('../models/textures/granito/cloudy-veined-quartz-light_metallic.png'),
  },
  metal: {
    albedo: textureLoader.load('../models/textures/metal/worn-aluminum_albedo.png'),
    roughness: textureLoader.load('../models/textures/metal/worn-aluminum_roughness.png'),
    metalness: textureLoader.load('../models/textures/metal/worn-aluminum_metallic.png'),
    normal: textureLoader.load('../models/textures/metal/worn-aluminum_normal-ogl.png')
  },
  plastico: {
    albedo: textureLoader.load('../models/textures/plastico/worn-old-plastic_albedo.png'),
    roughness: textureLoader.load('../models/textures/plastico/worn-old-plastic_roughness.png'),
    metalness: textureLoader.load('../models/textures/plastico/worn-old-plastic_metallic.png'),
    normal: textureLoader.load('../models/textures/plastico/worn-old-plastic_normal-ogl.png')
  },
  cortica: {
    albedo: textureLoader.load('../models/textures/cortica/corkboard3b-albedo.png'),
    roughness: textureLoader.load('../models/textures/cortica/corkboard3b-roughness.png'),
    normal: textureLoader.load('../models/textures/cortica/corkboard3b-normal.png')
  },


};

// MATERIAIS
const materials = {

  madeira_branca: new THREE.MeshStandardMaterial({
    map: textures.madeira_branca.albedo,
    roughnessMap: textures.madeira_branca.roughness,
    metalnessMap: textures.madeira_branca.metalness,
    normalMap: textures.madeira_branca.normal,
    metalness: 0,
    roughness: 0.9,
    side: THREE.DoubleSide
  }),

  materialBamboo: new THREE.MeshStandardMaterial({
    map: textures.bamboo.albedo,
    normalMap: textures.bamboo.normal,
    roughnessMap: textures.bamboo.roughness,
    metalnessMap: textures.bamboo.metalness,
    metalness: 0,
    roughness: 0.7,
    side: THREE.DoubleSide

  }),

  materialCherryWood: new THREE.MeshStandardMaterial({
    map: textures.madeira_cherry.albedo,
    normalMap: textures.madeira_cherry.normal,
    roughnessMap: textures.madeira_cherry.roughness,
    metalnessMap: textures.madeira_cherry.metallic,
    metalness: 0,
    roughness: 0.8,
    side: THREE.DoubleSide

  }),
  materialGranito: new THREE.MeshStandardMaterial({
    map: textures.granito.albedo,
    normalMap: textures.granito.normal,
    roughnessMap: textures.granito.roughness,
    metalnessMap: textures.granito.metalness,
    metalness: 0,
    roughness: 0.6,
    side: THREE.DoubleSide
  }),
  metal: new THREE.MeshStandardMaterial({
    map: textures.metal.albedo,
    roughnessMap: textures.metal.roughness,
    metalnessMap: textures.metal.metalness,
    normalMap: textures.metal.normal,

    metalness: 1,
    roughness: 0.6
  }),
  plastico: new THREE.MeshStandardMaterial({
    map: textures.plastico.albedo,
    roughnessMap: textures.plastico.roughness,
    normalMap: textures.plastico.normal,

    metalness: 0,
    roughness: 0.8
  }),
  cortica: new THREE.MeshStandardMaterial({
    map: textures.cortica.albedo,
    roughnessMap: textures.cortica.roughness,
    normalMap: textures.cortica.normal,

    metalness: 0,
    roughness: 0.95
  }),
  tampo_transparente: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,

    metalness: 0,
    roughness: 0.1
  }),
  branco: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0, roughness: 0.8 }),
  cinza: new THREE.MeshStandardMaterial({ color: 0x919191, metalness: 0, roughness: 0.8 })

};

const cena = new THREE.Scene();

const camara = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camara.position.set(3, 3, 0.5);

const controls = new OrbitControls(camara, renderer.domElement);
controls.enableDamping = true;

cena.add(new THREE.AmbientLight(0xffffff, 1.4));

const luz = new THREE.PointLight(0xffffff, 20);
luz.position.set(2, 5, 2);
cena.add(luz);

const loader = new GLTFLoader();
let gira;


const backgroundTextureLoader = new THREE.TextureLoader();

backgroundTextureLoader.load('/images/background.jpg', (texture) => {
  cena.background = texture;
});
let modeloCarregado = false;


loader.load('/models/RecordPlayer.glb', glb => {
  gira = glb.scene;
  cena.add(gira);

  gira.position.set(0.9, 0.85, 0.1);
  gira.scale.set(2, 2, 2);



  groups.base.length = 0;
  groups.corpo.length = 0;
  originalBaseMaterials.length = 0;
  originalCorpoMaterials.length = 0;

  const TAMPO_MESHES = ['DustCover'];
  const BASE_MESHES = ['Base', 'Cube.017'];
  const CORPO_MESHES = ['VinylBase'];
  const ARM_MESHES = ['PickupBaseAttachment', 'TuningHandle', 'Thorn', 'Cylinder004', 'Cylinder004_1', 'Cylinder004_2', 'Cylinder004_3']
  const FEET_MESHES = ['Feet'];

  // debug. confirma nomes
  gira.traverse(child => {
    if (child.isMesh) console.log(child.name);
  });

  //tampo
  gira.traverse(child => {
    if (!child.isMesh) return;
    if (!TAMPO_MESHES.includes(child.name)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    groups.tampo.push(child);

    originalTampoMaterials.push(
      Array.isArray(child.material)
        ? child.material.map(m => m.clone())
        : child.material.clone()
    );
  });

  //  BASE 
  gira.traverse(child => {
    if (!child.isMesh) return;
    if (!BASE_MESHES.includes(child.name)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    groups.base.push(child);

    originalBaseMaterials.push(
      Array.isArray(child.material)
        ? child.material.map(m => m.clone())
        : child.material.clone()
    );
  });

  // CORPO 
  gira.traverse(child => {
    if (!child.isMesh) return;
    if (!CORPO_MESHES.includes(child.name)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    groups.corpo.push(child);

    originalCorpoMaterials.push(
      Array.isArray(child.material)
        ? child.material.map(m => m.clone())
        : child.material.clone()
    );
  });

  //Acessorios
  gira.traverse(child => {
    if (!child.isMesh) return;
    if (!ARM_MESHES.includes(child.name)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    groups.arm.push(child);

    originalArmMaterials.push(
      Array.isArray(child.material)
        ? child.material.map(m => m.clone())
        : child.material.clone()
    );
  });

  gira.traverse(child => {
    if (!child.isMesh) return;
    if (!FEET_MESHES.includes(child.name)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    groups.feet.push(child);

    originalFeetMaterials.push(
      Array.isArray(child.material)
        ? child.material.map(m => m.clone())
        : child.material.clone()
    );
  });



  controls.target.set(0.9, 0.85, 0.1);
  controls.update();
  modeloCarregado = true;
  mixer = new THREE.AnimationMixer(gira);
  glb.animations.forEach(clip => {
    actions[clip.name] = mixer.clipAction(clip);
  });


});

window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();


function animar() {
  requestAnimationFrame(animar);
  controls.update();
  renderer.render(cena, camara);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

}
animar();



document.addEventListener('click', (e) => {
  const btn = e.target.closest('.material-tile');
  if (!btn) return;
  if (btn.dataset.part !== 'tampo') return;

  if (!modeloCarregado) {
    console.warn('Modelo ainda não carregou');
    return;
  }

  const tipo = parseInt(btn.value, 10);

  if (!modeloCarregado) {
    console.warn('Modelo ainda não carregou');
    return;
  }

  switch (tipo) {
    case 0:
      restaurarOriginal(groups.tampo, originalTampoMaterials)
      break;
    case 1:
      aplicarMaterial(groups.tampo, materials.tampo_transparente);
      break;
  }
});


document.addEventListener('click', (e) => {
  const btn = e.target.closest('.material-tile');
  if (!btn) return;
  if (btn.dataset.part !== 'base') return;

  if (!modeloCarregado) {
    console.warn('Modelo ainda não carregou');
    return;
  }

  const tipo = parseInt(btn.value, 10);

  switch (tipo) {
    case 0:
      restaurarOriginal(groups.base, originalBaseMaterials);
      break;
    case 1:
      aplicarMaterial(groups.base, materials.madeira_branca);
      break;
    case 2:
      aplicarMaterial(groups.base, materials.materialBamboo);
      break;
    case 3:
      aplicarMaterial(groups.base, materials.materialCherryWood);
      break;
    case 4:
      aplicarMaterial(groups.base, materials.materialGranito);
      break;
  }
});






document.addEventListener('click', (e) => {
  const btn = e.target.closest('.material-tile');
  if (!btn) return;
  if (btn.dataset.part !== 'corpo') return;

  if (!modeloCarregado) {
    console.warn('Modelo ainda não carregou');
    return;
  }
  const tipo = parseInt(btn.value, 10);


  switch (tipo) {
    case 0:
      restaurarOriginal(groups.corpo, originalCorpoMaterials)
      break;
    case 1:
      aplicarMaterial(groups.corpo, materials.branco);
      break;
    case 2:
      aplicarMaterial(groups.corpo, materials.cinza);
      break;
    case 3:
      aplicarMaterial(groups.corpo, materials.madeira_branca);
      break;
    case 4:
      aplicarMaterial(groups.corpo, materials.materialGranito);
      break;
    case 5:
      aplicarMaterial(groups.corpo, materials.materialCherryWood);
      break;
  }
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.material-tile');
  if (!btn) return;
  if (btn.dataset.part !== 'arm') return;

  if (!modeloCarregado) {
    console.warn('Modelo ainda não carregou');
    return;
  }
  const tipo = parseInt(btn.value, 10);


  switch (tipo) {
    case 0:
      restaurarOriginal(groups.arm, originalArmMaterials);
      break;
    case 1:
      aplicarMaterial(groups.arm, materials.materialGranito);
      break;


  }
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.material-tile');
  if (!btn) return;
  if (btn.dataset.part !== 'feet') return;

  if (!modeloCarregado) {
    console.warn('Modelo ainda não carregou');
    return;
  }
  const tipo = parseInt(btn.value, 10);



  switch (tipo) {
    case 0:
      restaurarOriginal(groups.feet, originalFeetMaterials);
      break;
    case 1:
      aplicarMaterial(groups.feet, materials.plastico);
      break;
    case 2:
      aplicarMaterial(groups.feet, materials.metal);
      break;
    case 3:
      aplicarMaterial(groups.feet, materials.cortica);
      break;


  }
});


canvas.addEventListener('click', (event) => {

  if (!modeloCarregado) return;

  const rect = canvas.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camara);

  const intersects = raycaster.intersectObject(gira, true);

  if (intersects.length === 0) return;

  const mesh = intersects[0].object;

  console.log('Mesh clicada:', mesh.name);

  tratarCliqueNoModelo(mesh);
});

let isOpened = false;



function abrirTampa() {
  const action = actions.DustCoverAction;
  if (!action || isOpened) return;

  action.stop();
  action.setLoop(THREE.LoopOnce);
  action.clampWhenFinished = true;
  action.timeScale = 1;
  action.reset();
  action.play();

  isOpened = true;
}


function fecharTampa() {
  const action = actions.DustCoverAction;
  if (!action || !isOpened) return;

  action.stop();
  action.setLoop(THREE.LoopOnce);
  action.clampWhenFinished = true;
  action.timeScale = -1;
  action.time = action.getClip().duration;
  action.play();

  isOpened = false;
}


let isPlaying = false;


let discoEmTransicao = false;

function ligarDisco() {
  if (discoEmTransicao) return;
  discoEmTransicao = true;

  const agulha = actions.TocarAction;
  const disco = actions.VinylDiskAction;
  if (!agulha || !disco) return;

  agulha.stop();
  agulha.setLoop(THREE.LoopOnce);
  agulha.clampWhenFinished = true;
  agulha.timeScale = 1;
  agulha.reset();
  agulha.play();

  isPlaying = true;

  setTimeout(() => {
    disco.stop();
    disco.setLoop(THREE.LoopRepeat);
    disco.reset();
    disco.play();
    discoEmTransicao = false;
  }, 300);
}


function desligarDisco() {


  const agulha = actions.TocarAction;
  const disco = actions.VinylDiskAction;
  if (!agulha || !disco) return;
  disco.stop(); disco.reset();


  agulha.stop();
  agulha.setLoop(THREE.LoopOnce);
  agulha.clampWhenFinished = true;
  agulha.timeScale = -1;
  agulha.time = agulha.getClip().duration;
  agulha.play();
  isPlaying = false;

}


function tratarCliqueNoModelo(mesh) {

  switch (mesh.name) {

    case 'DustCover':
      isOpened ? fecharTampa() : abrirTampa();
      break;

    case 'VinylDisk':
      isPlaying ?  desligarDisco() :ligarDisco() ;
    break;

    default:
      console.log('Sem ação para', mesh.name);
  }
}







function aplicarMaterial(meshes, material) {
  meshes.forEach(mesh => {
    mesh.material = material.clone();
  });
}

function restaurarOriginal(meshes, originalMaterials) {
  meshes.forEach((mesh, i) => {
    const original = originalMaterials[i];

    mesh.material = Array.isArray(original)
      ? original.map(mat => mat.clone())
      : original.clone();
  });
}








