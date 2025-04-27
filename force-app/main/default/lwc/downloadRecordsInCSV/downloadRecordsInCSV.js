import { LightningElement } from 'lwc';
import getObjectInfo from '@salesforce/apex/fetchObjectRecords.getObjectInfo';
import getFieldInfo from '@salesforce/apex/fetchObjectRecords.getFieldInfo';

export default class DownloadRecordsInCSV extends LightningElement {
    searchKey = '';
    objectOptions = [];
    showDropdown = false;
    selectedApiName = '';
    fieldList = [];

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
        console.log('Object Api Name after select:', this.selectedApiName);


        this.showDropdown = false; 
        this.fetchFieldsForSelectedObject();
    }

    fetchFieldsForSelectedObject(){
        getFieldInfo({objectApiName : this.selectedApiName})
        .then(result => {
            this.fieldList = result;
            console.log('Fields:', result);
            console.log('Fields:', typeof(this.fieldList));
        })
        .catch(error => {
            console.error('Error fetching fields', error);
        })
    }
}