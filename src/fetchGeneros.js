const fetchGeneros  = async () => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX';
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        return datos.genres;
            
    } catch (error) {
        console.log(error);
    }
}

export default fetchGeneros