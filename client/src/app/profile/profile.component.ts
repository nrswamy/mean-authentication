import { Component, OnInit } from "@angular/core";
import { AuthenticationService, UserDetails } from "../services/authentication.service";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  details: UserDetails;
  token = "";

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user;
      },
      err => {
        console.error(err);
      }
    );
  }

  getToken() {
    console.log("calling get token")
    this.token = this.auth.getToken();
    console.log(this.token)
    console.log("-----")

  }

}
