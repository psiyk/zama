const catnav = document.querySelector(`nav.cat-btns`);
const header = document.querySelector(`header`);
const headerHeight = header.offsetHeight;
const cartBtn = document.querySelectorAll(".cartBtn");
const productItem = document.querySelector(".product-grid .product-card");
const cartSection = document.querySelector("section.cart");

async function loadProducts() {
  try {
    const response = await fetch("./json-files/products.json");
    const data = await response.json();
    const MyProducts = data;
    // console.log(MyProducts[0]);

    //
    work(MyProducts);
    //
  } catch (error) {
    console.error("File MISSNG");
  }
}

loadProducts();
const productWrapper = document.querySelector(`.product-grid.product-section`);
function work(MyProducts) {
  const productList = [];
  const productCat = [];

  MyProducts.forEach((product, index) => {
    productList.push(product);
    if (!productCat.includes(product.category)) {
      productCat.push(product.category);
    }
  });

  const ProductsObject = classify();

  function classify() {
    const ProductsObject = {};
    productCat.forEach((cat) => {
      const catProducts = MyProducts.filter(
        (product) => product.category === cat
      );
      ProductsObject[cat] = catProducts;
    });
    return ProductsObject;
  }

  displayProducts();

  async function displayProducts() {
    for (const category in ProductsObject) {
      for (const p of ProductsObject[category]) {
        const productHTML = await createProductCard(p);
        productWrapper.innerHTML += productHTML;
      }
    }
    cardSettings(); // Call after rendering
  }
  async function cartItem(p) {
    const cartItem = document.createElement("ul");
    const x_amount = 0;
    cartItem.classList.add("item");
    cartItem.innerHTML = `
       <li class="item">
          <div class="item-img">
                 <img src="${p.image}" alt="${p.name}" />
          </div>
          <div class="details">
            <h4 class="name">${p.name}</h4>
            <p>$<span class="price">$${p.price}</span></p>
            <p class="amount">
              <button
                type="button"
                id="addAmountBtn"
                title="Decrease the amount"
              >
                <i class="fas fas fas fa-minus"></i>
              </button>
              ${x_amount}
              <button
                type="button"
                id="minusAmountBtn"
                title="Increase the amount"
              >
                <i class="fas fas fa-plus"></i>
              </button>
              <button type="button" id="removeBtn">Remove</button>
            </p>
          </div>
        </li>
    `;
    return cartItem;
  }
  async function createProductCard(p) {
    async function fetchImage(imageUrl) {
      try {
        const response = await fetch(imageUrl);
        if (!response) {
          return "./images/failed.png"; // fallback
        } else {
          const blob = await response.blob();
          const imageObjectURL = URL.createObjectURL(blob);
          return imageObjectURL;
        }
      } catch (error) {
        console.log("error");
        return "./images/failed.png"; // fallback
      }
    }

    const imageUrl = await fetchImage(p.image);
    const ratingGr = `${(p.ratings * 100) / 5}%`;

    const boughtAmount = 0;
    // console.log(p.rating);
    return `
      <figure class="product-card">
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
            <p class ="rating">${p.ratings} rating</p>
            </div>
            <p class="price">$${p.price}</p>
            <p class="amount">Amount left: ${p.stock}</p>
          <div class="opt-btns">
            <button id="cartAdd">Add to Cart</button>
            <a href="#">View</a>
          </div>
        </figcaption>
      </figure>
    `;
  }

  function cardSettings() {
    try {
      const p_cards = document.querySelectorAll(".product-card");
      p_cards.forEach((card, index) => {
        const addToCartBtn = card.querySelector("#cartAdd");
        if (addToCartBtn) {
          // console.log(addToCartBtn);
          addToCartBtn.addEventListener("click", {});
        } else {
          console.warn("Add to Cart button not found in card:", card);
        }
      });
    } catch (error) {
      console.log("Error in cardSettings:", error);
    }
  }
  async function recieveproducts() {
    let products = await fetch("./json-files/products.json");
    products = await products.json();
    console.log(products[0]);

    let prodproducts = document.querySelectorAll(".product-card");
    let cartSection = document.querySelector(``);

    prodproducts.forEach((product, index) => {
      const addToCartBtn = product.querySelector("#cartAdd");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
          const cartItem = cartItem(products[index]);
          cartSection.appendChild(cartItem);
          console.log(cartItem);
        });
      } else {
        console.warn("Add to Cart button not found in card:", product);
      }
    });
  }
  recieveproducts();
}

function p(e) {
  console.log(e);
}
function t(e) {
  console.table(e);
}

catnav.style.top = `${headerHeight}px`;

function toggleNav(e) {
  e.classList.toggle("active");
}
cartBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleNav(cartSection);
    document.body.classList.toggle(
      "blurred",
      cartSection.classList.contains("active")
    );
  });
});
