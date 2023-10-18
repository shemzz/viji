import { HttpHeaders } from "@angular/common/http";

export const environment = {
    production: false,
    apiUrl: 'https://viji.onrender.com/api/v1/',
    apiHome: 'https://viji.onrender.com',
    httpOptions: {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        })
      }
};
