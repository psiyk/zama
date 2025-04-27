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

  MyProducts.forEach((product) => {
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
  }

  async function createProductCard(p) {
    async function fetchImage(imageUrl) {
      try {
        const response = await fetch(imageUrl);
        // if (!response.ok) {
        //   throw new Error(`Failed to fetch image: ${response.statusText}`);
        // }
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        return imageObjectURL;
      } catch (error) {
        // console.error("Error fetching image:", error);
        return "./images/failed.png"; // fallback
      }
    }

    const imageUrl = await fetchImage(p.image);
    const ratingGr = `${(p.ratings * 100) / 5}%`;
    // console.log(p.rating);
    return `
      <figure class="product-card">
        <div class="img-wrapper">
          <img src="${imageUrl}" alt="${p.name}" />
        </div>
        <figcaption>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="stars" style="--ratingGR: ${ratingGr};">
            <i class="fas far fa-star"></i><i class="fas far fa-star"></i>
            <i class="fas far fa-star"></i><i class="fas far fa-star"></i>
            <i class="fas far fa-star"></i>
          </div>
          <p class="price">$${p.price}</p>
          <div class="opt-btns">
            <button id="cartAdd">Add to Cart</button>
            <a href="#">View</a>
          </div>
        </figcaption>
      </figure>
    `;
  }
}

function p(e) {
  console.log(e);
}
function t(e) {
  console.table(e);
}

const catnav = document.querySelector(`nav.cat-btns`);
const header = document.querySelector(`header`);
const headerHeight = header.offsetHeight;

catnav.style.top = `${headerHeight}px`;
