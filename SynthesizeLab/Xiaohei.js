function texture_empty(theta, fai, size) {
  return vec2(0, 0);
}

function texture_coordinate(x, y, z, height, width) {
  if (z < 0) {
    return vec2(0, 0);
  }
  x = (x + width / 2.0) / width;
  y = (-y + height / 2.0) / height;
  return vec2(x, y);
}

var Xiaohei = {
  //材质属性
  materialAmbient: vec4(0.1, 0.1, 0.1, 1.0),
  materialDiffuse: vec4(0.2, 0.2, 0.2, 1.0),
  materialSpecular: vec4(0.01, 0.01, 0.01, 1.0),
  shininess: 1.0,
  texture: null,

  FORWARD_STEP: 0.2, //平移步长
  ROTATE_STEP: 5,
  RotateAngle: 0, //立方体旋转角度
  RESIZE_STEP: 0.1, //放缩幅度
  //like floor
  position: vec3(0, 1.8, 0), //the location of the center point of this animal.
  vbo: null,
  cbo: null,
  nbo: null,
  tbo: null,
  size: 0.5,
  vertexNum: 0,
  useTexture: true,
  transformMatrix: null,
  perVertexColor: true,
  build: () => {
    var image = document.getElementById("texImage");

    Xiaohei.texture = gl.createTexture();
    // gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, Xiaohei.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(
    //   gl.TEXTURE_2D,
    //   gl.TEXTURE_MIN_FILTER,
    //   gl.NEAREST_MIPMAP_LINEAR
    // // );
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    var vertices = [];
    var normals = [];
    var colors = [];
    var textures = [];

    //init shape_data
    var shape_data = {
      origin: vec3(0, 0, 0),

      axis_length: vec3(
        Xiaohei.size * 5, //脸宽
        Xiaohei.size * 4,
        Xiaohei.size * 4
      ), //5:4:4
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),

      ellipse_axis:vec2(0,0),
      angle_range:vec2(0,360),

      height:0,
      top_point:vec3(0,0,0), 
    };
    //generate head vertices, textures and normals.
    var head_vertices = ellipsoid_generator(shape_data, texture_coordinate);
    vertices = vertices.concat(head_vertices.vertices);
    normals = normals.concat(head_vertices.normals);
    textures = textures.concat(head_vertices.textures);

    //left ear shape_data initialization.
    shape_data.ellipse_axis = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    shape_data.top_point = vec3(
      -Xiaohei.size * 6.4,
      +Xiaohei.size * 4,
      0
    );

    //generate left ear vertices, textures and normals.
    var leftear_vertices = taper_generator(shape_data, texture_empty);
    Xiaohei.constructMatrix(
      translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      leftear_vertices.vertices
    );
    vertices = vertices.concat(leftear_vertices.vertices);
    normals = normals.concat(leftear_vertices.normals);
    textures = textures.concat(leftear_vertices.textures);

    //inner left ear shape_data initialization.
    shape_data.top_point = vec3(
      -Xiaohei.size * 6.0,
      +Xiaohei.size * 3.6,
      +Xiaohei.size * 0.35
    );
    shape_data.angle_range = vec2(100, 200);
    //generate inner left ear vertices, textures and normals.
    var inner_leftear_vertices = taper_generator(shape_data, texture_empty);
    Xiaohei.constructMatrix(
      translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      inner_leftear_vertices.vertices
    );
    vertices = vertices.concat(inner_leftear_vertices.vertices);
    normals = normals.concat(inner_leftear_vertices.normals);
    textures = textures.concat(inner_leftear_vertices.textures);

    //right ear shape_data initialization.
    shape_data.angle_range = vec2(0, 360);
    shape_data.ellipse_axis = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    shape_data.top_point = vec3(
      Xiaohei.size * 6.4,
      Xiaohei.size * 4,
      0
    );
    //generate right ear vertices, textures and normals.
    var rightear_vertices = taper_generator(shape_data, texture_empty);
    Xiaohei.constructMatrix(
      translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      rightear_vertices.vertices
    );
    vertices = vertices.concat(rightear_vertices.vertices);
    normals = normals.concat(rightear_vertices.normals);
    textures = textures.concat(rightear_vertices.textures);

    //inner right ear shape_data initialization.
    shape_data.top_point = vec3(
      +Xiaohei.size * 6.0,
      +Xiaohei.size * 3.6,
      +Xiaohei.size * 0.35
    );
    shape_data.angle_range = vec2(0, 90);
    //generate inner right ear vertices, textures and normals.
    var inner_rightear_vertices = taper_generator(shape_data, texture_empty);
    Xiaohei.constructMatrix(
      translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      inner_rightear_vertices.vertices
    );
    vertices = vertices.concat(inner_rightear_vertices.vertices);
    normals = normals.concat(inner_rightear_vertices.normals);
    textures = textures.concat(inner_rightear_vertices.textures);


    //body shape_data initialization.
    shape_data.axis_length = vec3(
      Xiaohei.size * 2,
      Xiaohei.size * 4,
      Xiaohei.size * 2
    );
    //generate body vertices, textures and normals.
    var body_vertices = ellipsoid_generator(shape_data, texture_empty);
    Xiaohei.constructMatrix(
      translate(0, -Xiaohei.size * 3.5, -Xiaohei.size * 4.5),
      body_vertices.vertices
    );
    vertices = vertices.concat(body_vertices.vertices);
    normals = normals.concat(body_vertices.normals);
    textures = textures.concat(body_vertices.textures);

    //left hand shape_data initialization.
    shape_data.angle_range = vec2(0, 360);
    shape_data.height = Xiaohei.size * 4; //length
    shape_data.ellipse_axis = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);

    //generate left hand vertices, textures and normals.
    var lefthand_vertices = cylinder_generator(shape_data, texture_empty);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(15), rotateX(15)),
        translate(-Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
      ),
      lefthand_vertices.vertices
    );
    vertices = vertices.concat(lefthand_vertices.vertices);
    normals = normals.concat(lefthand_vertices.normals);
    textures = textures.concat(lefthand_vertices.textures);

    //right hand shape_data initialization.
    var righthand_vertices = cylinder_generator(shape_data, texture_empty);
    //generate right hand vertices, textures and normals.
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(-15), rotateX(15)),
        translate(+Xiaohei.size * 0.2, -Xiaohei.size * 5, -Xiaohei.size * 3)
      ),
      righthand_vertices.vertices
    );
    vertices = vertices.concat(righthand_vertices.vertices);
    normals = normals.concat(righthand_vertices.normals);
    textures = textures.concat(righthand_vertices.textures);

    //left foot shape_data initialization.
    shape_data.height = Xiaohei.size * 3; //length
    shape_data.ellipse_axis = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    //generate left foot vertices, textures and normals.
    var leftfoot_vertices = cylinder_generator(shape_data, texture_empty);
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(15), rotateX(15)),
        translate(-Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
      ),
      leftfoot_vertices.vertices
    );
    vertices = vertices.concat(leftfoot_vertices.vertices);
    normals = normals.concat(leftfoot_vertices.normals);
    textures = textures.concat(leftfoot_vertices.textures);

    //right foot shape_data initialization.
    var rightfoot_vertices = cylinder_generator(shape_data, texture_empty);
    //generate right foot vertices, textures and normals.
    Xiaohei.constructMatrix(
      mult(
        mult(rotateZ(-15), rotateX(15)),
        translate(+Xiaohei.size * 0, -Xiaohei.size * 4, -Xiaohei.size * 7.5)
      ),
      rightfoot_vertices.vertices
    );
    vertices = vertices.concat(rightfoot_vertices.vertices);
    normals = normals.concat(rightfoot_vertices.normals);
    textures = textures.concat(rightfoot_vertices.textures);

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

    Xiaohei.tbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.tbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textures), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
