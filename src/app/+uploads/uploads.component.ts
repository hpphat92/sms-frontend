import {
  Component, OnDestroy, OnInit,
  ViewEncapsulation
} from '@angular/core';

import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from './uploads.service';
import { AppConstant } from '../app.constant';

import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  FormControl,
  Validators
} from '@angular/forms';
import { ValidationService } from '../shared/services/validation/validation.service';
import { UserContext } from "../shared/services/user-context/user-context";

@Component({
  selector: 'uploads',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'uploads.template.html',
  styleUrls: [
    'uploads.style.scss'
  ],
  providers: [ValidationService]
})
export class UploadsComponent implements OnDestroy, OnInit {

  public uploader: FileUploader = new FileUploader({});

  public fileName: string = '';

  public isWaiting: boolean = false;

  public options = {
    accept: '.csv, .txt, .xls, .xlsx',
  };

  public subscriberLists = [];

  public formErrors = {
    list_id: '',
  };

  public validationMessages = {
    list_id: {
      required: 'Subscriber list is required.',
    }
  };

  public controlConfig = {
    list_id: new FormControl('', [
      Validators.required
    ])
  };

  public frm: any;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _toast: ToastrService,
              private _uploadService: UploadService,
              private _validationService: ValidationService,
              private _userContext: UserContext) {

  }

  public ngOnInit(): void {
    this.frm = this._validationService.buildForm(this.controlConfig, this.formErrors, this.validationMessages);

    this._uploadService.getSubscriberLists()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        this.subscriberLists = data;
      });
  }

  public onChange(event): void {
    let size = this.uploader.queue[0].file.size / Math.pow(1024, 3);

    if (size < 3) {
      this.fileName = event.target.value;

    } else {
      this._toast.error('File size must be under 3GB', 'Error');
    }
  }

  public upload(value) {
    if (this.uploader.queue && this.uploader.queue.length && value.list_id) {
      this.isWaiting = true;
      let accountId = this._userContext.currentUser.account_id || AppConstant.accountId;

      this._uploadService.import(value.list_id)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {
          this.uploader.setOptions({
            method: 'POST',
            authToken: 'Bearer ' + localStorage.getItem('id_token'),
            removeAfterUpload: true,
            url: `http://import-server-env.vcpvqvsxky.us-east-1.elasticbeanstalk.com/account/${accountId}/import/${data._id}`
          });

          this.uploader.onCompleteItem = (item, response, status, headers) => {
            this.isWaiting = false;
            let resp = JSON.parse(response);
            if (resp.success && item) {
              this._toast.success(`<div class="text-center">File uploaded successfully:
                             <div class="m-10">${item._file.name}</div> 
                             Check Dashboard for import status.</div>`,
                '', {enableHtml: true});
            }
            this.uploader.clearQueue();
          };

          this.uploader.onErrorItem = (item, response, status, header) => {

            this.isWaiting = false;

            this._toast.error(response, 'Error');

            this.uploader.clearQueue();
          };

          this.uploader.queue[0].upload();
        });
    }
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
