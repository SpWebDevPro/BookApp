import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  alertMessage1:string;
  alertMessage2:string;
  alertMessage3:string;
  alertMessage4:string;

  constructor(
    protected dialogRef:NbDialogRef<any>
  ) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }

}
