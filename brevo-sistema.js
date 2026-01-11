// brevo-sistema.js - Sistema de alertas automáticas
// Configurado para DJRISEN - 621284357 - avisosderobos@gmail.com

const BREVO_CONFIG = {
    API_KEY: "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",
    DESTINO_EMAIL: "avisosderobos@gmail.com",
    TU_TELEFONO: "621284357"
};

// ===== FUNCIÓN PRINCIPAL =====
function enviarAlertaBrevo(datos) {
    console.log("📤 Enviando alerta...", datos);
    
    const emailData = {
        "sender": {"name": "Sistema Alertas", "email": "alertas@localizador.dev"},
        "to": [{"email": BREVO_CONFIG.DESTINO_EMAIL, "name": "Responsable"}],
        "subject": `🚨 ${datos.prioridad || "ALERTA"}: ${datos.tipo || "Robo"} en ${datos.poblacion || "Córdoba"}`,
        "htmlContent": `
            <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #e74c3c;">🚨 ALERTA DE ROBO</h2>
                <p><strong>📍 Población:</strong> ${datos.poblacion || "Córdoba"}</p>
                <p><strong>🏠 Dirección:</strong> ${datos.direccion || "No especificada"}</p>
                <p><strong>📅 Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                <p><strong>🕒 Hora:</strong> ${new Date().toLocaleTimeString('es-ES')}</p>
                <p><strong>📝 Detalles:</strong> ${datos.detalles || "Alerta automática"}</p>
                <hr>
                <p><strong>📞 Contacto:</strong> ${BREVO_CONFIG.TU_TELEFONO}</p>
            </div>
        `
    };
    
    fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': BREVO_CONFIG.API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(r => r.json())
    .then(data => {
        console.log("✅ CORREO ENVIADO:", data);
        alert("✅ Alerta enviada a avisosderobos@gmail.com");
    })
    .catch(error => {
        console.error("❌ ERROR:", error);
        alert("❌ Error: " + error.message);
    });
}

// ===== BOTÓN DE PRUEBA =====
function crearBotonPrueba() {
    const boton = document.createElement('button');
    boton.innerHTML = '🚨 PROBAR BREVO';
    boton.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #27ae60; color: white; border: none;
        padding: 12px 20px; border-radius: 25px;
        cursor: pointer; z-index: 9999; font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    boton.onclick = function() {
        enviarAlertaBrevo({
            poblacion: "CÓRDOBA CENTRO",
            direccion: "Calle Prueba Sistema 123",
            tipo: "PRUEBA BREVO - No es robo real",
            prioridad: "ALTA",
            detalles: "Prueba del sistema automático. Revisa avisosderobos@gmail.com"
        });
    };
    
    document.body.appendChild(boton);
}

// ===== INICIAR =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Sistema Brevo cargado");
    crearBotonPrueba();
    
    // Conectar con botones existentes
    setTimeout(function() {
        const botones = document.querySelectorAll('button');
        botones.forEach(boton => {
            if (boton.textContent.includes('🚨') || boton.textContent.includes('Alerta')) {
                boton.addEventListener('click', function() {
                    setTimeout(() => {
                        enviarAlertaBrevo({
                            poblacion: "CÓRDOBA",
                            direccion: "Ubicación reportada",
                            tipo: "Alerta activada",
                            prioridad: "ALTA",
                            detalles: "Generado automáticamente desde Localizador"
                        });
                    }, 1000);
                });
            }
        });
    }, 3000);
});

console.log("✅ Brevo listo. Haz clic en '🚨 PROBAR BREVO'");
