var gl = null;
var app = null;
var modelViewMatrix = mat4();
var perspectiveMatrix = mat4();
var program = null;
var camera = null;
var interactor = null;
var viewportWidth = 0;
var viewportHeight = 0;
var scene = null;

var uMVMatrix = null;
var uTMatrix = null;
var uPMatrix = null;
var aVertexColor = null;
var aVertexPosition = null;
var uPerVertexColor = null;
var uColor = null;

window.onload = main;

function main() {
  app = new App();
  app.run();
}
