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
    Light.prototype.rotateLeft = function () { };
    Light.prototype.rotateRight = function () { };
    Light.prototype.walkForward = function () { };
    Light.prototype.walkBackward = function () { };
    return Light;
}());
exports.Light = Light;
//# sourceMappingURL=Light.js.map