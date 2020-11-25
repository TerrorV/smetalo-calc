import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select'
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list'
import {MatSliderModule} from '@angular/material/slider';
import {MatChipsModule} from '@angular/material/chips'
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
    imports:[MatButtonModule, 
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,    
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatSidenavModule,
        MatSelectModule,
        MatCardModule,
        MatListModule,
        MatSliderModule,
    MatChipsModule,
    MatAutocompleteModule],
        exports:[MatButtonModule,
            MatCheckboxModule,
            MatInputModule,
            MatFormFieldModule,    
            MatToolbarModule,
            MatMenuModule,
            MatIconModule,
            MatSidenavModule,
            MatSelectModule,
            MatCardModule,
            MatListModule,
            MatSliderModule,
            MatChipsModule,
            MatAutocompleteModule]
        })
        export class MaterialModule{}