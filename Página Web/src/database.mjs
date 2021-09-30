const db_connection_info = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'taxiApp'
};

export async function getData(query) {
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

export async function insertData(values) {
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

        connection.query("INSERT INTO datos (Id, Latitud, Longitud, Fecha, Hora) VALUES ?", values,  (err, info) => {
            if (err) {
                console.log("No se pudo ejecutar el query.".red);
                return reject(err);
            }
            console.log("Datos insertados con éxito.".gray);
            resolve(connection.end());
        });
    });
}