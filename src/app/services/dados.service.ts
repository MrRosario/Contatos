import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Contato {
  id?: string,
  nome: string,
  email: string,
  telefone: string
}
@Injectable({
  providedIn: 'root'
})
export class DadosService {

  private contatos: Observable<Contato[]>;
  private contatosCollection: AngularFirestoreCollection<Contato>;

  constructor(private afs: AngularFirestore) {
    this.contatosCollection = this.afs.collection<Contato>('contatos');

    this.contatos = this.contatosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

  }

  getContatos(): Observable<Contato[]> {
    return this.contatos;
  }
 
  getContato(id: string): Observable<Contato> {
    return this.contatosCollection.doc<Contato>(id).valueChanges().pipe(
      take(1),
      map(idea => {
        idea.id = id;
        return idea
      })
    );
  }
 
  addContato(dados: Contato): Promise<DocumentReference> {
    return this.contatosCollection.add(dados);
  }
 
  updateContato(dados: Contato): Promise<void> {
    return this.contatosCollection.doc(dados.id).update(
      { 
        nome: dados.nome, 
        email: dados.email, 
        telefone: dados.telefone
      }
    );
  }
 
  deletarContato(id: string): Promise<void> {
    return this.contatosCollection.doc(id).delete();
  }

}
