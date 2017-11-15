var Xiaohei = {
  directDraw: true,
  //变换
  Changable: true,
  // CurModelViewMatrix: mat4(), //当前变换矩阵
  FORWARD_STEP: 0.2, //平移步长
  ROTATE_STEP: 5,
  RotateAngle: 0, //立方体旋转角度
  RESIZE_STEP: 0.1, //放缩幅度
  //like floor
  position: vec3(0, 1.8, 0), //the location of the center point of this animal.
  size: 0.5,
  wireframe: false,
  perVertexColor: true,
  draw: function() {
    //head
    var shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec3(
        Xiaohei.size * 5, //脸宽
        Xiaohei.size * 4,
        Xiaohei.size * 4
      ), //5:2:2
      height: 0,
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      position_matrix: vec4(),
      color: vec4(0, 0, 0, 1)
    };
    var tMatrix = Xiaohei.generateTransformMatrix();
    var headMatrix = translate(0, 0, 0);
    draw_ellipsoid(shape_data, mult(Xiaohei.tMatrix, headMatrix)); //draw the head.
    //body
    shape_data.axis_length = vec3(
      Xiaohei.size * 2,
      Xiaohei.size * 4, //身长
      Xiaohei.size * 2
    );
    var bodyMatrix = translate(0, -Xiaohei.size * 3.5, -Xiaohei.size * 4.5);
    draw_ellipsoid(shape_data, mult(Xiaohei.tMatrix, bodyMatrix)); //draw the body.
    var leftEarMatrix = translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0);
    shape_data.axis_length = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    //left ear top point
    shape_data.angle_range_vertical = vec3(
      -Xiaohei.size * 6.4,
      +Xiaohei.size * 4,
      0
    );

    shape_data.angle_range_horizontal = vec2(0, 360);
    draw_taper(shape_data, mult(Xiaohei.tMatrix, leftEarMatrix)); //draw left ear.
    var rightEarMatrix = translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0);
    shape_data.axis_length = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    //right ear top point
    shape_data.angle_range_vertical = vec3(
      Xiaohei.size * 6.4,
      Xiaohei.size * 4,
      0
    );
    draw_taper(shape_data, mult(Xiaohei.tMatrix, rightEarMatrix)); //draw right ear.
    //left hand

    var leftHandMatrix = mult(
      mult(rotateZ(15), rotateX(15)),
      translate(-Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
    );
    shape_data.height = Xiaohei.size * 4; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    draw_cylinder(shape_data, mult(Xiaohei.tMatrix, leftHandMatrix)); //draw left hands
    //right hand
    var rightHandMatrix = mult(
      mult(rotateZ(-15), rotateX(15)),
      translate(+Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
    );
    draw_cylinder(shape_data, mult(Xiaohei.tMatrix, rightHandMatrix)); //draw left hands
    //==========//
    //left foot
    var leftFootMatrix = mult(
      mult(rotateZ(15), rotateX(15)),
      translate(-Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
    );
    shape_data.height = Xiaohei.size * 3; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    draw_cylinder(shape_data, mult(Xiaohei.tMatrix, leftFootMatrix));
    //right foot
    var rightFootMatrix = mult(
      mult(rotateZ(-15), rotateX(15)),
      translate(+Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
    );
    shape_data.height = Xiaohei.size * 3; //length
    draw_cylinder(shape_data, mult(Xiaohei.tMatrix, rightFootMatrix));
  },
  generateTransformMatrix: function() {
    var RE = scalem(Xiaohei.size, Xiaohei.size, Xiaohei.size);
    var T = translate(
      Xiaohei.position[0],
      Xiaohei.position[1],
      Xiaohei.position[2]
    );
    var R = rotateY(Xiaohei.RotateAngle);
    Xiaohei.tMatrix = mult(T, mult(R, RE));
  },
  rotateRight: function() {
    Xiaohei.RotateAngle += Xiaohei.ROTATE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  rotateLeft: function() {
    Xiaohei.RotateAngle -= Xiaohei.ROTATE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  walkForward: function() {
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * -1 * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * Math.cos(radians(Xiaohei.RotateAngle));
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  walkBackward: function() {
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * -1 * Math.cos(radians(Xiaohei.RotateAngle));
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  shrink: function() {
    Xiaohei.size -= Xiaohei.RESIZE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  expand: function() {
    Xiaohei.size += Xiaohei.RESIZE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  }
};
