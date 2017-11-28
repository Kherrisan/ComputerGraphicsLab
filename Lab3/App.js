var TIMER_ID = -1;
var RENDER_RATE = 100;

function App(ch, lh, dh) {
  this.load = () => {
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
    camera.onChange = this.draw;
    interactor = new CameraInteractor(camera, canvas);

    uMVMatrix = gl.getUniformLocation(program, "uMVMatrix");
    uTMatrix = gl.getUniformLocation(program, "uTMatrix");
    uPMatrix = gl.getUniformLocation(program, "uPMatrix");
    uPerVertexColor = gl.getUniformLocation(program, "uPerVertexColor");
    uColor = gl.getUniformLocation(program, "uColor");

    Floor.build(40, 20);
    Scene.addObject(Floor);

    heixiu = new Heixiu();
    heixiu2 = new Heixiu();
    heixiu.setLocation(3, 1, -3);
    heixiu2.setLocation(-3,1, -3);
    heixiu.onChange = this.draw;
    heixiu2.onChange = this.draw;
    heixiu.build();
    heixiu2.build();
    Scene.addObject(heixiu);
    Scene.addObject(heixiu2);

    Xiaohei.build();
    Scene.addObject(Xiaohei);

    document.getElementById("RotateLeft").onclick = () => {
      Xiaohei.rotateLeft();
    };
    document.getElementById("RotateRight").onclick = () => {
      Xiaohei.rotateRight();
    };
    document.getElementById("Forward").onclick = () => {
      Xiaohei.walkForward();
    };
    document.getElementById("Backward").onclick = () => {
      Xiaohei.walkBackward();
    };
    document.getElementById("Shrink").onclick = () => {
      Xiaohei.shrink();
    };
    document.getElementById("Expand").onclick = () => {
      Xiaohei.expand();
    };
    document.getElementById("RotateLeft1").onclick = () => {
      heixiu.rotateLeft();
    };
    document.getElementById("RotateRight1").onclick = () => {
      heixiu.rotateRight();
    };
    document.getElementById("Forward1").onclick = () => {
      heixiu.walkForward();
    };
    document.getElementById("Backward1").onclick = () => {
      heixiu.walkBackward();
    };
    document.getElementById("Shrink1").onclick = () => {
      heixiu.shrink();
    };
    document.getElementById("Expand1").onclick = () => {
      heixiu.expand();
    };
    document.getElementById("RotateLeft2").onclick = () => {
      heixiu2.rotateLeft();
    };
    document.getElementById("RotateRight2").onclick = () => {
      heixiu2.rotateRight();
    };
    document.getElementById("Forward2").onclick = () => {
      heixiu2.walkForward();
    };
    document.getElementById("Backward2").onclick = () => {
      heixiu2.walkBackward();
    };
    document.getElementById("Shrink2").onclick = () => {
      heixiu2.shrink();
    };
    document.getElementById("Expand2").onclick = () => {
      heixiu2.expand();
    };
    document.getElementById("in").onclick = () => {
      camera.dollyin();
    };
    document.getElementById("out").onclick = () => {
      camera.dollyout();
    };
  };

  this.initTransform = () => {
    modelViewMatrix = camera.getViewTransform();
    perspectiveMatrix = perspective(
      50,
      viewportWidth / viewportHeight,
      1,
      1000
    );
  };

  this.updateMatrixUniforms = () => {
    perspectiveMatrix = perspective(
      50,
      viewportWidth / viewportHeight,
      1,
      1000.0
    );
    gl.uniformMatrix4fv(uMVMatrix, false, flatten(camera.getViewTransform()));
    gl.uniformMatrix4fv(uPMatrix, false, flatten(perspectiveMatrix));
  };

  this.draw = () => {
    gl.viewport(0, 0, viewportWidth, viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.clearColor(0, 0, 0, 1);

    this.updateMatrixUniforms();

    for (var i = 0; i < Scene.objects.length; i++) {
      var object = Scene.objects[i];

      if (object.perVertexColor) {
        gl.uniform1i(uPerVertexColor, object.perVertexColor);
      } else {
        gl.uniform1i(uPerVertexColor, false);
        gl.uniform4fv(uColor, object.color);
      }

      gl.disableVertexAttribArray(aVertexColor);

      gl.bindBuffer(gl.ARRAY_BUFFER, object.vbo);
      gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexPosition);

      if (object.transformMatrix) {
        gl.uniformMatrix4fv(uTMatrix, false, flatten(object.transformMatrix));
      } else {
        gl.uniformMatrix4fv(uTMatrix, false, flatten(mat4()));
      }

      if (object.perVertexColor) {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.cbo);
        gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexColor);
      }

      if (object.ibo) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);
        if (object.wireframe) {
          gl.drawElements(gl.LINES, object.indicesNum, gl.UNSIGNED_SHORT, 0);
        } else {
          gl.drawElements(
            gl.TRIANGLES,
            object.indicesNum,
            gl.UNSIGNED_SHORT,
            0
          );
        }
      } else {
        gl.drawArrays(gl.TRIANGLES, 0, object.vertexNum);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  };

  this.run = () => {
    this.load();
    this.initTransform();
    this.draw();
  };
}