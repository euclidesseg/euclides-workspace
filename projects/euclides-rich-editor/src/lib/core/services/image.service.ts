import { Injectable, input } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ImageSelectorService{
    openImageSelector(callback:(file:File) => void){
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = () =>{
            const file = input.files?.[0];
            if(file){
                callback(file)
            }
        }
        input.click();
    }
}