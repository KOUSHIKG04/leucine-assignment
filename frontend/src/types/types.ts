export interface User {
    id: number;
    username: string;
    role: 'Employee' | 'Manager' | 'Admin';
}

export interface Software {
    id: number;
    name: string;
    description: string;
    accessLevels: string[];
}

export interface AccessRequest {
    id: number;
    user: User;
    software: Software;
    accessType: 'Read' | 'Write' | 'Admin';
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
  }