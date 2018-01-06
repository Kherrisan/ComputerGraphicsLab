import { vec3, vec4 } from "./common/MV";

export class Material {
  public static Black: Material = new Material(
    new vec4(0.1, 0.1, 0.1, 1.0),
    new vec4(0.2, 0.2, 0.2, 10),
    new vec4(0.01, 0.01, 0.01, 1.0),
    1.0
  );
  public static Green: Material = new Material(
    new vec4(0.1, 0.1, 0.1, 1.0),
    new vec4(0.2, 0.2, 0.2, 10),
    new vec4(0.01, 0.01, 0.01, 1.0),
    1.0
  );

  public constructor(
    public ambient: vec4,
    public specular: vec4,
    public diffuse: vec4,
    public shininess: number
  ) {}
}
