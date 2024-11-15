import DepthParallaxElement from "./DepthParallaxElement.js";
import MouseParallax from "./MouseParallax.js";
import PlaneParallax from "./PlaneParallax.js";
import ParallaxShaderProgram from "./Program.js";
import Shader from "./Shader.js";
import { Vector2 } from "./Vector.js";
import WebGLRenderer from "./WebGLRenderer.js";

customElements.define("depth-parallax", DepthParallaxElement);

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

const canvasElt = document.getElementById("depth-parallax-canvas");
document.body.onload = (e) => {
  console.log("d", e);

  let canvas = canvasElt.shadowRoot.querySelector("canvas");
  let simpleTextureElt = canvasElt.shadowRoot.querySelector("#simple-texture");
  let depthTextureElt = canvasElt.shadowRoot.querySelector("#depth-texture");

  let simpleTexturePath = canvasElt.getAttribute("simpleTexture");
  let depthTexturePath = canvasElt.getAttribute("depthTexture");

  const wglRender = new WebGLRenderer(canvas);
  if (!wglRender) throw "WebGL Render cannot init";

  const glCtx = wglRender.getContext();
  if (!glCtx) throw "WebGL context is not init";

  const parallaxShaderProgram = new ParallaxShaderProgram(glCtx);
  parallaxShaderProgram.addShader([
    new Shader(glCtx, glCtx.VERTEX_SHADER, vert),
    new Shader(glCtx, glCtx.FRAGMENT_SHADER, frag),
  ]);
  const shaderProgram = parallaxShaderProgram.getProgram();

  const planeParallax = new PlaneParallax(glCtx, vertices, texCoord);
  planeParallax.setShaderProgram(shaderProgram);

  planeParallax.addSimpleTexture(simpleTextureElt);
  planeParallax.addDepthTexture(depthTextureElt);

  const mouseParallax = new MouseParallax(
    new Vector2(canvas.clientWidth, canvas.clientHeight),
    canvasElt.getAttribute("moveDistance") ?? 50
  );

  canvas.addEventListener("mousemove", (mouse) => {
    const mousePosToShader = glCtx.getUniformLocation(
      shaderProgram,
      "mousePos"
    );
    let mousePos = mouseParallax.getPositionSerialized(mouse);

    glCtx.uniform2f(mousePosToShader, mousePos.x, mousePos.y);
  });

  function loop() {
    wglRender.clear();
    planeParallax.render();

    requestAnimationFrame(loop);
  }
  loop();
};
