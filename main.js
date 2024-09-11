import * as THREE from "three"
import "./style.css"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"
import { HDRCubeTextureLoader } from 'three/addons/loaders/HDRCubeTextureLoader.js';
import { RGBMLoader } from 'three/addons/loaders/RGBMLoader.js';

//init stuff

const scene = new THREE.Scene()

//geo

const planeGeo = new THREE.PlaneGeometry(9999, 9999);
const planeMat = new THREE.MeshStandardMaterial({
    color: "#ff3939",
    roughness: 0.7
})

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

let allLoaded = 0

let blogo;

loader.load(

    "./blogo.glb",
    function (glb) {
        blogo = glb.scene
        blogo.translateZ(-5)
        scene.add(blogo)
        gsap.fromTo(blogo.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
        gsap.fromTo(blogo.position, { y: 3 }, { y: -3, duration: 2, ease: "bounce.out" })

        allLoaded++
    }
)

const sphereGeometry = new THREE.SphereGeometry(3, 64, 64)
const boxMaterial = new THREE.MeshStandardMaterial({
    color: "#00ff83"
})

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

const meshSphere = new THREE.Mesh(sphereGeometry, boxMaterial)
//scene.add(meshSphere)

const light = new THREE.PointLight(0xffffff, 1000, 1000)
light.position.set(0, 10, 10)
scene.add(light)

//render

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height)
camera.layers.enable(2)
camera.position.z = 30
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
raycaster.layers.disable(2)
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
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))
window.addEventListener("mousemove", (e) => {


    if (mouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150,
        ]
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(meshSphere.material.color, { r: newColor.r, g: newColor.g, b: newColor.b })
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
            //console.log(INTERSECTED.parent.position)

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


//anims
const tl = gsap.timeline({ defaults: { duration: 2 } })

//tl.fromTo(meshSphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
//tl.fromTo("nav", { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", { opacity: 0 }, { opacity: 1, ease: "power2.in" })
tl.fromTo(controls, { autoRotate: false }, { autoRotate: true, duration: 3 })
tl.fromTo(controls, { autoRotateSpeed: 0 }, { autoRotateSpeed: 0.8, ease: "power2.in" })

//gsap.fromTo(meshBox.rotation, { y: 0 }, { y: Math.PI * 2 + 0.2, duration: 3, ease: "power1.out" })
//gsap.fromTo(meshBox.position, { y: 3 }, { y: 0, duration: 2, ease: "bounce.out" })
