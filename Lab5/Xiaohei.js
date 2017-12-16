var Xiaohei = {
  //材质属性
  materialAmbient: vec4(0.1, 0.1, 0.1, 1.0),
  materialDiffuse: vec4(0.2, 0.2, 0.2, 1.0),
  materialSpecular: vec4(0.01, 0.01, 0.01, 1.0),
  shininess: 1.0,
  // CurModelViewMatrix: mat4(), //当前变换矩阵
  FORWARD_STEP: 0.2, //平移步长
  ROTATE_STEP: 5,
  RotateAngle: 0, //立方体旋转角度
  RESIZE_STEP: 0.1, //放缩幅度
  //like floor
  position: vec3(0, 1.8, 0), //the location of the center point of this animal.
  vbo: null,
  cbo: null,
  nbo: null,
  size: 0.5,
  vertexNum: 0,
  // wireframe: false,
  // perVertexColor: true,
  transformMatrix: null,
  perVertexColor: true,
  build: () => {
    var vertices = [];
    var normals = [];
    var colors = [];

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
      leftear_vertices.vertexPoint
    );
    vertices = vertices.concat(leftear_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(leftear_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(leftear_vertices.normals);

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
      inner_leftear_vertices.vertexPoint
    );
    vertices = vertices.concat(inner_leftear_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(
        inner_leftear_vertices.vertexPoint.length,
        shape_data["color"]
      )
    );
    normals = normals.concat(inner_leftear_vertices.normals);

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
      rightear_vertices.vertexPoint
    );
    vertices = vertices.concat(rightear_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(rightear_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(rightear_vertices.normals);

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
      inner_rightear_vertices.vertexPoint
    );
    vertices = vertices.concat(inner_rightear_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(
        inner_rightear_vertices.vertexPoint.length,
        shape_data["color"]
      )
    );
    normals = normals.concat(inner_rightear_vertices.normals);

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
    vertices = vertices.concat(head_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(head_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(head_vertices.normals);

    //generate body vertices and colors
    shape_data.axis_length = vec3(
      Xiaohei.size * 2,
      Xiaohei.size * 4,
      Xiaohei.size * 2
    );
    var body_vertices = ellipsoid_generator(shape_data);
    Xiaohei.constructMatrix(
      translate(0, -Xiaohei.size * 3.5, -Xiaohei.size * 4.5),
      body_vertices.vertexPoint
    );
    vertices = vertices.concat(body_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(body_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(body_vertices.normals);

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
      lefthand_vertices.vertexPoint
    );
    vertices = vertices.concat(lefthand_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(lefthand_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(lefthand_vertices.normals);

    //right hand
    var righthand_vertices = cylinder_generator(shape_data);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(-15), rotateX(15)),
        translate(+Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
      ),
      righthand_vertices.vertexPoint
    );
    vertices = vertices.concat(righthand_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(righthand_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(righthand_vertices.normals);

    //generate foot vertices and colors
    shape_data.height = Xiaohei.size * 3; //length
    shape_data.axis_length = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    var leftfoot_vertices = cylinder_generator(shape_data);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(15), rotateX(15)),
        translate(-Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
      ),
      leftfoot_vertices.vertexPoint
    );
    vertices = vertices.concat(leftfoot_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(leftfoot_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(leftfoot_vertices.normals);

    //right foot
    var rightfoot_vertices = cylinder_generator(shape_data);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(-15), rotateX(15)),
        translate(+Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
      ),
      rightfoot_vertices.vertexPoint
    );
    vertices = vertices.concat(rightfoot_vertices.vertexPoint);
    colors = colors.concat(
      generateColors(rightfoot_vertices.vertexPoint.length, shape_data["color"])
    );
    normals = normals.concat(rightfoot_vertices.normals);

    Xiaohei.vertexNum = vertices.length;
    Xiaohei.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Xiaohei.cbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.cbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Xiaohei.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Xiaohei.updateTransformMatrix();
  },
  constructMatrix: function(matrix, vertices) {
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

function XiaoheiInnerEar(xiaohei, relativePosition, relativeAttritude) {
  this.parent = xiaohei;
  this.materialAmbient = vec4();
  this.materialDiffuse = vec4();
  this.materialSpecular = vec4();
  this.shininess = 1.0;
  this.relativePosition = relativePosition;
  this.relativeAttritude = relativeAttritude;
  this.vbo = null;
  this.cbo = null;
  this.nbo = null;
  this.vertexNum = 0;

  this.draw = function() {};
}

function XiaoheiBackLeg(xiaohei, relativePosition, relativeAttritude) {
  this.parent = xiaohei;
  this.materialAmbient = vec4();
  this.materialDiffuse = vec4();
  this.materialSpecular = vec4();
  this.shininess = 1.0;
  this.relativePosition = relativePosition;
  this.relativeAttritude = relativeAttritude;
  this.vbo = null;
  this.cbo = null;
  this.nbo = null;
  this.vertexNum = 0;

  this.draw = function() {};
}

function XiaoheiFrontLeg(xiaohei, relativePosition, relativeAttritude) {
  this.parent = xiaohei;
  this.materialAmbient = vec4();
  this.materialDiffuse = vec4();
  this.materialSpecular = vec4();
  this.shininess = 1.0;
  this.relativePosition = relativePosition;
  this.relativeAttritude = relativeAttritude;
  this.vbo = null;
  this.cbo = null;
  this.nbo = null;
  this.vertexNum = 0;
}

//xiaohei:父对象
//relativePosition:本部件相对于父对象的相对位置的平移矩阵。
//relativeAttribute:本部件相对于父对象的相对姿态的旋转矩阵。
function XiaoheiHead(xiaohei, relativePosition, relativeAttritude) {
  this.parent = xiaohei;
  this.wireframe = false;
  this.useTexture = false;
  this.materialAmbient = vec4();
  this.materialDiffuse = vec4();
  this.materialSpecular = vec4();
  this.shininess = 1.0;
  this.relativePosition = relativePosition;
  this.relativeAttritude = relativeAttritude;
  this.transform = mat4();
  this.vbo = null;
  this.nbo = null;
  this.vertices = [];
  this.normals = [];
  this.colors = [];
  this.vertexNum = 0;
  this.leftEarRelative = translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0);
  this.rightEarRelative = translate(
    +Xiaohei.size * 0.1,
    +Xiaohei.size * 0.5,
    0
  );
  this.headRelative = mat4();

  //对一个顶点列表中的所有顶点，做matrix对应的变换，得到长度不变的顶点列表。
  this.transformVertices = (matrix, vertices) => {
    for (var i = 0; i < vertices.length; i++) {
      var temp = mult(
        matrix,
        vec4(vertices[i][0], vertices[i][1], vertices[i][2], 1)
      );
      vertices[i] = vec3(temp[0], temp[1], temp[2]);
    }
  };

  this.constructLeftEar = () => {
    var shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec2(xiaohei.size * 5, xiaohei.size * 3), //5:4:4
      height: 0,
      angle_range_vertical: vec3(-xiaohei.size * 6.4, +xiaohei.size * 4, 0),
      angle_range_horizontal: vec2(0, 360),
      position_matrix: vec4(),
      color: vec4(0, 0, 0, 1)
    };
    var verticesAndNormals = taper_generator(shape_data);
    this.transformVertices(this.leftEarRelative, verticesAndNormals.vertices);
    this.vertices.concat(verticesAndNormals.vertices);
    this.normals = normals.concat(verticesAndNormals.normals);
  };

  this.constructRightEar = () => {
    var shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec2(Xiaohei.size * 5, Xiaohei.size * 3),
      height: 0,
      angle_range_vertical: vec3(Xiaohei.size * 6.4, Xiaohei.size * 4, 0),
      angle_range_horizontal: vec2(0, 360),
      position_matrix: vec4(),
      color: vec4(0, 0, 0, 1)
    };
    var verticesAndNormals = taper_generator(shape_data);
    this.transformVertices(this.rightEarRelative, verticesAndNormals.vertices);
    this.vertices.concat(verticesAndNormals.vertices);
    this.normals = normals.concat(verticesAndNormals.normals);
  };

  this.constructHead = () => {
    var shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec3(Xiaohei.size * 5, Xiaohei.size * 4, Xiaohei.size * 4),
      height: 0,
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      position_matrix: vec4(),
      color: vec4(0, 0, 0, 1)
    };
    var verticesAndNormals = taper_generator(shape_data);
    this.transformVertices(this.headRelative, verticesAndNormals.vertices);
    this.vertices.concat(verticesAndNormals.vertices);
    this.normals = normals.concat(verticesAndNormals.normals);
  };

  this.init = () => {
    //初始化vertices和normals的列表并存入buffer。
    this.constructRightEar();
    this.constructLeftEar();
    this.constructHead();

    this.vertexNum = this.vertices.length;

    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  };

  this.updateTransform = () => {
    this.transform = mult(
      this.relativeAttritude,
      mult(this.relativePosition, this.parent.transform)
    );
  };

  this.draw = () => {
    this.updateTransform();
    this.parent.drawComponent(this);
  };
}

function XiaoheiBody(xiaohei, relativePosition, relativeAttritude) {
  this.parent = xiaohei;
  this.materialAmbient = vec4();
  this.materialDiffuse = vec4();
  this.materialSpecular = vec4();
  this.shininess = 1.0;
  this.relativePosition = relativePosition;
  this.relativeAttritude = relativeAttritude;
  this.vbo = null;
  this.cbo = null;
  this.nbo = null;
  this.vertexNum = 0;
}
