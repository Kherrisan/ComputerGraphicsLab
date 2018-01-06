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
//# sourceMappingURL=CameraInteractor.js.map