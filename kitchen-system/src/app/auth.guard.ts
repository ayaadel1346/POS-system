import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../environment';
import * as CryptoJS from 'crypto-js';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const SECRET_KEY = environment.SECRET_KEY;
  const encryptedRole = sessionStorage.getItem('role');

  if (!encryptedRole) {
    router.navigateByUrl('login');
    return false;
  } else {
    const decryptedRole = CryptoJS.AES.decrypt(encryptedRole, SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (decryptedRole === 'admin') {
      return true;
    } else {
      router.navigateByUrl('login'); 
      return false;
    }
  }
};
