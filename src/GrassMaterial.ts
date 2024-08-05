import { GUI } from 'dat.gui'

import * as THREE from "three"

interface GrassUniformInterface{
    uTime?: { value: number }
    uEnableShadows?: { value: boolean }
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
        uEnaableShadows : { value : true},
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

    constructor(grassProps? : GrassUniformsInterface){
        this.mergeUniforms(grassProps)
        this.material = new THREE.MeshLambertMaterial({
            side:THREE.DoubleSide,
            color : 0x229944,
            transparent : true,
            alphaTest : 0.1,
            shadowSide : 1,
        })

        this.setupGrassMaterial(this.material);
    }

    public updateGrassGraphicsChange(high: boolean = true){
        if(!high){
            this.uniforms.uEnableShadows.value = false;
        }
        else{
            this.uniforms.uEnableShadows.value = true;
        }
    }


    update(delta:number){
        this.uniforms.uTime.value = delta
    }

    private setupGrassMaterial(material: THREE.Material){
        material.onBeforeCompile = shader => {
            shader.uniforms = {
                ...shader.uniforms,
                utime: this.uniforms.uTime,
                uTipColor1 : this.uniforms.tipColor1,
                uTipColor2 : this.uniforms.tipColor2,
                uBaseColor : this.uniforms.baseColor,
                uEnableShadows : this.uniforms.uEnableShadows,
                uShadowDarkness : this.uniforms.uShadowDarkness,
                uGrassLightIntensity : this.uniforms.uGrassLightIntensity,
                uNoisescale : this.uniforms.uNoiseScale,
                uNoiseTexture : this.uniforms.noiseTexture,
                uGrassAlphaTexture : this.uniforms.grassAlphaTexture,
                fogColor2 : this.uniforms.fogColor2,
                fogColor3 : this.uniforms.fogColor3,
            }

            shader.vertexShader = `\\ fog
            #include <common>
            #include <fog_pars_vertex>
            
            //fog
            #include <>`
        }
    }
}