import { Form, redirect, useActionData, useNavigation } from "react-router";
import { AlojamientoService } from "../../../src/application/services/alojamiento.service";

// 1. ACTION: Intercepta el formulario antes de recargar la página
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  
  // Extraer y formatear los datos del formulario
  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const precioStr = formData.get("precio") as string;
  const tipo = formData.get("tipo") as 'Apartamento' | 'Casa' | 'Pensionado';

  // Validación básica
  if (!titulo || !descripcion || !precioStr || !tipo) {
    return { error: "Todos los campos son obligatorios." };
  }

  const precio = parseFloat(precioStr);
  if (isNaN(precio) || precio <= 0) {
    return { error: "El precio debe ser un número válido mayor a 0." };
  }

  try {
    // Llamamos al servicio limpio para enviar los datos al backend
    // await AlojamientoService.publicar({ titulo, descripcion, precio, tipo });
    
    console.log("Alojamiento a publicar:", { titulo, descripcion, precio, tipo });
    
    // Si todo sale bien, redirigimos al usuario a la lista de habitaciones
    return redirect("/habitaciones");
  } catch (error) {
    console.error("Error al publicar:", error);
    return { error: "Hubo un error al conectar con el servidor. Intenta de nuevo." };
  }
}

// 2. COMPONENTE VISUAL
export default function PublicarPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        
        <header className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Publicar Alojamiento</h1>
          <p className="mt-2 text-gray-500">
            Completa los detalles de la habitación o propiedad que deseas alquilar.
          </p>
        </header>

        {actionData?.error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{actionData.error}</p>
          </div>
        )}

        <Form method="post" className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título del anuncio
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              placeholder="Ej. Habitación luminosa en el centro"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Tipo y Precio (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de propiedad
              </label>
              <select
                id="tipo"
                name="tipo"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="">Selecciona un tipo...</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Pensionado">Pensionado</option>
              </select>
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio mensual (USD/Local)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  required
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción detallada
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              rows={4}
              placeholder="Describe las comodidades, ambiente, reglas, etc..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>

          {/* Botón de Enviar */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isSubmitting ? "Publicando..." : "Publicar Anuncio"}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}