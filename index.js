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
        //fragColor = vec4(0.3, 0.4, 0.9, 1);
       fragColor = texture(uTexture, mousePos * vTexCoord);
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

canvasInit();

function createShader(gl, shaderType, shaderSource) {
  let shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource.trim());
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  return shader;
}

function createProgram(gl, shadersToAttach) {
  let program = gl.createProgram();

  shadersToAttach.forEach((shader) => {
    gl.attachShader(program, shader);
  });
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  //gl.useProgram(program);

  return program;
}

function canvasInit() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl2");
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  if (!gl) {
    console.error(
      "Cannot initialize WebGl. Your browser can't not supported yet"
    );
    return;
  }

  canvas.addEventListener("mousemove", (mouse) => {
    const mousePos = gl.getUniformLocation(program, "mousePos");
    gl.uniform2f(mousePos, mouse.x, mouse.y);
  });

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
  const program = createProgram(gl, [vertexShader, fragmentShader]);

  const vertexData = new Float32Array(vertices.flat());
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  //   const indexBuffer = gl.createBuffer();
  //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  //   gl.bufferData(
  //     gl.ELEMENT_ARRAY_BUFFER,
  //     new Uint32Array(indices),
  //     gl.STATIC_DRAW
  //   );

  //const vertexPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(texCoord.flat()),
    gl.STATIC_DRAW
  );
  const textCoordLocation = gl.getAttribLocation(program, "aTexCoord");
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);

  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //gl.generateMipmap(gl.TEXTURE_2D);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    document.getElementById("image")
  );
  gl.bindTexture(gl.TEXTURE_2D, null);

  // var depthTexture = gl.createTexture();
  // gl.bindTexture(GL_TEXTURE_2D, depthTexture);
  // gl.texImage2D(
  //   gl.TEXTURE_2D,
  //   0,
  //   gl.RGBA,
  //   gl.RGBA,
  //   gl.UNSIGNED_BYTE,
  //   document.getElementById("image-depth")
  // );
  // gl.bindTexture(gl.TEXTURE_2D, null);

  gl.useProgram(program);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.activeTexture(gl.TEXTURE0);

  // gl.activeTexture(gl.TEXTURE1);
  // gl.bindTexture(GL_TEXTURE_2D, depthTexture);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  //gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
}
