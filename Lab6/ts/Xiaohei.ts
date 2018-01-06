import { VirtualComponent } from "./VirtualComponent";
import { Component } from "./Component";
import {
  translate,
  mat4,
  vec2,
  vec3,
  mult,
  rotateX,
  rotateZ
} from "./common/MV";
import {
  ellipsoid_generator,
  taper_generator,
  cylinder_generator
} from "./Geometry";
import { Material } from "./Material";

export class Xiaohei extends VirtualComponent implements Interactable {
  private position: vec3;
  private angle: number;
  //小黑对象。
  public static build(gl: any, x: number, y: number, z: number): Xiaohei {
    //在x，y，z处正方向构造一只小黑。
    let xiaohei = new Xiaohei(translate(x, y, z), new mat4(), null);
    //以小黑为父对象，构造子对象。
    let head = Head.build(gl, xiaohei);
    let leftEar = Ear.build(gl, xiaohei, -0.05, -3.2);
    let rightEar = Ear.build(gl, xiaohei, 0.05, 3.2);
    let leftInnerEar = InnerEar.build(
      gl,
      xiaohei,
      -0.05,
      new vec2(100, 200),
      -3
    );
    let rightInnerEar = InnerEar.build(gl, xiaohei, 0.05, new vec2(0, 90), 3);
    let body = Body.build(gl, xiaohei);
    let leftArm = Arm.build(gl, xiaohei, -0.1, mult(rotateZ(-15), rotateX(15)));
    let rightArm = Arm.build(gl, xiaohei, 0.1, mult(rotateZ(15), rotateX(15)));
    let leftLeg = Leg.build(gl, xiaohei, 0, mult(rotateZ(-15), rotateX(15)));
    let rightLeg = Leg.build(gl, xiaohei, 0, mult(rotateZ(15), rotateX(15)));
    xiaohei
      .addChild(head)
      .addChild(leftEar)
      .addChild(rightEar)
      .addChild(leftInnerEar)
      .addChild(rightInnerEar)
      .addChild(body)
      .addChild(leftArm)
      .addChild(rightArm)
      .addChild(leftLeg)
      .addChild(rightLeg);
    return xiaohei;
  }

  public walkForward(): void {
    let forward = translate(0, 0, 1);
    this.translation = mult(forward, this.translation);
  }

  public walkBackward(): void {}

  public rotateLeft(): void {}

  public rotateRight(): void {}
}

class Head extends Component {
  //小黑头部（不包括耳朵）。
  public static build(gl: any, xiaohei: VirtualComponent): Head {
    //在某只小黑上构造一个头，以头部中心作为小黑对象的中心。
    //因此头部相对于父对象不需要平移和旋转。
    let head = new Head(new mat4(), new mat4(), xiaohei, Material.Black);
    let verticesAndNormals = ellipsoid_generator(
      {
        origin: new vec3(0, 0, 0),
        axis_length: new vec3(2.5, 2, 2),
        angle_range_vertical: new vec2(0, 180),
        angle_range_horizontal: new vec2(0, 360)
      },
      (x: number, y: number, z: number, width: number, height: number) => {
        if (z < 0) {
          return new vec2(0, 0);
        }
        x = (x + width / 2.0) / width;
        y = (-y + height / 2.0) / height;
        return new vec2(x, y);
      }
    );
    head.initData(gl, verticesAndNormals);
    let image: HTMLImageElement = <HTMLImageElement>document.getElementById(
      "texImage"
    );
    head.setTexture(gl, image);
    return head;
  }
}

class Ear extends Component {
  //小黑（外）耳朵。
  public static build(
    gl,
    xiaohei: VirtualComponent,
    bottom: number,
    top: number
  ): Ear {
    //（外）耳朵相对于父节点的平移、旋转矩阵。
    //bottom:耳朵最终位置-圆锥底面中心点相对于父对象的x轴方向平移量。左右耳不同。
    //top:自身坐标系下，顶点相对于x轴方向平移量。左右耳不同。
    let translation = translate(bottom, 2, 0); //bottom应包含于这个矩阵中。
    let ear = new Ear(translation, new mat4(), xiaohei, Material.Black);
    let verticesAndNormals = taper_generator({
      origin: new vec3(0, 0, 0),
      ellipse_axis: new vec2(2.5, 1.5),
      top_point: new vec3(top, 2, 0),
      angle_range: new vec2(0, 360)
    }); //top应被传递到这个函数中。
    ear.initData(gl, verticesAndNormals);
    return ear;
  }
}

class InnerEar extends Component {
  //小黑（内）耳朵。
  public static build(
    gl,
    parent: VirtualComponent,
    bottom: number,
    range: vec2,
    top: number
  ): InnerEar {
    //（内）耳朵相对于父节点的平移、旋转矩阵。
    //bottom:耳朵最终位置-圆锥底面中心点相对于父对象的x轴方向平移量。左右耳不同。
    //top:自身坐标系下，顶点相对于x轴方向平移量。左右耳不同。
    let translation = translate(bottom, 0.25, 0); //bottom应包含于这个矩阵中。
    let innerEar = new InnerEar(
      translation,
      new mat4(),
      parent,
      Material.Green
    );
    let verticesAndNormals = taper_generator({
      origin: new vec3(0, 0, 0),
      ellipse_axis: new vec2(2.5, 1.5),
      top_point: new vec3(top, 1.8, 0.175),
      angle_range: range
    }); //top应被传递到这个函数中。
    innerEar.initData(gl, verticesAndNormals);
    return innerEar;
  }
}

class Body extends Component {
  //小黑身体
  public static build(gl, parent: VirtualComponent): Body {
    let translationToHead = translate(0, -1.75, -2.25);
    let body = new Body(translationToHead, new mat4(), parent, Material.Black);
    let verticesAndNormals = ellipsoid_generator({
      origin: new vec3(0, 0, 0),
      axis_length: new vec3(1, 2, 1),
      angle_range_vertical: new vec2(0, 180),
      angle_range_horizontal: new vec2(0, 360)
    });
    body.initData(gl, verticesAndNormals);
    return body;
  }
}

class Arm extends Component {
  public static build(
    gl,
    parent: VirtualComponent,
    trans: number,
    rotate: mat4
  ): Arm {
    //trans:手臂相对于父对象（小黑）的平移矩阵。即在x轴上距离z轴的距离。
    //rotate:腿的旋转矩阵。圆柱的初始位置应该在原点出xoz平面下方。这样方便腿绕关节旋转。在此基础上进行旋转。
    let translation = translate(trans, -2.5, -1.5); //translate应包含在这个矩阵中。
    let arm = new Arm(translation, rotate, parent, Material.Black);
    let verticesAndNormals = cylinder_generator({
      origin: new vec3(0, 0, 0),
      ellipse_axis: new vec2(0.4, 0.4),
      height: 2,
      angle_range: new vec2(0, 360)
    });
    arm.initData(gl, verticesAndNormals);
    return arm;
  }
}

class Leg extends Component {
  public static build(
    gl,
    parent: VirtualComponent,
    trans: number,
    rotate: mat4
  ): Leg {
    //trans:腿相对于父对象（小黑）的平移量。左右腿不同。即在x轴上距离z轴的距离。
    //rotate:腿的旋转矩阵。圆柱的初始位置应该在原点出xoz平面下方。这样方便腿绕关节旋转。在此基础上进行旋转。
    let translation = translate(trans, -2, -3.75); //translate应包含在这个矩阵中。
    let leg = new Leg(translation, rotate, parent, Material.Black);
    let verticesAndNormals = cylinder_generator({
      origin: new vec3(0, 0, 0),
      ellipse_axis: new vec2(0.4, 0.4),
      height: 1.5,
      angle_range: new vec2(0, 360)
    });
    leg.initData(gl, verticesAndNormals);
    return leg;
  }
}
