import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import moment from 'moment';
import { gmpInsertUpdate } from './dbSp';

export async function scrapegmpInsertUpdateData(IpoId: number, investorid: number) {
    var url = constants.CON_INVERSTORGAIN_URL + investorid;
    console.log(url)
    var gmp_date:any = "";
    var gmp_price:any = 0;
    var sub2_rate:any = 0;
    var update_on:any = "";
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".table-responsive");
        listItems.each((idx, el) => {
            if (idx == 0){
                var trChildren = $(el).children('table').children('tbody').children('tr');
                trChildren.each((idtr, trchild) => {
                    if (idtr == 0){
                        var tdChildren = $(trchild).children();
                        tdChildren.each((idtd, tdchild) => {
                            var value = $(tdchild).text();
                            if (idtd == 0){
                                gmp_date = value.trim();
                            }
                            if (idtd == 2){
                                gmp_price = value.replace('₹','').trim();
                            }
                            if (idtd == 3){
                                sub2_rate = value.trim();
                            }
                            if (idtd == 5){
                                update_on = value.trim();
                            }
                        });
                    }
                });
            }
        });
    }catch (err) {
        console.error(err);
    }
    var last_update = null;
    if (gmp_date !== ""){
        gmp_date = moment(gmp_date, constants.CON_DATE_DDMMYY).format(constants.CON_DATE_YYMMDD);
    }
    console.log("update_on -->"+update_on);
    if (update_on !== ""){
        var datetime = new Date(update_on);
        var last_update:any = moment(datetime).format(constants.CON_DATE_YYMMDDHHMMSS);
    }
    console.log("gmp_date-->"+gmp_date);
    console.log("gmp_price-->"+gmp_price);
    console.log("sub2_rate-->"+sub2_rate);
    console.log("last_update-->"+last_update);
    

    gmpInsertUpdate(IpoId, gmp_price, sub2_rate, last_update,gmp_date);
}