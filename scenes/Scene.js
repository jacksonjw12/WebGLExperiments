class Scene{

	constructor(name, objects){
		this.name = name;

		this.objects = (objects !== undefined)?objects:[];

		let ambient = .3
		this.ambientLighting = vec3.fromValues(ambient, ambient, ambient);
		this.lightingDirection = vec3.normalize(vec3.create(),vec3.fromValues(0, 1, 0))

		this.lightPosition = vec3.fromValues(0,0,0)
		let lightingVector = vec3.scale(vec3.create(),this.lightingDirection,100);
		vec3.sub(this.lightPosition,this.lightPosition,lightingVector);

		this.camera = new Camera()

		if (new.target === Scene) {
			this.addObject(new Cube({"material":new ShaderMaterial("simpleColor")}))
		}


	}
	animate(dt){
		let circlingRadius = 10;
		let circlingSpeed = 2;
		let cx = circlingRadius * Math.cos(dt/10000 * circlingSpeed)
		let cy = 0//Math.sin(dt/1000);
		let cz = circlingRadius * Math.sin(dt/10000 * circlingSpeed)
		// console.log(this.camera.pos)

		this.camera.updatePosition(vec3.fromValues(cx,cy,cz));
		this.camera.pointAt(vec3.fromValues(0,0,0))



	}



	addObject(o){
		this.objects.push(o);
	}
	removeObject(o){
		for(let i = 0; i < this.objects.length; i++){
			if(this.objects[i].id === o.id){
				return this.objects.splice(i,1);
			}
		}
	}

}
