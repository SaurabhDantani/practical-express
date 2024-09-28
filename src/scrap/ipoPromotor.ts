import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { PromotorHoldingInsertUpdate } from './dbSp';


export async function scrapePromoHoldingData(IpoId:number, chittorid:number,chittorname:string){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    var pre_issue:any = ""
    var post_issue:any = ""
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        var domElem = $("*[itemtype = 'http://schema.org/Table']")
        
        var listItems = ""
        var html_data_finance = ""

        domElem.each((idx, el) => {
            const $content = cheerio.load($(el).html() || '');
            var domH2 = $content("*[itemprop = 'about']")
            if (domH2.text().toLocaleUpperCase().includes("PROMOTER HOLDING")) { 
                var tableChild = $content(".table").html();
                var trChildren = $(tableChild).children('tr');
                trChildren.each((idx, trchild) => {
                    var tdChildren = $(trchild).children();
                    tdChildren.each((idtd, tdchild) => {
                        var tdValue = $(tdchild).text().trim();
                        if (idx == 0){
                            if (idtd == 1){
                                pre_issue = tdValue
                            }
                        } else if(idx ==1){
                            if (idtd == 1){
                                post_issue = tdValue
                            }
                        }
                    })
                })
            }
        });
        console.log("=====================> pre_issue", pre_issue)
        console.log("=====================> post_issue", post_issue)
        PromotorHoldingInsertUpdate(IpoId, pre_issue,post_issue);

    } catch (err) {
        console.error(err);
    }
}