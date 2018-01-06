import { vec3, vec2, subtract, cross, vec4 } from "./common/MV";

/*
    This is the function to create an ellipsoid points.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,axis_length,angle_range_vertical,angle_range_horizontal}
            1. property "origin" means the center point of the ellipsoid. It should be an array with 3 elements.
            2. property "axis_length" defines the size of the ellipsoid. It should be an array with 3 elements.
            3. property "angle_range_vertical" defines the range of the ellipsoid to be drawn vertically. It
               should be an array with 2 elements. And the range of these two elements is 0 to 180.
            4. property "angle_range_horizontal" defines the range of the ellipsoid to be drawn horizontally.
               It should be an array with 2 elements. And the range of these two lements is 0 to 360.
 */
export function ellipsoid_generator(
  shape_data: {
    axis_length: vec3;
    origin: vec3;
    angle_range_vertical: vec2;
    angle_range_horizontal: vec2;
  },
  getTextureCoords?: (
    x: number,
    y: number,
    z: number,
    a: number,
    c: number
  ) => vec2
): { vertices: Array<vec3>; normals: Array<vec3>; textCoords?: Array<vec2> } {
  var a = shape_data["axis_length"][0];
  var b = shape_data["axis_length"][1];
  var c = shape_data["axis_length"][2];
  var abias = shape_data["origin"][0];
  var bbias = shape_data["origin"][1];
  var cbias = shape_data["origin"][2];
  var points = [];
  var normals = [];
  let textures = [];
  var theta_step = 3;
  var fai_step = 3;

  for (
    var theta = shape_data["angle_range_vertical"][0];
    theta < shape_data["angle_range_vertical"][1];
    theta += theta_step
  ) {
    for (
      var fai = shape_data["angle_range_horizontal"][0];
      fai < shape_data["angle_range_horizontal"][1];
      fai += fai_step
    ) {
      var p1 = new vec3(
        a * Math.sin(theta / 180 * Math.PI) * Math.cos(fai / 180 * Math.PI) +
          abias,
        c * Math.cos(theta / 180 * Math.PI) + bbias,
        b * Math.sin(theta / 180 * Math.PI) * Math.sin(fai / 180 * Math.PI) +
          cbias
      );
      var n1 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p1);
      if (getTextureCoords) {
        var t1 = getTextureCoords(
          p1[0] - abias,
          p1[1] - bbias,
          p1[2] - cbias,
          2.0 * a,
          2.0 * c
        );
      }
      var p2 = new vec3(
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
      var n2 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p2);
      if (getTextureCoords) {
        var t2 = getTextureCoords(
          p2[0] - abias,
          p2[1] - bbias,
          p2[2] - cbias,
          2.0 * a,
          2.0 * c
        );
      }

      var p3 = new vec3(
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
      var n3 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p3);
      if (getTextureCoords) {
        var t3 = getTextureCoords(
          p3[0] - abias,
          p3[1] - bbias,
          p3[2] - cbias,
          2.0 * a,
          2.0 * c
        );
      }

      var p4 = new vec3(
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
      var n4 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p1);
      if (getTextureCoords) {
        var t4 = getTextureCoords(
          p4[0] - abias,
          p4[1] - bbias,
          p4[2] - cbias,
          2.0 * a,
          2.0 * c
        );
      }

      points.push(p1);
      normals.push(n1);
      points.push(p2);
      normals.push(n2);
      points.push(p3);
      normals.push(n3);
      points.push(p1);
      normals.push(n1);
      points.push(p3);
      normals.push(n3);
      points.push(p4);
      normals.push(n4);
      if (getTextureCoords) {
        textures.push(t1);
        textures.push(t2);
        textures.push(t3);
        textures.push(t1);
        textures.push(t3);
        textures.push(t4);
      }
    }
  }

  return {
    vertices: points,
    normals: normals,
    textCoords: textures
  };
}

/*
    This is the function to create a cylinder points.
    @param shape_data:
        this parameter contains the necessary information for creating an cylinder. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,ellipse_axis,height,angle_range}
            1. property "origin" means the center point of the ellipsoid. It should be an array with 3 elements.
            2. property "ellipse_axis" defines the size of the bottom ellipse of the cylinder. It should be an
               array with 2 elements.
            3. property "height" defines the height of the cylinder. It should be number.
            4. property "angle_range" defines the range of the cylinder to be drawn horizontally.
               It should be an array with 2 elements. And the range of these two elements is 0 to 360.
 */
export function cylinder_generator(shape_data: {
  origin: vec3;
  ellipse_axis: vec2;
  height: number;
  angle_range: vec2;
}): { vertices: Array<vec3>; normals: Array<vec3> } {
  var points = [];
  var normals = [];
  var abias = shape_data["origin"][0];
  var bbias = shape_data["origin"][1];
  var cbias = shape_data["origin"][2];
  var a = shape_data["ellipse_axis"][0];
  var b = shape_data["ellipse_axis"][1];

  for (
    var theta = shape_data["angle_range"][0];
    theta <= shape_data["angle_range"][1];
    theta += 1
  ) {
    var p1 = new vec3(
      a * Math.cos(theta / 180 * Math.PI) + abias,
      -shape_data["height"] / 2 + bbias,
      b * Math.sin(theta / 180 * Math.PI) + cbias
    );
    var p2 = new vec3(
      a * Math.cos(theta / 180 * Math.PI) + abias,
      shape_data["height"] / 2 + bbias,
      b * Math.sin(theta / 180 * Math.PI) + cbias
    );
    var p3 = new vec3(
      a * Math.cos((theta + 1) / 180 * Math.PI) + abias,
      shape_data["height"] / 2 + bbias,
      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
    );
    var p4 = new vec3(
      a * Math.cos((theta + 1) / 180 * Math.PI) + abias,
      -shape_data["height"] / 2 + bbias,
      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
    );
    var normal = new vec3(cross(subtract(p2, p1), subtract(p3, p1)));

    points.push(p1);
    points.push(p2);
    points.push(p3);
    points.push(p1);
    points.push(p3);
    points.push(p4);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
  }

  return {
    vertices: points,
    normals: normals
  };
}

/*
    This is the function to create a taper points.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{origin,axis_length,angle_range_vertical,angle_range_horizontal}
            1. property "origin" means the center point of the bottom of the taper. It should be an array with 3 elements.
            2. property "ellipse_axis" defines the size of the ellipsoid. It should be an array with 3 elements.
            3. property "top_point" defines the top point position. It should be an array with 3 elements.
            4. property "angle_range" defines the range of the bottom ellipse of the taper. It should be an
               array with 2 elements, ranging from 0 to 360.
 */
export function taper_generator(shape_data: {
  origin: vec3;
  ellipse_axis: vec3;
  top_point: vec3;
  angle_range: vec2;
}): { vertices: Array<vec3>; normals: Array<vec3> } {
  var points = [];
  var normals = [];
  var abias = shape_data["origin"][0];
  var bbias = shape_data["origin"][1];
  var cbias = shape_data["origin"][2];
  var a = shape_data["ellipse_axis"][0];
  var b = shape_data["ellipse_axis"][1];

  for (
    var theta = shape_data["angle_range"][0];
    theta < shape_data["angle_range"][1];
    theta++
  ) {
    var p1 = new vec3(
      shape_data["top_point"][0],
      shape_data["top_point"][1],
      shape_data["top_point"][2]
    );
    var p2 = new vec3(
      a * Math.cos(theta / 180 * Math.PI) + abias,
      bbias,
      b * Math.sin(theta / 180 * Math.PI) + cbias
    );
    var p3 = new vec3(
      a * Math.cos((theta + 1) / 180 * Math.PI) + abias,
      bbias,
      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
    );

    var normal = new vec3(cross(subtract(p2, p1), subtract(p3, p1)));
    points.push(p1);
    points.push(p2);
    points.push(p3);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
  }

  return {
    vertices: points,
    normals: normals
  };
}

function get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p) {
  return new vec3(
    Math.sqrt(a * a + b * b + c * c) /
      2 /
      Math.sqrt(
        Math.pow(p[0] - abias, 2) +
          Math.pow(p[1] - cbias, 2) +
          Math.pow(p[2] - bbias, 2)
      ) *
      2 *
      (p[0] - abias) /
      a /
      a,
    Math.sqrt(a * a + b * b + c * c) /
      2 /
      Math.sqrt(
        Math.pow(p[0] - abias, 2) +
          Math.pow(p[1] - cbias, 2) +
          Math.pow(p[2] - bbias, 2)
      ) *
      2 *
      (p[1] - cbias) /
      c /
      c,
    Math.sqrt(a * a + b * b + c * c) /
      2 /
      Math.sqrt(
        Math.pow(p[0] - abias, 2) +
          Math.pow(p[1] - cbias, 2) +
          Math.pow(p[2] - bbias, 2)
      ) *
      2 *
      (p[2] - bbias) /
      b /
      b
  );
}

/*
    This is the function to create a cuboid points.
    @param shape_data:
        this parameter contains the necessary information for creating an ellipsoid. It should be defined
        in Javascript Object Form. The object should contains these properties:
        shape_data{bottom_leftup, bottom_leftdown, bottom_rightup, bottom_rightdown, height}
            1. property "bottom_leftup" means the left-up point of the bottom of the cuboid. It should be an array with 3 elements.
            2. property "bottom_leftdown" means the left-down point of the bottom of the cuboid. It should be an array with 3 elements.
            3. property "bottom_rightup" means the right-up point of the bottom of the cuboid. It should be an array with 3 elements.
            4. property "bottom_rightdown" means the left-up point of the bottom of the cuboid. It should be an array with 3 elements.
            5. property "height" means the height of the cuboid. It should be an number.
 */
export function cuboid_generator(shape_data: {
  buttom_leftup: vec3;
  buttom_leftdown: vec3;
  buttom_rightup: vec3;
  buttom_rightdown: vec3;
  height: number;
}): { vertices: Array<vec3>; normals: Array<vec3> } {
  var pointArray;
  var points;
  var normals;
  var indice = [
    1,
    3,
    8,
    1,
    8,
    5,
    1,
    6,
    7,
    1,
    7,
    3,
    6,
    2,
    4,
    6,
    4,
    7,
    2,
    5,
    8,
    2,
    8,
    4,
    3,
    7,
    4,
    3,
    4,
    8,
    1,
    5,
    2,
    1,
    2,
    6
  ];

  for (var k = 0; k < 36; k++) indice[k]--;

  var p1 = new vec3(
    shape_data["bottom_leftup"][0],
    shape_data["bottom_leftup"][1],
    shape_data["bottom_leftup"][2]
  );
  pointArray.push(p1);
  var p2 = new vec3(
    shape_data["bottom_rightdown"][0],
    shape_data["bottom_rightdown"][1],
    shape_data["bottom_rightdown"][3]
  );
  pointArray.push(p2);
  var p3 = new vec3(
    shape_data["bottom_leftup"][0],
    shape_data["bottom_leftup"][1] + shape_data["height"],
    shape_data["bottom_leftup"][2]
  );
  pointArray.push(p3);
  var p4 = new vec3(
    shape_data["bottom_rightdown"][0],
    shape_data["bottom_rightdown"][1] + shape_data["height"],
    shape_data["bottom_rightdown"][2]
  );
  pointArray.push(p4);
  var p5 = new vec3(
    shape_data["bottom_leftdown"][0],
    shape_data["bottom_leftdown"][1],
    shape_data["bottom_leftdown"][2]
  );
  pointArray.push(p5);
  var p6 = new vec3(
    shape_data["bottom_rightup"][0],
    shape_data["bottom_rightup"][1],
    shape_data["bottom_rightup"][2]
  );
  pointArray.push(p6);
  var p7 = new vec3(
    shape_data["bottom_rightup"][0],
    shape_data["bottom_rightup"][1] + shape_data["height"],
    shape_data["bottom_rightup"][2]
  );
  pointArray.push(p7);
  var p8 = new vec3(
    shape_data["bottom_leftdown"][0],
    shape_data["bottom_leftdown"][1] + shape_data["height"],
    shape_data["bottom_leftdown"][2]
  );
  pointArray.push(p8);

  var normal_tmp;
  for (var i = 0; i < 36; i += 6) {
    normal_tmp = get_rectangle_normals([
      pointArray[indice[i]],
      pointArray[indice[i + 1]],
      pointArray[indice[i + 2]],
      pointArray[indice[i + 5]]
    ]);
    for (let j = 0; j < 6; j++) {
      normals.push(normal_tmp[j]);
      points.push(pointArray[indice[i + j]]);
    }
  }

  return {
    vertices: points,
    normals: normals
  };
}

function get_rectangle_normals(vertices: Array<vec3>): Array<vec3> {
  var t1 = subtract(vertices[2], vertices[0]);
  var t2 = subtract(vertices[1], vertices[3]);

  var normal = new vec3(cross(t1, t2));

  return [normal, normal, normal, normal, normal, normal];
}
