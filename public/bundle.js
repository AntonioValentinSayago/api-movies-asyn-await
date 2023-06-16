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
          <div class="main__media">
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

const contenedor = document.getElementById('filtro-generos');
contenedor.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.closest('button')) {
        contenedor.querySelector('.btn--active')?.classList.remove('btn--active');
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

const cargar = async () => {
    const resultados =  await fetchPopulares();
    cargarTitulos(resultados);
    cargarGeneros('movie');
};

cargar();
//# sourceMappingURL=bundle.js.map
