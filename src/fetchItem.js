const fetchItem = async (id) =>{

    const tipo = document.querySelector('.main__filtros .btn--active').id;
    
    
    try {
        
        const url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=6c1cb99ae63165b557828a1581dd1976&language=es-MX`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        return datos;

    } catch (error) {
        console.log(error)
    }

}

export default fetchItem;