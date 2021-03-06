var Scene = {
  objects: [],
  addObject: object => {
    object.onChange = app.draw;
    if (object.directDraw) {
      Scene.objects.push(object);
      return;
    }
    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(object.vertices),
      gl.STATIC_DRAW
    );

    if (object.perVertexColor) {
      var colorBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(object.colors),
        gl.STATIC_DRAW
      );
      object.cbo = colorBufferObject;
    }

    var indexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(object.indices),
      gl.STATIC_DRAW
    );

    object.vbo = vertexBufferObject;
    object.ibo = indexBufferObject;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    Scene.objects.push(object);
  }
};
