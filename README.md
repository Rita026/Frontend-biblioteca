#  Sistema  de Inventario para biblioteca 

##  Stack Tecnológico
* **Frontend:** Vite + React con TypeScript.
* **Estilos:** Tailwind CSS v4.
* **Componentes:** Shadcn UI.

---
##  Arquitectura y Estructura de Carpetas

El proyecto se organiza bajo una **Arquitectura en Capas**, separando la lógica de negocio de la interfaz visual:

* ** src/APIs/**: Gestión de peticiones HTTP al servidor.
    * *Archivos:* `libros.api.ts`, `prestamos.api.ts`, `usuarios.api.ts`.
* ** src/components/**: Componentes visuales reutilizables.
    * *Archivos:* `Table.tsx`, `Sidebar.tsx`, `Navbar.tsx`, `BookCard.tsx`.
* ** src/config/**: Configuraciones técnicas del sistema.
    * *Archivos:* `axios.config.ts`, `env.ts`.
* ** src/middlewares/**: Capas de seguridad y protección de accesos.
    * *Archivos:* `AuthGuard.tsx`, `RoleMiddleware.tsx`.
* ** src/pages/**: Vistas principales organizadas por módulos (Login, Home, Libros, Prestamos, Usuarios).

---

##  Navegación y Accesibilidad por Teclado 

El sistema está optimizado para garantizar una navegación fluida sin el uso de ratón, siguiendo un orden de foco (Tab).

###  Pantalla de Login
El orden de tabulación facilita un acceso rápido:
1. **Email/Usuario Input:** Campo de texto inicial.
2. **Contraseña Input:** Segundo campo de entrada para credenciales.
3. **Botón Continuar:** Ejecución de la autenticación.

###  Dashboard de Inventario
La navegación sigue una secuencia lógica para facilitar la operatividad bibliotecaria:
1. **Menú Lateral (Sidebar):** Acceso a los módulos principales:
2. **Barra de Búsqueda Superior:** Localización global de libros por ISBN o título.
   * **Inventario UTT:** Inicio/Home.
   * **Dashboard:** Vista de estadísticas.
   * **Actividad:** Historial de movimientos y auditoría.
   * **Inventory mode:** Función de escaneo y registro rápido.
3. **Botón Agregar Libro:** Acción principal para dar de alta ejemplares.
4. **Tabla de Datos:** Navegación secuencial por filas, permitiendo enfocar las acciones de **Editar** y **Eliminar** en cada registro.