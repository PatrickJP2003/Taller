import { Injectable } from '@angular/core';
import { 
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc, 
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsersService, LoginInfo } from '../users/users.service';
import { UserCredential } from '@angular/fire/auth';

export interface Register {
  uid: string;
  email: string;
  nickname: string;
  photoURL: string;
  phoneNumber: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistersService {
  currentRegister?: Register;

  constructor(private firestore: Firestore, private usersService: UsersService) { }

  async login(loginInfo: LoginInfo) : Promise<any> {
    let userCredential : UserCredential = await this.usersService.login(loginInfo)
      .then((response) => {
        return response;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
    const uid = userCredential.user.uid;
    this.getRegister(uid).then(query => {
      query.forEach(element => this.currentRegister = element.data() as Register);      
    });
    return this.currentRegister;
  }

  async loginWithGoogle() : Promise<any> {
    let userCredential : UserCredential = await this.usersService.loginWithGoogle()
      .then((response) => {
        return response;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
    const uid = userCredential.user.uid;
    this.getRegister(uid).then(query => {
      query.forEach(element => this.currentRegister = element.data() as Register);      
    });
    
    return this.currentRegister;
  }

  getRegisters(): Observable<Register[]> {
    const registersRef = collection(this.firestore, 'registers');
    return collectionData(registersRef, {idField: 'uid'});
  }

  getRegister(uid: string) {
    const registersRef = collection(this.firestore, 'registers');
    const q = query(registersRef, where('uid', '==', uid));
    return getDocs(q);
  }

  async createRegister(loginInfo: LoginInfo, {email, nickname, photoURL, phoneNumber, role}: Register) : Promise<any> {
    let userCredential : UserCredential = await this.usersService.register(loginInfo)
      .then((response) => {
        return response;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
    const uid = userCredential.user.uid;
    this.currentRegister = {email, uid, nickname, photoURL, phoneNumber, role};
    const registersRef = collection(this.firestore, 'registers');
    return addDoc(registersRef, {uid, email, nickname, photoURL, phoneNumber, role});
  }

  async createRegisterWithGoogle() : Promise<any> {
    let userCredential : UserCredential = await this.usersService.loginWithGoogle()
      .then((response) => {
        return response;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
    const uid = userCredential.user.uid;
    const email = userCredential.user.email!;
    const nickname = userCredential.user.displayName!;
    const photoURL = userCredential.user.photoURL!;
    const phoneNumber = userCredential.user.phoneNumber!;
    const role = 'Empleado';
    this.currentRegister = {email, uid, nickname, photoURL, phoneNumber, role};
    const registersRef = collection(this.firestore, 'registers');
    return addDoc(registersRef, {uid, email, nickname, photoURL, phoneNumber, role});    
  }

  updateRegister({uid, nickname, photoURL, phoneNumber, role}: Register) : Promise<any> {
    const docRef = doc(this.firestore, `registers/${uid}`);
    return updateDoc(docRef, {uid, nickname, photoURL, phoneNumber, role});
  }

  async deleteRegister(register: Register) : Promise<any> {
    await this.usersService.deleteRegister(register.uid);
    const docRef = doc(this.firestore, `registers/${register.uid}`);
    return deleteDoc(docRef);
  }
}
