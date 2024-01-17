import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InternalSequenceService } from 'src/app/content/service/internalSequence/internal-sequence.service';




@Component({
  selector: 'app-internal-sequence',
  templateUrl: './internal-sequence.component.html',
  styleUrls: ['./internal-sequence.component.scss']
})
export class InternalSequenceComponent {
    public loadingTable: boolean = false;
    public internalSequenceData: any[];
    public pageCount: number = 10;
    public visibleModalInternalSequence: boolean = true;
    public formCreateInternalSequence: FormGroup;
    public formSearch: FormGroup;
    public countRegisters: number;
    public formEditInternalSequence: FormGroup;

    constructor(
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private InternalSequenceService: InternalSequenceService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalInternalSequence = false;
    }

    buildForm() {
        this.formSearch = this.FB.group({
            search: ['', []],
        });

        this.formCreateInternalSequence = this.FB.group({
            nombre: ['', [Validators.required]],
            hotel_id: ['', [Validators.required]],
        });

        this.formEditInternalSequence = this.FB.group({
            nombre: ['', [Validators.required]],
            hotel_id: ['', [Validators.required]],
        });
    }

    getIndex(search: string = '', page: number = this.pageCount) {
        this.spinner.show();
        this.loadingTable = true;
        this.InternalSequenceService.getAll(page, search).subscribe(
            (response: any) => {
                this.loadingTable = false;
                console.log('Response: ', response);
                this.internalSequenceData = response.data;
                this.countRegisters = response.total;
                this.spinner.hide();
            },
            (error) => {
                console.log('Error: ', error);
                this.spinner.hide();
            }
        );
    }

    openModal() {
        this.onCreate();
    }

    onCreate() {
        this.formCreateInternalSequence.reset();
        this.InternalSequenceService.getInternalSequence(0).subscribe(
             (response: any) => {
                 //this.hotel = response.hotel;
                 this.visibleModalInternalSequence = true;
             },
             (error) => {
                 console.log('Error: ', error);
             }
         );
    }
}
