const obtenerGenero = (id , generos) => {

    let nombre;

    generos.forEach((elemento) => {
        if(id === elemento.id){
            nombre = elemento.name;
        }
    });

    return nombre;

}

export default obtenerGenero;