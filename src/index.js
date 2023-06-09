import fetchPopulares from './fetchPopulares'

const cargar = async () => {
    const peliculas =  await fetchPopulares();
    console.log(peliculas)
}

cargar();

