// const { log } = require("@11ty/eleventy/src/EleventyErrorHandler");

/* 1
Utiliza el evento click en un boton para hacer que al hacer click en el mismo
 aparezca en el DOM una lista con todos los amigos que el servidor nos devolvera 
 al hacer un GET a la ruta http://localhost:5000/amigos
*/

let URL = 'http://localhost:5000/amigos'

let showFriends = () => {
    document.querySelector('#lista').innerHTML = ''
    $.get(`${URL}`, (friends) => {
        // console.log(friends);
        friends.forEach(friend => {
            let li = document.createElement('li')
            li.innerHTML = `${friend.name}`
            document.querySelector('#lista').appendChild(li)
            // console.log(li);

            //JQUERRY
            // $('#lista').append(`<li id="${friend.id}">${friend.name}</li>`);
        });
    });
}

$('#boton').click(showFriends)

/* 2
Un campo de busqueda (input) que reciba el id de un amigo y un boton "buscar".
 Al hacer click en el boton, buscaremos el amigo que tiene ese id en el servidor, 
 y lo mostraremos en el DOM. Para conseguir los datos de un amigo en particular 
 del servidor, puedes hacer un GET nuestro servidor concatenando el id del amigo 
 que queremos encontrar, Por ej: http://localhost:5000/amigos/1 le pediria al 
 servidor el amigo con id = 1
*/

$('#search').click(() => {

    let inputId = $('#input').val()
    console.log(inputId);

    if (inputId) {
        $.get(`${URL}/${inputId}`, (friend) => {
            // console.log(friend);
            let span = document.querySelector('#amigo')
            span.innerHTML = `${friend.name}`
        });
    }
    // inputId.innerHTML = ''
})

/* 3
Un input que reciba el id de un amigo y un boton "borrar". Al hacer click en
 el boton, borraremos el amigo del servidor haciendo un DELETE a nuestro servidor,
 concatenando el id del usuario que queremos borrar. 
 Por ej: http://localhost:5000/amigos/2 le pediria al servidor el amigo con id = 2
*/

let deleteFriend = () => {
    let inputId = $('#inputDelete').val()
    console.log(inputId);
    let friend

    if (inputId) {
        $.get(`${URL}/${inputId}`, (f) => {
            friend = f
        })

        $.ajax({
            url: `${URL}/${inputId}`,
            type: 'DELETE',
            success: function () {
                let successMessage = `Tu amigo ${friend.name} fue eliminado correctamente`
                $('#success').html(successMessage)
                $('#inputDelete').val('')
                showFriends()
            },
        })
    }
}

$('#delete').click(deleteFriend)
