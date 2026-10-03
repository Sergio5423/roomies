import { Pensionado } from '../Alojamiento/Pensionado';
import { CreadorTipoAlojamiento } from './CreadorTipoAlojamiento';

export class CreadorPensionado extends CreadorTipoAlojamiento {
  protected crearTipo(): Pensionado { return new Pensionado(); }
}
