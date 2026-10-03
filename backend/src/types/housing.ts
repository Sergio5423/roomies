export interface Housing {
  id: string;
  landlord_id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  services_included: string[];
  is_available: boolean;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateHousingDTO {
  title: string;
  description: string;
  address: string;
  price: number;
  services_included: string[];
  images?: string[];
}

export interface HousingFilterDTO {
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  search?: string;
}