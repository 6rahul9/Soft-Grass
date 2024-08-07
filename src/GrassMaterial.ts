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
            #include <shadowmap_pars_vertex>
            uniform sampler2D uNoiseTexture
            uniform fload uNioseScale
            uniform float UTime
            
            varying vec3 vColor
            varying vec2 vGlobal UV
            varying vec2 vUv
            varying vec3 vNormal
            varying vec3 vViewPosition
            varying vec2 vWindColor
            void main(){
            #include <color_vertex>
            
            //fog
            #include <begin_vertex>
            #include <project_vertex>
            #include <fog_vertex>

            //fog

            //shadow
            #include <beginnormal_vertex>            
            #include <defaultnormal_vertex>            
            #include <worldpos_vertex>            
            #include <shadowmap_vertex>            
            //shadow

            //wind effect
            
            vec2 uWindDirection = vec2 (1.0, 1.0)
            float uWindAmp = 0.1
            fload uWindFreq = 50.0;
            fload uSpeed = 1.0
            float uNoiseFactor = 5.50
            float uNoiseSpeed = 0.001;

            vec2 windDirection = normalize(uWindDirection); //Normlaize
            the wind direction
            vec4 modelPosition =nodelmatrix * instacnceMatrix * vec4 (position, 1.0)

            float terrainSize = 100;
            vGlobalUV = (terrainSize - vec2(modelPositon.xz))/ terrainSize;

            vec4 noise = texure2D(uNioseTexture, vGlobalUV + uTime * uNoiseSpeeed)

            float sinWave = sin(uWindFreq * dot (windDirection, vGlobalUV) + noise.g * uNoiseFactor + uTime * uSpeed) * uWindAmp * (1.-uv.y);

            float xDisp = sinWave;
            float zDisp = sinWave;
            modelPositio.x += xDisp
            modelPositio.z += zDisp

            //Use Perlinenoise to vary  the terrain height of the grass

            modelPosition.y += exp(texture2D(uNoisetexture, vGlobalUV * uNoiseScale).r) * 0.5 * (1.-uv.y)

            vec4 viewPosition = viewMatrix * modelPosition
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition


            //assign varying

            vUv = vec2(uv.x,1.-uv.y)
            vNormal = normalize (normalMatrix * normal )
            vWindColor = vec2(xDisp, zDisp)
            vViewPosition = mvPosition.xyz;
        }`;

        shader.fragmentShader = `
        #include <alphatest_pars_fragment>
        #include <alphamap_pars_fragment>
        
        
        //fog
        #include <fog_pars_fragment>
        //fog

        #include <common>
        #include <packing>
        #include <lights_pars_begin>
        #include <shadow_pars_fragment>
        #include <shadowmask_pars_fragment>
        
        uniform float uTime
        uniform vec3 uBaseColor
        uniform vec3 uTipColor1
        uniform vec3 uTipColor2
        uniform sampler2D uGrassAlphaTexture
        uniform sampler2D uNoiseTexture
        uniform float uNoiseScale
        uniform float uEnableshadows
        
        uniform float uGrassLightIntensity
        uniform float uShadowDarkness
        uniform float uDayTime
        varying vec3 vColor

        varying vec2 vUv
        varying vec2 vGlobalUV
        varying vec2 vNormal
        varying vec2 vViewPosition
        varying vec2 vWindColor

        void main (){
            vec4 grassAlpha = texture2D(uGrassAlphaTexture, vUv)
            
            vec4 grassVariation = texture2D(uNoiseTexture, vGlobalUV * uNoiseScale)

            vec3 tipColor = mix(uTipColor1, uTipColor2, grassVariation.r)

            vec4 diffuseColor = vec4(mix(uBaseColor, tipColor,vUv.y), step (0.1, grassAlpha.r));

            vec3 grassFinalColor = diffuseColor.rgb * uGrassLightIntensity;

            //light calculated drive from <lights_fragment_begin>

            vec3 geometryPosition = vViewPosition 
            vec3 geometryNormal = vNormal
            vec3 geometryViewDir = (isOrthographic) ? vec3(0,0,1) : normalize (vViewPosition);

            vec3 geometryClearcoatNormal
            IncidentLight directLight
            float Shadow = 0.0;
            float currentShadow = 0.0;
            float NdotL 
            
        }
        `
        }
    }
}