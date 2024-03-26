import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './content/components/notfound/notfound.component';
import { ProductService } from './content/service/product.service';
import { CountryService } from './content/service/country.service';
import { CustomerService } from './content/service/customer.service';
import { EventService } from './content/service/event.service';
import { IconService } from './content/service/icon.service';
import { NodeService } from './content/service/node.service';
import { PhotoService } from './content/service/photo.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './content/service/auth.service';
import { UsersService } from './content/service/admin/users.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SaleComponent } from './components/dashboard/sale/sale.component';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent, SaleComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        HttpClientModule, 
        SweetAlert2Module.forRoot()
    ],
    providers: [
        
        AuthService,
        UsersService,
        ProductService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
