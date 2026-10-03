import { Apartamento } from '../Alojamiento/Apartamento';
import { CreadorTipoAlojamiento } from './CreadorTipoAlojamiento';

export class CreadorApartamento extends CreadorTipoAlojamiento {
  protected crearTipo(): Apartamento { return new Apartamento(); }
}
