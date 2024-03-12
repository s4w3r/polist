const express = require('express');
const bodyParser = require ('body-parser');
const mysql = require ('mysql2/promise');
const app = express ();
const session = require('express-session');
const path = require('path');
const { error } = require('console');

//Configurar middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(session({
    secret:'laco',
    resave: false,
    saveUninitialized: false

}))
app.use(express.static(path.join(__dirname)));

//Configurar conexíon a la basde de datos
const db = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mano', /*Nombre base datos*/
};

/*db.on((err)=>{
    if (err) {
        console.error('Error al conectar a la base de datos: '+err.stack);
        return;
    }
    console.log('Conexion exitosa a la base de datos'); 

});*/

//Manejar el formulario POST registro usuario
app.post('/crear', async (req, res) => {
    const {Nombre,Tipo_documento,Documento,Codigo_m} = req.body;

    try{

        //Verificacion de usuario
        const laco = await mysql.createConnection(db);
        const [indicador]= await laco.execute('SELECT * FROM usuario WHERE Documento = ? AND Tipo_documento = ?', [Documento, Tipo_documento])
        if(indicador.length>0){
            res.status(401).send(`
            <script>
                window.onload = function(){
                    alert('El usuario ya esta registrado')
                    window.location.href = 'http://127.0.0.1:5500/Vistas/incio.html'
                }
            </script>
            `)
        }
        else{

   await laco.execute(`INSERT INTO usuario (Nombre, Tipo_documento, Documento, Codigo_m) VALUES (?,?,?,?) `, [Nombre, Tipo_documento, Documento, Codigo_m])
    res.status(201).send(`
    <script>
            window.onload = function() {
                alert('Registro exitoso');
                window.location.href = 'http://127.0.0.1:5500/Vistas/incio.html'
            }

        </script>
    `)
   }
   await laco.end();
}
   catch(error){
        console.error('Hubo un error con el servidor: ', error);
        res.status(500).send(`
        <script>
            window.onload = function() {
                alert('Datos no guardados');
                window.location.href = 'http://127.0.0.1:5500/Vistas/registro.html'
            }

        </script>
        `)
   }

});


//Parte de inicio de sesion
app.post('/inicio', async (req,res)=>{
    const {Documento,Tipo_documento}=req.body
    try{
        //Verificar las credenciales
        const laco = await mysql.createConnection(db)
        const [indicador]= await laco.execute('SELECT * FROM usuario WHERE Documento = ? AND Tipo_documento = ?', [Documento, Tipo_documento])
        console.log(indicador)
        if(indicador.length>0){
            req.session.usuarie=indicador[0].Nombre
            req.session.Documento=Documento
            if(indicador[0].Rol=="Admin"){
                res.sendFile(path.join(__dirname,'../Vistas/admi.html'))
            }
            else{
                const usuarie={Nombre: indicador[0].Nombre}
                console.log(usuarie)
                res.locals.usuarie=usuarie
                res.sendFile(path.join(__dirname,'../Vistas/usuario.html'))
            }
            
        }

        else{
            res.status(401).send('Usuario no encontrado')
        }
        await laco.end();
    }
    catch(error){
        console.error('Error en el servidor: ', error)
        res.status(500).send(`
        <script>
            window.onload = function() {
                alert('Error en el servidor');
                window.location.href = 'http://127.0.0.1:5500/Vistas/incio.html'
            }

        </script>
        
        `)
    }

})

//PARTE DE CERRAR SESIÓN
app.post('/cerrar-usuario', async (req,res)=>{  
    req.session.destroy((error)=>{
        if(error){
            console.error('Error en el servidor',error);
            res.status(500).send('Error al cerrar sesíon')
        }
        else{
            res.status(200).send('Sesion cerrada')
        }
    })

})


//USUARIOS
app.post('/obtener-usuaries',(req,res)=>{
    const usuarie = req.session.usuarie;
    if(usuarie){
        res.json({Nombre: usuarie});
    }
    else{
        res.status(401).send('Usuario no autenticado')
    }
    res.sendFile(__dirname,'../Vistas/usuario.html');
})

//ADMINISTRADORES
app.post('/perra',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/admi.html'))
})


//OBTENER
app.post('/obtener-servicios-usuario',async (req,res)=>{
    const usuarie=req.session.usuarie
    const Documento=req.session.Documento
    console.log(usuarie,Documento)
    try{
        const laco = await mysql.createConnection(db);
        const [serviciosData]= await laco.execute('SELECT servicios.Nombre_s FROM usuario INNER JOIN manzana ON manzana.Codigo_m = usuario.Codigo_m INNER JOIN manzana_servicios ON manzana_servicios.Codigo_m = manzana.Codigo_m INNER JOIN servicios ON servicios.Codigo_s = manzana_servicios.Codigo_s WHERE usuario.Documento= ?',[Documento]);
       console.log (serviciosData)
        res.json({servicios: serviciosData.map(row=>row.Nombre_s)}) //MAP ES ENLISTAR LOS DATOS EN ORDEN DE LLEGADA
        await laco.end();
    }
    catch(error){
        console.error('Error en el servidor: ',error);
        res.status(500).send('Error en el servidor');
    }
})

//GUARDAR
app.post('/guardar-servicios-usuario',async(req,res)=>{
    const usuarie=req.session.usuarie;
    const Documento=req.session.Documento;
    console.log (usuarie,Documento)
    const {servicios,fechaHora}=req.body

    const laco = await mysql.createConnection(db);
    const [consulID] = await laco.query('SELECT usuario.Codigo_u, servicios.Codigo_s FROM usuario INNER JOIN servicios WHERE usuario.Documento = ? AND servicios.Nombre_s = ?',[Documento,servicios])
    console.log(consulID);
   /*  const [IDserver] = await laco.query('SELECT servicios.Codigo_s FROM servicios WHERE servicios.Nombre_s = ?',[servicios])
    console.log('cargaron servicios', IDserver) */
    try{
        
        await laco.query ('INSERT INTO solicitudes (`fecha`,`Codigo_u`,`Codigo_s`) values (?,?,?)',[fechaHora,consulID[0].Codigo_u,consulID[0].Codigo_s]);
        await laco.end();
    }
    catch(error){
        console.error('Error en el servidor: ',error);   
        res.status(500).send('Error en el servidor');
    }
})

//MOSTRAR SOLICITUDES REALIZADAS
app.post('/Solicitudes-usuario', async(req,res)=>{
    const usuarie=req.session.usuarie;
    const Documento=req.session.Documento;
    console.log(usuarie) 
    try{
        const laco = await mysql.createConnection(db);
        const[SolicitudData] = await laco.execute('SELECT solicitudes.Fecha, servicios.Nombre_s FROM solicitudes INNER JOIN usuario ON solicitudes.Codigo_u = usuario.Codigo_u INNER JOIN manzana ON usuario.Codigo_m = manzana.Codigo_m INNER JOIN manzana_servicios on manzana.Codigo_m =manzana_servicios.Codigo_m INNER JOIN servicios ON manzana_servicios.Codigo_s = servicios.Codigo_s WHERE usuario.Documento = ? AND solicitudes.Codigo_s = servicios.Codigo_s',[Documento])
        console.log(SolicitudData)
        res.json({solicitud: SolicitudData.map(raw=>([raw.Fecha, raw.Nombre_s]))});
        await laco.end();
    }
    catch(error){
        console.error('Error en el servidor', error)
        res.status(500).send('Error en el servidor')
    }
})

//BORRAR SOLICITUD
app.post('/eliminar-solicitudes', async(req,res)=>{
    const Documento=req.session.Documento;
    const laco = await mysql.createConnection(db)
    const [IDsoli] = await laco.execute('SELECT solicitudes.Codigo_soli FROM solicitudes INNER JOIN usuario ON usuario.Codigo_u = solicitudes.Codigo_u INNER JOIN manzana ON manzana.Codigo_m = usuario.Codigo_m INNER JOIN manzana_servicios ON manzana_servicios.Codigo_m = manzana.Codigo_m INNER JOIN servicios ON servicios.Codigo_s = manzana_servicios.Codigo_s WHERE usuario.Documento = ?',[Documento])
    console.log(IDsoli)

    try{
        await laco.execute('DELETE FROM solicitudes WHERE solicitudes.Codigo_soli = ?',[IDsoli[0].Codigo_soli]);
        await laco.end();
    }
    catch(error){
        console.error('Error en el servidor',error)
        res.status(500).send('Error en el servidor')
    }
})

//ADMINISTRADOR
 app.post('/obtener-usuarios', async(req,res)=>{
    const usuarie=req.session.usuarie

    try{
    const laco = await mysql.createConnection(db);
    const[IDusu] = await laco.execute('SELECT * FROM usuario')
    console.log(IDusu)
    res.json({usuario: IDusu.map(rxw=> ([rxw.Codigo_u, rxw.Nombre, rxw.Tipo_documento, rxw.Documento, rxw.Codigo_m]))})
    await laco.end()
    }

    catch(error){
        console.error('Error en el servidor',error)
        res.status(500).send('Error en el servidor')
    }
 });

 //Borrar usuarios
 app.post('/eliminar-usuarios', async(req,res)=>{
    const {usuarie}=req.body
    console.log('Logro eliminar',usuarie)
    const laco = await mysql.createConnection(db)
    
    
    try{
        await laco.query('DELETE FROM solicitudes WHERE solicitudes.Codigo_u=?',[usuarie]);
            await laco.query('DELETE FROM usuario WHERE usuario.Codigo_u = ?',[usuarie]);
        await laco.end();
    }
    catch(error){
        console.error('Error en el servidor',error)
        res.status(500).send('Error en el servidor')
    }
})

//Puerto
app.listen(3000, ()=>{
    console.log('Servidor Node.js escuchado');
});  