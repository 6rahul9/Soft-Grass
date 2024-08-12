import * as THREE from "three"
import Stats from 'stats-gl'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as dat from 'dat.gui'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { MeshSurfaceSampler} from "three/addons/math/MeshSurfaceSampler.js"
import { GrassMaterial } from './GrassMaterial.ts';
 

export class FluffyGrass{
    //need access to these outside the computer 

    private loadingManager : THREE.LoadingManager;
    private textureLoader: THREE.TextureLoader;
    private gltfLoader: GLTFLoader;
    
    private camera: THREE.PerspectiveCamera;
    private renderer : THREE.WebGLRenderer;
    private scene : THREE.Scene
    private canvas: HTMLCanvasElement;
    private stats : Stats;
    private orbitControls : OrbitControls;
    private gui: dat.GUI;
    private sceneGUI: dat.GUI
    private sceneProps = {
        fogColor : '#eeeeee',
        terrainColor: '#5e875e',
        fogDensity: 0.02,
    };

    private textures : {[key : string] : THREE.Texture } = {};

    Uniforms = {
        uTime : {value : 0 },
        color : { value : new THREE.Color('#000ff')},
    };
    private clock = new THREE.Clock();

    private terrainMat : THREE.MeshPhongMaterial;
    private grassGeometry = new THREE.BufferGeometry();
    private grassMaterial : GrassMaterial;
    private grassCount : 8000;
    
    constructor(_canvas : HTMLCanvasElement){
        this.loadingManager = new THREE.LoadingManager;
        this.textureLoader = new THREE.TextureLoader(this.loadingManager)

        this.gui = new dat.GUI()
        this. gltfLoader = new GLTFLoader(this.loadingManager)

        this.canvas = _canvas;

        // this.canvas.style.pointerEvents = 'all'
        this.stats = new Stats({minimal : true,})

        this.camera = new THREE.PerspectiveCamera( 75,
        window.innerWidth / window.innerHeight, 0.1, 1000)
        
        this.camera.position.set(-17, 12, -10)
        this.scene = new THREE.Scene()

        this.scene.background = new THREE.Color(this.sceneProps.fogColor)
        this.scene.fog = new THREE.FogExp2(
            this.sceneProps.fogColor,
            this.sceneProps.fogDensity
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas : this.canvas,
            antialias : true,
            alpha : true,
            precision: "highp" //use high precision
        })

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.autoUpdate = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.scene.frustumCulled = true;

        this.orbitControls = new OrbitControls(this.camera, this.canvas)
        this.orbitControls.autoRotate = true
        this.orbitControls.autoRotateSpeed = -0.5;
        this.orbitControls.enableDamping = true;
        this.grassMaterial = new GrassMaterial()
        this.terrainMat = new THREE.MeshPhongMaterial({ color: this.sceneProps.terrainColor,});

        this.init();
    }

    private init(){
        this.setupGUI();
        this.setupStats();
        this.setupTextures();
        // this.createCube()
        this.loadModels()
        this.setupEventListeners()
        this.addLights();
    }

    private createCube(){
        const geometry = new THREE.BoxGeometry(2,7,2)
        const material = new THREE.MeshPhongMaterial({ color: 0x333333 })
        const cube = new THREE.Mesh(geometry, material)
        cube.position.set(6,5,-3)
        cube.castShadow = true;
        this.scene.add(cube); 
    }
    
    private addLights(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.castShadow = true;
        directionalLight.position.set(100, 100,100);
        directionalLight.shadow.camera.far = 200
        directionalLight.shadow.camera.left = -50
        directionalLight.shadow.camera.right= 50
        directionalLight.shadow.camera.top= 50
        directionalLight.shadow.camera.bottom = -50
        directionalLight.shadow.mapSize.set(2048, 2048);
        this.scene.add(directionalLight);
    }
}