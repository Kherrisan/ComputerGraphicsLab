import { mat4, vec3, flatten, vec2 } from "./common/MV";
import { VirtualComponent } from "./VirtualComponent";
import { Material } from "./Material";

export class Component extends VirtualComponent {
  public vbo: any;
  public nbo: any;
  public tbo: any;
  public ibo: any;
  public texture: any;
  public wireframe: boolean = false;
  public indicesNum: number;
  public verticesNum: number;

  public constructor(
    translation: mat4,
    rotation: mat4,
    parent: VirtualComponent,
    public material: Material
  ) {
    super(translation, rotation, parent);
  }
  public draw(app: any): void {
    app.draw(this);
  }
  public setTexture(gl: any, image: any): Component {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    return this;
  }
  public initData(
    gl: any,
    verticesAndNormals: {
      vertices: Array<vec3>;
      normals: Array<vec3>;
      textCoords?: Array<vec2>;
    }
  ): void {
    this.verticesNum = verticesAndNormals.vertices.length;

    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(verticesAndNormals.vertices),
      gl.STATIC_DRAW
    );

    this.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(verticesAndNormals.normals),
      gl.STATIC_DRAW
    );

    if (
      verticesAndNormals.textCoords &&
      verticesAndNormals.textCoords.length != 0
    ) {
      this.tbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        flatten(verticesAndNormals.textCoords),
        gl.STATIC_DRAW
      );
    }
  }
}
