import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { WalletService } from 'src/app/content/service/admin/wallet.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-details-wallets',
  templateUrl: './details-wallets.component.html',
  styleUrls: ['./details-wallets.component.scss']
})
export class DetailsWalletsComponent {

  public usuarioId: number;
  public form: FormGroup ;
  private dataCaja: any;
  private hoy: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private FB: FormBuilder, 
    private datePipe: DatePipe, 
    private spinner: NgxSpinnerService, 
    private walletService: WalletService,
  ) 
  {
    
  }

  ngOnInit(){
    this.spinner.hide();
    this.usuarioId = parseInt(this.route.snapshot.paramMap.get('id'));  
    this.buildForm();
    this.getDataAbrirCaja();
  } 

  buildForm(){

    const today = new Date();
    this.hoy = this.datePipe.transform(today, 'yyyy-MM-dd');

    this.form = this.FB.group({
      base : [this.dataCaja?.base, [Validators.required]],
      fecha : [this.hoy, [Validators.required]],
      usuario : [this.dataCaja?.usuario.usuario, [Validators.required]],  
      nombreCaja : [this.dataCaja?.nombre, [Validators.required]],    
    });

    this.form.disable();
  
  }

  abrirCaja(){
    let data = { 
      usuario_id: this.dataCaja?.usuario.id,
      caja_id: this.dataCaja?.id,
      saldo_base: this.dataCaja?.base,
    };

    this.walletService.abrirCaja(data).subscribe(response => {
      this.spinner.hide();   
      let data = response; 
      if(data.code == "success"){
        Swal.fire({
          title: "Exito",
          text: "Caja Abierta exitosamente.",
          icon: "success"
        });

        this.router.navigate(['dashboard/admin/wallets/detail']);

      } else  if(data.code == "warning"){
        Swal.fire({
          title: "Advertencia",
          text: data.error,
          icon: "warning"
        });
      }   else {
        Swal.fire({
          title: "Error",
          text: "Error al abrir caja.",
          icon: "error"
        });
      }
    });
  }

  getDataAbrirCaja(){
    this.walletService.getAbrirCaja(this.usuarioId).subscribe(response => {
      this.dataCaja = (response.caja);
      this.buildForm();
    });
  }
}
