class Vector2{
	constructor(
		public x:number = 0,
		public y:number = 0
	){}
	clone():Vector2{
		return new Vector2(this.x, this.y)
	}
	set(x:number, y:number):Vector2{
		this.x = x;
		this.y = y;
		return this;
	}
	copy(v:Vector2):Vector2{
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	add(v:Vector2):Vector2{
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	sub(v:Vector2):Vector2{
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	times(n:number):Vector2{
		this.x *= n;
		this.y *= n;
		return this;
	}
	timesVector(v:Vector2):Vector2{
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}
	div(n:number):Vector2{
		this.x /= n;
		this.y /= n;
		return this;
	}
	divVector(v:Vector2):Vector2{
		this.x /= v.x;
		this.y /= v.y;
		return this;
	}
	horizontal(v:Vector2):Vector2{
		return v.clone().times(this.dot(v) / v.sqMagnitude);
	}
	vertical(v:Vector2):Vector2{
		return this.clone().sub(this.horizontal(v));
	}
	dot(v:Vector2):number{
		return this.x * v.x + this.y * v.y;
	}
	cross(v:Vector2):number{
		return this.x * v.y - this.y * v.x;
	}
	distance(v:Vector2):number{
		return this.clone().sub(v).magnitude;
	}
	normalize():Vector2{
		const magnitude:number = this.magnitude;
		if(this.magnitude == 0){
			return Vector2.zero;
		}else{
			return this.times(1 / magnitude);
		}
	}
	inverse():Vector2{
		this.times(-1);
		return this;
	}
	get inversed():Vector2{
		return this.clone().inverse();
	}
	get magnitude():number{
		return this.sqMagnitude ** 0.5;
	}
	get sqMagnitude():number{
		return this.x ** 2 + this.y ** 2;
	}
	get normalized():Vector2{
		return this.clone().normalize();
	}
	static get zero():Vector2{
		return new Vector2(0, 0);
	}
	static get one():Vector2{
		return new Vector2(1, 1);
	}
	static get right():Vector2{
		return new Vector2(1, 0);
	}
	static get left():Vector2{
		return new Vector2(-1, 0);
	}
	static get up():Vector2{
		return new Vector2(0, 1);
	}
	static get down():Vector2{
		return new Vector2(0, -1);
	}
}

class Vector3{
	constructor(
		public x:number = 0,
		public y:number = 0,
		public z:number = 0
	){}
	clone():Vector3{
		return new Vector3(this.x, this.y, this.z);
	}
	set(x:number, y:number, z:number):Vector3{
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}
	copy(v:Vector3):Vector3{
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}
	add(v:Vector3):Vector3{
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}
	sub(v:Vector3):Vector3{
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}
	times(n:number):Vector3{
		this.x *= n;
		this.y *= n;
		this.z *= n;
		return this;
	}
	timesVector(v:Vector3):Vector3{
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}
	div(n:number):Vector3{
		this.x /= n;
		this.y /= n;
		this.z /= n;
		return this;
	}
	divVector(v:Vector3):Vector3{
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	}
	horizontal(v:Vector3):Vector3{
		return v.clone().times(this.dot(v) / v.sqMagnitude);
	}
	vertical(v:Vector3):Vector3{
		return this.clone().sub(this.horizontal(v));
	}
	dot(v:Vector3){
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	cross(v:Vector3):Vector3{
		return new Vector3(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x
		);
	}
	distance(v:Vector3):number{
		return this.clone().sub(v).magnitude;
	}
	normalize():Vector3{
		const magnitude:number = this.magnitude;
		if(this.magnitude == 0){
			return Vector3.zero;
		}else{
			return this.times(1 / magnitude);
		}
	}
	inverse():Vector3{
		this.times(-1);
		return this;
	}
	angle(v:Vector3):number{
		var result = Math.acos(this.dot(v)/this.magnitude/v.magnitude);
		result *=  180 / Math.PI;
		if(result < 0){
			result += 360;
		}
		return result;
	}
	get inversed():Vector3{
		return this.clone().inverse();
	}
	get magnitude():number{
		return this.sqMagnitude ** 0.5;
	}
	get sqMagnitude():number{
		return this.x ** 2 + this.y ** 2 + this.z ** 2;
	}
	get normalized():Vector3{
		return this.clone().normalize();
	}
	static get zero():Vector3{
		return new Vector3(0,0,0);
	}
	static get one():Vector3{
		return new Vector3(1, 1, 1);
	}
	static get right():Vector3{
		return new Vector3(1, 0, 0);
	}
	static get left():Vector3{
		return new Vector3(-1, 0, 0);
	}
	static get up():Vector3{
		return new Vector3(0, 1, 0);
	}
	static get down():Vector3{
		return new Vector3(0, -1, 0);
	}
	static get forward():Vector3{
		return new Vector3(0, 0, 1);
	}
	static get back():Vector3{
		return new Vector3(0, 0, -1);
	}
	
	mult(q:Quaternion){
		this.copy(
			q.conjugated.mult((new Quaternion(this, 0)).mult(q)).vector
		)
		return this;
	}
	rotate(q:Quaternion){
		this.mult(q);
		return this;
	}
	
	static normalVector(
		v1:Vector3,
		v2:Vector3,
		v3:Vector3
	){
		const v12 = v2.clone().sub(v1);
		const v23 = v3.clone().sub(v2);
		return v12.cross(v23).normalized;
	}
}
class Quaternion{

	vector:Vector3;

	constructor(v:Vector3 = Vector3.zero, public w:number = 1){
		this.vector = v.clone();
	}
	clone():Quaternion{
		return new Quaternion(this.vector, this.w);
	}
	copy(q:Quaternion):Quaternion{
		this.vector.copy(q.vector);
		this.w = q.w;
		return this;
	}
	mult(q:Quaternion):Quaternion{
		const p = this;
		const qv:Vector3 = q.vector.clone();
		const pv:Vector3 = p.vector.clone();
		this.vector.copy(
			qv.cross(pv)
				.add(qv.clone().times(p.w))
				.add(pv.clone().times(q.w))
		);
		this.w = q.w * p.w - pv.dot(qv);
		return this;
	}
	conjugate():Quaternion{
		this.vector.inverse();
		return this;
	}
	get conjugated():Quaternion{
		return this.clone().conjugate();
	}
	static get identity():Quaternion{
		return new Quaternion();
	}
	static angleAxis(v:Vector3 = Vector3.forward, theta:number = 0):Quaternion{
		theta *= Math.PI / 180;
		const vector = v.clone().normalize().times(Math.sin(theta/2));
		return new Quaternion(vector, Math.cos(theta/2));
	}
}
class Color{

	r256:number = 0;
	g256:number = 0;
	b256:number = 0;
	code:string = "";

	constructor(
		public r:number,
		public g:number,
		public b:number
	){
		this.calc256();
		this.code = this.getCode();
	}
	calc256():void{
		this.r256 = Math.floor(this.r * 255);
		this.g256 = Math.floor(this.g * 255);
		this.b256 = Math.floor(this.b * 255);
	}
	getCode():string{
		var r:string = this.r256.toString(16);
		var g:string = this.g256.toString(16);
		var b:string = this.b256.toString(16);
		r = (r.length == 1 ? '0' : '') + r;
		g = (g.length == 1 ? '0' : '') + g;
		b = (b.length == 1 ? '0' : '') + b;
		return '#' + r + g + b;
	}
	static black: Color = new Color(0, 0, 0);
	static gray: Color = new Color(0.5, 0.5, 0.5);
	static white: Color = new Color(1, 1, 1);
	static red: Color = new Color(1, 0, 0);
	static green: Color = new Color(0, 1, 0);
	static blue: Color = new Color(0, 0, 1);
	static yellow: Color = new Color(1, 1, 0);
	static purple: Color = new Color(1, 0, 1);
	static lightBlue: Color = new Color(0, 1, 1);
}