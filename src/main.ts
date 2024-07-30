import * as THREE from "three"
import Stats from 'stats-gl'
import { GLTFLoader } from "three/examples/jsm/Addons.js"
import * as dat from 'dat.gui'

import { OrbitControls } from "three/examples/jsm/Addons.js"
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js"
// import { GrassMaterial } from "./GrassMaterial.ts";
import GrassMaterial from './GrassMaterial.ts';
 

export class FluffyGrass{
    //need access to these outside the computer 

    private loadingManager : THREE.LoadingManager;
    private textureLoader: THREE.TextureLoader;
    private gltfLoader: GLTFLoader;
    
    private camera: THREE.PerspectiveCamera;
    private renderer : THREE.WebGLRenderer;
    private scene : THREE.Scene
    private canvas: HTMLCanvasElement;
    private Stats : Stats;
    private orbitControls : OrbitControls;
    private gui: dat.GUI;
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

        this.camera = new THREE.PerspectiveCamera
    }
}