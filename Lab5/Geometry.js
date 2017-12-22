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

    @param rotate_mat:
        this parameter contains the matrix which spacial transformation performs based on.

    @param program:
        the program is a pointer to shaders.
 */
function ellipsoid_generator(shape_data) {
    var a = shape_data["axis_length"][0];
    var b = shape_data["axis_length"][1];
    var c = shape_data["axis_length"][2];
    var abias = shape_data["origin"][0];
    var bbias = shape_data["origin"][1];
    var cbias = shape_data["origin"][2];
    var points = [];
    var normals = [];
    var theta_step = 3;
    var fai_step = 3;
    
    for (
         var theta = shape_data["angle_range_vertical"][0]; theta < shape_data["angle_range_vertical"][1]; theta += theta_step
         ) {
        for (
             var fai = shape_data["angle_range_horizontal"][0]; fai < shape_data["angle_range_horizontal"][1]; fai += fai_step
             ) {
            var p1 = vec3(
                          a * Math.sin(theta / 180 * Math.PI) * Math.cos(fai / 180 * Math.PI) +
                          abias,
                          c * Math.cos(theta / 180 * Math.PI) + bbias,
                          b * Math.sin(theta / 180 * Math.PI) * Math.sin(fai / 180 * Math.PI) +
                          cbias
                          );
            var n1 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p1);
            
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
            var n2 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p2);
            
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
            var n3 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p3);
            
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
            var n4 = get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p1);
            
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
            
        }
    }
    
    return {
    vertices: points,
    normals: normals
    };
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

    @param rotate_mat:
        this parameter contains the matrix which spacial transformation performs based on.

    @param program:
        the program is a pointer to shaders.
 */
function cylinder_generator(shape_data) {
    var points = [];
    var normals = [];
    var abias = shape_data["origin"][0];
    var bbias = shape_data["origin"][1];
    var cbias = shape_data["origin"][2];
    var a = shape_data["ellipse_axis"][0];
    var b = shape_data["ellipse_axis"][1];
    
    for (var theta = shape_data["angle_range"][0]; theta <= shape_data["angle_range"][1]; theta += 1) {
        var p1 = vec3(
                      a * Math.cos(theta / 180 * Math.PI) + abias, -shape_data["height"] / 2 + bbias,
                      b * Math.sin(theta / 180 * Math.PI) + cbias
                      );
        var p2 = vec3(
                      a * Math.cos(theta / 180 * Math.PI) + abias,
                      shape_data["height"] / 2 + bbias,
                      b * Math.sin(theta / 180 * Math.PI) + cbias
                      );
        var p3 = vec3(
                      a * Math.cos((theta + 1) / 180 * Math.PI) + abias,
                      shape_data["height"] / 2 + bbias,
                      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
                      );
        var p4 = vec3(
                      a * Math.cos((theta + 1) / 180 * Math.PI) + abias, -shape_data["height"] / 2 + bbias,
                      b * Math.sin((theta + 1) / 180 * Math.PI) + cbias
                      );
        var normal = vec3(cross(subtract(p2,p1), subtract(p3,p1)));
        
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

    @param rotate_mat:
        this parameter contains the matrix which spacial transformation performs based on.

    @param program:
        the program is a pointer to shaders.
 */
function taper_generator(shape_data) {
  var points = [];
  var normals = [];
  var abias = shape_data["origin"][0];
  var bbias = shape_data["origin"][1];
  var cbias = shape_data["origin"][2];
  var a = shape_data["ellipse_axis"][0];
  var b = shape_data["ellipse_axis"][1];

  for (var theta = shape_data["angle_range"][0]; theta < shape_data["angle_range"][1]; theta++) {
    var p1 = vec3(shape_data["top_point"][0], shape_data["top_point"][1], shape_data["top_point"][2]);
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

    var normal = vec3(cross(subtract(p2,p1), subtract(p3,p1)));
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

function get_ellipsoid_normals(a, b, c, abias, bbias, cbias, p){
    return vec3(
                Math.sqrt(a * a + b * b + c * c)/ 2 / Math.sqrt(Math.pow(p[0] - abias, 2) + Math.pow(p[1] - cbias, 2) + Math.pow(p[2] - bbias, 2)) * 2 * (p[0] - abias) / a / a,
                Math.sqrt(a * a + b * b + c * c)/ 2 / Math.sqrt(Math.pow(p[0] - abias, 2) + Math.pow(p[1] - cbias, 2) + Math.pow(p[2] - bbias, 2)) * 2 * (p[1] - cbias) / c / c,
                Math.sqrt(a * a + b * b + c * c)/ 2 / Math.sqrt(Math.pow(p[0] - abias, 2) + Math.pow(p[1] - cbias, 2) + Math.pow(p[2] - bbias, 2)) * 2 * (p[2] - bbias) / b / b);
}
