//Light类  
var Light = {
  lightAmbient: vec4(1.0, 1.0, 1.0, 1.0), //环境光参数
  lightDiffuse: vec4(1.0, 1.0, 1.0, 1.0), //散射光参数
  lightSpecular: vec4(0.5, 0.5, 0.5, 1.0), //镜面光参数
  lightPosition: vec3(0.0, 2.0, 2.0), //光源位置
  FORWARD_STEP: 0.2, //平移步长
  RotateAngle: 0, //旋转角度
  vbo: null, //存放顶点坐标的缓存区 vertices buffer object
  cbo: null, //存放颜色坐标的缓存区 color buffer object
  nbo: null, //存放法向量坐标的缓存区 normal buffer object
  tbo: null, //存放纹理坐标的缓存区 texture buffer object
  size: 1, //光源实体尺寸单位
  vertexNum: 0, //顶点的数量
  useTexture: false, //是否使用纹理
  transformMatrix: null, //变换矩阵
  /*
    Light对象生成的时候，用于设置光源对象的位置 
  */
  setLocation: (a, b, c) => {
    Light.lightPosition = vec3(a, b, c);
    Light.updateTransformMatrix();
  },
  /*
    Light对象初始化：顶点，法向量坐标
    build中根据Light为一个点光源，计算好其实体（球）以上的所有坐标，创建并且存入缓存区
  */
  build: () => {
    //初始化顶点和法向量坐标的数组
    var vertices = [];
    var normals = [];
    //初始化shape_data的所有属性用于绘制简单几何体
    var shape_data = {
      origin: Light.lightPosition,
      axis_length: vec3(
        Light.size * 0.2,
        Light.size * 0.2,
        Light.size * 0.2
      ), 
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
    };
    //通过调用Geometry.js中的generator函数计算好Light实体的顶点和法向量的坐标并存入对应数组
    var light_vertices = ellipsoid_generator(shape_data, null);
    vertices = vertices.concat(light_vertices.vertices);
    normals = normals.concat(light_vertices.normals);

    
    //保存顶点个数，用于drawArray
    Light.vertexNum = vertices.length;
    //创建存放顶点坐标的buffer，并传入数据vertices。
    Light.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Light.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //创建存放顶点法向量的buffer，并传入数据normals。
    Light.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Light.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  },
  /*
    Light对象生成和变换的时候，用于更新Light变换矩阵的函数
  */
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
  /*
    此函数根据Light的当前位置和平移步长，修改Light位置
    并通过html响应函数和更新变换矩阵函数
    实现Light沿y轴向上移动的操作
  */
  lightUp: function () {
    Light.lightPosition[1] += 0.5;
    Light.updateTransformMatrix();
  },
  /*
    此函数根据Light的当前位置和平移步长，修改Light位置
    并通过html响应函数和更新变换矩阵函数
    实现Light沿y轴向下移动的操作
  */
  lightDown: function () {
    Light.lightPosition[1] -= 0.5;
    Light.updateTransformMatrix();
  },
  /*
    此函数根据Light的当前位置和平移步长，修改Light位置
    并通过html响应函数和更新变换矩阵函数
    实现Light沿x轴向左移动的操作
  */
  lightLeft: function () {
    Light.lightPosition[0] -= 0.5;
    Light.updateTransformMatrix();
  },
  /*
    此函数根据Light的当前位置和平移步长，修改Light位置
    并通过html响应函数和更新变换矩阵函数
    实现Light沿x轴向右移动的操作
  */
  lightRight: function () {
    Light.lightPosition[0] += 0.5;
    Light.updateTransformMatrix();
  },
  /*
    此函数根据Light的当前位置和平移步长，修改Light位置
    并通过html响应函数和更新变换矩阵函数
    实现Light沿z轴向里移动的操作
  */
  lightForward: function () {
    Light.lightPosition[2] += 1;
    Light.updateTransformMatrix();
  },
  /*
    此函数根据Light的当前位置和平移步长，修改Light位置
    并通过html响应函数和更新变换矩阵函数
    实现Light沿z轴向外移动的操作
  */
  lightBackward: function () {
    Light.lightPosition[2] -= 1;
    Light.updateTransformMatrix();
  }
};