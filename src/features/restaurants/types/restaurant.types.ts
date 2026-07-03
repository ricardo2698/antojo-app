export interface RestaurantFormData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  phone: string;
  logo: string;
  bannerImage: string;
  headerType: 'image' | 'text';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  isActive: boolean;
  // Ubicación
  address: string;
  city: string;
  mapUrl: string;
  mapEmbed: string;
  // Redes sociales
  instagram: string;
  facebook: string;
  // Formato del menú
  menuLayout: 'cards' | 'list';
  // Solo en creación
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

