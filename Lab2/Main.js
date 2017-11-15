var gl = null;
var app = null;
var modelViewMatrix = mat4();
var perspectiveMatrix = mat4();
var program = null;
var camera = null;
var interactor = null;
var viewportWidth = 0;
var viewportHeight = 0;
var scene = null;

var uMVMatrix = null;
var uTMatrix = null;
var uPMatrix = null;
var aVertexColor = null;
var aVertexPosition = null;
var uPerVertexColor = null;
var uColor = null;

window.onload = main;

function main() {
  app = new App();
  app.loadHook = load;
  app.drawHook = draw;
  app.run();
}

function draw() {
  gl.viewport(0, 0, viewportWidth, viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.clearColor(0, 0, 0, 1);

  updateMatrixUniforms();

  for (var i = 0; i < Scene.objects.length; i++) {
    var object = Scene.objects[i];

    gl.uniform1i(uPerVertexColor, object.perVertexColor);

    if (object.directDraw) {
      object.draw();
      continue;
    }

    gl.uniform4fv(uColor, object.color);

    gl.disableVertexAttribArray(aVertexColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vbo);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);

    if (object.tMatrix) {
      gl.uniformMatrix4fv(uTMatrix, false, flatten(object.tMatrix));
    } else {
      gl.uniformMatrix4fv(uTMatrix, false, flatten(mat4()));
    }

    if (object.perVertexColor) {
      gl.bindBuffer(gl.ARRAY_BUFFER, object.cbo);
      gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexColor);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);

    if (object.wireframe) {
      gl.drawElements(gl.LINES, object.indices.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawElements(
        gl.TRIANGLES,
        object.indices.length,
        gl.UNSIGNED_SHORT,
        0
      );
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}

function load() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.clearColor(0.3, 0.3, 0.3, 1.0);
  gl.clearDepth(100.0);
  gl.viewport(0, 0, canvas.width, canvas.height);
  viewportHeight = canvas.height;
  viewportWidth = canvas.width;
  gl.enable(gl.DEPTH_TEST);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  aVertexColor = gl.getAttribLocation(program, "aVertexColor");

  camera = new Camera();
  camera.setLocation(0, 2, 10);
  camera.onChange = draw;
  interactor = new CameraInteractor(camera, canvas);

  uMVMatrix = gl.getUniformLocation(program, "uMVMatrix");
  uTMatrix = gl.getUniformLocation(program, "uTMatrix");
  uPMatrix = gl.getUniformLocation(program, "uPMatrix");
  uPerVertexColor = gl.getUniformLocation(program, "uPerVertexColor");
  uColor = gl.getUniformLocation(program, "uColor");

  Floor.build(40, 20);
  Scene.addObject(Floor);
  // Cube.build();
  // Scene.addObject(Cube);
  // Scene.addObject(Cubed);
  Scene.addObject(Heixiu);

  document.getElementById("RotateLeft").onclick = function() {
    Cube.rotateLeft();
    draw();
  };
  document.getElementById("RotateRight").onclick = function() {
    Cube.rotateRight();
    draw();
  };
  document.getElementById("Forward").onclick = function() {
    Cube.walkForward();
    draw();
  };
  document.getElementById("Backward").onclick = function() {
    Cube.walkBackward();
    draw();
  };
  document.getElementById("Shrink").onclick = function() {
    Cube.shrink();
    draw();
  };
  document.getElementById("Expand").onclick = function() {
    Cube.expand();
    draw();
  };
  document.getElementById("RotateLeftd").onclick = function() {
    Cubed.rotateLeft();
    draw();
  };
  document.getElementById("RotateRightd").onclick = function() {
    Cubed.rotateRight();
    draw();
  };
  document.getElementById("Forwardd").onclick = function() {
    Cubed.walkForward();
    draw();
  };
  document.getElementById("Backwardd").onclick = function() {
    Cubed.walkBackward();
    draw();
  };
  document.getElementById("Shrinkd").onclick = function() {
    Cubed.shrink();
    draw();
  };
  document.getElementById("Expandd").onclick = function() {
    Cubed.expand();
    draw();
  };
  document.getElementById("in").onclick = function() {
    camera.dollyin();
    draw();
  };
  document.getElementById("out").onclick = function() {
    camera.dollyout();
    draw();
  };
}

function initTransform() {
  modelViewMatrix = camera.getViewTransform();
  perspectiveMatrix = perspective(50, viewportWidth / viewportHeight, 1, 1000);
}

function updateMatrixUniforms() {
  perspectiveMatrix = perspective(
    50,
    viewportWidth / viewportHeight,
    1,
    1000.0
  );
  gl.uniformMatrix4fv(uMVMatrix, false, flatten(camera.getViewTransform()));
  gl.uniformMatrix4fv(uPMatrix, false, flatten(perspectiveMatrix));
}
