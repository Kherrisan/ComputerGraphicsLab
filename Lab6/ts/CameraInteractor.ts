import { Camera } from "./Camera";
export class CameraInteractor {
  private static MOTION_FACTOR = 10.0;
  private dragging: boolean = false;
  private x: number = 0;
  private y: number = 0;
  private lastX: number = 0;
  private lastY: number = 0;

  public constructor(
    private canvas: HTMLCanvasElement,
    private camera: Camera
  ) {
    this.canvas.onmousedown = ev => {
      this.onMouseDown(ev);
    };
    this.canvas.onmouseup = ev => {
      this.onMouseUp();
    };
    this.canvas.onmousemove = ev => {
      this.onMouseMove(ev);
    };
  }

  private rotate(dx: number, dy: number): void {
    let dElevation = -20.0 / this.canvas.height;
    let dAzimuth = -20.0 / this.canvas.width;

    let nAzimuth = dx * dAzimuth * CameraInteractor.MOTION_FACTOR; //方位角
    let nElevation = dy * dElevation * CameraInteractor.MOTION_FACTOR; //仰角

    this.camera.changeAzimuth(nAzimuth);
    this.camera.changeElevation(nElevation);
  }

  private onMouseUp(): void {
    this.dragging = false;
  }

  private onMouseDown(ev: MouseEvent): void {
    this.dragging = true;
    this.x = ev.clientX;
    this.y = ev.clientY;
  }

  private onMouseMove(ev: MouseEvent): void {
    if (!this.dragging) return;
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = ev.clientX;
    this.y = ev.clientY;
    let dx = this.x - this.lastX;
    let dy = this.y - this.lastY;
    this.rotate(dx, dy);
  }
}
