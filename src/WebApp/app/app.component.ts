import {Component} from '@angular/core';
import {MdCard} from '@angular2-material/card'

@Component({
    selector: 'my-app',
    template: `
<md-card>
    <md-card-title>My First Angular 2 Material App</md-card-title>
    <md-content>This is a Card</md-content>   
</md-card>
    `,
    directives: [MdCard]
})
export class AppComponent { }