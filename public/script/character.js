/*
 * 2023 © MaoHuPi
 * 網頁中的互動人像
 * blogTemplate_thread > public > script > character.js
 */

/*
 * points:
 *         t
 *    /7--------/4
 *   3---------0 |
 *   | .   (b) | | r
 * l | .  f    | |
 *   | 6 . . . | 5
 *   2---------1/
 *        b
 * surfaces:
 *                      |------|
 *                      |  t4  |
 * |------|------|------|------|
 * |  r3  |  b2  |  l1  |  f0  |
 * |------|------|------|------|
 *                      |  b5  |
 *                      |------|
 */

function square(a1, a2, a3, a4){return [...a1, ...a2, ...a3, ...a3, ...a4, ...a1, ];}
function deepCopy(any){return JSON.parse(JSON.stringify(any));}
function arg(value, defaultValue){return value === undefined ? defaultValue : value;}
function setProgram(gl){
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
    precision mediump float;
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    uniform mat4 uMatrix;
    void main(){
        vTexCoord = aTexCoord;
        gl_Position = uMatrix * vec4(aPosition, 1);
    }
    `);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D uSampler;
    void main(){
        gl_FragColor = texture2D(uSampler, vTexCoord);
    }
    `);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(
        gl.SRC_ALPHA, 
        gl.ONE_MINUS_SRC_ALPHA, 
        // gl.DST_COLOR, 
    );

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
        return;
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
        return;
    }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Shader program linking error:', gl.getProgramInfoLog(program));
        return;
    }

    program.uniformLocation = {
        matrix: gl.getUniformLocation(program, 'uMatrix'), 
        sampler: gl.getUniformLocation(program, 'uSampler')
    };
    gl.program = program;
}

let textureLoaded = false;
class GLManager{
    #textures = {};
    #textureList = [];
    constructor(args = {}){
        this.gl = arg(args.gl, undefined);
    }
    loadTexture(src = ''){
        const texture = this.gl.createTexture();
        const image = new Image();
        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
            this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            textureLoaded = true;
        };
        image.src = src;
        this.#textures[src] = texture;
    }
    bindTexture(src = '', id = 0){
        if(this.#textureList[id] !== src){
            this.gl.activeTexture(this.gl.TEXTURE0 + id);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.#textures[src]);
            this.#textureList[id] = src;
        }
        return id;
    }
}

class GLObject{
    #positionBuffer;
    #texCoordBuffer;
    #matrixBackupList = [];
    constructor(args = {}){
        this.gl = arg(args.gl, undefined);
        this.vertexData = arg(args.vertexData, []);
        this.texCoordData = arg(args.texCoordData, []);
        this.#positionBuffer = this.gl.createBuffer();
        this.#texCoordBuffer = gl.createBuffer();
        this.matrix = glMatrix.mat4.create();
        if(args.matrix !== undefined) glMatrix.mat4.copy(this.matrix, args.matrix);
        this.textureFun = arg(args.textureFun, '');
        this.affiliatedList = [];
    }
    translate(data){
        glMatrix.mat4.translate(this.matrix, this.matrix, data);
    }
    scale(data){
        glMatrix.mat4.scale(this.matrix, this.matrix, data);
    }
    rotate(data){
        glMatrix.mat4.rotateX(this.matrix, this.matrix, data[0]);
        glMatrix.mat4.rotateY(this.matrix, this.matrix, data[1]);
        glMatrix.mat4.rotateZ(this.matrix, this.matrix, data[2]);
    }
    resetMatrix(){
        this.matrix = glMatrix.mat4.create();
    }
    matrixSave(){
        const backup = glMatrix.mat4.create();
        glMatrix.mat4.copy(backup, this.matrix);
        this.#matrixBackupList.push(backup);
    }
    matrixRelease(){
        this.matrix = this.#matrixBackupList.pop();
    }
    render(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexData), this.gl.STATIC_DRAW);
        const attribLocation_position = this.gl.getAttribLocation(this.gl.program, 'aPosition');
        this.gl.enableVertexAttribArray(attribLocation_position);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#positionBuffer);
        this.gl.vertexAttribPointer(attribLocation_position, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texCoordData), this.gl.STATIC_DRAW);
        const attribLocation_texCoord = this.gl.getAttribLocation(this.gl.program, 'aTexCoord');
        this.gl.enableVertexAttribArray(attribLocation_texCoord);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#texCoordBuffer);
        this.gl.vertexAttribPointer(attribLocation_texCoord, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform1i(this.gl.program.uniformLocation.sampler, this.textureFun());
        this.gl.uniformMatrix4fv(this.gl.program.uniformLocation.matrix, false, this.matrix);
        // this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexData.length/3);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexData.length/3);
        // this.gl.drawArrays(gl.LINES, 0, this.vertexData.length/3);
        // this.gl.drawArrays(gl.POINTS, 0, this.vertexData.length/3);

        for(let affiliated of this.affiliatedList){
            affiliated.matrix = this.matrix;
            affiliated.render();
        }
    }
    copy(){
        return new GLObject(this);
    }
}

class Box extends GLObject{
    #pointData = [
        [1, 1, 1], 
        [1, -1, 1], 
        [-1, -1, 1], 
        [-1, 1, 1], 
        [1, 1, -1], 
        [1, -1, -1], 
        [-1, -1, -1], 
        [-1, 1, -1], 
    ];
    #size = [1, 1, 1];
    #resize = function(x, y, z){
        let pointData = deepCopy(this.#pointData);
        pointData = pointData.map(point => point.map((n, i) => [x/2, y/2, z/2][i]*n));
        this.vertexData = [
            ...square(pointData[0], pointData[1], pointData[2], pointData[3]), 
            ...square(pointData[3], pointData[2], pointData[6], pointData[7]), 
            ...square(pointData[7], pointData[6], pointData[5], pointData[4]), 
            ...square(pointData[4], pointData[5], pointData[1], pointData[0]), 
            ...square(pointData[4], pointData[0], pointData[3], pointData[7]), 
            ...square(pointData[1], pointData[5], pointData[6], pointData[2]), 
        ];
    };
    constructor(args = {}){
        super(args);
        this.#size = arg(args.size, [1, 1, 1]);
        this.#resize(...this.#size);
    }
    get size(){return this.#size;}
    set size(value){
        this.#size = value;
        this.#resize(...this.#size);
    }
    copy(){
        return new Box(this);
    }
}

async function main(){
    let MX = 0, MY = 0;
    const cvs = document.querySelector('#character');
    [cvs.width, cvs.height] = [500, 500];
    window.addEventListener('mousemove', event => {
        MX = event.clientX;
        MY = event.clientY;
    })
    const gl = cvs.getContext('webgl');
    window.gl = gl;
    if(gl === null){
        return;
    }

    setProgram(gl);

    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(
        viewMatrix, 
        75/180*Math.PI, 
        cvs.width/cvs.height, 
        1e-4, 1e4
    );
    gl.viewMatrix = viewMatrix;

    const skinPath = cvs.getAttribute('data-path');
    // const skinPath = 'maohupi_mcskin.png';

    const manager = new GLManager({gl: gl});
    manager.loadTexture(skinPath);

    function createAffiliated(glObject, textureDeltaPosition = [0, 0], scale = 1){
        const affiliated = glObject.copy();
        affiliated.size = affiliated.size.map(n => n*scale);
        affiliated.texCoordData = affiliated.texCoordData.map((n, i) => i%2 == 0 ? n + textureDeltaPosition[0] : n + textureDeltaPosition[1]);
        glObject.affiliatedList.push(affiliated);
    }

    let headWidth = 3;

    const head = new Box({
        gl: gl, 
        size: Array(3).fill(headWidth), 
        texCoordData: [
            ...square([16/64, 8/64], [16/64, 16/64], [8/64, 16/64], [8/64, 8/64]), 
            ...square([8/64, 8/64], [8/64, 16/64], [0/64, 16/64], [0/64, 8/64]), 
            ...square([32/64, 8/64], [32/64, 16/64], [24/64, 16/64], [24/64, 8/64]), 
            ...square([24/64, 8/64], [24/64, 16/64], [16/64, 16/64], [16/64, 8/64]), 
            ...square([16/64, 0/64], [16/64, 8/64], [8/64, 8/64], [8/64, 0/64]), 
            ...square([24/64, 8/64], [24/64, 0/64], [16/64, 0/64], [16/64, 8/64]), 
        ], 
        textureFun: () => {return manager.bindTexture(skinPath, 1);}
    });
    head.translate([0, 4, -10]);
    createAffiliated(head, [32/64, 0], 1.1);
    
    const body = new Box({
        gl: gl, 
        size: [headWidth, headWidth*3/2, headWidth/2], 
        texCoordData: [
            ...square([28/64, 20/64], [28/64, 32/64], [20/64, 32/64], [20/64, 20/64]), 
            ...square([20/64, 20/64], [20/64, 32/64], [16/64, 32/64], [16/64, 20/64]), 
            ...square([40/64, 20/64], [40/64, 32/64], [32/64, 32/64], [32/64, 20/64]), 
            ...square([32/64, 20/64], [32/64, 32/64], [28/64, 32/64], [28/64, 20/64]), 
            ...square([28/64, 16/64], [28/64, 20/64], [20/64, 20/64], [20/64, 16/64]), 
            ...square([36/64, 16/64], [36/64, 20/64], [28/64, 20/64], [28/64, 16/64]), 
        ], 
        textureFun: () => {return manager.bindTexture(skinPath, 1);}
    });
    body.translate([0, 4-headWidth*5/4, -10]);
    createAffiliated(body, [0, 16/64], 1.1);
    
    const leftArm = new Box({
        gl: gl, 
        size: [headWidth/2, headWidth*3/2, headWidth/2], 
        texCoordData: [
            ...square([40/64, 52/64], [40/64, 64/64], [36/64, 64/64], [36/64, 52/64]), 
            ...square([36/64, 52/64], [36/64, 64/64], [32/64, 64/64], [32/64, 52/64]), 
            ...square([48/64, 52/64], [48/64, 64/64], [44/64, 64/64], [44/64, 52/64]), 
            ...square([44/64, 52/64], [44/64, 64/64], [40/64, 64/64], [40/64, 52/64]), 
            ...square([40/64, 48/64], [40/64, 52/64], [36/64, 52/64], [36/64, 48/64]), 
            ...square([44/64, 52/64], [44/64, 48/64], [40/64, 48/64], [40/64, 52/64]), 
        ], 
        textureFun: () => {return manager.bindTexture(skinPath, 1);}
    });
    leftArm.translate([headWidth*3/4, 4-headWidth*5/4, -10]);
    createAffiliated(leftArm, [16/64, 0], 1.1);
    
    const rightArm = leftArm.copy();
    rightArm.texCoordData = rightArm.texCoordData.map((n, i) => i%2 == 0 ? n+8/64 : n-32/64)
    rightArm.resetMatrix();
    rightArm.translate([-headWidth*3/4, 4-headWidth*5/4, -10]);
    createAffiliated(rightArm, [0, 16/64], 1.1);
    
    const leftLeg = leftArm.copy();
    leftLeg.texCoordData = leftLeg.texCoordData.map((n, i) => i%2 == 0 ? n-16/64 : n)
    leftLeg.resetMatrix();
    leftLeg.translate([headWidth/4, 4-headWidth*11/4, -10]);
    createAffiliated(leftLeg, [-16/64, 0], 1.1);
    
    const rightLeg = rightArm.copy();
    rightLeg.texCoordData = rightLeg.texCoordData.map((n, i) => i%2 == 0 ? n-40/64 : n)
    rightLeg.resetMatrix();
    rightLeg.translate([-headWidth/4, 4-headWidth*11/4, -10]);
    createAffiliated(rightLeg, [0, 16/64], 1.1);
    
    let lastMX, lastMY;
    let postureChanged = false;
    let point;
    function ani(){
        if(MX !== lastMX || MY !== lastMY || postureChanged || textureLoaded){
            postureChanged = false;
            textureLoaded = false;
            [lastMX, lastMY] = [MX, MY];

            // background
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            let boundingRect = cvs.getBoundingClientRect();

            // var centerX = boundingRect.x + boundingRect.width/2;
            // var centerY = boundingRect.y + boundingRect.height/2;
            var centerX = 0;
            var centerY = 4;
            var centerZ = -1;
            var deltaX, deltaY, deltaZ;
            if(point !== undefined){
                [deltaX, deltaY, deltaZ] = [centerX - point[0], centerY - point[1], centerZ - 0];
            }
            else{
                [deltaX, deltaY, deltaZ] = [centerX, centerY, centerZ];
            }
            RX = Math.atan(deltaY/centerZ) + Math.PI/2; //  + Math.PI/2 ... :)
            deltaZ = -Math.sqrt(centerY**2 + centerZ**2);
            RY = Math.atan(deltaX/deltaZ);
            
            let characterMatrix = glMatrix.mat4.create();
            glMatrix.mat4.translate(characterMatrix, characterMatrix, [0, 0, -10]);
            glMatrix.mat4.rotateY(characterMatrix, characterMatrix, -Math.PI/8 + RY*0.1);
            glMatrix.mat4.translate(characterMatrix, characterMatrix, [0, 0, 10]);

            // head
            head.matrixSave();
            // glMatrix.mat4.multiply(head.matrix, characterMatrix, head.matrix);
            head.rotate([RX, RY, 0]);
            glMatrix.mat4.multiply(head.matrix, viewMatrix, head.matrix);
            head.render();
            head.matrixRelease();

            // let pointMatrix = glMatrix.mat4.create();
            point = glMatrix.vec4.create();
            glMatrix.vec4.set(point, (MX - boundingRect.x)/boundingRect.width - 0.5, (MY - boundingRect.y)/boundingRect.height - 0.5, 0, 1);
            // console.log([...point]);
            // glMatrix.mat4.translate(pointMatrix, pointMatrix, [0, 4, -10]);
            // glMatrix.mat4.multiply(pointMatrix, characterMatrix, pointMatrix);
            // glMatrix.mat4.multiply(pointMatrix, viewMatrix, pointMatrix);
            // glMatrix.mat4.invert(pointMatrix, pointMatrix);
            // glMatrix.vec4.transformMat4(point, point, pointMatrix);
            // console.log([...point]);

            [body, leftArm, rightArm, leftLeg, rightLeg].forEach(glObject => {
                glObject.matrixSave();
                glMatrix.mat4.multiply(glObject.matrix, characterMatrix, glObject.matrix);
                glMatrix.mat4.multiply(glObject.matrix, viewMatrix, glObject.matrix);
                glObject.render();
                glObject.matrixRelease();
            });
        }
        setTimeout(ani, 30);
    }
    ani();

    clickAni_playing = false;
    function sleep(miniSec){return new Promise((resolve, reject) => {
        setTimeout(resolve, miniSec);
    });}
    async function clickAni(){
        const ANI_LENGTH = 0.5e3;
        const FRAME_AMOUNT = 50;
        clickAni_playing = true;
        let aniMatrix_body = glMatrix.mat4.create();
        glMatrix.mat4.translate(aniMatrix_body, aniMatrix_body, [0, 4-headWidth*5/4, -10]);
        glMatrix.mat4.rotateX(aniMatrix_body, aniMatrix_body, Math.PI/4/FRAME_AMOUNT);
        glMatrix.mat4.translate(aniMatrix_body, aniMatrix_body, [0, 0, 1/FRAME_AMOUNT]);
        glMatrix.mat4.translate(aniMatrix_body, aniMatrix_body, [0, 4-headWidth*5/4, -10].map(n => -n));
        let aniMatrix_head = glMatrix.mat4.create();
        glMatrix.mat4.translate(aniMatrix_head, aniMatrix_head, [0, 4, -10]);
        glMatrix.mat4.rotateY(aniMatrix_head, aniMatrix_head, -Math.PI/8 + RY*0.1);
        glMatrix.mat4.translate(aniMatrix_head, aniMatrix_head, [0, -1/FRAME_AMOUNT, 2.5/FRAME_AMOUNT]);
        glMatrix.mat4.rotateY(aniMatrix_head, aniMatrix_head, -(-Math.PI/8 + RY*0.1));
        glMatrix.mat4.translate(aniMatrix_head, aniMatrix_head, [0, 4, -10].map(n => -n));

        for(let i = 0; i < FRAME_AMOUNT; i++){
            glMatrix.mat4.multiply(body.matrix, aniMatrix_body, body.matrix);
            glMatrix.mat4.multiply(leftArm.matrix, aniMatrix_body, leftArm.matrix);
            glMatrix.mat4.multiply(rightArm.matrix, aniMatrix_body, rightArm.matrix);
            glMatrix.mat4.multiply(head.matrix, aniMatrix_head, head.matrix);
            postureChanged = true;
            await sleep(ANI_LENGTH/FRAME_AMOUNT/2);
        }
        glMatrix.mat4.invert(aniMatrix_body, aniMatrix_body);
        glMatrix.mat4.invert(aniMatrix_head, aniMatrix_head);
        for(let i = 0; i < FRAME_AMOUNT; i++){
            glMatrix.mat4.multiply(body.matrix, aniMatrix_body, body.matrix);
            glMatrix.mat4.multiply(leftArm.matrix, aniMatrix_body, leftArm.matrix);
            glMatrix.mat4.multiply(rightArm.matrix, aniMatrix_body, rightArm.matrix);
            glMatrix.mat4.multiply(head.matrix, aniMatrix_head, head.matrix);
            postureChanged = true;
            await sleep(ANI_LENGTH/FRAME_AMOUNT/2);
        }

        clickAni_playing = false;
    }
    window.addEventListener('click', event => {
        let boundingRect = cvs.getBoundingClientRect();
        let [relativeX, relativeY] = [(MX - boundingRect.x)/boundingRect.width, (MY - boundingRect.y)/boundingRect.height]
        let [detectWidth, detectHeight] = [0.4, 0.9];
        if(
            relativeX > (1-detectWidth)/2 && relativeX < (1+detectWidth)/2 && 
            relativeY > (1-detectHeight)/2 && relativeY < (1+detectHeight)/2
        ){
            event.preventDefault();
            event.stopPropagation();
            if(!clickAni_playing) clickAni();
        }
    });
}

if(!isMobileStyle()){
    main();
}