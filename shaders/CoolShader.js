class CoolShader extends ShaderProgram {


	constructor(){
		super("cool",false);
		this.i = 0;

		this.noise = new SimplexNoise(Math.random);
		super.loadShaderSource(CoolShader.vertexShaderSource,CoolShader.fragmentShaderSource);



	}
	initCustomUniforms(){
		this.timeUniform = gl.getUniformLocation(this.program, "u_time");
		this.randUniform = gl.getUniformLocation(this.program, "u_random");
		this.colorUniform = gl.getUniformLocation(this.program, "u_color");
		this.resolutionUniform = gl.getUniformLocation(this.program, "u_resolution");
		this.objectScreenLocationUniform = gl.getUniformLocation(this.program,"u_objectScreenLocation")
	}

	updateCustomUniforms(dt,material,object,pMatrix,mvOMatrix){
		gl.uniform4fv(this.colorUniform, material.color);
		gl.uniform1f(this.timeUniform, dt/1000.0);

		let noiseSpeed = 2;
		gl.uniform1f(this.randUniform, this.noise.noise2D(dt/1000 * noiseSpeed, 0));

		gl.uniform2fv(this.resolutionUniform,resolution);

		let oMatrix = mat4.fromTranslation(mat4.create(),object.pos);
		mat4.mul(oMatrix,oMatrix,mvOMatrix);
		mat4.mul(oMatrix,pMatrix,mvOMatrix);

		gl.uniform3fv(this.objectScreenLocationUniform,mat4.getTranslation(vec3.create(),oMatrix));



	}


}

CoolShader.vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexNormal;
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	
	
	
	varying vec3 FragPos;
	//varying vec3 objectLocation;
	void main(void) {
		//FragPos = vec3(uMVMatrix * aVertexPosition);
		
		//mat4 objectMV = uPMatrix * uMVMatrix;
		gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
		FragPos = gl_Position.xyz / gl_Position.w;
		
//		objectLocation = vec3(objectMV[3]);
		
	}
`;

CoolShader.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;
	uniform vec2 u_resolution;
	uniform float u_time;
	uniform float u_random;
	
	uniform vec3 u_objectScreenLocation;

	void main() {
		vec3 bgColor = vec3(.70,0.6,.25);
		//gl_FragColor = vec4(abs(mod(FragPos.x*10.0,1.0)),0.0,0.0,1.0);
//		gl_FragColor = vec4(0.0,0.0,0.0,1.0);
		//if(mod(gl_FragCoord.x,50.0) < 10. && mod(gl_FragCoord.y,50.0) < 10.) {
		vec2 fragCoord = gl_FragCoord.xy - u_objectScreenLocation.xy - u_resolution/2.;
		
		float scale = 50.;
		
		float n = scale + 10.*sin(u_time) +u_random;
		vec2 n1 = vec2(n);
		vec2 n2 = n1/2.0;
		vec2 modPos = abs(n2-mod(fragCoord.xy,n));
		if(modPos.x == 0.0){
			modPos.x = 0.1;
		}
		vec2 fnPos = vec2(0.0,10.*sin(modPos.x/7.95));
		vec2 fn2Pos = vec2(0.0,10.*cos(modPos.x/7.95));
//		if( distance(abs(n2 - modPos),vec2(0.,0.)) < 12.){
//		if(  fnPos.y > modPos.y){
//			//gl_FragColor = vec4(modPos.x/50.+modPos.y/50.,modPos.x/50.+modPos.y/50.,modPos.x/50.+modPos.y/50.,1.0);
//
//			//gl_FragColor = vec4(0.8,0.3,0.0,1.0);
//			gl_FragColor = vec4((bgColor * (distance(abs(n2 - modPos),vec2(50.,50.))/50.0)),1.0);// + vec4(vec3(abs(sin(FragPos.x * FragPos.y))/4.0),1.0);
//
//		}
//		else if(  fn2Pos.y > modPos.y){
//		//else if(abs(n2-fnPos).y > modPos.y){
//			gl_FragColor = vec4(0.9,0.1,0.3,1.0);
//		}
		//else{
			//gl_FragColor = vec4(modPos.x/50.+modPos.y/50.,modPos.x/50.+modPos.y/50.,modPos.x/50.+modPos.y/50.,1.0);
		float dist = distance(abs(n2 - modPos),n1);
		gl_FragColor = vec4( ( bgColor - pow(dist/50.0,10.0) ) , 1.0);// + vec4(vec3(abs(sin(FragPos.x * FragPos.y))/4.0),1.0);

		//}
		
		//gl_FragColor = bgColor;// + vec4(vec3(abs(sin(FragPos.x * FragPos.y))/4.0),1.0);
		// gl_FragColor.rgb *= vLighting;
	}
`;

ShaderManager.shaderPrograms.push(new CoolShader());
