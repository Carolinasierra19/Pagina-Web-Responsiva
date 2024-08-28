const baseURL = 'https://665e41751e9017dc16ef75e0.mockapi.io/products';

let isUpdating = false;
let currentProductId = null;
let products = [];

// Función para obtener y renderizar productos
async function getProducts() {
    try {
        const response = await axios.get(baseURL);
        products = response.data;
        renderProducts(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        Swal.fire('Error', 'No se pudieron obtener los productos', 'error');
    }
}

// Función para renderizar productos en la tabla
function renderProducts(products) {
    const productTableBody = document.getElementById('productTableBody');
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    productTableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar
    products.filter(product => 
        product.id.toString().includes(searchInput) ||
        product.name.toLowerCase().includes(searchInput) ||
        product.description.toLowerCase().includes(searchInput) ||
        product.price.toString().includes(searchInput) ||
        product.category.toLowerCase().includes(searchInput) ||
        transformTimestampToDate(new Date(product.createdAt).getTime()).includes(searchInput)
    ).forEach(product => {
        const row = `<tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.price}</td>
                        <td>${product.category}</td>
                        <td>${transformTimestampToDate(new Date(product.createdAt).getTime())}</td>
                        <td><img src="${product.image}" alt="${product.name}" class="img-thumbnail" width="50"></td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})"><i class="fa fa-trash"></i></button>
                            <button class="btn btn-secondary btn-sm" onclick="loadProductData(${product.id})"><i class="fa fa-pencil-alt"></i></button>
                        </td>
                    </tr>`;
        productTableBody.innerHTML += row;
    });
}

// Función para transformar el timestamp a una fecha legible
function transformTimestampToDate(dateTimeStamp) {
    const dateFormat = new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    const offset = new Date().getTimezoneOffset() * 60 * 1000;
    dateTimeStamp += offset; // Cambiado a += para corregir el ajuste de fecha

    const date = dateFormat.format(new Date(dateTimeStamp));
    return date;
}

// Eliminar un producto
async function deleteProduct(productId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`${baseURL}/${productId}`);
                Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
                getProducts(); // Volver a obtener y renderizar productos
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
        }
    });
}

// Cargar datos del producto en el formulario para actualizar
async function loadProductData(productId) {
    try {
        const response = await axios.get(`${baseURL}/${productId}`);
        const product = response.data;
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productCreatedAt').value = new Date(product.createdAt).toISOString().substring(0, 10);
        isUpdating = true;
        currentProductId = productId;
        document.getElementById('formTitle').innerText = "Editar Producto";
        document.getElementById('formButton').innerText = "Editar";
    } catch (error) {
        console.error("Error al cargar los datos del producto:", error);
        Swal.fire('Error', 'No se pudieron cargar los datos del producto', 'error');
    }
}

// Mostrar formulario para agregar producto
function showAddProductForm() {
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productCreatedAt').value = '';
    isUpdating = false;
    currentProductId = null;
    document.getElementById('formTitle').innerText = "Registrar Producto";
    document.getElementById('formButton').innerText = "Registrar";
}

// Actualizar o agregar un producto
document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').value;
    const productCreatedAt = new Date(document.getElementById('productCreatedAt').value).getTime();

    const productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        category: productCategory,
        image: productImage,
        createdAt: productCreatedAt
    };

    try {
        if (isUpdating) {
            await axios.put(`${baseURL}/${currentProductId}`, productData);
            Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
        } else {
            await axios.post(baseURL, productData);
            Swal.fire('Éxito', 'Producto agregado correctamente', 'success');
        }
        getProducts(); // Volver a obtener y renderizar productos
        showAddProductForm(); // Limpiar el formulario
    } catch (error) {
        Swal.fire('Error', `No se pudo ${isUpdating ? 'actualizar' : 'agregar'} el producto`, 'error');
    }
})

// Función para ordenar productos ascendentemente por precio
function sortAsc() {
    products.sort((a, b) => a.price - b.price);
    renderProducts(products);
}

// Función para ordenar productos descendentemente por precio
function sortDesc() {
    products.sort((a, b) => b.price - a.price);
    renderProducts(products);
}

// Llamar a la función getProducts para cargar los productos
getProducts();

// Buscador
document.getElementById('searchInput').addEventListener('input', () => renderProducts(products));
