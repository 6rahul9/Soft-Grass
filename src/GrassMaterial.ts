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

    uniforms: {[key: string] : {value: any} } = {
        uTime: {value: 0},
        uEnaableShadow : { value : true},
        uShadowDarkness : { value : 0.5},
        uGrassLightIntensity : { value : 1},
        uNoiseScale : { value : 1.5},
        uPlayerPosition : { value : new THREE.Vector3()},
        baseColor : { value : new THREE.Color(this.grassColorProps.baseColor)},
        triColor1 : { value : new THREE.Color(this.grassColorProps.tipColor1)},
        triColor2 : { value : new THREE.Color(this.grassColorProps.tipColor2)},

        noiseTexture : { value : new THREE.Texture()},
        grassAlphaTexture : { value : new THREE.Texture()},
    }

    private mergeUniforms(newUniforms?: GrassUniformsInterface){
        if(!newUniforms) return;
        for(const [key, value] of Object.entries(newUniforms)){
            if(value && this.uniforms.hasOwnProperty(key)){
                this.uniforms[key] . value = value 
            }
        }
    }

    constructor (grassProps? : GrassUniformsInterface){
        this.marginUniforms(grassProps)
        this.material = new THREE.MeshLambertMaterial({
            side:THREE.doubleSide
        })
    }
}