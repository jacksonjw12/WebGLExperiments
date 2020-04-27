class TestScene extends Scene{

	constructor(name, objects){
	    super(name,objects);


	    //triangle
		super.addObject(new Triangle({
			"pos":vec3.fromValues(3,0,0),
			"rot":quat.fromEuler(quat.create(),10,0,0)
		}));

		//square
		super.addObject(new Plane({"pos":vec3.fromValues(0,0,0)}));

		//depth circle
		super.addObject(new Circle({
			"pos":vec3.fromValues(-3, 0, 0),
			"shader":ShaderManager.getShader("depth")
		}));

		//skybox thing


		super.addObject(new Cube({
			"scale":vec3.fromValues(20,20,20),
			"shader":ShaderManager.getShader("phong"),
			"shaderOptions":{
				"color":vec4.fromValues(1,1,1,1.)
			}
		}))


		for(let r = 0; r< 4; r++){
			for(let c = 0; c<4; c++){
				super.addObject(new Cube({
					"pos":vec3.fromValues(-5 + r*3, -2.5, -5 + c*3),
					"rot":quat.fromEuler(quat.create(), 90+r*c+c, 0, 0),
					"scale":vec3.fromValues(1, 1, .2),
					"shader":ShaderManager.getShader("phong"),
					"shaderOptions":{
						"color":vec4.fromValues(.5, .5, .5, 1.)
					}
				}));
			}
		}

		super.addObject(new Cube({
			"scale":vec3.fromValues(.1,.1,.1),
			"pos":super.lightPosition,
			"shader":ShaderManager.getShader("simpleColor"),
			"shaderOptions":{
				"color":vec4.fromValues(0.7078, 0.6644, 0.2398,1.0)
			}
		}))

		// let rightPlane = new Plane(
		// 	vec3.fromValues(5,2.5,0),
		// 	quat.fromEuler(quat.create(),0,90,0),
		// 	vec3.fromValues(5,5,5),
		// 	ShaderManager.getShader("simpleColor"),
		// 	{"color":vec4.fromValues(.6,.6,.6,1.)}

		// 	);
		// this.scene.addObject(rightPlane);

	}

	animate(dt){
		let rotQuat = quat.create();
		quat.fromEuler(rotQuat,0,.5,0);
		for(let o = 0; o < this.objects.length; o++){

			//quat.multiply(this.scene.objects[o].rot,this.scene.objects[o].rot,rotQuat)

		}
		let circlingRadius = 10;


		let circlingSpeed = 2;
		let cx = circlingRadius * Math.cos(dt/10000 * circlingSpeed)
		let cy = 0//*Math.sin(dt/1000)-1;
		let cz = circlingRadius * Math.sin(dt/10000 * circlingSpeed)
		// console.log(this.camera.pos)

		this.camera.updatePosition(vec3.fromValues(cx,cy,cz));
		this.camera.pointAt(vec3.fromValues(0,0,0))
		this.lightPosition.x += 5*Math.sin(dt/10000 * circlingSpeed)
		//super.lightPosition= vec3.fromValues(circlingRadius * Math.cos(dt/10000 * circlingSpeed),super.lightPosition.y,circlingRadius * Math.sin(dt/10000 * circlingSpeed));
		// console.log(this.camera.rot)
		//quat.fromEuler(this.camera.rot,0,360*Math.cos(dt/1000),0)

	}


}
