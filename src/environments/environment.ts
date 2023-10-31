import { HttpHeaders } from "@angular/common/http";

export const environment = {
    production: true,
    apiUrl: 'https://api.vijipay.ng/api/v1/',
  apiHome: 'https://api.vijipay.ng/',
    url: 'vijipay.ng',
    httpOptions: {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
};
