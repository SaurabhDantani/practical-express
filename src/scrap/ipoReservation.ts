import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import global from '../utils/global';
import { ReservationInsertUpdate, ShareOfferedEnumDataFields } from './dbSp';

export async function scrapeReservationData(IpoId:number, chittorid:number, chittorname:string, isSME:boolean){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    var anchor_investor_shares:any = 0
    var market_makers_shares:any = 0
    var retail_shares:any = 0
    var qib_shares:any = 0
    var nii_shares:any = 0
    var bnii_shares:any = 0
    var snii_shares:any = 0
    var employee_shares:any = 0
    var share_holder_shares:any = 0
    var total_shares:any = 0
    var retail_maximum_allotment:any = 0
    var bnii_maximum_allotment:any = 0
    var nii_maximum_allotment:any = 0
    var snii_maximum_allotment:any = 0
    var anchor_investor = false
    var market_makers = false
    var retail = false
    var qib = false
    var nii = false
    var bnii = false
    var snii = false
    var employee = false
    var share_holder = false
    var total = false
    var lotSize:any = 0
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        var domElem = $("*[itemtype = 'http://schema.org/Table']");

        domElem.each((idx, el) => {
            const $content = cheerio.load($(el).html() || '');
            var domH2 = $content("*[itemprop = 'about']")

            if (isSME){
                if(domH2.text().toLocaleUpperCase().includes("DETAILS")){
                    var tableChildNormal = $content(".table");
                    var trChildren = $(tableChildNormal).children('tbody').children('tr');
                    trChildren.each((idtr, trel) => {
                        var trTx = $(trel).text().trim()
                        if (trTx.toLocaleUpperCase().includes("LOT SIZE")) {
                            var tdChildren = $(trel).children('td');
                            tdChildren.each((idtd, tdel) => {
                                var value = $(tdel).text().trim()
                                if (idtd == 1){
                                    value = value.toLocaleUpperCase().replace("SHARES","").trim()
                                    lotSize = value
                                }
                            })
                        }
                    })
                }
            }
            
            if (domH2.text().toLocaleUpperCase().includes("RESERVATION")) { 
                var tableChild = $content(".table").html();
                var tableChildNormal = $content(".table");
                var thChildren = $(tableChildNormal).children('thead').children('tr').children('th');
                var thText = $(thChildren).text();
                if (thText.toLocaleUpperCase().includes("MAXIMUM ALLOTTEES")) {
                    var trChildren = $(tableChildNormal).children('tbody').children('tr');
                    trChildren.each((idtr, trel) => {
                        var trTx = $(trel).text().trim()
                        anchor_investor = false
                        market_makers = false
                        retail = false
                        qib = false
                        nii = false
                        bnii = false
                        snii = false
                        employee = false
                        share_holder = false
                        total = false
                        if (trTx.toLocaleUpperCase().includes("ANCHOR INVESTOR")) {
                            anchor_investor = true
                        } else if (trTx.toLocaleUpperCase().includes("MARKET MAKER")) {
                            market_makers = true
                        } else if (trTx.toLocaleUpperCase().includes("QIB")) {
                            qib = true
                        } else if (trTx.toLocaleUpperCase().includes("NII (HNI)")) {
                            nii = true
                        } else if (trTx.toLocaleUpperCase().includes("BNII")) {
                            bnii = true
                        } else if (trTx.toLocaleUpperCase().includes("SNII")) {
                            snii = true
                        } else if (trTx.toLocaleUpperCase().includes("RETAIL")) {
                            retail = true
                        } else if (trTx.toLocaleUpperCase().includes("EMPLOYEE")) {
                            employee = true
                        } else if (trTx.toLocaleUpperCase().includes("OTHER")) {
                            share_holder = true
                        } else if (trTx.toLocaleUpperCase().includes("TOTAL")) {
                            total = true
                        }
                        var tdChildren = $(trel).children('td');
                        tdChildren.each((idtd, tdel) => {
                            var value = $(tdel).text().trim()
                            if (idtd == 1){
                                if (anchor_investor){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    anchor_investor_shares = value
                                } else if (market_makers){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    market_makers_shares = value
                                } else if (qib){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    qib_shares = value
                                } else if (nii){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    nii_shares = value
                                } else if (bnii){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    bnii_shares = value
                                } else if (snii){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    snii_shares = value
                                } else if (retail){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    retail_shares = value
                                } else if (employee){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    employee_shares = value
                                } else if (share_holder){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    share_holder_shares = value
                                } else if (total){
                                    value = value.substring(0, value.indexOf('(')).trim()
                                    total_shares = value
                                } 
                            }
                            if (idtd == 2){
                                if (bnii){
                                    bnii_maximum_allotment = value.trim()
                                } else if (snii){
                                    snii_maximum_allotment = value.trim()
                                } else if (retail){
                                    retail_maximum_allotment = value.trim()
                                } 
                            }
                        })
                    })
                } else {
                    var trChildren = $(tableChildNormal).children('tbody').children('tr');
                    if ($(trChildren).text().toLocaleUpperCase().includes("MARKET MAKER")) {
                        trChildren.each((idtr, trel) => {
                            var trTx = $(trel).text().trim()
                            anchor_investor = false
                            market_makers = false
                            retail = false
                            qib = false
                            nii = false
                            bnii = false
                            snii = false
                            employee = false
                            share_holder = false
                            total = false
                            if (trTx.toLocaleUpperCase().includes("ANCHOR INVESTOR")) {
                                anchor_investor = true
                            } else if (trTx.toLocaleUpperCase().includes("MARKET MAKER")) {
                                market_makers = true
                            } else if (trTx.toLocaleUpperCase().includes("QIB")) {
                                qib = true
                            } else if (trTx.toLocaleUpperCase().includes("NII (HNI)")) {
                                nii = true
                            } else if (trTx.toLocaleUpperCase().includes("BNII")) {
                                bnii = true
                            } else if (trTx.toLocaleUpperCase().includes("SNII")) {
                                snii = true
                            } else if (trTx.toLocaleUpperCase().includes("RETAIL")) {
                                retail = true
                            } else if (trTx.toLocaleUpperCase().includes("EMPLOYEE")) {
                                employee = true
                            } else if (trTx.toLocaleUpperCase().includes("OTHER")) {
                                nii = true
                            } else if (trTx.toLocaleUpperCase().includes("TOTAL")) {
                                total = true
                            }
                            var tdChildren = $(trel).children('td');
                            tdChildren.each((idtd, tdel) => {
                                var value = $(tdel).text().trim()
                                if (idtd == 1){
                                    if (anchor_investor){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        anchor_investor_shares = value
                                    } else if (market_makers){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        market_makers_shares = value
                                    } else if (qib){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        qib_shares = value
                                    } else if (nii){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        nii_shares = value
                                    } else if (bnii){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        bnii_shares = value
                                    } else if (snii){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        snii_shares = value
                                    } else if (retail){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        retail_shares = value
                                    } else if (employee){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        employee_shares = value
                                    } else if (share_holder){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        share_holder_shares = value
                                    } else if (total){
                                        value = value.substring(0, value.indexOf('(')).trim()
                                        total_shares = value
                                    } 
                                }
                                })
                            })
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
debugger
    retail_shares = global.removeComma(retail_shares);
    nii_shares = global.removeComma(nii_shares);
    if (isSME){
        retail_maximum_allotment = ~~(retail_shares/lotSize)
        nii_maximum_allotment = ~~(nii_shares/lotSize)
    }
    if (anchor_investor_shares == ""){
        anchor_investor_shares = 0
    }
    console.log('anchor_investor_shares -->'+anchor_investor_shares);
    console.log('market_makers_shares -->'+market_makers_shares);
    console.log('retail_shares -->'+retail_shares);
    console.log('qib_shares -->'+qib_shares);
    console.log('nii_shares -->'+nii_shares);
    console.log('bnii_shares -->'+bnii_shares);
    console.log('snii_shares -->'+snii_shares);
    console.log('employee_shares -->'+employee_shares);
    console.log('share_holder_shares -->'+share_holder_shares);
    console.log('total_shares -->'+total_shares);
    console.log('bnii_maximum_allotment -->'+bnii_maximum_allotment);
    console.log('snii_maximum_allotment -->'+snii_maximum_allotment);
    console.log('retail_maximum_allotment -->'+retail_maximum_allotment);
    console.log('nii_maximum_allotment -->'+nii_maximum_allotment);
    
    

    const data:ShareOfferedEnumDataFields =  {
        IpoId: IpoId,
        AnchorInvestorSharesOffer: anchor_investor_shares,
        MarketMakersSharesOffer: market_makers_shares,
        RetailSharesOffer: retail_shares,
        NiiSharesOffer: nii_shares,
        BniiSharesOffer: bnii_shares,
        SniiSharesOffer: snii_shares,
        QibSharesOffer: qib_shares,
        EmployeeSharesOffer: employee_shares,
        ShareHolderSharesOffer: share_holder_shares,
        TotalSharesOffer: total_shares,
        BniiMaximumAllotment: bnii_maximum_allotment,
        SniiMaximumAllotment: snii_maximum_allotment,
        RetailMaximumAllotment: retail_maximum_allotment,
        NiiMaximumAllotment:nii_maximum_allotment
      }
    ReservationInsertUpdate(data)
}