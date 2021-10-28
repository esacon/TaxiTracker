const mysql = require('mysql2');

const db_connection_info = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'taxiApp'
};

async function getData(query) {
    return new Promise(function(resolve, reject) {
        const connection = mysql.createConnection(db_connection_info);

        // Conexión a la base de datos.
        connection.connect((err) => {
            if (err) {
                console.log("No se pudo conectar a la base de datos.".red);
                connection.end(); 
            };
            console.log('Base de datos conectada'.yellow);
        });

        connection.query(query,  (err, info) => {
            if (err) {
                console.log("No se pudo ejecutar el query.".red);
                return reject(err);
            }
            console.log("Datos recibidos con éxito.".gray);
            connection.end();
            resolve(info);
        });
    });
}

function insertData(values) {    
    let connection = mysql.createConnection(db_connection_info);

    // Conexión a la base de datos.
    connection.connect((err) => {
        if (err) {
            console.log("No se pudo conectar a la base de datos.".red);
            throw err
        };
        console.log('Base de datos conectada'.green);
    });
    
    // Insert data.
    connection.query("INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora, Placa, RPM) VALUES ?", [values], (err, info) => {
        if(err) {
            console.log("No se pudo subir a la base de datos.".red);
            throw err
        };
        console.log("Datos insertados en la base de datos.".green);     
        // Cerrar conexión.
        connection.end(); 
        console.log("Conexión cerrada".grey); 
    });       
}

module.exports = {
    getData: getData,
    insertData: insertData
};