document.addEventListener('DOMContentLoaded', () => {
    const comenzarBtn = document.getElementById('comenzar');
    const reiniciarBtn = document.getElementById('btnReiniciar');
    const juegoMemoria = document.getElementById('juegoMemoria');
    const formulario = document.getElementById('formulario');
    const nombreInput = document.getElementById('nombreUsuario');

    let cartas = [];
    let cartasVolteadas = [];
    let pares = 0;
    let clicks = 0;
    let nombreUsuario = localStorage.getItem('nombreUsuario') || 'Invitado';

    const cargarCartas = () => {
        for (let i = 1; i <= 8; i++) {
            cartas.push({ id: i, img: `./img/${i}.png`, volteada: false });
            cartas.push({ id: i, img: `./img/${i}.png`, volteada: false });
        }

        cartas = cartas.sort(() => Math.random() - 0.5);
    };

    const renderizarCartas = () => {
        juegoMemoria.innerHTML = '';
        cartas.forEach(({ volteada, img }, i) => {
            const cartaElement = document.createElement('div');
            cartaElement.classList.add('carta');
            cartaElement.index = i;
            cartaElement.innerHTML = `<img src="${volteada ? img : ''}">`;
            cartaElement.addEventListener('click', () => voltearCarta(i));
            juegoMemoria.appendChild(cartaElement);
        });
    };

    const voltearCarta = (i) => {
        if (!cartas[i].volteada && cartasVolteadas.length < 2) {
            cartas[i].volteada = true;
            cartasVolteadas.push({ i, id: cartas[i].id });

            clicks++;
            document.getElementById('racha').innerText = clicks;

            renderizarCartas();

            if (cartasVolteadas.length === 2) {
                setTimeout(verificarPares, 700);
            }
        }
    };

    const verificarPares = () => {
        const [carta1, carta2] = cartasVolteadas;

        if (carta1.id === carta2.id) {
            pares++;
        } else {
            cartas[carta1.i].volteada = false;
            cartas[carta2.i].volteada = false;
        }

        cartasVolteadas = [];
        renderizarCartas();

        if (pares === 8) {
            mostrarReiniciar();
        }


        mostrarMejoresRachas();
    };

    const mostrarReiniciar = () => {
        setTimeout(() => {
            reiniciarBtn.parentElement.style.display = 'flex';
        }, 0);
    };

    const reiniciarJuego = () => {
        cartas = [];
        cartasVolteadas = [];
        pares = 0;
        reiniciarBtn.parentElement.style.display = 'none';
        cargarCartas();
        renderizarCartas();
        actualizarRachaEnHTML();
    };

    const ocultarFormulario = () => {
        formulario.style.display = 'none';
    };

    const actualizarRachaEnHTML = () => {
        document.getElementById('racha').innerText = clicks;
        document.getElementById('nombreUsuario').innerText = nombreUsuario;
        mostrarMejoresRachas();
    };

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        nombreUsuario = nombreInput.value.trim() || 'Invitado';
        localStorage.setItem('nombreUsuario', nombreUsuario);

        const nombreEsValido = nombreUsuario !== '';

        nombreEsValido ? (ocultarFormulario(), cargarCartas(), renderizarCartas(), actualizarRachaEnHTML()) : nombreInput.classList.add('nombreAlert');
    });

    comenzarBtn.addEventListener('click', () => {
        const nombreEsValido = nombreUsuario.trim() !== '';

        nombreEsValido ? (ocultarFormulario(), cargarCartas(), renderizarCartas(), actualizarRachaEnHTML()) : nombreInput.classList.add('nombreAlert');
    });

    reiniciarBtn.addEventListener('click', reiniciarJuego);
});