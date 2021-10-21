
// chart config
const chartSaldo = document.querySelector('#ejecucionChart')
const adjudicado = document.querySelector('#adjudicado').textContent
const ejecutado = document.querySelector('#ejecutado').textContent

function convertirNumero(numero) {
  return Number(numero.replace(/[^0-9]/g,''))  
}

const adjudicadoConvertido = convertirNumero(adjudicado)
const ejecutadoConvertido = convertirNumero(ejecutado)

const data = {
  labels: [
    'Utilizado',
    'Restante',
  ],
  datasets: [{
    label: 'Ejecución a la fecha',
    data: [ejecutadoConvertido,adjudicadoConvertido],
    backgroundColor: [
      'rgb(49, 151, 149)',
      'rgb(229, 231, 235)'
     ],
    hoverOffset: 4
  }]
};

const config = {
  type: 'pie',
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

