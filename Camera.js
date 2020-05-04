class Camera{

	#pos
	#rot
	#viewMatrix
	constructor(){

		this.#viewMatrix = mat4.create();

		this.needsUpdate = true;
		this.#pos = vec3.fromValues(0, 0.0, -7.0);
		this.#rot = vec3.fromValues(0,0,0);


		this.pMatrix = mat4.create();
		mat4.perspective(this.pMatrix,45, gl.viewportWidth / gl.viewportHeight, 0.1, 40.0);




		// mat4.fromRotationTranslation(this.mvMatrix,this.rot,this.pos)

		//this.rot = quat.create();
		//quat.fromEuler(this.rot,0,0,0)

		//this.mvMatrix =

	}
	getViewMatrix(){
		if(this.needsUpdate){
			mat4.identity(this.#viewMatrix);
			mat4.rotateX(this.#viewMatrix,this.#viewMatrix,-this.#rot[0]); // ?
			mat4.rotateY(this.#viewMatrix,this.#viewMatrix,-this.#rot[1]);
			mat4.rotateZ(this.#viewMatrix,this.#viewMatrix,-this.#rot[2]);
			mat4.translate(this.#viewMatrix,this.#viewMatrix,vec3.scale(vec3.create(),this.#pos,-1))
			this.needsUpdate = false;
			//mat4.fromRotationTranslation(this.#viewMatrix,this.rot,)
		}
		return this.#viewMatrix;
	}
	getInverseViewMatrix(){
		let inverseView = mat4.identity(mat4.create())
		mat4.rotateX(inverseView,inverseView,-this.#rot[0]); // ?
		mat4.rotateY(inverseView,inverseView,-this.#rot[1]);
		mat4.invert(inverseView,inverseView);

		//mat4.rotateZ(inverseView,inverseView,this.#rot[2]);
		// mat4.translate(inverseView,inverseView,vec3.scale(vec3.create(),this.#pos,1))
		return inverseView
	}

	setPosition(newPos){
		this.#pos = newPos;
		this.needsUpdate = true;

	}
	getPosition(){
		return this.#pos;
	}

	setRotation(newRot){
		this.#rot = newRot;
		this.needsUpdate = true;
	}
	getRotation(){
		return this.#rot;
	}

	pointAt(location){
		mat4.lookAt(this.#viewMatrix,this.#pos,location,vec3.fromValues(0,1,0))
		mat4.getRotation(this.#rot,this.#viewMatrix);
	}


}
