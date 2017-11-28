function Heixiu() {
  this.FORWARD_STEP = 0.5;
  this.ROTATE_STEP = 5;
  this.RESIZE_STEP = 0.1;
  this.perVertexColor = true;
  this.rotateAngle = 0; //the angle around axis Y,start from positive x-axis.
  this.position = null; //the location of the center point of this animal.
  this.size = 0.2; //expand and shrink factor.
  this.vbo = null;
  this.cbo = null;
  this.vertexNum = 0;
  this.transformMatrix = null;
  this.onChange = null;
} //indicate some prototype parameters for Heixiu.

Heixiu.prototype.setLocation = function (a, b, c) {
  this.position = vec3(a, b, c);
  this.updateTransformMatrix();
};

Heixiu.prototype.build = function () {
  var vertices = [];
  //init shape_data
  var shape_data = {
    origin: vec3(0, 0, 0),
    axis_length: vec3(this.size * 5, this.size * 4, this.size * 4), //5:4:4
    angle_range_vertical: vec2(0, 180),
    angle_range_horizontal: vec2(0, 360),
    color: vec4(0, 0, 0, 1)
  };
  var body_vertices = ellipsoid_generator(shape_data);
  vertices = vertices.concat(body_vertices);
  var colors = generateColors(body_vertices.length, shape_data["color"]);
  //ears shape_data inition.
  shape_data.axis_length = vec2(this.size * 1.5, this.size * 1.5);
  shape_data.angle_range_vertical = vec3(0, 2 * this.size + 0.5, 0);
  //set and get right ear vertices.
  var rightear_vertices = taper_generator(shape_data);
  this.constructMatrix(
    mult(
      translate(-this.size * 2.5, this.size * 2, 0),
      rotateZ(-20)
    ),
    rightear_vertices
  );
  vertices = vertices.concat(rightear_vertices);
  colors = colors.concat(generateColors(rightear_vertices.length, shape_data["color"]));
  //set and get left ear vertices.
  var leftear_vertices = taper_generator(shape_data);
  this.constructMatrix(
    mult(
      translate(this.size * 2.5, this.size * 2, 0),
      rotateZ(20)
    ),
    leftear_vertices
  )
  vertices = vertices.concat(leftear_vertices);
  colors = colors.concat(generateColors(leftear_vertices.length, shape_data["color"]));

  this.vertexNum = vertices.length;
  this.vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  this.cbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cbo);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  this.updateTransformMatrix();
};

Heixiu.prototype.updateTransformMatrix = function () {
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

Heixiu.prototype.constructMatrix = function (matrix, vertices) {
  for (var i = 0; i < vertices.length; i++) {
    var temp = mult(
      matrix,
      vec4(vertices[i][0], vertices[i][1], vertices[i][2], 1)
    );
    vertices[i] = vec3(temp[0], temp[1], temp[2]);
  }
};

Heixiu.prototype.walkForward = function () {
  this.position[0] +=
    this.FORWARD_STEP * -1 * Math.sin(radians(this.rotateAngle));
  this.position[2] +=
    this.FORWARD_STEP * Math.cos(radians(this.rotateAngle));
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};

Heixiu.prototype.walkBackward = function () {
  this.position[0] +=
    this.FORWARD_STEP * Math.sin(radians(this.rotateAngle));
  this.position[2] +=
    this.FORWARD_STEP * -1 * Math.cos(radians(this.rotateAngle));
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};

Heixiu.prototype.rotateLeft = function () {
  this.rotateAngle -= this.ROTATE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};

Heixiu.prototype.rotateRight = function () {
  this.rotateAngle += this.ROTATE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};

Heixiu.prototype.shrink = function () {
  this.size -= this.RESIZE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};

Heixiu.prototype.expand = function () {
  this.size += this.RESIZE_STEP;
  this.updateTransformMatrix();
  if (this.onChange) {
    this.onChange();
  }
};