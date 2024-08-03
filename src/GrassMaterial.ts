import { GUI } from 'dat.gui'

import * as THREE from "three"

interface GrassUniformInterface{
    uTime?: { value: number }
    uEnableShadow?: { value: boolean }
    uShadowDarkness?: { value: number }
    uGrassLightIntensity?: { value: number }
    uNoiseScale?: { value: number}
    uPlayerPosition?: { value:THREE.Vector3}
    baseColor?: { value: THREE.Color}
    tipColor1?: { value: THREE.Color}
    tipColor2?: { value: THREE.Color}
    
}