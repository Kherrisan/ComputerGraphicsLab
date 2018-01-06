(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webgl_utils_1 = require("./common/webgl-utils");
var MV_1 = require("./common/MV");
var initShaders_1 = require("./common/initShaders");
var Floor_1 = require("./Floor");
var Light_1 = require("./Light");
var Camera_1 = require("./Camera");
var CameraInteractor_1 = require("./CameraInteractor");
var Xiaohei_1 = require("./Xiaohei");
var App = /** @class */ (function () {
    function App() {
        var canvas = document.getElementById("gl-canvas");
        this.gl = webgl_utils_1.WebGLUtils.setupWebGL(canvas);
        this.gl.clearColor(0.3, 0.3, 0.3, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;
        this.gl.enable(this.gl.DEPTH_TEST);
        var program = initShaders_1.initShaders(this.gl, "vertex-shader", "fragment-shader");
        this.gl.useProgram(program);
        this.initShaderVariable(program);
        this.initPerspective();
        this.initComponents();
        this.initCamera(canvas);
        this.setLight(Light_1.Light.build());
    }
    App.run = function () {
        var app = new App();
        app.render();
    };
    App.prototype.initPerspective = function () {
        this.perspectiveMatrix = MV_1.perspective(50, this.viewportWidth / this.viewportHeight, 1, 1000.0);
        return this;
    };
    App.prototype.setLight = function (light) {
        this.light = light;
        return this;
    };
    App.prototype.initCamera = function (canvas) {
        this.camera = new Camera_1.Camera(0, 2, 10, this);
        this.cameraInteractor = new CameraInteractor_1.CameraInteractor(canvas, this.camera);
        return this;
    };
    App.prototype.initComponents = function () {
        this.components = new Array();
        this.addComponent(Floor_1.Floor.build(this.gl, 40, 20));
        this.addComponent(Xiaohei_1.Xiaohei.build(this.gl, 0, 0, 0));
        return this;
    };
    App.prototype.addComponent = function (component) {
        this.components.push(component);
    };
    App.prototype.initShaderVariable = function (program) {
        this.aVertexPosition = this.gl.getAttribLocation(program, "aVertexPosition");
        this.aTextureCoord = this.gl.getAttribLocation(program, "aTextureCoord");
        this.uMVMatrix = this.gl.getUniformLocation(program, "uMVMatrix");
        this.uTMatrix = this.gl.getUniformLocation(program, "uTMatrix");
        this.uPMatrix = this.gl.getUniformLocation(program, "uPMatrix");
        this.uLightPosition = this.gl.getUniformLocation(program, "uLightPosition");
        this.aVertexNormal = this.gl.getAttribLocation(program, "aVertexNormal");
        this.uAmbientProduct = this.gl.getUniformLocation(program, "uAmbientProduct");
        this.uDiffuseProduct = this.gl.getUniformLocation(program, "uDiffuseProduct");
        this.uSpecularProduct = this.gl.getUniformLocation(program, "uSpecularProduct");
        this.uShininess = this.gl.getUniformLocation(program, "uShininess");
        this.uTexture = this.gl.getUniformLocation(program, "uTexture");
        this.uUseTexture = this.gl.getUniformLocation(program, "uUseTexture");
    };
    App.prototype.render = function () {
        this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.updateMatrixUniforms();
        for (var _i = 0, _a = this.components; _i < _a.length; _i++) {
            var component = _a[_i];
            component.draw(this);
        }
    };
    App.prototype.updateMatrixUniforms = function () {
        this.gl.uniformMatrix4fv(this.uMVMatrix, false, MV_1.flatten(this.camera.getModelViewMatrix()));
        this.gl.uniformMatrix4fv(this.uPMatrix, false, MV_1.flatten(this.perspectiveMatrix));
        // let modelViewMatrix = this.camera.getModelViewMatrix();
        // let normalMatrix = [
        //   new vec3(
        //     modelViewMatrix[0][0],
        //     modelViewMatrix[0][1],
        //     modelViewMatrix[0][2]
        //   ),
        //   new vec3(
        //     modelViewMatrix[1][0],
        //     modelViewMatrix[1][1],
        //     modelViewMatrix[1][2]
        //   ),
        //   new vec3(
        //     modelViewMatrix[2][0],
        //     modelViewMatrix[2][1],
        //     modelViewMatrix[2][2]
        //   )
        // ];
        // this.gl.uniformMatrix3fv(this.uNMatrix, false, flatten(normalMatrix));
    };
    App.prototype.draw = function (component) {
        this.updateLight(component);
        this.gl.uniformMatrix4fv(this.uTMatrix, false, MV_1.flatten(component.getTransformMatrix()));
        //如果这个component绑定了纹理，就把纹理贴上去。
        if (component.texture) {
            this.gl.uniform1i(this.uUseTexture, true);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, component.tbo);
            this.gl.vertexAttribPointer(this.aTextureCoord, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.aTextureCoord);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, component.texture);
            this.gl.uniform1i(this.uTexture, 0);
        }
        else {
            this.gl.uniform1i(this.uUseTexture, false);
        }
        //如果不是线框图，就传顶点法向量buffer。
        if (!component.wireframe) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, component.nbo);
            this.gl.vertexAttribPointer(this.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(this.aVertexNormal);
        }
        //传顶点坐标
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, component.vbo);
        this.gl.vertexAttribPointer(this.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aVertexPosition);
        if (component.ibo != null) {
            //如果是有index.
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, component.ibo);
            if (component.wireframe) {
                //如果是线框图，LINES。
                this.gl.drawElements(this.gl.LINES, component.indicesNum, this.gl.UNSIGNED_SHORT, 0);
            }
            else {
                //如果不是线框图，TRIANGLES。
                this.gl.drawElements(this.gl.TRIANGLES, component.indicesNum, this.gl.UNSIGNED_SHORT, 0);
            }
        }
        else {
            //没有ibo，根据vbo，drawArrays
            this.gl.drawArrays(this.gl.TRIANGLES, 0, component.verticesNum);
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    };
    App.prototype.updateLight = function (component) {
        if (component.material != null) {
            var ambientProduct = MV_1.mult(this.light.ambient, component.material.ambient);
            var diffuseProduct = MV_1.mult(this.light.diffuse, component.material.diffuse);
            var specularProduct = MV_1.mult(this.light.specular, component.material.specular);
            this.gl.uniform4fv(this.uAmbientProduct, ambientProduct);
            this.gl.uniform4fv(this.uDiffuseProduct, diffuseProduct);
            this.gl.uniform4fv(this.uSpecularProduct, specularProduct);
            this.gl.uniform1f(this.uShininess, component.material.shininess);
            this.gl.uniform4fv(this.uLightPosition, this.light.position);
        }
        else {
            this.gl.uniform4fv(this.uAmbientProduct, new MV_1.vec4());
            this.gl.uniform4fv(this.uDiffuseProduct, new MV_1.vec4());
            this.gl.uniform4fv(this.uSpecularProduct, new MV_1.vec4());
            this.gl.uniform1f(this.uShininess, 100);
        }
    };
    return App;
}());
exports.App = App;
window.onload = App.run;

},{"./Camera":2,"./CameraInteractor":3,"./Floor":5,"./Light":7,"./Xiaohei":10,"./common/MV":11,"./common/initShaders":12,"./common/webgl-utils":13}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MV_1 = require("./common/MV");
var Camera = /** @class */ (function () {
    function Camera(x, y, z, app) {
        this.app = app;
        this.azimuth = 0.0;
        this.elevation = 0.0;
        this.position = new MV_1.vec3(x, y, z);
    }
    Camera.prototype.getModelViewMatrix = function () {
        var matrix = new MV_1.mat4();
        matrix = MV_1.mult(matrix, MV_1.translate(this.position));
        matrix = MV_1.mult(matrix, MV_1.rotateY(this.azimuth));
        matrix = MV_1.mult(matrix, MV_1.rotateX(this.elevation));
        return MV_1.inverse4(matrix);
    };
    Camera.prototype.changePosition = function (position) {
        this.position = position;
        this.app.render();
    };
    Camera.prototype.changeElevation = function (delta) {
        this.elevation += delta;
        if (this.elevation > 360 || this.elevation < -360) {
            this.elevation = this.elevation % 360;
        }
        this.app.render();
    };
    Camera.prototype.changeAzimuth = function (delta) {
        this.azimuth += delta;
        if (this.azimuth > 360 || this.azimuth < -360) {
            this.azimuth = this.azimuth % 360;
        }
        this.app.render();
    };
    return Camera;
}());
exports.Camera = Camera;

},{"./common/MV":11}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CameraInteractor = /** @class */ (function () {
    function CameraInteractor(canvas, camera) {
        var _this = this;
        this.canvas = canvas;
        this.camera = camera;
        this.dragging = false;
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.canvas.onmousedown = function (ev) {
            _this.onMouseDown(ev);
        };
        this.canvas.onmouseup = function (ev) {
            _this.onMouseUp();
        };
        this.canvas.onmousemove = function (ev) {
            _this.onMouseMove(ev);
        };
    }
    CameraInteractor.prototype.rotate = function (dx, dy) {
        var dElevation = -20.0 / this.canvas.height;
        var dAzimuth = -20.0 / this.canvas.width;
        var nAzimuth = dx * dAzimuth * CameraInteractor.MOTION_FACTOR; //方位角
        var nElevation = dy * dElevation * CameraInteractor.MOTION_FACTOR; //仰角
        this.camera.changeAzimuth(nAzimuth);
        this.camera.changeElevation(nElevation);
    };
    CameraInteractor.prototype.onMouseUp = function () {
        this.dragging = false;
    };
    CameraInteractor.prototype.onMouseDown = function (ev) {
        this.dragging = true;
        this.x = ev.clientX;
        this.y = ev.clientY;
    };
    CameraInteractor.prototype.onMouseMove = function (ev) {
        if (!this.dragging)
            return;
        this.lastX = this.x;
        this.lastY = this.y;
        this.x = ev.clientX;
        this.y = ev.clientY;
        var dx = this.x - this.lastX;
        var dy = this.y - this.lastY;
        this.rotate(dx, dy);
    };
    CameraInteractor.MOTION_FACTOR = 10.0;
    return CameraInteractor;
}());
exports.CameraInteractor = CameraInteractor;

},{}],4:[function(require,module,exports){
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

},{"./VirtualComponent":9,"./common/MV":11}],5:[function(require,module,exports){
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

},{"./Component":4,"./common/MV":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MV_1 = require("./common/MV");
/*
    This is the function to create an ellipsoid points.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,axis_length,angle_range_vertical,angle_range_horizontal}
            1. property "origin" means the center point of the ellipsoid. It should be an array with 3 elements.
            2. property "axis_length" defines the size of the ellipsoid. It should be an array with 3 elements.
            3. property "angle_range_vertical" defines the range of the ellipsoid to be drawn vertically. It
               should be an array with 2 elements. And the range of these two elements is 0 to 180.
            4. property "angle_range_horizontal" defines the range of the ellipsoid to be drawn horizontally.
               It should be an array with 2 elements. And the range of these two lements is 0 to 360.
 */
function ellipsoid_generator(shape_data, getTextureCoords) {
    var a = shape_data["axis_length"][0];
    var b = shape_data["axis_length"][1];
    var c = shape_data["axis_length"][2];
    var abias = shape_data["origin"][0];
    var bbias = shape_data["origin"][1];
    var cbias = shape_data["origin"][2];
    var points = [];
    var normals = [];
    var textures = [];
    var theta_step = 3;
    var fai_step = 3;
    for (var theta = shape_data["angle_range_vertical"][0]; theta < shape_data["angle_range_vertical"][1]; theta += theta_step) {
        for (var fai = shape_data["angle_range_horizontal"][0]; fai < shape_data["angle_range_horizontal"][1]; fai += fai_step) {
            var p1 = new MV_1.vec3(a * Math.sin(theta / 180 * Math.PI) * Math.cos(fai / 180 * Math.PI) +
                abias, c * Math.cos(theta / 180 * Math.PI) + bbias, b * Math.sin(theta / 180 * Math.PI) * Math.sin(fai / 180 * Math.PI) +
                cbias);
            var n1 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p1);
            if (getTextureCoords) {
                var t1 = getTextureCoords(p1[0] - abias, p1[1] - bbias, p1[2] - cbias, 2.0 * a, 2.0 * c);
            }
            var p2 = new MV_1.vec3(a *
                Math.sin((theta + theta_step) / 180 * Math.PI) *
                Math.cos(fai / 180 * Math.PI) +
                abias, c * Math.cos((theta + theta_step) / 180 * Math.PI) + bbias, b *
                Math.sin((theta + theta_step) / 180 * Math.PI) *
                Math.sin(fai / 180 * Math.PI) +
                cbias);
            var n2 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p2);
            if (getTextureCoords) {
                var t2 = getTextureCoords(p2[0] - abias, p2[1] - bbias, p2[2] - cbias, 2.0 * a, 2.0 * c);
            }
            var p3 = new MV_1.vec3(a *
                Math.sin((theta + theta_step) / 180 * Math.PI) *
                Math.cos((fai + fai_step) / 180 * Math.PI) +
                abias, c * Math.cos((theta + theta_step) / 180 * Math.PI) + bbias, b *
                Math.sin((theta + theta_step) / 180 * Math.PI) *
                Math.sin((fai + fai_step) / 180 * Math.PI) +
                cbias);
            var n3 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p3);
            if (getTextureCoords) {
                var t3 = getTextureCoords(p3[0] - abias, p3[1] - bbias, p3[2] - cbias, 2.0 * a, 2.0 * c);
            }
            var p4 = new MV_1.vec3(a *
                Math.sin(theta / 180 * Math.PI) *
                Math.cos((fai + fai_step) / 180 * Math.PI) +
                abias, c * Math.cos(theta / 180 * Math.PI) + bbias, b *
                Math.sin(theta / 180 * Math.PI) *
                Math.sin((fai + fai_step) / 180 * Math.PI) +
                cbias);
            var n4 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p1);
            if (getTextureCoords) {
                var t4 = getTextureCoords(p4[0] - abias, p4[1] - bbias, p4[2] - cbias, 2.0 * a, 2.0 * c);
            }
            points.push(p1);
            normals.push(n1);
            points.push(p2);
            normals.push(n2);
            points.push(p3);
            normals.push(n3);
            points.push(p1);
            normals.push(n1);
            points.push(p3);
            normals.push(n3);
            points.push(p4);
            normals.push(n4);
            if (getTextureCoords) {
                textures.push(t1);
                textures.push(t2);
                textures.push(t3);
                textures.push(t1);
                textures.push(t3);
                textures.push(t4);
            }
        }
    }
    return {
        vertices: points,
        normals: normals,
        textCoords: textures
    };
}
exports.ellipsoid_generator = ellipsoid_generator;
/*
    This is the function to create a cylinder points.
    @param shape_data:
        this parameter contains the necessary information for creating an cylinder. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,ellipse_axis,height,angle_range}
            1. property "origin" means the center point of the ellipsoid. It should be an array with 3 elements.
            2. property "ellipse_axis" defines the size of the bottom ellipse of the cylinder. It should be an
               array with 2 elements.
            3. property "height" defines the height of the cylinder. It should be number.
            4. property "angle_range" defines the range of the cylinder to be drawn horizontally.
               It should be an array with 2 elements. And the range of these two elements is 0 to 360.
 */
function cylinder_generator(shape_data) {
    var points = [];
    var normals = [];
    var abias = shape_data["origin"][0];
    var bbias = shape_data["origin"][1];
    var cbias = shape_data["origin"][2];
    var a = shape_data["ellipse_axis"][0];
    var b = shape_data["ellipse_axis"][1];
    for (var theta = shape_data["angle_range"][0]; theta <= shape_data["angle_range"][1]; theta += 1) {
        var p1 = new MV_1.vec3(a * Math.cos(theta / 180 * Math.PI) + abias, -shape_data["height"] / 2 + bbias, b * Math.sin(theta / 180 * Math.PI) + cbias);
        var p2 = new MV_1.vec3(a * Math.cos(theta / 180 * Math.PI) + abias, shape_data["height"] / 2 + bbias, b * Math.sin(theta / 180 * Math.PI) + cbias);
        var p3 = new MV_1.vec3(a * Math.cos((theta + 1) / 180 * Math.PI) + abias, shape_data["height"] / 2 + bbias, b * Math.sin((theta + 1) / 180 * Math.PI) + cbias);
        var p4 = new MV_1.vec3(a * Math.cos((theta + 1) / 180 * Math.PI) + abias, -shape_data["height"] / 2 + bbias, b * Math.sin((theta + 1) / 180 * Math.PI) + cbias);
        var normal = new MV_1.vec3(MV_1.cross(MV_1.subtract(p2, p1), MV_1.subtract(p3, p1)));
        points.push(p1);
        points.push(p2);
        points.push(p3);
        points.push(p1);
        points.push(p3);
        points.push(p4);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
    }
    return {
        vertices: points,
        normals: normals
    };
}
exports.cylinder_generator = cylinder_generator;
/*
    This is the function to create a taper points.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,axis_length,angle_range_vertical,angle_range_horizontal}
            1. property "origin" means the center point of the bottom of the taper. It should be an array with 3 elements.
            2. property "ellipse_axis" defines the size of the ellipsoid. It should be an array with 3 elements.
            3. property "top_point" defines the top point position. It should be an array with 3 elements.
            4. property "angle_range" defines the range of the bottom ellipse of the taper. It should be an
               array with 2 elements, ranging from 0 to 360.
 */
function taper_generator(shape_data) {
    var points = [];
    var normals = [];
    var abias = shape_data["origin"][0];
    var bbias = shape_data["origin"][1];
    var cbias = shape_data["origin"][2];
    var a = shape_data["ellipse_axis"][0];
    var b = shape_data["ellipse_axis"][1];
    for (var theta = shape_data["angle_range"][0]; theta < shape_data["angle_range"][1]; theta++) {
        var p1 = new MV_1.vec3(shape_data["top_point"][0], shape_data["top_point"][1], shape_data["top_point"][2]);
        var p2 = new MV_1.vec3(a * Math.cos(theta / 180 * Math.PI) + abias, bbias, b * Math.sin(theta / 180 * Math.PI) + cbias);
        var p3 = new MV_1.vec3(a * Math.cos((theta + 1) / 180 * Math.PI) + abias, bbias, b * Math.sin((theta + 1) / 180 * Math.PI) + cbias);
        var normal = new MV_1.vec3(MV_1.cross(MV_1.subtract(p2, p1), MV_1.subtract(p3, p1)));
        points.push(p1);
        points.push(p2);
        points.push(p3);
        normals.push(normal);
        normals.push(normal);
        normals.push(normal);
    }
    return {
        vertices: points,
        normals: normals
    };
}
exports.taper_generator = taper_generator;
function get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p) {
    return new MV_1.vec3(Math.sqrt(a * a + b * b + c * c) /
        2 /
        Math.sqrt(Math.pow(p[0] - abias, 2) +
            Math.pow(p[1] - cbias, 2) +
            Math.pow(p[2] - bbias, 2)) *
        2 *
        (p[0] - abias) /
        a /
        a, Math.sqrt(a * a + b * b + c * c) /
        2 /
        Math.sqrt(Math.pow(p[0] - abias, 2) +
            Math.pow(p[1] - cbias, 2) +
            Math.pow(p[2] - bbias, 2)) *
        2 *
        (p[1] - cbias) /
        c /
        c, Math.sqrt(a * a + b * b + c * c) /
        2 /
        Math.sqrt(Math.pow(p[0] - abias, 2) +
            Math.pow(p[1] - cbias, 2) +
            Math.pow(p[2] - bbias, 2)) *
        2 *
        (p[2] - bbias) /
        b /
        b);
}
/*
    This is the function to create a cuboid points.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{bottom_leftup, bottom_leftdown, bottom_rightup, bottom_rightdown, height}
            1. property "bottom_leftup" means the left-up point of the bottom of the cuboid. It should be an array with 3 elements.
            2. property "bottom_leftdown" means the left-down point of the bottom of the cuboid. It should be an array with 3 elements.
            3. property "bottom_rightup" means the right-up point of the bottom of the cuboid. It should be an array with 3 elements.
            4. property "bottom_rightdown" means the left-up point of the bottom of the cuboid. It should be an array with 3 elements.
            5. property "height" means the height of the cuboid. It should be an number.
 */
function cuboid_generator(shape_data) {
    var pointArray;
    var points;
    var normals;
    var indice = [
        1,
        3,
        8,
        1,
        8,
        5,
        1,
        6,
        7,
        1,
        7,
        3,
        6,
        2,
        4,
        6,
        4,
        7,
        2,
        5,
        8,
        2,
        8,
        4,
        3,
        7,
        4,
        3,
        4,
        8,
        1,
        5,
        2,
        1,
        2,
        6
    ];
    for (var k = 0; k < 36; k++)
        indice[k]--;
    var p1 = new MV_1.vec3(shape_data["bottom_leftup"][0], shape_data["bottom_leftup"][1], shape_data["bottom_leftup"][2]);
    pointArray.push(p1);
    var p2 = new MV_1.vec3(shape_data["bottom_rightdown"][0], shape_data["bottom_rightdown"][1], shape_data["bottom_rightdown"][3]);
    pointArray.push(p2);
    var p3 = new MV_1.vec3(shape_data["bottom_leftup"][0], shape_data["bottom_leftup"][1] + shape_data["height"], shape_data["bottom_leftup"][2]);
    pointArray.push(p3);
    var p4 = new MV_1.vec3(shape_data["bottom_rightdown"][0], shape_data["bottom_rightdown"][1] + shape_data["height"], shape_data["bottom_rightdown"][2]);
    pointArray.push(p4);
    var p5 = new MV_1.vec3(shape_data["bottom_leftdown"][0], shape_data["bottom_leftdown"][1], shape_data["bottom_leftdown"][2]);
    pointArray.push(p5);
    var p6 = new MV_1.vec3(shape_data["bottom_rightup"][0], shape_data["bottom_rightup"][1], shape_data["bottom_rightup"][2]);
    pointArray.push(p6);
    var p7 = new MV_1.vec3(shape_data["bottom_rightup"][0], shape_data["bottom_rightup"][1] + shape_data["height"], shape_data["bottom_rightup"][2]);
    pointArray.push(p7);
    var p8 = new MV_1.vec3(shape_data["bottom_leftdown"][0], shape_data["bottom_leftdown"][1] + shape_data["height"], shape_data["bottom_leftdown"][2]);
    pointArray.push(p8);
    var normal_tmp;
    for (var i = 0; i < 36; i += 6) {
        normal_tmp = get_rectangle_normals([
            pointArray[indice[i]],
            pointArray[indice[i + 1]],
            pointArray[indice[i + 2]],
            pointArray[indice[i + 5]]
        ]);
        for (var j = 0; j < 6; j++) {
            normals.push(normal_tmp[j]);
            points.push(pointArray[indice[i + j]]);
        }
    }
    return {
        vertices: points,
        normals: normals
    };
}
exports.cuboid_generator = cuboid_generator;
function get_rectangle_normals(vertices) {
    var t1 = MV_1.subtract(vertices[2], vertices[0]);
    var t2 = MV_1.subtract(vertices[1], vertices[3]);
    var normal = new MV_1.vec3(MV_1.cross(t1, t2));
    return [normal, normal, normal, normal, normal, normal];
}

},{"./common/MV":11}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MV_1 = require("./common/MV");
var Light = /** @class */ (function () {
    function Light(ambient, specular, diffuse) {
        this.ambient = ambient;
        this.specular = specular;
        this.diffuse = diffuse;
    }
    Light.build = function () {
        var light = new Light(new MV_1.vec4(1.0, 1.0, 1.0, 1.0), new MV_1.vec4(1.0, 1.0, 1.0, 1.0), new MV_1.vec4(1.0, 1.0, 1.0, 1.0));
        light.position = new MV_1.vec4(0, 0, 10, 1);
        return light;
    };
    return Light;
}());
exports.Light = Light;

},{"./common/MV":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MV_1 = require("./common/MV");
var Material = /** @class */ (function () {
    function Material(ambient, specular, diffuse, shininess) {
        this.ambient = ambient;
        this.specular = specular;
        this.diffuse = diffuse;
        this.shininess = shininess;
    }
    Material.Black = new Material(new MV_1.vec4(0.1, 0.1, 0.1, 1.0), new MV_1.vec4(0.2, 0.2, 0.2, 10), new MV_1.vec4(0.01, 0.01, 0.01, 1.0), 1.0);
    Material.Green = new Material(new MV_1.vec4(0.1, 0.1, 0.1, 1.0), new MV_1.vec4(0.2, 0.2, 0.2, 10), new MV_1.vec4(0.01, 0.01, 0.01, 1.0), 1.0);
    return Material;
}());
exports.Material = Material;

},{"./common/MV":11}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MV_1 = require("./common/MV");
var VirtualComponent = /** @class */ (function () {
    function VirtualComponent(translation, rotation, parent) {
        this.translation = translation;
        this.rotation = rotation;
        this.parent = parent;
    }
    VirtualComponent.prototype.addChild = function (child) {
        if (this.childs == null) {
            this.childs = new Array();
        }
        child.parent = this;
        this.childs.push(child);
        return this;
    };
    VirtualComponent.prototype.getTransformMatrix = function () {
        var parentMatrix;
        if (this.parent != null) {
            parentMatrix = this.parent.getTransformMatrix();
        }
        else {
            parentMatrix = new MV_1.mat4();
        }
        return MV_1.mult(parentMatrix, MV_1.mult(this.rotation, this.translation));
    };
    VirtualComponent.prototype.draw = function (app) {
        for (var _i = 0, _a = this.childs; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(app);
        }
    };
    return VirtualComponent;
}());
exports.VirtualComponent = VirtualComponent;

},{"./common/MV":11}],10:[function(require,module,exports){
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
var VirtualComponent_1 = require("./VirtualComponent");
var Component_1 = require("./Component");
var MV_1 = require("./common/MV");
var Geometry_1 = require("./Geometry");
var Material_1 = require("./Material");
var Xiaohei = /** @class */ (function (_super) {
    __extends(Xiaohei, _super);
    function Xiaohei() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //小黑对象。
    Xiaohei.build = function (gl, x, y, z) {
        //在x，y，z处正方向构造一只小黑。
        var xiaohei = new Xiaohei(MV_1.translate(x, y, z), new MV_1.mat4(), null);
        //以小黑为父对象，构造子对象。
        var head = Head.build(gl, xiaohei);
        var leftEar = Ear.build(gl, xiaohei, -0.05, -3.2);
        var rightEar = Ear.build(gl, xiaohei, 0.05, 3.2);
        var leftInnerEar = InnerEar.build(gl, xiaohei, -0.05, new MV_1.vec2(100, 200), -3);
        var rightInnerEar = InnerEar.build(gl, xiaohei, 0.05, new MV_1.vec2(0, 90), 3);
        var body = Body.build(gl, xiaohei);
        var leftArm = Arm.build(gl, xiaohei, -0.1, MV_1.mult(MV_1.rotateZ(-15), MV_1.rotateX(15)));
        var rightArm = Arm.build(gl, xiaohei, 0.1, MV_1.mult(MV_1.rotateZ(15), MV_1.rotateX(15)));
        var leftLeg = Leg.build(gl, xiaohei, 0, MV_1.mult(MV_1.rotateZ(-15), MV_1.rotateX(15)));
        var rightLeg = Leg.build(gl, xiaohei, 0, MV_1.mult(MV_1.rotateZ(15), MV_1.rotateX(15)));
        xiaohei
            .addChild(head)
            .addChild(leftEar)
            .addChild(rightEar)
            .addChild(leftInnerEar)
            .addChild(rightInnerEar)
            .addChild(body)
            .addChild(leftArm)
            .addChild(rightArm)
            .addChild(leftLeg)
            .addChild(rightLeg);
        return xiaohei;
    };
    return Xiaohei;
}(VirtualComponent_1.VirtualComponent));
exports.Xiaohei = Xiaohei;
var Head = /** @class */ (function (_super) {
    __extends(Head, _super);
    function Head() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //小黑头部（不包括耳朵）。
    Head.build = function (gl, xiaohei) {
        //在某只小黑上构造一个头，以头部中心作为小黑对象的中心。
        //因此头部相对于父对象不需要平移和旋转。
        var head = new Head(new MV_1.mat4(), new MV_1.mat4(), xiaohei, Material_1.Material.Black);
        var verticesAndNormals = Geometry_1.ellipsoid_generator({
            origin: new MV_1.vec3(0, 0, 0),
            axis_length: new MV_1.vec3(2.5, 2, 2),
            angle_range_vertical: new MV_1.vec2(0, 180),
            angle_range_horizontal: new MV_1.vec2(0, 360)
        }, function (x, y, z, width, height) {
            if (z < 0) {
                return new MV_1.vec2(0, 0);
            }
            x = (x + width / 2.0) / width;
            y = (-y + height / 2.0) / height;
            return new MV_1.vec2(x, y);
        });
        head.initData(gl, verticesAndNormals);
        var image = document.getElementById("texImage");
        head.setTexture(gl, image);
        return head;
    };
    return Head;
}(Component_1.Component));
var Ear = /** @class */ (function (_super) {
    __extends(Ear, _super);
    function Ear() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //小黑（外）耳朵。
    Ear.build = function (gl, xiaohei, bottom, top) {
        //（外）耳朵相对于父节点的平移、旋转矩阵。
        //bottom:耳朵最终位置-圆锥底面中心点相对于父对象的x轴方向平移量。左右耳不同。
        //top:自身坐标系下，顶点相对于x轴方向平移量。左右耳不同。
        var translation = MV_1.translate(bottom, 2, 0); //bottom应包含于这个矩阵中。
        var ear = new Ear(translation, new MV_1.mat4(), xiaohei, Material_1.Material.Black);
        var verticesAndNormals = Geometry_1.taper_generator({
            origin: new MV_1.vec3(0, 0, 0),
            ellipse_axis: new MV_1.vec2(2.5, 1.5),
            top_point: new MV_1.vec3(top, 2, 0),
            angle_range: new MV_1.vec2(0, 360)
        }); //top应被传递到这个函数中。
        ear.initData(gl, verticesAndNormals);
        return ear;
    };
    return Ear;
}(Component_1.Component));
var InnerEar = /** @class */ (function (_super) {
    __extends(InnerEar, _super);
    function InnerEar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //小黑（内）耳朵。
    InnerEar.build = function (gl, parent, bottom, range, top) {
        //（内）耳朵相对于父节点的平移、旋转矩阵。
        //bottom:耳朵最终位置-圆锥底面中心点相对于父对象的x轴方向平移量。左右耳不同。
        //top:自身坐标系下，顶点相对于x轴方向平移量。左右耳不同。
        var translation = MV_1.translate(bottom, 0.25, 0); //bottom应包含于这个矩阵中。
        var innerEar = new InnerEar(translation, new MV_1.mat4(), parent, Material_1.Material.Green);
        var verticesAndNormals = Geometry_1.taper_generator({
            origin: new MV_1.vec3(0, 0, 0),
            ellipse_axis: new MV_1.vec2(2.5, 1.5),
            top_point: new MV_1.vec3(top, 1.8, 0.175),
            angle_range: range
        }); //top应被传递到这个函数中。
        innerEar.initData(gl, verticesAndNormals);
        return innerEar;
    };
    return InnerEar;
}(Component_1.Component));
var Body = /** @class */ (function (_super) {
    __extends(Body, _super);
    function Body() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //小黑身体
    Body.build = function (gl, parent) {
        var translationToHead = MV_1.translate(0, -1.75, -2.25);
        var body = new Body(translationToHead, new MV_1.mat4(), parent, Material_1.Material.Black);
        var verticesAndNormals = Geometry_1.ellipsoid_generator({
            origin: new MV_1.vec3(0, 0, 0),
            axis_length: new MV_1.vec3(1, 2, 1),
            angle_range_vertical: new MV_1.vec2(0, 180),
            angle_range_horizontal: new MV_1.vec2(0, 360)
        });
        body.initData(gl, verticesAndNormals);
        return body;
    };
    return Body;
}(Component_1.Component));
var Arm = /** @class */ (function (_super) {
    __extends(Arm, _super);
    function Arm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arm.build = function (gl, parent, trans, rotate) {
        //trans:手臂相对于父对象（小黑）的平移矩阵。即在x轴上距离z轴的距离。
        //rotate:腿的旋转矩阵。圆柱的初始位置应该在原点出xoz平面下方。这样方便腿绕关节旋转。在此基础上进行旋转。
        var translation = MV_1.translate(trans, -2.5, -1.5); //translate应包含在这个矩阵中。
        var arm = new Arm(translation, rotate, parent, Material_1.Material.Black);
        var verticesAndNormals = Geometry_1.cylinder_generator({
            origin: new MV_1.vec3(0, 0, 0),
            ellipse_axis: new MV_1.vec2(0.4, 0.4),
            height: 2,
            angle_range: new MV_1.vec2(0, 360)
        });
        arm.initData(gl, verticesAndNormals);
        return arm;
    };
    return Arm;
}(Component_1.Component));
var Leg = /** @class */ (function (_super) {
    __extends(Leg, _super);
    function Leg() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Leg.build = function (gl, parent, trans, rotate) {
        //trans:腿相对于父对象（小黑）的平移量。左右腿不同。即在x轴上距离z轴的距离。
        //rotate:腿的旋转矩阵。圆柱的初始位置应该在原点出xoz平面下方。这样方便腿绕关节旋转。在此基础上进行旋转。
        var translation = MV_1.translate(trans, -2, -3.75); //translate应包含在这个矩阵中。
        var leg = new Leg(translation, rotate, parent, Material_1.Material.Black);
        var verticesAndNormals = Geometry_1.cylinder_generator({
            origin: new MV_1.vec3(0, 0, 0),
            ellipse_axis: new MV_1.vec2(0.4, 0.4),
            height: 1.5,
            angle_range: new MV_1.vec2(0, 360)
        });
        leg.initData(gl, verticesAndNormals);
        return leg;
    };
    return Leg;
}(Component_1.Component));

},{"./Component":4,"./Geometry":6,"./Material":8,"./VirtualComponent":9,"./common/MV":11}],11:[function(require,module,exports){
//////////////////////////////////////////////////////////////////////////////
//
//  Angel.js
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Helper functions
//

function _argumentsToArray(args) {
  return [].concat.apply([], Array.prototype.slice.apply(args));
}

//----------------------------------------------------------------------------
//
function radians(degrees) {
  return degrees * Math.PI / 180.0;
}

//----------------------------------------------------------------------------
//
//  Vector Constructors
//

function vec2() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
  }

  return result.splice(0, 2);
}

function vec3() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
    case 2:
      result.push(0.0);
  }

  return result.splice(0, 3);
}

function vec4() {
  var result = _argumentsToArray(arguments);

  switch (result.length) {
    case 0:
      result.push(0.0);
    case 1:
      result.push(0.0);
    case 2:
      result.push(0.0);
    case 3:
      result.push(1.0);
  }

  return result.splice(0, 4);
}

//----------------------------------------------------------------------------
//
//  Matrix Constructors
//

function mat2() {
  var v = _argumentsToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [vec2(v[0], 0.0), vec2(0.0, v[0])];
      break;

    default:
      m.push(vec2(v));
      v.splice(0, 2);
      m.push(vec2(v));
      break;
  }

  m.matrix = true;

  return m;
}

//----------------------------------------------------------------------------

function mat3() {
  var v = _argumentsToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [vec3(v[0], 0.0, 0.0), vec3(0.0, v[0], 0.0), vec3(0.0, 0.0, v[0])];
      break;

    default:
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      v.splice(0, 3);
      m.push(vec3(v));
      break;
  }

  m.matrix = true;

  return m;
}

//----------------------------------------------------------------------------

function mat4() {
  var v = _argumentsToArray(arguments);

  var m = [];
  switch (v.length) {
    case 0:
      v[0] = 1;
    case 1:
      m = [
        vec4(v[0], 0.0, 0.0, 0.0),
        vec4(0.0, v[0], 0.0, 0.0),
        vec4(0.0, 0.0, v[0], 0.0),
        vec4(0.0, 0.0, 0.0, v[0])
      ];
      break;

    default:
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      v.splice(0, 4);
      m.push(vec4(v));
      break;
  }

  m.matrix = true;

  return m;
}

//----------------------------------------------------------------------------
//
//  Generic Mathematical Operations for Vectors and Matrices
//

function equal(u, v) {
  if (u.length != v.length) {
    return false;
  }

  if (u.matrix && v.matrix) {
    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        return false;
      }
      for (var j = 0; j < u[i].length; ++j) {
        if (u[i][j] !== v[i][j]) {
          return false;
        }
      }
    }
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    return false;
  } else {
    for (var i = 0; i < u.length; ++i) {
      if (u[i] !== v[i]) {
        return false;
      }
    }
  }

  return true;
}

//----------------------------------------------------------------------------

function add(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "add(): trying to add matrices of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "add(): trying to add matrices of different dimensions";
      }
      result.push([]);
      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] + v[i][j]);
      }
    }

    result.matrix = true;

    return result;
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    throw "add(): trying to add matrix and non-matrix variables";
  } else {
    if (u.length != v.length) {
      throw "add(): vectors are not the same dimension";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] + v[i]);
    }

    return result;
  }
}

//----------------------------------------------------------------------------

function subtract(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "subtract(): trying to subtract matrices" +
        " of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "subtract(): trying to subtact matrices" +
          " of different dimensions";
      }
      result.push([]);
      for (var j = 0; j < u[i].length; ++j) {
        result[i].push(u[i][j] - v[i][j]);
      }
    }

    result.matrix = true;

    return result;
  } else if ((u.matrix && !v.matrix) || (!u.matrix && v.matrix)) {
    throw "subtact(): trying to subtact  matrix and non-matrix variables";
  } else {
    if (u.length != v.length) {
      throw "subtract(): vectors are not the same length";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] - v[i]);
    }

    return result;
  }
}

//----------------------------------------------------------------------------

function mult(u, v) {
  var result = [];

  if (u.matrix && v.matrix) {
    if (u.length != v.length) {
      throw "mult(): trying to mult matrices of different dimensions";
    }

    for (var i = 0; i < u.length; ++i) {
      if (u[i].length != v[i].length) {
        throw "mult(): trying to mult matrices of different dimensions";
      }
    }

    for (var i = 0; i < u.length; ++i) {
      result.push([]);

      for (var j = 0; j < v.length; ++j) {
        var sum = 0.0;
        for (var k = 0; k < u.length; ++k) {
          sum += u[i][k] * v[k][j];
        }
        result[i].push(sum);
      }
    }

    result.matrix = true;

    return result;
  } else if (u.matrix) {
    for (var row = 0; row < u.length; row++) {
      var sum = 0.0;
      for (var col = 0; col < u[row].length; col++) {
        sum += u[row][col] * v[col];
      }
      result.push(sum);
    }
    return result;
  } else {
    if (u.length != v.length) {
      throw "mult(): vectors are not the same dimension";
    }

    for (var i = 0; i < u.length; ++i) {
      result.push(u[i] * v[i]);
    }

    return result;
  }
}

//----------------------------------------------------------------------------
//
//  Basic Transformation Matrix Generators
//

function translate(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][3] = x;
  result[1][3] = y;
  result[2][3] = z;

  return result;
}

//----------------------------------------------------------------------------

function rotate(angle, axis) {
  if (!Array.isArray(axis)) {
    axis = [arguments[1], arguments[2], arguments[3]];
  }

  var v = normalize(axis);

  var x = v[0];
  var y = v[1];
  var z = v[2];

  var c = Math.cos(radians(angle));
  var omc = 1.0 - c;
  var s = Math.sin(radians(angle));

  var result = mat4(
    vec4(x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0),
    vec4(x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0),
    vec4(x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0),
    vec4()
  );

  return result;
}

function rotateX(theta) {
  var c = Math.cos(radians(theta));
  var s = Math.sin(radians(theta));
  var rx = mat4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    c,
    s,
    0.0,
    0.0,
    -s,
    c,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  return rx;
}

function rotateY(theta) {
  var c = Math.cos(radians(theta));
  var s = Math.sin(radians(theta));
  var ry = mat4(
    c,
    0.0,
    -s,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    s,
    0.0,
    c,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  return ry;
}

function rotateZ(theta) {
  var c = Math.cos(radians(theta));
  var s = Math.sin(radians(theta));
  var rz = mat4(
    c,
    s,
    0.0,
    0.0,
    -s,
    c,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
  return rz;
}

//----------------------------------------------------------------------------

function scalem(x, y, z) {
  if (Array.isArray(x) && x.length == 3) {
    z = x[2];
    y = x[1];
    x = x[0];
  }

  var result = mat4();
  result[0][0] = x;
  result[1][1] = y;
  result[2][2] = z;

  return result;
}

//----------------------------------------------------------------------------
//
//  ModelView Matrix Generators
//

function lookAt(eye, at, up) {
  if (!Array.isArray(eye) || eye.length != 3) {
    throw "lookAt(): first parameter [eye] must be an a vec3";
  }

  if (!Array.isArray(at) || at.length != 3) {
    throw "lookAt(): first parameter [at] must be an a vec3";
  }

  if (!Array.isArray(up) || up.length != 3) {
    throw "lookAt(): first parameter [up] must be an a vec3";
  }

  if (equal(eye, at)) {
    return mat4();
  }

  var v = normalize(subtract(at, eye)); // view direction vector
  var n = normalize(cross(v, up)); // perpendicular vector
  var u = normalize(cross(n, v)); // "new" up vector

  v = negate(v);

  var result = mat4(
    vec4(n, -dot(n, eye)),
    vec4(u, -dot(u, eye)),
    vec4(v, -dot(v, eye)),
    vec4()
  );

  return result;
}

//----------------------------------------------------------------------------
//
//  Projection Matrix Generators
//

function ortho(left, right, bottom, top, near, far) {
  if (left == right) {
    throw "ortho(): left and right are equal";
  }
  if (bottom == top) {
    throw "ortho(): bottom and top are equal";
  }
  if (near == far) {
    throw "ortho(): near and far are equal";
  }

  var w = right - left;
  var h = top - bottom;
  var d = far - near;

  var result = mat4();
  result[0][0] = 2.0 / w;
  result[1][1] = 2.0 / h;
  result[2][2] = -2.0 / d;
  result[0][3] = -(left + right) / w;
  result[1][3] = -(top + bottom) / h;
  result[2][3] = -(near + far) / d;

  return result;
}

//----------------------------------------------------------------------------

function perspective(fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(radians(fovy) / 2);
  var d = far - near;

  var result = mat4();
  result[0][0] = f / aspect;
  result[1][1] = f;
  result[2][2] = -(near + far) / d;
  result[2][3] = -2 * near * far / d;
  result[3][2] = -1;
  result[3][3] = 0.0;

  return result;
}

//----------------------------------------------------------------------------
//
//  Matrix Functions
//

function transpose(m) {
  if (!m.matrix) {
    return "transpose(): trying to transpose a non-matrix";
  }

  var result = [];
  for (var i = 0; i < m.length; ++i) {
    result.push([]);
    for (var j = 0; j < m[i].length; ++j) {
      result[i].push(m[j][i]);
    }
  }

  result.matrix = true;

  return result;
}

//----------------------------------------------------------------------------
//
//  Vector Functions
//

function dot(u, v) {
  if (u.length != v.length) {
    throw "dot(): vectors are not the same dimension";
  }

  var sum = 0.0;
  for (var i = 0; i < u.length; ++i) {
    sum += u[i] * v[i];
  }

  return sum;
}

//----------------------------------------------------------------------------

function negate(u) {
  var result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push(-u[i]);
  }

  return result;
}

//----------------------------------------------------------------------------

function cross(u, v) {
  if (!Array.isArray(u) || u.length < 3) {
    throw "cross(): first argument is not a vector of at least 3";
  }

  if (!Array.isArray(v) || v.length < 3) {
    throw "cross(): second argument is not a vector of at least 3";
  }

  var result = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0]
  ];

  return result;
}

//----------------------------------------------------------------------------

function length(u) {
  return Math.sqrt(dot(u, u));
}

//----------------------------------------------------------------------------

function normalize(u, excludeLastComponent) {
  if (excludeLastComponent) {
    var last = u.pop();
  }

  var len = length(u);

  if (!isFinite(len)) {
    throw "normalize: vector " + u + " has zero length";
  }

  for (var i = 0; i < u.length; ++i) {
    u[i] /= len;
  }

  if (excludeLastComponent) {
    u.push(last);
  }

  return u;
}

//----------------------------------------------------------------------------

function mix(u, v, s) {
  if (typeof s !== "number") {
    throw "mix: the last paramter " + s + " must be a number";
  }

  if (u.length != v.length) {
    throw "vector dimension mismatch";
  }

  var result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push((1.0 - s) * u[i] + s * v[i]);
  }

  return result;
}

//----------------------------------------------------------------------------
//
// Vector and Matrix functions
//

function scale(s, u) {
  if (!Array.isArray(u)) {
    throw "scale: second parameter " + u + " is not a vector";
  }

  var result = [];
  for (var i = 0; i < u.length; ++i) {
    result.push(s * u[i]);
  }

  return result;
}

//----------------------------------------------------------------------------
//
//
//

function flatten(v) {
  if (v.matrix === true) {
    v = transpose(v);
  }

  var n = v.length;
  var elemsAreArrays = false;

  if (Array.isArray(v[0])) {
    elemsAreArrays = true;
    n *= v[0].length;
  }

  var floats = new Float32Array(n);

  if (elemsAreArrays) {
    var idx = 0;
    for (var i = 0; i < v.length; ++i) {
      for (var j = 0; j < v[i].length; ++j) {
        floats[idx++] = v[i][j];
      }
    }
  } else {
    for (var i = 0; i < v.length; ++i) {
      floats[i] = v[i];
    }
  }

  return floats;
}

//----------------------------------------------------------------------------

var sizeof = {
  vec2: new Float32Array(flatten(vec2())).byteLength,
  vec3: new Float32Array(flatten(vec3())).byteLength,
  vec4: new Float32Array(flatten(vec4())).byteLength,
  mat2: new Float32Array(flatten(mat2())).byteLength,
  mat3: new Float32Array(flatten(mat3())).byteLength,
  mat4: new Float32Array(flatten(mat4())).byteLength
};

// new functions 5/2/2015

// printing

function printm(m) {
  if (m.length == 2)
    for (var i = 0; i < m.length; i++) console.log(m[i][0], m[i][1]);
  else if (m.length == 3)
    for (var i = 0; i < m.length; i++) console.log(m[i][0], m[i][1], m[i][2]);
  else if (m.length == 4)
    for (var i = 0; i < m.length; i++)
      console.log(m[i][0], m[i][1], m[i][2], m[i][3]);
}
// determinants

function det2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function det3(m) {
  var d =
    m[0][0] * m[1][1] * m[2][2] +
    m[0][1] * m[1][2] * m[2][0] +
    m[0][2] * m[2][1] * m[1][0] -
    m[2][0] * m[1][1] * m[0][2] -
    m[1][0] * m[0][1] * m[2][2] -
    m[0][0] * m[1][2] * m[2][1];
  return d;
}

function det4(m) {
  var m0 = [
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[2][1], m[2][2], m[2][3]),
    vec3(m[3][1], m[3][2], m[3][3])
  ];
  var m1 = [
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[2][0], m[2][2], m[2][3]),
    vec3(m[3][0], m[3][2], m[3][3])
  ];
  var m2 = [
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[2][0], m[2][1], m[2][3]),
    vec3(m[3][0], m[3][1], m[3][3])
  ];
  var m3 = [
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[2][0], m[2][1], m[2][2]),
    vec3(m[3][0], m[3][1], m[3][2])
  ];
  return (
    m[0][0] * det3(m0) -
    m[0][1] * det3(m1) +
    m[0][2] * det3(m2) -
    m[0][3] * det3(m3)
  );
}

function det(m) {
  if (m.matrix != true) console.log("not a matrix");
  if (m.length == 2) return det2(m);
  if (m.length == 3) return det3(m);
  if (m.length == 4) return det4(m);
}

//---------------------------------------------------------

// inverses

function inverse2(m) {
  var a = mat2();
  var d = det2(m);
  a[0][0] = m[1][1] / d;
  a[0][1] = -m[0][1] / d;
  a[1][0] = -m[1][0] / d;
  a[1][1] = m[0][0] / d;
  a.matrix = true;
  return a;
}

function inverse3(m) {
  var a = mat3();
  var d = det3(m);

  var a00 = [vec2(m[1][1], m[1][2]), vec2(m[2][1], m[2][2])];
  var a01 = [vec2(m[1][0], m[1][2]), vec2(m[2][0], m[2][2])];
  var a02 = [vec2(m[1][0], m[1][1]), vec2(m[2][0], m[2][1])];
  var a10 = [vec2(m[0][1], m[0][2]), vec2(m[2][1], m[2][2])];
  var a11 = [vec2(m[0][0], m[0][2]), vec2(m[2][0], m[2][2])];
  var a12 = [vec2(m[0][0], m[0][1]), vec2(m[2][0], m[2][1])];
  var a20 = [vec2(m[0][1], m[0][2]), vec2(m[1][1], m[1][2])];
  var a21 = [vec2(m[0][0], m[0][2]), vec2(m[1][0], m[1][2])];
  var a22 = [vec2(m[0][0], m[0][1]), vec2(m[1][0], m[1][1])];

  a[0][0] = det2(a00) / d;
  a[0][1] = -det2(a10) / d;
  a[0][2] = det2(a20) / d;
  a[1][0] = -det2(a01) / d;
  a[1][1] = det2(a11) / d;
  a[1][2] = -det2(a21) / d;
  a[2][0] = det2(a02) / d;
  a[2][1] = -det2(a12) / d;
  a[2][2] = det2(a22) / d;

  return a;
}

function inverse4(m) {
  var a = mat4();
  var d = det4(m);

  var a00 = [
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[2][1], m[2][2], m[2][3]),
    vec3(m[3][1], m[3][2], m[3][3])
  ];
  var a01 = [
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[2][0], m[2][2], m[2][3]),
    vec3(m[3][0], m[3][2], m[3][3])
  ];
  var a02 = [
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[2][0], m[2][1], m[2][3]),
    vec3(m[3][0], m[3][1], m[3][3])
  ];
  var a03 = [
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[2][0], m[2][1], m[2][2]),
    vec3(m[3][0], m[3][1], m[3][2])
  ];
  var a10 = [
    vec3(m[0][1], m[0][2], m[0][3]),
    vec3(m[2][1], m[2][2], m[2][3]),
    vec3(m[3][1], m[3][2], m[3][3])
  ];
  var a11 = [
    vec3(m[0][0], m[0][2], m[0][3]),
    vec3(m[2][0], m[2][2], m[2][3]),
    vec3(m[3][0], m[3][2], m[3][3])
  ];
  var a12 = [
    vec3(m[0][0], m[0][1], m[0][3]),
    vec3(m[2][0], m[2][1], m[2][3]),
    vec3(m[3][0], m[3][1], m[3][3])
  ];
  var a13 = [
    vec3(m[0][0], m[0][1], m[0][2]),
    vec3(m[2][0], m[2][1], m[2][2]),
    vec3(m[3][0], m[3][1], m[3][2])
  ];
  var a20 = [
    vec3(m[0][1], m[0][2], m[0][3]),
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[3][1], m[3][2], m[3][3])
  ];
  var a21 = [
    vec3(m[0][0], m[0][2], m[0][3]),
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[3][0], m[3][2], m[3][3])
  ];
  var a22 = [
    vec3(m[0][0], m[0][1], m[0][3]),
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[3][0], m[3][1], m[3][3])
  ];
  var a23 = [
    vec3(m[0][0], m[0][1], m[0][2]),
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[3][0], m[3][1], m[3][2])
  ];

  var a30 = [
    vec3(m[0][1], m[0][2], m[0][3]),
    vec3(m[1][1], m[1][2], m[1][3]),
    vec3(m[2][1], m[2][2], m[2][3])
  ];
  var a31 = [
    vec3(m[0][0], m[0][2], m[0][3]),
    vec3(m[1][0], m[1][2], m[1][3]),
    vec3(m[2][0], m[2][2], m[2][3])
  ];
  var a32 = [
    vec3(m[0][0], m[0][1], m[0][3]),
    vec3(m[1][0], m[1][1], m[1][3]),
    vec3(m[2][0], m[2][1], m[2][3])
  ];
  var a33 = [
    vec3(m[0][0], m[0][1], m[0][2]),
    vec3(m[1][0], m[1][1], m[1][2]),
    vec3(m[2][0], m[2][1], m[2][2])
  ];

  a[0][0] = det3(a00) / d;
  a[0][1] = -det3(a10) / d;
  a[0][2] = det3(a20) / d;
  a[0][3] = -det3(a30) / d;
  a[1][0] = -det3(a01) / d;
  a[1][1] = det3(a11) / d;
  a[1][2] = -det3(a21) / d;
  a[1][3] = det3(a31) / d;
  a[2][0] = det3(a02) / d;
  a[2][1] = -det3(a12) / d;
  a[2][2] = det3(a22) / d;
  a[2][3] = -det3(a32) / d;
  a[3][0] = -det3(a03) / d;
  a[3][1] = det3(a13) / d;
  a[3][2] = -det3(a23) / d;
  a[3][3] = det3(a33) / d;

  return a;
}

function inverse(m) {
  if (m.matrix != true) console.log("not a matrix");
  if (m.length == 2) return inverse2(m);
  if (m.length == 3) return inverse3(m);
  if (m.length == 4) return inverse4(m);
}

function normalMatrix(m, flag) {
  var a = mat4();
  a = inverse(transpose(m));
  if (flag != true) return a;
  else {
    var b = mat3();
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) b[i][j] = a[i][j];
    return b;
  }
}

module.exports = {
  radians: radians,
  vec2: vec2,
  vec3: vec3,
  vec4: vec4,
  mat2: mat2,
  mat3: mat3,
  mat4: mat4,
  equal: equal,
  add: add,
  subtract: subtract,
  mult: mult,
  translate: translate,
  rotate: rotate,
  rotateX: rotateX,
  rotateY: rotateY,
  rotateZ: rotateZ,
  scalem: scalem,
  lookAt: lookAt,
  ortho: ortho,
  perspective: perspective,
  transpose: transpose,
  dot: dot,
  negate: negate,
  cross: cross,
  length: length,
  normalize: normalize,
  mix: mix,
  scale: scale,
  flatten: flatten,
  printm: printm,
  det2: det2,
  det3: det3,
  det4: det4,
  det: det,
  inverse2: inverse2,
  inverse3: inverse3,
  inverse4: inverse4,
  inverse: inverse,
  normalMatrix: normalMatrix
};

},{}],12:[function(require,module,exports){
//
//  initShaders.js
//

function initShaders(gl, vertexShaderId, fragmentShaderId) {
  var vertShdr;
  var fragShdr;

  var vertElem = document.getElementById(vertexShaderId);
  if (!vertElem) {
    alert("Unable to load vertex shader " + vertexShaderId);
    return -1;
  } else {
    vertShdr = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShdr, vertElem.text);
    gl.compileShader(vertShdr);
    if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
      var msg =
        "Vertex shader failed to compile.  The error log is:" +
        "<pre>" +
        gl.getShaderInfoLog(vertShdr) +
        "</pre>";
      alert(msg);
      return -1;
    }
  }

  var fragElem = document.getElementById(fragmentShaderId);
  if (!fragElem) {
    alert("Unable to load vertex shader " + fragmentShaderId);
    return -1;
  } else {
    fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShdr, fragElem.text);
    gl.compileShader(fragShdr);
    if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
      var msg =
        "Fragment shader failed to compile.  The error log is:" +
        "<pre>" +
        gl.getShaderInfoLog(fragShdr) +
        "</pre>";
      alert(msg);
      return -1;
    }
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var msg =
      "Shader program failed to link.  The error log is:" +
      "<pre>" +
      gl.getProgramInfoLog(program) +
      "</pre>";
    alert(msg);
    return -1;
  }

  return program;
}

module.exports = {
  initShaders: initShaders
};

},{}],13:[function(require,module,exports){
/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */

WebGLUtils = (function() {
  /**
   * Creates the HTLM for a failure message
   * @param {string} canvasContainerId id of container of th
   *        canvas.
   * @return {string} The html.
   */
  var makeFailHTML = function(msg) {
    return (
      "" +
      '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
      '<td align="center">' +
      '<div style="display: table-cell; vertical-align: middle;">' +
      '<div style="">' +
      msg +
      "</div>" +
      "</div>" +
      "</td></tr></table>"
    );
  };

  /**
   * Mesasge for getting a webgl browser
   * @type {string}
   */
  var GET_A_WEBGL_BROWSER =
    "" +
    "This page requires a browser that supports WebGL.<br/>" +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

  /**
   * Mesasge for need better hardware
   * @type {string}
   */
  var OTHER_PROBLEM =
    "" +
    "It doesn't appear your computer can support WebGL.<br/>" +
    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

  /**
   * Creates a webgl context. If creation fails it will
   * change the contents of the container of the <canvas>
   * tag to an error message with the correct links for WebGL.
   * @param {Element} canvas. The canvas element to create a
   *     context from.
   * @param {WebGLContextCreationAttirbutes} opt_attribs Any
   *     creation attributes you want to pass in.
   * @return {WebGLRenderingContext} The created context.
   */
  var setupWebGL = function(canvas, opt_attribs) {
    function showLink(str) {
      var container = canvas.parentNode;
      if (container) {
        container.innerHTML = makeFailHTML(str);
      }
    }

    if (!window.WebGLRenderingContext) {
      showLink(GET_A_WEBGL_BROWSER);
      return null;
    }

    var context = create3DContext(canvas, opt_attribs);
    if (!context) {
      showLink(OTHER_PROBLEM);
    }
    return context;
  };

  /**
   * Creates a webgl context.
   * @param {!Canvas} canvas The canvas tag to get context
   *     from. If one is not passed in one will be created.
   * @return {!WebGLContext} The created context.
   */
  var create3DContext = function(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch (e) {}
      if (context) {
        break;
      }
    }
    return context;
  };

  return {
    create3DContext: create3DContext,
    setupWebGL: setupWebGL
  };
})();

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(
      /* function FrameRequestCallback */ callback,
      /* DOMElement Element */ element
    ) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

module.exports = {
  WebGLUtils: WebGLUtils
};

},{}]},{},[1]);
