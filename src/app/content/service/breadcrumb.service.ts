import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
 providedIn: 'root'
})
export class BreadcrumbService {
 private breadcrumbs = new BehaviorSubject<string[]>([]);
 currentBreadcrumbs = this.breadcrumbs.asObservable();

 private removeSubject = new Subject<string>();
 removeItem = this.removeSubject.asObservable();

 constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs(event.urlAfterRedirects);
      }
    });
 }

 private updateBreadcrumbs(url: string): void {
    const urlParts = url.split('/');
    const breadcrumbs = urlParts.map((part, index) => {
      if (index === 0) {
        return 'Home';
      } else if (index === urlParts.length - 1) {
        return part;
      } else {
        return part;
      }
    });
    this.breadcrumbs.next(breadcrumbs);
 }

 addItem(item: string): void {
    this.breadcrumbs.getValue().push(item);
    this.breadcrumbs.next(this.breadcrumbs.getValue());
 }

 quitItem(item: string): void {
    this.removeSubject.next(item);
 }
}