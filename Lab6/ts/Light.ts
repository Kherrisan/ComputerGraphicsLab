import { vec3, vec4 } from "./common/MV";

export class Light implements Interactable {
  public position: vec4;
  private constructor(
    public ambient: any,
    public specular: any,
    public diffuse: any
  ) {}

  public static build(): Light {
    let light = new Light(
      new vec4(1.0, 1.0, 1.0, 1.0),
      new vec4(1.0, 1.0, 1.0, 1.0),
      new vec4(1.0, 1.0, 1.0, 1.0)
    );
    light.position = new vec4(0, 0, 10, 1);
    return light;
  }

  public rotateLeft(): void {}

  public rotateRight(): void {}

  public walkForward(): void {}

  public walkBackward(): void {}
}
