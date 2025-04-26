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

// Shortening Links
document.getElementById("shortenedBtn").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value;
  console.log(url);
  const linksContainer = document.getElementById("shortened-links");

  try {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = "https://cleanuri.com/api/v1/shorten";
    const response = await fetch(proxyUrl + apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "http://localhost",
      },
      body: `url=${encodeURIComponent(url)}`,
    });

    const data = await response.json();

    if (data.result_url) {
      const linkItem = document.createElement("div");
      linkItem.className = "link-item";
      linkItem.innerHTML = `
      <div class="link-text">
      <p>${url}</p>
      <a href="${data.result_url}" target="_blank">${data.result_url}</a>
      <button class="copy-btn">Copy</button>
        </div>
      `;

      linksContainer.prepend(linkItem);

      saveLink(url, data.result_url);

      const copyBtn = linkItem.querySelector(".copy-btn");

      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(data.result_url);
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("copied");
        }, 2000);
      });
    } else {
      alert("Failed to shorten URL.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred.");
  }
});

// Load Links When DOM is refreshed
document.addEventListener("DOMContentLoaded", () => {
  loadLinks();
});

function saveLink(originalUrl, shortUrl) {
  const storedLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];

  storedLinks.push({ originalUrl, shortUrl });

  localStorage.setItem("shortLinks", JSON.stringify(storedLinks));

  // Set a timer to remove after 20 seconds
  setTimeout(() => {
    removeLink(shortUrl);
  }, 20000); // 20000 ms = 20 seconds
}

function loadLinks() {
  const storedLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];

  storedLinks.forEach((link) => {
    displayLink(link.originalUrl, link.shortUrl);
  });
}

function displayLink(original, shortened) {
  const linksContainer = document.getElementById("shortened-links"); // change to your div id
  const linkItem = document.createElement("div");
  linkItem.className = "link-item";
  linkItem.innerHTML = `
      <div class="link-text">
      <p>${original}</p>
      <a href="${shortened}" target="_blank">${shortened}</a>
      <button class="copy-btn">Copy</button>
        </div>
      `;
  linksContainer.appendChild(linkItem);

  const copyBtn = linkItem.querySelector(".copy-btn");

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(shortened);
    copyBtn.textContent = "Copied!";
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyBtn.textContent = "Copy";
      copyBtn.classList.remove("copied");
    }, 2000);
  });
}

function removeLink(shortUrl) {
  let storedLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];

  storedLinks = storedLinks.filter((link) => link.shortUrl !== shortUrl);

  localStorage.setItem("shortLinks", JSON.stringify(storedLinks));

  // Optional: also remove it visually from page
  removeLinkFromDOM(shortUrl);
}

function removeLinkFromDOM(shortUrl) {
  const linkElements = document.querySelectorAll(".link-item"); // assuming you give each link a class
  linkElements.forEach((link) => {
    if (link.querySelector("a")?.href === shortUrl) {
      link.remove();
    }
  });
}
