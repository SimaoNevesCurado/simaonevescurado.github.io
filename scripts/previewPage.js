document.addEventListener("DOMContentLoaded", () => {

  const menu = document.querySelector('.config-menu');
  const toggleBtn = document.getElementById('toggleConfigMenu');

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('collapsed');
  });

  menu.addEventListener('click', (e) => {
    const tile = e.target.closest('.material-tile');
    if (!tile) return;

    const section = tile.closest('.config-item');
    if (!section) return;

    section.querySelectorAll('.material-tile.active')
      .forEach(t => t.classList.remove('active'));

    tile.classList.add('active');

    const value = tile.value;
    const texture = tile.dataset.texture;
    const part = tile.dataset.part;

    console.log('Material selecionado:', {
      part,
      value,
      texture
    });

    document.dispatchEvent(new CustomEvent('material-change', {
      detail: {
        part,
        value,
        texture
      }
    }));
  });

});
