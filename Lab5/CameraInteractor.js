//相机的鼠标交互类，主要负责在鼠标在画面上拖拽的时候，改变相机姿态。
function CameraInteractor(camera, canvas) {
  this.camera = camera;
  this.canvas = canvas;
  this.dragging = false; //表示鼠标是否按下的标志，避免鼠标没有按下的时候，画面随鼠标移动而变化的错误情况发生。
  this.x = 0.0;
  this.y = 0.0;
  this.MOTION_FACTOR = 10.0; //一个比例因子
  this.rotate = (dx, dy) => {
    //两个比例因子
    var dElevation = -20.0 / this.canvas.height;
    var dAzimuth = -20.0 / this.canvas.width;

    var nAzimuth = dx * dAzimuth * this.MOTION_FACTOR; //计算出方位角变化量。
    var nElevation = dy * dElevation * this.MOTION_FACTOR; //计算出仰角变化量。

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

    var lastX = this.x;
    var lastY = this.y;
    //用新的xy坐标减去上一次的xy坐标。
    this.x = ev.clientX;
    this.y = ev.clientY;
    var dx = this.x - lastX;
    var dy = this.y - lastY;
    this.rotate(dx, dy);
  };
  this.configure = () => {
    //注册时间监听和回调。
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
