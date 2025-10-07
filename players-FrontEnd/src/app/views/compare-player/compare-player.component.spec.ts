import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparePlayerComponent } from './compare-player.component';

describe('ComparePlayerComponent', () => {
  let component: ComparePlayerComponent;
  let fixture: ComponentFixture<ComparePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComparePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
