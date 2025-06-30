export type RegisterRequestDto = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterResponseDto = {
    userId: number;
    username: string | null;
    email: string | null;
}

export type LoginRequestDto = {
    email: string;
    password: string;
}

export type User = {
    name: string | null;
    id: number;
    email: string | null;
}