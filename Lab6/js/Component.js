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
var MV_1 = require("./common/MV");
var VirtualComponent_1 = require("./VirtualComponent");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(translation, rotation, parent, material) {
        var _this = _super.call(this, translation, rotation, parent) || this;
        _this.material = material;
        _this.wireframe = false;
        return _this;
    }
    Component.prototype.draw = function (app) {
        app.draw(this);
    };
    Component.prototype.setTexture = function (gl, image) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        return this;
    };
    Component.prototype.initData = function (gl, verticesAndNormals) {
        this.verticesNum = verticesAndNormals.vertices.length;
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, MV_1.flatten(verticesAndNormals.vertices), gl.STATIC_DRAW);
        this.nbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
        gl.bufferData(gl.ARRAY_BUFFER, MV_1.flatten(verticesAndNormals.normals), gl.STATIC_DRAW);
        if (verticesAndNormals.textCoords &&
            verticesAndNormals.textCoords.length != 0) {
            this.tbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
            gl.bufferData(gl.ARRAY_BUFFER, MV_1.flatten(verticesAndNormals.textCoords), gl.STATIC_DRAW);
        }
    };
    return Component;
}(VirtualComponent_1.VirtualComponent));
exports.Component = Component;
//# sourceMappingURL=Component.js.map