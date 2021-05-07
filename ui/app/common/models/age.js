'use strict';

angular.module('bahmni.common.models')
    .factory('age', ['$rootScope','$http',function ($rootScope,$http) {
        var dateUtil = Bahmni.Common.Util.DateUtil;

        var fromBirthDate = function (birthDate) {
   
            var d = new Date(birthDate),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
            var today = dateUtil.now();
            var period = dateUtil.diffInYearsMonthsDays(birthDate, today);
            $rootScope.birthdatevalue = [year, month, day].join('-');
            $rootScope.yearsnew = period.years
            $rootScope.monthsnew = period.months
            $rootScope.daysnew = period.days
            if(document.getElementById("popupDatepicker") != null){
                  this.gmtDate(day,month,year);
            }else{
                this.gmtDate(day,month,year);
            }
            if(document.getElementById("birthdate") != null){
              
                document.getElementById("birthdate").value = [year, month, day].join('-')
                }

            if(document.getElementById("ageYears") != null){
              
            document.getElementById("ageYears").value = period.years
            }
            if(document.getElementById("ageMonths") != null){
            document.getElementById("ageMonths").value = period.months
            }
            if(document.getElementById("ageDays") != null){
            document.getElementById("ageDays").value = period.days
            }
            return create(period.years, period.months, period.days);
        };
 
        var create = function (years, months, days) {
            var isEmpty = function () {
                return !(this.years || this.months || this.days);
            };
            $rootScope.yearsnew = years
            $rootScope.monthsnew = months
            $rootScope.daysnew = days
          
            return {
                years: years,
                months: months,
                days: days,
                isEmpty: isEmpty
            };
        };

        var calculateBirthDate = function (age) {
            var birthDate = dateUtil.now();
            birthDate = dateUtil.subtractYears(birthDate, age.years);
            birthDate = dateUtil.subtractMonths(birthDate, age.months);
            birthDate = dateUtil.subtractDays(birthDate, age.days);
            return birthDate;
        };
        var localDateConversion = function (date,month,year) {
            return $http.get(Bahmni.Common.Constants.bahmniRESTBaseURL + "/gmttoethiopian/"+date+"/"+month+"/"+year+"");
        };
      
   var gmtDate = function(dd,mm,yyyy){
                var dob = null;
                this.localDateConversion(dd,mm,yyyy).then(function (response) {
                   $rootScope.dob = response.data.date+'-'+response.data.month.replaceAll(',', '')+'-'+response.data.year;
                    if(document.getElementById("popupDatepicker").value != null)
                    document.getElementById("popupDatepicker").value = $rootScope.dob 
                    return   $rootScope.dob;
                },function (response){
                    return null;
                });
            }
      
        return {
            fromBirthDate: fromBirthDate,
            create: create,
            calculateBirthDate: calculateBirthDate,
            localDateConversion:localDateConversion,
            gmtDate:gmtDate
        };
    }]
);
