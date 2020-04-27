class Triangle extends Object {

	constructor(args){
		super(args);

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Triangle.vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 3;

	}



	static vertices = [
			 0.0,  1.0,  0.0,
			-1.0, -1.0,  0.0,
			 1.0, -1.0,  0.0
		];

}
