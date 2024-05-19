import * as THREE from "three"
import { FlyControls } from "three/examples/jsm/Addons.js"
import triangles from "./json/triangles.json"

function main() {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  const fov = 75
  const aspect = window.innerWidth / window.innerHeight // the canvas default
  const near = 0.1
  const far = 5000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 1000
  camera.position.x = 0
  camera.position.y = -1000

  camera.lookAt(0, 0, 300)

  const controls = new FlyControls(camera, renderer.domElement)

  controls.rollSpeed = 0.005
  controls.movementSpeed = 5
  controls.dragToLook = true

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

  for (let triangle of triangles) {
    const positions = [
      ...triangle.vertices[0].position,
      ...triangle.vertices[1].position,
      ...triangle.vertices[2].position,
    ]

    const normals = [
      ...triangle.vertices[0].norm,
      ...triangle.vertices[1].norm,
      ...triangle.vertices[2].norm,
    ]

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
    // you don't have to manually set the indices if positions of all vertices is provided
    // geometry.setIndex([2, 0, 1, 2, 1, 3])

    const material = new THREE.MeshBasicMaterial({
      color: 0x8888ff,
    })

    const face = new THREE.Mesh(geometry, material)

    scene.add(face)
  }

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
    controls.update(1)

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
