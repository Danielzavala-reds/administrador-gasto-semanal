// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul' );






// Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}


// Classes //1ra clase: Una que controle el presupuesto, restante y realice las operaciones
// 2da: que muestre el HTML de los gastos o las validaciones UI

class Presupuesto {
        constructor (presupuesto){ // El constructor lo utilizaremos en dos propiedades diferentes, para el presupuesto original y para el restante
            this.presupuesto = parseFloat(presupuesto); // Aqui number otra vez porque al ignresar el presupuesto es string, después se transforma a numeros
            this.restante = parseFloat(presupuesto);
            this.gastos = [] // Los gastos se irán registrando aqui, por eso empieza el arreglo vacio
        }

        // Definir nuevo metodo para el objeto del gasto (id)
        nuevoGasto(gasto){
            this.gastos = [...this.gastos, gasto]; //this.gastos es el arreglo vacio, se copia y después añadimos los gastos
            this.calcularRestante();
        }

        calcularRestante(){
            const gastado = this.gastos.reduce((total, gasto) =>  total + gasto.cantidad, 0);
            this.restante = this.presupuesto - gastado;
        }

        eliminarGasto(id){
            this.gastos = this.gastos.filter(gasto => gasto.id !== id);
            this.calcularRestante();
            console.log(this.gastos);
        }

}

class UI{ // No requiere constructor porque serán métodos para imprimir HTML basados en la classe presupuesto
    insertarPresupuesto(cantidad){
        // Añadimos ya el presupuesto al HTML, con los id correspondientes
        const {presupuesto, restante} = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        // Crear el div para la alerta de mensaje de error
        const divMensajeError = document.createElement('div');
        divMensajeError.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensajeError.classList.add('alert-danger');
        } else {
            divMensajeError.classList.add('alert-success');
        }
        // Mensaje de error
        divMensajeError.textContent = mensaje;
        // Instertar en el HTML
        document.querySelector('.primario').insertBefore(divMensajeError, formulario); //insertBefore,toma dos parametros, el elemento a mostrar y el lugar donde se va a mostrar
        
        // Quitar el HTML
        setTimeout(() => {
            divMensajeError.remove();
        },3000);
    }
        mostrarGastos(gastos){

            //Eliminamos el HTML previo 
            this.limpiarHTML();
            
            // Iterar sobre los gastos
            gastos.forEach(gasto => {
                const { nombre, cantidad, id} = gasto;
                // Crear un LI
                const nuevoGasto = document.createElement('li');
                nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
                nuevoGasto.dataset.id = id;
                console.log(nuevoGasto);
                
                // Agregar el HTML del gasto
                nuevoGasto.innerHTML = `${nombre} <span class= "badge badge-primary badge-pill"> $${cantidad} </span>`;

                // Boton para borrar el gasto
                const btnBorrar = document.createElement('button');
                btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
                btnBorrar.innerHTML = 'Borrar &times';
                btnBorrar.onclick = () => {
                    eliminarGasto(id);
                }

                nuevoGasto.appendChild(btnBorrar);

                // Agregar al HTML
                gastoListado.appendChild(nuevoGasto);
             })
        }

        limpiarHTML(){
           
                while(gastoListado.firstChild){
                    gastoListado.removeChild(gastoListado.firstChild);
                }
            }
            
            // Mostramos el restante en el HTML
            actualizarRestante(restante){
                document.querySelector('#restante').textContent = restante;
            }

            // Cambiar de color de acuerdo se vaya disminuyendo el restante
        comprobarPresupuesto(presupuestoObj){
            const {presupuesto, restante} = presupuestoObj;

            const restanteDiv = document.querySelector('.restante');
            // Comprobar 25%
            if((presupuesto / 4) > restante){
                restanteDiv.classList.remove('alert-success', 'alert-warning');
                restanteDiv.classList.add('alert-danger');
            } else if ((presupuesto / 2) > restante){
                restanteDiv.classList.remove('alert-success');
                restanteDiv.classList.add('alert-warning');
            } else {
                restanteDiv.classList.remove('alert-danger', 'alert-warning')
                restanteDiv.classList.add('alert-success')
            }

            // Si el total es menor a 0
            if(restante <= 0){
                ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

                // Ya no se agregan mas gastos despues de agotar el presupuesto
                formulario.querySelector('button[type="submit"]').disabled = true;
            }
           
        }    
}


// Instanciar
// Creamos la variable para el presupuesto para instanciarla, iniciarla sin ningun valor
const ui = new UI(); // Lo dejamos de forma global para acceder a el, en funcion pP y otra para el formulario
let presupuesto;






// Funciones

function preguntarPresupuesto(){
    
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    // console.log( Number(presupuestoUsuario)); // Podemos usar Number en vez de parseInt o parseFloat, para pasar de strings a numeros

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){ // La funcion isNaN permite saber si en verdad se esta poniendo un numero o string, si se pone string (letra) vuelve a preguntar
     window.location.reload(); // Esto lo que hace es recargar el prompt si no cumple las condiciones. 
 }

    // Se instancia después de tener un presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    // Leer los datos del fomulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value); //Convertimos a numero la cantidad ya que se mostraba como string en el objeto

    // Validar 
    if(nombre === '' || cantidad === ''){
       ui.imprimirAlerta('Ambos campos son obligatorios', 'error'); //Aqui pasamos el tipo de mensaje para que se muestre
       return;
    } else if( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }
    
    // Generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()} //Esto es lo contrario a distrocturing, nombre y cantidad se unen a gasto
    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente'); //No se pone el tipo de 'error' ya que no cae en esa condicion, directamente cae en el else
    
    
    // Imprimir los gastos
    // Aplicamos distrocturing, extraemos solo los gastos, que es lo que requerimos en vez de pasar todo el objeto
    const {gastos, restante} = presupuesto; //Se extrae ya el restante para mostrarlo en el HTML
    ui.mostrarGastos(gastos);
    
    ui.actualizarRestante(restante);
    
    ui.comprobarPresupuesto(presupuesto);
    
    // Resetear el formulario
    formulario.reset();
}

function eliminarGasto(id){ 
    // Este los elimina del objeto
   presupuesto.eliminarGasto(id);
//    Elimina los gastos del HTML
   const {gastos, restante} = presupuesto;
   ui.mostrarGastos(gastos);

   ui.actualizarRestante(restante);
    
    ui.comprobarPresupuesto(presupuesto);

}

