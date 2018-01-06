import { mat4, mult } from "./common/MV";

export class VirtualComponent {
  private childs: Array<VirtualComponent>;
  public constructor(
    protected translation: mat4,
    protected rotation: mat4,
    protected parent: VirtualComponent
  ) {}

  public addChild(child: VirtualComponent): VirtualComponent {
    if (this.childs == null) {
      this.childs = new Array<VirtualComponent>();
    }
    child.parent = this;
    this.childs.push(child);
    return this;
  }

  public getTransformMatrix(): mat4 {
    let parentMatrix: mat4;
    if (this.parent != null) {
      parentMatrix = this.parent.getTransformMatrix();
    } else {
      parentMatrix = new mat4();
    }
    return mult(parentMatrix, mult(this.rotation, this.translation));
  }

  public draw(app: any): void {
    for (let child of this.childs) {
      child.draw(app);
    }
  }
}
