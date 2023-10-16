import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerViewTransactionComponent } from './seller-view-transaction.component';

describe('SellerViewTransactionComponent', () => {
  let component: SellerViewTransactionComponent;
  let fixture: ComponentFixture<SellerViewTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SellerViewTransactionComponent]
    });
    fixture = TestBed.createComponent(SellerViewTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
