// Ilova mantiqi: joylashtirish, tanlash, burish, o‘lcham, o‘chirish, interfeys.
(() => {
  const scene = document.querySelector('a-scene');
  const $ = s => document.querySelector(s);
  const items = window.FURNITURE;
  const MAX = 12, SMIN = 0.4, SMAX = 2.5;
  let current = 0, selected = null, lastGesture = 0;

  const placed = () => [...document.querySelectorAll('.placed')];
  const status = t => { $('#status').textContent = t; };

  // Model tanlash tugmalari
  const bar = $('#models');
  items.forEach((it, i) => {
    const b = document.createElement('button');
    b.textContent = it.name;
    b.onclick = () => { current = i; paint(); };
    bar.appendChild(b);
  });
  const paint = () => [...bar.children].forEach((b, i) => b.classList.toggle('on', i === current));
  paint();

  // Interfeys ustiga teginish obyekt joylashtirmasin
  $('#ui').addEventListener('beforexrselect', e => e.preventDefault());

  function choose(el) {
    selected = el;
    placed().forEach(p => { p.ring.object3D.visible = p === el; });
    if (el) status('Tanlangan: ' + el.label + ' (' + (placed().indexOf(el) + 1) + '/' + placed().length + ')');
  }

  function addItem(it, pos) {
    const root = document.createElement('a-entity');
    root.classList.add('placed');
    root.setAttribute('position', pos.x + ' ' + pos.y + ' ' + pos.z);
    const holder = document.createElement('a-entity');
    const ring = document.createElement('a-ring');
    ring.setAttribute('radius-inner', '0.5');
    ring.setAttribute('radius-outer', '0.55');
    ring.setAttribute('rotation', '-90 0 0');
    ring.setAttribute('position', '0 0.005 0');
    ring.setAttribute('material', 'color:#e0a040;shader:flat;side:double');
    const m = document.createElement('a-entity');
    m.setAttribute('gltf-model', it.glb);
    m.setAttribute('scale', (it.scale || 1) + ' ' + (it.scale || 1) + ' ' + (it.scale || 1));
    m.addEventListener('model-error', () => { m.remove(); it.build(holder); });
    holder.append(m, ring);
    root.appendChild(holder);
    root.holder = holder;
    root.ring = ring;
    root.label = it.name;
    scene.appendChild(root);
    choose(root);
  }

  scene.addEventListener('ar-place', e => {
    if (Date.now() - lastGesture < 400) return;
    if (placed().length >= MAX) { status('Obyektlar soni chegarasi: ' + MAX); return; }
    addItem(items[current], e.detail.position);
  });
  scene.addEventListener('ar-surface', e => {
    if (!selected) status(e.detail.found ? 'Tekislik topildi. Joylashtirish uchun teging' : 'Tekislik qidirilmoqda…');
  });
  scene.addEventListener('ar-error', e => status('Hit-test xatosi: ' + e.detail.message));
  scene.addEventListener('light-mode', e => {
    $('#info').textContent = e.detail.mode === 'estimation'
      ? 'Yoritish: light-estimation'
      : 'Yoritish: muqobil (ambient + directional)';
  });

  // Tugmalar
  $('#next').onclick = () => {
    const list = placed();
    if (list.length) choose(list[(list.indexOf(selected) + 1) % list.length]);
  };
  $('#del').onclick = () => {
    if (!selected) return;
    selected.remove();
    const list = placed().filter(p => p !== selected);
    selected = null;
    if (list.length) choose(list[list.length - 1]); else status('Obyekt yo‘q. Joylashtirish uchun teging');
  };
  $('#clear').onclick = () => { placed().forEach(p => p.remove()); selected = null; status('Sahna tozalandi'); };
  $('#exit').onclick = () => scene.exitVR();

  // Burish (bir barmoq) va o‘lcham (ikki barmoq)
  const ov = $('#overlay');
  const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  let sx = 0, moved = false, d0 = 1, s0 = 1;
  ov.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      lastGesture = Date.now();
      d0 = dist(e.touches);
      s0 = selected ? selected.holder.object3D.scale.x : 1;
    } else {
      sx = e.touches[0].clientX;
      moved = false;
    }
  });
  ov.addEventListener('touchmove', e => {
    if (!selected) return;
    if (e.touches.length === 2) {
      lastGesture = Date.now();
      const s = Math.min(Math.max(s0 * dist(e.touches) / d0, SMIN), SMAX);
      selected.holder.object3D.scale.setScalar(s);
    } else {
      const x = e.touches[0].clientX, dx = x - sx;
      if (moved || Math.abs(dx) > 4) {
        moved = true;
        lastGesture = Date.now();
        selected.holder.object3D.rotation.y += dx * 0.012;
        sx = x;
      }
    }
  });

  // AR sessiyasi
  const msg = $('#msg'), start = $('#start');
  scene.addEventListener('enter-vr', () => { if (scene.is('ar-mode')) document.body.classList.add('ar'); });
  scene.addEventListener('exit-vr', () => document.body.classList.remove('ar'));
  start.onclick = async () => {
    msg.textContent = '';
    try { await scene.enterAR(); } catch (err) { msg.textContent = 'AR ochilmadi: ' + err.message; }
  };
  if (!navigator.xr) {
    msg.textContent = 'Brauzer WebXR ni qo‘llamaydi. Android’da Chrome va HTTPS havola kerak.';
    start.disabled = true;
  } else {
    navigator.xr.isSessionSupported('immersive-ar').then(ok => {
      if (!ok) {
        msg.textContent = 'Bu qurilmada AR qo‘llab-quvvatlanmaydi. Chrome va Google Play Services for AR kerak.';
        start.disabled = true;
      }
    });
  }
})();
