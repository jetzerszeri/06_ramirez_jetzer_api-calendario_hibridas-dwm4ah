const express = require('express');
const fs = require('fs').promises; //para leer archivos

const router = express.Router();

const rutaJSON = './data.json';

//retorna el listado de los usuarios
router.get('/', async (req, res) => {
    try {
        // //recibo los valores de la query de la url
        // const { limit, offset } = req.query;

        const data = JSON.parse(await fs.readFile(rutaJSON, 'utf-8'));
        res.json({
            msg: 'Listado de usuarios del Calendario', 
            usuarios: data.users
        });

        // res.send('<h1>Listado de usuarios del Calendario</h1>')
        
    }catch(error){
        res.json({
            msg: 'Error en el servidor ' + error, 
        });
    }

})

//retorna un usuario
router.get('/:user_id', async (req, res) => {
    try{
        const { user_id } = req.params;
        const data = JSON.parse(await fs.readFile(rutaJSON, 'utf-8'));

        const user = data.users.find(user => user.id == user_id);

        const filteredEvents = data.events.filter(event => event.user_id === user.id);

        if(!user){
            res.status(404).json({
                msg: 'Usuario no encontrado'
            });
            return;
        }

        res.json({
            // msg: 'Usuario encontrado', 
            user: user.username,
            id: user.id,
            events: filteredEvents
        });


    }catch(error){
        res.json({
            msg: 'Error en el servidor ' + error, 
        });
    }
})


//agregar un nuevo usuario al json local
router.post('/', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(rutaJSON, 'utf-8'));
        const new_user = req.body;

        let user_list = data.users;
        user_list.push(new_user);

        await fs.writeFile(rutaJSON, JSON.stringify(data, null, 2));

        res.json({
            msg: 'El usuario fue agregado correctamente', 
            data: new_user
        });
        
    }catch(error){
        res.json({
            msg: 'Error en el servidor ' + error, 
        });
    }
})







//exporto el objeto router
module.exports = router;