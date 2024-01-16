import { inject } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/content/service/auth.service';

export const LoginGuard = () => {
  
  const router = inject(Router)
  const auth = inject(AuthService )
  
    if (localStorage.getItem('currentUser')) {
        return true;
    }
    else{
      router.navigate(['/auth/login'])
      return false;   
    }
}
