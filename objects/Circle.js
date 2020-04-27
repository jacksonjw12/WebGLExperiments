class Circle extends Object {

	constructor(pos,rot,scale,shader,shaderOptions){
		super(pos,rot,scale,shader,gl.TRIANGLE_FAN);

		this.shaderOptions = (shaderOptions !== undefined)?shaderOptions:{};

		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		
		
		if(!Circle.vertices){
			Circle.createVertexData(100,1);
		}
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Circle.vertices), gl.STATIC_DRAW);
		
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = Circle.numItems;





	}
	static createVertexData(res,radius){
		Circle.res = res;
		Circle.vertices = [0,0,0];

		for(let i =0; i < res+1; i++){
			Circle.vertices.push( radius* Math.cos( i*(Math.PI*2/res) ) );
			Circle.vertices.push( radius* Math.sin( i*(Math.PI*2/res) ) );
			Circle.vertices.push(0);
		}
		Circle.numItems = res+2;
	}


}