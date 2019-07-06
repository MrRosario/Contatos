import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DadosService, Contato } from '../services/dados.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-salvar',
  templateUrl: './salvar.component.html',
  styleUrls: ['./salvar.component.scss'],
})
export class SalvarComponent implements OnInit {

  contato: Contato = {
    nome: '',
    email: '',
    telefone: ''
  };
  @Input() Id: string;

  private ideas: Observable<Contato[]>;

  constructor(
    public modalController: ModalController, 
    private ddServ: DadosService,
    private toastCtrl: ToastController) {
      
    }

  ngOnInit() {
    if(this.Id){
      this.ddServ.getContato(this.Id).subscribe( (res:any) => {
        console.log(res);
        this.contato.nome = res.nome;
        this.contato.email = res.email;
        this.contato.telefone = res.telefone;
      });
    }
  }

  fecharMOdal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  salvarContato(){
    if(this.Id){
      let dados = {
        id: this.Id,
        nome: this.contato.nome,
        email: this.contato.email,
        telefone: this.contato.telefone
      }
      this.ddServ.updateContato(dados).then(()=>{
        this.fecharMOdal();
        this.showToast('Contato Editado');
      }, err => {
        this.showToast('Erro ao Editar o contato :(');
      });
    }
    else{
      this.ddServ.addContato(this.contato).then(() => {
        this.fecharMOdal();
        this.showToast('Contato adicionado');
      }, err => {
        this.showToast('Erro ao adicionar o contato :(');
      });
    }
  }


}
