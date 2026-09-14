Este repositorio contiene la implementación del backend para la plataforma de gestión de alojamientos, solicitudes de reserva y publicaciones de roomies, desarrollado aplicando los principios **SOLID**.

---

## Tecnologías Utilizadas

* **Lenguaje:** [TypeScript / Node.js]
* **Arquitectura:** Domain-Driven Design (DDD) & Layered / Clean Architecture.
* **Patrones de Diseño:** Repository Pattern (In-Memory), Dependency Injection, Strategy / Factory para tipos de alojamiento.
* **Herramientas de Ejecución:** `tsx` / `ts-node` para ejecución en entorno de desarrollo.

---

## Funcionalidades Implementadas

* **Gestión de Alojamientos:**
  * Creación, actualización de datos y cambio de estado (`Disponible`, `Ocupado`, etc.).
  * Soporte para múltiples tipos de alojamiento (`Casa`, `Apartamento`, `Pensionado`).
  * Asignación de características físicas, ubicación geográfica, precios y reglas de convivencia.
* **Gestión de Usuarios y Perfiles:**
  * Diferenciación de roles entre `Inquilino` y `Propietario`.
  * Gestión de perfil de usuario con información académica asociada.
  * Guardado y gestión de alojamientos favoritos por parte de los inquilinos.
* **Flujo Social y Reservas:**
  * Creación y gestión de publicaciones de roomies (`PublicacionRoomie`).
  * Generación, aceptación y cancelación de solicitudes de reserva (`Solicitud` y `Reserva`).
  * Sistema de reseñas y calificaciones (`Reseña`).

---

## Cambios Aplicados en esta Segunda Entrega

En esta segunda iteración, se realizó un proceso intensivo de **refactorización orientado a principios SOLID y desacoplamiento del dominio**, además de implementar la capa de infraestructura/servicio en memoria:

### 1. Refactorización del Dominio (Principios SOLID)
* **Single Responsibility Principle (SRP):** 
  * Se desacopló la lógica de autenticación de la entidad `Usuario`, delegándola a la nueva clase `AuthService`.
  * Se extrajeron los atributos académicos de `Perfil` hacia un Value Object independiente (`InformacionAcademica`).
* **Open/Closed & Dependency Inversion (OCP / DIP):** 
  * Se eliminó el tipo rígido `String` para los alojamientos e introdujo la interfaz `TipoAlojamiento`, permitiendo extender nuevos tipos (`Casa`, `Apartamento`, `Pensionado`) sin modificar la lógica existente.
* **Encapsulamiento y Value Objects:**
  * La clase monolítica `Alojamiento` se descompuso delegando responsabilidad a los Value Objects `Ubicacion`, `Caracteristica` y `Precio`.
  * Se crearon los Value Objects `PasswordHash` y `RangoPresupuesto` para asegurar inmutabilidad y autovalidaciones dentro del dominio.

### 2. Implementación de Capa de Servicios y Repositorios
* **Patrón Repositorio:** Implementación de repositorios en memoria (`InMemoryAlojamientoRepository`, `InMemoryUsuarioRepository`) desacoplados de los servicios mediante interfaces (`IAlojamientoRepository`, `IUsuarioRepository`).
* **Capa de Servicios (`Service`):** Creación de `AlojamientoService` y `UsuarioService` para orquestar los casos de uso principales.
* **Capa de Controladores (`Controller`):** Implementación de la capa encargada de recibir las peticiones y orquestar las respuestas hacia el cliente.

---

## roceso de Despliegue y Ejecución Local

### Prerrequisitos
* **Node.js** (v18.x o superior)
* **npm** o **pnpm** / **yarn**

### Pasos para Ejecutar

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Sergio5423/roomies
   cd roomies
   npx tsx main.ts