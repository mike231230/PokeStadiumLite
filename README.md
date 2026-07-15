# Pokémon Stadium Lite 🏟️

Este repositorio contiene la solución a la prueba técnica "Pokémon Stadium Lite". Es una aplicación Fullstack que permite a los usuarios unirse a un lobby, obtener un equipo aleatorio de Pokémon desde un catálogo externo y enfrentarse en batallas en tiempo real.

## 🛠️ Arquitectura y Tecnologías

El proyecto fue construido siguiendo los principios de **Arquitectura Limpia (Clean Architecture)** en el backend, separando claramente el Dominio, Aplicación e Infraestructura.

*   **Backend:** Node.js (v18+), Express, Socket.io.
*   **Frontend:** React Web (Vite), Tailwind CSS, Socket.io-client y Daysiui.
*   **Base de Datos:** MongoDB (No relacional).
*   **Integración Externa:** Consumo de API REST para el catálogo de Pokémon.

---

## 🚀 Requisitos Previos

Para ejecutar este proyecto localmente, necesitas tener instalado:
*   [Node.js](https://nodejs.org/) (Versión 18 o superior).
*   [Docker](https://www.docker.com/) (Recomendado para levantar la base de datos sin configuraciones adicionales).
*   Git.

---

## ⚙️ Instrucciones de Configuración y Ejecución

Puedes levantar el proyecto utilizando contenedores (recomendado) o mediante la ejecución de scripts manuales.

### Opción 1: Ejecución limpia con Docker (Recomendada)
Esta opción es ideal para mantener el entorno de tu máquina sin dependencias extra (como los binarios de MongoDB).

1. Abre una terminal en la raíz del proyecto.
2. Levanta el contenedor de MongoDB ejecutando:
   ```bash
   docker run --name pokemon-mongo -p 27017:27017 -d mongodb:latest
   ```
3. Ve a la carpeta pokemon-stadium-lite-backend y levanta el servidor:
   ```bash
   cd pokemon-stadium-lite-backend
   npm install
   npm run dev
   ```
   *El servidor se ejecutará localmente en el puerto 8080 y escuchará en la dirección 0.0.0.0*.

### Opción 2: Ejecución Manual
Si ya tienes una instancia de MongoDB corriendo localmente o en la nube:
1. Asegúrate de configurar tu variable de entorno \`MONGO_URI\` o verifica que tu MongoDB local esté escuchando en el puerto \`27017\`.
2. Ejecuta el backend:
   ```bash
   cd pokemon-stadium-lite-backend
   npm install
   npm start
   ```

### Ejecución del Frontend (React Web)
1. Abre una nueva pestaña en tu terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend-pokemon-stadium-lite
   npm install
   npm run dev
   ```
2. Abre la URL local que te proporcione Vite (usualmente \`http://localhost:5173\`) en dos pestañas diferentes de tu navegador para simular a los dos jugadores.

---

## 🎮 Guía de Uso y Flujo de la Aplicación

1.  **Configuración Inicial:** En el primer inicio de la aplicación web, la vista te solicitará ingresar la URL base del backend (por ejemplo, \`http://localhost:8080\` o la IP local \`http://192.168.X.X:8080\`). Esta URL se guarda localmente en el navegador y se usa para todas las peticiones futuras.
2.  **Ingreso al Lobby:** Ingresa un apodo (nickname) para unirte a la sala de espera.
3.  **Selección de Equipo:** Haz clic en "Obtener Equipo Aleatorio". El sistema asignará 3 Pokémon al azar consumiendo la API externa, garantizando que no se repitan entre los jugadores.
4.  **Confirmación:** Una vez asignado el equipo, presiona "Confirmar y Listo".
5.  **Batalla en Tiempo Real:**
    *   Cuando ambos jugadores estén listos, la batalla iniciará automáticamente.
    *   El primer turno se asignará al Pokémon con la estadística de Velocidad (Speed) más alta.
    *   Utiliza el botón de atacar en la interfaz del cliente para procesar el daño atómicamente en el servidor.
    *   El sistema notificará los resultados del turno y declarará a un ganador cuando el equipo contrario sea derrotado por completo.

---