public with sharing class AccountRelatedDataController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        try {
            return [SELECT Id, Name FROM Account];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static RelatedWrapper getRelatedRecords(Id accountId){
        try {
            Account acct = [
                SELECT Id, (SELECT Id, CaseNumber, Subject, Status FROM Cases WHERE Status != 'Closed'),
                (SELECT Id, FirstName, LastName, Email, Phone FROM Contacts)
                FROM Account
                WHERE Id =: accountId
            ];
            
            RelatedWrapper wrapperList = new RelatedWrapper();
            wrapperList.caseList = acct.Cases;
            wrapperList.contactList = acct.Contacts;

            return wrapperList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class RelatedWrapper{
        @AuraEnabled
        public List<Case> caseList;
        @AuraEnabled
        public List<Contact> contactList;
    }


}
