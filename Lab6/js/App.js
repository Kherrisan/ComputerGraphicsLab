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
//# sourceMappingURL=App.js.map