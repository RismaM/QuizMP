import { ShowMapModalComponent } from '../../../show-map-modal/show-map-modal.component';
import { Component, OnInit } from '@angular/core';
import { StorageManagementService } from '../../../services/storage-management.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  data: any[] = [];
  constructor(
    private storageManagementService: StorageManagementService,
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.getAllData();

    console.log(this.data);
  }

  async getAllData() {
    const data = await this.storageManagementService.getAllData();
    console.log(data);
    this.data = data;
  }

  showMap(data: any) {
    this.modalController.create({
      component: ShowMapModalComponent,
      componentProps: {
        data
      }
    }).then(modal => modal.present());
  }

}
