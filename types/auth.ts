// Tipos para autenticación
export interface LoginResponse {
  data: {
    success: boolean;
    token: string;
    // message?: string;
    // user?: {
    //   id: string;
    //   email: string;
    //   name: string;
    // };
  };
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface UserData {
  success: boolean;
  data: { data: { firstName: string; email: string; lastName: string } };
}
