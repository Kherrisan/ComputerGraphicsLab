var Scene = {
  objects: [],
  addObject: object => {
    object.onChange = app.draw;
    Scene.objects.push(object);
  }
};
