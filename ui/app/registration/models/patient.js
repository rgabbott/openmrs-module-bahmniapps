'use strict';

angular.module('bahmni.registration')
    .factory('patient', ['age', 'identifiers','$http','$rootScope', function (age, identifiers,
        $http,$rootScope) {
        var monthInYear= null;
        var dateInYear= null;
        var year= null;
        var birthdatevalue = "";;
        var dateUtil = Bahmni.Common.Util.DateUtil;
 
        var create = function () {
            var calculateAge = function () {

                if (this.birthdate) {
                   
                    var d = new Date(this.birthdate),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            
                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;
                    this.age = age.fromBirthDate(this.birthdate);
                    if( this.age.days >= 0){
                        this.gmtDate(day,month,year);
                    }
                } else {
                    this.age = age.create(null, null, null);
                } 
               
            };
            var calculateAgeNew = function () {

                if (this.birthdate) {
                   
                    var d = new Date(this.birthdate),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            
                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;
                   this.gmtDate(day,month,year);

                } else {
                    this.age = age.create(null, null, null);
                } 
               
            };
        
            var calculateBirthDate = function () {
                this.birthdate = age.calculateBirthDate(this.age);
               this.calculateAgeNew();
            };
  
                var fullNameLocal = function () {
                var givenNameLocal = this.givenNameLocal || this.givenName || "";
                var middleNameLocal = this.middleNameLocal || this.middleName || "";
                var familyNameLocal = this.familyNameLocal || this.familyName || "";
                return (givenNameLocal.trim() + " " + (middleNameLocal ? middleNameLocal + " " : "") + familyNameLocal.trim()).trim();
            };

            var getImageData = function () {
                return this.image && this.image.indexOf('data') === 0 ? this.image.replace("data:image/jpeg;base64,", "") : null;
            };

            var identifierDetails = identifiers.create();

            var ethiopianDateConversion = function (date,month,year) {
                      return $http.get(Bahmni.Common.Constants.bahmniRESTBaseURL + "/ethdatetogmt/"+date+"/"+month+"/"+year+"");
            };
           
            var ethDate = function (day,month,year) {
                this.dob = age.ethDate(day,month,year);
            };
            var localDateConversion = function (date,month,year) {
                return $http.get(Bahmni.Common.Constants.bahmniRESTBaseURL + "/gmttoethiopian/"+date+"/"+month+"/"+year+"");
            };

            var calculateAge1 = function () {
           
                if (this.dob) {
                    const input = this.dob;
                    const [mm, dd, yyyy] = input.split('-');
                    this.ethDate(dd,mm,yyyy)
                } else {
                    this.age = age.create(null, null, null);
                } 
               
            };
            var ethDate = function(day,month,year){
                var dob = null;
                this.ethiopianDateConversion(month,day,year).then(function (response) {
                   
                    var monthInYear = null;
                     var month = response.data.date;
                        if(month === 'January'){
                            monthInYear = '01'; 
                        }else if(month === 'February'){
                            monthInYear = '02' 
                        }else if(month === 'March'){
                            monthInYear = '03' 
                        }else if(month === 'April'){
                            monthInYear = '04' 
                        }else if(month === 'May'){
                            monthInYear = '05' 
                        }else if(month === 'June'){
                            monthInYear = '06' 
                        }else if(month === 'July'){
                             monthInYear = '07' 
                        }else if(month === 'August'){
                           monthInYear = '08' 
                        }else if(month === 'September'){
                            monthInYear = '09' 
                        }else if(month === 'October'){
                            monthInYear = '10' 
                        }else if(month === 'November'){
                            monthInYear = '11' 
                        }else if(month === 'December'){
                            monthInYear = '12' 
                        }

                     $rootScope.birthdatevalue1 = response.data.month.replaceAll(',', '')+'/'+monthInYear+'/'+response.data.year;
                       const [day, month1, year] =  $rootScope.birthdatevalue1 .split("/")
                       var d= new Date(year, month1 - 1, day)
                       var mydate = new Date($rootScope.birthdatevalue1);
                       var dateValue = '';

                       if(response.data.month.replaceAll(',', '').length === 1){
                            dateValue = response.data.year+"-"+monthInYear+"-0"+response.data.month.replaceAll(',', '');
                       }else{
                            dateValue = response.data.year+"-"+monthInYear+"-"+response.data.month.replaceAll(',', '');      
                       }
                       $rootScope.birthdatevalue = dateValue;
                       age.fromBirthDate(d);
                        return   $rootScope.birthdatevalue;
                },function (response){
                    return null;
                });
            }

            var gmtDate = function(dd,mm,yyyy){
                var dob = null;
                this.localDateConversion(dd,mm,yyyy).then(function (response) {
                    $rootScope.dob = response.data.date+'-'+response.data.month.replaceAll(',', '')+'-'+response.data.year;
                    document.getElementById("popupDatepicker").value  = $rootScope.dob 
                },function (response){
                  return null;
                });
            }
       
            var patient = {
                address: {},
                age: age.create(),
                birthdate: null,               
                calculateAge: calculateAge,
                calculateAge1:calculateAge1,
                image: '../images/blank-user.gif',
                fullNameLocal: fullNameLocal,
                getImageData: getImageData,
                relationships: [],
                newlyAddedRelationships: [{}],
                deletedRelationships: [],
                calculateBirthDate: calculateBirthDate,
                localDateConversion:localDateConversion,
                calculateAgeNew:calculateAgeNew,
                dob:null,
                ethiopianDateConversion:ethiopianDateConversion,
                ethDate:ethDate,
                gmtDate:gmtDate
            };
            return _.assign(patient, identifierDetails);
        };

        return {
            create: create
        };
    }]);
