var Wall = {
  //材质属性
  materialAmbient: vec4(0.1, 0.1, 0.1, 1.0),
  materialDiffuse: vec4(0.2, 0.2, 0.2, 1.0),
  materialSpecular: vec4(0.01, 0.01, 0.01, 1.0),
  shininess: 1.0,
  vertexNum: 0,
  vbo: null,
  nbo: null,
  build: () => {
    var shape_data = {
      bottom_leftup: vec3(10, 0, -2),
      bottom_leftdown: vec3(10, 0, 0),
      bottom_rightup: vec3(15, 0, -2),
      bottom_rightdown: vec3(15, 0, 0),
      height: 10
    };
    var vn = cuboid_generator(shape_data);
    Wall.vertexNum = vn.vertices.length;
    Wall.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Wall.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vn.vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Wall.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Wall.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vn.normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
};
