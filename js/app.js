// Variable y selectores
const formulario = document.querySelector('#agregar-gasto'),
      gastoListado = document.querySelector('#gastos ul')


// Eventos
eventListeners();
function eventListeners(){
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
}


// Clases
class Presupuesto {
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }
  nuevoGasto(gasto){
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }
  calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
  }
  eliminarGasto(id){
    this.gastos.filter(gasto => gasto.id !== id)
  }
}

class UI{

  insertarPresupuesto(cantidad){
    const { presupuesto, restante } = cantidad;
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    // Validamos que tipo de alerta vamos a mostrar
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    }else{
      divMensaje.classList.add('alert-success');
    }

    // Agregamos el texto
    divMensaje.textContent = mensaje;

    // Insertamos en el HTML
    document.querySelector('.primario').insertBefore(divMensaje, formulario);
    setTimeout(()=>{
      divMensaje.remove();
    },3000);
  }

  limpiarHTML(){
    while (gastoListado.firstChild) {
      gastoListado.firstChild.remove();
    }
  }

  agregarGastoListado(gastos){
    // limpiar el HTML
    this.limpiarHTML();

    //Iterar sobre los gastos
    gastos.forEach(gasto => {
      const { cantidad, nombre, id } = gasto;

      // crear li
      const nuevoGasto = document.createElement('li');
      nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;

      // Agregar el HTML del gasto
      nuevoGasto.innerHTML = `
        ${nombre} <span class="badge bg-primary badge-pill"> $${cantidad} </span>
      `;

      // Botón para borrar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = 'Borrar &times';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };

      nuevoGasto.appendChild(btnBorrar);

      // Agregar al HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }
  actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
  }
  comprobarPresupuesto(presupuestObj){
    const { presupuesto, restante } = presupuestObj;
    const restanteDiv = document.querySelector('.restante');
    // comprobar 25%
    if ((presupuesto / 4) > restante) {
      restanteDiv.classList.remove('alert-warning', 'alert-success');
      restanteDiv.classList.add('alert-danger');
    }else if ((presupuesto / 2) > restante) {
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning');
    }
    // si el total es igual o menor a 0
    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto(){
  const presupuestoUsuario = prompt('Ingrese su presupuesto');
  if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario || presupuestoUsuario <= 0)){
    window.location.reload();
  }
  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
  e.preventDefault();
  // leer los datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);
  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios.', 'error');
    return;
  }else if(cantidad <= 0 || isNaN(cantidad)){
    ui.imprimirAlerta('Cantidad no válida.', 'error');
    return;
  }

  // Generar un objeto con el gasto
  const gasto = {nombre,cantidad, id:Date.now()}; // Object literal
  // Añade un nuevo gasto
  presupuesto.nuevoGasto(gasto);
  // Imprimir los gastos
  const {gastos,restante} = presupuesto;
  ui.agregarGastoListado(gastos);
  // Imprime alerta
  ui.imprimirAlerta('Añadido.');
  // Actualizar restante
  ui.actualizarRestante(restante);
  // comprobar presupuesto
  ui.comprobarPresupuesto(presupuesto);
  // Resetea el form
  formulario.reset();
}

function eliminarGasto(id){
  presupuesto.eliminarGasto(id);
  const { gastos } = presupuesto;
  ui.agregarGastoListado(gastos);
}