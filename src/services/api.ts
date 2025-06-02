
const BASE_URL = 'https://test.kogear.store/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Helper function to make GET requests
async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  return handleResponse<T>(response);
}

// Helper function to make POST requests
async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

// Helper function to make authenticated requests (if needed in future)
async function getWithAuth<T>(endpoint: string, token: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse<T>(response);
}

export const apiService = {
  // Authentication
  auth: {
    login: (data: { email: string; password: string }) => 
      post('/user/login', data),
    register: (data: { email: string; password: string; first_name: string; last_name: string; phone: string }) => 
      post('/user/register', data),
    logout: (email: string) => 
      post('/user/logout', { email }),
  },

  // Products
  products: {
    getAll: () => get('/customer/Product'),
    getById: (id: number) => get(`/customer/Product/${id}`),
    getDiscounted: () => get('/customer/discountedProducts'),
  },

  // Categories
  categories: {
    getAll: () => get('/customer/Category'),
    getById: (id: number) => get(`/customer/Category/${id}`),
  },

  // SubCategories
  subcategories: {
    getAll: () => get('/customer/SubCategory'),
    getById: (id: number) => get(`/customer/SubCategory/${id}`),
  },

  // Tags
  tags: {
    getAll: () => get('/customer/Tag'),
    getById: (id: number) => get(`/customer/Tag/${id}`),
  },

  // Colors
  colors: {
    getAll: () => get('/customer/colors'),
    getById: (id: number) => get(`/customer/colors/${id}`),
  },

  // Addons
  addons: {
    getAll: () => get('/admin/Addon'),
    getById: (id: number) => get(`/customer/Addon/${id}`),
  },

  // Sliders
  sliders: {
    getAll: () => get('/customer/sliders'),
    getById: (id: number) => get(`/customer/sliders/${id}`),
  },

  // Promo Codes
  promoCodes: {
    getAll: () => get('/customer/PromoCode'),
    getById: (id: number) => get(`/customer/PromoCode/${id}`),
  },

  // Buy X Get Y Promotions
  buyXGetY: {
    getAll: () => get('/customer/BuyXGetY'),
    getById: (id: number) => get(`/customer/BuyXGetY/${id}`),
  },

  // Slogans
  slogans: {
    getAll: () => get('/customer/slogan'),
    getById: (id: number) => get(`/customer/slogan/${id}`),
  },
};
