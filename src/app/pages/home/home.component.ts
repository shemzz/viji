import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FAQData } from 'src/app/helpers/faq.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, NgbAccordionModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  panels: any = FAQData;




playVideo() {
console.log('play video clicked')
}

}
