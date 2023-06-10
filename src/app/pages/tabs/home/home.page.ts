import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { StorageManagementService } from 'src/app/services/storage-management.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage  {
  form: any = {};

  constructor(
    private geolocationService: GeoLocationService,
    private toastController: ToastController,
    private storageManagementService: StorageManagementService
  ) { }

  inputCheck() {
    if (
      !this.form.nama || !this.form.nik || !this.form.tempat_lahir ||
      !this.form.tanggal_lahir || !this.form.jenis_kelamin || !this.form.alamat ||
      !this.form.agama || !this.form.status_perkawinan || !this.form.pekerjaan ||
      !this.form.kewarganegaraan || !this.form.berlaku_hingga
    ) {
      this.toastController.create({
        message: 'Mohon lengkapi data',
        duration: 2000,
        color: 'danger'
      }).then(toast => toast.present());

      return false;
    }
    return true;
  }

  async sendToWhatsapp() {
    const isValid = this.inputCheck();
    if (!isValid) return;

    const location = await this.getLocation();
    this.form.lokasi = location.display_name;
    this.form.location = location;
    this.form.type = 'whatsapp';

    const form = Object.keys(this.form);
    const output = form.map((key) => {
      if (key === 'location') return;
      return `*${key.toUpperCase()}*: ${this.form[key]}`;
    }).join('%0A');

    window.open(`https://api.whatsapp.com/send?phone=6285172469936&text=${output}`, '_blank');

    // save data to storage
    this.storageManagementService.addData(this.form);
  }

  async sendToTelegram() {
    const isValid = this.inputCheck();
    if (!isValid) return;

    const location = await this.getLocation();
    this.form.lokasi = location.display_name;
    this.form.type = 'telegram';


    const form = Object.keys(this.form);
    const output = form.map((key) => {
      return `*${key.toUpperCase()}*: ${this.form[key]}`;
    }).join('%0A');


    window.open(`https://t.me/RismaMarina?start=${output}`, '_blank');
  }

  async sendToEmail() {
    const isValid = this.inputCheck();
    if (!isValid) return;

    const location = await this.getLocation();
    this.form.lokasi = location.display_name;
    this.form.location = location;
    this.form.type = 'email';

    const form = Object.keys(this.form);
    const output = form.map((key) => {
      // bold text on mailto: body
      if (key === 'location') return;
      return `${key.toUpperCase()}: ${this.form[key]}`;
    }).join('%0A');

    const url = `mailto:rismalorenzo99@gmail.com?subject=Data&20Informasi&body=${output}`;

    window.open(url, '_blank');

    // save data to storage
    this.storageManagementService.addData(this.form);
  }

  async getLocation() {
    const positition = await this.geolocationService.getLocation();
    const { latitude, longitude, accuracy } = positition.coords;

    // get address
    const getAddress = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const address = await getAddress.json();

    return address;
  }
}
