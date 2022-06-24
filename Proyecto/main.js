//const { Response } = require("node-fetch");

let URI = `https://pokeapi.co/api/v2/pokemon/`
let URIE = `https://pokeapi.co/api/v2/pokemon-species/`
let poke = `${Math.floor(Math.random()*898)}`//898

function buscar() {
    //e.preventDefault()
    console.log("Se esta haciendo el fetch");
    let pokemon = document.getElementById("busqueda")
    poke = pokemon.value.toLowerCase()
    console.log(poke);
    pokemonBusqueda(poke)
}
function evoluciones(){
    console.log("Se esta haciendo el fetch");
    let pokemon = document.getElementById("pokeID")
    let pokeID = pokemon.innerHTML
    console.log(pokeID);
    fetch(URIE+pokeID+"/")
    .then(response => response.json())
    .then(data => {
        //debugger .chain['evolves_to'][0].species.name
        console.log(data.evolution_chain.url);
        fetch(data.evolution_chain.url)
        .then(response => response.json())
    .then(data => {
        console.log(data);
        let evoChain = [];
        let evoData = data.chain;
        do {
          evoChain.push({
            "names": evoData.species.name,
            "url": evoData.species.url
          }); 
          evoData = evoData['evolves_to'][0];
        } while (!!evoData && evoData.hasOwnProperty('evolves_to'));
        console.log(evoChain);
        mostrarEvoluciones(evoChain);
    })
    })
    .catch((err) => {
        //No encontrado
        console.log("Error inesperado");
    })
}

const mostrarEvoluciones = (evoluciones) => {
    const promises = [];
    for(let i=0; i < evoluciones.length; i++){
        const url = URI+evoluciones[i].names+"/";
        console.log(url);
        promises.push(fetch(url).then((res) => res.json()))
    }
    Promise.all(promises).then((results) => {
        const pokemon = results.map((result) => ({
            nombre: result.name,
            imagenes: result.sprites.other["official-artwork"].front_default,
            id: result.id,
            habilidades: result.abilities
        }));
        displayEvoluciones(pokemon)
    });
}

const displayEvoluciones = (evolucionPokemon) => {
    console.log(evolucionPokemon);
    let tarjeta = document.getElementById("tarjeta")
    const tarjetaHTML = evolucionPokemon.map((pokemon) => 
    `
    <div class="col-sm-4">            
          <div class="card testimonial-card mt-2 mb-3">
            <div class="card-up aqua-gradient"></div>
            <div class="avatar mx-auto white">
            <img src="${pokemon.imagenes}" class="rounded-circle img-fluid"
                        alt="#">
            </div>
            <div class="card-body text-center">
              <div>
                <h4 class="card-title font-weight-bold">${pokemon.id}</h4>
                <h4 class="card-title font-weight-bold">${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h4>
              </div>
              <hr>
              <h6 class="fas fa-quote-left">Habilidades</h6>
              <p><i class="fas fa-quote-left" id="habilidades">${pokemon.habilidades[0].ability.name}</i></p>
              <button value="Reload Page" onclick="regresar()" class="btn btn-outline-success">Busqueda</button>     
            </div>
          </div>        
        </div> 
    `
    )
    //<button value="Reload Page" onClick="document.location.reload(true)">Regresar</button>     
    tarjeta.innerHTML = tarjetaHTML;
}

function regresar(){
    document.getElementById("tarjeta").innerHTML = 
    `
    <div class="col-md-4">            
          <div class="card testimonial-card mt-2 mb-3">
            <div class="card-up aqua-gradient"></div>
            <div class="avatar mx-auto white" id="imgPoke">
            </div>
            <div class="card-body text-center">
              <div id="name">
              </div>
              <hr>
              <h6 class="fas fa-quote-left">Habilidades</h6>
              <p><i class="fas fa-quote-left" id="habilidades"></i></p>
            </div>
          </div>        
        </div> 
    `
    pokemonBusqueda(poke)
}

//La función va a ser asincrona,
const pokemonBusqueda = async(name) => {
    try{
        const respuesta = await fetch(URI+name+"/")//esperame hasta que obtengas una respuesta, te pasas a la siguiente
        console.log(respuesta.status);
        if(respuesta.status === 200){
            document.getElementById("tarjeta").innerHTML = 
            `
            <div class="col-md-4">            
                  <div class="card testimonial-card mt-2 mb-3">
                    <div class="card-up aqua-gradient"></div>
                    <div class="avatar mx-auto white" id="imgPoke">
                    </div>
                    <div class="card-body text-center">
                      <div id="name">
                      </div>
                      <hr>
                      <h6 class="fas fa-quote-left">Habilidades</h6>
                      <p><i class="fas fa-quote-left" id="habilidades"></i></p>
                    </div>
                  </div>        
                </div> 
            `
            let pokeInfo = respuesta.json()
            console.log(pokeInfo);
            let {abilities: habilidades} = await pokeInfo
            let listaHabilidades = document.getElementById("habilidades")
            while (listaHabilidades.firstChild){
                //Mienras nodos o elementows hijos
                listaHabilidades.removeChild(listaHabilidades.firstChild)
            }
            habilidades.forEach(habilidad => {
                document.getElementById("habilidades").innerHTML += `
                <p><i class="fas fa-quote-left"></i>${habilidad.ability.name}</p>
                `
            });
            document.getElementById("habilidades").innerHTML += `
                <button type="button" onclick="evoluciones()" class="btn btn-outline-danger">Evoluciones</button>
                `
            let {name: nombre} = await pokeInfo
            let {id: id} = await pokeInfo      
            document.getElementById("name").innerHTML = `<h4 class="card-title font-weight-bold" id="pokeID">${id}</h4>
            <h4 class="card-title font-weight-bold">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h4>
            `
            let {sprites: imagenes} = await pokeInfo
            document.getElementById("imgPoke").innerHTML = `
            <img src="${imagenes.other["official-artwork"].front_default}" class="rounded-circle img-fluid"
                        alt="#">
            `
        }else if(respuesta.status === 401){
            console.log("Endpoint incorrecto");
        }else if(respuesta.status === 404){
            console.log("El pokemon que buscas no existe");
            document.getElementById("habilidades").innerHTML = `<p><i class="fas fa-quote-left"></i>Not Found</p>`
            document.getElementById("name").innerHTML = `<h4 class="card-title font-weight-bold">ID ?</h4>
                <h4 class="card-title font-weight-bold">Pokemon no existente</h4>`
            document.getElementById("imgPoke").innerHTML = `<img src="https://i0.wp.com/elfutbolito.mx/wp-content/uploads/2019/04/image-not-found.png?ssl=1" class="rounded-circle img-fluid" alt="#">`
        }
        
    } catch(error){
        console.log(error);
    }   
}

const showAll = (k=1,j=44) => {
    const promises = [];
    for(let i = k; i <= j; i++){
        const url = URI+i+"/";
        console.log(url);
        promises.push(fetch(url).then((res) => res.json()))
    }
    Promise.all(promises).then((results) => {
        const pokemon = results.map((result) => ({
            nombre: result.name,
            imagenes: result.sprites.other["official-artwork"].front_default,
            id: result.id,
            habilidades: result.abilities
        }));
        displayAll(pokemon)
    });
}

const displayAll = (pokemonI) => {
    console.log(pokemonI);
    let tarjeta = document.getElementById("tarjeta")
    const tarjetaHTML = pokemonI.map((pokemon) => 
    `
    <div class="col-md-3">            
          <div class="card testimonial-card mt-2 mb-3">
            <div class="card-up aqua-gradient"></div>
            <div class="avatar mx-auto white">
            <img src="${pokemon.imagenes}" class="rounded-circle img-fluid"
                        alt="#">
            </div>
            <div class="card-body text-center">
              <div>
                <h4 class="card-title font-weight-bold" id="pokeID">${pokemon.id}</h4>
                <h4 class="card-title font-weight-bold">${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h4>
              </div>
              <hr>
              <button type="button" onclick="evoluciones()" class="btn btn-outline-danger">Evoluciones</button>
              <button value="Reload Page" onclick="regresar()" class="btn btn-outline-success">Busqueda</button>     
            </div>
          </div>        
        </div> 
    `
    )
    //<button value="Reload Page" onClick="document.location.reload(true)">Regresar</button>     
    tarjeta.innerHTML = tarjetaHTML;
}

pokemonBusqueda(poke)

