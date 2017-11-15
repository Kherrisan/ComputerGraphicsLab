var Heixiu = {
  FORWARD_STEP: 0.5,
  ROTATE_STEP: 5,
  RESIZE_STEP: 0.5,
  perVertexColor: true,
  directDraw: true, //indicate that this object have drawing method directly invoked by Main.js,unlike the Scene object.
  rotateAngle: 0, //the angle around axis Y,start from positive x-axis.
  position: vec3(0, 0, 0), //the location of the center point of this animal.
  size: 0.5, //expand and shrink factor.
  generateTransformMatrix: function() {
    var RE = scalem(Heixiu.size, Heixiu.size, Heixiu.size);
    var T = translate(Heixiu.position[0], 0.0, Heixiu.position[2]);
    var R = rotateY(Heixiu.rotateAngle);
    return mult(T, mult(R, RE));
  },
  draw: () => {
    var shape_data = {
      origin: Heixiu.position,
      axis_length: vec3(Heixiu.size * 5, Heixiu.size * 4, Heixiu.size * 4), //5:4:4
      angle_range_vertical: vec2(0, 180),
      angle_range_horizontal: vec2(0, 360),
      color: vec4(0, 0, 0, 1)
    };
    var tMatrix = Heixiu.generateTransformMatrix(); //calculate new Transform(forward,backward,left,right,shrink,expand) Matrix with attributes.
    draw_ellipsoid(shape_data, tMatrix); //draw the body.
    shape_data.origin = vec3(
      //left ear buttom point
      Heixiu.position[0] - Heixiu.size * 2.5,
      Heixiu.position[1] + Heixiu.size * 2,
      Heixiu.position[2]
    );
    shape_data.axis_length = vec2(Heixiu.size * 1.5, Heixiu.size * 0.3);
    //left ear top point
    shape_data.angle_range_vertical = vec3(
      Heixiu.position[0] - Heixiu.size * 2 - 1,
      Heixiu.position[1] + Heixiu.size * 3+1,
      Heixiu.position[2]
    );
    shape_data.angle_range_horizontal = vec2(0, 360);
    draw_taper(shape_data, tMatrix); //draw left ear.
    shape_data.origin = vec3(
      //set right ear buttom point
      Heixiu.position[0] + Heixiu.size * 2.5,
      Heixiu.position[1] + +Heixiu.size * 2,
      Heixiu.position[2]
    );
    shape_data.axis_length = vec2(Heixiu.size * 1.5, Heixiu.size * 0.3);
    //right ear top point
    shape_data.angle_range_vertical = vec3(
      Heixiu.position[0] + Heixiu.size * 2 + 1,
      Heixiu.position[1] + Heixiu.size * 3 + 1,
      Heixiu.position[2]
    );
    draw_taper(shape_data, tMatrix); //draw right ear.
  },
  walkForward: function() {
    Heixiu.position[0] +=
      Heixiu.FORWARD_STEP * -1 * Math.sin(radians(Heixiu.rotateAngle));
    Heixiu.position[2] +=
      Heixiu.FORWARD_STEP * Math.cos(radians(Heixiu.rotateAngle));
  },
  walkBackward: function() {
    Heixiu.position[0] +=
      Heixiu.FORWARD_STEP * Math.sin(radians(Heixiu.rotateAngle));
    Heixiu.position[2] +=
      Heixiu.FORWARD_STEP * -1 * Math.cos(radians(Heixiu.rotateAngle));
  },
  rotateLeft: function() {
    Heixiu.rotateAngle -= Heixiu.ROTATE_STEP;
  },
  rotateRight: function() {
    Heixiu.rotateAngle += Heixiu.ROTATE_STEP;
  },
  shrink: function() {
    Heixiu.size -= RESIZE_STEP;
  },
  expand: function() {
    Heixiu.size += RESIZE_STEP;
  }
};
