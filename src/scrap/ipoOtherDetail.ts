import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { checkLeadManagerData, checkRegistrarData, CompanyAddressInsertUpdate, deleteRelationIpoLeadManagersData } from './dbSp';

export async function scrapeCompanyAddress(IpoId:number, chittorid:number,chittorname:string){
    const url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    var registerName = ""
    var arrayLeadManager:any = [];
    var address_html = ""

    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);

        const listItems = $(".card");

        listItems.each((idx, el) => {
            var $content = cheerio.load($(el).html() || '')
            const cardHeader = $content(".card-header");
            const headerValue = $(cardHeader).text();
            if (headerValue.toLocaleUpperCase().includes("REGISTRAR")){
                const cardBody = $content(".card-body");
                var pChild = $(cardBody).children('p').children('a');
                pChild.each((idp, pel) => {
                    if (idp == 0){
                        registerName = $(pel).text().trim()
                    }
                }) 
            }
            if (headerValue.toLocaleUpperCase().includes("LEAD MANAGER")){
                const cardBody = $content(".card-body");
                var liChild = $(cardBody).children('ol').children('li');
                liChild.each((idp, pel) => {
                    var leadName = $(pel).text().replace("(Past IPO Performance)","").trim()
                    arrayLeadManager.push({leadName})
                }) 
            }
            if (headerValue.toLocaleUpperCase().includes("CONTACT DETAILS")){
                const cardBody = $content(".card-body");
                var addressChild:any = $(cardBody).children('address');
                address_html = addressChild.html().trim()
            }
        })
        
        console.log('registerName-->'+registerName)
        console.log('leadManager-->'+arrayLeadManager.length)
        console.log('address-->'+address_html)

        CompanyAddressInsertUpdate(IpoId, address_html)

        checkRegistrarData(IpoId, registerName)

        if(arrayLeadManager.length > 0) {
            await deleteRelationIpoLeadManagersData(IpoId)
        }
        
        for(var i = 0; i < arrayLeadManager.length; i++) {
            checkLeadManagerData(IpoId, arrayLeadManager[i].leadName.trim())
        }

    } catch (err) {
        console.error(err);
    }
}
