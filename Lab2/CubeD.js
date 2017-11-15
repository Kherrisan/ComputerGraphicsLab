var Cubed = {
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
  draw: function () {
    //head
    var shape_data = {
      origin: Cubed.position,
      axis_length: vec3(
        Cubed.size * 5, //脸宽
        Cubed.size * 4,
        Cubed.size * 4
      ), //5:2:2
      height: 0,
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      position_matrix: vec4(),
      color: vec4(0, 0, 0, 1)
    };
    var tMatrix = Cubed.generateTransformMatrix();
    draw_ellipsoid(shape_data, Cubed.tMatrix); //draw the head.
    //body
    shape_data.origin = vec3(
      Cubed.position[0], //x
      Cubed.position[1] - Cubed.size * 3.5, //y
      Cubed.position[2] - Cubed.size * 4.5 //z
    )
    shape_data.axis_length = vec3(
      Cubed.size * 3,
      Cubed.size * 5.2, //身长
      Cubed.size * 3
    )
    draw_ellipsoid(shape_data, Cubed.tMatrix); //draw the body.
    shape_data.origin = vec3(
      //left ear buttom point
      Cubed.position[0] - Cubed.size * 2,
      Cubed.position[1] + Cubed.size * 2,
      Cubed.position[2]
    );
    shape_data.axis_length = vec2(Cubed.size * 2.5, Cubed.size * 0.6);
    //left ear top point
    shape_data.angle_range_vertical = vec3(
      Cubed.position[0] - Cubed.size * 2 - 1.3,
      Cubed.position[1] + Cubed.size * 3 + 1.2,
      Cubed.position[2]
    );
    shape_data.angle_range_horizontal = vec2(0, 360);
    draw_taper(shape_data, Cubed.tMatrix); //draw left ear.
    shape_data.origin = vec3(
      //set right ear buttom point
      Cubed.position[0] + Cubed.size * 2,
      Cubed.position[1] + +Cubed.size * 2,
      Cubed.position[2]
    );
    shape_data.axis_length = vec2(Cubed.size * 2.5, Cubed.size * 0.6);
    //right ear top point
    shape_data.angle_range_vertical = vec3(
      Cubed.position[0] + Cubed.size * 2 + 1.3,
      Cubed.position[1] + Cubed.size * 3 + 1.2,
      Cubed.position[2]
    );
    draw_taper(shape_data, Cubed.tMatrix); //draw right ear.
    //left hand
    shape_data.origin = vec3(0,0,0);
    shape_data.height = Cubed.size * 5; //length
    shape_data.axis_length = vec2(Cubed.size * 0.8, Cubed.size * 0.8);
    shape_data.position_matrix = mult(
      mult(rotateZ(15),rotateX(15)),
      translate(Cubed.position[0]-Cubed.size*0.5,
        Cubed.position[1]-Cubed.size*6, 
        Cubed.position[2]-Cubed.size*3)); 
    draw_cylinder(shape_data, mult(Cubed.tMatrix,shape_data.position_matrix)) //draw left hands
    //right hand
    shape_data.position_matrix = mult(
      mult(rotateZ(-15), rotateX(15)), 
      translate(Cubed.position[0]+Cubed.size*0.5,
        Cubed.position[1]-Cubed.size*6, 
        Cubed.position[2]-Cubed.size*3)); 
    draw_cylinder(shape_data, mult(Cubed.tMatrix,shape_data.position_matrix)) //draw left hands
    //==========//
    //left foot
    shape_data.height = Cubed.size * 3; //length
    shape_data.axis_length = vec2(Cubed.size * 0.8, Cubed.size * 0.8);
    shape_data.position_matrix = mult(
      mult(rotateZ(15),rotateX(15)),
      translate(Cubed.position[0]-Cubed.size*0.3,
        Cubed.position[1]-Cubed.size*3, 
        Cubed.position[2]-Cubed.size*9)); 
    draw_cylinder(shape_data, mult(Cubed.tMatrix, shape_data.position_matrix))
    //right foot
    shape_data.height = Cubed.size * 3; //length
    shape_data.axis_length = vec2(Cubed.size * 0.8, Cubed.size * 0.8);
    shape_data.position_matrix = mult(
      mult(rotateZ(-15), rotateX(15)), 
      translate(Cubed.position[0]+Cubed.size*0.3,
        Cubed.position[1]-Cubed.size*3, 
        Cubed.position[2]-Cubed.size*9)); 
    draw_cylinder(shape_data, mult(Cubed.tMatrix, shape_data.position_matrix))


  },
  //MAVMatrix这个矩阵会同时影响到floor和Cube的转换
  generateTransformMatrix: function () {
    var RE = scalem(Cubed.size, Cubed.size, Cubed.size);
    var T = translate(Cubed.position[0], 0.0, Cubed.position[2]);
    var R = rotateY(Cubed.RotateAngle);
    Cubed.tMatrix = mult(T, mult(R, RE));
  },
  rotateRight: function () {
    Cubed.RotateAngle += Cubed.ROTATE_STEP;
  },
  rotateLeft: function () {
    Cubed.RotateAngle -= Cubed.ROTATE_STEP;
  },
  walkForward: function () {
    Cubed.position[0] +=
      Cubed.FORWARD_STEP * -1 * Math.sin(radians(Cubed.RotateAngle));
    Cubed.position[2] +=
      Cubed.FORWARD_STEP * Math.cos(radians(Cubed.RotateAngle));
  },
  walkBackward: function () {
    Cubed.position[0] +=
      Cubed.FORWARD_STEP * Math.sin(radians(Cubed.RotateAngle));
    Cubed.position[2] +=
      Cubed.FORWARD_STEP * -1 * Math.cos(radians(Cubed.RotateAngle));
  },
  shrink: function () {
    Cubed.size -= Cubed.RESIZE_STEP;
  },
  expand: function () {
    Cubed.size += Cubed.RESIZE_STEP;
  }
};