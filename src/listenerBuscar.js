import fetchBusqueda from "./fetchBusqueda";
import cargarTitulos from './cargarTitulos'

const btn = document.getElementById('btn-buscar');

btn.addEventListener('click', async (e) =>{

    const resultados = await fetchBusqueda();

    cargarTitulos(resultados);

})