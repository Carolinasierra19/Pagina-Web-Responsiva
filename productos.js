const baseURL = 'https://665e41751e9017dc16ef75e0.mockapi.io/products';

// Función para obtener y mostrar productos
async function getProducts() {
    try {
        const response = await axios.get(baseURL);
        const products = response.data;
        renderProducts(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

// Función para renderizar productos
function renderProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
                        <p class="card-text"><strong>Categoría:</strong> ${product.category}</p>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

// Llamar a la función para obtener productos al cargar la página
document.addEventListener('DOMContentLoaded', getProducts);
