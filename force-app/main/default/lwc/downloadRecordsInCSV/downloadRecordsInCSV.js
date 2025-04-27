import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getObjectInfo from '@salesforce/apex/fetchObjectRecords.getObjectInfo';
import getFieldInfo from '@salesforce/apex/fetchObjectRecords.getFieldInfo';

export default class DownloadRecordsInCSV extends LightningElement {
    searchKey = '';
    objectOptions = [];
    showDropdown = false;
    selectedApiName = '';
    fieldList = [];
    // selectedFieldLabelNames = [];
    // selectedFieldApiNames = [];

    selectedFields = [];

    handleChange(event){
        this.searchKey = event.target.value;
        if(this.searchKey === ''){
            this.fieldList = [];
        }

        if(this.searchKey.length > 1){
            getObjectInfo({searchKey : this.searchKey})
            .then(result => {
                console.log('Result found of Object Name : ', result);
                this.objectOptions = result;
                this.showDropdown = result.length > 0;
                setTimeout(() =>{
                    if(result.length == 0){
                        this.showToast('Error', 'Please Enter the Correct Object Name', 'error');
                    }
                }, 1000);
                
            })
            .catch(error => { 
                console.log('Unable to found the Object Name : ', error);
                this.showToast('Error', 'Unable to find the object', 'error');
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

    handleFieldSelection(event){
        const apiName = event.target.dataset.apiName;
        console.log('Field api Name' , event.target.dataset.apiName);
        if(event.target.checked){
            if (!this.selectedFields.includes(apiName)) {
                this.selectedFields = [...this.selectedFields, apiName];
            }
        }else {
            this.selectedFields = this.selectedFields.filter(item => item !== apiName);
        }

        console.log('Selected Fields:', this.selectedFields);
    }


    
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant : variant
        });
        this.dispatchEvent(event);
    }
}