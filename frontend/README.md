# ROOMIES — Auditoría técnica y calidad de software

## 1. Descripción

**ROOMIES** es una plataforma web orientada a la búsqueda y gestión de habitaciones y compañeros de vivienda. El proyecto utiliza una arquitectura modular en el frontend y separa el dominio de las fuentes de datos mediante interfaces de repositorio.

Esta primera auditoría tiene como objetivo evaluar la **organización del código, modularidad, principios SOLID, patrones de diseño, acoplamiento, mantenibilidad y confiabilidad**, complementando el análisis manual con **SonarCloud**.

---

## 2. Estructura del proyecto

```text
roomies-fullstack/
├── frontend/
│   ├── app/
│   │   └── data/
│   │       └── mock/
│   ├── components/
│   │   ├── habitaciones/
│   │   ├── roomies/
│   │   ├── explore-location/
│   │   ├── explore-rooms/
│   │   ├── navbar/
│   │   ├── footer/
│   │   └── ...
│   ├── domain/
│   │   ├── habitaciones/
│   │   └── roomies/
│   ├── infrastructure/
│   │   └── repositories/
│   ├── routes/
│   │   ├── habitaciones/
│   │   ├── roomies/
│   │   └── home/
│   └── ...
├── backend/
└── README.md
```

La estructura separa principalmente:

* **`routes/`**: páginas y coordinación de datos.
* **`components/`**: componentes visuales reutilizables.
* **`domain/`**: entidades e interfaces del dominio.
* **`infrastructure/`**: implementaciones concretas de acceso a datos.
* **`app/data/mock/`**: datos utilizados actualmente como fuente simulada.

---

# 3. Arquitectura y modularidad

El frontend presenta una separación conceptual similar a:

```text
Route
   ↓
Component
   ↓
Domain Interface
   ↓
Repository
   ↓
Mock Data
```

Esta organización permite separar la interfaz de usuario de la lógica relacionada con el acceso a los datos.

Por ejemplo:

```text
AccommodationRepository
          ↑
          │ implements
          │
MockAccommodationRepository
```

La interfaz pertenece al dominio mientras que la implementación concreta se encuentra en `infrastructure`.

Esto facilita reemplazar posteriormente los repositorios `Mock` por una implementación conectada a una API.

---

# 4. Análisis de componentes

## `components/habitaciones`

Contiene componentes relacionados con la presentación de habitaciones:

* `RoomCard`
* `RoomDetail`
* `RoomFilters`
* `RoomGrid`
* `RoomOwner`
* `RoomRules`
* `RoomServices`
* `RelatedRooms`

La separación permite reutilizar elementos de la interfaz y evita concentrar toda la presentación en una sola vista.

Sin embargo, SonarCloud detectó varios aspectos de mantenibilidad, principalmente relacionados con la definición de props como mutables.

### Ejemplo

`RoomCard.tsx` y `RoomDetail.tsx` presentan el siguiente tipo de observación:

```tsx
interface Props {
  name: string;
}
```

SonarCloud recomienda utilizar:

```tsx
interface Props {
  readonly name: string;
}
```

o:

```tsx
function Welcome(props: Readonly<Props>) {
  return <div>Hello {props.name}</div>;
}
```

Esto refuerza la **inmutabilidad de las props** y hace más explícito el flujo de datos entre componentes.

---

## `components/roomies`

Contiene los componentes relacionados con los compañeros de vivienda:

* `RoommateCard`
* `RoommateFilters`
* `RoommateGrid`

Su organización sigue una responsabilidad visual clara y permite reutilizar los componentes desde las rutas correspondientes.

---

## `components/explore-location`

Incluye componentes para la exploración por ubicación:

* `locationCard`
* `locationFilters`
* `locationMap`

En `locationMap.tsx`, SonarCloud identificó una función con un nivel elevado de anidamiento y una definición de componente que podría separarse.

Esto representa una oportunidad para reducir la complejidad y mejorar la mantenibilidad.

---

# 5. Rutas

Las rutas principales incluyen:

```text
routes/
├── home/
├── habitaciones/
│   ├── bedrooms.tsx
│   └── bedroomDetails.tsx
└── roomies/
    ├── roomies.tsx
    └── roomiesDetails.tsx
```

Las rutas funcionan principalmente como coordinadoras entre:

* parámetros de URL;
* repositorios;
* estado de React;
* componentes visuales.

### Observación importante

`roomiesDetails.tsx` concentra varias responsabilidades:

```text
URL
 ↓
Obtención del usuario
 ↓
Obtención de habitación
 ↓
Obtención de habitaciones interesadas
 ↓
Transformación de datos
 ↓
Estado
 ↓
Renderizado
```

Por esto se considera un **candidato a alta concentración de responsabilidades**, relacionado principalmente con el principio SRP.

No se clasifica automáticamente como una violación absoluta de SOLID, pero sí como una oportunidad clara de refactorización.

---

# 6. Domain

El dominio contiene interfaces como:

```text
Accommodation
Roommate
AccommodationRepository
RoommateRepository
```

Ejemplo:

```tsx
export interface AccommodationRepository {
  getAll(): Promise<Accommodation[]>;
  getById(id: number): Promise<Accommodation | null>;
  getBySlug(slug: string): Promise<Accommodation | null>;
}
```

Esto permite que el dominio conozca el **contrato** necesario para obtener información sin depender directamente de una fuente de datos específica.

Esta separación es uno de los puntos arquitectónicos positivos del proyecto.

---

# 7. Infrastructure y Repository Pattern

El proyecto implementa claramente el **Repository Pattern**.

```text
DOMAIN
 ├── AccommodationRepository
 └── RoommateRepository
          │
          ▼
INFRASTRUCTURE
 ├── MockAccommodationRepository
 └── MockRoommateRepository
```

Por ejemplo:

```tsx
export class MockAccommodationRepository
  implements AccommodationRepository
{
  async getAll(): Promise<Accommodation[]> {
    return accommodations;
  }
}
```

La ventaja principal es que la aplicación puede cambiar posteriormente:

```text
MockAccommodationRepository
          ↓
ApiAccommodationRepository
```

sin modificar el contrato utilizado por el dominio.

---

# 8. SOLID

| Principio                 | Evaluación | Observación                                                                                             |
| ------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| **SRP**                   | ⚠️ Parcial | Algunas rutas concentran carga de datos, transformación y presentación                                  |
| **OCP**                   | ⚠️ Parcial | Las interfaces de repositorio favorecen extensión, pero las rutas instancian implementaciones concretas |
| **LSP**                   | ✅ Adecuado | No se identificaron violaciones evidentes                                                               |
| **ISP**                   | ✅ Adecuado | Las interfaces de repositorio son pequeñas y específicas                                                |
| **DIP**                   | ⚠️ Parcial | Existe abstracción mediante repositorios, pero algunas rutas crean directamente `Mock...Repository`     |
| **Separación de dominio** | ✅ Buena    | El dominio no depende directamente de React ni de los datos mock                                        |

### Principal punto de mejora

Actualmente algunas rutas hacen:

```tsx
const roommateRepository = new MockRoommateRepository();
```

Esto genera acoplamiento entre la ruta y la implementación concreta.

Una evolución posterior podría utilizar una composición o mecanismo de inyección para que la ruta dependa únicamente de:

```text
RoommateRepository
```

y no directamente de:

```text
MockRoommateRepository
```

---

# 9. Antipatrones y problemas identificados

### 9.1 Alta concentración de responsabilidades

Principalmente en:

```text
routes/roomies/roomiesDetails.tsx
```

La ruta realiza acceso a datos, coordinación de relaciones, transformación, manejo de estado y renderizado.

**Recomendación:** extraer lógica de consulta y transformación hacia servicios/hooks o módulos especializados.

---

### 9.2 Acoplamiento con implementaciones concretas

Las rutas crean directamente los repositorios `Mock`.

**Problema:**

```text
Route → MockRepository
```

**Evolución deseada:**

```text
Route → Repository
              ↑
       implementación
```

---

### 9.3 Modelos potencialmente duplicados

Existe una diferencia entre modelos como:

```text
Room
Accommodation
```

que representan conceptos relacionados con estructuras diferentes.

Por ejemplo:

```text
Room:
title
city
price
available

Accommodation:
titulo
ciudad
precioMensual
estado
```

Si `Room` representa un modelo simplificado para una vista específica, la separación es válida. Si representa la misma entidad, sería conveniente unificar o documentar claramente ambos modelos.

---

### 9.4 Estado de carga y no encontrado

En algunas rutas el valor inicial:

```tsx
null
```

representa tanto:

```text
cargando
```

como:

```text
no encontrado
```

Se recomienda separar explícitamente estados como:

```text
loading
success
not found
error
```

para mejorar la claridad del flujo.

---

# 10. SonarCloud

El proyecto fue analizado mediante **SonarCloud** como complemento de la auditoría manual.

### Resultado general

| Métrica                |        Resultado |
| ---------------------- | ---------------: |
| Quality Gate           | **Not computed** |
| Issues abiertas        |           **47** |
| Security issues        |            **3** |
| Reliability issues     |            **6** |
| Maintainability issues |           **43** |
| Security Rating        |            **C** |
| Reliability Rating     |            **C** |
| Maintainability Rating |            **A** |
| Security Hotspots      |            **0** |
| Security Review Rating |            **A** |
| Duplicaciones          |         **0.0%** |
| Cobertura              |    **Sin datos** |

> `Not computed` no significa que el proyecto haya aprobado o fallado el Quality Gate; simplemente todavía no se ha calculado.

---

# 11. Reliability

SonarCloud identificó problemas relacionados con confiabilidad.

Entre ellos:

* problemas de accesibilidad en enlaces de `footer.tsx`;
* nombre conflictivo de variable `Map` en `locationMap.tsx`;
* problemas de espaciado JSX detectados en componentes de habitaciones.

También se identificaron observaciones relacionadas con la inmutabilidad de props.

Estas observaciones no representan necesariamente fallos funcionales graves, pero permiten mejorar la consistencia y robustez del código.

---

# 12. Maintainability

La mantenibilidad fue el principal grupo de observaciones:

**43 issues de Maintainability.**

Uno de los problemas identificados corresponde a:

```text
frontend/components/habitaciones/RoomCard.tsx
frontend/components/habitaciones/RoomDetail.tsx
frontend/components/habitaciones/RoomFilters.tsx
```

donde SonarCloud recomienda declarar las props como `readonly`.

Otro caso importante aparece en:

```text
frontend/components/explore-location/locationMap.tsx
```

donde se detectó una función con más de cinco niveles de anidamiento.

Esto puede dificultar la lectura, comprensión y modificación del código.

---

## Backend — constructor con demasiados parámetros

SonarCloud también identificó en:

```text
backend/src/model/Alojamiento/Alojamiento.ts
```

un constructor con:

```text
12 parámetros
```

cuando el máximo configurado por la regla es:

```text
7 parámetros
```

Regla:

```text
typescript:S107
```

La recomendación de SonarCloud es reducir la cantidad de parámetros o agrupar aquellos que pertenecen conceptualmente a una misma estructura.

Por ejemplo:

```text
Constructor largo
       ↓
Agrupar información relacionada
       ↓
Objetos o estructuras de dominio
```

Este hallazgo es relevante para la **mantenibilidad**, porque obliga a conocer y mantener el orden y propósito de numerosos parámetros.

---

# 13. Seguridad

SonarCloud identificó **3 issues de seguridad** relacionadas principalmente con el `Dockerfile` del frontend:

* ejecución de scripts durante la instalación de dependencias;
* ejecución del contenedor utilizando `root` como usuario predeterminado.

El proyecto obtuvo:

```text
Security Rating: C
```

No se identificaron Security Hotspots:

```text
Security Hotspots: 0
Security Review Rating: A
```

Estos resultados deben tratarse como oportunidades de configuración y endurecimiento del entorno de ejecución.

---

# 14. Fortalezas

Entre los principales aspectos positivos encontrados:

* Organización modular del frontend.
* Separación entre `routes`, `components`, `domain` e `infrastructure`.
* Interfaces de dominio independientes de la implementación.
* Uso claro del **Repository Pattern**.
* Interfaces de repositorio pequeñas y cohesivas.
* Tipado mediante TypeScript.
* Datos mock separados del dominio.
* Duplicación reportada por SonarCloud de **0.0%**.
* Buena base para sustituir posteriormente los repositorios mock por servicios reales.

---

# 15. Recomendaciones prioritarias

### Alta prioridad

1. Reducir la concentración de responsabilidades en `roomiesDetails.tsx`.
2. Revisar la complejidad de `locationMap.tsx`.
3. Reducir el constructor de `Alojamiento.ts`.
4. Revisar los problemas de seguridad del `Dockerfile`.

### Media prioridad

5. Declarar las props de componentes como `readonly`.
6. Reducir el acoplamiento directo entre rutas y repositorios concretos.
7. Separar claramente estados de carga, éxito, error y no encontrado.
8. Revisar la relación entre `Room` y `Accommodation`.

### Baja prioridad

9. Corregir observaciones menores de JSX y tipado.
10. Mejorar la especificidad de errores en servicios del backend.

---

# 16. Conclusión

La primera auditoría muestra que **ROOMIES cuenta con una estructura modular adecuada y una aplicación clara del Repository Pattern**, especialmente en la separación entre `domain` e `infrastructure`.

Los principales puntos de mejora están relacionados con la **concentración de responsabilidades en algunas rutas, el acoplamiento con implementaciones concretas y la mantenibilidad del código**.

SonarCloud complementa estas conclusiones con evidencia automática: **47 issues abiertas, 6 de Reliability y 43 de Maintainability**, además de 3 observaciones de seguridad.

Por lo tanto, el proyecto presenta una **base arquitectónica adecuada para continuar su evolución**, pero requiere refactorizaciones puntuales para mejorar mantenibilidad, confiabilidad, seguridad y separación de responsabilidades.

# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation
``
Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
