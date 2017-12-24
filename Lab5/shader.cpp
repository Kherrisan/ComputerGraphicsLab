uniform vec4 uLightPosition;
uniform mat3 uNMatrix;      // normal matrix
attribute vec4 aVertexNormal;       // normal vertex
varying vec3 N,L,E;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uTMatrix;
uniform bool uPerVertexColor;
uniform bool uWireframe;
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
        fColor = uColor;
    }
    vVertextureCoords=aVertexTextureCoords;

    vec3 pos =  (uMVMatrix * uTMatrix * vec4(aVertexPosition, 1.0)).xyz;
    // check for directional light
    if(uLightPosition.w ==0.0) L=normalize(uLightPosition.xyz);
    else L = normalize( uLightPosition.xyz - pos );

    E = -normalize(pos);
    N = normalize( uNMatrix*(uTMatrix*aVertexNormal).xyz);
    
}