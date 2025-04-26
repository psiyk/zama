async function loadProducts() {
  try {
    const response = await fetch("./json-files/emarket_products.json");
    const data = await response.json();
    const MyProducts = data;
    console.table(MyProducts);

    //

    //
  } catch (error) {
    console.error("File MISSNG");
  }
}

loadProducts();
