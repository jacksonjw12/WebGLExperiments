class Scene{

	constructor(name, objects){
		this.name = name;

		this.objects = (objects !== undefined)?objects:[];
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