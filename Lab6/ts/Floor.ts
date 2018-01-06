import { Component } from "./Component";
import { mat4 } from "./common/MV";

export class Floor extends Component {
  private lines: number = 50;
  private halfWidth: number = 50;
  public wireframe: boolean = true;
  private constructor() {
    super(new mat4(), new mat4(), null, null);
  }
  public static build(gl: any, lines: number, halfWidth: number): Floor {
    let floor = new Floor();
    if (lines != null) {
      floor.lines = lines;
    }
    if (halfWidth != null) {
      floor.halfWidth = halfWidth;
    }
    let delta = 2 * floor.halfWidth / floor.lines;
    let v = [];
    let i = [];
    for (var iline = 0; iline <= floor.lines; iline++) {
      //左侧顶点坐标
      v[6 * iline] = -floor.halfWidth;
      v[6 * iline + 1] = 0;
      v[6 * iline + 2] = -floor.halfWidth + iline * delta;

      //右侧顶点坐标，与左侧相连形成水平线
      v[6 * iline + 3] = floor.halfWidth;
      v[6 * iline + 4] = 0;
      v[6 * iline + 5] = -floor.halfWidth + iline * delta;

      //以下是前后侧顶点相连成垂直线
      v[6 * (floor.lines + 1) + 6 * iline] = -floor.halfWidth + iline * delta;
      v[6 * (floor.lines + 1) + 6 * iline + 1] = 0;
      v[6 * (floor.lines + 1) + 6 * iline + 2] = -floor.halfWidth;
      v[6 * (floor.lines + 1) + 6 * iline + 3] =
        -floor.halfWidth + iline * delta;
      v[6 * (floor.lines + 1) + 6 * iline + 4] = 0;
      v[6 * (floor.lines + 1) + 6 * iline + 5] = floor.halfWidth;

      //连接顶点
      i[2 * iline] = 2 * iline;
      i[2 * iline + 1] = 2 * iline + 1;
      i[2 * (floor.lines + 1) + 2 * iline] = 2 * (floor.lines + 1) + 2 * iline;
      i[2 * (floor.lines + 1) + 2 * iline + 1] =
        2 * (floor.lines + 1) + 2 * iline + 1;
    }
    floor.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floor.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    floor.indicesNum = i.length;
    floor.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floor.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return floor;
  }
}
