function toggleMenu() {
  if (document.getElementById("sideMenuId").style.marginLeft == "-43%") {
    document.getElementById("sideMenuId").style.marginLeft = "0%";
    document.getElementById("modalId").style.display = "block";
  } else {
    document.getElementById("sideMenuId").style.marginLeft = "-43%";
    document.getElementById("modalId").style.display = "none";
  }
}

// const backdrop = document.querySelector(".backdrop");
// const sideDrawer = document.querySelector(".mobile-nav");
// const menuToggle = document.querySelector("#side-menu-toggle");

// function backdropClickHandler() {
//   backdrop.style.display = "none";
//   sideDrawer.classList.remove("open");
// }

// function menuToggleClickHandler() {
//   backdrop.style.display = "block";
//   sideDrawer.classList.add("open");
// }

// backdrop.addEventListener("click", backdropClickHandler);
// menuToggle.addEventListener("click", menuToggleClickHandler);
