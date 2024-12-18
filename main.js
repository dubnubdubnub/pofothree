import * as THREE from "three"
import "./style.css"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"
import {RGBELoader } from "three/addons/loaders/RGBELoader.js"

class Probject {
    constructor(objName, assetPath, year, tags, blog) {
        this.probj;
        this.probjArr = [];
        this.objName = objName;
        this.assetPath = assetPath;
        this.year = year;
        this.tags = tags;
        this.blog = blog;
    }
    
}

function probjLoad(probject, loader, layer) {

    loader.load(
        probject.assetPath,
        function (glb) {
            probject.probj = glb.scene;
            probject.probj.layers.set(layer);
            let i;
            for (i = 0; i < probject.probj.children.length; i++) {
                probject.probj.children[i].layers.set(layer);
                probject.probj.children[i].name = probject.objName;
                probject.probjArr.push(probject.probj.children[i]);
            }
            scene.add(probject.probj);

            switch (probject.year) {
                case 2024:
                    obj2024.push(probject);
                    break;
                case 2023:
                    obj2023.push(probject);
                    break;
                default:
                    obj2022.push(probject);
                    break;
            }
        }
    )
    
    return probject.probj;
}

const scene = new THREE.Scene()

//layer 0 raycast + camera
//layer 1 neither
//layer 2 camera

//geo

const planeGeo = new THREE.PlaneGeometry(9999, 9999);
const planeMat = new THREE.MeshStandardMaterial({
    color: "#393939",
    roughness: 0.7
})

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

new RGBELoader()
    .setPath("./")
    .load("opk.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        //scene.background = texture;
        scene.environment = texture;
    })

new RGBELoader()
    .setPath("./")
    .load("osp.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        //scene.environment = texture;
    })

let obj2022 = [];
let obj2023 = [];
let obj2024 = [];
//names
const objNames = ["melon", "arcade", "car"];
const elaineN = "elaine";

//tags
const melonTags = ["CV", "AI", "software", "PyTorch", "Python"];
const arcadeTags = ["hardware", "CAD", "Fusion 360"];
const carTags = ["hardware", "3d printing", "software", "arduino", "raspberry pi", "Fusion 360", "CAD"];
const elaineTags = ["Unity", "software", "Photon Bolt", "C\#"];

//Probjects
const melon = new Probject(objNames[0], "assets/melon.glb", 2024, melonTags);
const arcade = new Probject(objNames[1], "assets/arcade.glb", 2024, arcadeTags);
const car = new Probject(objNames[2], "assets/car.glb", 2024, carTags);
const elaine = new Probject(elaineN, "assets/elaine.glb", 2024, elaineTags);



//Load
melon.probj = probjLoad(melon, loader, 0);
arcade.probj = probjLoad(arcade, loader, 0);
car.probj = probjLoad(car, loader, 0);

let telaine;
loader.load(

    elaine.assetPath,
    function (glb) {
        telaine = glb.scene

        telaine.children[0].material.wireframe = true
        telaine.children[0].name = elaine.objName;
        telaine.children[0].layers.set(0)
        scene.add(telaine)
    }
)

const boxGeo = new THREE.BoxGeometry(8, 8, 8)
boxGeo.translate(0, 4, 0)
const boxWireGeo = new THREE.EdgesGeometry(boxGeo)
const boxWireMat = new THREE.LineBasicMaterial({ color: 0xff3939 })
const boxWireframe = new THREE.LineSegments(boxWireGeo, boxWireMat)

const meshPlane = new THREE.Mesh(planeGeo, planeMat)

boxWireframe.translateY(-30)
boxWireframe.layers.set(2)
scene.add(boxWireframe);


meshPlane.layers.set(2)
scene.add(meshPlane)
meshPlane.rotateX(-Math.PI / 2)
meshPlane.translateZ(-3)

//render

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height)
camera.layers.enable(0)
camera.layers.disable(1)
camera.layers.enable(2)

camera.position.z = 30
camera.position.y = 10
scene.add(camera)

const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.toneMapping = THREE.ACESFilmicToneMapping


renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2);
renderer.render(scene, camera)

//controls

const controls = new OrbitControls(camera, canvas)
controls.mouseButtons = {
    RIGHT: THREE.MOUSE.ROTATE
}
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = false
controls.autoRotateSpeed = 0
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI * 0.5

//raycast
const raycaster = new THREE.Raycaster()
raycaster.layers.set(0)
const pointer = new THREE.Vector2()
function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}


//addEventListeners
window.addEventListener('pointermove', onPointerMove);
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})



let mouseDown = false
let rgb = []
window.addEventListener("mousedown", (e) => {
    mouseDown = true;
    
    
    if (INTERSECTED && e.button == 0) {
        for (let i = 0; i < obj2024.length; i++) {
            if (obj2024[i].objName == INTERSECTED.name) {
                window.open(obj2024[i].blog);
                break;
            }
        }
    }
    
    
})
window.addEventListener("mouseup", () => (mouseDown = false))
window.addEventListener("mousemove", (e) => {


    if (mouseDown) {
        /*
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150,
        ]
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(meshSphere.material.color, { r: newColor.r, g: newColor.g, b: newColor.b })
    */
    }
})

let INTERSECTED;
//main loop
const loop = () => {
    controls.update()
    
    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {

        
        if (INTERSECTED) {
            boxWireframe.position.setX(INTERSECTED.parent.position.x)
            boxWireframe.position.setY(INTERSECTED.parent.position.y)
            boxWireframe.position.setZ(INTERSECTED.parent.position.z)
        }

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
            
        }

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        boxWireframe.position.setY(-30)
        INTERSECTED = null;

    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

const rowSize = Math.floor((window.innerWidth / window.innerHeight) * 5)
let colNum = 16;
THREE.DefaultLoadingManager.onLoad = function () {
    elaine.probj = telaine;
    obj2024.push(elaine);
    console.log("rowSize is: " + rowSize);
    console.log(obj2024.length);
    let index = 0;

    if (rowSize % 2 == 0) {
        for (let i = 0; i < Math.floor(obj2024.length / rowSize); i++) {
            for (let j = 0; j < rowSize; j++) {
                if (j % 2 == 0) {
                    obj2024[index].probj.translateX(5 + Math.floor(j/2) * 10);
                    console.log(5 + Math.floor(j / 2) * 10);
                } else {
                    obj2024[index].probj.translateX(-5 - Math.floor(j/2) * 10);
                    console.log(-5 - Math.floor(j / 2) * 10)
                }

                obj2024[index].probj.translateZ(colNum);
                console.log("index is: " + index);
                index++;
            }

            colNum -= 8;
        }
    } else {
        for (let i = 0; i < Math.floor(obj2024.length / rowSize); i++) {
            console.log("outside");
            for (let j = 0; j < rowSize; j++) {
                console.log("inside");
                if (j % 2 == 0 && j != 0) {
                    obj2024[index].probj.translateX(10 + Math.floor((j-0.1) / 2) * 10);
                    console.log(10 + Math.floor(j / 2) * 10);
                } else if (j != 0) {
                    obj2024[index].probj.translateX(-10 - Math.floor(j / 2) * 10);
                    console.log(-10 - Math.floor(j / 2) * 10);
                }
                obj2024[index].probj.translateZ(colNum);
                
                index++;
            }

            colNum -= 8;
        }
    }
    //deal with 2024 remainders

    //copy and paste for 2023, 2022, etc. 
    


    gsap.fromTo(melon.probj.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
    gsap.fromTo(melon.probj.position, { y: 3 }, { y: -3, duration: 2, ease: "bounce.out" })
    gsap.fromTo(arcade.probj.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
    gsap.fromTo(arcade.probj.position, { y: 3 }, { y: -3, duration: 2, ease: "bounce.out" })
    gsap.fromTo(car.probj.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
    gsap.fromTo(car.probj.position, { y: 20 }, { y: -3, duration: 5, ease: "bounce.out" })
    gsap.fromTo(elaine.probj.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
    gsap.fromTo(elaine.probj.position, { y: 3 }, { y: -3, duration: 2, ease: "bounce.out" })
    loop()
}