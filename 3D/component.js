"use strict";
/// <reference path="./object.ts" />
/// <reference path="./standard.ts" />
const ComponentType = {
    Component: 0,
    Transform: 1,
    Renderer: 2,
    MeshRenderer: 3,
    Camera: 4,
};
const ComponentOrder = [
    ComponentType.Component,
    ComponentType.Transform,
    ComponentType.Renderer,
    ComponentType.MeshRenderer,
    ComponentType.Camera
];
class Component {
    constructor() {
        this.type = ComponentType.Component;
    }
    update(dt) { }
}
class Transform extends Component {
    constructor(position = Vector3.zero, rotation = Quaternion.identity, scale = Vector3.one) {
        super();
        this.type = ComponentType.Transform;
        this.position = Vector3.zero;
        this.rotation = Quaternion.identity;
        this.scale = Vector3.one;
        this.position.copy(position);
        this.rotation.copy(rotation);
        this.scale.copy(scale);
    }
    translate(v) {
        this.position.add(v);
    }
    rotate(q) {
        this.rotation.mult(q);
    }
    zoom(v) {
        this.scale.timesVector(v);
    }
    lookAt(target, worldUp = Vector3.up) {
        const diff = target.clone().sub(this.position).normalize();
        const forward = Vector3.forward;
        const n = forward.cross(diff);
        const theta = diff.angle(forward);
        const q = Quaternion.angleAxis(n, theta);
        console.log(n, theta);
        this.rotation = q;
        console.log(q);
        /*const diff = target.clone().sub(this.position).normalize();
        const up = worldUp.clone().normalize();
        const n = up.cross(diff);
        const theta = Math.acos(up.dot(diff)) * 180 / Math.PI;
        const q = Quaternion.angleAxis(n, theta);
        this.rotation = q;*/
    }
    static get identity() {
        return new Transform();
    }
}
class Camera extends Component {
    constructor(distance = 1) {
        super();
        this.distance = distance;
        this.type = ComponentType.Camera;
        this.size = new Vector3(Config.canvas.width, Config.canvas.height, 1);
        this.halfSize = new Vector3(Config.canvas.width / 2, Config.canvas.height / 2, 0);
    }
    worldToCameraBasePosition(worldPosition) {
        return worldPosition.clone()
            .sub(this.transform.position)
            .rotate(this.transform.rotation.conjugated)
            .divVector(this.transform.scale);
    }
    cameraBaseToCanvasPosition(cameraBasePosition) {
        const result = new Vector3(cameraBasePosition.x, cameraBasePosition.y, 1);
        result.timesVector(this.size);
        result.times(this.distance / cameraBasePosition.z);
        result.y = -result.y;
        result.add(this.halfSize);
        return result;
    }
    project(worldPosition) {
        const cameraBasePosition = this.worldToCameraBasePosition(worldPosition);
        return this.cameraBaseToCanvasPosition(cameraBasePosition);
    }
    canvasToWorldPosition(canvasPosition, far = this.distance) {
        const cameraBasePosition = this.canvasToCameraBasePosition(canvasPosition, far);
        return this.cameraBaseToWorldPosition(cameraBasePosition);
    }
    canvasToCameraBasePosition(canvasPosition, far = this.distance) {
        const result = new Vector3(canvasPosition.x, canvasPosition.y, 0);
        result.add(this.halfSize);
        result.times(far / this.distance);
        result.z = far;
        return result;
    }
    cameraBaseToWorldPosition(cameraBasePosition) {
        return cameraBasePosition.clone()
            .timesVector(this.transform.scale)
            .rotate(this.transform.rotation)
            .add(this.transform.position);
    }
}
class Renderer extends Component {
    constructor() {
        super();
        this.type = ComponentType.Renderer;
    }
}
class MeshRenderer extends Component {
    constructor(polygon) {
        super();
        this.polygon = polygon;
        this.type = ComponentType.MeshRenderer;
    }
    update(dt) {
        this.polygon.draw(this.transform);
    }
}
