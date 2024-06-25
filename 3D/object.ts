/// <reference path="./component.ts" />
/// <reference path="./standard.ts" />

class Scene{
	gameObjects:Set<GameObject> = new Set<GameObject>();
	nameToGameObject:{[name:string]:Set<GameObject>} = {};
	camera?:Camera;
	intervalId = setInterval(()=>{});
	constructor(){};
	addGameObject(obj:GameObject):GameObject{
		const camera:Component[] = obj.getComponents(ComponentType.Camera);
		if(camera.length > 0){
			this.camera = camera[0] as Camera;
		}

		if(!this.nameToGameObject[obj.name]){
			this.nameToGameObject[obj.name] = new Set<GameObject>();
		}
		this.nameToGameObject[obj.name].add(obj);
		this.gameObjects.add(obj);
		obj.scene = this;

		return obj;
	}
	deleteGameObject(obj:GameObject):void{
		this.nameToGameObject[obj.name].delete(obj);
		this.gameObjects.delete(obj);
	}
	start(){
		this.intervalId = setInterval(
			this.update.bind(this),
			1000 / Config.fps
		);
	}
	stop(){
		clearInterval(this.intervalId);
	}
	update():void{
		Config.context.clearRect(0,0,Config.canvas.width,Config.canvas.height);
		const dt = 1/Config.fps;
		this.gameObjects.forEach(function(gameObject){
			gameObject.update(dt);
		});
	}
}

class GameObject{
	scene?:Scene;
	transform?:Transform;
	components:{[componentType:number]:Component[]} = {};
	name:string = "";
	constructor(name = "gameobject", transform:Transform = Transform.identity, components:Component[]=[]){
		this.name = name;
		this.addComponent(transform);
		this.transform = transform;
		for(let component of components){
			this.addComponent(component);
		}
	}
	addComponent(component:Component):Component{
		if(!this.components[component.type]){
			this.components[component.type] = [];
		}
		this.components[component.type].push(component);
		component.gameObject = this;
		component.transform = this.transform;
		return component;
	}
	addComponents(components:Component[]):Component[]{
		for(let component of components){
			this.addComponent(component);
		}
		return components;
	}
	getComponent(componentType:number, index:number = 0):Component{
		return this.components[componentType][index];
	}
	getComponents(componentType:number):Component[]{
		if(this.components[componentType]){
			return this.components[componentType];
		}
		return [];
	}
	update(dt:number):void{
		for(let key of ComponentOrder){
			const componentList = this.getComponents(key);
			for(let component of componentList){
				component.update(dt);
			}
		}
	}
}