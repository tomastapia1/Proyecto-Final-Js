if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify([]));
}

async function cargarUsuariosJSON() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        const usuarios = data.usuarios || [];

        if (!Array.isArray(usuarios)) {
            console.error('Error. Los datos JSON no son un array');
            return [];
        }   
        return usuarios;
    } catch (error) {
        console.error('Error al cargar usuarios JSON', error);
        return [];
    }
}

async function cargarUsuario() {
    
    const usuariosString = localStorage.getItem('usuarios');
    const usuariosLocal = usuariosString ? JSON.parse(usuariosString) : [];  
    
    if (!Array.isArray(usuariosLocal)) {
        console.error('Los datos del localstorage no son array');
        return [];
    }

    const usuariosJSON = await cargarUsuariosJSON();
    const usuariosCombinados = [...usuariosLocal, ...usuariosJSON];

    return usuariosCombinados;
};

function guardarUsuariosLocal(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function verificarLogin(nombreUsuario, contrasena, usuarios) {
    let usuarioEncontrado = null;

    usuarios.forEach(usuario => {
        if(usuario.nombre === nombreUsuario && usuario.contrasena === contrasena) {
            usuarioEncontrado = usuario.nombre;
        }
    });

    return usuarioEncontrado;
}

async function iniciarSesion() {
    console.log('iniciando...')
    let nombreUsuarioIngresado = document.getElementById('nombreUsuarioLogin').value;
    let contrasenaIngresada = document.getElementById('passwordLogin').value;

    let usuarios = await cargarUsuario();

    if (!Array.isArray(usuarios)) {
        console.error('La variable usuarios no es un array');
        return;
    }

    let resultadoLogin = verificarLogin(nombreUsuarioIngresado, contrasenaIngresada, usuarios);

    if (resultadoLogin) {
        localStorage.setItem('nombreUsuario', resultadoLogin);

        Swal.fire({
            icon: 'success',
            title: `Bienvenido ${resultadoLogin}!`,
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = 'juego.html';
        });

    } else {

        Swal.fire({
            icon: 'error',
            title: 'No se pudo acceder',
            text: 'Nombre de usuario o contraseña incorrectos.'
        });

    }
}

async function crearCuenta() {
    let nombreUsuario = document.getElementById('nombreUsuario').value;
    let nuevoEmail = document.getElementById('nuevoEmail').value;
    let nuevaPassword = document.getElementById('nuevaPassword').value;
    let confirmarPassword = document.getElementById('confirmarPassword').value;
    
    if (nuevaPassword !== confirmarPassword) {
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.'
        });

        return;

    }
    
    let usuarios = await cargarUsuario();
    console.log('Usuario antes...', usuarios)

    if(!Array.isArray(usuarios)) {
        console.error("ERROR! La variable de usuarios no es un array")
        return;
    }


    let usuarioExistente = usuarios.find(usuario => usuario.nombre === nombreUsuario);
    
    if (usuarioExistente) {
        
        Swal.fire({
            icon: 'error',
            title: 'Usuario existente',
            text: 'Intente nuevamente con otro nombre de usuario'
        });

        return;

    };

    let nuevoUsuario = {
        nombre: nombreUsuario,
        email: nuevoEmail,
        contrasena: nuevaPassword
    };

    usuarios.push(nuevoUsuario);
    guardarUsuariosLocal(usuarios);

    Swal.fire({
        icon: 'succes',
        title: 'Cuenta creada con exito.',
        text: 'Ya puedes iniciar sesión'
    });
}

document.getElementById('btnIniciarSesion').addEventListener('click', iniciarSesion);
document.getElementById('btnCrearCuenta').addEventListener('click', crearCuenta);

document.getElementById('linkCrearCuenta').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('registro-container').style.display = 'block';
});

document.getElementById('linkVolverLogin').addEventListener('click', function() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('registro-container').style.display = 'none';
});