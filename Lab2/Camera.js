function Camera() {
  this.position = vec3();
  this.matrix = mat4();
  this.azimuth = 0.0; //方位角
  this.elevation = 0.0; //仰角
  this.onChange = null;
}

Camera.prototype.getViewTransform = function() {
  return inverse4(this.matrix);
};

Camera.prototype.changeElevation = function(el) {
  console.log("changeElevation " + el);
  this.elevation += el;
  if (this.elevation > 360 || this.elevation < -360) {
    this.elevation = this.elevation % 360;
  }
  this.update();
};

Camera.prototype.changeAzimuth = function(az) {
  console.log("changeElevation " + az);
  this.azimuth += az;
  if (this.azimuth > 360 || this.azimuth < -360) {
    this.azimuth = this.azimuth % 360;
  }
  this.update();
};

Camera.prototype.update = function() {
  console.log("Camera update " + this.elevation + "," + this.azimuth);
  this.matrix = mat4();
  
  this.matrix = mult(this.matrix, rotateY(this.azimuth));
  this.matrix = mult(this.matrix, rotateX(this.elevation));
  this.matrix = mult(this.matrix, translate(this.position));

  if (this.onChange) {
    this.onChange();
  }
  // mat4.multiplyVec4(this.matrix, [1, 0, 0, 0], this.right);
  // mat4.multiplyVec4(this.matrix, [0, 1, 0, 0], this.up);
  // mat4.multiplyVec4(this.matrix, [0, 0, 1, 0], this.nomal);

  // mat4.multiplyVec4(this.matrix, [0, 0, 0, 1], this.position);
};

Camera.prototype.setLocation = function(x, y, z) {
  // vec3.set(p, this.position);
  this.position = vec3(x, y, z);
  this.update();
};
