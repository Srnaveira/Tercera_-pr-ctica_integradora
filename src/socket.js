const { Server } = require('socket.io');
const productsServices = require('./services/productsServices.js');
const cartsServices = require('./services/cartsServices.js');
const { logger } = require('./utils/logger.js');

module.exports = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on('connection', socket => {

        socket.on('message', data => {
            logger.info(data);
        });

        productsServices.getAllProducts()
            .then((products) => {
                socket.emit('listProducts', products);
            });

        socket.broadcast.emit('message_user_conect', "Ha Ingresado un nuevo USUARIO");
        socketServer.emit('event_for_all', "Este evento lo veran todos los usuarios");

        // Lógica para agregar un producto
        socket.on('productAdd', async (product) => {
            try {
                const addIsValid = await productsServices.addProduct(product);
                if (addIsValid) {
                    await productsServices.getAllProducts()
                        .then((products) => {
                            socket.emit('listProducts', products);
                            socket.emit('message_add', "Producto Agregado");
                        });
                }
            } catch (error) {
                socket.emit('message_add', "Error al agregar el producto: " + error.message);
            }
        });

        socket.on('productDelete', async ({ pid, owner }) => {
            try {
                const product = await productsServices.getProductById(pid);
                const ownerUser = product.owner;

                if (product) {
                    if (product.owner === owner || ownerUser.role === 'admin') {
                        await productsServices.deleteProduct(pid);
                        const products = await productsServices.getAllProducts();
        
                        socket.emit('listProducts', products);
                        socket.emit('message_delete', "Producto Eliminado");
                    } else {
                        socket.emit('message_delete', "No tienes permiso para eliminar este producto.");                
                    }
                } else {
                    socket.emit('message_delete', "Producto no encontrado.");
                }
            } catch (error) {
                socket.emit('message_delete', "Error al Eliminar el producto: " + error.message);
            }
        });
    })
}


