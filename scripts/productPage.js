document.addEventListener("DOMContentLoaded", () => {

    /* CAROUSEL */
    const track = document.querySelector(".carousel-track");
    const slides = document.querySelectorAll(".carousel-slide");
    const leftArrow = document.querySelector(".carousel-arrow.left");
    const rightArrow = document.querySelector(".carousel-arrow.right");
    const acoesBox = document.getElementById("acoes-3d");
    const thumbs = document.querySelectorAll(".thumb");
    const bullets = document.querySelectorAll(".bullet");

    let index = 0;



function updateAcoes() {
    if (index === 0) {
        acoesBox.style.display = "block";
    } else {
        acoesBox.style.display = "none";
    }
}



    function updateCarousel() {
        track.style.transform = `translateX(-${index * 100}%)`;

        thumbs.forEach(t => t.classList.remove("active"));
        thumbs[index].classList.add("active");

        bullets.forEach(b => b.classList.remove("active"));
        bullets[index].classList.add("active");

            updateAcoes();
    }

    leftArrow.onclick = () => {
        index = (index - 1 + slides.length) % slides.length;
        updateCarousel();
    };

    rightArrow.onclick = () => {
        index = (index + 1) % slides.length;
        updateCarousel();
    };

    thumbs.forEach(t => {
        t.addEventListener("click", () => {
            index = Number(t.dataset.index);
            updateCarousel();
        });
    });

    bullets.forEach(b => {
        b.addEventListener("click", () => {
            index = Number(b.dataset.index);
            updateCarousel();
        });
    });


    document.querySelectorAll('.config-header').forEach(header => {
  header.addEventListener('click', (e) => {
    e.stopPropagation(); // segurança extra

    const item = header.closest('.config-item');
    if (!item) return;

    item.classList.toggle('open');
  });
});


document.addEventListener('click', (e) => {
  const btn = e.target.closest('.material-tile');
  if (!btn) return;

  e.stopPropagation();

  const grupo = btn.closest('.config-content');
  if (!grupo) return;

  grupo
    .querySelectorAll('.material-tile')
    .forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

  const value = Number(btn.value);
  const textura = btn.dataset.texture || null;

  console.log('Selecionado:', { value, textura });
});





    /* CART */
    const cartBtn = document.querySelector(".add-cart");

    cartBtn.addEventListener("click", () => {
        cartBtn.textContent = "Adicionado ✔";
        cartBtn.style.background = "#2ecc71";

        setTimeout(() => {
            cartBtn.style.background = "#111";
            cartBtn.textContent = "Juntar ao Carrinho";
        }, 1500);
    });
});
