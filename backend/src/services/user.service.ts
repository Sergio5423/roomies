import { supabase } from '../config/supabase';
import type { Profile } from '../types/user';
import { repositorioFactory } from '../config/repositorios';

const propietarioRepository = repositorioFactory.crearPropietarioRepository();

export class UserService {
  
  /**
   * Actualiza los datos permitidos del perfil de un usuario
   */
  static async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    const { first_name, last_name, phone } = data;

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        first_name,
        last_name,
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !updatedProfile) {
      throw new Error(error?.message || 'Error al actualizar la información en la base de datos.');
    }

    return updatedProfile as Profile;
  }

  //---------------Modificar esta consulta para que retorne estudiante o arrendatario como se necesite.

  static async getUserById(id: string) {
    // Lógica para buscar el usuario en la base de datos o en el repositorio
    return await propietarioRepository.obtenerPorId(id); // o la consulta que corresponda
  }
}