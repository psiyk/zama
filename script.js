async function loadProducts() {
  try {
    const response = await fetch("json-files/products.json");
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

function work(MyProducts) {
  productList = [];
  productCat = [];
  MyProducts.forEach((product) => {
    productList.push(product);
    if (!productCat.includes(product.category)) {
      productCat.push(product, categories);
    }
  });
  p(productCat);
}

function p(e) {
  console.log(e);
}
