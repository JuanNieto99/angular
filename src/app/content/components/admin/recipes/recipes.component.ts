import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Recipes } from 'src/app/content/models/admin/recipes.model';
import { RecipesService } from 'src/app/content/service/recipes/recipes.service';
import Swal from 'sweetalert2';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent {
    public recipesData: any[];
    public loadingTable :boolean = false;
    public visibleModalRecipes: boolean = true;
    public visibleModalRecipesEditar: boolean = false;
    public formCreateRecipes: FormGroup;
    public formSearch: FormGroup;
    public formEditRecipes: FormGroup;
    public hotel: any[];
    public nombre: string;
    public recipesDescripcion: any[];
    public precio: number;
    public imagen: any = null;
    public countRegisters: number;
    public idEditando: number = 0;

    //Buscador y Paginador
    public pageCount: number = 10;
    public first:number = 0;
    public rows:number = 8;
    public pageActual:number = 1;
    public ultimaPage:number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;



    constructor(
        private recipesService: RecipesService,
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private router: Router
    ){ }

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalRecipes = false;
    }

    redirectToRecipesProducts(id:number) {
        this.router.navigate(['/dashboard/admin/recipes/'+id+'/recipes-products']); // Redirige a la vista de productos
    }

    //CREAR

    openModal(){
        this.onCreate();
    }

    onCreate() {
        this.formCreateRecipes.reset();
        this.recipesService.getRecipes(0).subscribe(
            (response: any) => {
                this.hotel = response.hotel;
                this.nombre = response.nombre;
                this.recipesDescripcion = response.descripcion;
                this.precio = response.precio;
                this.visibleModalRecipes = true;
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    newRecipes() {
        this.spinner.show();
        let dataRecipes = this.formCreateRecipes.value;

        console.log(dataRecipes)

        dataRecipes.hotel_id = dataRecipes.hotel_id['id'];
        dataRecipes.estado = 1;

        this.recipesService.createRecipes(dataRecipes).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalRecipes = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Receta creada exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear la receta.',
                        icon: 'error',
                    });
                }
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    submitCreate() {
        if (this.formCreateRecipes.valid) {
            this.newRecipes();
        } else {
            this.formCreateRecipes.markAllAsTouched();
        }
    }

    //Editar

    editRecipes(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.recipesService.getRecipes(id).subscribe(
            (response: any) => {
                console.log(response);
                this.spinner.hide();

                // Accede al primer elemento del array para obtener el hotel
                this.hotel = response.hotel;
                const receta = response.receta;

                if (receta) {
                    this.nombre = receta.nombre;
                    this.recipesDescripcion = receta.descripcion;

                    // Convierte el precio a número
                    this.precio = parseFloat(receta.precio);

                    this.formEditRecipes.setValue({
                        hotel_id: this.hotel, // Ajusta según la estructura de la respuesta
                        precio: this.precio,
                        descripcion: this.recipesDescripcion,
                        nombre: this.nombre
                    });
                }

                setTimeout(() => {
                    this.visibleModalRecipesEditar = true;
                }, 1);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    updateRecipe() {
        this.spinner.show();
        let dataRecipes = this.formEditRecipes.value;
        dataRecipes.hotel_id = dataRecipes.hotel_id.id;
        dataRecipes.nombre = dataRecipes.nombre;
        dataRecipes.descripcion = dataRecipes.descripcion;
        dataRecipes.precio = dataRecipes.precio;
        dataRecipes.id = this.idEditando;
        dataRecipes.estado = 1;
        console.log(dataRecipes);

        this.recipesService.updateRecipes(dataRecipes).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalRecipesEditar = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Receta actualizado exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar la receta.',
                        icon: 'error',
                    });
                }
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    submitUpdate() {
        if (this.formEditRecipes.valid) {
            this.updateRecipe();
        }
    }

    //Eliminar

    confirmDelete(id:number){
        Swal.fire({
          title: "¿Estas seguro que deseas eliminar esta receta?",
          text: "Ten cuidado esta acción no se prodrá reversar",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Confirmar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.recipesService.deleteRecipes({id}).subscribe(
                (response: any) => {
                    this.spinner.hide();
                    if(response.code == "success"){

                    Swal.fire({
                        title: "Exito",
                        text: "Receta eliminada exitosamente.",
                        icon: "success"
                    });

                    this.getIndex();

                    }  else {

                    Swal.fire({
                        title: "Error",
                        text: "Error al eliminar la receta." ,
                        icon: "error"
                    });

                    }

                },
                (error) => {
                    console.log('Error: ', error);
                }
                );
            }
        });
    }

    //Construcción formulario e Index

    buildForm() {
        this.formSearch = this.FB.group({
            search: ['', []],
        });

        this.formCreateRecipes = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            precio: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
        });

        this.formEditRecipes = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            precio: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
        });
    }

    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1){
        this.spinner.show();
        this.loadingTable = true;
        this.recipesService.getAll(pageCount, search, page).subscribe(
          (response: any) => {
              this.loadingTable = false;
              this.recipesData = response.data;
              this.ultimaPage = response.last_page;
              this.countRegisters = response.total;
              this.ultimaPage = response.last_page;
              if(response.total>pageCount){
                  this.disablePageRight = true;
              }
              this.validatePage();
              this.spinner.hide();
          },
          (error) => {
              console.log('Error: ', error);
          }
        );
    }

    onRemove(event) {
        this.imagen = null;
    }

    onSelect(event) {
        this.imagen = event.currentFiles[0]; //.objectURL.changingThisBreaksApplicationSecurity;
    }

    onPage(event) {
        this.pageCount = event['rows'];
        this.getIndex('', this.pageCount);
    }

    //Buscador

    searchInput(){
        let search = this.formSearch.get('search').value;
        if(search==""){
          this.getIndex(search);
        }

    }

    search(dt){
        let search = this.formSearch.get('search').value;
        this.getIndex(search);
    }

    //Paginador

    onPageChange(event){
        this.first = event.first;
        this.rows = event.rows;
      }


      leftTable(){
        this.pageActual = this.pageActual - 1;
        this.getIndex('', this.pageCount, this.pageActual);
        this.validatePage();
      }

      rightTable(){
          this.pageActual = this.pageActual + 1;
          this.getIndex('', this.pageCount, this.pageActual);
          this.validatePage();
      }

      validatePage(){
        if(this.pageActual == 1 ){
            this.disablePageLeft = false;
        }

        if(this.pageActual > 1 ){
            this.disablePageLeft = true;
        }

        if(this.ultimaPage == this.pageActual){
            this.disablePageRight = false;
        }

        if(this.ultimaPage > this.pageActual){
            this.disablePageRight = true;
        }
    }

}
