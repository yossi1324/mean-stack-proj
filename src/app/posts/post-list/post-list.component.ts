import { Component, Input } from "@angular/core";
import {Post} from '../post.model';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent {
  // posts = [
  //   { title: "First Post", content: "This is the first posts content" },
  //   { title: "second Post", content: "This is the second posts content" },
  //   { title: "third Post", content: "This is the third posts content" }
  // ];
  @Input()
  posts: Post[] = [];
}
