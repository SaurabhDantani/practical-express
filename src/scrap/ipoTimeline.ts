import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import moment from 'moment';
import { TimeLineInsertUpdate } from './dbSp';

export async function scrapeTimeLineData(IpoId:number, chittorid:number, chittorname:string){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        var domElem = $("*[itemtype = 'http://schema.org/Table']");

        domElem.each((idx, el) => {
            const $content = cheerio.load($(el).html() || '');
            var domH2 = $content("*[itemprop = 'about']")
            if (domH2.text().toLocaleUpperCase().includes("TIMELINE")) { 
                var tableChild = $content(".table").html();
                var trChildren = $(tableChild).children('tr');
                trChildren.each((idx, trchild) => {
                    var tdChildren = $(trchild).children();
                    tdChildren.each((idtd, tdchild) => {
                        var tdValue = $(tdchild).text().trim();
                        if (idtd == 1){
                            if (idx == 0){ // IPO Open Date
                                open_date = tdValue;
                            } else if (idx == 1){ // IPO Close Date
                                close_date = tdValue;
                            } else if (idx == 2){ // Basis of Allotment
                                basic_allotment_date = tdValue;
                            } else if (idx == 3){ // Initiation of Refunds
                                refund_date = tdValue;
                            } else if (idx == 4){ // Credit of Shares to Demat
                                credit_share_date = tdValue;
                            } else if (idx == 5){ // Listing Date
                                listing_date = tdValue;
                            }
                        }
                    });
                });
            }
        });

        var datetime:any = new Date(open_date);
        var open_date:any = moment(datetime).format(constants.CON_DATE_YYMMDD);

        var datetime:any = new Date(close_date);
        var close_date:any = moment(datetime).format(constants.CON_DATE_YYMMDD);

        var datetime:any = new Date(basic_allotment_date);
        var basic_allotment_date:any = moment(datetime).format(constants.CON_DATE_YYMMDD);

        var datetime:any = new Date(refund_date);
        var refund_date:any = moment(datetime).format(constants.CON_DATE_YYMMDD);

        var datetime:any = new Date(credit_share_date);
        var credit_share_date:any = moment(datetime).format(constants.CON_DATE_YYMMDD);

        var datetime:any = new Date(listing_date);
        var listing_date:any = moment(datetime).format(constants.CON_DATE_YYMMDD);

        console.log('open_date -->'+open_date);
        console.log('close_date -->'+close_date);
        console.log('basic_allotment_date -->'+basic_allotment_date);
        console.log('refund_date -->'+refund_date);
        console.log('credit_share_date -->'+credit_share_date);
        console.log('listing_date -->'+listing_date);

        TimeLineInsertUpdate(IpoId, open_date, close_date, basic_allotment_date, refund_date, credit_share_date, listing_date);
    } catch (err) {
        console.error(err);
    }
}