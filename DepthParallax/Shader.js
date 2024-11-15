export default class Shader {
  #shader = null;
  constructor(glCtx, shaderType, filename) {
    let shader = glCtx.createShader(shaderType);

    glCtx.shaderSource(shader, filename.trim());
    glCtx.compileShader(shader);
    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
      throw glCtx.getShaderInfoLog(shader);
    }

    this.#shader = shader;
  }

  get() {
    return this.#shader;
  }
}
