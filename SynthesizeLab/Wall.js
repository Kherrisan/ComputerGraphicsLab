var Wall = {
  //材质属性
  materialAmbient: vec4(0.1, 0.1, 0.1, 1.0),
  materialDiffuse: vec4(0.2, 0.2, 0.2, 1.0),
  materialSpecular: vec4(0.01, 0.01, 0.01, 1.0),
  shininess: 1.0,
  texture: null,
  vbo: null,
  nbo: null,
  tbo: null,
  vertexNum: 0,
  useTexture: true,
  build: () => {
    var verticesAndNormals = cuboid_generator({
      bottom_leftup: vec3(),
      bottom_leftdown: vec3(),
      bottom_rightup: vec3(),
      bottom_rightdown: vec3(),
      height: 2
    });
  }
};
