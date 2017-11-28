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
  head_vertices:[],
  head_color:[],//head
  body_vertices:[],
  body_color:[],//body
  leftear_vertices:[],
  leftear_color:[],  
  rightear_vertices:[],
  rightear_color:[],
  lefthand_vertices:[],
  lefthand_color:[],
  righthand_vertices:[],
  righthand_color:[],
  leftfoot_vertices:[],
  leftfoot_color:[],
  rightfoot_vertices:[],
  rightfoot_color:[],
  build:()=>{
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
    Xiaohei.head_vertices = ellipsoid_generator(shape_data);
    Xiaohei.head_color = generateColors(Xiaohei.head_vertices.length,shape_data["color"]);
    //body
    shape_data.axis_length = vec3(
      Xiaohei.size * 2,
      Xiaohei.size * 4, //身长
      Xiaohei.size * 2
    );
    Xiaohei.body_vertices = ellipsoid_generator(shape_data);
    Xiaohei.body_color = generateColors(Xiaohei.body_vertices.length,shape_data["color"]);
    shape_data.axis_length = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    //left ear top point
    shape_data.angle_range_vertical = vec3(
      -Xiaohei.size * 6.4,
      +Xiaohei.size * 4,
      0
    );
    shape_data.angle_range_horizontal = vec2(0, 360);
    Xiaohei.leftear_vertices = taper_generator(shape_data);
    Xiaohei.leftear_color = generateColors(Xiaohei.leftear_vertices.length,shape_data["color"]);
    shape_data.axis_length = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    //right ear top point
    shape_data.angle_range_vertical = vec3(
      Xiaohei.size * 6.4,
      Xiaohei.size * 4,
      0
    );
    Xiaohei.rightear_vertices = taper_generator(shape_data);    
    Xiaohei.rightear_color = generateColors(Xiaohei.rightear_vertices.length,shape_data["color"]);
    //left hand
    shape_data.height = Xiaohei.size * 4; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    Xiaohei.lefthand_vertices = cylinder_generator(shape_data);   
    Xiaohei.lefthand_color = generateColors(Xiaohei.lefthand_vertices.length,shape_data["color"]);
    //right hand
    Xiaohei.righthand_vertices = cylinder_generator(shape_data);   
    Xiaohei.righthand_color = generateColors(Xiaohei.righthand_vertices.length,shape_data["color"]);
    //left foot
    shape_data.height = Xiaohei.size * 3; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    Xiaohei.leftfoot_vertices = cylinder_generator(shape_data);   
    Xiaohei.leftfoot_color = generateColors(Xiaohei.leftfoot_vertices.length,shape_data["color"]);
    //right foot
    Xiaohei.rightfoot_vertices = cylinder_generator(shape_data);   
    Xiaohei.rightfoot_color = generateColors(Xiaohei.rightfoot_vertices.length,shape_data["color"]);
  },
  draw: function() {
    var tMatrix = Xiaohei.generateTransformMatrix();
    //head
    var headMatrix = translate(0, 0, 0);
    draw_ellipsoid(Xiaohei.head_vertices,Xiaohei.body_color, mult(Xiaohei.tMatrix, headMatrix)); //draw the head.
    //body
    var bodyMatrix = translate(0, -Xiaohei.size * 3.5, -Xiaohei.size * 4.5);
    draw_ellipsoid(Xiaohei.body_vertices,Xiaohei.body_color, mult(Xiaohei.tMatrix, bodyMatrix)); //draw the body.
    //left ear
    var leftEarMatrix = translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0);
    draw_taper(Xiaohei.leftear_vertices,Xiaohei.leftear_color, mult(Xiaohei.tMatrix, leftEarMatrix)); //draw left ear.
    //right ear
    var rightEarMatrix = translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0);
    draw_taper(Xiaohei.rightear_vertices,Xiaohei.rightear_color, mult(Xiaohei.tMatrix, rightEarMatrix)); //draw right ear.
    //left hand
    var leftHandMatrix = mult(
      mult(rotateZ(15), rotateX(15)),
      translate(-Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
    );
    draw_cylinder(Xiaohei.lefthand_vertices,Xiaohei.lefthand_color, mult(Xiaohei.tMatrix, leftHandMatrix)); //draw left hands
    //right hand
    var rightHandMatrix = mult(
      mult(rotateZ(-15), rotateX(15)),
      translate(+Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
    );
    draw_cylinder(Xiaohei.righthand_vertices,Xiaohei.righthand_color, mult(Xiaohei.tMatrix, rightHandMatrix)); //draw left hands
    //==========//
    //left foot
    var leftFootMatrix = mult(
      mult(rotateZ(15), rotateX(15)),
      translate(-Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
    );
    draw_cylinder(Xiaohei.leftfoot_vertices,Xiaohei.leftfoot_color, mult(Xiaohei.tMatrix, leftFootMatrix));
    //right foot
    var rightFootMatrix = mult(
      mult(rotateZ(-15), rotateX(15)),
      translate(+Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
    );
    draw_cylinder(Xiaohei.rightfoot_vertices,Xiaohei.rightfoot_color, mult(Xiaohei.tMatrix, rightFootMatrix));
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
