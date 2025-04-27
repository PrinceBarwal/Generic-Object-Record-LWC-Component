public class fetchObjectRecords {
    @AuraEnabled(cacheable=true)
    public static List<ObjectInfo> getObjectInfo(String searchKey) {
      List<ObjectInfo> matchingObjects = new List<ObjectInfo>();
  
      Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
  
      for (Schema.SObjectType objType : gd.values()) {
        Schema.DescribeSObjectResult describeResult = objType.getDescribe();
        String label = describeResult.getLabel();
  
        if (
          label != null && label.toLowerCase().contains(searchKey.toLowerCase())
        ) {
          matchingObjects.add(new ObjectInfo(label, describeResult.getName()));
        }
      }
      return matchingObjects;
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