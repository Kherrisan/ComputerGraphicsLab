var Cubed = {
  directDraw: true,
  //变换
  Changable: true,
  // CurModelViewMatrix: mat4(), //当前变换矩阵
  translateStep: 0.2, //平移步长
  translateX: 4, //立方体x平移量
  translateY: 8, //立方体y平移量
  translateZ: -4, //立方体z平移量
  size: 1,
  RotateAngle: 0, //立方体旋转角度
  //like floor
  wireframe: false,
  color: [0, 0, 0, 1],
  perVertexColor: false,
  draw: function() {
    Cubed.updateTransformMatrix();
    var shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec3(
        Cubed.size * 0.5,
        Cubed.size * 0.4,
        Cubed.size * 0.4
      ), //5:2:2
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      color: vec4(0, 0, 0, 1)
    };
    draw_ellipsoid(shape_data, Cubed.tMatrix); //draw the body.
  },
  //MAVMatrix这个矩阵会同时影响到floor和Cube的转换
  updateTransformMatrix: function() {
    var RE = scalem(Cubed.size, Cubed.size, Cubed.size);
    var T = translate(Cubed.translateX, 0.0, Cubed.translateZ);
    var R = rotateY(Cubed.RotateAngle);
    Cubed.tMatrix = mult(T, mult(R, RE));
  },
  rotateRight: function() {
    Cubed.RotateAngle += 5;
    Cubed.updateTransformMatrix();
  },
  rotateLeft: function() {
    Cubed.RotateAngle -= 5;
    Cubed.updateTransformMatrix();
  },
  walkForward: function() {
    Cubed.translateX +=
      Cubed.translateStep * -1 * Math.sin(radians(Cubed.RotateAngle));
    Cubed.translateZ +=
      Cubed.translateStep * Math.cos(radians(Cubed.RotateAngle));
    Cubed.updateTransformMatrix();
  },
  walkBackward: function() {
    Cubed.translateX +=
      Cubed.translateStep * Math.sin(radians(Cubed.RotateAngle));
    Cubed.translateZ +=
      Cubed.translateStep * -1 * Math.cos(radians(Cubed.RotateAngle));
    Cubed.updateTransformMatrix();
  },
  shrink: function() {
    Cubed.size -= 0.5;
    Cubed.updateTransformMatrix();
  },
  expand: function() {
    Cubed.size += 0.5;
    Cubed.updateTransformMatrix();
  }
};
