// ============================================
// SISTEMA DE CORREOS AUTOMÁTICOS PARA LOCALIZADOR DE ALARMAS
// Versión 1.0 - Con tus credenciales reales de EmailJS
// ============================================

// TUS CREDENCIALES DE EMAILJS (NO MODIFICAR)
const EMAILJS_CONFIG = {
    USER_ID: "oWs_C9225ZOmdBpyU",          // Tu User ID
    SERVICE_ID: "service_pqe8m9c",         // Tu Service ID
    TEMPLATE_ID: "template_zce7mqn",       // Tu Template ID
    EMAIL_DESTINO: "avisosderobos@gmail.com",
    TU_TELEFONO: "621284357",
    APP_URL: "https://djrisen.github.io/localizador-ventas-alarmas/"
};

// ============================================
// 1. INICIALIZACIÓN DEL SISTEMA
// ============================================

console.log("🚀 Iniciando sistema de correos automáticos...");

// Cargar EmailJS automáticamente
(function cargarEmailJS() {
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/dist/email.min.js';
        script.onload = function() {
            console.log("✅ EmailJS cargado correctamente");
            inicializarSistemaCorreos();
        };
        script.onerror = function() {
            console.error("❌ Error cargando EmailJS");
        };
        document.head.appendChild(script);
    } else {
        inicializarSistemaCorreos();
    }
})();

// Inicializar el sistema
function inicializarSistemaCorreos() {
    try {
        // Configurar EmailJS con tu User ID
        emailjs.init(EMAILJS_CONFIG.USER_ID);
        console.log("✅ EmailJS configurado con User ID:", EMAILJS_CONFIG.USER_ID.substring(0, 10) + "...");
        
        // Conectar con tu aplicación
        conectarConAppLocalizador();
        
        // Activar observadores
        activarObservadoresRobos();
        
        // Probar conexión automáticamente
        setTimeout(probarConexionAutomatica, 3000);
        
        console.log("🎯 Sistema de correos listo. Esperando robos...");
        
    } catch (error) {
        console.error("❌ Error inicializando sistema de correos:", error);
    }
}

// ============================================
// 2. FUNCIÓN PRINCIPAL DE ENVÍO
// ============================================

function enviarAlertaCorreoAutomatica(datosRobo) {
    console.log("📧 ENVIANDO ALERTA AUTOMÁTICA:", datosRobo);
    
    // Completar datos faltantes
    const datosCompletos = {
        to_email: EMAILJS_CONFIG.EMAIL_DESTINO,
        
        // Fecha y hora
        fecha: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
        hora: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        fecha_hora: new Date().toLocaleString('es-ES'),
        
        // Datos del robo (con valores por defecto)
        poblacion: datosRobo.poblacion || datosRobo.municipio || "Córdoba",
        ubicacion: datosRobo.direccion || datosRobo.ubicacion || "Ubicación no especificada",
        situacion: datosRobo.tipo || datosRobo.situacion || "Alerta de robo",
        prioridad: datosRobo.prioridad || "MEDIA",
        detalles: datosRobo.detalles || datosRobo.descripcion || 
                 "Incidente reportado a través del sistema Localizador de Alarmas",
        coordenadas: datosRobo.coordenadas || datosRobo.gps || "No disponibles",
        
        // Información de contacto
        telefono_contacto: EMAILJS_CONFIG.TU_TELEFONO,
        enlace_aplicacion: EMAILJS_CONFIG.APP_URL,
        
        // Enlace a Google Maps
        enlace_mapa: datosRobo.coordenadas ? 
            `https://www.google.com/maps?q=${datosRobo.coordenadas}` :
            `https://www.google.comaps/search/${encodeURIComponent(datosRobo.direccion || "Córdoba")}`,
        
        // ID único de alerta
        id_alerta: "ALERTA_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6)
    };
    
    console.log("📋 Datos preparados para EmailJS:", datosCompletos);
    
    // Enviar correo usando EmailJS
    emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        datosCompletos
    )
    .then(function(response) {
        console.log('✅ ¡CORREO ENVIADO CON ÉXITO!', {
            status: response.status,
            text: response.text,
            hora: new Date().toLocaleTimeString()
        });
        
        // Mostrar notificación en pantalla
        mostrarNotificacion('📧 Alerta enviada por correo automáticamente', 'success');
        
        // Actualizar contador en la interfaz
        actualizarContadorAlertas();
        
        // Guardar en historial local
        guardarEnHistorial(datosCompletos, true);
        
    }, function(error) {
        console.error('❌ ERROR ENVIANDO CORREO:', error);
        
        mostrarNotificacion('❌ Error enviando correo', 'error');
        guardarEnHistorial(datosCompletos, false);
    });
}

// ============================================
// 3. CONEXIÓN CON TU APLICACIÓN LOCALIZADOR
// ============================================

function conectarConAppLocalizador() {
    console.log("🔌 Conectando con Localizador de Alarmas...");
    
    // Opción 1: Si tu app tiene función global para agregar robos
    if (typeof window.agregarRobo === 'function') {
        console.log("✅ Detectada función 'agregarRobo' - Interceptando...");
        interceptarFuncionAgregarRobo();
    }
    
    // Opción 2: Observar la lista de robos en tiempo real
    observarListaRobosTiempoReal();
    
    // Opción 3: Conectar con botones específicos
    conectarBotonesAlerta();
    
    // Opción 4: Monitorear formularios de reporte
    monitorearFormulariosReporte();
}

// Interceptar función existente de agregar robos
function interceptarFuncionAgregarRobo() {
    const funcionOriginal = window.agregarRobo;
    
    window.agregarRobo = function(...args) {
        console.log("🔔 Interceptando nuevo robo agregado...");
        
        // Ejecutar la función original
        const resultado = funcionOriginal.apply(this, args);
        
        // Extraer datos del robo de los argumentos
        let datosRobo = {};
        
        if (args.length > 0) {
            if (typeof args[0] === 'object') {
                datosRobo = { ...args[0] };
            } else if (typeof args[0] === 'string') {
                datosRobo = {
                    direccion: args[0],
                    detalles: args[1] || '',
                    prioridad: args[2] || 'MEDIA',
                    poblacion: args[3] || 'Córdoba'
                };
            }
        }
        
        // Añadir timestamp
        datosRobo.timestamp = new Date().toISOString();
        
        // Enviar correo después de 1 segundo (para que se complete la UI)
        setTimeout(() => {
            enviarAlertaCorreoAutomatica(datosRobo);
        }, 1000);
        
        return resultado;
    };
}

// Observar lista de robos en tiempo real
function observarListaRobosTiempoReal() {
    // Buscar contenedor de robos en tu aplicación
    const selectores = [
        '#robos-lista',
        '.robos-container',
        '#ultimas-alertas',
        '.alertas-container',
        '[data-robos]',
        '.contenedor-robos',
        '.robos-geolocalizados'
    ];
    
    let contenedorRobos = null;
    
    for (const selector of selectores) {
        contenedorRobos = document.querySelector(selector);
        if (contenedorRobos) {
            console.log(`✅ Encontrado contenedor de robos: ${selector}`);
            break;
        }
    }
    
    if (!contenedorRobos) {
        console.log("⏳ No se encontró contenedor de robos, reintentando en 2 segundos...");
        setTimeout(observarListaRobosTiempoReal, 2000);
        return;
    }
    
    // Configurar MutationObserver para detectar nuevos robos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(nodo) {
                    if (nodo.nodeType === 1 && !nodo.dataset.correoEnviado) {
                        procesarNuevoElementoRobo(nodo);
                    }
                });
            }
        });
    });
    
    // Iniciar observación
    observer.observe(contenedorRobos, {
        childList: true,
        subtree: true
    });
    
    console.log("👀 Observador de robos activado");
}

// Procesar nuevo elemento de robo
function procesarNuevoElementoRobo(elemento) {
    // Marcar como procesado
    elemento.dataset.correoEnviado = 'true';
    
    // Extraer datos del elemento HTML
    const datosRobo = extraerDatosDeElemento(elemento);
    
    // Si tenemos datos suficientes, enviar alerta
    if (datosRobo.direccion || datosRobo.poblacion) {
        console.log("🆕 Nuevo robo detectado en la interfaz:", datosRobo);
        enviarAlertaCorreoAutomatica(datosRobo);
    }
}

// Extraer datos de un elemento HTML de robo
function extraerDatosDeElemento(elemento) {
    const texto = elemento.textContent || elemento.innerText || '';
    const datos = {
        timestamp: new Date().toISOString()
    };
    
    // Extraer población (ej: "CÓRDOBA • Centro Histórico")
    const matchPoblacion = texto.match(/[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,})*\s*•/);
    if (matchPoblacion) {
        datos.poblacion = matchPoblacion[0].replace('•', '').trim();
    }
    
    // Extraer dirección
    const matchDireccion = texto.match(/📍\s*([^\n]+)/) || 
                          texto.match(/Dirección:\s*([^\n]+)/i) ||
                          texto.match(/(Calle|Av\.|Avenida|Plaza)\s+[^,\n]+\s*\d+/);
    
    if (matchDireccion) {
        datos.direccion = (matchDireccion[1] || matchDireccion[0]).trim();
    }
    
    // Extraer tipo de robo
    if (texto.includes('vivienda')) datos.tipo = 'Robo en vivienda';
    else if (texto.includes('comercio')) datos.tipo = 'Robo en comercio';
    else if (texto.includes('intento')) datos.tipo = 'Intento de robo';
    else datos.tipo = 'Alerta de seguridad';
    
    // Extraer prioridad
    if (texto.includes('ALTA')) datos.prioridad = 'ALTA';
    else if (texto.includes('MEDIA')) datos.prioridad = 'MEDIA';
    else datos.prioridad = 'MEDIA';
    
    // Usar primeros 100 caracteres como detalles
    datos.detalles = texto.substring(0, 100).trim() + 
                    (texto.length > 100 ? '...' : '');
    
    return datos;
}

// Conectar con botones de alerta
function conectarBotonesAlerta() {
    // Buscar botones que puedan indicar robos
    const botones = document.querySelectorAll('button, [role="button"], .btn');
    
    botones.forEach(boton => {
        const texto = (boton.textContent || boton.innerText || '').toLowerCase();
        const onclick = boton.getAttribute('onclick') || '';
        
        if (texto.includes('robo') || texto.includes('alerta') || 
            texto.includes('enviar') || onclick.includes('robo')) {
            
            boton.addEventListener('click', function() {
                console.log("🖱️ Clic en botón de alerta detectado");
                
                // Buscar formulario relacionado
                const formulario = boton.closest('form');
                if (formulario) {
                    setTimeout(() => {
                        const datos = extraerDatosDeFormulario(formulario);
                        if (datos.direccion || datos.detalles) {
                            enviarAlertaCorreoAutomatica(datos);
                        }
                    }, 1500);
                }
            }, true);
        }
    });
}

// Monitorear formularios de reporte
function monitorearFormulariosReporte() {
    const formularios = document.querySelectorAll('form');
    
    formularios.forEach(form => {
        form.addEventListener('submit', function(e) {
            console.log("📝 Formulario enviado detectado");
            
            // Extraer datos del formulario
            const datosForm = extraerDatosDeFormulario(form);
            
            // Enviar alerta después de 1 segundo
            setTimeout(() => {
                if (datosForm.direccion || datosForm.detalles) {
                    enviarAlertaCorreoAutomatica(datosForm);
                }
            }, 1000);
        });
    });
}

// Extraer datos de formulario
function extraerDatosDeFormulario(formulario) {
    const datos = {};
    const inputs = formulario.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const nombre = input.name || input.id || input.placeholder;
        const valor = input.value;
        
        if (nombre && valor) {
            const nombreLower = nombre.toLowerCase();
            
            if (nombreLower.includes('direccion') || nombreLower.includes('ubicacion')) {
                datos.direccion = valor;
            } else if (nombreLower.includes('poblacion') || nombreLower.includes('municipio')) {
                datos.poblacion = valor;
            } else if (nombreLower.includes('detalle') || nombreLower.includes('descripcion')) {
                datos.detalles = valor;
            } else if (nombreLower.includes('tipo')) {
                datos.tipo = valor;
            } else if (nombreLower.includes('prioridad')) {
                datos.prioridad = valor;
            }
        }
    });
    
    return datos;
}

// ============================================
// 4. FUNCIONES AUXILIARES
// ============================================

// Mostrar notificación en pantalla
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.id = 'notificacion-correo-' + Date.now();
    
    // Estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 350px;
        animation: slideIn 0.3s ease;
        border-left: 5px solid ${tipo === 'success' ? '#2E7D32' : '#C62828'};
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Icono
    const icono = tipo === 'success' ? '✅' : '❌';
    
    notificacion.innerHTML = `
        <span style="font-size: 20px;">${icono}</span>
        <div>
            <strong>${tipo === 'success' ? 'Éxito' : 'Error'}</strong><br>
            ${mensaje}
        </div>
    `;
    
    // Añadir al documento
    document.body.appendChild(notificacion);
    
    // Añadir animaciones CSS si no existen
    if (!document.querySelector('#estilos-animaciones')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-animaciones';
        estilos.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(estilos);
    }
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 5000);
}

// Actualizar contador de alertas en la interfaz
function actualizarContadorAlertas() {
    // Buscar elementos que muestren contadores
    const elementos = [
        document.querySelector('#alertas-enviadas'),
        document.querySelector('.contador-alertas'),
        document.querySelector('[data-alertas]'),
        document.querySelector('.alertas-enviadas')
    ];
    
    elementos.forEach(elemento => {
        if (elemento) {
            try {
                const actual = parseInt(elemento.textContent) || 0;
                elemento.textContent = actual + 1;
            } catch (e) {
                // Ignorar errores
            }
        }
    });
}

// Guardar en historial local
function guardarEnHistorial(datos, exitoso) {
    try {
        const registro = {
            id: datos.id_alerta || 'hist_' + Date.now(),
            timestamp: new Date().toISOString(),
            datos: datos,
            exitoso: exitoso,
            destino: EMAILJS_CONFIG.EMAIL_DESTINO
        };
        
        const historial = JSON.parse(localStorage.getItem('historialAlertas') || '[]');
        historial.unshift(registro);
        localStorage.setItem('historialAlertas', JSON.stringify(historial.slice(0, 100)));
        
        console.log('📝 Registro guardado en historial local');
    } catch (e) {
        console.error('❌ Error guardando en historial:', e);
    }
}

// Activar observadores adicionales
function activarObservadoresRobos() {
    // También observar cambios en datos almacenados
    setInterval(() => {
        // Puedes añadir lógica adicional aquí si es necesario
    }, 60000); // Cada minuto
}

// ============================================
// 5. FUNCIONES DE PRUEBA Y DIAGNÓSTICO
// ============================================

// Probar conexión automáticamente
function probarConexionAutomatica() {
    console.log("🧪 Probando conexión con EmailJS...");
    
    if (typeof emailjs === 'undefined') {
        console.log("⚠️ EmailJS aún no cargado, reintentando...");
        setTimeout(probarConexionAutomatica, 1000);
        return;
    }
    
    // Datos de prueba
    const datosPrueba = {
        to_email: EMAILJS_CONFIG.EMAIL_DESTINO,
        fecha_hora: new Date().toLocaleString('es-ES'),
        poblacion: "CÓRDOBA (PRUEBA DEL SISTEMA)",
        ubicacion: "Calle Prueba del Sistema 123",
        situacion: "PRUEBA AUTOMÁTICA - No es un robo real",
        prioridad: "MEDIA",
        detalles: "Esta es una prueba automática del sistema de correos. Si recibes este mensaje, significa que el sistema está funcionando correctamente.",
        telefono_contacto: EMAILJS_CONFIG.TU_TELEFONO,
        id_alerta: "PRUEBA_" + Date.now()
    };
    
    console.log("📤 Enviando correo de prueba...");
    
    emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        datosPrueba
    )
    .then(() => {
        console.log("🎉 ¡PRUEBA EXITOSA! El sistema de correos funciona");
        console.log("📩 Revisa tu correo: avisosderobos@gmail.com");
    })
    .catch((error) => {
        console.error("❌ PRUEBA FALLIDA. Revisa configuración:", error);
    });
}

// Función para probar manualmente desde la consola
window.probarSistemaCorreos = function() {
    const datosPrueba = {
        poblacion: "LUCENA",
        direccion: "Calle Sistema de Pruebas 456",
        tipo: "Robo en comercio - PRUEBA MANUAL",
        prioridad: "ALTA",
        detalles: "Prueba manual ejecutada desde la consola del navegador. Revisa tu correo avisosderobos@gmail.com",
        coordenadas: "37.408800, -4.485400"
    };
    
    console.log("🧪 Ejecutando prueba manual...");
    enviarAlertaCorreoAutomatica(datosPrueba);
    return "✅ Prueba iniciada. Revisa la consola y tu correo.";
};

// Función para ver estado del sistema
window.verEstadoCorreos = function() {
    return {
        configurado: typeof emailjs !== 'undefined',
        user_id: EMAILJS_CONFIG.USER_ID,
        service_id: EMAILJS_CONFIG.SERVICE_ID,
        template_id: EMAILJS_CONFIG.TEMPLATE_ID,
        destino: EMAILJS_CONFIG.EMAIL_DESTINO,
        telefono: EMAILJS_CONFIG.TU_TELEFONO,
        historial: JSON.parse(localStorage.getItem('historialAlertas') || '[]').length
    };
};

// Función para ver historial de envíos
window.verHistorialCorreos = function() {
    const historial = JSON.parse(localStorage.getItem('historialAlertas') || '[]');
    console.table(historial.map(item => ({
        Fecha: new Date(item.timestamp).toLocaleString(),
        Población: item.datos.poblacion,
        Ubicación: item.datos.ubicacion,
        Estado: item.exitoso ? '✅' : '❌'
    })));
    return historial;
};

// ============================================
// 6. MENSAJE DE INICIO
// ============================================

console.log("=========================================");
console.log("🚨 SISTEMA DE CORREOS AUTOMÁTICOS");
console.log("=========================================");
console.log("📧 Correo destino: avisosderobos@gmail.com");
console.log("📱 Teléfono contacto: 621284357");
console.log("🌐 Aplicación: " + EMAILJS_CONFIG.APP_URL);
console.log("-----------------------------------------");
console.log("Comandos disponibles en consola (F12):");
console.log("• probarSistemaCorreos() - Envía prueba");
console.log("• verEstadoCorreos()    - Muestra estado");
console.log("• verHistorialCorreos() - Ver historial");
console.log("=========================================");
