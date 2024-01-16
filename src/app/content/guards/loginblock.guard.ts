import { inject } from "@angular/core";
import { Router } from '@angular/router';

export const LoginBlockGuard = () => {
  
  const router = inject(Router)
  
    if (localStorage.getItem('currentUser')) {
        router.navigate(['/dashboard'])
        return false;
    }
    else{
      return true;   
    }
}
