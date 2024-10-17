let html5QrCode;

document.getElementById('detect-button').addEventListener('click', () => {
    html5QrCode = new Html5Qrcode("qr-reader");
    startScanning();
});

document.getElementById('scan-button').addEventListener('click', () => {
    stopScanning();
});

document.getElementById('search-button').addEventListener('click', () => {
    const codigo = document.getElementById('codigo-qr').innerText;
    fetchProduct(codigo);
});

// Función para iniciar el escaneo
function startScanning() {
    document.getElementById('detect-button').classList.add('hidden');
    document.getElementById('scan-button').classList.remove('hidden');

    html5QrCode.start(
        { facingMode: "environment" }, 
        {
            fps: 10,
            qrbox: 250
        },
        qrCodeMessage => {
            // Mostrar el código QR decodificado
            document.getElementById('codigo-qr').innerText = qrCodeMessage;
            document.getElementById('decoded-code').classList.remove('hidden');
            document.getElementById('search-button').classList.remove('hidden');
            stopScanning(); // Detener el escáner después de leer
        },
        errorMessage => {
            console.warn(`Código QR no detectado: ${errorMessage}`);
            const resultDiv = document.getElementById('result');
            resultDiv.innerText = "Escaneando... Intenta mover el código QR más cerca o ajustar la luz.";
            resultDiv.classList.remove('hidden');
        }
    )
    .catch(err => {
        console.error(`Error al iniciar el escáner: ${err}`);
    });
}

// Función para detener el escaneo
function stopScanning() {
    if (html5QrCode) {
        html5QrCode.stop().then(ignore => {
            document.getElementById('detect-button').classList.remove('hidden');
            document.getElementById('scan-button').classList.add('hidden');
        }).catch(err => {
            console.error(`Error al detener el escáner: ${err}`);
        });
    }
}







// Función para abrir el modal y mostrar la información del producto
const abrirmodal = (datos) => {
    // Asegúrate de obtener el modal por su ID
    var modal = document.getElementById("myModal");
    
    // Insertar los datos del producto en los elementos correspondientes
    document.getElementById('producto-codigo').innerText = datos.codigo;
    document.getElementById('producto-inventario').innerText = datos.inventario;
    document.getElementById('producto-producto').innerText = datos.producto;
    document.getElementById('producto-ubicacion').innerText = datos.ubicacion;
    document.getElementById('producto-area').innerText = datos.area;
    document.getElementById('producto-detalles').innerText = datos.detalles;
    document.getElementById('producto-evidencia').href = datos.link;
    
    // Mostrar el modal
    modal.style.display = "flex";
}

// Obtener el botón que abre el modal
var btn = document.getElementById("openModalBtn");

// Obtener el <span> que cierra el modal
var closeBtn = document.getElementsByClassName("close-btn")[0];

// Cuando el usuario hace clic en la X, se cierra el modal
closeBtn.onclick = function() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del contenido del modal, se cierra
window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Función para buscar el producto en la API y mostrar los datos en el modal
function fetchProduct(codigo) {
    const url = `https://api-factoryilll.onrender.com/api/productos/${codigo}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el producto');
            }
            return response.json();
        })
        .then(data => {
            // Llamar a la función para abrir el modal con los datos obtenidos
            abrirmodal(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al obtener el producto');
        });
}
