class SimpleColorShader extends ShaderProgram {


	constructor(){
		super("simpleColor",true);

		super.init(this.vertexShaderSource,this.fragmentShaderSource);

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
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexNormal;

		
		uniform mat4 uMVMatrix;
		uniform mat4 uPMatrix;
		uniform mat4 uNormalMatrix;
		
		uniform highp vec3 lightingDirection;
		uniform highp vec3 ambientLight;
		
		varying highp vec3 vLighting;
		
		void main(void) {
			
			gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
			
			highp vec3 directionalLightColor = vec3(1, 1, 1);
			
			highp vec4 transformedNormal = uNormalMatrix * aVertexNormal;
			
			highp float directional = max(dot(transformedNormal.xyz, lightingDirection), 0.0);
			vLighting = ambientLight + (directionalLightColor * directional);
			
		}
	`;

	fragmentShaderSource = `
		precision mediump float;
		uniform mediump vec4 u_color;
		
		varying highp vec3 vLighting;

		void main() {
 
			gl_FragColor = u_color;
			gl_FragColor.rgb *= vLighting;
		}
	`;


}
