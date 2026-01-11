#!/usr/bin/env python3
"""
🚨 MONITOR DE ROBOS EN TIEMPO REAL - CÓRDOBA Y PUEBLOS
Sistema independiente que busca robos y envía alertas
"""

import time
import json
import requests
from datetime import datetime
import re
import sys
import os

# Añadir ruta para importar config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import CONFIG
from enviar_correos import enviar_correo_alerta

class MonitorRobosCordoba:
    def __init__(self):
        self.robos_detectados = []
        self.cargar_robos_anteriores()
        
        print("="*60)
        print("🚨 MONITOR DE ROBOS - CÓRDOBA Y PUEBLOS")
        print("="*60)
        print(f"📍 Zona: {CONFIG['ZONA_MONITOREO']}")
        print(f"📧 Alertas a: {CONFIG['EMAIL_DESTINO']}")
        print(f"⏰ Intervalo: {CONFIG['INTERVALO_BUSQUEDA']} segundos")
        print("="*60)
    
    def cargar_robos_anteriores(self):
        """Carga robos ya detectados"""
        try:
            with open('robos_cordoba.json', 'r', encoding='utf-8') as f:
                self.robos_detectados = json.load(f)
            print(f"📂 {len(self.robos_detectados)} robos cargados")
        except:
            self.robos_detectados = []
            print("📂 Base de datos nueva creada")
    
    def guardar_robo(self, robo):
        """Guarda un nuevo robo"""
        self.robos_detectados.append(robo)
        with open('robos_cordoba.json', 'w', encoding='utf-8') as f:
            json.dump(self.robos_detectados, f, ensure_ascii=False, indent=2)
    
    def buscar_robos_twitter(self):
        """Busca robos en Twitter (versión gratuita)"""
        robos_encontrados = []
        
        # Hashtags y cuentas a monitorizar
        busquedas = [
            "#roboCordoba", "#roboCórdoba", "robo en Córdoba",
            "#SeguridadCordoba", "Policía Córdoba",
            "#CordobaAlert", "Córdoba noticias"
        ]
        
        # Pueblos de Córdoba
        pueblos = [
            "Lucena", "Puente Genil", "Montilla", "Priego", "Cabra",
            "Baena", "La Carlota", "Fernán-Núñez", "Villanueva",
            "Aguilar", "Rute", "Palma", "Posadas", "Almodóvar"
        ]
        
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 🔍 Buscando robos...")
        
        # SIMULACIÓN DE BÚSQUEDA (en versión real conectarías a API)
        # Para DEMO, generamos robos simulados
        import random
        
        if random.random() < 0.3:  # 30% de probabilidad de "encontrar" robo
            pueblo = random.choice(pueblos)
            tipos = [
                "Robo en vivienda", "Robo en comercio", "Hurto en calle",
                "Robo con fuerza", "Intento de robo", "Sustracción de vehículo"
            ]
            
            robo_simulado = {
                "id": f"ROBO_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "timestamp": datetime.now().isoformat(),
                "tipo": random.choice(tipos),
                "poblacion": pueblo,
                "direccion": f"Calle {random.choice(['Mayor', 'Real', 'Ancha', 'Nueva'])} {random.randint(1, 100)}",
                "coordenadas": f"37.{random.randint(8800, 8900)}, -4.{random.randint(7700, 7800)}",
                "detalles": "Incidente reportado por vecinos. Policía acudió al lugar.",
                "fuente": "Monitor automático",
                "prioridad": random.choice(["ALTA", "MEDIA"]),
                "notificado": False
            }
            
            robos_encontrados.append(robo_simulado)
            print(f"   🚨 Robo simulado en {pueblo}")
        
        return robos_encontrados
    
    def buscar_robos_noticias(self):
        """Busca robos en portales de noticias locales"""
        try:
            # Fuentes de noticias locales de Córdoba
            fuentes = [
                "https://cordopolis.es/feed/",
                "https://www.diariocordoba.com/rss/",
                "https://www.abc.es/rss/feeds/abc_Cordoba.xml"
            ]
            
            # Palabras clave
            palabras_clave = ["robo", "asalto", "hurto", "sustracción", 
                            "delincuencia", "policía", "detenido"]
            
            robos = []
            
            for fuente in fuentes:
                try:
                    response = requests.get(fuente, timeout=10)
                    contenido = response.text.lower()
                    
                    # Buscar palabras clave
                    if any(palabra in contenido for palabra in palabras_clave):
                        # Extraer información básica
                        robos.append({
                            "id": f"NOTICIA_{datetime.now().strftime('%H%M%S')}",
                            "timestamp": datetime.now().isoformat(),
                            "tipo": "Robo reportado en noticias",
                            "poblacion": "Córdoba",
                            "direccion": "Zona centro",
                            "detalles": "Incidente mencionado en medios locales",
                            "fuente": fuente.split('/')[2],
                            "prioridad": "MEDIA",
                            "notificado": False
                        })
                except:
                    continue
            
            return robos
            
        except Exception as e:
            print(f"⚠️  Error buscando noticias: {e}")
            return []
    
    def verificar_robo_nuevo(self, robo):
        """Verifica si el robo es nuevo"""
        for robo_existente in self.robos_detectados:
            if (robo_existente['poblacion'] == robo['poblacion'] and
                robo_existente['direccion'] == robo['direccion'] and
                robo_existente['tipo'] == robo['tipo']):
                return False
        return True
    
    def procesar_robos(self, robos):
        """Procesa los robos encontrados"""
        nuevos_robos = []
        
        for robo in robos:
            if self.verificar_robo_nuevo(robo):
                robo['notificado'] = False
                self.guardar_robo(robo)
                nuevos_robos.append(robo)
                print(f"✅ NUEVO ROBO: {robo['tipo']} en {robo['poblacion']}")
        
        return nuevos_robos
    
    def ejecutar_monitoreo(self):
        """Ejecuta el monitoreo continuo"""
        print("\n🎯 INICIANDO MONITOREO EN TIEMPO REAL")
        print("🛑 Presiona Ctrl+C para detener")
        print("-"*60)
        
        ciclo = 0
        
        try:
            while True:
                ciclo += 1
                hora_actual = datetime.now().strftime("%H:%M:%S")
                
                print(f"\n[{hora_actual}] Ciclo #{ciclo}")
                
                # 1. Buscar en múltiples fuentes
                robos_twitter = self.buscar_robos_twitter()
                robos_noticias = self.buscar_robos_noticias()
                
                todos_robos = robos_twitter + robos_noticias
                
                # 2. Procesar nuevos robos
                nuevos = self.procesar_robos(todos_robos)
                
                # 3. Enviar alertas por cada robo nuevo
                for robo in nuevos:
                    print(f"📤 Enviando alerta: {robo['tipo']}")
                    
                    # Construir mensaje
                    mensaje = f"""
🚨 ALERTA DE ROBO DETECTADO 🚨

📍 POBLACIÓN: {robo['poblacion']}
📋 SITUACIÓN: {robo['tipo']}
🏠 DIRECCIÓN: {robo['direccion']}
📌 COORDENADAS: {robo.get('coordenadas', 'No especificadas')}
🕒 FECHA/HORA: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}
📝 DETALLES: {robo['detalles']}
🔍 FUENTE: {robo['fuente']}
⚠️ PRIORIDAD: {robo['prioridad']}

📍 Enlace al mapa: https://www.google.com/maps?q={robo.get('coordenadas', '37.8882,-4.7794')}
📱 Contacto rápido: 621284357

⚠️ Sistema automático de alertas - Localizador de Alarmas
                    """
                    
                    # Enviar correo
                    if enviar_correo_alerta(
                        asunto=f"🚨 ROBO EN {robo['poblacion'].upper()} - {robo['tipo']}",
                        mensaje=mensaje,
                        prioridad=robo['prioridad']
                    ):
                        robo['notificado'] = True
                        self.guardar_robo(robo)
                        print(f"   ✅ Correo enviado: {robo['poblacion']}")
                
                # 4. Mostrar estadísticas
                print(f"   📊 Robos totales: {len(self.robos_detectados)}")
                print(f"   🆕 Nuevos este ciclo: {len(nuevos)}")
                
                # 5. Esperar para siguiente ciclo
                print(f"   ⏳ Siguiente búsqueda en {CONFIG['INTERVALO_BUSQUEDA']}s...")
                time.sleep(CONFIG['INTERVALO_BUSQUEDA'])
                
        except KeyboardInterrupt:
            print("\n\n🛑 Monitor detenido por usuario")
            self.generar_reporte()
    
    def generar_reporte(self):
        """Genera reporte final"""
        print("\n" + "="*60)
        print("📊 REPORTE FINAL DE MONITOREO")
        print("="*60)
        
        robos_hoy = [r for r in self.robos_detectados 
                    if datetime.fromisoformat(r['timestamp']).date() == datetime.now().date()]
        
        print(f"📅 Fecha: {datetime.now().strftime('%d/%m/%Y')}")
        print(f"🚨 Robos detectados hoy: {len(robos_hoy)}")
        print(f"📧 Alertas enviadas: {len([r for r in robos_hoy if r.get('notificado')])}")
        
        if robos_hoy:
            print("\n📍 ROBOS DE HOY:")
            for robo in robos_hoy[-5:]:  # Últimos 5
                hora = datetime.fromisoformat(robo['timestamp']).strftime('%H:%M')
                print(f"   • {hora} - {robo['tipo']} en {robo['poblacion']}")
        
        print("\n💾 Datos guardados en: robos_cordoba.json")
        print("📧 Correo de alertas: avisosderobos@gmail.com")
        print("="*60)

if __name__ == "__main__":
    monitor = MonitorRobosCordoba()
    monitor.ejecutar_monitoreo()
