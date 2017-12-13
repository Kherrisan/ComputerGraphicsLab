var TIMER_ID = -1;
var RENDER_RATE = 100;
var key_move = 0.1;

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
    aVertexTextureCoords = gl.getAttribLocation(
      program,
      "aVertexTextureCoords"
    );

    camera = new Camera();
    camera.setLocation(0, 2, 10);
    camera.onChange = this.draw;
    interactor = new CameraInteractor(camera, canvas);

    uMVMatrix = gl.getUniformLocation(program, "uMVMatrix");
    uTMatrix = gl.getUniformLocation(program, "uTMatrix");
    uPMatrix = gl.getUniformLocation(program, "uPMatrix");
    uPerVertexColor = gl.getUniformLocation(program, "uPerVertexColor");
    uColor = gl.getUniformLocation(program, "uColor");
    uUseTexture = gl.getUniformLocation(program, "uUseTexture");
    uSampler = gl.getUniformLocation(program, "uSampler");
    uLightPosition = gl.getUniformLocation(program, "uLightPosition");
    uNMatrix = gl.getUniformLocation(program, "uNMatrix");
    uWireframe = gl.getUniformLocation(program, "uWireframe");
    aVertexNormal = gl.getUniformLocation(program, "aVertexNormal");
    uAmbientProduct = gl.getUniformLocation(program, "uAmbientProduct");
    uDiffuseProduct = gl.getUniformLocation(program, "uDiffuseProduct");
    uSpecularProduct = gl.getUniformLocation(program, "uSpecularProduct");
    uShininess = gl.getUniformLocation(program, "uShininess");

    Floor.build(40, 20);
    Scene.addObject(Floor);

    heixiu = new Heixiu();
    heixiu2 = new Heixiu();
    heixiu.setLocation(3, 1, -3);
    heixiu2.setLocation(-3, 1, -3);
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
    document.onkeydown = function(event) {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      var dx =
        key_move *
        Math.cos(radians(-camera.elevation)) *
        Math.sin(radians(-camera.azimuth));
      var dz =
        key_move *
        Math.cos(radians(-camera.elevation)) *
        Math.cos(radians(-camera.azimuth));
      var dy = -key_move * Math.sin(radians(-camera.elevation));

      if (e && e.keyCode == 37) {
        camera.changeAzimuth(-1);
      } else if (e && e.keyCode == 38) {
        camera.changeElevation(-1);
      } else if (e && e.keyCode == 39) {
        camera.changeAzimuth(+1);
      } else if (e && e.keyCode == 40) {
        camera.changeElevation(+1);
      } else if (e && e.keyCode == 87) {
        camera.setLocation(
          vec3(
            camera.position[0] - dx,
            camera.position[1] - dy,
            camera.position[2] - dz
          )
        );
      } else if (e && e.keyCode == 83) {
        camera.setLocation(
          vec3(
            camera.position[0] + dx,
            camera.position[1] + dy,
            camera.position[2] + dz
          )
        );
      }
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

  this.updateLight = object => {
    if (object.materialAmbient) {
      var ambientProduct = mult(Light.lightAmbient, object.materialAmbient);
      var diffuseProduct = mult(Light.lightDiffuse, object.materialDiffuse);
      var specularProduct = mult(Light.lightSpecular, object.materialSpecular);

      gl.uniform4fv(uAmbientProduct, ambientProduct);
      gl.uniform4fv(uDiffuseProduct, diffuseProduct);
      gl.uniform4fv(uSpecularProduct, specularProduct);
      gl.uniform1f(uShininess, object.shininess);

      gl.uniform4fv(uLightPosition, Light.lightPosition);
    } else {
      gl.uniform4fv(uAmbientProduct, vec4());
      gl.uniform4fv(uDiffuseProduct, vec4());
      gl.uniform4fv(uSpecularProduct, vec4());
      gl.uniform1f(uShininess, 100);
    }
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

    var modelViewMatrix = camera.getViewTransform();
    normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(uNMatrix, false, flatten(normalMatrix));
  };

  this.draw = () => {
    gl.viewport(0, 0, viewportWidth, viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.clearColor(0, 0, 0, 1);

    this.updateMatrixUniforms();

    for (var i = 0; i < Scene.objects.length; i++) {
      var object = Scene.objects[i];

      //传递该对象的光照属性。
      this.updateLight(object);

      if (!object.perVertexColor) {
        object.perVertexColor = false;
      }
      if (!object.wireframe) {
        object.wireframe = false;
      }
      if (!object.useTexture) {
        object.useTexture = false;
      }

      gl.uniform1i(uWireframe, object.wireframe);
      gl.uniform1i(uPerVertexColor, object.perVertexColor);
      gl.uniform1i(uUseTexture, object.useTexture);

      //如果该对象定义了变换矩阵，则进行变换。
      if (object.transformMatrix) {
        gl.uniformMatrix4fv(uTMatrix, false, flatten(object.transformMatrix));
      } else {
        gl.uniformMatrix4fv(uTMatrix, false, flatten(mat4()));
      }

      if (object.perVertexColor) {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.cbo);
        gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexColor);
      } else {
        gl.uniform4fv(uColor, object.color);
      }

      //如果不是线框图，就传顶点法向量buffer。
      if (!object.wireframe) {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.nbo);
        gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexNormal);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, object.vbo);
      gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexPosition);

      if (object.ibo) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);
        if (object.wireframe) {
          //如果是相框图，LINES。
          gl.drawElements(gl.LINES, object.indicesNum, gl.UNSIGNED_SHORT, 0);
        } else {
          //如果不是线框图，TRIANGLES。
          gl.drawElements(
            gl.TRIANGLES,
            object.indicesNum,
            gl.UNSIGNED_SHORT,
            0
          );
        }
      } else {
        //没有ibo，根据vbo，drawArrays
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
