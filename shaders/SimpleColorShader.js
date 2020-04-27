class SimpleColorShader extends ShaderProgram {


	constructor(){
		super("simpleColor");

		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		
		gl.shaderSource(this.vertexShader, this.vertexShaderSource);
		gl.compileShader(this.vertexShader);
		gl.shaderSource(this.fragmentShader, this.fragmentShaderSource);
		gl.compileShader(this.fragmentShader);

		if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(this.vertexShader));
			return null;
		}
		if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(this.fragmentShader));
			return null;
		}

		super.init(this);

		this.initCustomUniforms();
		

	}
	initCustomUniforms(){
		this.colorUniform = gl.getUniformLocation(this.program, "u_color");
		// this.randUniform = gl.getUniformLocation(this.program, "rand");
	}

	updateCustomUniforms(dt,shaderOptions){
		//this.colorUniform = shaderOptions.color;
		gl.uniform4fv(this.colorUniform, shaderOptions.color);
	}


	
	vertexShaderSource = `
		attribute vec3 aVertexPosition;
		
		uniform mat4 uMVMatrix;
		uniform mat4 uPMatrix;

		void main(void) {
			
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x,aVertexPosition.y,aVertexPosition.z, 1.0);

			
		}
	`;

	fragmentShaderSource = `
		precision mediump float;
		uniform vec2 resolution;
		uniform mediump vec4 u_color;


		void main() {
			
			gl_FragColor = u_color;
		}
	`;


}
