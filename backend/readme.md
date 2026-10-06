# Backend

**Instalar dependencias**
npm install

**Ejecutar con**
npm run dev

## API

 ## Autenticación

  ### Login
  **POST**
  http://localhost:3000/api/auth/login
  
  **Body**
  {
  "email": "estudiante2@gmail.com",
  "password": "123456"
  }

  ### Registro
  **POST**
  http://localhost:3000/api/auth/register

  **Body**
  {
	"email": "estudiante2@gmail.com",
	"password": "123456",
	"first_name": "A",
	"last_name": "B",
	"phone": "9911",
	"role": "ESTUDIANTE"
  }

## Usuario
  ### Obtener usuario por id requiere autenticación.
  Uso principal en ver perfil de otro usuario.
  **GET**
  http://localhost:3000/api/users/{id-usuario}

  **Body**
  "Bearer Token retornado por el login o registro"

  ### Perfil del usuario autenticado
  Uso principal en ver perfil propio.
  **GET**
  http://localhost:3000/api/users/profile

  **Body**
  "Bearer Token retornado por el login o registro"

## Alojamientos
 ### Cambiar Estado
 **PATCH**
 http://localhost:3000/api/alojamientos/{id-propietario}/estado

 **Body**
 "Bearer Token retornado por el login o registro"
 {
  "nuevoEstado": "ocupado"
 }

### Actualizar Alojamiento
**PUT**
http://localhost:3000/api/alojamientos/{id-propietario}

**Body**
"Bearer Token retornado por el login o registro"
{
  "titulo": "Apartamento Amoblado Centro - Modificado",
  "descripcion": "Nueva descripción del apartamento",
  "precio": {
    "precioMensual": 900000
  }
}

### Listar Alojamietnos
**GET**
http://localhost:3000/api/alojamientos

**Sin body disponible para todos sin autenticar**

### Nuevo Alojamiento
**POST**
http://localhost:3000/api/alojamientos

**Body**
"Bearer Token del propietario retornado por el login o registro"
{
  "titulo": "Apartamento Amoblado Centro",
  "descripcion": "Apartamento amplio cerca de la universidad",
  "tipoAlojamiento": "Apartamento",
  "imagenes": ["https://ejemplo.com/foto1.jpg"],
  "ubicacion": {
    "direccion": "Calle 16 # 12-30",
    "ciudad": "Valledupar",
    "barrio": "Centro",
    "distancia": "5 mins a la universidad",
    "latitud": 10.463,
    "longitud": -73.253
  },
  "caracteristica": {
    "numeroCuartos": 2,
    "metrosCuadrados": 65,
    "capacidad": 3,
    "amoblado": true,
    "buscandoRoomie": false
  },
  "precio": {
    "precioMensual": 850000
  },
  "reglas": [
    "No fumar",
    "No se permiten mascotas"
  ]
}