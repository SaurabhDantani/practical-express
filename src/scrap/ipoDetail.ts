import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { checkMarketMakerData, deleteRelationIpoMarketMakersData, DetailsInsertUpdate } from './dbSp';

export async function ipoDetailScrap(IpoId: number, chittorid: number, chittorname: string) {
    let url = constants.CON_CHITTOR_URL + chittorname + "/" + chittorid + "/";
    let html_data = ""
    let faceValue = 0
    let minPrice: any = 0
    let maxPrice: any = 0
    let lotSize: any = 0
    let shareHoldingPreIssue: any = 0
    let shareHoldingPostIssue: any = 0
    let totalIssueShare: any = 0
    let totalIssuePrice: any = ""
    let freshIssueShare: any = 0
    let freshIssuePrice: any = ""
    let ofsIssueShare: any = 0
    let ofsIssuePrice: any = ""
    let ipoType: any = 0
    var arrayMarketMaker:any = [];
    try {
        let { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        let $ = cheerio.load(data);

        let domElem = $("*[itemtype = 'http://schema.org/Table']");

        domElem.each((idx, el) => {
            let $content = cheerio.load($(el).html() || '');
            let domH2 = $content("*[itemprop = 'about']")
            if (domH2.text().toLocaleUpperCase().includes("IPO DETAILS")) {
                let tableChild = $content(".table").html();
                let trChildren = $(tableChild).children('tr');
                trChildren.each((idx, trchild) => {
                    let trTx = $(trchild).text().trim()
                    let trHtml = $(trchild).html()
                    // console.log("trvalue-->"+trTx)
                    let tdChildren = $(trchild).children();

                    if (idx == 2) {
                        tdChildren.each((idtd, tdchild) => {
                            let tdValue: any = $(tdchild).text().trim();
                            //console.log("idx, idtd, tdValue-->"+idx+ ', '+idtd + ', ' +tdValue);
                            if (idtd == 1) {
                                tdValue = tdValue.replace("per share", "")
                                tdValue = tdValue.replaceAll("₹", "")
                                faceValue = tdValue.trim()
                            }
                        });
                    }

                    if (idx == 3) {
                        tdChildren.each((idtd, tdchild) => {
                            let tdValue: any = $(tdchild).text().trim();
                            //console.log("idx, idtd, tdValue-->"+idx+ ', '+idtd + ', ' +tdValue);
                            if (idtd == 1) {
                                tdValue = tdValue.replace("per share", "")
                                tdValue = tdValue.replaceAll("₹", "")
                                if (tdValue.includes("to")) {
                                    let tmpPrice = tdValue.split('to');
                                    if (tmpPrice.length == 2) {
                                        if (tmpPrice[0].trim() != "[.]") {
                                            minPrice = tmpPrice[0].trim()
                                            maxPrice = tmpPrice[1].trim()
                                        }
                                    }
                                } else {
                                    if (tdValue.trim() != "[.]") {
                                        minPrice = tdValue.trim()
                                        maxPrice = tdValue.trim()
                                    }
                                }
                            }
                        });
                    }

                    if (idx == 4) {
                        tdChildren.each((idtd, tdchild) => {
                            let tdValue = $(tdchild).text().trim();
                            if (idtd == 1) {
                                tdValue = tdValue.toLocaleUpperCase().replace("SHARES", "")
                                if (tdValue.trim() != "") {
                                    lotSize = tdValue.trim()
                                }
                            }
                        });
                    }

                    if (idx > 4) {
                        if (trTx.toLocaleUpperCase().includes("MARKET MAKER")) {
                            let htmlvalue = ""
                            tdChildren.each((idtd, tdchild) => {
                                let tdValue = $(tdchild).text().trim();
                                if (idtd == 1) {
                                    var tdMarket = $(tdchild).children('a');
                                    tdMarket.each((idm, tdmarketchild) => {
                                        var marketName = $(tdmarketchild).text().trim();
                                        arrayMarketMaker.push({marketName})
                                    });
                                    tdValue = tdValue.substring(0, tdValue.indexOf('shares'))
                                    tdValue = "<td>" + tdValue + "shares" + "</td>"
                                    htmlvalue = htmlvalue + tdValue
                                } else {
                                    htmlvalue = htmlvalue + "<td>" + tdValue + "</td>"
                                }
                            });
                            html_data = html_data + "<tr>" + htmlvalue + "</tr>";
                        } else {
                            html_data = html_data + "<tr>" + trHtml + "</tr>";
                        }
                        if (trTx.toLocaleUpperCase().includes("ISSUE TYPE")) {
                            tdChildren.each((idtd, tdchild) => {
                                let tdValue = $(tdchild).text().trim();
                                if (idtd == 1) {
                                    if (tdValue.toLocaleUpperCase().includes("BOOK BUILT ISSUE IPO")) {
                                        ipoType = 1
                                    } else {
                                        ipoType = 2
                                    }
                                }
                            });
                        }
                        if (trTx.toLocaleUpperCase().includes("SHARE HOLDING PRE ISSUE")) {
                            tdChildren.each((idtd, tdchild) => {
                                let tdValue: any = $(tdchild).text().trim();
                                if (idtd == 1) {
                                    tdValue = tdValue.replaceAll(",", "")
                                    shareHoldingPreIssue = tdValue
                                }
                            });
                        }
                        if (trTx.toLocaleUpperCase().includes("SHARE HOLDING POST ISSUE")) {
                            tdChildren.each((idtd, tdchild) => {
                                let tdValue: any = $(tdchild).text().trim();
                                if (idtd == 1) {
                                    tdValue = tdValue.replaceAll(",", "")
                                    shareHoldingPostIssue = tdValue
                                }
                            });
                        }
                        if (trTx.toLocaleUpperCase().includes("TOTAL ISSUE SIZE")) {
                            tdChildren.each((idtd, tdchild) => {
                                let tdValue: any = $(tdchild).text().trim();
                                if (idtd == 1) {
                                    let tmpValues = tdValue.split('shares');
                                    if (tmpValues.length == 2) {
                                        totalIssueShare = tmpValues[0].trim().replaceAll(",", "")
                                        totalIssueShare = totalIssueShare.replaceAll("[.]", "")
                                        if (totalIssueShare == "") {
                                            totalIssueShare = 0
                                        }

                                        let tmpArray = tmpValues[1].split('to');
                                        if (tmpArray.length == 2) {
                                            totalIssuePrice = tmpArray[1].trim().replaceAll(")", "")
                                        }
                                    }
                                }
                            });
                        }
                        if (trTx.toLocaleUpperCase().includes("FRESH ISSUE")) {
                            tdChildren.each((idtd, tdchild) => {
                                let tdValue: any = $(tdchild).text().trim();
                                if (idtd == 1) {
                                    let tmpValues = tdValue.split('shares');
                                    if (tmpValues.length == 2) {
                                        freshIssueShare = tmpValues[0].trim().replaceAll(",", "")
                                        freshIssueShare = freshIssueShare.replaceAll("[.]", "")
                                        if (freshIssueShare == "") {
                                            freshIssueShare = 0
                                        }
                                        let tmpArray: any = tmpValues[1].split('to');
                                        if (tmpArray.length == 2) {
                                            freshIssuePrice = tmpArray[1].trim().replaceAll(")", "")
                                        }
                                    }
                                }
                            });
                        }
                        if (trTx.toLocaleUpperCase().includes("OFFER FOR SALE")) {
                            tdChildren.each((idtd, tdchild) => {
                                let tdValue: any = $(tdchild).text().trim();
                                if (idtd == 1) {
                                    let tmpValues: any = tdValue.split('shares');
                                    if (tmpValues.length == 2) {
                                        ofsIssueShare = tmpValues[0].trim().replaceAll(",", "")
                                        ofsIssueShare = ofsIssueShare.replaceAll("[.]", "")
                                        if (ofsIssueShare == "") {
                                            ofsIssueShare = 0
                                        }

                                        let tmpArray: any = tmpValues[1].split('to');
                                        if (tmpArray.length == 2) {
                                            ofsIssuePrice = tmpArray[1].trim().replaceAll(")", "")
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
        console.log("ipoType-->"+ipoType)
        console.log("faceValue-->"+faceValue)
        console.log("minPrice-->"+minPrice)
        console.log("maxPrice-->"+maxPrice)
        console.log("lotSize-->"+lotSize)
        console.log("shareHoldingPreIssue-->"+shareHoldingPreIssue)
        console.log("shareHoldingPostIssue-->"+shareHoldingPostIssue)
        console.log("totalIssueShare-->"+totalIssueShare)
        console.log("totalIssuePrice-->"+totalIssuePrice)
        console.log("freshIssueShare-->"+freshIssueShare)
        console.log("freshIssuePrice-->"+freshIssuePrice)
        console.log("ofsIssueShare-->"+ofsIssueShare)
        console.log("ofsIssuePrice-->"+ofsIssuePrice)
        console.log("html_data-->"+html_data)


        if(arrayMarketMaker.length > 0) {
            await deleteRelationIpoMarketMakersData(IpoId)
        }

        for(var i = 0; i < arrayMarketMaker.length; i++){
            checkMarketMakerData(IpoId, arrayMarketMaker[i].marketName.trim())
        }
       const datxx = await DetailsInsertUpdate(IpoId,ipoType,faceValue,minPrice,maxPrice,lotSize,shareHoldingPreIssue,
            shareHoldingPostIssue,totalIssueShare,totalIssuePrice,freshIssueShare,freshIssuePrice,ofsIssueShare,ofsIssuePrice)

        return datxx
        // console.log("dataXX --------------->>>>>>>", datxx)
    } catch (err) {
        return console.error(err);
    }
}