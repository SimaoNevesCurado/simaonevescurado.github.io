import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// CENA + RENDERER
const cena = new THREE.Scene();

const canvas = document.getElementById("meuCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(800, 600);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



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







};




// CÂMARA
const camara = new THREE.PerspectiveCamera(35.5, 800 / 600, 0.1, 1000);
camara.position.set(3, 3, 0.5);
camara.lookAt(0.9, 0.85, 0.1);

// LUZES
cena.add(new THREE.AmbientLight(0xfffffffff, 1.8));

const luz = new THREE.PointLight(0xffffff, 21);
luz.position.set(1, 4, 2);
cena.add(luz);
luz.castShadow = true;

// resolução da shadow map
luz.shadow.mapSize.width = 2048;
luz.shadow.mapSize.height = 2048;

// câmara de sombras (muito importante)
luz.shadow.camera.near = 0.5;
luz.shadow.camera.far = 20;

// suavizar e evitar acne
luz.shadow.bias = -0.0008;

// GRELHA
//cena.add(new THREE.GridHelper(10, 30));




// LOADER
const loader = new GLTFLoader();

let mesa, gira, speaker, planta;




let mixer;
const actions = {};



const backgroundTextureLoader = new THREE.TextureLoader();

backgroundTextureLoader.load('/images/background.jpg', (texture) => {
  cena.background = texture;
});

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
  const BASE_MESHES = ['Base','Cube.017'];
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


  mixer = new THREE.AnimationMixer(gira);
  glb.animations.forEach(clip => {
    actions[clip.name] = mixer.clipAction(clip);
  });
});




loader.load("../models/table.glb", glb => {
  mesa = glb.scene;
  cena.add(mesa);
  mesa.scale.set(2, 1, 1);
  mesa.position.set(0.5, 0, 0);

});

loader.load("../models/speakers.glb", glb => {
  speaker = glb.scene;
  cena.add(speaker);
  speaker.position.set(0.3, -0.1, -0.7);
  speaker.rotation.set(0, -2.5, 0);
  speaker.scale.set(0.3, 0.3, 0.3);

  speaker.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

});

loader.load("../models/pot.glb", glb => {
  planta = glb.scene;
  cena.add(planta);
  planta.position.set(0.2, 0.85, 1);
  planta.scale.set(1, 1, 1);
  planta.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

});


// LOOP
const clock = new THREE.Clock();

function animar() {
  requestAnimationFrame(animar);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(cena, camara);
}
animar();


// BOTÕES
let isPlaying = false;
let isOpened = false;
let hasMusicChanged = false;

document.getElementById('btn_desligar_disco').addEventListener('click', () => {
  const agulha = actions.TocarAction;
  const agulha2 = actions.MusicChangeAction;
  const disco = actions.VinylDiskAction;
  if (!agulha || !disco) return;

  disco.stop();
  disco.reset();

  if (hasMusicChanged === true && agulha2) {
    agulha2.stop();
    agulha2.setLoop(THREE.LoopOnce);
    agulha2.clampWhenFinished = true;
    agulha2.timeScale = -1;
    agulha2.time = agulha2.getClip().duration;
    agulha2.play();
  }

  agulha.stop();
  agulha.setLoop(THREE.LoopOnce);
  agulha.clampWhenFinished = true;
  agulha.timeScale = -1;
  agulha.time = agulha.getClip().duration;
  agulha.play();

  isPlaying = false;
});



document.getElementById('btn_ligar_disco').addEventListener('click', () => {
  const agulha = actions.TocarAction;
  const disco = actions.VinylDiskAction;
  if (!agulha || !disco) return;


  if (isOpened == true) {
    alert("Abra a Tampa primeiro!");
  } else {
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
      disco.clampWhenFinished = false;
      disco.reset();
      disco.play();
    }, 300);

  }


});

document.getElementById('btn_fechar_tampa').addEventListener('click', () => {
  const action = actions.DustCoverAction;
  if (!action || !isOpened) return;

  action.stop();
  action.setLoop(THREE.LoopOnce);
  action.clampWhenFinished = true;
  action.timeScale = -1;
  action.time = action.getClip().duration;
  action.play();

  isOpened = false;
});

document.getElementById('btn_desligar_disco').addEventListener('click', () => {
  const agulha = actions.TocarAction;
  const agulha2 = actions.MusicChangeAction;
  const disco = actions.VinylDiskAction;
  if (!agulha || !disco) return;
  disco.stop(); disco.reset();
  //primeiro trata da animacao da musica 
  if (hasMusicChanged == true) {
    agulha2.stop();
    agulha2.setLoop(THREE.LoopOnce);
    agulha.clampWhenFinished = true;
    agulha.timeScale = -1;
    agulha.time = agulha.getClip().duration;
    agulha.play();
  }

  agulha.stop();
  agulha.setLoop(THREE.LoopOnce);
  agulha.clampWhenFinished = true;
  agulha.timeScale = -1;
  agulha.time = agulha.getClip().duration;
  agulha.play();
  isPlaying = false;
})

document.getElementById('btn_abrir_tampa').addEventListener('click', () => {
  const action = actions.DustCoverAction;
  if (!action || isOpened) return;

  action.stop();
  action.setLoop(THREE.LoopOnce);
  action.clampWhenFinished = true;
  action.timeScale = 1;
  action.reset();
  action.play();

  isOpened = true;
});




document.getElementById('btn_trocar_musica').addEventListener('click', () => {
  const action = actions.MusicChangeAction;
  const disco = actions.VinylDiskAction;
  if (!action || !disco) return;

  if (isPlaying === true) {
    disco.stop();
    action.stop();
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.reset();
    action.play();
    hasMusicChanged = true;

    setTimeout(() => {
      disco.setLoop(THREE.LoopRepeat);
      disco.clampWhenFinished = false;
      disco.reset();
      disco.play();
    }, 300);
  } else {
    alert("Coloque primeiro o disco a tocar");
  }
});

let CameraChanged = false;
document.getElementById('btn_angulo').addEventListener('click', () => {

  if (CameraChanged === true) {
    camara.position.set(3, 3, 0.5);
    camara.lookAt(0.9, 0.85, 0.1);

    CameraChanged = false;
  } else {
    camara.position.set(2.3, 1, 0.2);
    camara.lookAt(0.9, 0.85, 0.1);
    CameraChanged = true;
  }
  isZoomedIn = false;
});



let isZoomedIn = false;

document.getElementById('btn_zoom').addEventListener('click', () => {

  if (CameraChanged == true && isZoomedIn == false) {

    camara.position.set(2, 2, 0.3);
    camara.lookAt(0.9, 0.85, 0.1);
    isZoomedIn = true;


  } else {

    if (isZoomedIn === true) {
      camara.position.set(3, 3, 0.5);

      isZoomedIn = false;
    } else {
      camara.position.set(2, 2, 0.3);
      isZoomedIn = true;
    }
  }
});


document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('tampo-material-option')) return;

  const tipo = parseInt(e.target.value, 10);

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
  if (!e.target.classList.contains('base-material-option')) return;

  const tipo = parseInt(e.target.value, 10);

  switch (tipo) {
    case 0:
      restaurarOriginal(groups.base, originalBaseMaterials)
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
  if (!e.target.classList.contains('corpo-material-option')) return;

  const tipo = parseInt(e.target.value, 10);

  switch (tipo) {
    case 0:
      restaurarOriginal(groups.corpo, originalCorpoMaterials)
      break;
    case 1:
      aplicarMaterial(groups.corpo,
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0,
          roughness: 0.8
        })
      );
      break;
    case 2:
      aplicarMaterial(groups.corpo,
        new THREE.MeshStandardMaterial({
          color: 0x919191,
          metalness: 0,
          roughness: 0.8
        })
      );
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
  if (!e.target.classList.contains('arm-material-option')) return;

  const tipo = parseInt

    (e.target.value, 10);

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
  if (!e.target.classList.contains('feet-material-option')) return;

  const tipo = parseInt

    (e.target.value, 10);

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

