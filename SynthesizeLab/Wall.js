var Wall = {
  //材质属性
  materialAmbient: vec4(0.1, 0.1, 0.1, 1.0),
  materialDiffuse: vec4(0.2, 0.2, 0.2, 1.0),
  materialSpecular: vec4(0.01, 0.01, 0.01, 1.0),
  shininess: 1.0,
  vbo: null,
  nbo: null,
  transformMatrix: null,
  wireframe: false,
  vertexNum: 0,
  useTexture: false,
  build: () => {
    var verticesAndNormals = cuboid_generator({
      bottom_leftup: vec3(-2, 0, -5),
      bottom_leftdown: vec3(-2, 0, -6),
      bottom_rightup: vec3(2, 0, -5),
      bottom_rightdown: vec3(2, 0, -6),
      height: 2
    });

    Wall.vertexNum = verticesAndNormals.vertices.length;
    Wall.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Wall.vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(verticesAndNormals.vertices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Wall.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Wall.nbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(verticesAndNormals.normals),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
};
