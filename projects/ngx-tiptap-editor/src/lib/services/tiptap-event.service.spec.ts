import { TestBed } from '@angular/core/testing';

import { TiptapEventService } from './tiptap-event.service';

describe('TiptapEventService', () => {
  let service: TiptapEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiptapEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
