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

// Función para buscar el producto en la API y mostrar en un alert
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
            alert(`Datos del producto:\nCódigo: ${data.codigo}\nInventario: ${data.inventario}\nUbicación: ${data.ubicacion}\nZona: ${data.zona}\nDetalles: ${data.detalles}`); // Muestra los datos en un alert
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al obtener el producto'); // Muestra un alert en caso de error
        });
}




