const fetchPopulares = async () => 
{
    const url = 'https://api.themoviedb.org/3/movie/popular?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX&page=1';
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        return datos.results;
            
    } catch (error) {
        console.log(error);
    }




}

export default fetchPopulares;