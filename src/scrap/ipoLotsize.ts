import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { LotSizeInsertUpdate } from './dbSp';



export default async function lotSizeScrapData(IpoId:number, chittorid:number, chittorname:string,  req?: any,res?: any){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    let retail_min_lot: number = 0;
    let retail_min_share: number = 0;
    let retail_max_lot: number = 0;
    let retail_max_share: number = 0;
    let shni_min_lot: number = 0;
    let shni_min_share: number = 0;
    let shni_max_lot: number = 0;
    let shni_max_share: number = 0;
    let bhni_min_lot: number = 0;
    let bhni_min_share: number = 0;
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        const domElem = $("*[itemtype = 'http://schema.org/Table']");
        
        domElem.each((idx, el) => {
            const $content = cheerio.load($(el).html() || '');
            const domH2 = $content("*[itemprop = 'about']")
            if (domH2.text().toLocaleUpperCase().includes("LOT SIZE")) { 
                const tableChild = $content(".table").html();
                const trChildren = $(tableChild).children('tr');
                trChildren.each((idx, trchild) => {
                    const tdChildren = $(trchild).children();
                    tdChildren.each((idtd, tdchild) => {
                        const tdValue:any = $(tdchild).text().trim();
                        //console.log("idx, idtd, tdValue-->"+idx+ ', '+idtd + ', ' +tdValue);
                        if (idtd == 1){
                            if (idx == 1){ 
                                retail_min_lot = tdValue;
                            } else if (idx == 2){ 
                                retail_max_lot = tdValue;
                            } else if (idx == 3){ 
                                shni_min_lot = tdValue;
                            } else if (idx == 4){ 
                                shni_max_lot = tdValue;
                            } else if (idx == 5){ 
                                bhni_min_lot = tdValue;
                            } 
                        } else if (idtd == 2){
                            if (idx == 1){ 
                                retail_min_share = tdValue;
                            } else if (idx == 2){ 
                                retail_max_share = tdValue;
                            } else if (idx == 3){ 
                                shni_min_share = tdValue;
                            } else if (idx == 4){ 
                                shni_max_share = tdValue;
                            } else if (idx == 5){ 
                                bhni_min_share = tdValue;
                            } 
                        }
                    });
                });
            }
        });
        
        console.log('retail_min_lot -->'+retail_min_lot);
        console.log('retail_min_share -->'+retail_min_share);
        console.log('retail_max_lot -->'+retail_max_lot);
        console.log('retail_max_share -->'+retail_max_share);
        console.log('shni_min_lot -->'+shni_min_lot);
        console.log('shni_min_share -->'+shni_min_share);
        console.log('shni_max_lot -->'+shni_max_lot);
        console.log('shni_max_share -->'+shni_max_share);
        console.log('bhni_min_lot -->'+bhni_min_lot);
        console.log('bhni_min_share -->'+bhni_min_share);
debugger
        const dzata = await LotSizeInsertUpdate(
            IpoId,retail_min_lot, retail_min_share, retail_max_lot, 
            retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, 
            shni_max_share, bhni_min_lot, bhni_min_share, req,res
        )

        console.log("data from dzata ---------------------->", dzata)

    } catch (err) {
        console.error(err);
    }
}