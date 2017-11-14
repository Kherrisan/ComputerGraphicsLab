var Cube = {
  //变换
  Changable: true,
  // CurModelViewMatrix: mat4(), //当前变换矩阵
  translateStep: 0.2, //平移步长
  translateX: 0, //立方体x平移量
  translateY: 0, //立方体y平移量
  translateZ: 0, //立方体z平移量
  size: 1,
  RotateAngle: 0, //立方体旋转角度
  //like floor
  vertices: [], //立方体顶点数---36
  indices: [], //索引数---36
  wireframe: false,
  color: [0.5, 0.5, 0.5, 1],
  perVertexColor: false,
  build: function() {
    //立方体相关数组，直接设置
    var numVertices = [
      -0.5,
      -0.5,
      0.5,
      -0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      -0.5,
      0.5,
      -0.5,
      -0.5,
      -0.5,
      -0.5,
      0.5,
      -0.5,
      0.5,
      0.5,
      -0.5,
      0.5,
      -0.5,
      -0.5
    ];
    var numIndices = [
      1,
      0,
      3,
      3,
      2,
      1,
      2,
      3,
      7,
      7,
      6,
      2,
      3,
      0,
      4,
      4,
      7,
      3,
      6,
      5,
      1,
      1,
      2,
      6,
      4,
      5,
      6,
      6,
      7,
      4,
      5,
      4,
      0,
      0,
      1,
      5
    ];
    Cube.vertices = numVertices;
    Cube.indices = numIndices;
  },
  //MAVMatrix这个矩阵会同时影响到floor和Cube的转换
  updateTransformMatrix: function() {
    var RE = scalem(Cube.size, Cube.size, Cube.size);
    var T = translate(Cube.translateX, 0.0, Cube.translateZ);
    var R = rotateY(Cube.RotateAngle);
    Cube.tMatrix = mult(T, mult(R, RE));
  },
  rotateRight: function() {
    Cube.RotateAngle += 5;
    Cube.updateTransformMatrix();
  },
  rotateLeft: function() {
    Cube.RotateAngle -= 5;
    Cube.updateTransformMatrix();
  },
  walkForward: function() {
    Cube.translateX +=
      Cube.translateStep * -1 * Math.sin(radians(Cube.RotateAngle));
    Cube.translateZ += Cube.translateStep * Math.cos(radians(Cube.RotateAngle));
    Cube.updateTransformMatrix();
  },
  walkBackward: function() {
    Cube.translateX += Cube.translateStep * Math.sin(radians(Cube.RotateAngle));
    Cube.translateZ +=
      Cube.translateStep * -1 * Math.cos(radians(Cube.RotateAngle));
    Cube.updateTransformMatrix();
  },
  shrink: function() {
    Cube.size -= 0.5;
    Cube.updateTransformMatrix();
  },
  expand: function() {
    Cube.size += 0.5;
    Cube.updateTransformMatrix();
  }
};
