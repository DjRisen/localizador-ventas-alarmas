#!/usr/bin/env python3
"""
⚙️ CONFIGURACIÓN DEL SISTEMA DE ALERTAS
Modifica estos valores con TUS datos
"""

CONFIG = {
    # TU INFORMACIÓN
    "EMAIL_DESTINO": "avisosderobos@gmail.com",  # Donde recibir alertas
    "TU_TELEFONO": "621284357",
    "TU_NOMBRE": "Sistema Alertas Robos",
    
    # CONFIGURACIÓN CORREO (elige UN método)
    "EMAIL_REMITENTE": "tucorreo@gmail.com",  # Correo que envía
    
    # OPCIÓN 1: GMAIL (necesita contraseña de aplicación)
    "EMAIL_PASSWORD": "tu_contraseña_de_aplicacion",  # Dejar vacío si no usas
    
    # OPCIÓN 2: SMTP2Go (crear cuenta en smtp2go.com)
    "SMTP2GO_USER": "tu_usuario_smtp2go",
    "SMTP2GO_PASS": "tu_password_smtp2go",
    
    # OPCIÓN 3: Brevo (crear cuenta en brevo.com)
    "BREVO_API_KEY": "tu_api_key_brevo",
    
    # OPCIÓN 4: EmailJS (crear cuenta en emailjs.com)
    "EMAILJS_SERVICE_ID": "service_xxxxxx",
    "EMAILJS_TEMPLATE_ID": "template_xxxxxx",
    "EMAILJS_USER_ID": "user_xxxxxx",
    
    # ZONA DE MONITOREO
    "ZONA_MONITOREO": "Córdoba y pueblos (Lucena, Puente Genil, Montilla, etc.)",
    
    # CONFIGURACIÓN SISTEMA
    "INTERVALO_BUSQUEDA": 300,  # segundos entre búsquedas (300 = 5 minutos)
    "ACTIVAR_NOTIFICACIONES": True,
    
    # FUENTES DE DATOS
    "TWITTER_ACTIVO": True,
    "NOTICIAS_ACTIVO": True,
    "RSS_FEEDS": [
        "https://cordopolis.es/feed/",
        "https://www.diariocordoba.com/rss/",
        "https://www.abc.es/rss/feeds/abc_Cordoba.xml"
    ],
    
    # PUEBLOS DE CÓRDOBA A MONITOREAR
    "PUEBLOS_CORDOBA": [
        "Lucena", "Puente Genil", "Montilla", "Priego de Córdoba",
        "Cabra", "Baena", "La Carlota", "Fernán-Núñez",
        "Villanueva de Córdoba", "Aguilar de la Frontera",
        "Rute", "Palma del Río", "Posadas", "Almodóvar del Río",
        "Bujalance", "Castro del Río", "Espejo", "Santaella"
    ]
}

# No modificar lo siguiente
import os
import sys

def verificar_configuracion():
    """Verifica que la configuración sea válida"""
    errores = []
    
    if not CONFIG["EMAIL_DESTINO"]:
        errores.append("EMAIL_DESTINO no configurado")
    
    if not CONFIG["EMAIL_REMITENTE"]:
        errores.append("EMAIL_REMITENTE no configurado")
    
    # Verificar que hay al menos un método de envío
    metodos = [
        CONFIG.get("EMAIL_PASSWORD"),
        CONFIG.get("SMTP2GO_USER"),
        CONFIG.get("BREVO_API_KEY"),
        CONFIG.get("EMAILJS_SERVICE_ID")
    ]
    
    if not any(metodos):
        errores.append("Configura al menos UN método de envío (Gmail, SMTP2Go, Brevo o EmailJS)")
    
    if errores:
        print("❌ ERRORES DE CONFIGURACIÓN:")
        for error in errores:
            print(f"   • {error}")
        print("\n💡 Solución:")
        print("   1. Edita config.py con tus datos")
        print("   2. Crea cuenta en alguno de estos servicios gratuitos:")
        print("      - Gmail (con contraseña de aplicación)")
        print("      - SMTP2Go (smtp2go.com)")
        print("      - Brevo (brevo.com)")
        print("      - EmailJS (emailjs.com)")
        return False
    
    return True

if __name__ == "__main__":
    print("⚙️ Verificando configuración...")
    if verificar_configuracion():
        print("✅ Configuración OK")
    else:
        print("❌ Revisa config.py")
