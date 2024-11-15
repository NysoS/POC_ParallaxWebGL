export default class PlaneParallax {
  #vertices = [];
  #uvCoord = [];
  #glCtx = null;

  #shaderProgram = null;

  #simpleTexture = null;
  #depthTexture = null;

  constructor(glCtx, vertices, uvCoord) {
    this.#vertices = vertices;
    this.#uvCoord = uvCoord;
    this.#glCtx = glCtx;

    this.#glCtx.bindBuffer(
      this.#glCtx.ARRAY_BUFFER,
      this.#glCtx.createBuffer()
    );
    this.#glCtx.bufferData(
      this.#glCtx.ARRAY_BUFFER,
      new Float32Array(this.#vertices.flat()),
      this.#glCtx.STATIC_DRAW
    );

    this.#glCtx.vertexAttribPointer(0, 3, this.#glCtx.FLOAT, false, 0, 0);
    this.#glCtx.enableVertexAttribArray(0);

    this.#glCtx.bindBuffer(
      this.#glCtx.ARRAY_BUFFER,
      this.#glCtx.createBuffer()
    );
    this.#glCtx.bufferData(
      this.#glCtx.ARRAY_BUFFER,
      new Float32Array(this.#uvCoord.flat()),
      this.#glCtx.STATIC_DRAW
    );

    this.#glCtx.vertexAttribPointer(1, 2, this.#glCtx.FLOAT, false, 0, 0);
    this.#glCtx.enableVertexAttribArray(1);
  }

  setShaderProgram(program) {
    this.#shaderProgram = program;

    this.#glCtx.useProgram(this.#shaderProgram);
  }

  addSimpleTexture(texturePath) {
    this.#simpleTexture = this.#createTexture(texturePath);
    this.#glCtx.uniform1i(
      this.#glCtx.getUniformLocation(this.#shaderProgram, "uTexture"),
      0
    );
  }

  addDepthTexture(texturePath) {
    this.#depthTexture = this.#createTexture(texturePath);
    this.#glCtx.uniform1i(
      this.#glCtx.getUniformLocation(this.#shaderProgram, "uDepth"),
      1
    );
  }

  render() {
    this.#glCtx.activeTexture(this.#glCtx.TEXTURE0);
    this.#glCtx.bindTexture(this.#glCtx.TEXTURE_2D, this.#simpleTexture);

    this.#glCtx.activeTexture(this.#glCtx.TEXTURE1);
    this.#glCtx.bindTexture(this.#glCtx.TEXTURE_2D, this.#depthTexture);

    this.#glCtx.drawArrays(this.#glCtx.TRIANGLES, 0, 6);
  }

  #createTexture(elt) {
    // let image = new Image(80, 80);
    // image.src = texturePath;
    // console.log(image);

    let texture = this.#glCtx.createTexture();

    this.#glCtx.bindTexture(this.#glCtx.TEXTURE_2D, texture);
    this.#glCtx.texParameteri(
      this.#glCtx.TEXTURE_2D,
      this.#glCtx.TEXTURE_WRAP_S,
      this.#glCtx.CLAMP_TO_EDGE
    );
    this.#glCtx.texParameteri(
      this.#glCtx.TEXTURE_2D,
      this.#glCtx.TEXTURE_WRAP_T,
      this.#glCtx.CLAMP_TO_EDGE
    );
    this.#glCtx.texParameteri(
      this.#glCtx.TEXTURE_2D,
      this.#glCtx.TEXTURE_MIN_FILTER,
      this.#glCtx.LINEAR
    );
    this.#glCtx.texParameteri(
      this.#glCtx.TEXTURE_2D,
      this.#glCtx.TEXTURE_MAG_FILTER,
      this.#glCtx.LINEAR
    );

    this.#glCtx.texImage2D(
      this.#glCtx.TEXTURE_2D,
      0,
      this.#glCtx.RGBA,
      this.#glCtx.RGBA,
      this.#glCtx.UNSIGNED_BYTE,
      elt
    );

    return texture;
  }
}
