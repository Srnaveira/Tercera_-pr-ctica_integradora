const transport = require('../config/email.js');
const usersServices = require('../services/usersServices.js');
const jwt = require('jsonwebtoken');
const { createHash, isValidPassword } = require('../config/bcrypt.js')

async function login (req, res) {
    try {
        if (!req.user) {
            return res.status(400).send({ status: 'error', error: "Invalid credentials" })
        } 
                
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol,
            cartId: req.user.cartId
        }
       
        switch (req.session.user.rol) {
            case 'user':
                res.status(200).redirect('/api/products/');
                break;
            case 'admin':
                res.status(200).redirect('/api/admin/realtimeproducts');
                break;
            case 'premium':
                res.status(200).redirect('/api/admin/productsUsersPremium');
                break;
            default:
                res.status(200).redirect('/api/products/'); // O redirección por defecto si el rol no coincide
        }
        
    } catch (error) {
        req.logger.info("Error al iniciar sesión" + error)
        res.status(500).send('Error al iniciar sesión');
    }
}

async function faillogin (req, res) {
    res.send({ error: "Falied login" })
}


async function register (req, res) {
    try {
        req.logger.info({ status: "success", message: "Usuario registrado" })
        req.logger.info("Redirigiendo a /login...");
        res.status(200).redirect('/login');
    } catch (error) {
        req.logger.error("Error al registrar usuario" + error);
        res.status(500).send('Error al registrar usuario');           
    }
}

async function failregister (req, res) {
    req.logger.info("Failed Strategy")
    res.send({ error: "Failed" })
}


async function logout (req, res) {
    req.session.destroy((err) => {
        if (err) {
            req.logger.info('Error al cerrar sesión')
            return res.status(500).send('Error al cerrar sesión');
        } else {
            res.clearCookie('connect.sid').redirect('/login');
        }                 
    });  
}

async function requestPasswordReset(req, res) {
    req.logger.info("Entrando en recuperacion de cuenta")
    const { email } = req.body;
    req.logger.info("Emmain de cuenta a recuperar" + email)
    try {
        const user = await usersServices.login(email);
        req.logger.info("Informacion del usuario" + user)

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const token = jwt.sign({ email }, process.env.SECRETJWT, { expiresIn: process.env.EXPIRATION_TIME });

        const resetLink = `http://localhost:8080/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: `MAIL DE RECUPERACION DE CUENTA: ${email}`,
            text: `
                Ingrese en el siguiente link para recuperar la cuenta este link estara activo por 1 hs:
            `,
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Detalles de la Compra</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            padding: 20px;
                            border: 1px solid #ddd;
                            background-color: #f9f9f9;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                        }
                        p {
                            line-height: 1.6;
                        }
                        .details {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Link de recuperacion:</h1>
                        <div class="details">
                            <p><strong>Link:</strong> ${resetLink}</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                req.logger.error(error)
                return ;
            }
            req.logger.info('Message sent: %s', info.messageId);
            res.status(201).send('¡Correo enviado correctamente!');
        });

        res.send('Correo de restablecimiento enviado');

    } catch (error) {
        
    }
}

async function resetPassword(req, res) {    
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRETJWT);
        req.logger.info(`Token recibido: ${token}`);
        req.logger.info(`Información decodificada: ${JSON.stringify(decoded)}`);
        req.logger.info(process.env.SECRETJWT)
        const user = await usersServices.login(decoded.email);
        req.logger.info(user)
        // Comparar la nueva contraseña con la actual

        
        const isSamePassword = isValidPassword(user, newPassword);
        req.logger.info(isSamePassword)
        if (isSamePassword) {
            return res.status(400).send('No puedes usar la misma contraseña');
        }

        const hashedPassword = createHash(newPassword);

        req.logger.info(`Password hasheada: ${hashedPassword}`);
        req.logger.info(`Email: ${user.email}`);

        await usersServices.updatePassword(user.email, hashedPassword);

        res.send('Contraseña actualizada con éxito');
    } catch (error) {
        // Si el token expiró o es inválido
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('El enlace de restablecimiento ha expirado. Solicita uno nuevo.');
        }
        res.status(400).send('Enlace de restablecimiento inválido');
    }  
}

async function listUsers(req, res) {
    try {
        const usersList = await usersServices.listUsers();
        req.logger.info("ESTOY DENTRO DEL USERSCONTROLLER PARA TRAER LA LISTA DE USUARIOS");
        req.logger.info("Contenido de la lista de usuarios: " + usersList);
        res.status(200).render('listUsers', { users: usersList });
    } catch (error) {
        req.logger.error('Error al listar usuarios', error);
        res.status(500).send('Error al listar usuarios');
    } 
}

async function updateRollUser(req, res) {
    try {
        const { uid } = req.params;
        const { newRole } = req.body;
        req.logger.info(`UID: ${uid}, newRole: ${newRole}`);

        if (!newRole) {
            req.logger.error('newRole no se recibió correctamente');
            return res.status(400).json({ error: 'No se recibió el rol' });
        }

        const validRoles = ['user', 'premium', 'admin'];

        if (!validRoles.includes(newRole)) {
            req.logger.error(`Rol inválido: ${newRole}`);
            return res.status(400).json({ error: 'Rol inválido' });
        }

        await usersServices.updateRollUser(uid, newRole);
        req.logger.info(`Rol actualizado correctamente para el usuario con ID ${uid} a ${newRole}`);
        res.status(200).json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        req.logger.error('Error al actualizar el rol del usuario', error);
        res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
    }
}

module.exports = {
    login,
    register,
    faillogin,
    failregister,
    logout,
    requestPasswordReset,
    resetPassword,
    listUsers,
    updateRollUser
}
