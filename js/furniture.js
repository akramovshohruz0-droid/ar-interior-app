// Mebel ro‘yxati. Har biri uchun GLB fayl yo‘li beriladi; fayl topilmasa, quyidagi oddiy shakllardan yig‘ilgan model ishlatiladi.
function box(parent, w, h, d, x, y, z, color) {
  const e = document.createElement('a-box');
  e.setAttribute('width', w);
  e.setAttribute('height', h);
  e.setAttribute('depth', d);
  e.setAttribute('position', x + ' ' + y + ' ' + z);
  e.setAttribute('color', color);
  parent.appendChild(e);
}

window.FURNITURE = [
  {
    name: 'Stol', glb: 'assets/models/stol.glb', scale: 1,
    build(p) {
      box(p, 1.2, 0.05, 0.7, 0, 0.725, 0, '#9a6a3a');
      [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]].forEach(([x, z]) => box(p, 0.06, 0.7, 0.06, x, 0.35, z, '#6b4423'));
    }
  },
  {
    name: 'Kreslo', glb: 'assets/models/kreslo.glb', scale: 1,
    build(p) {
      box(p, 0.55, 0.12, 0.55, 0, 0.45, 0, '#3b6ea5');
      box(p, 0.55, 0.5, 0.1, 0, 0.76, -0.225, '#31598a');
      [[-0.23, -0.23], [0.23, -0.23], [-0.23, 0.23], [0.23, 0.23]].forEach(([x, z]) => box(p, 0.05, 0.39, 0.05, x, 0.195, z, '#2a2f3a'));
    }
  },
  {
    name: 'Shkaf', glb: 'assets/models/shkaf.glb', scale: 1,
    build(p) {
      box(p, 0.9, 1.8, 0.45, 0, 0.9, 0, '#d8cdb8');
      box(p, 0.012, 1.7, 0.01, 0, 0.9, 0.228, '#8a7f6a');
      box(p, 0.03, 0.2, 0.03, -0.05, 0.9, 0.24, '#8a7f6a');
      box(p, 0.03, 0.2, 0.03, 0.05, 0.9, 0.24, '#8a7f6a');
    }
  }
];
