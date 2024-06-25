const scene = new Scene();
const camera = new GameObject(
    "camera",
    Transform.identity,
    [new Camera(1)]
);
scene.addGameObject(camera);


const point = new GameObject(
    "point",
    Transform.identity,
    [new MeshRenderer(PrefabShape.edge(new Vector3(0,0,0),new Vector3(0,0.2,0)))]
);
const cube = new GameObject(
    "cube",
    Transform.identity,
    [new MeshRenderer(PrefabShape.cube(Vector3.one.div(3)))]
);
point.transform!.position.z = 1;
cube.transform!.position.z = 2;
scene.addGameObject(cube);

scene.start();

//camera.transform!.rotate(Quaternion.angleAxis(new Vector3(1,0,0),10));

//cube.transform!.rotation = Quaternion.angleAxis(new Vector3(0,1,1),5);
//camera.transform!.lookAt(new Vector3(10,0,10));
//camera.transform!.rotation = Quaternion.angleAxis(Vector3.up,45);
//cube.transform!.position = new Vector3(2,0,2);
setInterval(function(){
    cube.transform!.translate(new Vector3(0.01,0,0));
    camera.transform!.lookAt(cube.transform!.position);
    cube.transform!.rotate(Quaternion.angleAxis(new Vector3(0.5,0.5,1),5));
    //camera.transform!.rotate(Quaternion.angleAxis(new Vector3(0,0,1),2.2));
    //camera.transform!.rotate(Quaternion.angleAxis(Vector3.up,-0.1));
}, 1000/Config.fps);