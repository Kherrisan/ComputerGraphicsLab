var Heixiu = {
  FORWARD_STEP: 0.5,
  ROTATE_STEP: 5,
  RESIZE_STEP: 0.1,
  perVertexColor: true,
  directDraw: true, //indicate that this object have drawing method directly invoked by Main.js,unlike the Scene object.
  rotateAngle: 0, //the angle around axis Y,start from positive x-axis.
  position: vec3(3, 1, -3), //the location of the center point of this animal.
  size: 0.2, //expand and shrink factor.
  bodyMatrix: mat4(), //indicate the relative position and guesture of body to the origin point of Heixiu.
  vertices: [],
  indices: [],
  build: function() {},
  generateTransformMatrix: function() {
    var RE = scalem(Heixiu.size, Heixiu.size, Heixiu.size);
    var T = translate(
      Heixiu.position[0],
      Heixiu.position[1],
      Heixiu.position[2]
    );
    var R = rotateY(Heixiu.rotateAngle);
    return mult(T, mult(R, RE));
  },
  draw: () => {
    var rightEarMatrix = mult(
      translate(-Heixiu.size * 2.5, Heixiu.size * 2, 0),
      rotateZ(-20)
    );
    var leftEarMatrix = mult(
      translate(Heixiu.size * 2.5, Heixiu.size * 2, 0),
      rotateZ(20)
    ); //indicate the relative position and guesture of ears to the origin point of Heixiu.
    var shape_data = {
      origin: vec3(0, 0, 0),
      axis_length: vec3(Heixiu.size * 5, Heixiu.size * 4, Heixiu.size * 4), //5:4:4
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      color: vec4(0, 0, 0, 1)
    };
    var tMatrix = Heixiu.generateTransformMatrix(); //calculate new Transform(forward,backward,left,right,shrink,expand) Matrix with attributes.
    draw_ellipsoid(shape_data, mult(tMatrix, Heixiu.bodyMatrix)); //draw the body.

    shape_data.axis_length = vec2(Heixiu.size * 1.5, Heixiu.size * 1.5);
    shape_data.angle_range_vertical = vec3(0, 2 * Heixiu.size + 0.5, 0);
    draw_taper(shape_data, mult(tMatrix, leftEarMatrix)); //draw left ear.

    draw_taper(shape_data, mult(tMatrix, rightEarMatrix)); //draw right ear.
  },
  walkForward: function() {
    Heixiu.position[0] +=
      Heixiu.FORWARD_STEP * -1 * Math.sin(radians(Heixiu.rotateAngle));
    Heixiu.position[2] +=
      Heixiu.FORWARD_STEP * Math.cos(radians(Heixiu.rotateAngle));
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  walkBackward: function() {
    Heixiu.position[0] +=
      Heixiu.FORWARD_STEP * Math.sin(radians(Heixiu.rotateAngle));
    Heixiu.position[2] +=
      Heixiu.FORWARD_STEP * -1 * Math.cos(radians(Heixiu.rotateAngle));
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  rotateLeft: function() {
    Heixiu.rotateAngle -= Heixiu.ROTATE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  rotateRight: function() {
    Heixiu.rotateAngle += Heixiu.ROTATE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  shrink: function() {
    Heixiu.size -= Heixiu.RESIZE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  },
  expand: function() {
    Heixiu.size += Heixiu.RESIZE_STEP;
    if (Heixiu.onChange) {
      Heixiu.onChange();
    }
  }
};
