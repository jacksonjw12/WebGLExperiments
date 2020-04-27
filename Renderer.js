class Renderer{

	constructor(){
		this.camera = new Camera()

		//this.mvMatrix = mat4.create();
		this.mvOMatrix = mat4.create();
		// this.pMatrix = mat4.create();
		this.rotMatrix = mat4.create();

		this.shaderManager = new ShaderManager();

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 		gl.enable(gl.BLEND);
 		// gl.disable(gl.DEPTH_TEST);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);

		

		this.setupTestScene();
		

		this.tick(0);

	}
	setupTestScene(){
		this.scene = new Scene();
		let quatRotation = quat.create();
		quat.fromEuler(quatRotation,10,0,0)
		this.scene.addObject(new Triangle(vec3.fromValues(3,0,0),quatRotation));
		this.scene.addObject(new Square(vec3.fromValues(0,0,0)));
		this.scene.addObject(new Circle(
			vec3.fromValues(-3,0,0),
			quat.fromEuler(quat.create(),0,0,0),
			vec3.fromValues(1,1,1),ShaderManager.getShader("depth") ));

		this.scene.addObject(new Cube(
			vec3.fromValues(0,0,0),
			quat.fromEuler(quat.create(),0,0,0),
			vec3.fromValues(10,10,10),
			ShaderManager.getShader("simpleColor"),
			{"color":vec4.fromValues(.4,.4,.4,1.)}




			))


		let bottomPlane = new Square(
			vec3.fromValues(0,-2.5,0),
			quat.fromEuler(quat.create(),90,0,0),
			vec3.fromValues(5,5,5),
			ShaderManager.getShader("simpleColor"),
			{"color":vec4.fromValues(.7,.7,.7,1.)}

			);
		this.scene.addObject(bottomPlane);

		// let rightPlane = new Square(
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
		for(let o = 0; o < this.scene.objects.length; o++){

			//quat.multiply(this.scene.objects[o].rot,this.scene.objects[o].rot,rotQuat)

		}
		let circlingRadius = 10;


		let circlingSpeed = 2;
		let cx = circlingRadius * Math.cos(dt/10000 * circlingSpeed)
		let cy = 0//Math.sin(dt/1000); 
		let cz = circlingRadius * Math.sin(dt/10000 * circlingSpeed)
		// console.log(this.camera.pos)

		this.camera.updatePosition(vec3.fromValues(cx,cy,cz));
		this.camera.pointAt(vec3.fromValues(0,0,0))
		
		// console.log(this.camera.rot)
		//quat.fromEuler(this.camera.rot,0,360*Math.cos(dt/1000),0)

	}
	tick = (dt)=> {
		requestAnimationFrame(this.tick);
		this.animate(dt);
		this.drawScene(dt);
		
	}
	drawScene(dt) {


		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		


		//mat4.identity(this.mvMatrix);

		// mat4.fromRotationTranslation(this.mvMatrix,this.camera.rot,this.camera.pos)

		mat4.copy(this.mvOMatrix, this.camera.mvMatrix);
		let object,shader;
		for(let o = 0; o < this.scene.objects.length; o++){
			object =this.scene.objects[o];
			shader = object.shaderProgram;
			gl.useProgram(shader.program);

			// console.log(object.pos)
			
			mat4.fromRotationTranslationScale(this.mvOMatrix,object.rot,object.pos,object.scale)
			
			mat4.mul(this.mvOMatrix,this.camera.mvMatrix,this.mvOMatrix);

			gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexPositionBuffer);
			gl.vertexAttribPointer(object.shaderProgram.vertexPositionAttribute, object.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			shader.updateMatrixUniforms(this.camera.pMatrix,this.mvOMatrix);
			shader.updateCustomUniforms(dt,object.shaderOptions)

			gl.drawArrays(object.renderMethod, 0, object.vertexPositionBuffer.numItems);
		}



		// mat4.translate(mvMatrix, mvMatrix,[-1.5, 0.0, -7.0]);
		// gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		// gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// setMatrixUniforms();
		// setUniforms(dt)
		// gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

		// glMatrix.mat4.translate(mvMatrix,mvMatrix, [3.0, 0.0, 0.0]);
		// gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
		// gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// setMatrixUniforms();
		// //setUniforms(dt)
		// gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);


		// glMatrix.mat4.translate(mvMatrix,mvMatrix,[,30,0]);
		// gl.bindBuffer(gl.ARRAY_BUFFER,circleVertexPositionBuffer);
		// gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, circleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// setMatrixUniforms();
		// //setUniforms(dt)
		// gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVertexPositionBuffer.numItems);


	}

}