import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import lotSizeScrapData from "../scrap/ipoLotsize";
import { Ipo } from "../models/Ipo";
import { ipoDetailScrap } from "../scrap/ipoDetail";
import { scrapeTimeLineData } from "../scrap/ipoTimeline";
import { scrapValuation } from "../scrap/ipoValuation";
import { scrapeFinancialInfo } from "../scrap/ipoFinance";
import { scrapeObjectiveData } from "../scrap/ipoObjective";
import { scrapeReservationData } from "../scrap/ipoReservation";
import { scrapePromoHoldingData } from "../scrap/ipoPromotor";
import { ExchangedEnum, FetchDataEnum, IpoTypeEnum, TypeEnum } from "../utils/enumData";
import { scrapeCompanyAddress } from "../scrap/ipoOtherDetail";
import { scrapegmpInsertUpdateData } from "../scrap/gmpInvestor";
import { scrapeBSEMainSubscriptionData } from "../scrap/liveSubscriptions/mainBSE";
import { scrapeBSESMESubscriptionData } from "../scrap/liveSubscriptions/smeBSE";
import { scrapeNSESMESubscriptionData } from "../scrap/liveSubscriptions/smeNSE";
import { scrapeNSEMainSubscriptionData } from "../scrap/liveSubscriptions/mainNSE";
import { noReservationsInsertUpdate } from "../scrap/dbSp";

class scrapingController {

    async syncLotSize(req: any, res: any, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
        debugger

            const data = await lotSizeScrapData(IpoId,ChitorId,ChitorName,req,res)
            req.flash('success', 'Data updated successfully!');
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating lot size data:', error.message);
            req.flash('error', 'Failed to update data.');
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }

    async syncIpoDetails(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName,RetailQuota,Type,IpoType} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            debugger
            noReservationsInsertUpdate(IpoId,RetailQuota,Type,IpoType)
            const data:any = await ipoDetailScrap(IpoId,ChitorId,ChitorName)
            // console.log("data status ==============>",data)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating ipo details:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncTimeLine(req: Request, res: Response, next: NextFunction) {
        debugger
        const {IpoId,ChitorId,ChitorName} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapeTimeLineData(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncValuation(req: Request, res: Response, next: NextFunction) {
        debugger
        const {IpoId,ChitorId,ChitorName} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapValuation(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncFinancialInfo(req: Request, res: Response, next: NextFunction) {
        debugger
        const {IpoId,ChitorId,ChitorName} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapeFinancialInfo(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncObjectives(req: Request, res: Response, next: NextFunction) {
        debugger
        const {IpoId,ChitorId,ChitorName} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapeObjectiveData(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncReservation(req: Request, res: Response, next: NextFunction) {
        debugger
        const {IpoId,ChitorId,ChitorName,IsSme} = req.body;
        let checkIsSme = false
        if(IsSme == TypeEnum.SME) {
            checkIsSme = true
        } 
        console.log(req.body)
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapeReservationData(IpoId,ChitorId,ChitorName, checkIsSme)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncPromoHolding(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapePromoHoldingData(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncCompanyAddress(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapeCompanyAddress(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncIPOGMPs(req: Request, res: Response, next: NextFunction) {
        const {IpoId,InvestorId} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            const data = await scrapegmpInsertUpdateData(IpoId,InvestorId)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating GMP:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncSubscription(req: Request, res: Response, next: NextFunction) {
        const {IpoId,BseId,Symbol,Type,Exchanged,FetchData} = req.body;
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);

        console.log(req.body)

        const ipoExists:any = await ipoRepo.createQueryBuilder('ipo')
        .where('ipo.IpoId = :IpoId', { IpoId: IpoId })
        .getOne();

        try {
            if(!ipoExists) {
                return res.json("data not found")
            }
            if(Type == TypeEnum.Mainbord) {
                if(FetchData == FetchDataEnum.BSE) {
                    const data = await scrapeBSEMainSubscriptionData(IpoId,BseId)
                } else if(FetchData == FetchDataEnum.NSE) {
                    scrapeNSEMainSubscriptionData(IpoId,Symbol)
                }  
                return res.status(200).json("Data updated successfully")
            } else if(Type == TypeEnum.SME) {
                
                if(Exchanged == ExchangedEnum.BSE) {
                    scrapeBSESMESubscriptionData(IpoId,BseId)
                    return res.status(200).json("Data updated successfully")
                } else if(Exchanged == ExchangedEnum.NSE) {
                    scrapeNSESMESubscriptionData(IpoId,Symbol)
                    return res.status(200).json("Data updated successfully") 
                } 
            }
            return res.status(400).json("Data not updated")
        } catch (error) {
            console.error('Error updating GMP:', error.message);
            return res.status(500).send('Internal server error');
        }
    }
}

export default new scrapingController()