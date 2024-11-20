import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfilPageComponent } from './edit-profil-page.component';

describe('EditProfilPageComponent', () => {
  let component: EditProfilPageComponent;
  let fixture: ComponentFixture<EditProfilPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfilPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfilPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
