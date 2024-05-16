import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import GUI from "lil-gui"
import { MinMaxGUIHelper } from "./helper"
import vertices from "./json/vertices.json"

function main() {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  const fov = 75
  const aspect = window.innerWidth / window.innerHeight // the canvas default
  const near = 0.1
  const far = 2000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 500
  camera.position.x = 500
  camera.position.y = 500

  camera.lookAt(0, 0, 0)

  function updateCamera() {
    camera.updateProjectionMatrix()
  }

  const gui = new GUI()
  gui.add(camera, "fov", 1, 180).onChange(updateCamera)
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1)
  gui
    .add(minMaxGUIHelper, "min", 0.1, 1, 0.1)
    .name("near")
    .onChange(updateCamera)
  gui
    .add(minMaxGUIHelper, "max", 0.1, 1000, 0.1)
    .name("far")
    .onChange(updateCamera)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 5, 0)
  controls.update()

  const scene = new THREE.Scene()

  {
    const color = 0xffffff
    const intensity = 5
    const light = new THREE.DirectionalLight(color, intensity)

    light.position.set(100, 100, 500)
    light.target.position.set(0, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }

  {
    const color = 0xffffff
    const intensity = 0.5
    const light = new THREE.AmbientLight(color, intensity)
    scene.add(light)
  }

  const positions = []
  const normals = []

  for (const vertex of vertices) {
    positions.push(...vertex.position)
    normals.push(...vertex.norm)
  }

  const geometry = new THREE.BufferGeometry()
  const positionNumComponents = 3
  const normalNumComponents = 3

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array(positions),
      positionNumComponents
    )
  )
  geometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
  )

  // the order of all sets of indices must follow the right-hand rule
  // the normal attribute has nothing to do with face direction
  // geometry.setIndex([2, 0, 1, 2, 1, 3])

  const material = new THREE.MeshPhongMaterial({
    color: 0x8888ff,
  })

  const kzmap = new THREE.Mesh(geometry, material)

  scene.add(kzmap)

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }

    return needResize
  }

  function render(time: number) {
    time *= 0.001

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    // const speed = 1
    // const rot = time * speed
    // kzmap.rotation.x = rot
    // kzmap.rotation.y = rot
    // kzmap.rotation.z = rot

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

main()
