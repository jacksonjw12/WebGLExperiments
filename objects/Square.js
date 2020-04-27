class Square extends Object {

	constructor(pos,rot,scale,shader,shaderOptions){
		super(pos,rot,scale,shader);
		this.shaderOptions = (shaderOptions !== undefined)?shaderOptions:{};
		
		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Square.vertices), gl.STATIC_DRAW);
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