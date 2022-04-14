import { Injectable } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {

  constructor(private NbToastrService: NbToastrService) { }
  
  status: NbComponentStatus = 'danger';

   showToast(type:NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,

    };
    const titleContent = title ? `${title}` : '';

    this.NbToastrService.show(
      body,
      `${titleContent}`,
      config);


  }
}
