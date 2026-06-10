import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = environment.apiUrl + '/api/users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(this.api);
  }

  getUserById(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  search(name: string) {
    return this.http.get(`${this.api}/search?name=${name}`);
  }
}
