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
    noiseTexture?: { value: THREE.Texture}
    glassAlphatexture?:{ value: THREE.Texture}
    fogColor2?: { value: THREE.Color}
    fogColor3?: { value: THREE.Color}
}

export class GrassMaterial{
    material: THREE.Material

    private grassColorProps = {
        baseColor : "#313f1b",
        tipColor1:  "#9bd38d",
        tipColor2:  "#1f352a"
    }
}