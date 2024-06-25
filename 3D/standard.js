"use strict";
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    times(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    timesVector(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }
    divVector(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    horizontal(v) {
        return v.clone().times(this.dot(v) / v.sqMagnitude);
    }
    vertical(v) {
        return this.clone().sub(this.horizontal(v));
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    distance(v) {
        return this.clone().sub(v).magnitude;
    }
    normalize() {
        const magnitude = this.magnitude;
        if (this.magnitude == 0) {
            return Vector2.zero;
        }
        else {
            return this.times(1 / magnitude);
        }
    }
    inverse() {
        this.times(-1);
        return this;
    }
    get inversed() {
        return this.clone().inverse();
    }
    get magnitude() {
        return this.sqMagnitude ** 0.5;
    }
    get sqMagnitude() {
        return this.x ** 2 + this.y ** 2;
    }
    get normalized() {
        return this.clone().normalize();
    }
    static get zero() {
        return new Vector2(0, 0);
    }
    static get one() {
        return new Vector2(1, 1);
    }
    static get right() {
        return new Vector2(1, 0);
    }
    static get left() {
        return new Vector2(-1, 0);
    }
    static get up() {
        return new Vector2(0, 1);
    }
    static get down() {
        return new Vector2(0, -1);
    }
}
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    times(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }
    timesVector(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }
    div(n) {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }
    divVector(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }
    horizontal(v) {
        return v.clone().times(this.dot(v) / v.sqMagnitude);
    }
    vertical(v) {
        return this.clone().sub(this.horizontal(v));
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    distance(v) {
        return this.clone().sub(v).magnitude;
    }
    normalize() {
        const magnitude = this.magnitude;
        if (this.magnitude == 0) {
            return Vector3.zero;
        }
        else {
            return this.times(1 / magnitude);
        }
    }
    inverse() {
        this.times(-1);
        return this;
    }
    angle(v) {
        var result = Math.acos(this.dot(v) / this.magnitude / v.magnitude);
        result *= 180 / Math.PI;
        if (result < 0) {
            result += 360;
        }
        return result;
    }
    get inversed() {
        return this.clone().inverse();
    }
    get magnitude() {
        return this.sqMagnitude ** 0.5;
    }
    get sqMagnitude() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }
    get normalized() {
        return this.clone().normalize();
    }
    static get zero() {
        return new Vector3(0, 0, 0);
    }
    static get one() {
        return new Vector3(1, 1, 1);
    }
    static get right() {
        return new Vector3(1, 0, 0);
    }
    static get left() {
        return new Vector3(-1, 0, 0);
    }
    static get up() {
        return new Vector3(0, 1, 0);
    }
    static get down() {
        return new Vector3(0, -1, 0);
    }
    static get forward() {
        return new Vector3(0, 0, 1);
    }
    static get back() {
        return new Vector3(0, 0, -1);
    }
    mult(q) {
        this.copy(q.conjugated.mult((new Quaternion(this, 0)).mult(q)).vector);
        return this;
    }
    rotate(q) {
        this.mult(q);
        return this;
    }
    static normalVector(v1, v2, v3) {
        const v12 = v2.clone().sub(v1);
        const v23 = v3.clone().sub(v2);
        return v12.cross(v23).normalized;
    }
}
class Quaternion {
    constructor(v = Vector3.zero, w = 1) {
        this.w = w;
        this.vector = v.clone();
    }
    clone() {
        return new Quaternion(this.vector, this.w);
    }
    copy(q) {
        this.vector.copy(q.vector);
        this.w = q.w;
        return this;
    }
    mult(q) {
        const p = this;
        const qv = q.vector.clone();
        const pv = p.vector.clone();
        this.vector.copy(qv.cross(pv)
            .add(qv.clone().times(p.w))
            .add(pv.clone().times(q.w)));
        this.w = q.w * p.w - pv.dot(qv);
        return this;
    }
    conjugate() {
        this.vector.inverse();
        return this;
    }
    get conjugated() {
        return this.clone().conjugate();
    }
    static get identity() {
        return new Quaternion();
    }
    static angleAxis(v = Vector3.forward, theta = 0) {
        theta *= Math.PI / 180;
        const vector = v.clone().normalize().times(Math.sin(theta / 2));
        return new Quaternion(vector, Math.cos(theta / 2));
    }
}
class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.r256 = 0;
        this.g256 = 0;
        this.b256 = 0;
        this.code = "";
        this.calc256();
        this.code = this.getCode();
    }
    calc256() {
        this.r256 = Math.floor(this.r * 255);
        this.g256 = Math.floor(this.g * 255);
        this.b256 = Math.floor(this.b * 255);
    }
    getCode() {
        var r = this.r256.toString(16);
        var g = this.g256.toString(16);
        var b = this.b256.toString(16);
        r = (r.length == 1 ? '0' : '') + r;
        g = (g.length == 1 ? '0' : '') + g;
        b = (b.length == 1 ? '0' : '') + b;
        return '#' + r + g + b;
    }
}
Color.black = new Color(0, 0, 0);
Color.gray = new Color(0.5, 0.5, 0.5);
Color.white = new Color(1, 1, 1);
Color.red = new Color(1, 0, 0);
Color.green = new Color(0, 1, 0);
Color.blue = new Color(0, 0, 1);
Color.yellow = new Color(1, 1, 0);
Color.purple = new Color(1, 0, 1);
Color.lightBlue = new Color(0, 1, 1);
