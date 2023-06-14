import fetchGeneros from './fetchGeneros'
import obtenerGenero from './obtenerGenero';

const fetchPopulares = async (filtro = 'movie') => 
{
    const tipo = filtro === 'movie' ? 'movie' : 'tv' ;

    const url = `https://api.themoviedb.org/3/${tipo}/popular?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX&page=1&region=US`;
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        const resultados = datos.results

        const generos = await fetchGeneros();
        resultados.forEach((resultado) => {
            resultado.genero = obtenerGenero(resultado.genre_ids[0], generos);
        })
        return resultados;
            
    } catch (error) {
        console.log(error);
    }
}

export default fetchPopulares;