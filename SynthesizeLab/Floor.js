var Floor = {
  lines: 50, //行数
  halfWidth: 50, //半宽
  wireframe: true, //线框画法
  color: [0.7, 0.7, 0.7, 1], //颜色
  indicesNum: 0,
  /*
    floor对象初始化：顶点，索引坐标
    build中根据计算好的所有坐标，创建并且存入缓存区
  */
  build: (l, hw) => {
    //传入lines和halfWidth
    if (l) Floor.lines = l;
    if (hw) Floor.halfWidth = hw;
    //格子的间距
    var delta = 2 * Floor.halfWidth / Floor.lines;
    //初始化存入顶点和索引的数组
    var v = [];
    var i = [];

    //计算顶点和索引坐标
    for (var iline = 0; iline <= Floor.lines; iline++) {
      //左侧顶点坐标
      v[6 * iline] = -Floor.halfWidth;
      v[6 * iline + 1] = 0;
      v[6 * iline + 2] = -Floor.halfWidth + iline * delta;
        
      //右侧顶点坐标，与左侧相连形成水平线
      v[6 * iline + 3] = Floor.halfWidth;
      v[6 * iline + 4] = 0;
      v[6 * iline + 5] = -Floor.halfWidth + iline * delta;

      //以下是前后侧顶点相连成垂直线
      v[6 * (Floor.lines + 1) + 6 * iline] = -Floor.halfWidth + iline * delta;
      v[6 * (Floor.lines + 1) + 6 * iline + 1] = 0;
      v[6 * (Floor.lines + 1) + 6 * iline + 2] = -Floor.halfWidth;
      v[6 * (Floor.lines + 1) + 6 * iline + 3] =
        -Floor.halfWidth + iline * delta;
      v[6 * (Floor.lines + 1) + 6 * iline + 4] = 0;
      v[6 * (Floor.lines + 1) + 6 * iline + 5] = Floor.halfWidth;

      //连接顶点
      i[2 * iline] = 2 * iline;
      i[2 * iline + 1] = 2 * iline + 1;
      i[2 * (Floor.lines + 1) + 2 * iline] = 2 * (Floor.lines + 1) + 2 * iline;
      i[2 * (Floor.lines + 1) + 2 * iline + 1] =
        2 * (Floor.lines + 1) + 2 * iline + 1;
    }
    //分别针对vbo，ibo创建相对应的缓存区
    //并且将对应的顶点，索引坐标数组绑定到对应的缓存区上
    Floor.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Floor.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //存入索引数量到indicesNum
    Floor.indicesNum=i.length;

    Floor.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Floor.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
};
