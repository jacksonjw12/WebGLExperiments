class Renderer{

	constructor(){

		//used for drawing each object in the scene
		this.mvOMatrix = mat4.create();

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 		gl.enable(gl.BLEND);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);


		this.scene = new TestScene();
		// this.scene = new Scene();
		// this.scene.addObject(new Cube({
		// 	"scale":vec3.fromValues(1,1,1),
		// 	"shader":ShaderManager.getShader("simpleColor"),
		// 	"shaderOptions":{
		// 		"color":vec4.fromValues(.5,.5,.5,1.)
		// 	}
		// }))
		//this.setupTestScene();


		this.tick(0);

	}


	tick = (dt)=> {
		requestAnimationFrame(this.tick);
		this.scene.animate(dt);
		this.drawScene(dt);

	}
	drawScene(dt) {


		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



		let object,shader;
		for(let o = 0; o < this.scene.objects.length; o++){
			object = this.scene.objects[o];
			shader = object.shaderProgram;
			//use the correct shader for this object
			gl.useProgram(shader.program);

			//get the matrix for the rotation, scale, and position of this object
			mat4.fromRotationTranslationScale(this.mvOMatrix,object.rot,object.pos,object.scale)

			//multiply by the cameras rot/pos matrix to get the correct position/rotation/scale
			mat4.mul(this.mvOMatrix,this.scene.camera.mvMatrix,this.mvOMatrix);


			gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexPositionBuffer);
			gl.vertexAttribPointer(object.shaderProgram.attributes.vertexPositionAttribute, object.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(object.shaderProgram.attributes.vertexPositionAttribute)
			if(object.hasNormals){
				gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
				gl.vertexAttribPointer(object.shaderProgram.attributes.normalAttribute, object.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(object.shaderProgram.attributes.normalAttribute);

			}


			//pass the vertex shader the camera and vertex data
			shader.updateMatrixUniforms(this.scene.camera.pMatrix,this.mvOMatrix,this.scene.lightingDirection,this.scene.ambientLighting,this.scene.lightPosition);

			//give the shader any custom uniforms that it might need
			shader.updateCustomUniforms(dt,object.shaderOptions)

			//draw to the screen
			gl.drawArrays(object.renderMethod, 0, object.vertexPositionBuffer.numItems);
			if(object.hasNormals){
				//gl.disableVertexAttribArray(object.shaderProgram.attributes.normalAttribute);
			}
		}


	}

}
