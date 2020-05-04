class RayMarch extends ShaderProgram {


	constructor(){
		super("raymarch",false);

		this.noise = new SimplexNoise(Math.random);
		super.loadShaderSource(RayMarch.vertexShaderSource,RayMarch.fragmentShaderSource);



	}
	initCustomUniforms(){
		this.timeUniform = gl.getUniformLocation(this.program, "u_time");
		this.randUniform = gl.getUniformLocation(this.program, "u_random");
		this.colorUniform = gl.getUniformLocation(this.program, "u_color");
		this.resolutionUniform = gl.getUniformLocation(this.program, "u_resolution");
		this.cameraPosUniform = gl.getUniformLocation(this.program, "u_cameraPos");
		this.cameraRotUniform = gl.getUniformLocation(this.program, "u_cameraRot");

		this.MVUniform = gl.getUniformLocation(this.program, "u_MVMatrix");

		//this.objectScreenLocationUniform = gl.getUniformLocation(this.program,"u_objectScreenLocation")
	}

	updateCustomUniforms(dt,material,object,pMatrix,mvOMatrix,camera){
		gl.uniform4fv(this.colorUniform, material.color);
		gl.uniform1f(this.timeUniform, dt/1000.0);

		let noiseSpeed = 2;
		gl.uniform1f(this.randUniform, this.noise.noise2D(dt/1000 * noiseSpeed, 0));

		gl.uniform2fv(this.resolutionUniform,resolution);

		gl.uniform3fv(this.cameraPosUniform,camera.pos);
		gl.uniform3fv(this.cameraRotUniform,camera.rot);

		gl.uniformMatrix4fv(this.MVUniform, false, camera.mvMatrix);
		//let oMatrix = mat4.create();
		//mat4.mul(oMatrix,this.scene.camera.mvMatrix,this.mvOMatrix);

		// mat4.translate(oMatrix,oMatrix,vec3.fromValues(0.5,0.5,0.5));
		// mat4.mul(oMatrix,pMatrix,mvOMatrix);
		// mat4.mul(oMatrix,mvOMatrix,pMatrix);
		// let objectPos = vec4.fromValues(object.pos[0],object.pos[1],object.pos[2],0.0);
		// let screenPos = vec4.transformMat4(vec4.create(),objectPos,oMatrix);
		// //let screenPos = mat4.getTranslation(vec3.create(),mvOMatrix)
		// // console.log(screenPos);
		// // let screenPos = vec3.fromValues(oMatrix[8],oMatrix[15],oMatrix[15]);
		// console.log(screenPos);
		// gl.uniform3fv(this.objectScreenLocationUniform,vec3.fromValues(screenPos.x,screenPos.y,screenPos.z));



	}


}

RayMarch.vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexNormal;
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	
	
	varying vec3 ObjectPos;
	varying vec3 FragPos;
	
	//varying vec3 objectLocation;
	void main(void) {
		//FragPos = vec3(uMVMatrix * aVertexPosition);
		
		//mat4 objectMV = uPMatrix * uMVMatrix;
		vec4 oPos = uPMatrix * uMVMatrix * vec4(0.,0.,0.,1.0); 
		gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
		
		FragPos = gl_Position.xyz / gl_Position.w;
		ObjectPos = oPos.xyz / oPos.w;
		//vec4 objectPos = vec4(0,0,0,1.0);
		//objectPos = objectMV;//uPMatrix * objectPos;
//		objectLocation = vec3(objectMV[3]);
		
	}
`;

RayMarch.fragmentShaderSource = `
	precision mediump float;
	uniform mediump vec4 u_color;
	uniform vec2 u_resolution;
	uniform float u_time;
	uniform float u_random;
	uniform vec3 u_cameraPos;
	uniform vec3 u_cameraRot;
	

	uniform mat4 u_MVMatrix;
	
	varying vec3 ObjectPos;
	varying vec3 FragPos;
	
	const int MAX_MARCHING_STEPS = 255;
	const float MIN_DIST = 0.0;
	const float MAX_DIST = 100.0;
	const float EPSILON = 0.0001;
	const float EPSILON_CLOSE = 10.0002;
	const float PI = 3.14;
	//uniform vec3 u_objectScreenLocation;
	
	float sphereDist(vec3 rayLoc, vec3 sphereCenter, float radius){
		return distance(rayLoc,sphereCenter)-radius;
	}
	float cubeDist(vec3 rayLoc, vec3 cubeCenter, vec3 scale){
		vec3 q = abs(rayLoc) - cubeCenter;
  		return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
	}
	
	float intersectSDF(float distA, float distB) {
		return max(distA, distB);
	}
	
	float unionSDF(float distA, float distB) {
		return min(distA, distB);
	}
	
	float differenceSDF(float distA, float distB) {
		return max(distA, -distB);
	}
	
	float computeSDF(vec3 rayLoc){
		float scale = 0.5;
		float d1 = sphereDist(rayLoc, vec3(sin(PI/2.) * scale/2.,0,0),0.5 * scale);
		float d2 =sphereDist(rayLoc, vec3(sin(u_time/4.) * scale/2.,0,0),0.5 * scale);
		
		float d3 = cubeDist(rayLoc, vec3(0,0,0), vec3(.6*scale));
		
		float dAvg = 0.;
		float avgs = 0.;
		float close = 100.;
		if(d1 < close){
			dAvg += d1;
			avgs += 1.;
		}
		if(d2 < close){
			dAvg += d2;
			avgs += 1.;
		}
		if(d3 < close){
			dAvg += d3;
			avgs += 1.;
		}
		if(avgs > 0.){
//			return differenceSDF(dAvg / avgs,differenceSDF(d1,d2));
			//return unionSDF(d1,unionSDF(d2,d3));
			return d1;
		}
		else{
			return MAX_DIST;
		}
		//float dAvg =  (d1 + d2 + d3)/3.0;
		//return dAvg;
		//return min(d1,min(d2,d3));
		//return (d1 + d2 + d3)/10.0;
		//return d3-d2/4.;
	}
	vec4 shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
		float depth = start;
		float avgDist = 0.;
		
		float minDist = 100.;
		float minDistDepth = 100.;
		for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
			float dist = computeSDF(eye + depth * marchingDirection);
			avgDist += dist;
			if(dist < minDist){
				minDist = dist;
				minDistDepth = depth + dist;
			}
			if (dist < EPSILON) {
				
				return vec4(minDistDepth,minDist,depth,float(i));
			}
			depth += dist;
			
			if (depth >= end) {
				return vec4(minDistDepth,minDist,depth,float(i));
			}
			
		}
		return vec4(minDistDepth,minDist,depth,MAX_MARCHING_STEPS);
	}
	vec3 estimateNormal(vec3 p) {
		return normalize(vec3(
			computeSDF(vec3(p.x + EPSILON, p.y, p.z)) - computeSDF(vec3(p.x - EPSILON, p.y, p.z)),
			computeSDF(vec3(p.x, p.y + EPSILON, p.z)) - computeSDF(vec3(p.x, p.y - EPSILON, p.z)),
			computeSDF(vec3(p.x, p.y, p.z  + EPSILON)) - computeSDF(vec3(p.x, p.y, p.z - EPSILON))
		));
	}
	

	vec3 pointLighting(vec3 camera,vec3 rayPos,vec3 rayNormal, vec3 lightPos, vec3 lightIntensity, vec3 diffuseColor, vec3 specularColor, float shininess){
		
		vec3 L = normalize(lightPos - rayPos);
		vec3 V = normalize(camera - rayPos);
		vec3 R = normalize(reflect(-L, rayNormal));
		
		float dotLN = clamp(dot(L, rayNormal),0.,1.);
		float dotRV = dot(R, V);
		
		if (dotLN < 0.0) {
			// Light not visible from this point on the surface
			return vec3(0.0, 0.0, 0.0);
		} 
		
		if (dotRV < 0.0) {
			// Light reflection in opposite direction as viewer, apply only diffuse
			// component
			return lightIntensity * (diffuseColor * dotLN);
		}
		return lightIntensity * (diffuseColor * dotLN + specularColor * pow(dotRV, shininess));
		}
	vec3 doLighting(vec3 camera, vec3 rayPos,vec3 rayNormal, vec3 ambientColor, vec3 diffuseColor, vec3 specularColor,float shininess){
		const vec3 ambientLightIntensity = 0.5 * vec3(1.0, 1.0, 1.0);
		
		vec3 color = ambientColor*ambientLightIntensity;
		//pLight1
		float cR = 1.0;
		vec3 light1Pos = vec3(cR*sin(u_time),1.0,cR*cos(u_time));
		
		vec3 light1Intensity = vec3(0.5,0.5,0.5);
		color += pointLighting(camera, rayPos, rayNormal,light1Pos, light1Intensity,diffuseColor,specularColor,shininess);
		
		vec3 light2Pos = vec3(cR*sin(u_time/5.),-1.0,cR*cos(u_time/5.));
		vec3 light2Intensity = vec3(0.3,0.3,0.3);
		color += pointLighting(camera, rayPos, rayNormal,light2Pos, light2Intensity,diffuseColor,specularColor,shininess);
		
		
		return clamp(color,vec3(0),vec3(1));
		
		
	}
	mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) {
		// Based on gluLookAt man page
		vec3 f = normalize(center - eye);
		vec3 s = normalize(cross(f, up));
		vec3 u = cross(s, f);
		return mat4(
			vec4(s, 0.0),
			vec4(u, 0.0),
			vec4(-f, 0.0),
			vec4(0.0, 0.0, 0.0, 1)
		);
	}

	vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
		vec2 xy = fragCoord - size / 2.0;
		float z = size.y / tan(radians(fieldOfView) / 2.0);
		return normalize(vec3(xy, -z));
	}
	void main() {
		
		vec2 FragCoord = gl_FragCoord.xy ;

		vec3 camera = u_cameraPos;
		//vec3 dir = rayDirection(45.0, u_resolution, gl_FragCoord.xy);
		/* ________other website w/*/
//		xy = xy * 2.- vec2(1.);
//		xy.x *= u_resolution.x/u_resolution.y;
//		vec3 pixelPos = vec3(xy, 2.); // Image plane at (0,0,2)
//		vec3 eyePos = vec3(0.,0.,5.); // Camera position at (0,0,5)
//		vec3 dir = normalize(pixelPos-eyePos);
		/* _________________*/
		
		vec2 xy = (FragCoord / u_resolution - 0.5)*2.0;
		xy.x *= u_resolution.x/u_resolution.y;
		vec3 eye = vec3(0,0,0);
		vec3 plane = vec3(xy,-5.);
		
		vec3 dir = normalize(plane);
		
		/* ________raymarching primitives way_________*/
//		vec2 p = (2.0*FragCoord-u_resolution.xy)/u_resolution.y;
		//vec3 rd = ca * normalize( vec3(p,2.5) );

		/* _________________*/
		//rayDirection(45.0, u_resolution, gl_FragCoord.xy);
		//camera = uMVMatrix * camera;
		
		mat4 viewToWorld = viewMatrix(camera, vec3(0.0, 0.0, 0.0), vec3(0.0,1.0,0.0));
    
    	vec3 worldDir = (u_MVMatrix * vec4(dir,0.0)).xyz;//(viewToWorld * vec4(dir, 0.0)).xyz;
    	
		
		vec4 distV = shortestDistanceToSurface(camera, worldDir, MIN_DIST, MAX_DIST);
		float dist  = distV.z;
		
		
		
		//gl_FragColor  = vec4(diff,diff,diff,1.0);
		
		vec3 diffuseColor = vec3(abs(sin(u_time)), abs(cos(u_time)), abs(sin(u_time+PI)));
		vec3 specularColor = vec3(1.0, 1.0, 1.0);
		float shininess = 10.0;

		float aFactor = 1.0;
		vec3 rayLoc;
		
//		float z = u_resolution.y /length(u_resolution) / tan(radians(45.) / 2.0);
//		vec2 xy = gl_FragCoord.xy/u_resolution - 0.5;
//		vec3 vector = vec3(xy, -z) ;
		//vector /= length(vector);
		
//		gl_FragColor = vec4(gl_FragCoord.x/u_resolution.x,0.,0.,1.0);
//		return;
		if (dist > MAX_DIST - EPSILON) {
			
			discard;
			// Didn't hit anything
			float edge = distV.w / float(MAX_MARCHING_STEPS);
			float minDist = distV.y;
			float a = 1.0-edge;//smoothstep(0.0,1.0,edge * 5.0);
			//gl_FragColor = vec4(vec3(a), 1.0);
			float edgeSize = .02;
			if(minDist > edgeSize){
				discard;
				
			}
			else{
				aFactor = 1.-smoothstep(0.,1.,(1.0/edgeSize) * (minDist));
				
				rayLoc = camera + distV.x * worldDir;
				
				
				
			}
			
			return;
		}
		else{
			rayLoc = camera + dist * worldDir;
		}
		
		
		//vec3 N = estimateNormal(rayLoc);
		//vec3 ambientColor = N/2.0;//vec3(0.5, 0.5, 0.5);
		//float angle = abs(dot(N,worldDir) / PI);
		
		//vec3 light = doLighting(camera, rayLoc, N,ambientColor,N,specularColor,shininess);
		
		
		
		gl_FragColor = vec4(1.0,0,0,aFactor);
	}
`;

ShaderManager.shaderPrograms.push(new RayMarch());
