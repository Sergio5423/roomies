import { Casa } from '../Alojamiento/Casa';
import { CreadorTipoAlojamiento } from './CreadorTipoAlojamiento';

export class CreadorCasa extends CreadorTipoAlojamiento {
  protected crearTipo(): Casa { return new Casa(); }
}
