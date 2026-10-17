import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  Home,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  MapPin,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  tipo: string; // 'Todos' | 'Apartamento' | 'Casa' | 'Pensionado'
  estado: string; // 'Todos' | 'disponible' | 'ocupado'
  precioPreset: string; // 'all' | 'under500' | '500to900' | 'over900'
  soloAmoblado: boolean;
  soloRoomie: boolean;
  minCuartos: number; // 0 = any, 1, 2, 3
  sortBy: 'recent' | 'priceAsc' | 'priceDesc' | 'rating';
  viewMode: 'grid' | 'list' | 'map';
}

interface RoomFiltersProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

const TIPOS = [
  { id: 'Todos', label: 'Todos los tipos' },
  { id: 'Apartamento', label: 'Apartamentos' },
  { id: 'Casa', label: 'Casas' },
  { id: 'Pensionado', label: 'Pensionados' },
];

const PRECIOS = [
  { id: 'all', label: 'Cualquier precio' },
  { id: 'under500', label: 'Hasta $500.000' },
  { id: '500to900', label: '$500k - $900k' },
  { id: 'over900', label: 'Más de $900.000' },
];

export default function RoomFilters({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}: RoomFiltersProps) {
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.tipo !== 'Todos' ||
    filters.estado !== 'Todos' ||
    filters.precioPreset !== 'all' ||
    filters.soloAmoblado ||
    filters.soloRoomie ||
    filters.minCuartos > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 mb-8">
      {/* 1. TOP BAR: SEARCH INPUT & VIEW MODES */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search input with icons */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Buscar por título, barrio, ciudad (ej: Centro, Novalito, Valledupar)..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher & Sort Selector */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy'],
                }))
              }
              aria-label="Ordenar resultados por"
              className="bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option value="recent">Más recientes</option>
              <option value="priceAsc">Precio: Menor a Mayor</option>
              <option value="priceDesc">Precio: Mayor a Menor</option>
              <option value="rating">Mayor calificación</option>
            </select>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, viewMode: 'grid' }))}
              className={`p-2 rounded-lg text-xs font-semibold transition ${
                filters.viewMode === 'grid'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista en Cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, viewMode: 'list' }))}
              className={`p-2 rounded-lg text-xs font-semibold transition ${
                filters.viewMode === 'list'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista en Lista"
            >
              <List className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, viewMode: 'map' }))}
              className={`p-2 rounded-lg text-xs font-semibold transition ${
                filters.viewMode === 'map'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Vista en Mapa"
            >
              <MapPin className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHIP FILTERS: TIPO, ESTADO, PRECIO, CARACTERÍSTICAS */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
        {/* Tipos */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {TIPOS.map((tipo) => {
            const isSelected = filters.tipo === tipo.id;
            return (
              <button
                key={tipo.id}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, tipo: tipo.id }))}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tipo.label}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-gray-200 hidden sm:block mx-1" />

        {/* Estado: Disponible / Ocupado */}
        <div className="flex items-center gap-1.5 py-1">
          <button
            type="button"
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                estado: prev.estado === 'disponible' ? 'Todos' : 'disponible',
              }))
            }
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filters.estado === 'disponible'
                ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Solo Disponibles
          </button>

          <button
            type="button"
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                estado: prev.estado === 'ocupado' ? 'Todos' : 'ocupado',
              }))
            }
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filters.estado === 'ocupado'
                ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-500'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Ocupados
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200 hidden sm:block mx-1" />

        {/* Precios preset */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {PRECIOS.map((precio) => {
            const isSelected = filters.precioPreset === precio.id;
            return (
              <button
                key={precio.id}
                type="button"
                onClick={() =>
                  onChange((prev) => ({ ...prev, precioPreset: precio.id }))
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {precio.label}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-gray-200 hidden sm:block mx-1" />

        {/* Amoblado toggle */}
        <button
          type="button"
          onClick={() =>
            onChange((prev) => ({ ...prev, soloAmoblado: !prev.soloAmoblado }))
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filters.soloAmoblado
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🛋️ Amoblado
        </button>

        {/* Buscando Roomie toggle */}
        <button
          type="button"
          onClick={() =>
            onChange((prev) => ({ ...prev, soloRoomie: !prev.soloRoomie }))
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filters.soloRoomie
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          👥 Busca Roomie
        </button>

        {/* Botón Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* 3. COUNTER & ACTIVE BADGES BAR */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div>
          Mostrando <span className="font-bold text-gray-900">{filteredCount}</span> de{' '}
          <span className="font-bold text-gray-900">{totalCount}</span> alojamientos disponibles
        </div>

        {hasActiveFilters && (
          <span className="text-emerald-700 font-medium">
            Filtros aplicados activamente
          </span>
        )}
      </div>
    </div>
  );
}
