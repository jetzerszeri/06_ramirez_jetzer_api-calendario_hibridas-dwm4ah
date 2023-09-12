const express = require('express');
//importo el router API
const routerApi = require('./routes'); //no hace falta poner index.js -require('./routes/index');-

const app = express();

const port = 3001;


//agregamos el middlware de lectura de json
app.use(express.json());

//ruta del index
app.get('/', (req, res) => {
    res.send('<h1>Páginal principal de Calendario</h1>')
})


// app.get('/', (req, res) => {

// })


//llamo a nuestras rutas y le pasamos la app
routerApi(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})