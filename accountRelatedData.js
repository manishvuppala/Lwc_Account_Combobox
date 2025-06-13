import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountRelatedDataController.getAccounts';
import getRelatedRecords from '@salesforce/apex/AccountRelatedDataController.getRelatedRecords';

export default class AccountRelatedData extends LightningElement {
    accountList = [];
    error;
    caseList = [];
    contactList = [];

    caseColumns = [
        {label: 'Case Number', fieldName: 'CaseNumber'},
        {label: 'Subject', fieldName: 'Subject'},
        {label: 'Status', fieldName: 'Status'}
    ];

    contactColumns = [
        {label: 'First Name', fieldName: 'FirstName'},
        {label: 'Last Name', fieldName: 'LastName'},
        {label: 'Email', fieldName: 'Email', type: 'email'},
        {label: 'Phone', fieldName: 'Phone', type: 'phone'}
    ];

    @wire(getAccounts)
    getLwcAccounts({data, error}){
        if(data){
            this.accountList = data.map((acct) => ({ //for combobox use label and value.
                label: acct.Name,
                value: acct.Id
            }));
        }
        else if (error){
            this.error = error;
            this.accountList = undefined;
            console.log('Error', error);
        }
    }

    // Imperative apex - async and await
    async handleAccountChange(event){
        let accountId = event.target.value; // gets the value from the record that is changed from HTML

        try{
            let wrapper = await getRelatedRecords({accountId: accountId});
            this.caseList = wrapper.caseList;
            this.contactList = wrapper.contactList;
        } catch (error){
            console.log('Error', error);
        }
    }

}
