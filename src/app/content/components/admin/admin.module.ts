import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './admin-routing.module';
import { AdminInterceptor } from '../../interceptors/admin.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecipesComponent } from './recipes/recipes.component';

@NgModule({
    declarations: [ 
        RecipesComponent, 
    ],
    imports: [
        CommonModule,
        PagesRoutingModule
    ],
    providers: [
        {
            provide:HTTP_INTERCEPTORS,
            useClass:AdminInterceptor,
            multi:true
        }
    ]
})
export class PagesModule { }
