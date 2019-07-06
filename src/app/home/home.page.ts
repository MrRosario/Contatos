import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, ToastController } from '@ionic/angular';
import { SalvarComponent } from '../salvar/salvar.component';
import { DadosService, Contato } from '../services/dados.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public dados: Observable<Contato[]>;

  constructor(
    public modalController: ModalController,
    private ddServ: DadosService,
    private toastCtrl: ToastController,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.ddServ.getContatos().subscribe( (res:any) => {
      console.log(res);
      this.dados = res;
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SalvarComponent
    });
    return await modal.present();
  }
  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
  async ModalEditar(id) {
    const modal = await this.modalController.create({
      component: SalvarComponent,
      componentProps: {
        'Id': id,
      }
    });
    return await modal.present();
  }
  async presentActionSheet(id) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.ModalEditar(id)
          }
        }, 
        {
          text: 'Excluir',
          role: 'destructive',
          cssClass: 'danger',
          icon: 'trash',
          handler: () => {
            this.ddServ.deletarContato(id).then(()=>{
              this.showToast('Contato Excluido');
            }, err => {
              this.showToast('Erro ao Excluir o contato :(');
            });
          }
        }, 
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }

}
