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
  position: vec3(0, 0, 0), //the location of the center point of this animal.
  size: 0.5,
  wireframe: false,
  perVertexColor: true,
  draw: function() {
    //head
    var shape_data = {
      origin: Xiaohei.position,
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
    draw_ellipsoid(shape_data, Xiaohei.tMatrix); //draw the head.
    //body
    shape_data.origin = vec3(
      Xiaohei.position[0], //x
      Xiaohei.position[1] - Xiaohei.size * 3.5, //y
      Xiaohei.position[2] - Xiaohei.size * 4.5 //z
    );
    shape_data.axis_length = vec3(
      Xiaohei.size * 3,
      Xiaohei.size * 5.2, //身长
      Xiaohei.size * 3
    );
    draw_ellipsoid(shape_data, Xiaohei.tMatrix); //draw the body.
    shape_data.origin = vec3(
      //left ear buttom point
      Xiaohei.position[0] - Xiaohei.size * 2,
      Xiaohei.position[1] + Xiaohei.size * 2,
      Xiaohei.position[2]
    );
    shape_data.axis_length = vec2(Xiaohei.size * 2.5, Xiaohei.size * 0.6);
    //left ear top point
    shape_data.angle_range_vertical = vec3(
      Xiaohei.position[0] - Xiaohei.size * 2 - 1.3,
      Xiaohei.position[1] + Xiaohei.size * 3 + 1.2,
      Xiaohei.position[2]
    );
    shape_data.angle_range_horizontal = vec2(0, 360);
    draw_taper(shape_data, Xiaohei.tMatrix); //draw left ear.
    shape_data.origin = vec3(
      //set right ear buttom point
      Xiaohei.position[0] + Xiaohei.size * 2,
      Xiaohei.position[1] + +Xiaohei.size * 2,
      Xiaohei.position[2]
    );
    shape_data.axis_length = vec2(Xiaohei.size * 2.5, Xiaohei.size * 0.6);
    //right ear top point
    shape_data.angle_range_vertical = vec3(
      Xiaohei.position[0] + Xiaohei.size * 2 + 1.3,
      Xiaohei.position[1] + Xiaohei.size * 3 + 1.2,
      Xiaohei.position[2]
    );
    draw_taper(shape_data, Xiaohei.tMatrix); //draw right ear.
    //left hand
    shape_data.origin = vec3(0, 0, 0);
    shape_data.height = Xiaohei.size * 5; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    shape_data.position_matrix = mult(
      mult(rotateZ(15), rotateX(15)),
      translate(
        Xiaohei.position[0] - Xiaohei.size * 0.5,
        Xiaohei.position[1] - Xiaohei.size * 6,
        Xiaohei.position[2] - Xiaohei.size * 3
      )
    );
    draw_cylinder(
      shape_data,
      mult(Xiaohei.tMatrix, shape_data.position_matrix)
    ); //draw left hands
    //right hand
    shape_data.position_matrix = mult(
      mult(rotateZ(-15), rotateX(15)),
      translate(
        Xiaohei.position[0] + Xiaohei.size * 0.5,
        Xiaohei.position[1] - Xiaohei.size * 6,
        Xiaohei.position[2] - Xiaohei.size * 3
      )
    );
    draw_cylinder(
      shape_data,
      mult(Xiaohei.tMatrix, shape_data.position_matrix)
    ); //draw left hands
    //==========//
    //left foot
    shape_data.height = Xiaohei.size * 3; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    shape_data.position_matrix = mult(
      mult(rotateZ(15), rotateX(15)),
      translate(
        Xiaohei.position[0] - Xiaohei.size * 0.3,
        Xiaohei.position[1] - Xiaohei.size * 3,
        Xiaohei.position[2] - Xiaohei.size * 9
      )
    );
    draw_cylinder(
      shape_data,
      mult(Xiaohei.tMatrix, shape_data.position_matrix)
    );
    //right foot
    shape_data.height = Xiaohei.size * 3; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    shape_data.position_matrix = mult(
      mult(rotateZ(-15), rotateX(15)),
      translate(
        Xiaohei.position[0] + Xiaohei.size * 0.3,
        Xiaohei.position[1] - Xiaohei.size * 3,
        Xiaohei.position[2] - Xiaohei.size * 9
      )
    );
    draw_cylinder(
      shape_data,
      mult(Xiaohei.tMatrix, shape_data.position_matrix)
    );
  },
  //MAVMatrix这个矩阵会同时影响到floor和Cube的转换
  generateTransformMatrix: function() {
    var RE = scalem(Xiaohei.size, Xiaohei.size, Xiaohei.size);
    var T = translate(Xiaohei.position[0], 0.0, Xiaohei.position[2]);
    var R = rotateY(Xiaohei.RotateAngle);
    Xiaohei.tMatrix = mult(T, mult(R, RE));
  },
  rotateRight: function() {
    Xiaohei.RotateAngle += Xiaohei.ROTATE_STEP;
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  rotateLeft: function() {
    Xiaohei.RotateAngle -= Xiaohei.ROTATE_STEP;
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  walkForward: function() {
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * -1 * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * Math.cos(radians(Xiaohei.RotateAngle));
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  walkBackward: function() {
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * -1 * Math.cos(radians(Xiaohei.RotateAngle));
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  shrink: function() {
    Xiaohei.size -= Xiaohei.RESIZE_STEP;
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  expand: function() {
    Xiaohei.size += Xiaohei.RESIZE_STEP;
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  }
};
