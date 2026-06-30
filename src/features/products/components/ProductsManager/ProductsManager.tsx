'use client';

import { useState } from 'react';
import { Plus, Search, Package } from 'lucide-react';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { Category, Product } from '@/types';

import { useProducts } from '../../hooks/useProducts';
import { useToggleProductAvailable, useDeleteProduct } from '../../hooks/useProductMutations';
import { ProductCard } from '../ProductCard';
import { ProductForm } from '../ProductForm';

export function ProductsManager() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId ?? '';

  const { data: products = [], isLoading: loadingProducts } = useProducts(restaurantId);
  const { data: categories = [], isLoading: loadingCategories } = useCategories(restaurantId);

  const toggleAvailable = useToggleProductAvailable(restaurantId);
  const deleteProduct = useDeleteProduct(restaurantId);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>(undefined);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || p.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  function handleEdit(product: Product) {
    setEditing(product);
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

  async function handleToggleAvailable(id: string, isAvailable: boolean) {
    setTogglingId(id);
    try {
      await toggleAvailable.mutateAsync({ id, isAvailable });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar el producto "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (!restaurantId) {
    return <p className="text-sm text-red-600">Tu cuenta no tiene un restaurante asignado.</p>;
  }

  const isLoading = loadingProducts || loadingCategories;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {products.length} producto{products.length !== 1 ? 's' : ''} en el menú
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {search || filterCategory ? 'Sin resultados' : 'Sin productos'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || filterCategory
              ? 'Probá con otros filtros.'
              : 'Creá los productos de tu menú.'}
          </p>
          {!search && !filterCategory && (
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="h-4 w-4" />
              Crear primer producto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={categoryMap.get(product.categoryId)}
              onEdit={handleEdit}
              onToggleAvailable={handleToggleAvailable}
              onDelete={handleDelete}
              isToggling={togglingId === product.id}
              isDeleting={deletingId === product.id}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editing ? `Editar: ${editing.name}` : 'Nuevo producto'}
        size="xl"
      >
        <ProductForm
          product={editing}
          restaurantId={restaurantId}
          categories={categories}
          defaultSortOrder={products.length + 1}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
