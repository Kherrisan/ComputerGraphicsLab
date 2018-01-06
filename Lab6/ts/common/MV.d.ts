export class vec2 {
  public constructor(u?: number, v?: number);
}

export declare class vec3 {
  public constructor(u?: number, v?: number, w?: number);
}

export class vec4 {
  public constructor(u?: number, v?: number, w?: number, x?: number);
}

export class mat {}

export class mat2 extends mat {}

export class mat3 extends mat {}

export class mat4 extends mat {}

export function mult(u: any, v: any);

export function translate(x: number, y: number, z: number): mat4;

export function translate(x: vec3): mat4;

export function rotateX(u: any): mat4;

export function rotateY(u: any): mat4;

export function rotateZ(u: any): mat4;

export function inverse4(u: mat4): mat4;

export function perspective(fovy, aspect, near, far): mat4;

export function flatten(u: any): any;

export function subtract(u: any, v: any): any;

export function cross(u: any, v: any): any;
