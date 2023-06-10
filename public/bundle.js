'use strict';

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




};

const cargarTitulos = (resultados) => {

    const contenedor = document.querySelector('#populares .main__grid');

    resultados.forEach((resultado) => {
        const plantilla = `
          <div class="main__media">
              <a href="#" class="main__media-thumb">
                  <img class="main__media-img" src="https://image.tmdb.org/t/p/w500/${resultado.poster_path}" alt="" />
              </a>
              <p class="main__media-titulo">${resultado.title}</p>
              <p class="main__media-fecha">2021</p>
          </div>
          `;

          contenedor.insertAdjacentHTML('beforeend', plantilla);
    });
};

const cargar = async () => {
    const resultados =  await fetchPopulares();
    cargarTitulos(resultados);
};

cargar();
//# sourceMappingURL=bundle.js.map
