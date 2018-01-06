"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ButtomInteractor = /** @class */ (function () {
    function ButtomInteractor() {
    }
    ButtomInteractor.init = function (xiaohei, heixiu) {
        document.getElementById("RotateLeft").onclick = function () {
            xiaohei.rotateLeft();
        };
        document.getElementById("RotateRight").onclick = function () {
            xiaohei.rotateRight();
        };
        document.getElementById("Forward").onclick = function () {
            xiaohei.walkForward();
        };
        document.getElementById("Backward").onclick = function () {
            xiaohei.walkBackward();
        };
        document.getElementById("RotateLeft1").onclick = function () {
            heixiu.rotateLeft();
        };
        document.getElementById("RotateRight1").onclick = function () {
            heixiu.rotateRight();
        };
        document.getElementById("Forward1").onclick = function () {
            heixiu.walkForward();
        };
        document.getElementById("Backward1").onclick = function () {
            heixiu.walkBackward();
        };
    };
    return ButtomInteractor;
}());
//# sourceMappingURL=ButtomInteractor.js.map