const catnav = document.querySelector("nav.cat-btns");
const header = document.querySelector("header");
const cartSection = document.querySelector("section.cart");
const cartContainer = document.querySelector("ul.cart-section");
const cartBtn = document.querySelectorAll(".cartBtn");
const productWrapper = document.querySelector(".product-grid.product-section");

const headerHeight = header.offsetHeight;
catnav.style.top = `${headerHeight}px`;

// Cart array to hold products
let cart = [];

async function loadProducts() {
  try {
    const response = await fetch("./json-files/products.json");
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Failed to load product file:", error);
  }
}

async function displayProducts(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  const ProductsObject = {};

  categories.forEach((cat) => {
    ProductsObject[cat] = products.filter((p) => p.category === cat);
  });

  for (const category in ProductsObject) {
    for (const product of ProductsObject[category]) {
      const productHTML = await createProductCard(product);
      productWrapper.insertAdjacentHTML("beforeend", productHTML);
    }
  }

  bindAddToCartButtons(products);
  bindViewButtons(products);
}
function bindViewButtons(products) {
  const viewBtns = document.querySelectorAll(".viewProductBtn");

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const product = products.find((p) => p.id == id);
      if (product) openProductModal(product);
    });
  });
}

async function createProductCard(p) {
  const imageUrl = await fetchImage(p.image);
  const ratingGr = `${(p.ratings * 100) / 5}%`;

  return `
    <figure class="product-card" data-id="${p.id}">
      <div class="img-wrapper">
        <img src="${imageUrl}" alt="${p.name}" />
      </div>
      <figcaption>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="user-ratings">
          <div class="stars" style="--ratingGR: ${ratingGr};">

           <i class="fas far fa-star"></i><i class="fas far fa-star"></i>
            <i class="fas far fa-star"></i><i class="fas far fa-star"></i>
            <i class="fas far fa-star"></i>
          </div>
          <p class="rating">${p.ratings} rating</p>
        </div>
        <p class="price">$${p.price}</p>
        <p class="amount">Amount left: ${p.stock}</p>
        <div class="opt-btns">
          <button class="cartAdd">Add to Cart</button>
          <button class="viewProductBtn" data-id="${p.id}">View</button>
        </div>
      </figcaption>
    </figure>
  `;
}

async function fetchImage(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Image not found");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return "./images/failed.png"; // fallback image
  }
}

function bindAddToCartButtons(allProducts) {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    const id = card.dataset.id;
    const product = allProducts.find((p) => p.id == id);
    const addBtn = card.querySelector(".cartAdd");

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addToCart(product);
      });
    }
  });
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function renderCart() {
  cartContainer.innerHTML = ""; // clear cart before rendering
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <li class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Start shopping now!</p>
      </li>
    `;
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <div class="item-img">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="details">
          <h4 class="name">${item.name}</h4>
          <p class="price">Price: $${item.price}</p>
          <p class="amount"><span>
      <i class="fas fa-shopping-bag"></i>
        </span> ${item.quantity}
        <button class="remove-item" data-id="${item.id}" id="removeBtn">Remove</button>
        </p>
      </div>
    `;

      cartContainer.appendChild(cartItem);
    });
  }

  // Bind remove buttons
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      cart = cart.filter((item) => item.id != id);
      renderCart();
    });
  });
}

// Cart toggle UI
cartBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleNav(cartSection);
    document.body.classList.toggle(
      "blurred",
      cartSection.classList.contains("active")
    );
  });
});

function toggleNav(element) {
  element.classList.toggle("active");
}
function openProductModal(product) {
  const modal = document.getElementById("productModal");
  const modalDetails = modal.querySelector(".modal-details");

  // ✅ Set image
  modalDetails.querySelector(".modal-img img").src =
    product.image || "./images/failed.png";
  modalDetails.querySelector(".modal-img img").alt = product.name;

  // ✅ Set name, price, description, stock, rating
  modalDetails.querySelector("h3").textContent = product.name;
  modalDetails.querySelector("#modalPrice").textContent = product.price;
  modalDetails.querySelector("#modalStock").textContent = product.stock;
  modalDetails.querySelector(".description").textContent = product.description;
  modalDetails.querySelector(".ratings p span").textContent = product.ratings;

  // ✅ Set tags
  const tagContainer = modalDetails.querySelector(".tags");
  tagContainer.innerHTML = product.tags.map((tag) => `<p>${tag}</p>`).join("");

  // ✅ Set reviews
  const reviewList = modalDetails.querySelector(".reviews");
  if (Array.isArray(product.reviews) && product.reviews.length > 0) {
    reviewList.innerHTML = product.reviews
      .map(
        (review) => `
      <li>
        <div class="reviewer">
          <img src="images/failed.png" alt="Reviewer" />
          <p>${review.user}</p>
        </div>
        <p class="review-text">${review.comment}</p>
        <div class="ratings">
          <p>Rating: ${review.rating} / 5</p>
        </div>
      </li>
    `
      )
      .join("");
  } else {
    reviewList.innerHTML = `<li><p>No reviews available for this product.</p></li>`;
  }

  // ✅ Show modal
  modal.classList.remove("hidden");
  modal.style.display = "block";
}

document.getElementById("modalClose").addEventListener("click", () => {
  const modal = document.getElementById("productModal");
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  const modal = document.getElementById("productModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
// Start the program
loadProducts();
