class Cube extends Object {

	constructor(args){
		super({...args,"geometry":new CubeGeometry()});

		console.log(this.material)
	}

}
