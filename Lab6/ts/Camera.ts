import {
  vec3,
  mat4,
  mult,
  translate,
  rotateX,
  rotateY,
  inverse4
} from "./common/MV";
import { App } from "./App";

export class Camera {
  public position: vec3;
  public azimuth: number = 0.0;
  public elevation: number = 0.0;

  public constructor(x: number, y: number, z: number, private app: App) {
    this.position = new vec3(x, y, z);
  }

  public getModelViewMatrix(): mat4 {
    let matrix = new mat4();
    matrix = mult(matrix, translate(this.position));
    matrix = mult(matrix, rotateY(this.azimuth));
    matrix = mult(matrix, rotateX(this.elevation));
    return inverse4(matrix);
  }

  public changePosition(position: vec3): void {
    this.position = position;
    this.app.render();
  }

  public changeElevation(delta: number): void {
    this.elevation += delta;
    if (this.elevation > 360 || this.elevation < -360) {
      this.elevation = this.elevation % 360;
    }
    this.app.render();
  }

  public changeAzimuth(delta: number) {
    this.azimuth += delta;
    if (this.azimuth > 360 || this.azimuth < -360) {
      this.azimuth = this.azimuth % 360;
    }
    this.app.render();
  }
}
