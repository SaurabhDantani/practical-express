import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { DetailObjectivesInsertUpdate } from './dbSp';


export async function scrapeObjectiveData(IpoId:number, chittorid:number, chittorname:string){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    var html_data = ""
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        const listItems = $(".col-md-12");
        
        listItems.each((idx, el) => {
            //console.log("idx-->"+idx);
            var h2Children = $(el).children('h2');
            var h2Text = h2Children.text();
            
            if (h2Text.toLocaleUpperCase().includes("OBJECTIVES")) {
                var olChildren:any = $(el).children('ol');
                if (olChildren.html() != null){
                    html_data = html_data +  "<ol>" + olChildren.html().trim() + "</ol>"
                }else{
                    var ulChildren:any = $(el).children('ul');
                    if (ulChildren.html() != null){
                        html_data = html_data +  "<ul>" + ulChildren.html().trim() + "</ul>"
                    }else{
                        var pData:any = ""
                        var pChildren = $(el).children('p');
                        if (pChildren.length == 1){
                            pData = $(pChildren[0])
                        }else{
                            for(var i = 0; i < pChildren.length; i++){
                                if (i != 0){
                                    pData = pData + $(pChildren[i])
                                }
                            }
                        }
                        html_data = pData;
                    }
                }
            } 
        });
        
        html_data = html_data.toString().replace(/"/g, '\\"');
        // console.log("html_data-->"+html_data);
        DetailObjectivesInsertUpdate(IpoId, html_data);

    } catch (err) {
        console.error(err);
    }
}