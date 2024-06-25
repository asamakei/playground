"use strict";
/// <reference path="./component.ts" />
/// <reference path="./standard.ts" />
class Scene {
    constructor() {
        this.gameObjects = new Set();
        this.nameToGameObject = {};
        this.intervalId = setInterval(() => { });
    }
    ;
    addGameObject(obj) {
        const camera = obj.getComponents(ComponentType.Camera);
        if (camera.length > 0) {
            this.camera = camera[0];
        }
        if (!this.nameToGameObject[obj.name]) {
            this.nameToGameObject[obj.name] = new Set();
        }
        this.nameToGameObject[obj.name].add(obj);
        this.gameObjects.add(obj);
        obj.scene = this;
        return obj;
    }
    deleteGameObject(obj) {
        this.nameToGameObject[obj.name].delete(obj);
        this.gameObjects.delete(obj);
    }
    start() {
        this.intervalId = setInterval(this.update.bind(this), 1000 / Config.fps);
    }
    stop() {
        clearInterval(this.intervalId);
    }
    update() {
        Config.context.clearRect(0, 0, Config.canvas.width, Config.canvas.height);
        const dt = 1 / Config.fps;
        this.gameObjects.forEach(function (gameObject) {
            gameObject.update(dt);
        });
    }
}
class GameObject {
    constructor(name = "gameobject", transform = Transform.identity, components = []) {
        this.components = {};
        this.name = "";
        this.name = name;
        this.addComponent(transform);
        this.transform = transform;
        for (let component of components) {
            this.addComponent(component);
        }
    }
    addComponent(component) {
        if (!this.components[component.type]) {
            this.components[component.type] = [];
        }
        this.components[component.type].push(component);
        component.gameObject = this;
        component.transform = this.transform;
        return component;
    }
    addComponents(components) {
        for (let component of components) {
            this.addComponent(component);
        }
        return components;
    }
    getComponent(componentType, index = 0) {
        return this.components[componentType][index];
    }
    getComponents(componentType) {
        if (this.components[componentType]) {
            return this.components[componentType];
        }
        return [];
    }
    update(dt) {
        for (let key of ComponentOrder) {
            const componentList = this.getComponents(key);
            for (let component of componentList) {
                component.update(dt);
            }
        }
    }
}
