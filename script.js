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
      let catProducts = [];
      MyProducts.forEach((product) => {
        if (product.category == cat) {
          catProducts.push(product);
        }
      });
      ProductsObject[cat] = [catProducts];
    });
    return ProductsObject;
  }
  t(ProductsObject);
}

function p(e) {
  console.log(e);
}
function t(e) {
  console.table(e);
}
