// Mobile Menu
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.querySelector(".hamburger-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  const hamburgerLine = document.querySelectorAll(".hamburger-line");

  hamburgerButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    hamburgerLine.forEach((line) => line.classList.toggle("disabled"));
  });
});
