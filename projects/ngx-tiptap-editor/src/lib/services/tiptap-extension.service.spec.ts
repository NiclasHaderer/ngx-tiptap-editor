import { TestBed } from '@angular/core/testing';

import { TiptapExtensionService } from './tiptap-extension.service';

describe('TiptapExtensionService', () => {
  let service: TiptapExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiptapExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
