// var canvas;
// var gl;

// window.onload = function init() {
//   canvas = document.getElementById("gl-canvas");

//   gl = WebGLUtils.setupWebGL(canvas);
//   if (!gl) {
//     alert("WebGL isn't available");
//   }

//   gl.viewport(0, 0, canvas.width, canvas.height);
//   gl.clearColor(1.0, 1.0, 1.0, 1.0);
//   gl.enable(gl.DEPTH_TEST);

//   var program = initShaders(gl, "vertex-shader", "fragment-shader");
//   gl.useProgram(program);
// };

/*
    This is the function to create an ellipsoid and do some transform on it based on rotate_mat matrix.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,axis_length,angle_range_vertical,angle_range_horizontal,color}
            1. property "origin" means the center point of the ellipsoid. It should be an array with 3 elements.
            2. property "axis_length" defines the size of the ellipsoid. It should be an array with 3 elements.
            3. property "angle_range_vertical" defines the range of the ellipsoid to be drawn vertically. It
               should be an array with 2 elements. And the range of these two elements is 0 to 180.
            4. property "angle_range_horizontal" defines the range of the ellipsoid to be drawn horizontally.
               It should be an array with 2 elements. And the range of these two lements is 0 to 360.
            5. property "color" defines the color of the ellipsoid. It should be a four dimension vector.

    @param rotate_mat:
        this parameter contains the matrix which spacial transformation performs based on.

    @param program:
        the program is a pointer to shaders.
 */
function draw_ellipsoid(shape_data, rotate_mat) {
  for (var i = 0; i < 12; i++) {
    var ellipse_vertices = ellipsoid_generator(
      shape_data["origin"],
      shape_data["axis_length"],
      shape_data["angle_range_vertical"],
      shape_data["angle_range_horizontal"]
    );
    var colors = generateColors(ellipse_vertices.length, shape_data["color"]);
    renderPoints(ellipse_vertices, colors, rotate_mat);
  }
}

/*
    This is the function to create a cylinder and do some transform on it based on rotate_mat matrix.
    @param shape_data:
        this parameter contains the necessary information for creating an cylinder. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,ellipse_axis,height,angle_range,color}
            1. property "origin" means the center point of the ellipsoid. It should be an array with 3 elements.
            2. property "ellipse_axis" defines the size of the bottom ellipse of the cylinder. It should be an
               array with 2 elements.
            3. property "height" defines the height of the cylinder. It should be number.
            4. property "angle_range" defines the range of the cylinder to be drawn horizontally.
               It should be an array with 2 elements. And the range of these two elements is 0 to 360.
            5. property "color" defines the color of the ellipsoid. It should be a four dimension vector.

    @param rotate_mat:
        this parameter contains the matrix which spacial transformation performs based on.

    @param program:
        the program is a pointer to shaders.
 */
function draw_cylinder(shape_data, rotate_mat) {
  for (var i = 0; i < 12; i++) {
    var ellipse_vertices = cylinder_generator(
      shape_data["origin"],
      shape_data["axis_length"],
      shape_data["height"],
      shape_data["angle_range"]
    );
    var colors = generateColors(ellipse_vertices.length, shape_data["color"]);
    renderPoints(ellipse_vertices, colors, rotate_mat);
  }
}

/*
    This is the function to create a taper and do some transform on it based on rotate_mat matrix.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,axis_length,angle_range_vertical,angle_range_horizontal,color}
            1. property "origin" means the center point of the bottom of the taper. It should be an array with 3 elements.
            2. property "ellipse_axis" defines the size of the ellipsoid. It should be an array with 3 elements.
            3. property "top_point" defines the top point position. It should be an array with 3 elements.
            4. property "angle_range" defines the range of the bottom ellipse of the taper. It should be an
               array with 2 elements, ranging from 0 to 360.
            5. property "color" defines the color of the taper. It should be a four dimension vector.

    @param rotate_mat:
        this parameter contains the matrix which spacial transformation performs based on.

    @param program:
        the program is a pointer to shaders.
 */
function draw_taper(shape_data, rotate_mat) {
  for (var i = 0; i < 12; i++) {
    var ellipse_vertices = taper_generator(
      shape_data["origin"],
      shape_data["axis_length"],
      shape_data["angle_range_vertical"],
      shape_data["angle_range_horizontal"]
    );
    var colors = generateColors(ellipse_vertices.length, shape_data["color"]);
    renderPoints(ellipse_vertices, colors, rotate_mat);
  }
}

function renderPoints(vertices, colors, mat) {
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aVertexColor);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aVertexPosition);

  gl.uniformMatrix4fv(uTMatrix, false, flatten(mat));

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}

function ellipsoid_generator(
  origin,
  axis_length,
  angle_range_vertical,
  angle_range_horizontal
) {
  var a = axis_length[0];
  var b = axis_length[1];
  var c = axis_length[2];
  var abias = origin[0];
  var bbias = origin[1];
  var cbias = origin[2];
  var points = [];
  var theta_step = 3;
  var fai_step = 3;

  for (
    var theta = angle_range_vertical[0];
    theta < angle_range_vertical[1];
    theta += theta_step
  ) {
    for (
      var fai = angle_range_horizontal[0];
      fai < angle_range_horizontal[1];
      fai += fai_step
    ) {
      var p1 = vec3(
        a * Math.sin(theta / 180 * Math.PI) * Math.cos(fai / 180 * Math.PI) +
          abias,
        c * Math.cos(theta / 180 * Math.PI) + bbias,
        b * Math.sin(theta / 180 * Math.PI) * Math.sin(fai / 180 * Math.PI) +
          cbias
      );

      var p2 = vec3(
        a *
          Math.sin((theta + theta_step) / 180 * Math.PI) *
          Math.cos(fai / 180 * Math.PI) +
          abias,
        c * Math.cos((theta + theta_step) / 180 * Math.PI) + bbias,
        b *
          Math.sin((theta + theta_step) / 180 * Math.PI) *
          Math.sin(fai / 180 * Math.PI) +
          cbias
      );

      var p3 = vec3(
        a *
          Math.sin((theta + theta_step) / 180 * Math.PI) *
          Math.cos((fai + fai_step) / 180 * Math.PI) +
          abias,
        c * Math.cos((theta + theta_step) / 180 * Math.PI) + bbias,
        b *
          Math.sin((theta + theta_step) / 180 * Math.PI) *
          Math.sin((fai + fai_step) / 180 * Math.PI) +
          cbias
      );

      var p4 = vec3(
        a *
          Math.sin(theta / 180 * Math.PI) *
          Math.cos((fai + fai_step) / 180 * Math.PI) +
          abias,
        c * Math.cos(theta / 180 * Math.PI) + bbias,
        b *
          Math.sin(theta / 180 * Math.PI) *
          Math.sin((fai + fai_step) / 180 * Math.PI) +
          cbias
      );

      points.push(p1);
      points.push(p2);
      points.push(p3);
      points.push(p1);
      points.push(p3);
      points.push(p4);
    }
  }

  return points;
}

function taper_generator(origin, ellipse_axis, top_point, angle_range) {
  var points = [];
  var abias = origin[0];
  var bbias = origin[1];
  var cbias = origin[2];
  var a = ellipse_axis[0];
  var b = ellipse_axis[1];

  for (var theta = angle_range[0]; theta < angle_range[1]; theta+=3) {
    var p1 = vec3(top_point[0], top_point[1], top_point[2]);
    var p2 = vec3(
      a * Math.cos(theta / 180 * Math.PI) + abias,
      bbias,
      b * Math.sin(theta / 180 * Math.PI) + cbias
    );
    var p3 = vec3(
      a * Math.cos((theta + 1) / 180 * Math.PI) + abias,
      bbias,
      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
    );

    points.push(p1);
    points.push(p2);
    points.push(p3);
  }

  return points;
}

function cylinder_generator(origin, ellipse_axis, height, angle_range) {
  var points = [];
  var abias = origin[0];
  var bbias = origin[1];
  var cbias = origin[2];
  var a = ellipse_axis[0];
  var b = ellipse_axis[1];

  for (var theta = angle_range[0]; theta <= angle_range[1]; theta+=3) {
    var p1 = vec3(
      a * Math.cos(theta / 180 * Math.PI) + abias,
      -height / 2 + bbias,
      b * Math.sin(theta / 180 * Math.PI) + cbias
    );
    var p2 = vec3(
      a * Math.cos(theta / 180 * Math.PI) + abias,
      height / 2 + bbias,
      b * Math.sin(theta / 180 * Math.PI) + cbias
    );
    var p3 = vec3(
      a * Math.cos((theta + 1) / 180 * Math.PI) + abias,
      height / 2 + bbias,
      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
    );
    var p4 = vec3(
      a * Math.cos((theta + 1) / 180 * Math.PI) + abias,
      -height / 2 + bbias,
      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
    );

    points.push(p1);
    points.push(p2);
    points.push(p3);
    points.push(p1);
    points.push(p3);
    points.push(p4);
  }

  return points;
}

function generateColors(count, color) {
  var colors = [];

  for (var i = 0; i < count; i++) {
    colors.push(color);
  }

  return colors;
}
