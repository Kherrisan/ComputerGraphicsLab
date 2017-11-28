uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uTMatrix;
uniform bool uPerVertexColor;
uniform vec4 uColor;
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying vec4 fColor;
void main()
{
    gl_Position = uPMatrix * uMVMatrix * uTMatrix * vec4(aVertexPosition, 1.0);
    if (uPerVertexColor)
    {
        fColor = aVertexColor;
    }
    else
    {
        fColor =
            uColor;
    }
}

precision mediump float;
varying vec4 fColor;
void main() { gl_FragColor = fColor; }