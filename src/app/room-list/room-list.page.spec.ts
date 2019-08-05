import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomListPage } from './room-list.page';

describe('RoomListPage', () => {
  let component: RoomListPage;
  let fixture: ComponentFixture<RoomListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
