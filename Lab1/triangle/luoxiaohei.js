var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //  Configure WebGL
    gl.viewport( 0, 0, 256, 256 );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //drawFace
    drawEllipse(vec2(0,0.207),0.660,0.539,vec4(0,0,0,1),program)
    drawEar(vec2(-0.7230, 0.934), 122, 161, vec4(0, 0, 0, 1),program);//left outer ear
    drawEar(vec2(0.7230, 0.934), 19, 58, vec4(0, 0, 0, 1),program);//right outer ear
    drawEar(vec2(-0.680, 0.863), 132, 156, vec4(0.602, 0.797, 0.598, 1),program);//left inner ear
    drawEar(vec2(0.680, 0.863), 24, 48, vec4(0.602, 0.797, 0.598, 1),program);//right inner ear
    
    drawEllipse(vec2(-0.3125,0.3),0.2813,0.3125,vec4(0.9922,0.9882,0.8,1.0),program);//left outer eye
    drawEllipse(vec2(0.3125,0.3),0.2813,0.3125,vec4(0.9922,0.9882,0.8,1.0),program);//right outer eye
    drawEllipse(vec2(-0.3125,0.3),0.1641,0.2031,vec4(0,0,0,1.0),program);//left inner eye
    drawEllipse(vec2(0.3125,0.3),0.1641,0.2031,vec4(0,0,0,1.0),program);//right inner eye
    
    drawBody(vec2(0,-0.74),0.2266,0.5859,vec4(0,0,0,1.0),0,180,program);//Body Part1
    drawBody(vec2(0,-0.609),0.262,0.262,vec4(0,0,0,1.0),210,330,program);//Body Part2
    drawTail(vec2(0,-0.70),0.131,0.6,vec4(0,0,0,1.0),program);//Body Part3
};

function drawEllipse(origin, majorSemiAxis, minorSemiAxis, color, program){
    var vertices = generateEllipse(origin[0], origin[1], majorSemiAxis, minorSemiAxis);
    var colors = generatePureColor(color, 362);
    
    linkVerticeAndColorsToShader(vertices,colors,program);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 362);
}

function drawEar(earPoint, startAngle, endAngle, color, program) {
    var origin = vec2(0, 0.207);
    //定义椭圆长轴和短轴。
    var majorSemiAxis = 0.660;
    var minorSemiAxis = 0.539;
    var lVertices = [earPoint];
    lVertices = lVertices.concat(generateEllipseWithinRange(origin[0], origin[1], majorSemiAxis, minorSemiAxis, startAngle, endAngle));
    var colors = generatePureColor(color, endAngle - startAngle + 2);
    
    linkVerticeAndColorsToShader(lVertices,colors,program);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 0, endAngle - startAngle);
}

function drawBody(origin, majorSemiAxis, minorSemiAxis, color, startAngle, endAngle, program){
    //初始化点坐标数组和颜色数组。
    var vertices = [origin];
    vertices = vertices.concat(generateEllipseWithinRange(origin[0], origin[1], majorSemiAxis, minorSemiAxis,startAngle,endAngle));
    var colors = generatePureColor(color, endAngle - startAngle + 2);
    
    linkVerticeAndColorsToShader(vertices,colors,program);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 0, endAngle - startAngle + 2);
}

function drawTail(origin, height, width, color, program){
    var firstVertices = [vec2(origin[0], origin[1] - height),
                         origin,
                         vec2(origin[0] + width, origin[1]),
                         vec2(origin[0] + width, origin[1] - height)];
    var firstColors = generatePureColor(color, 4);
    linkVerticeAndColorsToShader(firstVertices,firstColors,program);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    
    var secondVertices = [vec2(origin[0] + width, origin[1] - height/2)];
    secondVertices = secondVertices.concat(generateEllipseWithinRange(origin[0] + width, origin[1] - height/2, height/2, height/2, -90, 90));
    var secondColors = generatePureColor(color, 182);
    linkVerticeAndColorsToShader(secondVertices,secondColors,program);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 182);
}

//utility functions
function linkVerticeAndColorsToShader(vertices,colors,program){
    //让片元着色器的变量指向colorBuffer。
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
    //让定点着色器的变量指向vertexBuffer。
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

function generatePureColor(colorVec, numOfVerts) {
    var colors = [];
    for (var i = 0; i < numOfVerts; i++) {
        colors.push(colorVec);
    }
    return colors;
}

function generateEllipse(x,y,a,b){
    var vertices = [vec2(x,y)];
    for(var i = 0;i <= 360;i++){
        vertices.push(vec2(a*Math.cos(i/180*Math.PI)+x,b*Math.sin(i/180*Math.PI)+y));
    }
    return vertices;
}

//生成椭圆曲线的一部分的函数。
function generateEllipseWithinRange(x, y, a, b, startAngle, endAngle) {
    var vertices = [];
    for (var i = startAngle; i <= endAngle; i++) {
        vertices.push(vec2(a * Math.cos(i / 180 * Math.PI) + x, b * Math.sin(i / 180 * Math.PI) + y));
    }
    return vertices;
}
