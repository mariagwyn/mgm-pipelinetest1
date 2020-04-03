import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { readAsDataURL } from 'promise-file-reader';
import { ToastController } from '@ionic/angular';

import { CompiledLiturgy, CompiledSection, CompiledOption, LiturgyObject } from '../models/liturgy.model';

import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  constructor(
    private platform : Platform,
    private http : HttpClient,
    private fileOpener : FileOpener,
    private toast : ToastController
  ) { }

  postDocx(liturgy : CompiledLiturgy) : Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post<Blob>(`${API_URL}/plan/docx`, liturgy, {
      headers: headers, responseType: 'blob' as 'json'
    });
  }

  readAsBinaryString(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      // bugfix from https://github.com/ionic-team/ionic-native/issues/505#issuecomment-503316333
      let reader = new FileReader();

      // Get the original real FileReader. The polyfill saves a reference to it.
      const realFileReader = (reader as any)._realReader;

      // Make sure we were able to get the original FileReader
      if (realFileReader) {
          // Swap out the polyfill instance for the original instance.
          reader = realFileReader;
      }

      reader.onloadend = (event) => {
          resolve(reader.result as string);
      };
      reader.onerror = (event) => {
          reject(reader.error);
      };
      reader.readAsBinaryString(file);
    });
  }

  async download(blob : Blob, filename : string, filetype : string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    if(this.platform.is('capacitor')) {
      try {
          let binaryString = await this.readAsBinaryString(blob);
          let base64String = btoa(binaryString);

          console.log(FilesystemDirectory.Documents, filename)
          const writeFileResult = await Filesystem.writeFile({
            path: filename,
            data: base64String,
            directory: FilesystemDirectory.Documents
          });
          const uri = await Filesystem.getUri({
            path: filename,
            directory: FilesystemDirectory.Documents
          });

          this.fileOpener.open(uri.uri, filetype)
            .then(() => console.log('File is opened'))
            .catch(async e => {
              const toast = await this.toast.create({
                header: 'Trouble opening the Word document!',
                message: 'We exported your liturgy to a Word document, but had trouble opening it. Are you sure you have Microsoft Word installed?',
                position: 'bottom',
                duration: 10000
              });
              toast.present();
            });
      } catch (error) {
          console.error(error);
      }
    } else {
      const url = URL.createObjectURL(blob),
            a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
