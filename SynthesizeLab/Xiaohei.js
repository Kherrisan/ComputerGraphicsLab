//纹理二维坐标和顶点坐标的映射函数，这里默认使用图片的(0,0)，是一个黑色的像素。
//也就是说，如果传入这个函数，永远只能得到黑色。
function texture_empty(theta, fai, size) {
  return vec2(0, 0);
}

//纹理二维坐标和顶点坐标的映射函数，需要注入到顶点坐标生成函数中(Geometry.js中的函数)，随顶点坐标一起作为返回值传出来。
function texture_coordinate(x, y, z, height, width) {
  if (z < 0) {
    return vec2(0, 0);
  }
  x = (x + width / 2.0) / width;
  y = (-y + height / 2.0) / height;
  return vec2(x, y);
}

//这个文件定义了小黑对象，该对象持有小黑的一些位置和姿态属性，实现了小黑的动作变化，并拥有相关buffer。
var Xiaohei = {
  name: "xiaohei",
  //明暗材质属性
  materialAmbient: vec4(1.0, 1.0, 1.0, 1.0),
  materialDiffuse: vec4(1.0, 1.0, 1.0, 1.0),
  materialSpecular: vec4(1.0, 1.0, 1.0, 1.0),
  shininess: 10.0,//高光度
  texture: null,
  FORWARD_STEP: 0.2, //平移步长
  ROTATE_STEP: 5,
  RotateAngle: 0, //立方体旋转角度
  RESIZE_STEP: 0.1, //放缩幅度
  position: vec3(0, 1.8, 0), //位置状态
  vbo: null,//存放顶点坐标的buffer，由createBuffer得到。
  nbo: null,//存放顶点法向量的buffer，由createBuffer得到。
  tbo: null,//存放纹理坐标的buffer，由createBuffer得到。
  size: 0.5,
  vertexNum: 0,//包含的顶点个数，drawArray的时候要用。
  useTexture: true,//是否有使用纹理映射的一个标志。
  transformMatrix: null,//代表小黑整个对象的变换矩阵。
  build: () => {
    //初始化纹理
    var image = document.getElementById("texImage");
    Xiaohei.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, Xiaohei.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    //初始化三个数组。
    var vertices = [];
    var normals = [];
    var textures = [];

    //shape_data是一个包含了一些生成顶点所必要的参数的数据结构。
    //具体shape_data各属性的意义，见Geometry.js。
    var shape_data = {
      origin: vec3(0, 0, 0),

      axis_length: vec3(
        Xiaohei.size * 5, //脸宽
        Xiaohei.size * 4,
        Xiaohei.size * 4
      ), //5:4:4
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),

      ellipse_axis: vec2(0, 0),
      angle_range: vec2(0, 360),

      height: 0,
      top_point: vec3(0, 0, 0),
    };
    //生成头部顶点坐标和法向量。它是一个椭球。需要纹理，所以传入texture_coordinate来计算纹理坐标。
    var head_vertices = ellipsoid_generator(shape_data, texture_coordinate);
    vertices = vertices.concat(head_vertices.vertices);
    normals = normals.concat(head_vertices.normals);
    textures = textures.concat(head_vertices.textures);

    shape_data.ellipse_axis = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    shape_data.top_point = vec3(
      -Xiaohei.size * 6.4,
      +Xiaohei.size * 4,
      0
    );
    //生成左耳朵顶点坐标和顶点法向量。它是一个圆锥。
    //由于耳朵不需要纹理，所以就传入texture_empty函数，生成纹理坐标的时候采用缺省坐标。
    var leftear_vertices = taper_generator(shape_data, texture_empty);
    //对左耳朵所有顶点作相对于小黑身体的变换。是一个平移变换，把耳朵移到头部左上方。
    Xiaohei.constructMatrix(
      translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      leftear_vertices.vertices
    );
    //把新生成的顶点加入到数组中去。
    vertices = vertices.concat(leftear_vertices.vertices);
    normals = normals.concat(leftear_vertices.normals);
    textures = textures.concat(leftear_vertices.textures);

    //生成左耳朵内侧的部分的顶点坐标和顶点法向量。虽然在相同颜色下，不需要生成这个部分。
    //在能够指定颜色的时候，生成这个部分是有必要的，但是自从使用了明暗之后，整个罗小黑采用一个材质属性，所以显现出来的颜色是没有区别的。
    //所以现在这个部分其实是没有必要的，但是我们没有把他去掉。
    shape_data.top_point = vec3(
      -Xiaohei.size * 6.0,
      +Xiaohei.size * 3.6,
      +Xiaohei.size * 0.35
    );
    shape_data.angle_range = vec2(100, 200);
    //生成左耳朵内部分的顶点坐标和法向量，它是一个圆锥。取缺省纹理坐标。
    var inner_leftear_vertices = taper_generator(shape_data, texture_empty);
    //对左内耳朵所有顶点作相对于小黑身体的变换。是一个平移变换，把耳朵移到头部左上方。
    Xiaohei.constructMatrix(
      translate(-Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      inner_leftear_vertices.vertices
    );
    vertices = vertices.concat(inner_leftear_vertices.vertices);
    normals = normals.concat(inner_leftear_vertices.normals);
    textures = textures.concat(inner_leftear_vertices.textures);

    shape_data.angle_range = vec2(0, 360);
    shape_data.ellipse_axis = vec2(Xiaohei.size * 5, Xiaohei.size * 3);
    shape_data.top_point = vec3(
      Xiaohei.size * 6.4,
      Xiaohei.size * 4,
      0
    );
    //生成右耳朵顶点坐标和顶点法向量。它是一个圆锥。取缺省纹理坐标。
    var rightear_vertices = taper_generator(shape_data, texture_empty);
    //对右耳朵所有顶点作相对于小黑身体的变换。是一个平移变换，把耳朵移到头部右上方。
    Xiaohei.constructMatrix(
      translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      rightear_vertices.vertices
    );
    vertices = vertices.concat(rightear_vertices.vertices);
    normals = normals.concat(rightear_vertices.normals);
    textures = textures.concat(rightear_vertices.textures);

    shape_data.top_point = vec3(
      +Xiaohei.size * 6.0,
      +Xiaohei.size * 3.6,
      +Xiaohei.size * 0.35
    );
    shape_data.angle_range = vec2(0, 90);
    //生成右耳朵内侧部分顶点坐标和法向量。它是一个圆锥。取缺省纹理坐标。
    var inner_rightear_vertices = taper_generator(shape_data, texture_empty);
    //对右内耳朵所有顶点作相对于小黑身体的变换。是一个平移变换，把耳朵移到头部右上方。
    Xiaohei.constructMatrix(
      translate(+Xiaohei.size * 0.1, +Xiaohei.size * 0.5, 0),
      inner_rightear_vertices.vertices
    );
    vertices = vertices.concat(inner_rightear_vertices.vertices);
    normals = normals.concat(inner_rightear_vertices.normals);
    textures = textures.concat(inner_rightear_vertices.textures);

    shape_data.axis_length = vec3(
      Xiaohei.size * 2,
      Xiaohei.size * 4,
      Xiaohei.size * 2
    );
    //生成身体顶点坐标法向量。它是一个椭球。取缺省纹理坐标。
    var body_vertices = ellipsoid_generator(shape_data, texture_empty);
    //对身体所有顶点作相对于小黑身体的变换。是一个平移变换，把身体平移到头部的后侧。
    Xiaohei.constructMatrix(
      translate(0, -Xiaohei.size * 3.5, -Xiaohei.size * 4.5),
      body_vertices.vertices
    );
    vertices = vertices.concat(body_vertices.vertices);
    normals = normals.concat(body_vertices.normals);
    textures = textures.concat(body_vertices.textures);

    shape_data.angle_range = vec2(0, 360);
    shape_data.height = Xiaohei.size * 4; //length
    shape_data.ellipse_axis = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    //生成左手顶点坐标和法向量。它是一个圆柱。取缺省纹理坐标。
    var lefthand_vertices = cylinder_generator(shape_data, texture_empty);
    //对左手所有顶点坐一个相对于身体的变换。先做一个平移，再做一个旋转。和右手是对称的。
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

    //生成右手顶点坐标和法向量。它是一个圆柱。取缺省纹理坐标。
    var righthand_vertices = cylinder_generator(shape_data, texture_empty);
    //对右手所有顶点坐一个相对于身体的变换。先做一个平移，再做一个旋转。和左手是对称的。
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

    shape_data.height = Xiaohei.size * 3; //length
    shape_data.ellipse_axis = vec2(Xiaohei.size * 0.8, Xiaohei.size * 0.8);
    //生成左腿顶点坐标和法向量。它是一个圆柱。取缺省纹理坐标。
    var leftfoot_vertices = cylinder_generator(shape_data, texture_empty);
    //对左腿所有顶点坐一个相对于身体的变换。先做一个平移，再做一个旋转。和右腿是对称的。
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

    //生成右腿的坐标和顶点法向量。它是一个圆柱。取缺省纹理坐标。
    var rightfoot_vertices = cylinder_generator(shape_data, texture_empty);
    //对右腿所有顶点坐一个相对于身体的变换。先做一个平移，再做一个旋转。和左腿是对称的。
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

    //保存顶点个数，用于drawArray。
    Xiaohei.vertexNum = vertices.length;

    //创建存放顶点坐标的buffer，并传入数据vertices。
    Xiaohei.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //创建存放顶点法向量的buffer，并传入数据normals。
    Xiaohei.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //创建存放纹理坐标的buffer，并传入数据textures。
    Xiaohei.tbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Xiaohei.tbo);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textures), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  },
  constructMatrix: function (matrix, vertices) {
    //matrix是一个变换矩阵，vertices是一个顶点坐标的数组。
    //这个函数实现对vertices中每个顶点坐matrix变换。
    //这个函数的主要用途是把在原地生成的基本几何形体变换到身体某部分相对于身体的合适位置。
    for (var i = 0; i < vertices.length; i++) {
      var temp = mult(
        matrix,
        vec4(vertices[i][0], vertices[i][1], vertices[i][2], 1)
      );
      vertices[i] = vec3(temp[0], temp[1], temp[2]);
    }
  },
  updateTransformMatrix: function () {
    //更新整只小黑的变换矩阵。在App.js的App.draw的时候会用到这个矩阵，传递到顶点着色器的uTMatrix中。
    //先绕原点缩放，再绕y轴旋转，再平移，即可到达最终位置。
    var RE = scalem(Xiaohei.size, Xiaohei.size, Xiaohei.size);
    var T = translate(
      Xiaohei.position[0],
      Xiaohei.position[1],
      Xiaohei.position[2]
    );
    var R = rotateY(Xiaohei.RotateAngle);
    Xiaohei.transformMatrix = mult(T, mult(R, RE));
  },
  rotateRight: function () {
    //整只小黑向右转的函数。
    Xiaohei.RotateAngle += Xiaohei.ROTATE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  rotateLeft: function () {
    //整只小黑向左转的函数。
    Xiaohei.RotateAngle -= Xiaohei.ROTATE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  walkForward: function () {
    //整只小黑向后退一步的函数。
    //后退修改的是小黑的位置，位置的变化量分解到x和z轴上（不考虑沿y轴的平移）。
    //这里做了一个正交分解。
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * -1 * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * Math.cos(radians(Xiaohei.RotateAngle));
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  walkBackward: function () {
    //整只小黑向前走一步的函数。
    //前进修改的是小黑的位置，位置的变化量分解到x和z轴上（不考虑沿y轴的平移）。
    //这里也做了一个正交分解。
    Xiaohei.position[0] +=
      Xiaohei.FORWARD_STEP * Math.sin(radians(Xiaohei.RotateAngle));
    Xiaohei.position[2] +=
      Xiaohei.FORWARD_STEP * -1 * Math.cos(radians(Xiaohei.RotateAngle));
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  shrink: function () {
    //整只小黑缩小的函数
    Xiaohei.size -= Xiaohei.RESIZE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  },
  expand: function () {
    //整只小黑变大的函数
    Xiaohei.size += Xiaohei.RESIZE_STEP;
    Xiaohei.updateTransformMatrix();
    if (Xiaohei.onChange) {
      Xiaohei.onChange();
    }
  }
};
