var Wall = {
  name: "wall",
  //材质属性
  materialAmbient: vec4(0.1, 0.1, 0.1, 1.0), //对象的材质环境光参数
  materialDiffuse: vec4(0.2, 0.2, 0.2, 1.0), //对象的材质散射光参数
  materialSpecular: vec4(0.5, 0.5, 0.5, 1.0), //对象的材质镜面光参数
  shininess: 1.0, //对象的高光度
  vbo: null, //存放顶点坐标的缓存区 vertices buffer object
  nbo: null, //存放法向量坐标的缓存区 normal buffer object
  transformMatrix: null, //是否需要变换矩阵
  wireframe: false, //是否绘制线框图
  vertexNum: 0, //顶点数量
  useTexture: false, //是否使用纹理
  /*
    wall对象初始化：顶点，法向量坐标
    build中根据计算好的所有坐标，创建并且存入缓存区
  */
  build: () => {
    //通过调用Geometry.js中的generator函数计算wall的顶点和法向量的坐标并存入对应数组
    var verticesAndNormals = cuboid_generator({
      bottom_leftup: vec3(-10, 0, -9),
      bottom_leftdown: vec3(-10, 0, -8),
      bottom_rightup: vec3(10, 0, -9),
      bottom_rightdown: vec3(10, 0, -8),
      height: 5
    });
    //保存顶点个数，用于drawArray
    Wall.vertexNum = verticesAndNormals.vertices.length;
    //创建存放顶点坐标的buffer，并传入数据vertices。
    Wall.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Wall.vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(verticesAndNormals.vertices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    //创建存放顶点法向量的buffer，并传入数据normals。  
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