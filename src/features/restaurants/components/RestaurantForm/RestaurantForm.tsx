'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';

import { useRestaurantForm } from '../../hooks/useRestaurantForm';
import { useCreateRestaurant } from '../../hooks/useRestaurantMutations';
import { useUpdateRestaurant } from '../../hooks/useRestaurantMutations';
import type { RestaurantFormProps } from './RestaurantForm.types';

export function RestaurantForm({ restaurant, onSuccess, onCancel }: RestaurantFormProps) {
  const { data, errors, handleChange, validate, toCreateData, toUpdateData, isEditing } =
    useRestaurantForm(restaurant);

  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing && restaurant) {
        await updateMutation.mutateAsync({ id: restaurant.id, data: toUpdateData() });
      } else {
        await createMutation.mutateAsync(toCreateData());
      }
      onSuccess();
    } catch (error) {
      // El error se muestra desde el estado del mutation
    }
  }

  const mutationError = createMutation.error?.message ?? updateMutation.error?.message;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="space-y-6 p-6">

        {/* Sección: Información básica */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Información básica
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre del restaurante"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Ej: La Parrilla de Juan"
              required
              disabled={isPending}
            />
            <Input
              label="Slug (URL)"
              value={data.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              error={errors.slug}
              placeholder="la-parrilla-de-juan"
              hint="Se auto-genera desde el nombre"
              required
              disabled={isPending || isEditing}
            />
          </div>

          <Textarea
            label="Descripción"
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            placeholder="Breve descripción del restaurante..."
            rows={3}
            required
            disabled={isPending}
          />

          <Input
            label="Teléfono / WhatsApp"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="+57 300 000 0000"
            required
            disabled={isPending}
          />
        </section>

        {/* Sección: Branding */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Branding
          </h3>

          <ImageUpload
            label="Logo del restaurante *"
            value={data.logo}
            onChange={(url) => handleChange('logo', url)}
            disabled={isPending}
            aspectRatio="wide"
          />
          {errors.logo && <p className="text-xs text-red-600">{errors.logo}</p>}

          {/* Header type */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Encabezado del menú público</p>
            <div className="flex gap-4">
              {(['text', 'image'] as const).map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                >
                  <input
                    type="radio"
                    value={type}
                    checked={data.headerType === type}
                    onChange={() => handleChange('headerType', type)}
                    className="accent-orange-500"
                    disabled={isPending}
                  />
                  {type === 'text' ? 'Solo texto / logo' : 'Imagen de banner'}
                </label>
              ))}
            </div>
          </div>

          {data.headerType === 'image' && (
            <ImageUpload
              label="Imagen de banner"
              value={data.bannerImage}
              onChange={(url) => handleChange('bannerImage', url)}
              disabled={isPending}
              aspectRatio="wide"
            />
          )}
        </section>

        {/* Sección: Tema */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Paleta de colores
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {(
              [
                { field: 'primaryColor', label: 'Color primario' },
                { field: 'secondaryColor', label: 'Color secundario' },
                { field: 'accentColor', label: 'Color de acento' },
              ] as const
            ).map(({ field, label }) => (
              <div key={field} className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    disabled={isPending}
                    className="h-9 w-12 cursor-pointer rounded border border-gray-300 p-0.5"
                  />
                  <span className="font-mono text-xs text-gray-500">{data[field]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="flex gap-2">
            <span
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: data.primaryColor }}
            >
              Botón primario
            </span>
            <span
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: data.secondaryColor }}
            >
              Secundario
            </span>
            <span
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: data.accentColor, color: data.secondaryColor }}
            >
              Acento
            </span>
          </div>
        </section>

        {/* Sección: Usuario administrador (solo en creación) */}
        {!isEditing && (
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Usuario administrador
            </h3>
            <p className="text-xs text-gray-500">
              Este usuario podrá acceder al dashboard del restaurante.
            </p>

            <Input
              label="Nombre completo"
              value={data.adminName}
              onChange={(e) => handleChange('adminName', e.target.value)}
              error={errors.adminName}
              placeholder="Juan García"
              required
              disabled={isPending}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Correo electrónico"
                type="email"
                value={data.adminEmail}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
                error={errors.adminEmail}
                placeholder="admin@restaurante.com"
                required
                disabled={isPending}
              />
              <Input
                label="Contraseña"
                type="password"
                value={data.adminPassword}
                onChange={(e) => handleChange('adminPassword', e.target.value)}
                error={errors.adminPassword}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={isPending}
              />
            </div>
          </section>
        )}

        {/* Estado */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 rounded accent-orange-500"
            disabled={isPending}
          />
          <span className="text-sm font-medium text-gray-700">Restaurante activo</span>
        </label>

        {mutationError && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{mutationError}</p>
        )}
      </div>

      {/* Footer con botones */}
      <div className="flex flex-shrink-0 gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isPending} className="flex-1">
          {isEditing ? 'Guardar cambios' : 'Crear restaurante'}
        </Button>
      </div>
    </form>
  );
}
