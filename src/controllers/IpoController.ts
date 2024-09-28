import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Ipo } from "../models/Ipo";
import { ExchangedEnum, IpoTypeEnum, IssueTypeEnum, TypeEnum } from "../utils/enumData";
import { logoPath } from "../utils/constant";
import { IpoDetail } from "../models/IPODetail";
import { noReservationsInsertUpdate } from "../scrap/dbSp";

class IpoController {
    async addIpo(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Ipo);
            const ipoDetailRepo:any = connection.getRepository(IpoDetail);

            const { bseid , chittorId, chittorName, companyName, displayName, exchanged, inversterId,premiumId,symbols,type,urlName,RetailQuota } = req.body;
            console.log(req.body)

            let typeData: any;
            if (type === "1") {
                typeData = TypeEnum.Mainbord
            } else {
                typeData = TypeEnum.SME
            }

            let exchangeData: any;
            if (exchanged === "1") {
                exchangeData = ExchangedEnum.NSE
            } else if(exchanged === "2"){
                exchangeData = ExchangedEnum.BSE
            } else {
                exchangeData = ExchangedEnum.BOTH
            }

            const saveIpo = ipoRepo.create({
                CompanyName: companyName,
                DisplayName:displayName,
                UrlName:urlName,
                Symbol:symbols,
                Type: typeData,
                Exchanged:exchangeData,
                BseId:bseid || null,
                ChitorId:chittorId || null,
                ChitorName:chittorName || null,
                PremiumId:premiumId || null,
                InvestorId:inversterId || null,
                RetailQuota:RetailQuota || 1,
                FetchData: 1
            });
            await ipoRepo.save(saveIpo)

            if(saveIpo.IpoId > 0) {
                const saveDetail = ipoDetailRepo.create({  
                    IpoId:saveIpo.IpoId
                })

            await ipoDetailRepo.save(saveDetail)

            noReservationsInsertUpdate(saveIpo.IpoId,saveIpo.RetailQuota,saveIpo.Type,saveDetail.IpoType)
            }
            return res.status(200).json({message:"Data successfully saved"})
        } catch (error) {
            console.error(error)
            return
        }
    }

    async getAllIpoData(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Ipo);

            const getAll = await ipoRepo.createQueryBuilder('ipo')
            .leftJoinAndSelect('ipo.TimeLine', 'TimeLine')
            .where('ipo.IsDelete = :isDelete', { isDelete: false })
            .orderBy('TimeLine.StartDate','DESC')
            .orderBy('TimeLine.EndDate', 'DESC')
            // .orderBy('ipo.IpoId', 'DESC')
            .limit(20)
            .getMany();
         
            return res.status(200).json({getAll})
        } catch (error) {
            console.error(error)
            return
        }
    }

    async softIpoDelete(req: Request, res: Response, next: NextFunction) {
        debugger    
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Ipo);
            const id = req.params.id;
            const updateStatus = await ipoRepo.update(id, {IsDelete:true})
            return res.status(200).json({updateStatus})
        } catch (error) {
            console.error(error)
            return
        }
    }

    async activeInactiveController(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Ipo);            
            const {id,status} = req.body;
            let checkStatus = true
            if(status === true) {
                checkStatus = false
            }
            const updateStatus = await ipoRepo.update(id, {IsActive:checkStatus})
            return res.status(200).json({updateStatus})
        } catch (error) {
            console.error(error)
            return
        }
    }

    async updateIpo(req: Request, res: Response, next: NextFunction) {
        debugger

        try {
            const {
                IpoId,
                companyName,
                displayName,
                UrlName,
                symbols,
                exchanged,
                Type,
                IssueType,
                IpoType,
                chittorName,
                chittorId,
                premiumId,
                inversterId,
                bseid,
                IpoDetailId,
                RetailQuota,
                FetchData
            } = req.body;
    
            // Convert IDs to integers
            const intIpoId = parseInt(IpoId, 10);
            const intChittorId = parseInt(chittorId, 10);
            const intPremiumId = parseInt(premiumId, 10);
            const intInvestorId = parseInt(inversterId, 10);
            const intBseId = parseInt(bseid, 10);
    
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Ipo);
            const ipoDetailRepo = connection.getRepository(IpoDetail);

            let exchanged_Type = null
            if(exchanged == 1) {
                exchanged_Type = ExchangedEnum.NSE
            } else if(exchanged == 2) {
                exchanged_Type = ExchangedEnum.BSE
            } else {
                exchanged_Type = ExchangedEnum.BOTH
            }

            let type_Enum = null
            if(Type == 1) {
                type_Enum = TypeEnum.Mainbord
            } else {
                type_Enum = TypeEnum.SME
            }

            let issue_Type = null
            if(IssueType == 1) {
                issue_Type = IssueTypeEnum.IPO
            } else {
                issue_Type = IssueTypeEnum.FPO
            }

            let Ipo_Type = null
            if(IpoType == 1) {
                Ipo_Type = IpoTypeEnum.BOOK_BUILT_ISSUE
            } else {
                Ipo_Type = IpoTypeEnum.FIXED_PRICE_ISSUE
            }

            const updateIpo = await ipoRepo.update(intIpoId, {
                BseId: intBseId || undefined,
                ChitorId: intChittorId || undefined,
                ChitorName: chittorName,
                CompanyName: companyName,
                DisplayName: displayName,
                UrlName: UrlName,
                Symbol: symbols,
                PremiumId: intPremiumId || undefined,
                InvestorId: intInvestorId || undefined,
                Type:type_Enum,
                Exchanged:exchanged_Type,
                IssueType:issue_Type,
                RetailQuota:RetailQuota,
                FetchData:FetchData
            });
            console.log(updateIpo);

            if(IpoId && IpoDetailId) {
                const updateIpoDetail = await ipoDetailRepo.update(IpoDetailId,{
                    IpoType:Ipo_Type
                })
                console.log(updateIpoDetail)
            }    
            return res.redirect(`/ipoDetail/get/${intIpoId}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default new IpoController();



