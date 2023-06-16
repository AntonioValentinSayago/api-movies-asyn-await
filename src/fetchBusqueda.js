import fetchGeneros from "./fetchGeneros";
import obtenerGenero from "./obtenerGenero";

const fetchBusqueda = async (pagina = 1) => {

    const tipo = document.querySelector('.main__filtros .btn--active')?.id;
    const idGenero = document.querySelector('#filtro-generos .btn--active')?.dataset.id;
    const anoInicial = document.getElementById('años-min').value || 1950;
    const anoFinal = document.getElementById('años-max').value || 2023;
    
    let url;
    if(tipo === 'movie'){
        url = `https://api.themoviedb.org/3/discover/movie?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX&sort_by=popularity.desc&include_adult=false&page=1&with_genres=${idGenero}&primary_release_date.gte=${anoInicial}-01-01&primary_release_date.lte=${anoFinal}-12-31&region=US&page=${pagina}`
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
        console.log(error)
    }

}

export default fetchBusqueda;