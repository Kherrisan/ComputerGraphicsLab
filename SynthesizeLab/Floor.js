var Floor = {
  lines: 50,
  halfWidth: 50,
  wireframe: true,
  color: [0.7, 0.7, 0.7, 1],
  perVertexColor: false,
  useTexture:false,
  indicesNum: false,
  build: (l, hw) => {
    if (l) Floor.lines = l;
    if (hw) Floor.halfWidth = hw;
    var delta = 2 * Floor.halfWidth / Floor.lines;
    var v = [];
    var i = [];

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

    Floor.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Floor.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Floor.indicesNum=i.length;
    Floor.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Floor.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
};
