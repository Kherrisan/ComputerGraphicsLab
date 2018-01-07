function CameraInteractor(camera, canvas) {
  this.count = 0;
  this.camera = camera;
  this.canvas = canvas;
  this.dragging = false;
  this.lastX = 0.0;
  this.lastY = 0.0;
  this.x = 0.0;
  this.y = 0.0;
  this.MOTION_FACTOR = 10.0;
  this.rotate = (dx, dy) => {
    var dElevation = -20.0 / this.canvas.height;
    var dAzimuth = -20.0 / this.canvas.width;

    var nAzimuth = dx * dAzimuth * this.MOTION_FACTOR; //方位角
    var nElevation = dy * dElevation * this.MOTION_FACTOR; //仰角

    this.camera.changeAzimuth(nAzimuth);
    this.camera.changeElevation(nElevation);
  };
  this.onMouseUp = () => {
    this.dragging = false;
  };
  this.onMouseDown = ev => {
    this.dragging = true;
    this.x = ev.clientX;
    this.y = ev.clientY;
  };
  this.onMouseMove = ev => {
    if (!this.dragging) return;
    // this.count++;
    // if (this.count >= 5) {
    this.count = 0;
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = ev.clientX;
    this.y = ev.clientY;

    var dx = this.x - this.lastX;
    var dy = this.y - this.lastY;
    this.rotate(dx, dy);
    // }
  };
  this.configure = () => {
    this.canvas.onmousedown = ev => {
      this.onMouseDown(ev);
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
