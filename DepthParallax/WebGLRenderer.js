export default class WebGLRenderer {
  #canvas = null;
  #glCtx = null;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#glCtx = this.#canvas.getContext("webgl2");

    this.#glCtx.pixelStorei(this.#glCtx.UNPACK_FLIP_Y_WEBGL, true);

    if (!this.#glCtx) {
      console.error(
        "Cannot initialize WebGl. Your browser can't not supported yet"
      );
      return;
    }
  }

  getContext() {
    return this.#glCtx ?? null;
  }

  clear() {
    this.#glCtx.clearColor(0.0, 0.0, 0.0, 1.0);
    this.#glCtx.clear(
      this.#glCtx.COLOR_BUFFER_BIT | this.#glCtx.DEPTH_BUFFER_BIT
    );
  }
}
