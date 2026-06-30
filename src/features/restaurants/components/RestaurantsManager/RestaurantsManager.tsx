'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Restaurant } from '@/types';

import { useRestaurants } from '../../hooks/useRestaurants';
import {
  useToggleRestaurantActive,
  useDeleteRestaurant,
} from '../../hooks/useRestaurantMutations';
import { RestaurantList } from '../RestaurantList';
import { RestaurantForm } from '../RestaurantForm';

export function RestaurantsManager() {
  const { data: restaurants = [], isLoading, error } = useRestaurants();

  const toggleActive = useToggleRestaurantActive();
  const deleteRestaurant = useDeleteRestaurant();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Restaurant | undefined>(undefined);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(restaurant: Restaurant) {
    setEditing(restaurant);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditing(undefined);
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    setTogglingId(id);
    try {
      await toggleActive.mutateAsync({ id, isActive });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    try {
      await deleteRestaurant.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        Error al cargar los restaurantes.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restaurantes</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {restaurants.length} restaurante{restaurants.length !== 1 ? 's' : ''} registrado
            {restaurants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleAdd} size="md">
          <Plus className="h-4 w-4" />
          Nuevo restaurante
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {/* Lista */}
      <RestaurantList
        restaurants={filtered}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
        togglingId={togglingId}
        deletingId={deletingId}
      />

      {/* Modal de creación/edición */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editing ? `Editar: ${editing.name}` : 'Nuevo restaurante'}
        description={
          editing
            ? 'Actualizá la información del restaurante.'
            : 'Completá los datos para crear el restaurante y su usuario administrador.'
        }
        size="xl"
      >
        <RestaurantForm
          restaurant={editing}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
