var Light = {
  // lightPosition: vec4(1.0, 1.0, 1.0, 1.0),
  lightAmbient: vec4(1.0, 1.0, 1.0, 1.0),
  lightDiffuse: vec4(1.0, 1.0, 1.0, 1.0),
  lightSpecular: vec4(0.5, 0.5, 0.5, 1.0),
  //材质属性
  // materialAmbient: vec4(0.1, 0.1, 0.1, 1.0),
  // materialDiffuse: vec4(0.2, 0.2, 0.2, 1.0),
  // materialSpecular: vec4(0.01, 0.01, 0.01, 1.0),
  // shininess: 1.0,
  // texture: null,
  // CurModelViewMatrix: mat4(), //当前变换矩阵
  lightPosition: vec3(0.0, 0.0, 4.0),
  FORWARD_STEP: 0.2, //平移步长
  ROTATE_STEP: 5,
  RotateAngle: 0, //立方体旋转角度
  RESIZE_STEP: 0.1, //放缩幅度
  // position:vec3(0.0,0.0,0.0),
  vbo: null,
  cbo: null,
  nbo: null,
  tbo: null,
  size: 1,
  vertexNum: 0,
  // wireframe: false,
  // perVertexColor: true,
  useColor:true,
  useTexture: false,
  transformMatrix: null,
  perVertexColor: true,
  setLocation: (a, b, c) => {
    Light.lightPosition = vec3(a, b, c);
    Light.updateTransformMatrix();
  },
  build: () => {
    var vertices = [];
    var normals = [];
    //init shape data 
    var shape_data = {
      origin: Light.lightPosition,
      axis_length: vec3(
        Light.size * 0.2,
        Light.size * 0.2,
        Light.size * 0.2
      ), //7:2:3
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
    };
    //generate light'body as a sphere, vertices and colors
    var light_vertices = ellipsoid_generator(shape_data, null);
    Light.constructMatrix(
      mult(rotateZ(0), rotateX(90)),
      light_vertices.vertices
    );
    vertices = vertices.concat(light_vertices.vertices);
    normals = normals.concat(light_vertices.normals);

    //bind buffer, vbo and cbo
    Light.vertexNum = vertices.length;
    Light.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Light.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    Light.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Light.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  },
  constructMatrix: function (matrix, vertices) {
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
  updateTransformMatrix: function () {
    var RE = scalem(Light.size, Light.size, Light.size);
    var T = translate(
      Light.lightPosition[0],
      Light.lightPosition[1],
      Light.lightPosition[2]
    );
    var R = rotateY(Light.RotateAngle);
    Light.transformMatrix = mult(T, mult(R, RE));
  },
  lightUp: function () {
    Light.lightPosition[1] += 0.5;
    Light.updateTransformMatrix();
  },
  lightDown: function () {
    Light.lightPosition[1] -= 0.5;
    Light.updateTransformMatrix();
  },
  lightLeft: function () {
    Light.lightPosition[0] -= 0.5;
    Light.updateTransformMatrix();
  },
  lightRight: function () {
    Light.lightPosition[0] += 0.5;
    Light.updateTransformMatrix();
  },
  lightForward: function () {
    Light.lightPosition[2] += 1;
    Light.updateTransformMatrix();
  },
  lightBackward: function () {
    Light.lightPosition[2] -= 1;
    Light.updateTransformMatrix();
  }
};