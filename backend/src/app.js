// src/app.js
const express = require('express');
const userRoutes = require('./routes/user');
const Alojamiento = require('./models/Alojamiento');
const app = express();
const port = 3000;

app.get('/alojamiento', (req, res) => {
  const alojamiento = new Alojamiento(1, 'Nombre del Alojamiento', TipoAlojamiento.CASA, 100, 'Ubicación', ['Servicio 1', 'Servicio 2'], 2, true, 1);
  alojamiento.filtrarPorPrecio();
  alojamiento.filtrarPorDistancia();
  alojamiento.filtrarPorHabitaciones();
  alojamiento.filtrarPorServicios();
  alojamiento.filtrarPorRoomie();

  res.json(alojamiento);
});
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});