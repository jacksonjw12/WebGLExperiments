
class ShaderProgram {

	constructor(name){
		this.name = name;

		
	}

	init(shader){
		// this.fragmentShader = shader.getFragmentShader(gl, fs);
		// this.vertexShader = shader.getVertexShader(gl, vs);

		this.program = gl.createProgram();
		gl.attachShader(this.program, shader.vertexShader);
		gl.attachShader(this.program, shader.fragmentShader);
		gl.linkProgram(this.program);

		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.log("Could not initialise shader: ",this.name);
		}
		this.initCommonUniformsAndAttributes();
	}
	initCommonUniformsAndAttributes(){
		this.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
		gl.enableVertexAttribArray(this.program.vertexPositionAttribute);

		this.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
		this.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
	}
	updateMatrixUniforms(pMatrix, mvMatrix){
		gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.mvMatrixUniform, false, mvMatrix);
	}
}