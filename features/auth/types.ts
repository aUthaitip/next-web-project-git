export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  lineUserId: string;
}
export interface LoginInput { email: string; password: string }
export interface RegisterInput extends LoginInput { name: string; phone: string }
