
async function obtenerInformacion() {
    let respuesta = await fetch("http://localhost:7900/coordenadas");
    document.getElementById("latitud_text").textContent = await respuesta.text();
    setInterval(obtenerInformacion, 3000);
    // (latitud, longitud, fecha, hora) 
} 
/*
document.getElementById("latitud_text").innerText = "Enrique";
document.getElementById("longitud_text").innerText = "Alberto";
document.getElementById("fecha_text").innerText = "Niebles";
document.getElementById("hora_text").innerText = "Saco";
*/