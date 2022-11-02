import { Theme } from '@/layout/_data';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export interface IUserSetting {
  theme: Theme;
}
