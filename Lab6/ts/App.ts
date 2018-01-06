import { WebGLUtils } from "./common/webgl-utils";
import { mult, vec4, perspective, mat4, flatten, vec3 } from "./common/MV";
import { initShaders } from "./common/initShaders";
import { VirtualComponent } from "./VirtualComponent";
import { Component } from "./Component";
import { Floor } from "./Floor";
import { Light } from "./Light";
import { Camera } from "./Camera";
import { CameraInteractor } from "./CameraInteractor";
import { Xiaohei } from "./Xiaohei";

export class App {
  private gl: any;
  private viewportWidth: number;
  private viewportHeight: number;

  private aVertexPosition: any;
  private aTextureCoord: any;
  private uMVMatrix: any;
  private uTMatrix: any;
  private uPMatrix: any;
  private uLightPosition: any;
  private aVertexNormal: any;
  private uAmbientProduct: any;
  private uDiffuseProduct: any;
  private uSpecularProduct: any;
  private uShininess: any;
  private uTexture: any;
  private uUseTexture: any;

  private components: Array<VirtualComponent>;
  private light: Light;
  private cameraInteractor: CameraInteractor;
  private camera: Camera;

  private perspectiveMatrix: mat4;

  public static run(): void {
    let app = new App();
    app.render();
  }

  public constructor() {
    let canvas = <HTMLCanvasElement>document.getElementById("gl-canvas");
    this.gl = WebGLUtils.setupWebGL(canvas);
    this.gl.clearColor(0.3, 0.3, 0.3, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.viewportWidth = canvas.width;
    this.viewportHeight = canvas.height;
    this.gl.enable(this.gl.DEPTH_TEST);
    let program = initShaders(this.gl, "vertex-shader", "fragment-shader");
    this.gl.useProgram(program);

    this.initShaderVariable(program);
    this.initPerspective();
    this.initComponents();
    this.initCamera(canvas);
    this.setLight(Light.build());
  }

  private initPerspective(): App {
    this.perspectiveMatrix = perspective(
      50,
      this.viewportWidth / this.viewportHeight,
      1,
      1000.0
    );
    return this;
  }

  private setLight(light: Light): App {
    this.light = light;
    return this;
  }

  private initCamera(canvas: HTMLCanvasElement): App {
    this.camera = new Camera(0, 2, 10, this);
    this.cameraInteractor = new CameraInteractor(canvas, this.camera);
    return this;
  }

  private initComponents(): App {
    this.components = new Array();
    this.addComponent(Floor.build(this.gl, 40, 20));
    this.addComponent(Xiaohei.build(this.gl, 0, 0, 0));
    return this;
  }

  private addComponent(component: VirtualComponent): void {
    this.components.push(component);
  }

  private initShaderVariable(program): void {
    this.aVertexPosition = this.gl.getAttribLocation(
      program,
      "aVertexPosition"
    );
    this.aTextureCoord = this.gl.getAttribLocation(program, "aTextureCoord");
    this.uMVMatrix = this.gl.getUniformLocation(program, "uMVMatrix");
    this.uTMatrix = this.gl.getUniformLocation(program, "uTMatrix");
    this.uPMatrix = this.gl.getUniformLocation(program, "uPMatrix");
    this.uLightPosition = this.gl.getUniformLocation(program, "uLightPosition");
    this.aVertexNormal = this.gl.getAttribLocation(program, "aVertexNormal");
    this.uAmbientProduct = this.gl.getUniformLocation(
      program,
      "uAmbientProduct"
    );
    this.uDiffuseProduct = this.gl.getUniformLocation(
      program,
      "uDiffuseProduct"
    );
    this.uSpecularProduct = this.gl.getUniformLocation(
      program,
      "uSpecularProduct"
    );
    this.uShininess = this.gl.getUniformLocation(program, "uShininess");
    this.uTexture = this.gl.getUniformLocation(program, "uTexture");
    this.uUseTexture = this.gl.getUniformLocation(program, "uUseTexture");
  }

  public render(): void {
    this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateMatrixUniforms();
    for (let component of this.components) {
      component.draw(this);
    }
  }

  private updateMatrixUniforms(): void {
    this.gl.uniformMatrix4fv(
      this.uMVMatrix,
      false,
      flatten(this.camera.getModelViewMatrix())
    );
    this.gl.uniformMatrix4fv(
      this.uPMatrix,
      false,
      flatten(this.perspectiveMatrix)
    );
    // let modelViewMatrix = this.camera.getModelViewMatrix();
    // let normalMatrix = [
    //   new vec3(
    //     modelViewMatrix[0][0],
    //     modelViewMatrix[0][1],
    //     modelViewMatrix[0][2]
    //   ),
    //   new vec3(
    //     modelViewMatrix[1][0],
    //     modelViewMatrix[1][1],
    //     modelViewMatrix[1][2]
    //   ),
    //   new vec3(
    //     modelViewMatrix[2][0],
    //     modelViewMatrix[2][1],
    //     modelViewMatrix[2][2]
    //   )
    // ];
    // this.gl.uniformMatrix3fv(this.uNMatrix, false, flatten(normalMatrix));
  }

  private draw(component: Component): void {
    this.updateLight(component);
    this.gl.uniformMatrix4fv(
      this.uTMatrix,
      false,
      flatten(component.getTransformMatrix())
    );
    //如果这个component绑定了纹理，就把纹理贴上去。
    if (component.texture) {
      this.gl.uniform1i(this.uUseTexture, true);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, component.tbo);
      this.gl.vertexAttribPointer(
        this.aTextureCoord,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      this.gl.enableVertexAttribArray(this.aTextureCoord);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, component.texture);
      this.gl.uniform1i(this.uTexture, 0);
    } else {
      this.gl.uniform1i(this.uUseTexture, false);
    }

    //如果不是线框图，就传顶点法向量buffer。
    if (!component.wireframe) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, component.nbo);
      this.gl.vertexAttribPointer(
        this.aVertexNormal,
        3,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      this.gl.enableVertexAttribArray(this.aVertexNormal);
    }

    //传顶点坐标
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, component.vbo);
    this.gl.vertexAttribPointer(
      this.aVertexPosition,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.aVertexPosition);

    if (component.ibo != null) {
      //如果是有index.
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, component.ibo);
      if (component.wireframe) {
        //如果是线框图，LINES。
        this.gl.drawElements(
          this.gl.LINES,
          component.indicesNum,
          this.gl.UNSIGNED_SHORT,
          0
        );
      } else {
        //如果不是线框图，TRIANGLES。
        this.gl.drawElements(
          this.gl.TRIANGLES,
          component.indicesNum,
          this.gl.UNSIGNED_SHORT,
          0
        );
      }
    } else {
      //没有ibo，根据vbo，drawArrays
      this.gl.drawArrays(this.gl.TRIANGLES, 0, component.verticesNum);
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  private updateLight(component: Component): void {
    if (component.material != null) {
      let ambientProduct = mult(this.light.ambient, component.material.ambient);
      let diffuseProduct = mult(this.light.diffuse, component.material.diffuse);
      let specularProduct = mult(
        this.light.specular,
        component.material.specular
      );

      this.gl.uniform4fv(this.uAmbientProduct, ambientProduct);
      this.gl.uniform4fv(this.uDiffuseProduct, diffuseProduct);
      this.gl.uniform4fv(this.uSpecularProduct, specularProduct);
      this.gl.uniform1f(this.uShininess, component.material.shininess);

      this.gl.uniform4fv(this.uLightPosition, this.light.position);
    } else {
      this.gl.uniform4fv(this.uAmbientProduct, new vec4());
      this.gl.uniform4fv(this.uDiffuseProduct, new vec4());
      this.gl.uniform4fv(this.uSpecularProduct, new vec4());
      this.gl.uniform1f(this.uShininess, 100);
    }
  }
}

window.onload = App.run;
