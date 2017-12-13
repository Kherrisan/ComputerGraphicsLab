uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uTMatrix;
uniform bool uPerVertexColor;
uniform vec4 uColor;
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoords;
varying vec2 vVertextureCoords;
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
    vVertextureCoords=aVertexTextureCoords;
}

precision mediump float;
uniform bool uUseTexture;
uniform sampler2D uSampler;
varying vec4 fColor;
varying vec2 vVertextureCoords;
void main() { 
    if(uUseTexture){
        gl_FragColor=texture2D(uSampler,vVertextureCoords);
    }else{
        gl_FragColor = fColor;
    }
     }