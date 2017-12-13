function Sun() {
  this.FORWARD_STEP = 0.5;
  this.ROTATE_STEP = 5;
  this.RESIZE_STEP = 0.1;
  this.perVertexColor = null;
  this.size = 0.2;
  this.vbo = null;
  this.cbo = null;
  this.vertexNum = 0;
  this.transformMatrix = null;
  this.onChange = null;
  thsi.position=null;
}


Sun.prototype.setLocation=function(a,b,c){
    this.position=vec3(a,b,c);

}

Sun.prototype.updateTransformMatrix = function () {
    //update transform matrix
    var RE = scalem(this.size, this.size, this.size);
    var T = translate(
      this.position[0],
      this.position[1],
      this.position[2]
    );
    var R = rotateY(this.rotateAngle);
    this.transformMatrix = mult(T, mult(R, RE));
  
    if (this.onChange) {
      this.onChange();
    }
  };