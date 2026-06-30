import type { CartItem } from '@/store/cart.store';
import { formatCurrency } from '@/lib/utils';

interface CheckoutData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  notes: string;
}

export function buildWhatsAppMessage(
  restaurantName: string,
  items: CartItem[],
  total: number,
  checkout: CheckoutData
): string {
  const itemsText = items
    .map((item) => {
      let line = `• ${item.quantity}× ${item.productName} — ${formatCurrency(item.subtotal)}`;
      if (item.additionals.length > 0) {
        const adds = item.additionals.map((a) => `${a.name} (+${formatCurrency(a.price)})`).join(', ');
        line += `\n  ↳ ${adds}`;
      }
      if (item.specialInstructions) {
        line += `\n  📝 ${item.specialInstructions}`;
      }
      return line;
    })
    .join('\n');

  const lines = [
    `🍽️ *Nuevo pedido — ${restaurantName}*`,
    '',
    `👤 *Cliente:* ${checkout.customerName}`,
    `📱 *Teléfono:* ${checkout.customerPhone}`,
    checkout.customerAddress ? `📍 *Dirección:* ${checkout.customerAddress}` : null,
    '',
    `*Pedido:*`,
    itemsText,
    '',
    `💳 *Pago:* ${checkout.paymentMethod}`,
    `💰 *Total: ${formatCurrency(total)}*`,
    checkout.notes ? `\n📝 *Notas:* ${checkout.notes}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');

  return lines;
}

export function openWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
