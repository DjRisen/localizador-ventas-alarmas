// ============================================
// SOLUCIÓN PARA ERROR: cargarAgendaHoy is not defined
// ============================================

console.log("🔧 Aplicando fix para error de agenda...");

// 1. DEFINIR LA FUNCIÓN FALTANTE
function cargarAgendaHoy() {
    console.log("📅 Cargando agenda de hoy...");
    
    try {
        // Obtener visitas del localStorage
        const visitas = JSON.parse(localStorage.getItem('visitasAgenda') || '[]');
        const hoy = new Date().toLocaleDateString('es-ES');
        
        // Filtrar visitas de hoy
        const visitasHoy = visitas.filter(visita => {
            const fechaVisita = new Date(visita.fecha).toLocaleDateString('es-ES');
            return fechaVisita === hoy;
        });
        
        console.log(`✅ Encontradas ${visitasHoy.length} visitas para hoy`);
        
        // Actualizar UI si existe el contenedor
        const contenedorHoy = document.getElementById('visitas-hoy');
        if (contenedorHoy) {
            if (visitasHoy.length > 0) {
                contenedorHoy.innerHTML = visitasHoy.map((visita, index) => `
                    <div class="visita-item" data-index="${index}">
                        <strong>👤 ${visita.nombre || 'Cliente'}</strong>
                        <div>📍 ${visita.direccion || 'Sin dirección'}</div>
                        <div>🕒 ${visita.hora || '--:--'}</div>
                        <div>📞 ${visita.telefono || 'Sin teléfono'}</div>
                    </div>
                `).join('');
            } else {
                contenedorHoy.innerHTML = '<p class="texto-vacio">No hay visitas programadas para hoy</p>';
            }
        }
        
        return visitasHoy;
        
    } catch (error) {
        console.error('❌ Error cargando agenda:', error);
        return [];
    }
}

// 2. DEFINIR FUNCIÓN PARA CARGAR TODAS LAS VISITAS
function cargarTodasVisitas() {
    console.log("📋 Cargando todas las visitas...");
    
    try {
        const visitas = JSON.parse(localStorage.getItem('visitasAgenda') || '[]');
        
        const contenedorTodas = document.getElementById('todas-visitas');
        if (contenedorTodas) {
            if (visitas.length > 0) {
                contenedorTodas.innerHTML = visitas.map((visita, index) => `
                    <div class="visita-item" data-index="${index}">
                        <div class="visita-header">
                            <strong>${visita.nombre || 'Cliente ' + (index + 1)}</strong>
                            <button onclick="eliminarVisita(${index})" class="btn-eliminar">🗑️</button>
                        </div>
                        <div>📅 ${visita.fecha || 'Sin fecha'}</div>
                        <div>🕒 ${visita.hora || '--:--'}</div>
                        <div>📍 ${visita.direccion || 'Sin dirección'}</div>
                        <div>📞 ${visita.telefono || 'Sin teléfono'}</div>
                        ${visita.notas ? `<div>📝 ${visita.notas}</div>` : ''}
                    </div>
                `).join('');
            } else {
                contenedorTodas.innerHTML = '<p class="texto-vacio">No hay visitas programadas</p>';
            }
        }
        
        return visitas;
        
    } catch (error) {
        console.error('❌ Error cargando todas las visitas:', error);
        return [];
    }
}

// 3. FUNCIÓN PARA ELIMINAR VISITA
function eliminarVisita(index) {
    if (confirm('¿Estás seguro de eliminar esta visita?')) {
        try {
            const visitas = JSON.parse(localStorage.getItem('visitasAgenda') || '[]');
            visitas.splice(index, 1);
            localStorage.setItem('visitasAgenda', JSON.stringify(visitas));
            
            // Recargar las listas
            cargarAgendaHoy();
            cargarTodasVisitas();
            
            console.log('✅ Visita eliminada correctamente');
            alert('✅ Visita eliminada correctamente');
        } catch (error) {
            console.error('❌ Error eliminando visita:', error);
            alert('❌ Error eliminando visita');
        }
    }
}

// 4. FUNCIÓN PARA AGREGAR NUEVA VISITA
function agregarNuevaVisita(event) {
    if (event) event.preventDefault();
    
    try {
        // Obtener valores del formulario
        const nombre = document.getElementById('visita-nombre')?.value || 'Cliente';
        const direccion = document.getElementById('visita-direccion')?.value || '';
        const fecha = document.getElementById('visita-fecha')?.value || new Date().toISOString().split('T')[0];
        const hora = document.getElementById('visita-hora')?.value || '12:00';
        const telefono = document.getElementById('visita-telefono')?.value || '';
        const notas = document.getElementById('visita-notas')?.value || '';
        
        // Crear objeto visita
        const nuevaVisita = {
            id: 'VISITA_' + Date.now(),
            nombre: nombre,
            direccion: direccion,
            fecha: fecha,
            hora: hora,
            telefono: telefono,
            notas: notas,
            fechaCreacion: new Date().toISOString()
        };
        
        // Guardar en localStorage
        const visitas = JSON.parse(localStorage.getItem('visitasAgenda') || '[]');
        visitas.push(nuevaVisita);
        localStorage.setItem('visitasAgenda', JSON.stringify(visitas));
        
        // Recargar listas
        cargarAgendaHoy();
        cargarTodasVisitas();
        
        // Limpiar formulario
        if (event && event.target) {
            event.target.reset();
        }
        
        // Mostrar mensaje
        alert('✅ Visita programada correctamente');
        console.log('✅ Nueva visita agregada:', nuevaVisita);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error agregando visita:', error);
        alert('❌ Error al programar visita');
        return false;
    }
}

// 5. INICIALIZAR DATOS DE EJEMPLO SI NO HAY
function inicializarDatosEjemplo() {
    const tieneDatos = localStorage.getItem('visitasAgenda');
    
    if (!tieneDatos) {
        console.log("📝 Inicializando datos de ejemplo...");
        
        const visitasEjemplo = [
            {
                id: 'VISITA_1',
                nombre: 'Joyeria Central',
                direccion: 'Calle Gran Vía 28, Córdoba',
                fecha: new Date().toISOString().split('T')[0],
                hora: '10:00',
                telefono: '957123456',
                notas: 'Robo hace 3 días - Alta prioridad'
            },
            {
                id: 'VISITA_2',
                nombre: 'Electrodomésticos López',
                direccion: 'Avenida de América 45, Lucena',
                fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
                hora: '16:30',
                telefono: '957654321',
                notas: 'Intento de robo la semana pasada'
            }
        ];
        
        localStorage.setItem('visitasAgenda', JSON.stringify(visitasEjemplo));
        console.log("✅ Datos de ejemplo creados");
    }
}

// 6. ESTILOS PARA LA AGENDA
function agregarEstilosAgenda() {
    const estilos = document.createElement('style');
    estilos.textContent = `
        .visita-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #3498db;
        }
        
        .visita-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .btn-eliminar {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #e74c3c;
        }
        
        .btn-eliminar:hover {
            color: #c0392b;
        }
        
        .texto-vacio {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
            padding: 20px;
        }
        
        .visita-item div {
            margin: 5px 0;
            color: #34495e;
        }
        
        .visita-item strong {
            color: #2c3e50;
            font-size: 16px;
        }
    `;
    
    document.head.appendChild(estilos);
}

// 7. EJECUTAR TODO CUANDO LA PÁGINA CARGUE
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔧 Aplicando correcciones para agenda...");
    
    // Añadir estilos
    agregarEstilosAgenda();
    
    // Inicializar datos si no hay
    inicializarDatosEjemplo();
    
    // Cargar agenda
    cargarAgendaHoy();
    cargarTodasVisitas();
    
    // Conectar formulario si existe
    const formulario = document.getElementById('form-visita');
    if (formulario) {
        formulario.addEventListener('submit', agregarNuevaVisita);
    }
    
    console.log("✅ Correcciones aplicadas correctamente");
});

// 8. HACER FUNCIONES DISPONIBLES GLOBALMENTE
window.cargarAgendaHoy = cargarAgendaHoy;
window.cargarTodasVisitas = cargarTodasVisitas;
window.eliminarVisita = eliminarVisita;
window.agregarNuevaVisita = agregarNuevaVisita;

console.log("✅ Fix para agenda cargado. Funciones disponibles:");
console.log("- cargarAgendaHoy()");
console.log("- cargarTodasVisitas()");
console.log("- agregarNuevaVisita(event)");
console.log("- eliminarVisita(index)");
