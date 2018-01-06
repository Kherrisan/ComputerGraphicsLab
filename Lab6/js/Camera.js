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
//# sourceMappingURL=Camera.js.map