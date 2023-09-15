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

//Inicio de sesión
//retorna un usuario y sus eventos
router.get('/:user_id', async (req, res) => {
    try{
        const { user_id } = req.params;
        const data = JSON.parse(await fs.readFile(rutaJSON, 'utf-8'));

        const user = data.users.find(user => user.id == user_id);

        
        if(!user){
            res.status(404).json({
                msg: 'Usuario no encontrado'
            });
            return;
        } else {
            const filteredEvents = data.events.filter(event => event.user_id === user.id);

            //validating user
            const user_info = req.body;
    
            if(user_info.username !== user.username || user_info.password !== user.password){
                res.status(401).json({
                    msg: 'Credenciales inválidas'
                });
                return;
            } else {
                res.status(200).json({
                    // msg: 'Usuario encontrado', 
                    user: user.username,
                    id: user.id,
                    events: filteredEvents
                });
            }
        }

        
    
    }catch(error){
        res.json({
            msg: 'Error en el servidor ' + error, 
        });
    }
})

//Registro de usuarios
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


//Crear una tarea de calendario 
router.post('/:user_id', async (req, res) => {
    try{
        const { user_id } = req.params;
        const data = JSON.parse(await fs.readFile(rutaJSON, 'utf-8'));

        const user = data.users.find(user => user.id == user_id);

        
        if(!user){
            res.status(404).json({
                msg: 'Usuario no encontrado'
            });
            return;
        } else {

            //validating user
            const user_info = req.body;

    
            if(user_info.username !== user.username || user_info.password !== user.password){
                res.status(401).json({
                    msg: 'Credenciales inválidas'
                });
                return;
            } else {

                let event_info = user_info.new_event;
                let new_event = {
                    id: data.events.length + 1,
                    user_id: user.id,
                    title: event_info.title,
                    description: event_info.description,
                    date: event_info.date,
                    color: event_info.color,
                }
                data.events.push(new_event);

                // const event_lists = data.events;
                // event_lists.push(new_event);
                
                await fs.writeFile(rutaJSON, JSON.stringify(data, null, 2));

                res.status(200).json({
                    msg: 'Evento agregado existosamente', 
                    user: user.username,
                    events: new_event,
                });
            }
        }

        
    
    }catch(error){
        res.json({
            msg: 'Error en el servidor ' + error, 
        });
    }
})


//Actualizar una tarea de calendario
router.put('/:user_id/:event_id', async (req, res) => {
    try{
        const { user_id, event_id } = req.params;
        const data = JSON.parse(await fs.readFile(rutaJSON, 'utf-8'));

        const user = data.users.find(user => user.id == user_id);

        
        if(!user){
            res.status(404).json({
                msg: 'Usuario no encontrado'
            });
            return;
        } else {

            //validating user
            const user_info = req.body;
            const event_user_id = data.events.find(event => event.id == event_id);
            console.log(event_user_id.user_id);

            if(user_info.username !== user.username || user_info.password !== user.password){
                res.status(401).json({
                    msg: 'Credenciales inválidas'
                });
                return;
            } else if (event_user_id.user_id !== user.id){
                res.status(401).json({
                    msg: 'No tiene permiso para actualizar este evento'
                });
                return;
                
            }else {
                //si validó el usuario, voy a permitirle actualizar el evento
                let event_info = user_info.update_event;
        
                
                
                //busco el evento que quiero actualizar
                const event_index = data.events.findIndex(event => event.id == event_id);

                if (event_info.title === undefined || event_info.description === undefined || event_info.date === undefined || event_info.color === undefined){
                    res.json({
                        msg: 'Faltan datos para actualizar el evento' 
                    });

                } else {

                    //actualizo el evento
                    let update_info = {
                        id: event_id,
                        user_id: user.id,
                        title: event_info.title,
                        description: event_info.description,
                        date: event_info.date,
                        color: event_info.color,
                    }

                    data.events[event_index] = update_info;

                    //guardo los cambios en el archivo
                    await fs.writeFile(rutaJSON, JSON.stringify(data, null, 2));

                    res.status(200).json({
                        msg: 'Evento actualizado existosamente', 
                        user: user.username,
                        updated_event: update_info,
                    });


                }

            }
        }

        
    
    }catch(error){
        res.json({
            msg: 'Error en el servidor ' + error, 
        });
    }
})








//exporto el objeto router
module.exports = router;