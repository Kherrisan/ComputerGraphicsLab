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
        //单个部件变换矩阵的计算，先旋转该部件，然后平移，最后再做父对象的变换。
        return MV_1.mult(parentMatrix, MV_1.mult(this.translation, this.rotation));
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
//# sourceMappingURL=VirtualComponent.js.map