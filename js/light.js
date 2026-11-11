// Yoritishga moslash: light-estimation bo‘lsa undan foydalanadi, bo‘lmasa a-light (ambient + directional) qoladi.
AFRAME.registerComponent('light-adapt', {
  init() {
    const scene = this.el;
    this.probe = null;
    this.active = false;
    scene.addEventListener('enter-vr', async () => {
      if (!scene.is('ar-mode')) return;
      this.active = false;
      scene.emit('light-mode', { mode: 'alt' });
      try {
        this.probe = await scene.renderer.xr.getSession().requestLightProbe();
      } catch (e) {
        this.probe = null;
      }
    });
    scene.addEventListener('exit-vr', () => { this.probe = null; });
  },

  tick() {
    if (!this.probe) return;
    const scene = this.el;
    const frame = scene.frame;
    const est = frame && frame.getLightEstimate(this.probe);
    if (!est) return;
    const sun = document.querySelector('#sun').getObject3D('light');
    const amb = document.querySelector('#amb').getObject3D('light');
    if (!sun || !amb) return;
    const i = est.primaryLightIntensity;
    const m = Math.max(i.x, i.y, i.z, 0.001);
    const k = Math.min(Math.max(m, 0.2), 1.5);
    sun.intensity = k;
    amb.intensity = Math.min(0.3 + 0.3 * k, 1);
    sun.color.setRGB(i.x / m, i.y / m, i.z / m);
    const d = est.primaryLightDirection;
    sun.parent.position.set(d.x * 5, d.y * 5, d.z * 5);
    if (!this.active) {
      this.active = true;
      scene.emit('light-mode', { mode: 'estimation' });
    }
  }
});
