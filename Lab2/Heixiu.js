var Heixiu = {
  directDraw: true, //indicate that this object have drawing method directly invoked by Main.js,unlike the Scene object.
  rotateAngle: 0, //the angle around axis Y,start from positive x-axis.
  currentPosition: vec3(0, 0, 0), //the location of the center point of this animal.
  currentSize: 2, //expand and shrink factor.
  generateTransformMatrix: function() {
    return mat4();
  },
  draw: () => {
      
    // var shape_data = {
    //   origin: Heixiu.currentPosition,
    //   axis_length: vec3(
    //     Heixiu.currentSize * 5,
    //     Heixiu.currentSize * 2,
    //     Heixiu.currentSize * 2
    //   ), //5:2:2
    //   angle_range_vertical: vec2(0, 180),
    //   angle_range_horizontal: vec2(0, 360),
    //   color: vec4(0, 0, 0, 1)
    // };
    // var tMatrix = Heixiu.generateTransformMatrix(); //calculate new Transform(forward,backward,left,right,shrink,expand) Matrix with attributes.
    // draw_ellipsoid(shape_data, tMatrix); //draw the body.
    // shape_data.origin = vec3(
    //   Heixiu.currentPosition.x + Heixiu.currentSize * 2,
    //   Heixiu.currentPosition.y + Heixiu.currentSize * 2,
    //   Heixiu.currentPosition.z
    // );
    // shape_data.asix_length = vec2(Heixiu.currentSize, Heixiu.currentSize * 0.5);
    // shape_data.angle_range_vertical = vec3(
    //   Heixiu.currentPosition.x + (Heixiu.currentSize + 1) * 2,
    //   Heixiu.currentPosition.y + (Heixiu.currentSize + 2) * 2,
    //   Heixiu.currentPosition.z
    // );
    // draw_taper(shape_data, tMatrix); //draw left ear.
    // shape_data.origin = vec3(
    //   Heixiu.currentPosition.x - Heixiu.currentSize * 2,
    //   Heixiu.currentPosition.y + Heixiu.currentSize * 2,
    //   Heixiu.currentPosition.z
    // );
    // shape_data.asix_length = vec2(Heixiu.currentSize, Heixiu.currentSize * 0.5);
    // shape_data.angle_range_vertical = vec3(
    //   Heixiu.currentPosition.x - (Heixiu.currentSize + 1) * 2,
    //   Heixiu.currentPosition.y + (Heixiu.currentSize + 2) * 2,
    //   Heixiu.currentPosition.z
    // );
    // draw_taper(shape_data, tMatrix); //draw right ear.
  },
  walkForward: function() {},
  walkBackward: function() {},
  rotateLeft: function() {},
  rotateRight: function() {},
  shrink: function() {},
  expand: function() {}
};
