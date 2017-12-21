function transformVertices(matrix, vertices) {
  for (var i = 0; i < vertices.length; i++) {
    var temp = mult(
      matrix,
      vec4(vertices[i][0], vertices[i][1], vertices[i][2], 1)
    );
    vertices[i] = vec3(temp[0], temp[1], temp[2]);
  }
}
