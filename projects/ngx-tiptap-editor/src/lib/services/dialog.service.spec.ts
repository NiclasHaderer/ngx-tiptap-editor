import { TestBed } from '@angular/core/testing';

import { TipDialogService } from './dialog.service';

describe('DialogService', () => {
  let service: TipDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
