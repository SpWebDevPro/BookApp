import { NgModule } from '@angular/core';
import { NbLayoutModule, NbCardModule, NbThemeModule, NbActionsModule, 
            NbButtonModule, NbToggleModule, NbIconModule, NbUserModule, 
            NbCalendarModule, 
            NbSelectModule,
            NbInputModule} from '@nebular/theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        NbLayoutModule,
        NbCardModule,
        NbActionsModule,
        NbButtonModule,
        NbToggleModule,
        NbUserModule,
        NbCalendarModule,
        NbSelectModule,
        NbInputModule,
        BrowserAnimationsModule,
        NbEvaIconsModule,
        NbIconModule,
        FlexLayoutModule,
        NbThemeModule.forRoot({ name: 'default' })
    ],
    exports: [
        NbLayoutModule,
        NbCardModule,
        NbActionsModule,
        NbButtonModule,
        NbToggleModule,
        NbUserModule,
        NbCalendarModule,
        NbSelectModule,
        NbInputModule,
        BrowserAnimationsModule,
        NbEvaIconsModule,
        NbIconModule,
        FlexLayoutModule
    ]
})
export class AppNebularModule {}