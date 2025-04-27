import { LightningElement } from 'lwc';
import getObjectInfo from '@salesforce/apex/fetchObjectRecords.getObjectInfo';

export default class DownloadRecordsInCSV extends LightningElement {
    searchKey = '';
    objectOptions = [];
    showDropdown = false;
    selectedApiName = '';

    handleChange(event){
        this.searchKey = event.target.value;

        if(this.searchKey.length > 1){
            getObjectInfo({searchKey : this.searchKey})
            .then(result => {
                console.log('Result found of Object Name : ', result);
                this.objectOptions = result;
                this.showDropdown = result.length > 0;
            })
            .catch(error => { 
                console.log('Unable to found the Object Name : ', error);
            })
        }
        else{
            this.objectOptions = [];
            this.showDropdown = false;
        }
    }


    

    handleSelect(event) {
        this.selectedApiName = event.currentTarget.dataset.id;

        const selectedObject = this.objectOptions.find(obj => obj.apiName === this.selectedApiName);

        if (selectedObject) {
            this.searchKey = selectedObject.label; 
        }
        console.log('Object Api Name after select 3 :', this.selectedApiName);


        this.showDropdown = false; 
    }
}