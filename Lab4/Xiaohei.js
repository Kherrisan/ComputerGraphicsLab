var Xiaohei = {
  // CurModelViewMatrix: mat4(), //当前变换矩阵
  FORWARD_STEP: 0.2, //平移步长
  ROTATE_STEP: 5,
  RotateAngle: 0, //立方体旋转角度
  RESIZE_STEP: 0.1, //放缩幅度
  //like floor
  position: vec3(0, 1.8, 0), //the location of the center point of this animal.
  vbo: null,
  cbo: null,
  size: 0.5,
  vertexNum: 0,
  // wireframe: false,
  // perVertexColor: true,
  transformMatrix: null,
  perVertexColor: true,
  build: () => {
    var vertices = [];
    var colors=[];

    //init shape_data
    var shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec3(
        Xiaohei.size * 5, //脸宽
        Xiaohei.size * 4,
        Xiaohei.size * 4
      ), //5:4:4
      height: 0,
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      position_matrix: vec4(),
      color: vec4(0, 0, 0, 1)
    };

    //generate left ear vertices and colors
    shape_data.axis_length = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    shape_data.angle_range_vertical = vec3(
      -Xiaohei.size * 6.4,
      +Xiaohei.size * 4,
      0
    );
    shape_data.angle_range_horizontal = vec2(0, 360);
    var leftear_vertices = taper_generator(shape_data);
    Xiaohei.constructMatrix(
      translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      leftear_vertices
    );
    vertices = vertices.concat(leftear_vertices);
    colors = colors.concat(
      generateColors(leftear_vertices.length, shape_data["color"])
    );

    // generate inner left ear vertices and colors
    shape_data.angle_range_vertical = vec3(
      -Xiaohei.size * 6.0,
      +Xiaohei.size * 3.6,
      +Xiaohei.size * 0.35
    );
    shape_data.angle_range_horizontal = vec2(100, 200);
    shape_data.color = vec4(0.605, 0.8, 0.601, 1);
    var inner_leftear_vertices = taper_generator(shape_data);
    Xiaohei.constructMatrix(
      translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      inner_leftear_vertices
    );
    vertices = vertices.concat(inner_leftear_vertices);
    colors = colors.concat(
      generateColors(inner_leftear_vertices.length, shape_data["color"])
    );

    //generate right ear vertices and colors
    shape_data.angle_range_horizontal = vec2(0, 360);
    shape_data.color = vec4(0, 0, 0, 1);
    shape_data.axis_length = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    shape_data.angle_range_vertical = vec3(
      Xiaohei.size * 6.4,
      Xiaohei.size * 4,
      0
    );
    var rightear_vertices = taper_generator(shape_data);
    Xiaohei.constructMatrix(
      translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      rightear_vertices
    );
    vertices = vertices.concat(rightear_vertices);
    colors = colors.concat(
      generateColors(rightear_vertices.length, shape_data["color"])
    );

    // generate inner right ear vertices and colors
    shape_data.angle_range_vertical = vec3(
      +Xiaohei.size * 6.0,
      +Xiaohei.size * 3.6,
      +Xiaohei.size * 0.35
    );
    shape_data.angle_range_horizontal = vec2(0, 90);
    shape_data.color = vec4(0.605, 0.8, 0.601, 1);
    var inner_rightear_vertices = taper_generator(shape_data);
    Xiaohei.constructMatrix(
      translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      inner_rightear_vertices
    );
    vertices = vertices.concat(inner_rightear_vertices);
    colors = colors.concat(
      generateColors(inner_rightear_vertices.length, shape_data["color"])
    );

    shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec3(
        Xiaohei.size * 5, //脸宽
        Xiaohei.size * 4,
        Xiaohei.size * 4
      ), //5:4:4
      height: 0,
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      position_matrix: vec4(),
      color: vec4(0, 0, 0, 1)
    };

    //generate head vertices and colors
    var head_vertices = ellipsoid_generator(shape_data);
    vertices = vertices.concat(head_vertices);
    colors = colors.concat(generateColors(head_vertices.length, shape_data["color"]));

    //generate body vertices and colors
    shape_data.axis_length = vec3(
      Xiaohei.size * 2,
      Xiaohei.size * 4,
      Xiaohei.size * 2
    );
    var body_vertices = ellipsoid_generator(shape_data);
    Xiaohei.constructMatrix(
      translate(0, -Xiaohei.size * 3.5, -Xiaohei.size * 4.5),
      body_vertices
    );
    vertices = vertices.concat(body_vertices);
    colors = colors.concat(
      generateColors(body_vertices.length, shape_data["color"])
    );

    //generate hand vertices and colors
    shape_data.angle_range_horizontal = vec2(0, 360);
    shape_data.color = vec4(0, 0, 0, 1);
    shape_data.height = Xiaohei.size * 4; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    var lefthand_vertices = cylinder_generator(shape_data);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(15), rotateX(15)),
        translate(-Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
      ),
      lefthand_vertices
    );
    vertices = vertices.concat(lefthand_vertices);
    colors = colors.concat(
      generateColors(lefthand_vertices.length, shape_data["color"])
    );
    //right hand
    var righthand_vertices = cylinder_generator(shape_data);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(-15), rotateX(15)),
        translate(+Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
      ),
      righthand_vertices
    );
    vertices = vertices.concat(righthand_vertices);
    colors = colors.concat(
      generateColors(righthand_vertices.length, shape_data["color"])
    );
    //generate foot vertices and colors
    shape_data.height = Xiaohei.size * 3; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    var leftfoot_vertices = cylinder_generator(shape_data);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(15), rotateX(15)),
        translate(-Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
      ),
      leftfoot_vertices
    );
    vertices = vertices.concat(leftfoot_vertices);
    colors = colors.concat(
      generateColors(leftfoot_vertices.length, shape_data["color"])
    );
    //right foot
    var rightfoot_vertices = cylinder_generator(shape_data);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(-15), rotateX(15)),
        translate(+Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
      ),
      rightfoot_vertices
    );
    vertices = vertices.concat(rightfoot_vertices);
    colors = colors.concat(
      generateColors(rightfoot_vertices.length, shape_data["color"])
    );

    Xiaohei.vertexNum = vertices.length;
    Xiaohei.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Xiaohei.cbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.cbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Xiaohei.updateTransformMatrix();
  },
  constructMatrix: function(matrix, vertices) {
    //This function transform each part of the object by multiply vertices with translate matrix or rotate matrix,
    //So each part should be in the right position of the object.
    //For example,your left hand should be in your left,away from your heart about 0.5*width of your body.
    for (var i = 0; i < vertices.length; i++) {
      var temp = mult(
        matrix,
        vec4(vertices[i][0], vertices[i][1], vertices[i][2], 1)
      );
      vertices[i] = vec3(temp[0], temp[1], temp[2]);
    }
  },
  updateTransformMatrix: function() {
    var RE = scalem(Xiaohei.size, Xiaohei.size, Xiaohei.size);
    var T = translate(
      Xiaohei.position[0],
      Xiaohei.position[1],
      Xiaohei.position[2]
    );
    var R = rotateY(Xiaohei.RotateAngle);
    Xiaohei.transformMatrix = mult(T, mult(R, RE));
  },
  rotateRight: function() {
    Xiaohei.RotateAngle += Xiaohei.ROTATE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  rotateLeft: function() {
    Xiaohei.RotateAngle -= Xiaohei.ROTATE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  walkForward: function() {
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * -1 * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * Math.cos(radians(Xiaohei.RotateAngle));
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  walkBackward: function() {
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * -1 * Math.cos(radians(Xiaohei.RotateAngle));
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  shrink: function() {
    Xiaohei.size -= Xiaohei.RESIZE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  expand: function() {
    Xiaohei.size += Xiaohei.RESIZE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  }
};
