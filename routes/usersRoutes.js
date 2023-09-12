const express = require('express');
const fs = require('fs').promises; //para leer archivos

const router = express.Router();

const rutaJSON = './data.json';

//retorna el listado de los usuarios
router.get('/', async (req, res) => {
    try {

        // //recibo los valores de la query de la url
        // const { limit, offset } = req.query;

        // const data = JSON.parse(await fs.readFile(rutaJSON, 'utf-8'));
        // res.json({
        //     msg: 'Listado de tareas con limite' + limit + ' y offset ' + offset, 
        //     data
        // });

        res.send('<h1>Listado de usuarios del Calendario</h1>')
        
    }catch(error){
        res.json({
            msg: 'Error en el servidor ' + error, 
        });
    }

})





//exporto el objeto router
module.exports = router;