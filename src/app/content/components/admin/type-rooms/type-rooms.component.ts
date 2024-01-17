import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { typeRoom } from 'src/app/content/models/dashboard/typeRoom.model';
import { TypeRoomsService } from 'src/app/content/service/typeRooms/type-rooms.service';

@Component({
  selector: 'app-type-rooms',
  templateUrl: './type-rooms.component.html',
  styleUrls: ['./type-rooms.component.scss']
})

export class TypeRoomsComponent {
    public typeRoomData: any[];
    public loadingTable :boolean = false;
    public pageCount: number = 10;
    public visibleModalTypeRoom: boolean = true;
    public formCreateTypeRoom: FormGroup;
    public formSearch: FormGroup;
    public formEditTypeRoom: FormGroup;
    public medida: any[];
    public imagen: any = null;
    public countRegisters: number;

    constructor(
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private typeRoomService: TypeRoomsService
    ){

    }

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalTypeRoom = false;
    }

    buildForm(){
        this.formSearch = this.FB.group({
            search: ['',[]],
          });

          this.formCreateTypeRoom = this.FB.group({
              nombre: ['',[Validators.required]],
              medida_id: ['',[Validators.required]]
          });

          this.formEditTypeRoom = this.FB.group({
            nombre: ['',[Validators.required]],
            medida_id: ['',[Validators.required]],
          });
    }

    openModal(){
        this.onCreate();
    }

    onCreate(){
        this.visibleModalTypeRoom = true;
    }

    onRemove(event){
        this.imagen = null;
    }

    onSelect(event) {
        this.imagen = event.currentFiles[0]//.objectURL.changingThisBreaksApplicationSecurity;
    }

    onPage(event){
        this.pageCount = event['rows'];
        this.getIndex('', this.pageCount);
    }

    submitCreate(){
        if(this.formCreateTypeRoom.valid){
            this.newTypeRoom();
          } else {
            this.formCreateTypeRoom.markAllAsTouched();
          }
    }

    newTypeRoom(){
        this.visibleModalTypeRoom = true;
    }

    getIndex(search:string = '', page:number = this.pageCount){
        this.spinner.show();
        this.loadingTable = true;
        this.typeRoomService.getAll(page, search).subscribe(
            (response: any) => {
            this.loadingTable = false;
                console.log('Response: ', response);
                this.typeRoomData = response.data;
                this.countRegisters = response.total;
                this.spinner.hide();
            },
            (error) => {
                console.log('Error: ', error);
                this.spinner.hide();
            }
        );
    }
}
