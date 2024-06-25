/// <reference path="./object.ts" />
/// <reference path="./standard.ts" />

const ComponentType = {
	Component:0,
	Transform:1,
	Renderer:2,
	MeshRenderer:3,
	Camera:4,
};

const ComponentOrder = [
	ComponentType.Component,
	ComponentType.Transform,
	ComponentType.Renderer,
	ComponentType.MeshRenderer,
	ComponentType.Camera
];

class Component{
	gameObject?:GameObject;
	transform?:Transform;
	type:number = ComponentType.Component;
	constructor(){}
	update(dt:number){}
}
class Transform extends Component{
	type:number = ComponentType.Transform;

	position:Vector3 = Vector3.zero;
	rotation:Quaternion = Quaternion.identity;
	scale:Vector3 = Vector3.one;

	constructor(
		position:Vector3 = Vector3.zero,
		rotation:Quaternion = Quaternion.identity,
		scale:Vector3 = Vector3.one
	){
		super();
		this.position.copy(position);
		this.rotation.copy(rotation);
		this.scale.copy(scale);
	}
	translate(v:Vector3):void{
		this.position.add(v);
	}
	rotate(q:Quaternion):void{
		this.rotation.mult(q);
	}
	zoom(v:Vector3):void{
		this.scale.timesVector(v);
	}
	lookAt(target:Vector3, worldUp:Vector3 = Vector3.up){
		const diff = target.clone().sub(this.position).normalize();
		const forward = Vector3.forward;
		const n = forward.cross(diff);
		const theta = diff.angle(forward);
		const q = Quaternion.angleAxis(n,theta);
		this.rotation = q;
		// TODO: upの考慮
	}
	static get identity(){
		return new Transform();
	}
}
class Camera extends Component{
	type = ComponentType.Camera;
	size:Vector3 = new Vector3(Config.canvas.width, Config.canvas.height, 1);
	halfSize:Vector3 = new Vector3(Config.canvas.width / 2, Config.canvas.height / 2, 0);
	constructor(public distance:number = 1){
		super();
	}
	worldToCameraBasePosition(worldPosition:Vector3):Vector3{
		return worldPosition.clone()
				.sub(this.transform!.position)
				.rotate(this.transform!.rotation.conjugated)
				.divVector(this.transform!.scale);
	}
	cameraBaseToCanvasPosition(cameraBasePosition:Vector3):Vector3{
		const result = new Vector3(cameraBasePosition.x, cameraBasePosition.y, 1);
		result.timesVector(this.size);
		result.times(this.distance / cameraBasePosition.z);
		result.y = -result.y;
		result.add(this.halfSize);
		return result;
	}
	project(worldPosition:Vector3):Vector3{
		const cameraBasePosition = this.worldToCameraBasePosition(worldPosition);
		return this.cameraBaseToCanvasPosition(cameraBasePosition);
	}
	canvasToWorldPosition(canvasPosition:Vector2, far:number = this.distance){
		const cameraBasePosition = this.canvasToCameraBasePosition(canvasPosition, far);
		return this.cameraBaseToWorldPosition(cameraBasePosition);
	}
	canvasToCameraBasePosition(canvasPosition:Vector2, far:number = this.distance){
		const result = new Vector3(
			canvasPosition.x,
			canvasPosition.y,
			0
		);
		result.add(this.halfSize);
		result.times(far / this.distance);
		result.z = far;
		return result;
	}
	cameraBaseToWorldPosition(cameraBasePosition:Vector3){
		return cameraBasePosition.clone()
			.timesVector(this.transform!.scale)	
			.rotate(this.transform!.rotation)
			.add(this.transform!.position);
	}
}
class Renderer extends Component{
	type = ComponentType.Renderer;
	constructor(){
		super();
	}
}
class MeshRenderer extends Component{
	type = ComponentType.MeshRenderer;
	constructor(public polygon:Polygon){
		super();
	}
	update(dt: number): void {
		this.polygon.draw(this.transform!);
	}
}