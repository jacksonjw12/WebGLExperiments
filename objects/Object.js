class Object {

	constructor(pos,rot,scale,shaderProgram,renderMethod){
		this.id = Object.makeId();
		this.pos = (pos !== undefined)?pos:vec3.fromValues(0,0,0)
		if(rot !== undefined){
			this.rot = rot;
		}
		else{
			this.rot = quat.create();
			quat.fromEuler(this.rot,0,0,0)
		}
		this.scale = (scale !== undefined)?scale:vec3.fromValues(1,1,1);
		this.shaderProgram = (shaderProgram !== undefined)?shaderProgram:ShaderManager.getDefaultShader();
		this.renderMethod = (renderMethod !== undefined)?renderMethod:gl.TRIANGLE_STRIP
		//console.log(this.renderMethod, gl.TRIANGLES)
		this.shaderOptions = {};
	}

	static registerObject(o){
		Object.objects.push(o)
	}

	static deleteObject(o){
		for(let i = 0; i < Object.objects.length; i++){
			if(Object.objects[i].id === o.id){
				return Object.objects.splice(i,1);
			}
		}
	}

	static makeId(){
		return Object.objects.length;
	}

}
Object.objects = [];