import { HttpHeaders } from "@angular/common/http";

export const environment = {
    production: false,
    apiUrl: 'http://localhost:4343/api/v1/',
    apiHome: 'http://localhost:4343',
    httpOptions: {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        })
      }
};
