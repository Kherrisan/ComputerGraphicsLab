//heixiu的纹理二维坐标和顶点坐标的映射函数，这里默认使用图片的(0,0)，是一个黑色的像素。
//也就是说，如果传入这个函数，永远只能得到黑色。
Heixiu.prototype.texture_empty = function (theta, fai, size) {
  return vec2(0, 0);
}

//hexiu的纹理二维坐标和顶点坐标的映射函数，需要注入到顶点坐标生成函数中(Geometry.js中的函数)，随顶点坐标一起作为返回值传出来。
Heixiu.prototype.texture_coordinate = function (x, y, z, height, width) {
  if (z < 0) {
    return vec2(0, 0);
  }
  x = (x + width / 2.0) / width;
  y = (-y + height / 2.0) / height;
  return vec2(x, y);
}

//heixiu类
function Heixiu() {
  this.materialAmbient = vec4(0.1, 0.1, 0.1, 1.0);//对象的材质环境光参数
  this.materialDiffuse = vec4(0.2, 0.2, 0.2, 1.0);//对象的材质散射光参数
  this.materialSpecular = vec4(0.01, 0.01, 0.01, 1.0);//对象的材质镜面光参数
  this.shininess = 1.0;//对象的高光度
  this.useTexture = true;//是否使用纹理
  this.texture = null;//纹理属性
  this.FORWARD_STEP = 0.5;//平移步长
  this.ROTATE_STEP = 5;//旋转步长
  this.RESIZE_STEP = 0.1;//缩放步长
  this.rotateAngle = 0; //旋转初始角度
  this.position = null; //对象位置
  this.size = 0.2; //对象尺寸单位
  this.vbo = null;//存放顶点坐标的缓存区 vertices buffer object
  this.cbo = null;//存放颜色坐标的缓存区 color buffer object
  this.nbo = null;//存放法向量坐标的缓存区 normal buffer object
  this.tbo = null;//存放纹理坐标的缓存区 texture buffer object
  this.vertexNum = 0;//顶点的数量
  this.transformMatrix = null;//变换矩阵
  this.onChange = null;//激活响应函数的属性
} 

/*
  heixiu对象生成的时候，用于设置黑修对象的位置 
*/
Heixiu.prototype.setLocation = function (a, b, c) {
  this.position = vec3(a, b, c);
  this.updateTransformMatrix();
};

/*
  heixiu对象初始化：顶点，纹理，法向量坐标
  build中根据黑修身体的不同部位，一次计算好以上的所有坐标，创建并且存入缓存区
*/

Heixiu.prototype.build = function () {

  //通过dom从html中获取到image资源作为黑修的纹理
  var image = document.getElementById("heixiuImage");
  //创建纹理映射并且绑定
  this.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  //初始化顶点，纹理和法向量坐标的数组
  var vertices = [];
  var textures = [];
  var normals = [];
  //初始化shape_data的所有属性用于绘制简单几何体
  //所有简单几何体能够组成整个heixiu
  var shape_data = {
    origin: vec3(0, 0, 0),

    axis_length: vec3(this.size * 5, this.size * 4, this.size * 4), 
    angle_range_vertical: vec2(0, 180),
    angle_range_horizontal: vec2(0, 360),

    ellipse_axis: vec2(0, 0, 0),
    top_point: vec3(0, 0, 0),
    angle_range: vec2(0, 360),
  };
  //通过调用Geometry.js中的generator函数计算好heixiu身体的顶点，纹理和法向量的坐标并存入对应数组
  var body_vertices = ellipsoid_generator(shape_data, texture_coordinate);
  vertices = vertices.concat(body_vertices.vertices);
  textures = textures.concat(body_vertices.textures);
  normals = normals.concat(body_vertices.normals);

  //修改shape_data相关属性的数据，用于生成heixiu的右耳朵的相关参数
  shape_data.ellipse_axis = vec2(this.size * 1.5, this.size * 1.5);
  shape_data.top_point = vec3(0, 2 * this.size + 0.5, 0);

  //通过调用Geometry.js中的generator函数计算好heixiu右耳朵的顶点，纹理和法向量的坐标并存入对应数组
  var rightear_vertices = taper_generator(shape_data, texture_empty);
  //对右耳朵所有顶点作相对于黑修origin原点的变换。是一个平移和旋转变换，把耳朵移到头部右上方。
  this.constructMatrix(
    mult(translate(-this.size * 2.5, this.size * 2, 0), rotateZ(-20)),
    rightear_vertices.vertices
  );
  vertices = vertices.concat(rightear_vertices.vertices);
  textures = textures.concat(rightear_vertices.textures);
  normals = normals.concat(rightear_vertices.normals);

  //通过调用Geometry.js中的generator函数计算好heixiu左耳朵的顶点，纹理和法向量的坐标并存入对应数组
  var leftear_vertices = taper_generator(shape_data, texture_empty);
  //对左耳朵所有顶点作相对于黑修origin原点的变换。是一个平移和旋转变换，把耳朵移到头部左上方。
  this.constructMatrix(
    mult(translate(this.size * 2.5, this.size * 2, 0), rotateZ(20)),
    leftear_vertices.vertices
  );
  vertices = vertices.concat(leftear_vertices.vertices);
  textures = textures.concat(leftear_vertices.textures);
  normals = normals.concat(leftear_vertices.normals);


  //保存顶点个数，用于drawArray
  this.vertexNum = vertices.length;
  //分别针对vbo，nbo，tbo创建相对应的缓存区
  //并且将对应的顶点，法向量和纹理坐标数组绑定到对应的缓存区上
  this.vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  this.nbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  this.tbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(textures), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
};
/*
  heixiu对象生成和变换的时候，用于更新黑修变换矩阵的函数
*/
Heixiu.prototype.updateTransformMatrix = function () {
  //update transform matrix
  var RE = scalem(this.size, this.size, this.size);
  var T = translate(this.position[0], this.position[1], this.position[2]);
  var R = rotateY(this.rotateAngle);
  this.transformMatrix = mult(T, mult(R, RE));

  if (this.onChange) {
    this.onChange();
  }
};
/*
  heixiu对象生成的时候，用于设置黑修的身体（左右耳朵）初始位置和角度的函数
*/
Heixiu.prototype.constructMatrix = function (matrix, vertices) {
  for (var i = 0; i < vertices.length; i++) {
    var temp = mult(
      matrix,
      vec4(vertices[i][0], vertices[i][1], vertices[i][2], 1)
    );
    vertices[i] = vec3(temp[0], temp[1], temp[2]);
  }
};
/*
  此函数根据heixiu对象的现有旋转角度和平移步长，计算出heixiu的正交位移量
  并通过html响应函数和更新变换矩阵函数
  实现heixiu前进的操作
*/
Heixiu.prototype.walkForward = function () {
  this.position[0] +=
    this.FORWARD_STEP * -1 * Math.sin(radians(this.rotateAngle));
  this.position[2] += this.FORWARD_STEP * Math.cos(radians(this.rotateAngle));
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};
/*
  此函数根据heixiu对象的现有旋转角度和平移步长，计算出heixiu的正交位移量
  并通过html响应函数和更新变换矩阵函数
  实现heixiu后退的操作
*/
Heixiu.prototype.walkBackward = function () {
  this.position[0] += this.FORWARD_STEP * Math.sin(radians(this.rotateAngle));
  this.position[2] +=
    this.FORWARD_STEP * -1 * Math.cos(radians(this.rotateAngle));
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};
/*
  此函数根据heixiu的现有旋转角度和旋转步长，修改旋转角度
  并通过html响应函数和更新变换矩阵函数
  实现heixiu向左旋转的操作
*/
Heixiu.prototype.rotateLeft = function () {
  this.rotateAngle -= this.ROTATE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};
/*
  此函数根据heixiu的现有旋转角度和旋转步长，修改旋转角度
  并通过html响应函数和更新变换矩阵函数
  实现heixiu向右旋转的操作
*/
Heixiu.prototype.rotateRight = function () {
  this.rotateAngle += this.ROTATE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};
/*
  此函数根据heixiu的size单位属性和缩放步长，修改size单位大小
  并通过html响应函数和更新变换矩阵函数
  实现heixiu整体变小的操作
*/
Heixiu.prototype.shrink = function () {
  this.size -= this.RESIZE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};
/*
  此函数根据heixiu的size单位属性和缩放步长，修改size单位大小
  并通过html响应函数和更新变换矩阵函数
  实现heixiu整体变大的操作
*/
Heixiu.prototype.expand = function () {
  this.size += this.RESIZE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};