class Object {

	constructor(args){//pos,rot,scale,shaderProgram,renderMethod){
		this.id = Object.makeId();
		this.pos = (args.pos !== undefined)?args.pos:vec3.fromValues(0,0,0);
		this.rot = (args.rot !== undefined)?args.rot:quat.fromEuler(quat.create(),0,0,0);
		this.scale = (args.scale !== undefined)?args.scale:vec3.fromValues(1,1,1);
		this.shaderProgram = (args.shader !== undefined)?args.shader:ShaderManager.getDefaultShader();
		this.renderMethod = (args.renderMethod !== undefined)?args.renderMethod:gl.TRIANGLE_STRIP; // default render method is triangle_strip
		this.shaderOptions = (args.shaderOptions !== undefined)?args.shaderOptions:{};

		this.hasNormals = (args.hasNormals !== undefined)?args.hasNormals:false;
	}
	//currently unused, might be useful in future
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
