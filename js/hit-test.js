// WebXR hit-test komponenti: tekislikni topadi, reticle ni qo‘yadi va teginishda "ar-place" hodisasini yuboradi.
const THREE = AFRAME.THREE;

AFRAME.registerComponent('hit-test', {
  init() {
    const scene = this.el.sceneEl;
    this.src = null;
    this.found = false;
    this.pos = new THREE.Vector3();
    this.quat = new THREE.Quaternion();
    this.scl = new THREE.Vector3();
    this.mat = new THREE.Matrix4();
    scene.addEventListener('enter-vr', () => { if (scene.is('ar-mode')) this.start(); });
    scene.addEventListener('exit-vr', () => { this.src = null; this.found = false; this.el.object3D.visible = false; });
  },

  async start() {
    const scene = this.el.sceneEl;
    const session = scene.renderer.xr.getSession();
    try {
      const viewer = await session.requestReferenceSpace('viewer');
      this.src = await session.requestHitTestSource({ space: viewer });
    } catch (err) {
      scene.emit('ar-error', { message: err.message });
      return;
    }
    session.addEventListener('select', () => {
      if (this.found) scene.emit('ar-place', { position: this.pos.clone() });
    });
  },

  tick() {
    if (!this.src) return;
    const scene = this.el.sceneEl;
    const frame = scene.frame;
    const ref = scene.renderer.xr.getReferenceSpace();
    if (!frame || !ref) return;
    const hits = frame.getHitTestResults(this.src);
    const found = hits.length > 0;
    const obj = this.el.object3D;
    if (found) {
      const pose = hits[0].getPose(ref);
      if (pose) {
        this.mat.fromArray(pose.transform.matrix);
        this.mat.decompose(this.pos, this.quat, this.scl);
        obj.position.copy(this.pos);
        obj.quaternion.copy(this.quat);
      }
    }
    obj.visible = found;
    if (found !== this.found) {
      this.found = found;
      scene.emit('ar-surface', { found });
    }
  }
});
