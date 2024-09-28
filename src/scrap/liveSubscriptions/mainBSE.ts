import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from '../constants';
import moment from 'moment';
import { subscriptionFields, subscriptionInsertUpdate } from '../dbSp';


export async function scrapeBSEMainSubscriptionData(IpoId:number, BseId:number) {
    const url = constants.CON_BSE_MAIN_URL+BseId;    
    var retail:any = 0
    var qib:any = 0
    var nii:any = 0
    var employees:any = 0
    var bnii:any = 0
    var snii:any = 0
    var share_holder:any = 0
    var update_on:any = "";
    
    console.log("----------->", url)
    try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        
        const $ = cheerio.load(data);
        const divValue = $("#divID");
        
        var trChildren = $(divValue).children('table').children('tbody').children('tr').children('td').children('table').children('tbody').children('tr');
        var tmpName = "";
        var tmpIndex = -1;

        trChildren.each((idx, trchild) => {
            var tdChildren = $(trchild).children();
            var trValue = $(trchild).text();
            //console.log('trChildren, idx -->'+idx+', ' +$(trchild).text());
            if (trValue.toLocaleUpperCase().includes(constants.CON_QUALIFIED_INSTITUTIONAL_BUYERS)) { 
                tmpName = constants.CON_QUALIFIED_INSTITUTIONAL_BUYERS;
            } else if (trValue.toLocaleUpperCase().includes(constants.CON_NON_INSTITUTIONAL_INVESTORS)) { 
                tmpIndex = tmpIndex +1;
                tmpName = constants.CON_NON_INSTITUTIONAL_INVESTORS;
            } else if (trValue.toLocaleUpperCase().includes(constants.CON_RETAIL_INDIVIDUAL_INVESTORS)) { 
                tmpName = constants.CON_RETAIL_INDIVIDUAL_INVESTORS;
            } else if (trValue.toLocaleUpperCase().includes(constants.CON_EMPLOYEE_RESERVED)) { 
                tmpName = constants.CON_EMPLOYEE_RESERVED;
            } else if (trValue.toLocaleUpperCase().includes(constants.CON_SHAREHOLDER)) { 
                tmpName = constants.CON_SHAREHOLDER;
            } else{
                tmpName = "";
            }
            tdChildren.each((idtd, tdchild) => {
                var value = $(tdchild).text();
                //console.log('tdChildren, idx, idtd -->'+idx+ ', ' +idtd+ ', ' +value);
                if (value.toLocaleUpperCase().includes(constants.CON_UPDATED_ON)) { 
                    update_on = value.substring(value.toLocaleUpperCase().indexOf(constants.CON_UPDATED_ON)+11);
                }
                if (tmpName === constants.CON_QUALIFIED_INSTITUTIONAL_BUYERS){
                    if (idtd == 3){
                        qib = value;
                    }
                } else if (tmpName === constants.CON_NON_INSTITUTIONAL_INVESTORS){
                    if (idtd == 3){
                        if (tmpIndex == 0){
                            nii = value;
                        } else if (tmpIndex == 1){
                            bnii = value;
                        } else if (tmpIndex == 2){
                            snii = value;
                        }
                    }
                } else if (tmpName === constants.CON_RETAIL_INDIVIDUAL_INVESTORS){
                    if (idtd == 3){
                        retail = value;
                    }
                } else if (tmpName === constants.CON_EMPLOYEE_RESERVED){
                    if (idtd == 3){
                        employees = value;
                    }
                } else if (tmpName === constants.CON_SHAREHOLDER){
                    if (idtd == 3){
                        share_holder = value;
                    }
                }
            });
        });
        if (retail == '-'){
            retail = 0;
        }
        if (qib == '-'){
            qib = 0;
        }
        if (nii == '-'){
            nii = 0;
        }
        if (bnii == '-'){
            bnii = 0;
        }
        if (snii == '-'){
            snii = 0;
        }
        if (employees == '-'){
            employees = 0;
        }
        if (share_holder == '-'){
            share_holder = 0;
        }
        
        const tmpTime = update_on.split('|');
        var last_update:any = null;

        if (tmpTime.length == 2){
            var datetime = new Date(tmpTime[0].trim() + " " + tmpTime[1].trim());
            last_update = moment(datetime).format(constants.CON_DATE_YYMMDDHHMMSS);
        }
        console.log('last_update -->'+last_update);
        console.log('RETAIL -->'+retail);
        console.log('NII -->'+nii);
        console.log('QIB -->'+qib);
        console.log('bnii -->'+bnii);
        console.log('snii -->'+snii);
        console.log('employees -->'+employees);
        console.log('share_holder -->'+share_holder);

        const field:subscriptionFields = {
            IpoId: IpoId,
            SniiSubscription: snii,
            SniiApplication: 0,
            ShareHolderSubscription: share_holder,
            ShareHolderApplication: 0,
            RetailSubscription: retail,
            RetailApplication: 0,
            QibSubscription: qib,
            QibApplication: 0,
            NiiSubscription: nii,
            NiiApplication: 0,
            LastUpdate: last_update,
            EmployeeSubscription: employees,
            EmployeeApplication: 0,
            BniiSubscription: bnii,
            BniiApplication: 0,
        }
        subscriptionInsertUpdate(field)
        // subscriptionInsertUpdate(IpoId, retail, qib, nii, bnii, snii, employees, share_holder, last_update);
    } catch (err) {
        console.error(err);
    }
}