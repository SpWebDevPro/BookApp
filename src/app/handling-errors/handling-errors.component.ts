import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-handling-errors',
  templateUrl: './handling-errors.component.html',
  styleUrls: ['./handling-errors.component.scss']
})
export class HandlingErrorsComponent implements OnInit {

  errorMessageAuth:string;
  successMessageAuth:string;

  constructor(
    protected dialogRef:NbDialogRef<any>,
  ) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }


}
