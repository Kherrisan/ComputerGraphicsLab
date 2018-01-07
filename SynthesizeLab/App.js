var TIMER_ID = -1;
var RENDER_RATE = 100;
var key_move = 0.1;
var now_point_id = -1;
var stopAnimate = true;
var changeAngle = 0;
var isFirst = true;

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

    //创建相机并绑定相机鼠标交互。
    camera = new Camera();
    camera.setLocation(0, 2, 10);
    camera.onChange = this.draw;
    interactor = new CameraInteractor(camera, canvas);

    //初始化各个着色器变量。
    aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    aVertexColor = gl.getAttribLocation(program, "aVertexColor");
    aVertexTextureCoords = gl.getAttribLocation(
      program,
      "aVertexTextureCoords"
    );
    uMVMatrix = gl.getUniformLocation(program, "uMVMatrix");
    uTMatrix = gl.getUniformLocation(program, "uTMatrix");
    uPMatrix = gl.getUniformLocation(program, "uPMatrix");
    uColor = gl.getUniformLocation(program, "uColor");
    uLightPosition = gl.getUniformLocation(program, "uLightPosition");
    aVertexNormal = gl.getAttribLocation(program, "aVertexNormal");
    uAmbientProduct = gl.getUniformLocation(program, "uAmbientProduct");
    uDiffuseProduct = gl.getUniformLocation(program, "uDiffuseProduct");
    uSpecularProduct = gl.getUniformLocation(program, "uSpecularProduct");
    uShininess = gl.getUniformLocation(program, "uShininess");
    uTexture_0_xiaohei = gl.getUniformLocation(program, "uTexture_0_xiaohei");
    uUseTexture = gl.getUniformLocation(program, "uUseTexture");
    aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");

    //向Scene中添加一个墙对象。
    Wall.build();
    Scene.addObject(Wall);

    //向Scene中添加一个线框地板对象。
    Floor.build(40, 20);
    Scene.addObject(Floor);

    //创建两只嘿咻对象，并添加到Scene对象中。
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

    //创建一只小黑对象，并添加到Scene对象中。
    Xiaohei.build();
    Scene.addObject(Xiaohei);

    //构造光源对象，并添加到Scene对象中。
    Light.build();
    Scene.addObject(Light);

    //设置按钮点击事件。
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
      isFirst = false;
    };
    document.getElementById("out").onclick = () => {
      camera.dollyout();
      isFirst = false;
    };
    document.getElementById("walk").onclick = () => {
        if(!isFirst){
            camera.azimuth = 0;
            camera.elevation = 0;
            camera.setLocation(vec3(0, 2, 10));
            now_point_id = -1;
            isFirst = true;
        }
        stopAnimate = false;
        animate();
    };
    document.getElementById("stop_move").onclick = () => {
        stopAnimate = true;
    }
    document.getElementById("down_look").onclick = () => {
        camera.setLocation(vec3(0, 15, 0));
        camera.azimuth = 0;
        camera.elevation = 0;
        camera.changeElevation(90);
        isFirst = false;
        stopAnimate = true;
    }
    document.getElementById("toward_look").onclick = () => {
        camera.azimuth = 0;
        camera.elevation = 0;
        camera.setLocation(vec3(0, 2, 10));
        isFirst = false;
        stopAnimate = true;
    }
    document.getElementById("left_look").onclick = () => {
        camera.setLocation(vec3(-10, 2, -3));
        camera.azimuth = 0;
        camera.elevation = 0;
        camera.changeAzimuth(90);
        isFirst = false;
        stopAnimate = true;
    }
    document.getElementById("right_look").onclick = () => {
        camera.setLocation(vec3(10, 2, -3));
        camera.azimuth = 0;
        camera.elevation = 0;
        camera.changeAzimuth(-90);
        isFirst = false;
        stopAnimate = true;
    }
    document.getElementById("back_look").onclick = () => {
        camera.elevation = 0;
        camera.azimuth = 0;
        camera.changeAzimuth(-180);
        camera.setLocation(vec3(0, 2, -15));
        isFirst = false;
        stopAnimate = true;
    }
    document.onkeydown = event => {
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
        // camera.changeAzimuth(-1);
        console.log("left");
        Light.lightLeft();
        this.draw();
      } else if (e && e.keyCode == 38) {
        // camera.changeElevation(-1);
        console.log("up");
        Light.lightUp();
        this.draw();
      } else if (e && e.keyCode == 39) {
        console.log("right");
        Light.lightRight();
        this.draw();
        // camera.changeAzimuth(+1);
      } else if (e && e.keyCode == 40) {
        // camera.changeElevation(+1);
        console.log("down");
        Light.lightDown();
        this.draw();
      } else if (e && e.keyCode == 188) {
        console.log("z++");
        Light.lightForward();
        this.draw();
      } else if (e && e.keyCode == 190) {
        console.log("z--");
        Light.lightBackward();
        this.draw();
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
    Xiaohei.updateTransformMatrix();
    Light.updateTransformMatrix();
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

  /**
   * 
   * @param {*} object 传递object的材质属性到uniform变量中，用于计算明暗。
   */
  this.updateLight = object => {
    if (object.materialAmbient) {
      var ambientProduct = mult(Light.lightAmbient, object.materialAmbient);
      var diffuseProduct = mult(Light.lightDiffuse, object.materialDiffuse);
      var specularProduct = mult(Light.lightSpecular, object.materialSpecular);

      gl.uniform4fv(uAmbientProduct, ambientProduct);
      gl.uniform4fv(uDiffuseProduct, diffuseProduct);
      gl.uniform4fv(uSpecularProduct, specularProduct);
      gl.uniform1f(uShininess, object.shininess);

      gl.uniform4fv(uLightPosition, vec4(Light.lightPosition, 1.0));
    } else {
      gl.uniform4fv(uAmbientProduct, vec4());
      gl.uniform4fv(uDiffuseProduct, vec4());
      gl.uniform4fv(uSpecularProduct, vec4());
      gl.uniform1f(uShininess, 100);
    }
  };

  /**
   * 根据camera的matrix更新整个场景的模型视图矩阵，并传递到uniform变量中。
   * 同时传递projection矩阵。
   */
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

  //
  this.draw = () => {
    gl.viewport(0, 0, viewportWidth, viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.clearColor(0, 0, 0, 1);

    this.updateMatrixUniforms();

    //遍历Scene对象中的每个需要绘制的对象。
    for (var i = 0; i < Scene.objects.length; i++) {
      var object = Scene.objects[i];

      //传递该对象的光照属性。
      this.updateLight(object);

      //传递一个布尔值到片元着色器中，这样便于在片元着色器中采取不同的行动。
      //如果useTexture为true，最后的颜色为明暗颜色*光照颜色。
      //如果为false，就直接采用光照颜色。
      if (!object.useTexture) {
        object.useTexture = false;
      }
      gl.uniform1i(uUseTexture, object.useTexture);

      //如果该对象定义了变换矩阵，则传递他的变换矩阵到unform变量中。
      if (object.transformMatrix) {
        gl.uniformMatrix4fv(uTMatrix, false, flatten(object.transformMatrix));
      } else {
        gl.uniformMatrix4fv(uTMatrix, false, flatten(mat4()));
      }

      //绑定纹理坐标的buffer到attribute变量。
      if (object.useTexture) {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.tbo);
        gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aTextureCoord);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, object.texture);
        gl.uniform1i(uTexture_0_xiaohei, 0);
      }

      //如果不是线框图，就传顶点法向量buffer。
      if (!object.wireframe) {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.nbo);
        gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexNormal);
      }

      //绑定顶点坐标buffer到attribute变量。
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

      gl.disableVertexAttribArray(aVertexNormal);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  };

  this.run = () => {
    this.load();
    this.initTransform();
    this.draw();
  };

  function animate(){
      var step = 0.1;
      if(now_point_id == -1){
          if(camera.position[2] > 5)
              camera.setLocation(vec3(
                                  camera.position[0],
                                  camera.position[1],
                                  camera.position[2] - step
                             ));
          else
              now_point_id = 0;
      }
      else{
          switch(now_point_id % 4){
              case 0:{
                  if(camera.position[0] < 8){
                      camera.setLocation(vec3(
                                              camera.position[0] + step,
                                              camera.position[1],
                                              camera.position[2]
                                              ));
                  }
                  else{
                      changeCameraAngle();
                  }
                  break;
              }
              case 1:{
                  if(camera.position[2] > -10){
                      camera.setLocation(vec3(
                                              camera.position[0],
                                              camera.position[1],
                                              camera.position[2] - step
                                              ));
                  }
                  else{
                      changeCameraAngle();
                  }
                  break;
              }
              case 2:{
                  if(camera.position[0] > -8){
                      camera.setLocation(vec3(
                                              camera.position[0] - step,
                                              camera.position[1],
                                              camera.position[2]
                                              ));
                  }
                  else{
                      changeCameraAngle();
                  }
                  break;
              }
              case 3:{
                  if(camera.position[2] < 5){
                      camera.setLocation(vec3(
                                              camera.position[0],
                                              camera.position[1],
                                              camera.position[2] + step
                                              ));
                  }
                  else{
                      changeCameraAngle();
                  }
                  break;
              }
          }
      }
      if(!stopAnimate)
          requestAnimationFrame(animate);
  }
    
  function changeCameraAngle(){
      var angle_step = 3;
      if(changeAngle < 90){
          changeAngle += angle_step;
          camera.changeAzimuth(-angle_step);
      }
      else{
          now_point_id++;
          changeAngle = 0;
      }
  }
}
