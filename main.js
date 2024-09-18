import * as THREE from "three"
import "./style.css"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"
import {RGBELoader } from "three/addons/loaders/RGBELoader.js"
//init stuff

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

let view = 0;

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

//names 
const blogoN = "blogo"
const melonN = "melon"
const arcadeN = "arcade"
const carN = "car"
const elaineN = "elaine"

const carArr = [];
const arcadeArr = [];

let blogo;
loader.load(

    "./blogo.glb",
    function (glb) {
        blogo = glb.scene;
        blogo.layers.set(1)
        let i;
        for (i = 0; i < blogo.children.length; i++) {
            blogo.children[i].layers.set(1)
        }
        arcadeGroup.push(blogo)
        console.log("arcadeGroup length is: " + arcadeGroup.length)
        scene.add(blogo)
    }
)
let car;
loader.load(
    "./car.glb",
    function (glb) {
        car = glb.scene
        car.layers.set(0)
        let i;
        for (i = 0; i < car.children.length; i++) {
            car.children[i].layers.set(0)
            car.children[i].name = carN
            carArr.push(car.children[i])
        }
        console.log("carArr size is: " + carArr.length);
        car.translateZ(5)
        car.translateX(-15)
        scene.add(car)
        gsap.fromTo(car.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
        gsap.fromTo(car.position, { y: 20 }, { y: -3, duration: 5, ease: "bounce.out" })
    }
)

let melon;
loader.load(

    "./melon.glb",
    function (glb) {
        melon = glb.scene
        melon.children[0].name = melonN
        melon.children[0].layers.set(0)
        melon.translateZ(-5)
        melon.translateX(7)
        scene.add(melon)
        gsap.fromTo(melon.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
        gsap.fromTo(melon.position, { y: 3 }, { y: -3, duration: 2, ease: "bounce.out" })

    }
)



let arcade;
loader.load(
    "./arcade.glb",
    function (glb) {
        arcade = glb.scene
        arcade.layers.set(0)
        let i;
        for (i = 0; i < arcade.children.length; i++) {
            arcade.children[i].layers.set(0)
            arcade.children[i].name = arcadeN
            arcadeArr.push(arcade.children[i])
        }
        console.log("arcadeArr size is: " + arcadeArr.length);
        arcade.translateZ(5)
        arcade.translateX(15)
        scene.add(arcade)
        gsap.fromTo(arcade.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
        gsap.fromTo(arcade.position, { y: 3 }, { y: -3, duration: 2, ease: "bounce.out" })
    }
)



let elaine;
loader.load(

    "./elaine.glb",
    function (glb) {
        elaine = glb.scene

        elaine.children[0].material.wireframe = true
        elaine.children[0].name = elaineN
        elaine.children[0].layers.set(0)
        elaine.translateZ(-5)
        elaine.translateX(-7)
        scene.add(elaine)
        gsap.fromTo(elaine.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
        gsap.fromTo(elaine.position, { y: 3 }, { y: -3, duration: 2, ease: "bounce.out" })

    }
)

//const sphereGeometry = new THREE.SphereGeometry(3, 64, 64)
/*
const boxMaterial = new THREE.MeshStandardMaterial({
    color: "#00ff83"
})
*/
const boxGeo = new THREE.BoxGeometry(8, 8, 8)
boxGeo.translate(0, 4, 0)
const boxWireGeo = new THREE.EdgesGeometry(boxGeo)
const boxWireMat = new THREE.LineBasicMaterial({ color: 0xff3939 })
const boxWireframe = new THREE.LineSegments(boxWireGeo, boxWireMat)
//const boxWireframe = new THREE.Mesh(boxGeo, boxWireMat)

const meshPlane = new THREE.Mesh(planeGeo, planeMat)

boxWireframe.translateY(-30)
boxWireframe.layers.set(2)
scene.add(boxWireframe);


meshPlane.layers.set(2)
scene.add(meshPlane)
meshPlane.rotateX(-Math.PI / 2)
meshPlane.translateZ(-3)

//const meshSphere = new THREE.Mesh(sphereGeometry, boxMaterial)
//scene.add(meshSphere)

const mmuGroup = [carN, melonN, arcadeN, elaineN]
let carGroup = []
let arcadeGroup = []


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
    
    /*
    if (view == 0) {
        if (INTERSECTED && e.button == 0) {
            if (INTERSECTED.name == arcadeN) {
                changeView(1);
            } else if (INTERSECTED.name == carN) {
                changeView(2);
            }
        }
    }
    */
})
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        changeView(0);
        
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

function changeView(num) {
    view = num;
    let i, j, iCk
    switch (num) {
        case 0:
            for (i = 0; i < mmuGroup.length; i++) {
                console.log(scene.getObjectByName(mmuGroup[i]))
                scene.getObjectByName(mmuGroup[i]).layers.set(0)
            }
            for (i = 0; i < arcadeGroup.length; i++) {

                iCk = scene.getObjectsByProperty("name", arcadeGroup[i])

                for (j = 0; j < iCk.length; j++) {
                    iCk[j].layers.set(1)
                }

            }
            for (i = 0; i < carGroup.length; i++) {
                iCk = scene.getObjectsByProperty("name", carGroup[i])

                for (j = 0; j < iCk.length; j++) {
                    iCk[j].layers.set(1);
                }
            }

            for (i = 0; i < carArr.length; i++) {
                carArr[i].layers.set(0);
            }
            for (i = 0; i < arcadeArr.length; i++) {
                arcadeArr[i].layers.set(0);
            }


            controls.enableRotate = true;
            controls.enableZoom = false;
            //reset camera angle
            console.log(camera.position)
            camera.position.setX(0)
            camera.position.setY(0)
            camera.position.setZ(30)
            console.log(camera.position)

            const tl = gsap.timeline({ defaults: { duration: 2 } })

            tl.fromTo(".title", { opacity: 0 }, { opacity: 1, ease: "power2.in" })
            tl.fromTo(controls, { autoRotate: false }, { autoRotate: true, duration: 3 })
            tl.fromTo(controls, { autoRotateSpeed: 0 }, { autoRotateSpeed: 0.8, ease: "power2.in" })
            break;
        case 1:
            for (i = 0; i < mmuGroup.length; i++) {
                //console.log(scene.getObjectByName(mmuGroup[i]))
                scene.getObjectByName(mmuGroup[i]).layers.set(1)
            }
            for (i = 0; i < arcadeGroup.length; i++) {

                console.log(arcadeGroup[i])
                iCk = scene.getObjectsByProperty("name", arcadeGroup[i]);

                for (j = 0; j < iCk.length; j++) {
                    iCk[j].layers.set(2)
                }
            }
            for (i = 0; i < carGroup.length; i++) {
                iCk = scene.getObjectsByProperty("name", carGroup[i]);

                for (j = 0; j < iCk.length; j++) {
                    iCk[j].layers.set(1)
                }
            }

            for (i = 0; i < carArr.length; i++) {
                carArr[i].layers.set(1);
            }
            for (i = 0; i < arcadeArr.length; i++) {
                arcadeArr[i].layers.set(1);
            }

            document.getElementById("arcadeV").style.zIndex = 2

            controls.autoRotate = false
            controls.enableZoom = true;
            break;
        case 2:
            for (i = 0; i < mmuGroup.length; i++) {
                //console.log(scene.getObjectByName(mmuGroup[i]))
                scene.getObjectByName(mmuGroup[i]).layers.set(1)
            }
            for (i = 0; i < arcadeGroup.length; i++) {

                console.log(arcadeGroup[i])
                iCk = scene.getObjectsByProperty("name", arcadeGroup[i]);

                for (j = 0; j < iCk.length; j++) {
                    iCk[j].layers.set(1)
                }
            }
            for (i = 0; i < carGroup.length; i++) {
                iCk = scene.getObjectsByProperty("name", carGroup[i]);

                for (j = 0; j < iCk.length; j++) {
                    iCk[j].layers.set(2)
                }
            }

            for (i = 0; i < carArr.length; i++) {
                carArr[i].layers.set(1);
            }
            for (i = 0; i < arcadeArr.length; i++) {
                arcadeArr[i].layers.set(1);
            }

            controls.autoRotate = false
            controls.enableZoom = true;
            break;
        default:
            break;
    }
}

let INTERSECTED;
//main loop
const loop = () => {
    controls.update()
    

    

    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {

        
        if (INTERSECTED) {
            //console.log(INTERSECTED.parent.position)
            //console.log(INTERSECTED.position)
            //gsap.fromTo(boxWireframe.position, { y: 0 }, {y: -3, duration: 5})
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
loop()

document.getElementById("arcadeV").muted = true
document.getElementById("arcadeV").style.zIndex = 0

if (view == 0) {
    //anims
    const tl = gsap.timeline({ defaults: { duration: 2 } })

    //tl.fromTo(meshSphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
    //tl.fromTo("nav", { y: "-100%" }, { y: "0%" })
    tl.fromTo(".title", { opacity: 0 }, { opacity: 1, ease: "power2.in" })
    tl.fromTo(controls, { autoRotate: false }, { autoRotate: true, duration: 3 })
    tl.fromTo(controls, { autoRotateSpeed: 0 }, { autoRotateSpeed: 0.8, ease: "power2.in" })

//gsap.fromTo(meshBox.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
//gsap.fromTo(meshBox.position, { y: 3 }, { y: 0, duration: 2, ease: "bounce.out" })
}
