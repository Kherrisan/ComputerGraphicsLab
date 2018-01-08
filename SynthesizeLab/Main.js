var gl = null;
var app = null;
var modelViewMatrix = mat4();
var perspectiveMatrix = mat4();
var program = null;
let camera = null;
var interactor = null;
var viewportWidth = 0;
var viewportHeight = 0;
var scene = null;

var uMVMatrix = null;
var uWireframe = null;
var uTMatrix = null;
var uPMatrix = null;
var aVertexColor = null;
var aVertexPosition = null;
var uPerVertexColor = null;
var uColor = null;
var uUseTexture = null;
var uTexture_0_xiaohei = null;
var aTextureCoord = null;

//光照有关参数
var aVertexNormal = null;
var uNMMatrix = null;
var uLightPosition = null;
var uAmbientProduct = null;
var uDiffuseProduct = null;
var uSpecularProduct = null;
var uShininess = null;

window.onload = main;

function main() {
  app = new App();
  app.run();
}
