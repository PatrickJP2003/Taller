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
    try {
      const userCredential: UserCredential = await this.usersService.login(loginInfo);
      const uid = userCredential?.user?.uid;

      if (!uid) {
        throw new Error('UID no disponible');
      }

      const querySnapshot = await this.getRegister(uid);
      querySnapshot.forEach((doc) => {
        this.currentRegister = doc.data() as Register;
      });
      return this.currentRegister;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async loginWithGoogle() : Promise<any> {
    try {
      const userCredential: UserCredential = await this.usersService.loginWithGoogle();
      const uid = userCredential?.user?.uid;

      if (!uid) {
        throw new Error('UID no disponible');
      }

      const querySnapshot = await this.getRegister(uid);
      querySnapshot.forEach((doc) => {
        this.currentRegister = doc.data() as Register;
      });
      return this.currentRegister;
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  }

  getRegisters(): Observable<Register[]> {
    const registersRef = collection(this.firestore, 'registers');
    return collectionData(registersRef, { idField: 'uid' });
  }

  getRegister(uid: string) {
    const registersRef = collection(this.firestore, 'registers');
    const q = query(registersRef, where('uid', '==', uid));
    return getDocs(q);
  }

  async createRegister(loginInfo: LoginInfo, { email, nickname, photoURL, phoneNumber, role }: Register) : Promise<any> {
    try {
      const userCredential: UserCredential = await this.usersService.register(loginInfo);
      const uid = userCredential?.user?.uid;

      if (!uid) {
        throw new Error('UID no disponible');
      }

      this.currentRegister = { email, uid, nickname, photoURL, phoneNumber, role };
      const registersRef = collection(this.firestore, 'registers');
      return await addDoc(registersRef, { uid, email, nickname, photoURL, phoneNumber, role });
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error al crear el registro:', (error as { message: string }).message);
      } else {
        console.error('Error al crear el registro:', error);
      }
      throw error;
    }
  }

  async createRegisterWithGoogle() : Promise<any> {
    try {
      const userCredential: UserCredential = await this.usersService.loginWithGoogle();
      const uid = userCredential?.user?.uid;
      const email = userCredential?.user?.email ?? '';
      const nickname = userCredential?.user?.displayName ?? '';
      const photoURL = userCredential?.user?.photoURL ?? '';
      const phoneNumber = userCredential?.user?.phoneNumber ?? '';
      const role = 'Empleado';

      if (!uid) {
        throw new Error('UID no disponible');
      }

      this.currentRegister = { email, uid, nickname, photoURL, phoneNumber, role };
      const registersRef = collection(this.firestore, 'registers');
      return await addDoc(registersRef, { uid, email, nickname, photoURL, phoneNumber, role });
    } catch (error) {
      console.error('Error al crear el registro con Google:', error);
      throw error;
    }
  }

  updateRegister({ uid, nickname, photoURL, phoneNumber, role }: Register) : Promise<any> {
    const docRef = doc(this.firestore, `registers/${uid}`);
    return updateDoc(docRef, { uid, nickname, photoURL, phoneNumber, role });
  }

  async deleteRegister(register: Register) : Promise<any> {
    try {
      await this.usersService.deleteRegister(register.uid);
      const docRef = doc(this.firestore, `registers/${register.uid}`);
      return await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }
}
