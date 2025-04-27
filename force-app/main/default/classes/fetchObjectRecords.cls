public with sharing class fetchObjectRecords {
    @AuraEnabled(cacheable=true)
    public static List<ObjectInfo> getObjectInfo(String searchKey) {
      List<ObjectInfo> matchingObjects = new List<ObjectInfo>();
  
      Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
  
      // for (Schema.SObjectType objType : gd.values()) {
      //   Schema.DescribeSObjectResult describeResult = objType.getDescribe();
      //   String label = describeResult.getLabel();
  
      //   if (
      //     label != null && label.toLowerCase().contains(searchKey.toLowerCase())
      //   ) {
      //     matchingObjects.add(new ObjectInfo(label, describeResult.getName()));
      //   }
      // }
      for (Schema.SObjectType sObjType : gd.values()) {
        Schema.DescribeSObjectResult describeResult = sObjType.getDescribe();

        // Check if user has READ access
        if (describeResult.isAccessible()) {

            String label = describeResult.getLabel();

            if (label != null && label.toLowerCase().contains(searchKey.toLowerCase())) {
              matchingObjects.add(new ObjectInfo(label, describeResult.getName()));
            }
        }
      }
      return matchingObjects;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<objectfieldInfo> getFieldInfo(String objectApiName){
      List<objectfieldInfo> fieldInfo = new List<objectfieldInfo>();

      if(Schema.getGlobalDescribe().containsKey(objectApiName)){
        Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
        Map<String, Schema.SObjectField> fields = describeResult.fields.getMap();

        for(Schema.SObjectField field  : fields.values()){
          Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
          if(fieldDescribe.isAccessible()){
            fieldInfo.add(new objectfieldInfo(fieldDescribe.getLabel(), fieldDescribe.getName()));
          }
        }
      }
      return fieldInfo;
    }

    public class objectfieldInfo{
        @AuraEnabled public String fieldLabel {get; set;}
        @AuraEnabled public String fieldApiName {get; set;}

        public objectfieldInfo(String fieldLabel, string fieldApiName){
          this.fieldLabel = fieldLabel;
          this.fieldApiName = fieldApiName;
        }
    }
  
    public class ObjectInfo {
      @AuraEnabled public String label { get; set; }
      @AuraEnabled public String apiName { get; set; }
  
      public ObjectInfo(String label, String apiName) {
        this.label = label;
        this.apiName = apiName;
      }
    }
  }