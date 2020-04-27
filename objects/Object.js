class Object {

	constructor(args){//pos,rot,scale,shaderProgram,renderMethod){
		this.id = Object.makeId();
		this.pos = (args.pos !== undefined)?args.pos:vec3.fromValues(0,0,0);
		this.rot = (args.rot !== undefined)?args.rot:quat.fromEuler(quat.create(),0,0,0);
		this.scale = (args.scale !== undefined)?args.scale:vec3.fromValues(1,1,1);

		this.geometry = (args.geometry !== undefined)?args.geometry:new Cube();
		this.material = (args.material !== undefined)?args.material:new defaultMaterial(args.materialOptions,this.geometry);


		this.pointLight = (args.pointLight !== undefined)?args.pointLight:false;

		this.action = (args.action !== undefined)?args.action:undefined;
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
