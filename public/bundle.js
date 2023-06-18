'use strict';

const fetchGeneros  = async (filtro = 'movie') => {

    const tipo = filtro === 'movie' ? 'movie' : 'tv' ;

    const url = `https://api.themoviedb.org/3/genre/${tipo}/list?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        return datos.genres;
            
    } catch (error) {
        console.log(error);
    }

};

const obtenerGenero = (id , generos) => {

    let nombre;

    generos.forEach((elemento) => {
        if(id === elemento.id){
            nombre = elemento.name;
        }
    });

    return nombre;

};

const fetchPopulares = async (filtro = 'movie') => 
{
    const tipo = filtro === 'movie' ? 'movie' : 'tv' ;

    const url = `https://api.themoviedb.org/3/${tipo}/popular?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX&page=1&region=US`;
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const resultados = datos.results;

        const generos = await fetchGeneros();
        resultados.forEach((resultado) => {
            resultado.genero = obtenerGenero(resultado.genre_ids[0], generos);
        });

        return resultados;
            
        
    } catch (error) {
        console.log(error);
    }
};

const cargarTitulos = (resultados) => {

    const contenedor = document.querySelector('#populares .main__grid');

    contenedor.innerHTML = ' ';
    resultados.forEach((resultado) => {
        const plantilla = `
          <div class="main__media" data-id="${resultado.id}">
              <a href="#" class="main__media-thumb">
                  <img class="main__media-img" src="https://image.tmdb.org/t/p/w500/${resultado.poster_path}" alt="" />
              </a>
              <p class="main__media-titulo">${resultado.title || resultado.name}</p>
              <p class="main__media-fecha">${resultado.genero}</p>
          </div>
          `;

          contenedor.insertAdjacentHTML('beforeend', plantilla);
    });
};

const contenedorGeneros = document.getElementById('filtro-generos');

const cargarGeneros = async (filtro) => {
    
    const generos = await fetchGeneros(filtro);

    contenedorGeneros.innerHTML = '';

    generos.forEach((genero) => {
        const btn = document.createElement('button');
        btn.classList.add('btn');
        btn.innerText = genero.name;
        btn.setAttribute('data-id', genero.id);

        contenedorGeneros.appendChild(btn);
    });
};

const filtroPelicula = document.getElementById('movie');
const filtroShow = document.getElementById('tv');

filtroPelicula.addEventListener('click', async (e) => {
    e.preventDefault();
    cargarGeneros('movie');

    const resultados = await fetchPopulares('movie');

    cargarTitulos(resultados);

    filtroShow.classList.remove('btn--active');
    filtroPelicula.classList.add('btn--active');
    document.querySelector('#populares .main__titulo').innerText = 'Peliculas Populares';


});

filtroShow.addEventListener('click', async (e) => {
    e.preventDefault();

    cargarGeneros('tv');

    const resultados = await fetchPopulares('tv');

    cargarTitulos(resultados);

    filtroPelicula.classList.remove('btn--active');
    filtroShow.classList.add('btn--active');
    document.querySelector('#populares .main__titulo').innerText = 'Series Populares';

});

const contenedor$1 = document.getElementById('filtro-generos');
contenedor$1.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.closest('button')) {
        contenedor$1.querySelector('.btn--active')?.classList.remove('btn--active');
        e.target.classList.add('btn--active');
    }

});

const fetchBusqueda = async (pagina = 1) => {

    const tipo = document.querySelector('.main__filtros .btn--active')?.id;
    const idGenero = document.querySelector('#filtro-generos .btn--active')?.dataset.id;
    const anoInicial = document.getElementById('años-min').value || 1950;
    const anoFinal = document.getElementById('años-max').value || 2023;
    
    let url;
    if(tipo === 'movie'){
        url = `https://api.themoviedb.org/3/discover/movie?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX&sort_by=popularity.desc&include_adult=false&page=1&with_genres=${idGenero}&primary_release_date.gte=${anoInicial}-01-01&primary_release_date.lte=${anoFinal}-12-31&region=US&page=${pagina}`;
    } else if (tipo === 'tv') {
		url = `https://api.themoviedb.org/3/discover/tv?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX&sort_by=popularity.desc&include_adult=false&page=1&with_genres=${idGenero}&first_air_date.gte=${anoInicial}-01-01&first_air_date.lte=${anoFinal}-12-31&region=US&page=${pagina}`;
	}

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const resultados = datos.results;

        const generos = await fetchGeneros();
        resultados.forEach((resultado) => {
            resultado.genero = obtenerGenero(resultado.genre_ids[0], generos);
        });

        return resultados;

    } catch (error) {
        console.log(error);
    }

};

const btn = document.getElementById('btn-buscar');

btn.addEventListener('click', async (e) =>{

    const resultados = await fetchBusqueda();

    cargarTitulos(resultados);

});

const anterior = document.getElementById('pagina-anterior');
const siguiente = document.getElementById('pagina-siguiente');

siguiente.addEventListener('click', async (e) => {

    const paginaActual = document.getElementById('populares').dataset.pagina;

    try {
        
        const resultados = await fetchBusqueda(paginaActual + 1);
        document.getElementById('populares').setAttribute('data-pagina', parseInt(paginaActual) + 1);
        cargarTitulos(resultados);
        window.scrollTo(0,0);

    } catch (error) {
        console.log(error);
    }


});

anterior.addEventListener('click', async(e) => {
    const paginaActual = document.getElementById('populares').dataset.pagina;
    
    if (paginaActual > 1) {
        
        try {
            
            const resultados = await fetchBusqueda(paginaActual - 1);
            document.getElementById('populares').setAttribute('data-pagina', parseInt(paginaActual) - 1);
            cargarTitulos(resultados);
            window.scrollTo(0,0);
    
        } catch (error) {
            console.log(error);
        }
    }

});

const fetchItem = async (id) =>{

    const tipo = document.querySelector('.main__filtros .btn--active').id;
    
    
    try {
        
        const url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        return datos;

    } catch (error) {
        console.log(error);
    }

};

const contenedor = document.getElementById('populares');
const popup$1 = document.getElementById('media');

contenedor.addEventListener('click', async (e) => {

    if (e.target.closest('.main__media')) {
        popup$1.classList.add('media--active');

        const id = e.target.closest('.main__media').dataset.id;

        const resultado = await fetchItem(id);

        const plantilla = `<div class="media__backdrop">
        <img
            src="https://image.tmdb.org/t/p/w500/${resultado.backdrop_path}"
            class="media__backdrop-image"
        />
         </div>
        <div class="media__imagen">
            <img
                src="https://image.tmdb.org/t/p/w500/${resultado.poster_path}"
                class="media__poster"
            />
        </div>
        <div class="media__info">
            <h1 class="media__titulo">${resultado.title || resultado.name}</h1>
            <p class="media__fecha">${resultado.release_date || resultado.first_air_date}</p>
            <p class="media__overview">${resultado.overview}</p>
        </div>
        <button class="media__btn">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                class="media__btn-icono"
            >
                <path
                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                />
            </svg>
        </button> `;

        document.querySelector('#media .media__contenedor').innerHTML = plantilla;
    }

});

const popup = document.getElementById('media');

popup.addEventListener('click', (e) => {

    if (e.target.closest('button')) {
        popup.classList.remove('media--active');
    }

});

const cargar = async () => {
    const resultados =  await fetchPopulares();
    cargarTitulos(resultados);
    cargarGeneros('movie');
};

cargar();
//# sourceMappingURL=bundle.js.map
