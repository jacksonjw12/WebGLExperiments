class Plane extends Object {

	constructor(args){
		super(args);

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Plane.vertices), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = 4;

	}



	static vertices = [
					 1.0,  1.0,  0.0,
					-1.0,  1.0,  0.0,
					 1.0, -1.0,  0.0,
					-1.0, -1.0,  0.0
				];

}
