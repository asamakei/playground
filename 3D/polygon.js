"use strict";
class Point {
    constructor(position) {
        this.position = position.clone();
    }
    draw(transform) {
        return;
        const canvasPosition = this.localToCanvasPosition(transform);
        if (Number.isNaN(canvasPosition.x) || Number.isNaN(canvasPosition.y)) {
            return;
        }
        if (canvasPosition.z < 0) {
            return;
        }
        Config.context.beginPath();
        Config.context.arc(canvasPosition.x, canvasPosition.y, 5, 0, Math.PI * 2, false);
        Config.context.fill();
    }
    localToWorldPosition(transform) {
        const result = this.position.clone()
            .timesVector(transform.scale)
            .rotate(transform.rotation)
            .add(transform.position);
        return result;
    }
    worldToCanvasPosition(transform, worldPosition) {
        const camera = transform.gameObject.scene.camera;
        return camera.project(worldPosition);
    }
    localToCanvasPosition(transform) {
        const worldPosition = this.localToWorldPosition(transform);
        return this.worldToCanvasPosition(transform, worldPosition);
    }
    localToCameraBasePosition(transform) {
        const worldPosition = this.localToWorldPosition(transform);
        const camera = transform.gameObject.scene.camera;
        return camera.worldToCameraBasePosition(worldPosition);
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    get z() {
        return this.position.z;
    }
}
class Edge {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    draw(transform) {
        const v1 = this.p1.localToCanvasPosition(transform);
        var v2 = this.p2.localToCanvasPosition(transform);
        Config.context.lineWidth = 4;
        Config.context.beginPath();
        Config.context.moveTo(v1.x, v1.y);
        Config.context.lineTo(v2.x, v2.y);
        Config.context.stroke();
    }
}
class Face {
    constructor(points, color = Color.white) {
        this.points = points;
        this.color = color;
    }
    draw(transform) {
        const projected = [];
        for (let point of this.points) {
            const p = point.localToCanvasPosition(transform);
            p.z = 0;
            projected.push(p);
        }
        const n = Vector3.normalVector(projected[0], projected[1], projected[2]);
        if (n.z < 0) {
            Config.context.fillStyle = "white";
            Config.context.beginPath();
            Config.context.moveTo(projected[0].x, projected[0].y);
            for (let i = 1; i < projected.length; i++) {
                Config.context.lineTo(projected[i].x, projected[i].y);
            }
            Config.context.fill();
            Config.context.fillStyle = "black";
            /*n = Face.normalVector(three[0],three[1],three[2]);
            var cor = n.dot(directionalLight.transform.position.normalized);
            cor = (cor+1)/2;
            cor = Math.floor(cor*255);
            ctx.fillStyle = "rgb("+cor+","+cor+","+cor+")";
            //ctx.fillStyle = this.color;
            //ctx.globalAlpha = 0.3;
            ctx.fill();
            //ctx.globalAlpha = 1;
            */
        }
    }
}
class Polygon {
    constructor(points = [], edges = [], faces = []) {
        this.points = points;
        this.edges = edges;
        this.faces = faces;
    }
    draw(transform) {
        for (let point of this.points) {
            point.draw(transform);
        }
        for (let edge of this.edges) {
            edge.draw(transform);
        }
        for (let face of this.faces) {
            face.draw(transform);
        }
    }
}
class PrefabShape {
    static point(v = Vector3.zero) {
        return new Polygon([new Point(v)], [], []);
    }
    static edge(v1 = Vector3.zero, v2 = Vector3.zero) {
        const p1 = new Point(v1);
        const p2 = new Point(v2);
        return new Polygon([p1, p2], [new Edge(p1, p2)], []);
    }
    static face(v1 = Vector3.zero, v2 = Vector3.zero, v3 = Vector3.zero) {
        const p1 = new Point(v1);
        const p2 = new Point(v2);
        const p3 = new Point(v3);
        const e1 = new Edge(p1, p2);
        const e2 = new Edge(p2, p3);
        const e3 = new Edge(p3, p1);
        const f = new Face([p1, p2, p3]);
        return new Polygon([p1, p2, p3], [e1, e2, e3], [f]);
    }
    static cube(scale = Vector3.one) {
        const p = [];
        const e = [];
        const f = [];
        p.push(new Point(new Vector3(1, 1, 1)));
        p.push(new Point(new Vector3(1, 1, -1)));
        p.push(new Point(new Vector3(1, -1, 1)));
        p.push(new Point(new Vector3(1, -1, -1)));
        p.push(new Point(new Vector3(-1, 1, 1)));
        p.push(new Point(new Vector3(-1, 1, -1)));
        p.push(new Point(new Vector3(-1, -1, 1)));
        p.push(new Point(new Vector3(-1, -1, -1)));
        for (let i = 0; i < 8; i++) {
            for (let j = i + 1; j < 8; j++) {
                if (p[i].position.dot(p[j].position) == 1) {
                    e.push(new Edge(p[i], p[j]));
                }
            }
        }
        f.push(new Face([p[0], p[1], p[3], p[2]]));
        f.push(new Face([p[6], p[7], p[5], p[4]]));
        f.push(new Face([p[4], p[5], p[1], p[0]]));
        f.push(new Face([p[2], p[3], p[7], p[6]]));
        f.push(new Face([p[0], p[2], p[6], p[4]]));
        f.push(new Face([p[5], p[7], p[3], p[1]]));
        for (let point of p) {
            point.position.timesVector(scale);
            point.position.div(2);
        }
        return new Polygon(p, e, f);
    }
}
