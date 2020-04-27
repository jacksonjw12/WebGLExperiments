
class ShaderProgram {

	constructor(name,usesNormals){
		this.name = name;
		this.usesNormals = (usesNormals !== undefined)?usesNormals:false;
		this.attributes = [];
		this.uniforms = [];

	}

	init(vertexShaderSource,fragmentShaderSource){


		//compile vertex shader
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(this.vertexShader, vertexShaderSource);
		gl.compileShader(this.vertexShader);
		if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
			console.log(this.name)
			console.log(gl.getShaderInfoLog(this.vertexShader));
			return null;
		}

		//compile fragment shader
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(this.fragmentShader, fragmentShaderSource);
		gl.compileShader(this.fragmentShader);
		if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
			console.log(this.name)
			console.log(gl.getShaderInfoLog(this.fragmentShader));
			return null;
		}

		//link shaders and create program
		this.program = gl.createProgram();
		gl.attachShader(this.program, this.vertexShader);
		gl.attachShader(this.program, this.fragmentShader);
		gl.linkProgram(this.program);
		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.log("Could not initialise shader: ",this.name);
			return null;
		}

		this.initCommonUniformsAndAttributes();
		// console.log(this.program)
	}

	initCommonUniformsAndAttributes(){
		this.attributes.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
		// gl.enableVertexAttribArray(this.attributes.vertexPositionAttribute);

		this.uniforms.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
		this.uniforms.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");

		if(this.usesNormals){
			this.attributes.normalAttribute = gl.getAttribLocation(this.program, "aVertexNormal");
			// gl.enableVertexAttribArray(this.attributes.normalAttribute);

			this.uniforms.normalMatrix = gl.getUniformLocation(this.program, "uNormalMatrix");

			//for lighting
			this.uniforms.lightingDirection = gl.getUniformLocation(this.program,"lightingDirection");
			this.uniforms.ambientLight = gl.getUniformLocation(this.program,"ambientLight");
			this.uniforms.lightPosition = gl.getUniformLocation(this.program,"lightPosition");


		}

	}
	updateMatrixUniforms(pMatrix, mvMatrix,lightingDirection,ambientLighting,lightPosition){
		gl.uniformMatrix4fv(this.uniforms.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.uniforms.mvMatrixUniform, false, mvMatrix);


		if(this.usesNormals){


			gl.uniform3fv(this.uniforms.ambientLight,ambientLighting);
			gl.uniform3fv(this.uniforms.lightingDirection,lightingDirection)
			gl.uniform3fv(this.uniforms.lightPosition,lightPosition)



			let normalMatrix = mat4.create();
			mat4.invert(normalMatrix, mvMatrix);
			mat4.transpose(normalMatrix, normalMatrix);
			gl.uniformMatrix4fv(this.uniforms.normalMatrix, false, normalMatrix);
		}

	}
}
