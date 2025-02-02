export interface IUser {
  firstName: string;
  lastName: string;
  middleName: null | string;
  age: number;
  birthDate: string;
  email: string;
  password: string;
  verified: boolean;
  refreshToken: string | null;
}
