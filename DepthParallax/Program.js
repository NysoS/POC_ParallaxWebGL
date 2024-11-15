export default class ParallaxShaderProgram {
  #glCtx = null;
  #shaders = [];
  #program = null;

  constructor(glCtx) {
    this.#glCtx = glCtx;
  }

  addShader(shaders) {
    this.#shaders = [...this.#shaders, ...shaders];
  }

  getProgram() {
    this.#program = this.#glCtx.createProgram();
    this.#shaders.forEach((shader) => {
      this.#glCtx.attachShader(this.#program, shader.get());
    });

    this.#glCtx.linkProgram(this.#program);
    if (
      !this.#glCtx.getProgramParameter(this.#program, this.#glCtx.LINK_STATUS)
    ) {
      throw this.#glCtx.getProgramInfoLog(this.#program);
    }

    return this.#program;
  }
}
