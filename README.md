### PRACTICA DE INTEGRACION  SOBRE TU ECOMMERCE

## DESAFIO COMPLEMENTARIO:

# Consigna

>Con base en el proyecto que venimos desarrollando, toca solidificar algunos procesos Aspectos a incluir

>Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña
>(no recuperarla).

![alt text](/img/image.png)

![alt text](/img/image-1.png)

![alt text](/img/image-4.png)

>link del correo debe expirar después de 1 hora de enviado.

![alt text](/img/image-2.png)

![alt text](/img/image-3.png)

>Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña

![alt text](/img/image-6.png)

![alt text](/img/image-5.png)

![alt text](/img/image-7.png)


>Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos Modificar el schema de producto >para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto:

![alt text](/img/image-8.png)

![alt text](/img/image-9.png)

>Si un producto se crea sin owner, se debe colocar por defecto “admin”.

![alt text](/img/image-11.png)

>El campo owner deberá guardar sólo el correo electrónico (o _id, lo dejamos a tu conveniencia) del usuario que lo haya creado (Sólo podrá recibir usuarios
>premium).

![alt text](/img/image-10.png)


>Modificar los permisos de modificación y eliminación de productos para que:
>Un usuario premium sólo pueda borrar los productos que le pertenecen.
>El admin pueda borrar cualquier producto, aún si es de un owner.

![alt text](/img/image-12.png)



>Aspectos a incluir

>Además, modificar la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece

![alt text](/img/image-13.png)

>Implementar una nueva ruta en el router de api/users, la cual será /api/users/premium/:uid  la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.

![alt text](/img/image-14.png)

![alt text](/img/image-15.png)

![alt text](/img/image-16.png)
