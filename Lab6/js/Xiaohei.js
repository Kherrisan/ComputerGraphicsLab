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
//# sourceMappingURL=Xiaohei.js.map