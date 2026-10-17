import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  User,
  KeyRound,
  Plus,
  LogOut,
  Sparkles,
  Building,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { AuthStore, type StoredUser } from '../../application/services/auth.store';

interface AuthBannerProps {
  currentUser: StoredUser | null;
  onOpenCreateModal: () => void;
  onAuthChange: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export default function AuthBanner({
  currentUser,
  onOpenCreateModal,
  onAuthChange,
  onShowToast,
}: AuthBannerProps) {
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async (role: 'ARRENDATARIO' | 'ESTUDIANTE', userIndex = 1) => {
    setLoading(true);
    try {
      if (role === 'ARRENDATARIO') {
        if (userIndex === 2) {
          await AuthStore.loginDemoArrendatario2();
          onShowToast(
            'success',
            'Sesión iniciada como Arrendatario 2 (Juan)',
            'Ahora puedes modificar las publicaciones que fueron creadas por Juan (ej: H1).'
          );
        } else {
          await AuthStore.loginDemoArrendatario();
          onShowToast(
            'success',
            'Sesión iniciada como Arrendatario 1',
            'Solo podrás modificar los alojamientos publicados por esta cuenta.'
          );
        }
      } else {
        await AuthStore.loginDemoEstudiante();
        onShowToast(
          'success',
          'Modo Estudiante Activado',
          'Iniciaste sesión como estudiante para explorar habitaciones y contactar propietarios.'
        );
      }
      onAuthChange();
    } catch (err: any) {
      onShowToast('error', 'Error al autenticar', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthStore.clearAuth();
    onAuthChange();
    onShowToast('info', 'Sesión cerrada', 'Ahora navegas como visitante anónimo.');
  };

  const isArrendatario = currentUser?.role === 'ARRENDATARIO';
  const isEstudiante = currentUser && !isArrendatario;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg p-5 mb-8 border transition-all ${
        isArrendatario
          ? 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border-emerald-800/40'
          : isEstudiante
          ? 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-blue-800/40'
          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-amber-500/30'
      }`}
    >
      {/* Decorative ambient background */}
      <div
        className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isArrendatario
            ? 'bg-emerald-500/10'
            : isEstudiante
            ? 'bg-blue-500/10'
            : 'bg-amber-500/10'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left side: user badge & message */}
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${
              isArrendatario
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                : isEstudiante
                ? 'bg-blue-600 text-white ring-2 ring-blue-400/40'
                : 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
            }`}
          >
            {isArrendatario ? (
              <Building className="h-5 w-5" />
            ) : isEstudiante ? (
              <User className="h-5 w-5" />
            ) : (
              <KeyRound className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold tracking-wide text-white">
                {currentUser
                  ? `${currentUser.first_name || ''} ${currentUser.last_name || ''} (${currentUser.email})`
                  : 'Modo Visitante'}
              </span>

              {currentUser ? (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    isArrendatario
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" />
                  {currentUser.role}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-semibold">
                  <AlertTriangle className="h-3 w-3" />
                  Solo lectura
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-1">
              {isArrendatario ? (
                <span>
                  Has iniciado sesión como propietario. <strong>Solo puedes modificar los alojamientos que publicaste con tu cuenta</strong> (los de otros propietarios permanecerán en modo solo lectura).
                </span>
              ) : isEstudiante ? (
                <span className="text-blue-200">
                  Iniciaste como <strong>Estudiante</strong>. Puedes explorar y contactar propietarios. Para <strong>publicar habitaciones</strong> debes tener una cuenta con rol <strong>Arrendatario</strong>.
                </span>
              ) : (
                <span className="text-slate-300">
                  Estás navegando como <strong>visitante</strong>. Para <strong>publicar o administrar tus alojamientos</strong> es necesario iniciar sesión como <strong>Arrendatario</strong>.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right side: quick actions & demo switcher */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {!currentUser ? (
            <>
              <button
                type="button"
                onClick={() => handleDemoLogin('ARRENDATARIO', 1)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                {loading ? 'Iniciando...' : 'Arrendatario 1 (Demo)'}
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('ARRENDATARIO', 2)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                {loading ? 'Iniciando...' : 'Arrendatario 2 (Dueño H1)'}
              </button>

              <Link
                to="/login"
                className="inline-flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors"
              >
                <span>Iniciar sesión</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          ) : (
            <>
              {isArrendatario && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      handleDemoLogin(
                        'ARRENDATARIO',
                        currentUser.email === 'arrendatario1@gmail.com' ? 2 : 1
                      )
                    }
                    disabled={loading}
                    className="inline-flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-semibold text-slate-200 transition"
                    title="Alternar entre diferentes cuentas de propietarios para verificar permisos"
                  >
                    <span>Cambiar a {currentUser.email === 'arrendatario1@gmail.com' ? 'Arrendatario 2 (Juan)' : 'Arrendatario 1'}</span>
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={onOpenCreateModal}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    Publicar Alojamiento
                  </motion.button>
                </>
              )}

              {isEstudiante && (
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ARRENDATARIO', 1)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                >
                  <Building className="h-3.5 w-3.5 text-emerald-200" />
                  Cambiar a rol Arrendatario
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-200 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors border border-white/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
