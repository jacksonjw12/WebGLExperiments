class Camera{


	constructor(){
		this.mvMatrix = mat4.create();
		this.pMatrix = mat4.create();
		this.pos = vec3.fromValues(0, 0.0, -7.0);

		this.rot = quat.create();
		quat.fromEuler(this.rot,0,0,0)

		mat4.perspective(this.pMatrix,45, gl.viewportWidth / gl.viewportHeight, 0.1, 30.0);


		mat4.fromRotationTranslation(this.mvMatrix,this.rot,this.pos)

		//this.rot = quat.create();
		//quat.fromEuler(this.rot,0,0,0)

		//this.mvMatrix = 

	}
	updatePosition(newPos){
		this.pos = newPos;
		mat4.fromRotationTranslation(this.mvMatrix,this.rot,this.pos);
	}

	pointAt(location){
		let cameraPos = mat4.create();
		//mat4.fromTranslation(cameraPos, this.camera.pos)
		mat4.lookAt(this.mvMatrix,this.pos,location,vec3.fromValues(0,1,0))
		mat4.getRotation(this.rot,this.mvMatrix);
	}


}