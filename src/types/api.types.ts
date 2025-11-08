export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface Group {
  assignments_count: number;
  products_count: number;
  users_count: number;
}

export interface Assignment {
  user: string;
  product_name: string;
  amount: number;
  bought: number;
}

export interface Product {
  name: string;
  amount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}