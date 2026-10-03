import type { TipoAlojamiento } from '../Alojamiento/TipoAlojamiento';
import type { CreadorTipoAlojamiento } from './CreadorTipoAlojamiento';
import { CreadorApartamento } from './CreadorApartamento';
import { CreadorCasa } from './CreadorCasa';
import { CreadorPensionado } from './CreadorPensionado';

/** Fachada: selecciona el creador que ejecuta el Factory Method. */
export class TipoAlojamientoFactory {
  private static readonly creadores = new Map<string, CreadorTipoAlojamiento>([
    ['Apartamento', new CreadorApartamento()],
    ['Casa', new CreadorCasa()],
    ['Pensionado', new CreadorPensionado()],
  ]);
  public static crear(tipo: string): TipoAlojamiento {
    const creador = this.creadores.get(tipo);
    if (!creador) throw new Error('Tipo de alojamiento no soportado o invalido: ' + tipo);
    return creador.crear();
  }
}
