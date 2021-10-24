window.onload = ()=>{
  
// chart config
const chartSaldo = document.querySelector('#ejecucionChart')
const adjudicado = document.querySelector('#adjudicado').textContent
const ejecutado = document.querySelector('#ejecutado').textContent
const porcentaje = document.querySelector('#porcentaje')
const botonAdenda = document.querySelector('#toggleB')
const adjudicacionSection = document.querySelector('#adjudicacionSection')
const divAdenda = document.querySelector('#version-adenda')

// convertir String de montos a entero
function convertirNumero(numero) {
  return Number(numero.replace(/[^0-9]/g,''))  
}


// convertir string a entreros parte 2
const adjudicadoConvertido = convertirNumero(adjudicado)
const ejecutadoConvertido = convertirNumero(ejecutado)
porcentaje.textContent = `${Math.ceil((ejecutadoConvertido * 100) / adjudicadoConvertido)}%`


// boton adenda
botonAdenda.checked = false
botonAdenda.addEventListener('change', mostrarAdenda)

// funcion mostrar adenda
function mostrarAdenda() {
  divAdenda.classList.toggle('hidden')
  adjudicacionSection.classList.toggle('hidden')
}

// configurar chart
const data = {
  labels: [
    'Utilizado',
    'Restante',
  ],
  datasets: [{
    label: 'Ejecución a la fecha',
    data: [ejecutadoConvertido,adjudicadoConvertido],
    backgroundColor: [
      '#0D9488',
      '#E5E7EB'
     ],
    hoverOffset: 4
  }]
};

const config = {
  type: 'doughnut',
  data: data,
  options: {
    responsive: true,
    // plugins: {
    //   legend: {
    //     position: 'top',
    //   },
    //   title: {
    //     display: true,
    //     text: 'Ejecución de saldo'
    //   }
    // }
    animation: {
      animateScale: true
    }
  }
}

const ejecucionChart = new Chart(
  chartSaldo,
  config
)


}