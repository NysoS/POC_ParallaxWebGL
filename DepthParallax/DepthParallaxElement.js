// import MouseParallax from "./MouseParallax.js";
// import PlaneParallax from "./PlaneParallax.js";
// import ParallaxShaderProgram from "./Program.js";
// import Shader from "./Shader.js";
// import { Vector2 } from "./Vector.js";
// import WebGLRenderer from "./WebGLRenderer.js";

export default class DepthParallaxElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let canvasWidth = this.getAttribute("width") ?? window.innerWidth;
    let canvasHeight = this.getAttribute("height") ?? window.innerHeight;

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create spans
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);

    const simpleTexture = document.createElement("img");
    simpleTexture.setAttribute("id", "simple-texture");
    simpleTexture.setAttribute("hidden", true);
    simpleTexture.src = this.getAttribute("simpleTexture");
    simpleTexture.setAttribute("crossOrigin", "anonymous");

    const depthTexture = document.createElement("img");
    depthTexture.setAttribute("id", "depth-texture");
    depthTexture.setAttribute("hidden", true);
    depthTexture.src = this.getAttribute("depthTexture");

    shadow.appendChild(canvas);
    shadow.appendChild(simpleTexture);
    shadow.appendChild(depthTexture);
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}
