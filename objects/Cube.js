class Cube extends Object {

	constructor(pos,rot,scale,shader,shaderOptions){
		super(pos,rot,scale,shader,gl.TRIANGLES);
		this.shaderOptions = (shaderOptions !== undefined)?shaderOptions:{};
		
		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 36;

	}



	static vertices = [


        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,

        -1.0, -1.0, -1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,

         -1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,




        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,

         1.0, -1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,


        // Front face
        -1.0, -1.0, 1.0,
        -1.0,  1.0, 1.0,
         1.0,  1.0, 1.0,

         -1.0, -1.0, 1.0,
         1.0,  1.0, 1.0,
         1.0, -1.0, 1.0,



        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,

         -1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,

         -1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,




    ];

}