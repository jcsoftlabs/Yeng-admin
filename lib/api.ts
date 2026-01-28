const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    }

    async request(endpoint: string, options: RequestInit = {}) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
            throw new Error(error.message || 'Une erreur est survenue');
        }

        return response.json();
    }

    // Auth
    async login(email: string, password: string) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.access_token);
        return data;
    }

    // Customers
    async getCustomers(search?: string) {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.request(`/customers${query}`);
    }

    async getCustomer(id: string) {
        return this.request(`/customers/${id}`);
    }

    async createCustomer(data: any) {
        return this.request('/customers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async searchCustomersByCode(code: string) {
        return this.request(`/customers/search/by-code?code=${encodeURIComponent(code)}`);
    }

    // Parcels
    async getParcels(filters?: { status?: string; customerId?: string; search?: string }) {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.customerId) params.append('customerId', filters.customerId);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/parcels${query}`);
    }

    async getParcel(id: string) {
        return this.request(`/parcels/${id}`);
    }

    async getParcelByTracking(trackingNumber: string) {
        return this.request(`/parcels/tracking/${trackingNumber}`);
    }

    async createParcel(data: any) {
        return this.request('/parcels', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateParcelStatus(id: string, data: { status: string; location?: string; description?: string }) {
        return this.request(`/parcels/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Payments
    async getPayments(parcelId?: string) {
        const query = parcelId ? `?parcelId=${parcelId}` : '';
        return this.request(`/payments${query}`);
    }

    async createPayment(data: any) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const api = new ApiClient();
