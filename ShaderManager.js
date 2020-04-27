
class ShaderManager {


	constructor(){
		ShaderManager.shaderPrograms = [new DefaultShader(),new SimpleColorShader(),new DepthShader()];

		gl.useProgram(ShaderManager.shaderPrograms[0].program);

	}

	static getShader(shaderName){
		for(let s = 0; s< ShaderManager.shaderPrograms.length; s++){
			if(ShaderManager.shaderPrograms[s].name === shaderName){
				return ShaderManager.shaderPrograms[s];
			}
		}
		return ShaderManager.getDefaultShader();
	}

	static getDefaultShader(){
		return ShaderManager.shaderPrograms[0]
	}
	


}
