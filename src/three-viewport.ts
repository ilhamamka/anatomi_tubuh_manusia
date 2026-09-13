// Real-time 3D WebGL Anatomy Viewport Engine with Three.js
// 360° Orbit, Organ Explosion / Dissection, Realistic Organic Pulse, Neural Particles, CT Slicing

import * as THREE from 'three';
import { ORGANS, type OrganInfo } from './organs-data';
import { sound } from './audio';

export class ThreeAnatomyViewport {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock = new THREE.Clock();

  // 3D Objects map
  private organMeshes: Map<string, THREE.Group> = new Map();
  private neutralMannequin!: THREE.Group;
  private neuralParticles!: THREE.Points;
  private bloodFlowParticles!: THREE.Points;
  private cuttingPlaneMesh!: THREE.Mesh;

  // State
  private explodeFactor: number = 0; // 0 to 1
  private isRotating: boolean = false;
  private isPointerDown: boolean = false;
  private prevPointerX: number = 0;
  private prevPointerY: number = 0;
  private targetRotY: number = 0;
  private targetRotX: number = 0;
  private currentZoom: number = 5.5;

  private onOrganSelectCallback?: (organ: OrganInfo) => void;

  constructor(container: HTMLElement, onOrganSelect?: (organ: OrganInfo) => void) {
    this.container = container;
    this.onOrganSelectCallback = onOrganSelect;
    this.initScene();
    this.buildAnatomicalModel();
    this.bindControls();
    this.animate();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b14); // Deep cyber-medical slate

    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, this.currentZoom);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(3, 4, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 3.0);
    rimLight.position.set(-4, -2, -3);
    this.scene.add(rimLight);

    const heartWarmLight = new THREE.PointLight(0xff2a5f, 2.0, 5);
    heartWarmLight.position.set(0, 0.4, 0.5);
    this.scene.add(heartWarmLight);
  }

  private buildAnatomicalModel() {
    this.neutralMannequin = new THREE.Group();
    this.scene.add(this.neutralMannequin);

    // 1. Holographic Glass Human Silhouette Outer Shell
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.4,
      wireframe: false
    });

    const torsoGeo = new THREE.CylinderGeometry(0.7, 0.5, 2.0, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, glassMat);
    torsoMesh.position.y = 0;
    this.neutralMannequin.add(torsoMesh);

    const headGeo = new THREE.SphereGeometry(0.42, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, glassMat);
    headMesh.position.y = 1.6;
    this.neutralMannequin.add(headMesh);

    const neckGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.4, 16);
    const neckMesh = new THREE.Mesh(neckGeo, glassMat);
    neckMesh.position.y = 1.15;
    this.neutralMannequin.add(neckMesh);

    // 2. Anatomical 3D Heart (Cor)
    const heartGroup = new THREE.Group();
    heartGroup.name = 'heart';
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.25,
      metalness: 0.2,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.4
    });

    const ventricle1 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 32), heartMat);
    ventricle1.scale.set(0.9, 1.2, 0.9);
    ventricle1.position.set(-0.05, 0.4, 0.15);
    heartGroup.add(ventricle1);

    // Aorta arch
    const aortaMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 0.6, 0.15),
      new THREE.Vector3(-0.05, 0.8, 0.15),
      new THREE.Vector3(0.08, 0.82, 0.1),
      new THREE.Vector3(0.12, 0.5, 0.05)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 20, 0.06, 12, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    heartGroup.add(aortaMesh);

    this.organMeshes.set('heart', heartGroup);
    this.scene.add(heartGroup);

    // 3. Anatomical 3D Lungs (Pulmo)
    const lungsGroup = new THREE.Group();
    lungsGroup.name = 'lungs';
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      roughness: 0.4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25
    });

    // Left & Right Lung Lobes
    const leftLung = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.9, 24), lungMat);
    leftLung.rotation.z = Math.PI;
    leftLung.position.set(0.35, 0.45, 0.1);
    leftLung.scale.set(1.0, 1.0, 0.65);
    lungsGroup.add(leftLung);

    const rightLung = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.95, 24), lungMat);
    rightLung.rotation.z = Math.PI;
    rightLung.position.set(-0.4, 0.45, 0.1);
    rightLung.scale.set(1.0, 1.0, 0.65);
    lungsGroup.add(rightLung);

    // Trachea
    const tracheaGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
    const tracheaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
    tracheaMesh.position.set(0, 0.9, 0.1);
    lungsGroup.add(tracheaMesh);

    this.organMeshes.set('lungs', lungsGroup);
    this.scene.add(lungsGroup);

    // 4. Anatomical 3D Brain (Cerebrum)
    const brainGroup = new THREE.Group();
    brainGroup.name = 'brain';
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.35,
      emissive: 0xdb2777,
      emissiveIntensity: 0.35
    });

    const leftHemi = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), brainMat);
    leftHemi.scale.set(0.85, 1.0, 1.2);
    leftHemi.position.set(-0.1, 1.62, 0);
    brainGroup.add(leftHemi);

    const rightHemi = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), brainMat);
    rightHemi.scale.set(0.85, 1.0, 1.2);
    rightHemi.position.set(0.1, 1.62, 0);
    brainGroup.add(rightHemi);

    // Cerebellum
    const cerebellum = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), brainMat);
    cerebellum.position.set(0, 1.45, -0.15);
    brainGroup.add(cerebellum);

    this.organMeshes.set('brain', brainGroup);
    this.scene.add(brainGroup);

    // 5. Anatomical 3D Stomach & Liver (Gaster & Hepar)
    const digestiveGroup = new THREE.Group();
    digestiveGroup.name = 'stomach';
    const stomachMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      emissive: 0xd97706,
      emissiveIntensity: 0.25
    });
    const stomach = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.1, 16, 24, Math.PI * 0.9), stomachMat);
    stomach.position.set(0.12, -0.05, 0.15);
    stomach.rotation.z = Math.PI * 0.4;
    digestiveGroup.add(stomach);

    const liverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35 });
    const liver = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.4, 20), liverMat);
    liver.rotation.z = -Math.PI * 0.35;
    liver.position.set(-0.22, 0.05, 0.14);
    digestiveGroup.add(liver);

    this.organMeshes.set('stomach', digestiveGroup);
    this.scene.add(digestiveGroup);

    // 6. Anatomical 3D Skeleton (Spine & Ribcage)
    const skeletonGroup = new THREE.Group();
    skeletonGroup.name = 'skeleton';
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
      metalness: 0.05
    });

    // Spine Column
    const spineGeo = new THREE.CylinderGeometry(0.06, 0.07, 1.8, 16);
    const spineMesh = new THREE.Mesh(spineGeo, boneMat);
    spineMesh.position.set(0, 0.2, -0.12);
    skeletonGroup.add(spineMesh);

    // 6 Rib Pairs
    for (let i = 0; i < 6; i++) {
      const ribGeo = new THREE.TorusGeometry(0.48 - i * 0.03, 0.022, 8, 24, Math.PI * 0.9);
      const rib = new THREE.Mesh(ribGeo, boneMat);
      rib.position.set(0, 0.65 - i * 0.12, 0.04);
      rib.rotation.x = Math.PI * 0.5;
      skeletonGroup.add(rib);
    }

    this.organMeshes.set('skeleton', skeletonGroup);
    this.scene.add(skeletonGroup);

    // 7. Neural Synapses Particle Cloud
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3]     = (Math.random() - 0.5) * 0.45;
      posArr[i * 3 + 1] = 1.45 + Math.random() * 0.35;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.45;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.035,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    this.neuralParticles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.neuralParticles);

    // 8. CT-Scan / MRI Slicing Laser Plane
    const planeGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    this.cuttingPlaneMesh = new THREE.Mesh(planeGeo, planeMat);
    this.cuttingPlaneMesh.rotation.x = Math.PI / 2;
    this.cuttingPlaneMesh.position.y = 0.4;
    this.cuttingPlaneMesh.visible = false;
    this.scene.add(this.cuttingPlaneMesh);
  }

  private bindControls() {
    const el = this.renderer.domElement;

    el.addEventListener('mousedown', (e) => {
      this.isPointerDown = true;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isPointerDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerDown) return;
      const deltaX = e.clientX - this.prevPointerX;
      const deltaY = e.clientY - this.prevPointerY;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;

      this.targetRotY += deltaX * 0.008;
      this.targetRotX += deltaY * 0.008;
      this.targetRotX = Math.max(-0.7, Math.min(0.7, this.targetRotX));
    });

    // Touch support for tablets
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isPointerDown = true;
        this.prevPointerX = e.touches[0].clientX;
        this.prevPointerY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isPointerDown = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isPointerDown || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.prevPointerX;
      const deltaY = e.touches[0].clientY - this.prevPointerY;
      this.prevPointerX = e.touches[0].clientX;
      this.prevPointerY = e.touches[0].clientY;

      this.targetRotY += deltaX * 0.008;
      this.targetRotX += deltaY * 0.008;
    }, { passive: true });

    // Wheel zoom
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.currentZoom += e.deltaY * 0.003;
      this.currentZoom = Math.max(2.8, Math.min(8.5, this.currentZoom));
      this.camera.position.z = this.currentZoom;
    }, { passive: false });

    // Raycast on click to select organ
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

      const hit = raycaster.intersectObjects(this.scene.children, true);
      if (hit.length > 0) {
        let current: THREE.Object3D | null = hit[0].object;
        while (current && current.parent && current.parent !== this.scene) {
          if (this.organMeshes.has(current.name)) {
            const organId = current.name;
            const organ = ORGANS[organId];
            if (organ && this.onOrganSelectCallback) {
              sound.playPop(1.2);
              this.onOrganSelectCallback(organ);
            }
            break;
          }
          current = current.parent;
        }
      }
    });

    // Resize listener
    window.addEventListener('resize', () => this.onResize());
  }

  public setExplodeFactor(factor: number) {
    this.explodeFactor = Math.max(0, Math.min(1, factor));

    // Explode organ groups away from center
    const heart = this.organMeshes.get('heart');
    if (heart) {
      heart.position.z = this.explodeFactor * 0.8;
      heart.position.x = -this.explodeFactor * 0.4;
    }

    const brain = this.organMeshes.get('brain');
    if (brain) {
      brain.position.y = this.explodeFactor * 0.7;
    }

    const lungs = this.organMeshes.get('lungs');
    if (lungs) {
      lungs.position.z = -this.explodeFactor * 0.5;
      lungs.position.x = this.explodeFactor * 0.6;
    }

    const stomach = this.organMeshes.get('stomach');
    if (stomach) {
      stomach.position.z = this.explodeFactor * 0.6;
      stomach.position.y = -this.explodeFactor * 0.4;
    }

    const skeleton = this.organMeshes.get('skeleton');
    if (skeleton) {
      skeleton.position.z = -this.explodeFactor * 0.7;
    }
  }

  public setSliceHeight(heightY: number) {
    this.cuttingPlaneMesh.visible = true;
    this.cuttingPlaneMesh.position.y = heightY; // between -1.0 to 1.8
  }

  public toggleCuttingPlane(show: boolean) {
    this.cuttingPlaneMesh.visible = show;
  }

  public resetView() {
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.currentZoom = 5.5;
    this.camera.position.set(0, 0, this.currentZoom);
    this.setExplodeFactor(0);
  }

  public setPresetView(view: 'front' | 'side' | 'back') {
    this.targetRotX = 0;
    if (view === 'front') this.targetRotY = 0;
    else if (view === 'side') this.targetRotY = Math.PI / 2;
    else if (view === 'back') this.targetRotY = Math.PI;
  }

  private onResize() {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const time = this.clock.getElapsedTime();

    // Smooth camera rotation damping
    this.scene.rotation.y += (this.targetRotY - this.scene.rotation.y) * 0.1;
    this.scene.rotation.x += (this.targetRotX - this.scene.rotation.x) * 0.1;

    // 1. Organic Heart Contraction Pump Physics
    const heart = this.organMeshes.get('heart');
    if (heart) {
      const beat = Math.sin(time * 5.0);
      const scale = beat > 0.6 ? 1.08 + (beat - 0.6) * 0.25 : 1.0;
      heart.scale.set(scale, scale, scale);
    }

    // 2. Organic Lung Breathing Expansion
    const lungs = this.organMeshes.get('lungs');
    if (lungs) {
      const breath = Math.sin(time * 1.6) * 0.08;
      lungs.scale.set(1.0 + breath, 1.0 + breath * 0.6, 1.0 + breath);
    }

    // 3. Firing Synaptic Particles
    if (this.neuralParticles) {
      const pos = this.neuralParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += (Math.sin(time * 3 + i) * 0.001);
        pos[i + 1] += (Math.cos(time * 2 + i) * 0.001);
      }
      this.neuralParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
