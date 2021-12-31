//Camera对象，持有相机位置、姿态的参数。
function Camera() {
  this.position = vec3();//相机位置
  this.matrix = mat4();//相机位置和姿态的变换矩阵
  this.azimuth = 0.0; //方位角
  this.elevation = 0.0; //仰角
  this.onChange = null;//相机变动后的回调函数，实际上就是App.draw。整个画面重绘。
  this.steps = 0;
  this.dollystep = 0;
}

Camera.prototype.update = function () {
  console.log(
    "Camera update " + this.elevation + "," + this.azimuth + "," + this.position
  );
  this.matrix = mat4();
  //先把相机平移到指定位置，再绕Y轴旋转，再绕X轴旋转
  this.matrix = mult(this.matrix, translate(this.position));
  this.matrix = mult(this.matrix, rotateY(this.azimuth));
  this.matrix = mult(this.matrix, rotateX(this.elevation));

  //调用onChange函数，实际上这个函数就是App.draw。整个画面重绘。
  if (this.onChange) {
    this.onChange();
  }
};

Camera.prototype.getViewMatrix = function () {
  //把相机的位置姿态矩阵取逆矩阵，就是模型视图矩阵。
  return inverse4(this.matrix);
};

Camera.prototype.changeElevation = function (el) {
  //改变相机的仰角，el是变化量，单位为度。
  console.log("changeElevation " + el);
  this.elevation += el;
  if (this.elevation > 360 || this.elevation < -360) {
    this.elevation = this.elevation % 360;
  }
  this.update();
};

Camera.prototype.changeAzimuth = function (az) {
  //改变相机的方向角，az是变化量，单位为度。
  console.log("changeElevation " + az);
  this.azimuth += az;
  if (this.azimuth > 360 || this.azimuth < -360) {
    this.azimuth = this.azimuth % 360;
  }
  this.update();
};

Camera.prototype.setLocation = function (x, y, z) {
  this.position = vec3(x, y, z);
  this.update();
};

Camera.prototype.dollyin = function () {
  this.dollystep++;
  this.dolly(this.dollystep);
};

Camera.prototype.dollyout = function () {
  this.dollystep--;
  this.dolly(this.dollystep);
};

Camera.prototype.dolly = function (cstep) {
  var step = cstep - this.steps;
  var newPosition = vec3();
  newPosition[0] = this.position[0];
  newPosition[1] = this.position[1];
  newPosition[2] = this.position[2] - step;
  this.setLocation(newPosition[0], newPosition[1], newPosition[2]);
  this.steps = cstep;
};
