import type { IPropietarioRepository } from './IPropietarioRepository';
import { Propietario } from '../models/Usuario/Propietario';
import { supabase } from '../config/supabase';

export class SupabasePropietarioRepository implements IPropietarioRepository {

    async obtenerPorId(id: string): Promise<Propietario | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle(); // Usar maybeSingle() en lugar de single() evita que lance excepción si no encuentra

        if (error) {
            console.error("Error al consultar perfil en Supabase:", error.message);
            return null;
        }

        if (!data) {
            console.error(`No se encontró ningún registro en 'profiles' para el id: ${id}`);
            return null;
        }

        // Mapeo tolerante a nulos o variaciones de columnas (phone vs telefono)
        return new Propietario(
            data.id,
            data.first_name || '',
            data.last_name || '',
            data.email,
            data.phone || data.telefono || ''
        );
    }

    async obtenerTodos(): Promise<Propietario[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'ARRENDATARIO');

        if (error || !data) return [];

        return data.map(
            (p) => new Propietario(p.id, p.first_name, p.last_name, p.email, p.phone)
        );
    }

    async guardar(propietario: Propietario): Promise<Propietario> {
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                id: propietario.getId(),
                first_name: propietario.getFirstName(),
                last_name: propietario.getLastName(),
                email: propietario.getEmail(),
                phone: propietario.getTelefono(),
                role: propietario.getRol(), // Devuelve 'ARRENDATARIO'
            })
            .select('*')
            .single();

        if (error || !data) {
            throw new Error(`Error al guardar el propietario: ${error?.message}`);
        }

        return propietario;
    }

    async actualizar(propietario: Propietario): Promise<Propietario> {
        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: propietario.getFirstName(),
                last_name: propietario.getLastName(),
                phone: propietario.getTelefono(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', propietario.getId());

        if (error) {
            throw new Error(`Error al actualizar el propietario: ${error.message}`);
        }

        return propietario;
    }

    async eliminar(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        return !error;
    }
}