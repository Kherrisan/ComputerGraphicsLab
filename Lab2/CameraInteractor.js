function CameraInteractor(camera, canvas) {
  this.camera = camera;
  this.canvas = canvas;
  this.dragging = false;
  this.lastX = 0.0;
  this.lastY = 0.0;
  this.x = 0.0;
  this.y = 0.0;
  this.MOTION_FACTOR = 10.0;
  this.rotate = function(dx, dy) {
    var dElevation = -20.0 / this.canvas.height;
    var dAzimuth = -20.0 / this.canvas.width;

    var nAzimuth = dx * dAzimuth * this.MOTION_FACTOR;
    var nElevation = dy * dElevation * this.MOTION_FACTOR;

    this.camera.changeAzimuth(nAzimuth);
    this.camera.changeElevation(nElevation);
  };
  this.onMouseUp = () => {
    this.dragging = false;
  };
  this.onMouseDown = () => {
    this.dragging = true;
  };
  this.onMouseMove = function(ev) {
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = ev.clientX;
    this.y = ev.clientY;

    if (!this.dragging) return;

    var dx = this.x - this.lastX;
    var dy = this.y - this.lastY;
    this.rotate(dx, dy);
  };
  this.configure = function() {
    this.canvas.onmousedown = ev => {
      this.onMouseDown();
    };
    this.canvas.onmouseup = ev => {
      this.onMouseUp();
    };
    this.canvas.onmousemove = ev => {
      this.onMouseMove(ev);
    };
  };
  this.configure();
}
