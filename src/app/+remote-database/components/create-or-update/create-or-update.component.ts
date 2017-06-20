import {
  Component, EventEmitter, Input, Output,
  ViewEncapsulation, OnInit, OnDestroy
} from '@angular/core';

import {

  RemoteDatabasePost,
} from '../../remote-database.model';

import {
  FormControl,
  Validators
} from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { RemoteDatabaseService } from '../../remote-database.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs/Subject";

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'remote-database-create-or-update',  // <remote-database-create-or-update></remote-database-create-or-update>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'create-or-update.template.html',
  providers: [ValidationService]
})
export class RemoteDatabaseCreateOrUpdateComponent implements OnInit, OnDestroy {
  @Input() public isNew: boolean = false;

  public formErrors = {
    name: '',
    type: '',
    host: '',
  };

  public validationMessages = {
    name: {
      required: 'Name is required.',
      minlength: 'Name field is a at least 3 characters long and no greater than 255 characters',
      maxlength: 'Name field is a at least 3 characters long and no greater than 255 characters'
    },
  };

  public controlConfig = {
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    // type: new FormControl('', [Validators.required]),
    driver: new FormControl('', [Validators.required]),
    database: new FormControl('', [Validators.required]),
    user: new FormControl('', []),
    password: new FormControl('', []),
    host: new FormControl('', [Validators.required]),
    port: new FormControl('', []),
    ssl: new FormControl('', []),
    description: new FormControl('', [])
  };
  public frm: any;

  public active: boolean = false;

  public title: string = 'Create New Database Connection';

  public databaseType = [
    'Microsoft SQL Server',
    'MySQL',
    'Postgres SQL'
  ];

  public submitted: boolean = false;

  @Input()
  public modalInstance: any;

  private _remoteDatabaseModel: RemoteDatabasePost;

  @Input()
  public set model(remoteDatabase: any) {
    let self = this;

    self.title = self.isNew ? 'Create Remote Database Connection' :
      `Edit Connection: ${remoteDatabase.name}`;

    self._remoteDatabaseModel = remoteDatabase;
  }

  public get model() {
    return this._remoteDatabaseModel;
  }

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _validationService: ValidationService,
              private _remoteDatabaseService: RemoteDatabaseService,
              private _toast: ToastrService) {

  }

  public ngOnInit(): void {
    let self = this;
    // Build form
    self.frm = self._validationService.buildForm(self.controlConfig,
      self.formErrors, self.validationMessages);

    // Call reset form to bind model to form
    if (self.model) {
      // set default value for database field
      if (this.isNew) {
        self.model.driver = 'Microsoft SQL Server';
      }
      self.frm.reset(self.model);
    }
  }

  // Save function
  public onSave(value): void {
    this.submitted = true;

    if (this.model) {
      value._id = this.model._id;
    }
    let remoteDatabasePost = new RemoteDatabasePost(value);

    // If new then call api update else call api update
    if (this.isNew) {
      this._remoteDatabaseService.create(remoteDatabasePost)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this._toast.success('Create remote database connection successful.', 'Success');

          this.onCancel({success: true});
          this.submitted = false;

        }, (err) => {
          this._toast.error(err.errorMessage, 'Error');
          this.submitted = false;
        });
    } else {
      this._remoteDatabaseService.update(value)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this._toast.success('Update remote database connection successful.', 'Success');

          this.onCancel({success: true});
          this.submitted = false;

        }, (err) => {
          this._toast.error(err.errorMessage, 'Error');
          this.submitted = false;
        });
    }
  }

  // Cancel function
  public onCancel(e?: any): void {
    this.modalInstance.close(e);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
