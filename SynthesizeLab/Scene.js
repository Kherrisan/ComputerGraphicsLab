//场景对象，其实是一个容纳所有需要绘制的对象的容器。
var Scene = {
  objects: [],
  addObject: object => {
    object.onChange = app.draw;
    Scene.objects.push(object);
  }
};
