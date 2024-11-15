import MouseParallax from "./MouseParallax.js";
import PlaneParallax from "./PlaneParallax.js";
import ParallaxShaderProgram from "./Program.js";
import Shader from "./Shader.js";
import { Vector2 } from "./Vector.js";
import WebGLRenderer from "./WebGLRenderer.js";

const vert = `
    #version 300 es

    layout(location=0) in vec3 aPosition;
    layout(location=1) in vec2 aTexCoord;

    out vec2 vTexCoord;

    void main() {
        gl_Position = vec4(aPosition, 1);

        vTexCoord = aTexCoord;
    }
`;

const frag = `#version 300 es
    precision highp float;

    out vec4 fragColor;

    in vec2 vTexCoord;
    uniform sampler2D uTexture;
    uniform sampler2D uDepth;
    uniform vec2 mousePos;

    void main() {
       vec4 depth = texture(uDepth, vTexCoord);
       fragColor = texture(uTexture, vTexCoord + mousePos * depth.r);
    }
`;

const vertices = [
  [-1, -1, 0], //lb
  [-1, 1, 0], //lt
  [1, -1, 0], //rb
  [-1, 1, 0], //lt
  [1, 1, 0],
  [1, -1, 0], //rt //rb
];

const texCoord = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];

// const canvas = document.querySelector("#glCanvas");

// const wglRender = new WebGLRenderer(canvas);
// if (!wglRender) throw "WebGL Render cannot init";

// const glCtx = wglRender.getContext();
// if (!glCtx) throw "WebGL context is not init";

// const parallaxShaderProgram = new ParallaxShaderProgram(glCtx);
// parallaxShaderProgram.addShader([
//   new Shader(glCtx, glCtx.VERTEX_SHADER, vert),
//   new Shader(glCtx, glCtx.FRAGMENT_SHADER, frag),
// ]);
// const shaderProgram = parallaxShaderProgram.getProgram();

// const planeParallax = new PlaneParallax(glCtx, vertices, texCoord);
// planeParallax.setShaderProgram(shaderProgram);
// planeParallax.addSimpleTexture("./original.jpg");
// planeParallax.addDepthTexture("./depth.jpg");

// const mouseParallax = new MouseParallax(
//   new Vector2(canvas.clientWidth, canvas.clientHeight),
//   50
// );

// canvas.addEventListener("mousemove", (mouse) => {
//   const mousePosToShader = glCtx.getUniformLocation(shaderProgram, "mousePos");
//   let mousePos = mouseParallax.getPositionSerialized(mouse);
//   glCtx.uniform2f(mousePosToShader, mousePos.x, mousePos.y);
// });

// function mainLoop() {
//   wglRender.clear();

//   planeParallax.render();

//   requestAnimationFrame(mainLoop);
// }

// mainLoop();

class Effect {
  #glCtx;
  #parallaxShaderProgram;
  #shaderProgram;
  #mouseParallax;
  wglRender = null;
  planeParallax = null;

  constructor(elt) {
    let canvas = elt.shadowRoot.querySelector("canvas");
    let simpleTextureElt = elt.shadowRoot.querySelector("#simple-texture");
    let depthTextureElt = elt.shadowRoot.querySelector("#depth-texture");

    // let simpleTexturePath = elt.getAttribute("simpleTexture");
    // let depthTexturePath = elt.getAttribute("depthTexture");

    this.wglRender = new WebGLRenderer(canvas);
    if (!this.wglRender) throw "WebGL Render cannot init";

    this.#glCtx = this.wglRender.getContext();
    if (!this.#glCtx) throw "WebGL context is not init";

    this.#parallaxShaderProgram = new ParallaxShaderProgram(this.#glCtx);
    this.#parallaxShaderProgram.addShader([
      new Shader(this.#glCtx, this.#glCtx.VERTEX_SHADER, vert),
      new Shader(this.#glCtx, this.#glCtx.FRAGMENT_SHADER, frag),
    ]);
    this.#shaderProgram = this.#parallaxShaderProgram.getProgram();

    this.planeParallax = new PlaneParallax(this.#glCtx, vertices, texCoord);
    this.planeParallax.setShaderProgram(this.#shaderProgram);
    console.log(window);

    this.planeParallax.addSimpleTexture(simpleTextureElt);
    this.planeParallax.addDepthTexture(depthTextureElt);

    this.#mouseParallax = new MouseParallax(
      new Vector2(canvas.clientWidth, canvas.clientHeight),
      elt.getAttribute("moveDistance") ?? 50
    );

    canvas.addEventListener("mousemove", (mouse) => {
      const mousePosToShader = this.#glCtx.getUniformLocation(
        this.#shaderProgram,
        "mousePos"
      );
      let mousePos = this.#mouseParallax.getPosition(mouse);

      this.#glCtx.uniform2f(mousePosToShader, mousePos.x, mousePos.y);
    });
  }

  loop() {
    this.wglRender.clear();
    this.planeParallax.render();
  }
}

// function mainLoop() {
//   this.wglRender.clear();
//   this.planeParallax.render();

//   requestAnimationFrame(mainLoop);
// }

export { Effect };
