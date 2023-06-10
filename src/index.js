import fetchPopulares from './fetchPopulares'
import cargarTitulos from './cargarTitulos'

const cargar = async () => {
    const resultados =  await fetchPopulares();
    cargarTitulos(resultados);
}

cargar();

