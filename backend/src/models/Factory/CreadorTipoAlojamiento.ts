import type { TipoAlojamiento } from '../Alojamiento/TipoAlojamiento';
import type { Regla } from '../Alojamiento/Regla';

export abstract class CreadorTipoAlojamiento {
  protected abstract crearTipo(): TipoAlojamiento;
  public crear(reglas: Regla[] = []): TipoAlojamiento {
    const tipo = this.crearTipo();
    tipo.setReglas([...reglas]);
    return tipo;
  }
}
