import { CanActivateFn } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { inject } from '@angular/core';
export const permissionsGuard: CanActivateFn = (route, state) => {

  const usersService = inject(UsersService);
  
  return usersService.getCurrenUser() !== null;
  return true;
};