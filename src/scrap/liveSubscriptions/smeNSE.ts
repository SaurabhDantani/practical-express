import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from '../constants';
import moment from 'moment';
import { subscriptionFields, subscriptionInsertUpdate } from '../dbSp';

let cookie:any;
//let url_oc = "https://www.nseindia.com/"
let url_oc = ""
let url = ""
let headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'accept-language': 'en,gu;q=0.9,hi;q=0.8', 'accept-encoding': 'gzip, deflate, br',
  'Cookie': cookie ? cookie : ""
}

var count:any = 0;
var iid:any = 0;
var retail:any = 0
var qib:any = 0
var nii:any = 0
var employees:any = 0
var bnii:any = 0
var snii:any = 0
var share_holder:any = 0
var update_on:any = "";

var retailApplication:any = 0
var qibApplication:any = 0
var niiApplication:any = 0
var employeesApplication:any = 0
var shareHolderApplication:any = 0


var instance = axios.create({
    baseURL: url_oc,
    headers: headers
    // cookie: cookie ? cookie : ""
  });

const getCookies = async () => {
    try {
        const response:any = await instance.get(url_oc);
        cookie = response.headers['set-cookie'].join();
        console.log("cookie =========>"+cookie);
        await getAPIData();
    } catch (error) {
        if (error.response.status === 403) {
            console.log("getCookies =========> error.status === 403");
            await getCookies();
        } else {
            console.log("getCookies =========> error");
        }
    }
}

function parseData(data:any){
    var latestTime = data.updateTime;
    if (latestTime.toLocaleUpperCase().includes(constants.CON_UPDATED_AS_ON)) { 
        //update_on = latestTime.substring(latestTime.toLocaleUpperCase().indexOf(constants.CON_UPDATED_ON)+14);
        update_on = latestTime.toLocaleUpperCase().replace(constants.CON_UPDATED_AS_ON,'')
        update_on = update_on.replace('HRS','').trim()
    }
    console.log("update_on =========>"+update_on);
    const listItems = data.data;
    var tmpIndex = -1;
    for(var i = 0; i < listItems.length; i++){
        var category = listItems[i].category;
        if (category.toLocaleUpperCase().includes(constants.CON_QUALIFIED_INSTITUTIONAL_BUYERS)) { 
            qib = listItems[i].noOfshareBid;
            qibApplication = listItems[i].noofapplication;
        } else if (category.toLocaleUpperCase().includes(constants.CON_NON_INSTITUTIONAL_INVESTORS)) { 
            tmpIndex = tmpIndex +1;
            if (tmpIndex == 0){
                nii = listItems[i].noOfshareBid;
                niiApplication = listItems[i].noofapplication;
            } else if (tmpIndex == 1){
                bnii = listItems[i].noOfshareBid;
            } else if (tmpIndex == 2){
                snii = listItems[i].noOfshareBid;
            }
        } else if (category.toLocaleUpperCase().includes(constants.CON_RETAIL_INDIVIDUAL_INVESTORS)) { 
            retail = listItems[i].noOfshareBid;
            retailApplication = listItems[i].noofapplication;
        } else if (category.toLocaleUpperCase().includes(constants.CON_EMPLOYEES)) { 
            employees = listItems[i].noOfshareBid;
            employeesApplication = listItems[i].noofapplication;
        } else if (category.toLocaleUpperCase().includes(constants.CON_SHAREHOLDER)) { 
            share_holder = listItems[i].noOfshareBid;
            shareHolderApplication = listItems[i].noofapplication;
        } 
    }
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

    const tmpTime = update_on.trim().split(' ');
    var last_update = null;
    if (tmpTime.length == 2){
        // var date = moment(tmpTime[0].trim()).format('YYYY-MM-DD');
        // var time24 = moment(tmpTime[1].trim(), 'hh:mm:ss A').format('HH:mm:ss');
        // last_update = date + ' ' + time24;
        var datetime = new Date(tmpTime[0].trim() + " " + tmpTime[1].trim());
        var last_update:any = moment(datetime).format(constants.CON_DATE_YYMMDDHHMMSS);
    }

    console.log('iid -->'+iid);
    console.log('last_update -->'+last_update);
    console.log('RETAIL -->'+retail);
    console.log('NII -->'+nii);
    console.log('QIB -->'+qib);
    console.log('bnii -->'+bnii);
    console.log('snii -->'+snii);
    console.log('employees -->'+employees);
    console.log('share_holder -->'+share_holder);

    console.log('RETAIL APPLICATION -->'+retailApplication);
    console.log('NII APPLICATION-->'+niiApplication);
    console.log('QIB APPLICATION-->'+qibApplication);
    console.log('employees APPLICATION-->'+employeesApplication);
    console.log('share_holder APPLICATION-->'+shareHolderApplication);

    const field:subscriptionFields = {
        IpoId: iid,
        SniiSubscription: snii,
        SniiApplication: 0,
        ShareHolderSubscription: share_holder,
        ShareHolderApplication: shareHolderApplication,
        RetailSubscription: retail,
        RetailApplication: retailApplication,
        QibSubscription: qib,
        QibApplication: qibApplication,
        NiiSubscription: nii,
        NiiApplication: niiApplication,
        LastUpdate: last_update,
        EmployeeSubscription: employees,
        EmployeeApplication: employeesApplication,
        BniiSubscription: bnii,
        BniiApplication: 0,
    }
    subscriptionInsertUpdate(field)
}

const getAPIData = async () => {
    try {
        if (cookie) {
            //console.log("url =========> "+url);
            const response = await instance.get(url);
            //console.log("response.data =========> "+response.data);
            parseData(response.data);
        }else{
            await getCookies();
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("getAPIData =========> error.status === 401");
            if (!cookie) {
                console.log("getAPIData =========> cookie not found");
                await getCookies();
            }
            if (count < 50){
                count = count +1;
                await getAPIData();
            }else{
                console.log("getAPIData =========> count completed");
            }
        } else {
            console.log("getAPIData =========> "+error);
            console.log("getAPIData =========> error");
        }
    }
}

export async function scrapeNSESMESubscriptionData(IpoId:any, Symbol:any) {
    iid = IpoId;
    count = 0;
    // url_oc = "https://www.nseindia.com/market-data/issue-information?symbol="+Symbol+"&series=SME&type=Active"
    url_oc = "https://www.nseindia.com/"
    url = "https://www.nseindia.com/api/ipo-bid-details?symbol="+Symbol+"&series=SME"

    console.log("url-->"+url)
    
    instance = axios.create({
        baseURL: url_oc,
        headers: headers,
        // cookie: cookie ? cookie : ""
    });

    (async () => {
        await getAPIData();
    })();
}

