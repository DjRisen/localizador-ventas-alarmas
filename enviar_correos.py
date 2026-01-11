#!/usr/bin/env python3
"""
📧 SISTEMA DE ENVÍO DE CORREOS GRATUITO
Usa servicios gratuitos para enviar alertas automáticas
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import json
from datetime import datetime
import time

# Importar configuración
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import CONFIG

def enviar_correo_gmail(destinatario, asunto, mensaje):
    """
    Envía correo usando Gmail (necesita contraseña de aplicación)
    """
    try:
        # Configuración
        remitente = CONFIG['EMAIL_REMITENTE']
        password = CONFIG['EMAIL_PASSWORD']
        
        # Crear mensaje
        msg = MIMEMultipart('alternative')
        msg['Subject'] = asunto
        msg['From'] = remitente
        msg['To'] = destinatario
        
        # Versión HTML del mensaje
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{asunto}</title>
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
                .header {{ color: #e74c3c; text-align: center; border-bottom: 2px solid #e74c3c; padding-bottom: 10px; }}
                .alert-box {{ margin: 20px 0; padding: 15px; background-color: #fff8e1; border-left: 4px solid #ff9800; }}
                .info-box {{ margin: 15px 0; padding: 10px; background-color: #e8f5e9; border-radius: 5px; }}
                .footer {{ margin-top: 20px; text-align: center; color: #777; font-size: 12px; }}
                .priority-alta {{ background-color: #ffebee; border-left: 4px solid #f44336; }}
                .priority-media {{ background-color: #fff3e0; border-left: 4px solid #ff9800; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2 class="header">🚨 {asunto}</h2>
                
                <div class="alert-box">
                    <h3>📋 INFORMACIÓN DEL INCIDENTE</h3>
                    <p>{mensaje.replace(chr(10), '<br>')}</p>
                </div>
                
                <div class="info-box">
                    <h4>⚡ ACCIÓN RECOMENDADA</h4>
                    <p>• Contactar con el afectado en las próximas 24 horas</p>
                    <p>• Ofrecer sistema de seguridad anti-robos</p>
                    <p>• Presentar presupuesto personalizado</p>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <a href="https://djrisen.github.io/localizador-ventas-alarmas/" 
                       style="background-color: #3498db; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                       📱 ABRIR LOCALIZADOR DE ALARMAS
                    </a>
                </div>
                
                <div class="footer">
                    <p>⚠️ Alerta automática generada el {datetime.now().strftime('%d/%m/%Y a las %H:%M:%S')}</p>
                    <p>Sistema de Monitorización de Robos - Córdoba y pueblos</p>
                    <p>📞 Contacto: 621284357 | 📧 avisosderobos@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        # Enviar correo
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(remitente, password)
            server.send_message(msg)
        
        print(f"   ✅ Correo enviado a {destinatario}")
        return True
        
    except Exception as e:
        print(f"   ❌ Error Gmail: {str(e)}")
        return False

def enviar_correo_smtp2go(destinatario, asunto, mensaje):
    """
    Envía correo usando SMTP2Go (servicio gratuito - 1000 emails/mes)
    """
    try:
        # SMTP2Go - Servicio gratuito
        smtp_server = "mail.smtp2go.com"
        smtp_port = 587  # O 2525, 8025
        username = "TU_USUARIO_SMTP2GO"  # Crear cuenta en smtp2go.com
        password = "TU_PASSWORD_SMTP2GO"
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = asunto
        msg['From'] = CONFIG['EMAIL_REMITENTE']
        msg['To'] = destinatario
        
        # Mensaje simple
        text = f"ALERTA DE ROBO\n\n{mensaje}\n\nFecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}"
        msg.attach(MIMEText(text, 'plain'))
        
        # Enviar
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(msg)
        
        print(f"   ✅ Correo enviado vía SMTP2Go")
        return True
        
    except Exception as e:
        print(f"   ❌ Error SMTP2Go: {e}")
        return False

def enviar_correo_brevo(destinatario, asunto, mensaje):
    """
    Envía correo usando Brevo (antes Sendinblue) - 300 emails/día gratis
    """
    try:
        # Brevo API (Sendinblue)
        api_key = "TU_API_KEY_BREVO"  # Registrarse en brevo.com
        url = "https://api.brevo.com/v3/smtp/email"
        
        payload = {
            "sender": {
                "name": "Sistema Alertas Robos",
                "email": CONFIG['EMAIL_REMITENTE']
            },
            "to": [{"email": destinatario}],
            "subject": asunto,
            "htmlContent": f"""
            <h2>{asunto}</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                <pre style="font-family: Arial, sans-serif;">{mensaje}</pre>
            </div>
            <p><small>Enviado el {datetime.now().strftime('%d/%m/%Y %H:%M')}</small></p>
            """
        }
        
        headers = {
            "accept": "application/json",
            "api-key": api_key,
            "content-type": "application/json"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 201:
            print(f"   ✅ Correo enviado vía Brevo")
            return True
        else:
            print(f"   ❌ Error Brevo: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error Brevo: {e}")
        return False

def enviar_correo_alerta(asunto, mensaje, prioridad="MEDIA"):
    """
    Función principal para enviar alertas
    Intenta múltiples servicios hasta que uno funcione
    """
    destinatario = CONFIG['EMAIL_DESTINO']
    
    print(f"   📧 Intentando enviar alerta a {destinatario}...")
    
    # Método 1: Gmail (si está configurado)
    if CONFIG.get('EMAIL_PASSWORD'):
        if enviar_correo_gmail(destinatario, asunto, mensaje):
            return True
    
    # Método 2: SMTP2Go
    if enviar_correo_smtp2go(destinatario, asunto, mensaje):
        return True
    
    # Método 3: Brevo
    if enviar_correo_brevo(destinatario, asunto, mensaje):
        return True
    
    # Método 4: EmailJS (gratuito)
    if enviar_correo_emailjs(destinatario, asunto, mensaje):
        return True
    
    print("   ❌ Todos los métodos fallaron")
    return False

def enviar_correo_emailjs(destinatario, asunto, mensaje):
    """
    Envía correo usando EmailJS (100% gratuito)
    """
    try:
        # EmailJS - Configura en emailjs.com
        service_id = "service_xxxxxx"  # Tu Service ID
        template_id = "template_xxxxxx"  # Tu Template ID
        user_id = "user_xxxxxx"  # Tu Public Key
        
        url = "https://api.emailjs.com/api/v1.0/email/send"
        
        payload = {
            "service_id": service_id,
            "template_id": template_id,
            "user_id": user_id,
            "template_params": {
                "to_email": destinatario,
                "asunto": asunto,
                "mensaje": mensaje,
                "fecha": datetime.now().strftime("%d/%m/%Y %H:%M"),
                "prioridad": "ALTA"
            }
        }
        
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            print(f"   ✅ Correo enviado vía EmailJS")
            return True
        else:
            print(f"   ❌ Error EmailJS: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error EmailJS: {e}")
        return False

# Prueba rápida del sistema
if __name__ == "__main__":
    print("🧪 Probando sistema de envío de correos...")
    
    test_mensaje = """🚨 ALERTA DE PRUEBA

📍 POBLACIÓN: Córdoba Centro
📋 SITUACIÓN: Robo en comercio
🏠 DIRECCIÓN: Calle Claudio Marcelo, 25
🕒 FECHA/HORA: 15/03/2024 14:30:00
📝 DETALLES: Robo con fuerza en joyería
⚠️ PRIORIDAD: ALTA

Esta es una prueba del sistema automático."""
    
    if enviar_correo_alerta("🚨 PRUEBA SISTEMA ALERTAS", test_mensaje):
        print("✅ Sistema funcionando correctamente")
    else:
        print("❌ Revisa la configuración en config.py")
