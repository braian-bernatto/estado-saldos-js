window.onload = ()=>{
  // variables
  const botonActivos = document.querySelector('#toggleActivos')
  const botonFinalizados = document.querySelector('#toggleFinalizados')

  // eventos
  botonActivos.addEventListener('click', mostrarActivos)
  botonFinalizados.addEventListener('click', mostrarFinalizados)
  botonActivos.checked = true
  botonFinalizados.checked = false

  // funciones
  function mostrarActivos() { 
    botonActivos.checked === true? console.log('Mostrando solo activos...'): console.log('Todos los contratos...')
  }

  function mostrarFinalizados() { 
    botonActivos.checked === true? console.log('Mostrando solo finalizados...'): console.log('Todos los contratos...')
  }
}