import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { DetailFinancialInfoInsertUpdate } from './dbSp';

export async function scrapeFinancialInfo(IpoId:number, chittorid:number, chittorname:string){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";

    var html_data_finance = ""
    
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        var domElem = $("*[itemtype = 'http://schema.org/Table']")
        
        var listItems:any = ""
        html_data_finance = ""

        domElem.each((idx, el) => {
            const $content = cheerio.load($(el).html() || '');
            listItems = $content("#financialTable")
            if (listItems.html() != null){
                var divChild = $(el).children('div').children('div');
                var h2Tag = $(divChild).children('h2');
                var pTag = $(divChild).children('p');
                html_data_finance = "<h2>" + h2Tag.text() + "</h2>"
                html_data_finance = html_data_finance +pTag
                html_data_finance = html_data_finance +  "<table>" + listItems.html() + "</table>"
                
            }
        });
        
        // console.log("html_data_finance-->"+html_data_finance);

        DetailFinancialInfoInsertUpdate(IpoId, html_data_finance);

    } catch (err) {
        console.error(err);
    }
}