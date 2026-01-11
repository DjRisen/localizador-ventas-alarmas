// ============================================
// SISTEMA DE CORREOS AUTOMÁTICOS - CON TUS CLAVES
// ============================================

// TUS CREDENCIALES REALES DE EMAILJS
const EMAILJS_CREDENCIALES = {
    USER_ID: "oWs_C9225ZOmdBpyU",          // Tu User ID
    SERVICE_ID: "service_pqe8m9c",         // Tu Service ID
    TEMPLATE_ID: "template_zce7mqn",       // Tu Template ID
    EMAIL_DESTINO: "avisosderobos@gmail.com",
    TU_TELEFONO: "621284357"
};

// ============================================
// 1. INICIALIZACIÓN AUTOMÁTICA
// ============================================

console.log("🚀 Cargando sistema de correos automáticos...");

// Función para inicializar EmailJS
function inicializarEmailJS() {
    // Crear script de EmailJS si no existe
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/dist/email.min.js';
        script.onload = function() {
            console.log("✅ EmailJS cargado");
            configurarEmailJS();
        };
        document.head.appendChild(script);
    } else {
        configurarEmailJS();
    }
}

// Configurar EmailJS con tus credenciales
function configurarEmailJS() {
    try {
        emailjs.init(EMAILJS_CREDENCIALES.USER_ID);
        console.log("✅ EmailJS configurado con User ID:", EMAILJS_CREDENCIALES.USER_ID);
        console.log("✅ Service ID:", EMAILJS_CREDENCIALES.SERVICE_ID);
        console.log("✅ Template ID:", EMAILJS_CREDENCIALES.TEMPLATE_ID);
        console.log("✅ Correo destino:", EMAILJS_CREDENCIALES.EMAIL_DESTINO);
        
        // Conectar con tu app
        conectarConTuApp();
        
        // Probar conexión
        setTimeout(probarConexion, 2000);
        
    } catch (error) {
        console.error("❌ Error configurando EmailJS:", error);
    }
}

// ============================================
// 2. FUNCIÓN PRINCIPAL DE ENVÍO
// ============================================

function enviarAlertaAutomatica(datosRobo) {
    console.log("📧 ENVIANDO ALERTA AUTOMÁTICA...");
    
    // Datos que se enviarán (completos)
    const datosCompletos = {
        to_email: EMAILJS_CREDENCIALES.EMAIL_DESTINO,
        
        // Información del robo
        fecha: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
        hora: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        fecha_hora: new Date().toLocaleString('es-ES'),
        
        // Datos del incidente (con valores por defecto)
        poblacion: datosRobo.poblacion || datosRobo.municipio || "Córdoba",
        ubicacion: datosRobo.direccion || datosRobo.ubicacion || "Ubicación no especificada",
        situacion: datosRobo.tipo || datosRobo.situacion || "Alerta de robo",
        prioridad: datosRobo.prioridad || "ALTA",
        detalles: datosRobo.detalles || datosRobo.descripcion || 
                 "Reportado a través del sistema Localizador de Alarmas",
        coordenadas: datosRobo.coordenadas || datosRobo.gps || "No disponibles",
        
        // Información de contacto
        telefono_contacto: EMAILJS_CREDENCIALES.TU_TELEFONO,
        enlace_aplicacion: "https://djrisen.github.io/localizador-ventas-alarmas/",
        
        // Para el mapa
        enlace_mapa: datosRobo.coordenadas ? 
            `https://www.google.com/maps?q=${datosRobo.coordenadas}` :
            `https://www.google.com/maps/search/${encodeURIComponent(datosRobo.direccion || "Córdoba España")}`,
            
        // Identificador único
        id_alerta: "ALERTA_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6)
    };
    
    console.log("📋 Datos preparados para enviar:", datosCompletos);
    
    // ENVIAR CORREO con EmailJS
    emailjs.send(
        EMAILJS_CREDENCIALES.SERVICE_ID,
        EMAILJS_CREDENCIALES.TEMPLATE_ID,
        datosCompletos
    )
    .then(function(response) {
        console.log('✅ ¡CORREO ENVIADO CON ÉXITO!', {
            status: response.status,
            text: response.text,
            hora: new Date().toLocaleTimeString()
        });
        
        // Mostrar notificación
        mostrarNotificacionExito();
        
        // Actualizar contador
        actualizarContadorEnviados();
        
        // Guardar en historial
        guardarEnHistorial(datosCompletos, true);
        
    }, function(error) {
        console.error('❌ ERROR ENVIANDO CORREO:', {
            error: error,
            hora: new Date().toLocaleTimeString()
        });
        
        mostrarNotificacionError();
        guardarEnHistorial(datosCompletos, false);
    });
}

// ============================================
// 3. CONEXIÓN CON TU APP EXISTENTE
// ============================================

function conectarConTuApp() {
    console.log("🔌 Conectando con tu aplicación...");
    
    // OPCIÓN A: Si tu app ya tiene funciones específicas
    if (typeof window.agregarRobo === 'function') {
        console.log("✅ Detectada función 'agregarRobo' - Conectando...");
        conectarFuncionAgregarRobo();
    }
    
    // OPCIÓN B: Observar cambios en la interfaz
    observarInterfaz();
    
    // OPCIÓN C: Conectar con botones específicos
    conectarBotones();
    
    // OPCIÓN D: Monitorear formularios
    monitorearFormularios();
    
    console.log("🎯 Sistema listo para enviar correos automáticamente");
}

// Conectar con función existente de agregar robos
function conectarFuncionAgregarRobo() {
    const funcionOriginal = window.agregarRobo;
    
    window.agregarRobo = function(...args) {
        console.log("🔔 Detectado nuevo robo vía función 'agregarRobo'");
        
        // Ejecutar función original primero
        const resultado = funcionOriginal.apply(this, args);
        
        // Extraer datos del robo
        let datosRobo = {};
        
        if (args.length > 0) {
            if (typeof args[0] === 'object') {
                // Si es un objeto
                datosRobo = {...args[0]};
            } else if (args.length >= 3) {
                // Si son parámetros separados
                datosRobo = {
                    direccion: args[0],
                    detalles: args[1],
                    prioridad: args[2] || 'MEDIA',
                    poblacion: args[3] || 'Córdoba'
                };
            }
        }
        
        // Añadir timestamp
        datosRobo.timestamp = new Date().toISOString();
        
        // Enviar correo después de 2 segundos (para que se complete la UI)
        setTimeout(() => {
            enviarAlertaAutomatica(datosRobo);
        }, 2000);
        
        return resultado;
    };
}

// Observar cambios en la interfaz
function observarInterfaz() {
    // Buscar contenedores de robos
    const contenedores = [
        '#robos-lista',
        '.robos-container',
        '#ultimas-alertas',
        '.alertas-container',
        '[data-robos]',
        '.contenedor-robos'
    ];
    
    let contenedorEncontrado = null;
    
    for (const selector of contenedores) {
        contenedorEncontrado = document.querySelector(selector);
        if (contenedorEncontrado) {
            console.log(`✅ Encontrado contenedor: ${selector}`);
            break;
        }
    }
    
    if (contenedorEncontrado) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((nodo) => {
                        if (nodo.nodeType === 1 && !nodo.dataset.alertaProcesada) {
                            procesarNuevoElemento(nodo);
                        }
                    });
                }
            });
        });
        
        observer.observe(contenedorEncontrado, {
            childList: true,
            subtree: true
        });
        
        console.log("👀 Observador activado para nuevos robos");
    }
}

// Procesar nuevo elemento de robo
function procesarNuevoElemento(elemento) {
    // Marcar como procesado
    elemento.dataset.alertaProcesada = 'true';
    
    // Extraer datos del elemento
    const texto = elemento.textContent || elemento.innerText || '';
    
    const datos = {
        timestamp: new Date().toISOString()
    };
    
    // Buscar población (ej: "CÓRDOBA • Centro Histórico")
    const matchPoblacion = texto.match(/[A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,})*\s*•/);
    if (matchPoblacion) {
        datos.poblacion = matchPoblacion[0].replace('•', '').trim();
    }
    
    // Buscar dirección (ej: "📍 Calle Claudio Marcelo, 25")
    const matchDireccion = texto.match(/📍\s*([^\n]+)/) || 
                          texto.match(/Dirección:\s*([^\n]+)/i) ||
                          texto.match(/(Calle|Av\.|Avenida|Plaza)\s+[^,\n]+\s*\d+/);
    
    if (matchDireccion) {
        datos.direccion = (matchDireccion[1] || matchDireccion[0]).trim();
    }
    
    // Buscar tipo de robo
    if (texto.includes('vivienda')) datos.tipo = 'Robo en vivienda';
    else if (texto.includes('comercio')) datos.tipo = 'Robo en comercio';
    else if (texto.includes('intento')) datos.tipo = 'Intento de robo';
    else datos.tipo = 'Alerta de seguridad';
    
    // Buscar prioridad
    if (texto.includes('ALTA')) datos.prioridad = 'ALTA';
    else if (texto.includes('MEDIA')) datos.prioridad = 'MEDIA';
    else datos.prioridad = 'MEDIA';
    
    // Tomar primeros 150 caracteres como detalles
    datos.detalles = texto.substring(0, 150).trim() + 
                    (texto.length > 150 ? '...' : '');
    
    // Si tenemos datos suficientes, enviar alerta
    if (datos.direccion || datos.poblacion) {
        console.log("🆕 Nuevo robo detectado en UI:", datos);
        enviarAlertaAutomatica(datos);
    }
}

// Conectar botones específicos
function conectarBotones() {
    // Buscar botones de alerta/robo
    const botones = document.querySelectorAll('button, [role="button"], .btn, .boton');
    
    botones.forEach(boton => {
        const textoBtn = (boton.textContent || boton.innerText || '').toLowerCase();
        
        if (textoBtn.includes('robo') || textoBtn.includes('alerta') || 
            textoBtn.includes('enviar') || textoBtn.includes('notificar')) {
            
            boton.addEventListener('click', function() {
                console.log("🖱️ Clic en botón de alerta detectado");
                
                // Buscar datos en formularios cercanos
                const formulario = boton.closest('form');
                if (formulario) {
                    setTimeout(() => {
                        const datosForm = extraerDatosFormulario(formulario);
                        if (datosForm.direccion || datosForm.detalles) {
                            enviarAlertaAutomatica(datosForm);
                        }
                    }, 1000);
                }
            }, true);
        }
    });
}

// Monitorear formularios
function monitorearFormularios() {
    const formularios = document.querySelectorAll('form');
    
    formularios.forEach(form => {
        form.addEventListener('submit', function(e) {
            console.log("📝 Formulario enviado detectado");
            
            // Extraer datos del formulario
            const datosForm = extraerDatosFormulario(form);
            
            // Enviar alerta después de 1.5 segundos
            setTimeout(() => {
                if (datosForm.direccion || datosForm.detalles) {
                    enviarAlertaAutomatica(datosForm);
                }
            }, 1500);
        });
    });
}

// Extraer datos de formulario
function extraerDatosFormulario(formulario) {
    const datos = {};
    const inputs = formulario.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const nombre = input.name || input.id || input.placeholder;
        const valor = input.value;
        
        if (nombre && valor) {
            const nombreLower = nombre.toLowerCase();
            
            if (nombreLower.includes('direccion') || nombreLower.includes('ubicacion')) {
                datos.direccion = valor;
            } else if (nombreLower.includes('poblacion') || nombreLower.includes('municipio') || nombreLower.includes('ciudad')) {
                datos.poblacion = valor;
            } else if (nombreLower.includes('detalle') || nombreLower.includes('descripcion') || nombreLower.includes('nota')) {
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
// 4. FUNCIONES DE INTERFAZ Y NOTIFICACIONES
// ============================================

function mostrarNotificacionExito() {
    crearNotificacion(
        '✅ Alerta enviada por correo automáticamente',
        '#4CAF50',
        'check_circle'
    );
}

function mostrarNotificacionError() {
    crearNotificacion(
        '❌ Error enviando correo. Revisa la consola (F12)',
        '#f44336',
        'error'
    );
}

function crearNotificacion(mensaje, color, icono) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${color};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 99999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        border-left: 5px solid ${color === '#4CAF50' ? '#2E7D32' : '#C62828'};
    `;
    
    notificacion.innerHTML = `
        <span style="font-size: 20px;">${icono === 'check_circle' ? '✅' : '❌'}</span>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Añadir animación si no existe
    if (!document.querySelector('#animacion-notificaciones')) {
        const style = document.createElement('style');
        style.id = 'animacion-notificaciones';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 5000);
}

function actualizarContadorEnviados() {
    // Buscar y actualizar contadores
    const contadores = [
        document.querySelector('#alertas-enviadas'),
        document.querySelector('.contador-alertas'),
        document.querySelector('[data-alertas]')
    ];
    
    contadores.forEach(contador => {
        if (contador) {
            const actual = parseInt(contador.textContent) || 0;
            contador.textContent = actual + 1;
        }
    });
}

function guardarEnHistorial(datos, exitoso) {
    try {
        const entrada = {
            id: datos.id_alerta || 'hist_' + Date.now(),
            timestamp: new Date().toISOString(),
            datos: datos,
            exitoso: exitoso
        };
        
        const historial = JSON.parse(localStorage.getItem('alertasHistorial') || '[]');
        historial.unshift(entrada);
        localStorage.setItem('alertasHistorial', JSON.stringify(historial.slice(0, 50)));
        
        console.log('📝 Registro guardado en historial local');
    } catch (e) {
        console.error('Error guardando historial:', e);
    }
}

// ============================================
// 5. FUNCIONES DE PRUEBA Y DIAGNÓSTICO
// ============================================

function probarConexion() {
    console.log("🧪 Probando conexión con EmailJS...");
    
    if (typeof emailjs === 'undefined') {
        console.log("⚠️ EmailJS aún no cargado, reintentando...");
        setTimeout(probarConexion, 1000);
        return;
    }
    
    // Crear datos de prueba
    const datosPrueba = {
        to_email: EMAILJS_CREDENCIALES.EMAIL_DESTINO,
        fecha_hora: new Date().toLocaleString('es-ES'),
        poblacion: "CÓRDOBA (PRUEBA)",
        ubicacion: "Calle Prueba del Sistema 123",
        situacion: "PRUEBA DEL SISTEMA - No es un robo real",
        prioridad: "MEDIA",
        detalles: "Esta es una prueba automática del sistema de correos. Si recibes esto, ¡el sistema funciona correctamente!",
        telefono_contacto: EMAILJS_CREDENCIALES.TU_TELEFONO,
        id_alerta: "PRUEBA_" + Date.now()
    };
    
    console.log("📤 Enviando correo de prueba...");
    
    emailjs.send(
        EMAILJS_CREDENCIALES.SERVICE_ID,
        EMAILJS_CREDENCIALES.TEMPLATE_ID,
        datosPrueba
    )
    .then(() => {
        console.log("🎉 ¡PRUEBA EXITOSA! El sistema de correos funciona correctamente");
        console.log("📩 Revisa tu correo: avisosderobos@gmail.com");
    })
    .catch((error) => {
        console.error("❌ PRUEBA FALLIDA. Revisa:", {
            error: error,
            user_id: EMAILJS_CREDENCIALES.USER_ID,
            service_id: EMAILJS_CREDENCIALES.SERVICE_ID,
            template_id: EMAILJS_CREDENCIALES.TEMPLATE_ID
        });
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
    enviarAlertaAutomatica(datosPrueba);
    return "✅ Prueba iniciada. Revisa la consola y tu correo.";
};

// Función para ver estado
window.verEstadoCorreos = function() {
    return {
        configurado: typeof emailjs !== 'undefined',
        user_id: EMAILJS_CREDENCIALES.USER_ID,
        service_id: EMAILJS_CREDENCIALES.SERVICE_ID,
        template_id: EMAILJS_CREDENCIALES.TEMPLATE_ID,
        destino: EMAILJS_CREDENCIALES.EMAIL_DESTINO,
        historial: JSON.parse(localStorage.getItem('alertasHistorial') || '[]').length
    };
};

// ============================================
// 6. INICIAR TODO AUTOMÁTICAMENTE
// ============================================

// Esperar a que la página cargue
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarEmailJS);
} else {
    inicializarEmailJS();
}

// Mensaje de bienvenida
console.log("=========================================");
console.log("🚨 SISTEMA DE CORREOS AUTOMÁTICOS CARGADO");
console.log("=========================================");
console.log("Credenciales configuradas correctamente");
console.log("📧 Correo destino: avisosderobos@gmail.com");
console.log("📱 Teléfono contacto: 621284357");
console.log("-----------------------------------------");
console.log("Comandos disponibles en consola:");
console.log("• probarSistemaCorreos() - Envía prueba");
console.log("• verEstadoCorreos() - Muestra estado");
console.log("=========================================");
