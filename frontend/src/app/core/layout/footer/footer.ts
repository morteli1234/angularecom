import { Component } from '@angular/core';
import { siInstagram, siX, siYoutube, siFacebook } from 'simple-icons/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
})
export class FooterComponent {
  protected readonly paymentIcons = [
    { name: 'Visa', src: '/images/visa.png' },
    { name: 'Mastercard', src: '/images/mastercard.png' },
    { name: 'Google Pay', src: '/images/googlepay.png' },
    { name: 'PayPal', src: '/images/paypal.jpg' },
    { name: 'Apple Pay', src: '/images/applepay.png' },
    { name: 'Stripe', src: '/images/stripe.png' },
  ];

  protected readonly socials = [
    { name: 'Facebook', href: 'https://facebook.com', icon: siFacebook },
    { name: 'X', href: 'https://x.com', icon: siX },
    { name: 'YouTube', href: 'https://youtube.com', icon: siYoutube },
    { name: 'Instagram', href: 'https://instagram.com', icon: siInstagram },
  ];
}
