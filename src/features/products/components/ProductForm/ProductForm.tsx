'use client';

import { Plus, Trash2 } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { formatCurrency } from '@/lib/utils';

import { useProductForm } from '../../hooks/useProductForm';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProductMutations';
import type { ProductFormProps } from './ProductForm.types';

export function ProductForm({
  product,
  restaurantId,
  categories,
  defaultSortOrder = 1,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const {
    data,
    errors,
    handleChange,
    addAdditional,
    updateAdditional,
    removeAdditional,
    validate,
    toCreateData,
    toUpdateData,
    isEditing,
  } = useProductForm(restaurantId, product, defaultSortOrder);

  const createMutation = useCreateProduct(restaurantId);
  const updateMutation = useUpdateProduct(restaurantId);
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && product) {
      await updateMutation.mutateAsync({ id: product.id, data: toUpdateData() });
    } else {
      await createMutation.mutateAsync(toCreateData());
    }
    onSuccess();
  }

  const mutationError = createMutation.error?.message ?? updateMutation.error?.message;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="space-y-6 p-6">

        {/* Categoría y nombre */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={data.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-50"
            >
              <option value="">Seleccioná una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <Input
            label="Nombre del producto"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Ej: Hamburguesa clásica"
            required
            disabled={isPending}
          />
        </div>

        <Textarea
          label="Descripción"
          value={data.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Ingredientes, acompañamientos..."
          rows={2}
          disabled={isPending}
        />

        {/* Precio, orden y tag */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Input
              label="Precio"
              type="number"
              value={String(data.price)}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              error={errors.price}
              min="0"
              step="100"
              required
              disabled={isPending}
              hint={data.price > 0 ? formatCurrency(data.price) : undefined}
            />
          </div>

          <Input
            label="Orden"
            type="number"
            value={String(data.sortOrder)}
            onChange={(e) => handleChange('sortOrder', Number(e.target.value))}
            error={errors.sortOrder}
            min="1"
            required
            disabled={isPending}
          />

          <Input
            label="Tag especial"
            value={data.tag}
            onChange={(e) => handleChange('tag', e.target.value)}
            placeholder="Nuevo, Especial..."
            disabled={isPending}
          />
        </div>

        {/* Imagen */}
        <ImageUpload
          label="Imagen del producto"
          value={data.image}
          onChange={(url) => handleChange('image', url)}
          disabled={isPending}
          aspectRatio="wide"
        />

        {/* Adicionales */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Adicionales</h3>
            <button
              type="button"
              onClick={addAdditional}
              disabled={isPending}
              className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar adicional
            </button>
          </div>

          {data.additionals.length === 0 && (
            <p className="text-xs text-gray-400">Sin adicionales. Podés agregar extras opcionales.</p>
          )}

          <div className="space-y-2">
            {data.additionals.map((additional, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={additional.name}
                  onChange={(e) => updateAdditional(index, 'name', e.target.value)}
                  placeholder="Nombre (Ej: Queso extra)"
                  disabled={isPending}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <input
                  type="number"
                  value={additional.price}
                  onChange={(e) => updateAdditional(index, 'price', Number(e.target.value))}
                  placeholder="Precio"
                  min="0"
                  disabled={isPending}
                  className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => removeAdditional(index)}
                  disabled={isPending}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Switches de estado */}
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={data.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 rounded accent-orange-500"
              disabled={isPending}
            />
            <span className="text-sm font-medium text-gray-700">Activo en el menú</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={data.isAvailable}
              onChange={(e) => handleChange('isAvailable', e.target.checked)}
              className="h-4 w-4 rounded accent-orange-500"
              disabled={isPending}
            />
            <span className="text-sm font-medium text-gray-700">Disponible hoy</span>
          </label>
        </div>

        {mutationError && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{mutationError}</p>
        )}
      </div>

      <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isPending} className="flex-1">
          {isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}
