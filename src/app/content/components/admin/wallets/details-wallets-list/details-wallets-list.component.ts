import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { WalletService } from 'src/app/content/service/admin/wallet.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-details-wallets-list',
  templateUrl: './details-wallets-list.component.html',
  styleUrls: ['./details-wallets-list.component.scss']
})
export class DetailsWalletsListComponent {

  public loadingTable: boolean = true;
  public detailWallets: any;
  public pageActual: number = 1;
  public ultimaPage: number = 1;
  public disablePageLeft: boolean = false;
  public disablePageRight: boolean = false;
  public pageCount: number = 30;
  public items: MenuItem[] = [];
  public formSearch: FormGroup;
  public currentUser: any;
  public usuario_id;
  constructor(
    private walletService:WalletService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private FB: FormBuilder,
    ) {}

    ngOnInit(): void {

      this.buildForm();
      this.getIndex();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));  
      this.usuario_id = this.currentUser.usuario.id;
      this.items = [
        { label: 'Anular Caja', command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'anularCaja') },
        { label: 'Cerrar Caja', command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'cerrarCaja') }
      ];
    }

    buildForm(){
      this.formSearch = this.FB.group({
        search: ['',[]],
      });
    }

    leftTable(){
    
    }

    rightTable(){
    
    } 

    onPage(event){
    
    };

    
    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1) {
      this.spinner.show();
      this.loadingTable = true;
      this.walletService.getAllDetalleCaja(pageCount, search, page).subscribe(
          (response: any) => {
              this.loadingTable = false; 
              this.ultimaPage = response.last_page;
              this.detailWallets = response.data;
              
              if(response.total>pageCount){
                  this.disablePageRight = true;
              }
              
              this.spinner.hide();
          },
          (error) => {
              console.log('Error: ', error);
              this.spinner.hide();
          }
      );
  }

  opcionSelect(event, opcion){
  
  }

  cerrarCaja(id:number, caja_id: number){
    Swal.fire({
      title: "¿Desea Cerrar Caja?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) { 
          this.sendCerrarCaja(id, caja_id);
        }   

    }); 
  }

  confirmDelete(id:number){
    Swal.fire({
      title: "¿Seguro Deseas Anular?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) { 
          this.sendAnularCaja(id)
        }   

    }); 
  }

  sendAnularCaja(id: number){

    let data = {
      id: id, 
    };
    this.spinner.show();

    this.walletService.anularCaja(data).subscribe(response => {
      this.spinner.hide();  
      let data = response;

      if(data.code == "success"){
        Swal.fire({
          title: "Exito",
          text: "Caja Anulada Exitosamente.",
          icon: "success"
        });
        this.getIndex();
      } else  if(data.code == "warning"){
        Swal.fire({
          title: "Advertencia",
          text: data.error,
          icon: "warning"
        });
      }   else {
        Swal.fire({
          title: "Error",
          text: "Error Al Anular.",
          icon: "error"
        });
      }
    });

  }

  sendCerrarCaja(id: number, caja_id: number){

    let data = {
      caja_id: caja_id,
      control_caja_id: id, 
    };
    this.spinner.show();

    this.walletService.cerrarCaja(data).subscribe(response => {
      this.spinner.hide();  
      let data = response;

      if(data.code == "success"){
        Swal.fire({
          title: "Exito",
          text: "Caja Cerrada Exitosamente.",
          icon: "success"
        });

        this.getIndex();

      } else  if(data.code == "warning"){
        Swal.fire({
          title: "Advertencia",
          text: data.error,
          icon: "warning"
        });
      }   else {
        Swal.fire({
          title: "Error",
          text: "Error Al Cerrar caja.",
          icon: "error"
        });
      }
    });
  }

  abrirCaja(){
    this.router.navigate(['dashboard/admin/wallets/'+this.usuario_id+'/abrirCaja']);
  } 

}
