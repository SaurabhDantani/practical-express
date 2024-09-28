import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { ValuationInsertUpdate } from './dbSp';


export async function scrapValuation(IpoId:number, chittorid:number, chittorname:string){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    var pre_data = false
    var kpi_data = false
    var eps_data = false
    var pe_data = false
    var arr:any = [];
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        var domElem = $("*[itemtype = 'http://schema.org/Table']");
        
        domElem.each((idx, el) => {
            const $content = cheerio.load($(el).html() || '');
            var domH2 = $content("*[itemprop = 'about']")
            if (domH2.text().toLocaleUpperCase().includes("KEY PERFORMANCE INDICATOR")) { 
                var divChild = $content(".row").html();
                var tableChild = $(divChild).children('table');
                tableChild.each((idx, tableel) => {

                    pre_data = false
                    kpi_data = false 
                    
                    var thChildren = $(tableel).children('thead').children('tr');
                    //console.log("idx-->"+idx +', '+$(tableel).html())
                    
                    thChildren.each((idth, thel) => {
                        //console.log("idth-->"+thel +', '+$(thel).text())
                        if ($(thel).text().toLocaleUpperCase().includes("PRE IPO")) { 
                            pre_data = true
                            kpi_data = false
                        } else if ($(thel).text().toLocaleUpperCase().includes("KPI")) { 
                            kpi_data = true
                            pre_data = false
                        }
                    })

                    if (pre_data){
                        var trChildren = $(tableel).children('tbody').children('tr');
                        //console.log("idx-->"+idx +', '+$(tdChildren).html())
                        trChildren.each((idtr, trel) => {
                            //console.log("idtr-->"+idtr +', '+$(trel).text())
                            var tdChildren = $(trel).children('td');
                            tdChildren.each((idtd, tdel) => {
                                //console.log("idtd-->"+idtd +', '+$(tdel).text())
                                if (idtd == 0){
                                    if ($(tdel).text().toLocaleUpperCase().includes("EPS")) { 
                                        eps_data = true
                                        pe_data = false
                                    } else if($(tdel).text().toLocaleUpperCase().includes("P/E")){
                                        eps_data = false
                                        pe_data = true
                                    }
                                } else if (idtd == 1){
                                    if(eps_data){
                                        arr.push({
                                            key: "EPS Pre IPO", 
                                            value: $(tdel).text().trim()
                                        });
                                    } else if (pe_data){
                                        arr.push({
                                            key: "P/E Pre IPO", 
                                            value: $(tdel).text().trim()
                                        });
                                    }
                                } else if (idtd == 2){
                                    if(eps_data){
                                        arr.push({
                                            key: "EPS Post IPO", 
                                            value: $(tdel).text().trim()
                                        });
                                    } else if (pe_data){
                                        arr.push({
                                            key: "P/E Post IPO", 
                                            value: $(tdel).text().trim()
                                        });
                                    }
                                }
                            })
                        })
                    } else if (kpi_data){
                        var trChildren = $(tableel).children('tbody').children('tr');
                        trChildren.each((idtr, trel) => {
                            var tdChildren = $(trel).children('td');
                            var strKey = ""
                            var strVal = ""
                            tdChildren.each((idtd, tdel) => {
                                if (idtd == 0){
                                    strKey = $(tdel).text().trim()
                                } else if (idtd == 1){
                                    strVal = $(tdel).text().trim()
                                }
                            })
                            arr.push({
                                key: strKey, 
                                value: strVal
                            });
                        })
                    }
                })
            }
        });
        var arrOfVals = [];
        for(var i = 0; i < arr.length; i++){
            var row = [IpoId, arr[i].key, arr[i].value];
            arrOfVals.push(row);
        }
        
        if (arrOfVals.length > 0){
            ValuationInsertUpdate(IpoId, arrOfVals)
        }
    } catch (err) {
        console.error(err);
    }
}
