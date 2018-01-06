"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = require("./Component");
var MV_1 = require("./common/MV");
var Floor = /** @class */ (function (_super) {
    __extends(Floor, _super);
    function Floor() {
        var _this = _super.call(this, new MV_1.mat4(), new MV_1.mat4(), null, null) || this;
        _this.lines = 50;
        _this.halfWidth = 50;
        _this.wireframe = true;
        return _this;
    }
    Floor.build = function (gl, lines, halfWidth) {
        var floor = new Floor();
        if (lines != null) {
            floor.lines = lines;
        }
        if (halfWidth != null) {
            floor.halfWidth = halfWidth;
        }
        var delta = 2 * floor.halfWidth / floor.lines;
        var v = [];
        var i = [];
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
    };
    return Floor;
}(Component_1.Component));
exports.Floor = Floor;
//# sourceMappingURL=Floor.js.map