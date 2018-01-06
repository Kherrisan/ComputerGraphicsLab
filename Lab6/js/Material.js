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
//# sourceMappingURL=Material.js.map