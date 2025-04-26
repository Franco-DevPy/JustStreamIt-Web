document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector(".modal-hero");
  const btnRead = document.getElementById("hero-detail-btn");
  const btnClose = document.querySelector(".btn-close");
  let isAnimating = false;

  btnRead.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;
    modal.classList.remove("modal-hero-closed");
    modal.classList.add("modal-hero-open");
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  });

  btnClose.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;
    modal.classList.remove("modal-hero-open");
    modal.classList.add("modal-hero-closed");
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  });

  setTimeout(() => {
    document.body.classList.remove("no-scroll");
    document.getElementById("loadingWeb").style.transform = "translateY(-100%)";
  }, 3000);
});
