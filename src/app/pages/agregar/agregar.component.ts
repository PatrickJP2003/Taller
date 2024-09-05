import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  productForm!: FormGroup;
  imageUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, Validators.required],
      id: ['', Validators.required],
      imagen: [null]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitProduct(): void {
    if (this.productForm.valid && this.selectedFile) {
      const productData = this.productForm.value;
      const filePath = `productos/${productData.nombre}_${Date.now()}`;
      const fileRef = ref(this.storage, filePath);

      uploadBytes(fileRef, this.selectedFile).then(() => {
        getDownloadURL(fileRef).then((url) => {
          productData.imagen = url;
          const productosRef = collection(this.firestore, 'productos');
          addDoc(productosRef, productData)
            .then(() => {
              console.log('Producto agregado con éxito');
              this.productForm.reset();
              this.imageUrl = null;
            })
            .catch(error => console.error('Error al agregar el producto: ', error));
        });
      });
    } else {
      console.log('El formulario no es válido o no hay imagen seleccionada');
    }
  }
}
