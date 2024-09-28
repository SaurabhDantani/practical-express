import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Ipo } from "../models/Ipo";
import { TimeLine } from "../models/TimeLine";
import { IpoDetail } from "../models/IPODetail";
import { anchorInvestor, boaImagePath, logoPath } from "../utils/constant";
import global from "../utils/global";
import * as cheerio from 'cheerio';
import { LotSize } from "../models/LotSize";
import { getIpoReservation } from "./ipoReservetionCalculatorController";
import { PromoterHoldings } from "../models/PromoterHolding";
import { LeadManager } from "../models/LeadManager";
import { RelationIpoLeadManagers } from "../models/RelationIpoLeadManagers";
import { RelationIpoMarketMakers } from "../models/RelationIpoMarketMakers";
import { IpoSubscription } from "../models/IPOSubscription";
import { IPOGMP } from "../models/IPOGMP";
import { MarketMaker } from "../models/MarketMaker";
import { NoReservations } from "../models/NoReservetion";
class IpoDetailController {

    async getIpoDetail(req: Request, res: Response, next: NextFunction) {        
        debugger
        try {
            const id:any = req.params.id
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Ipo)
            const registarRepo = connection.getRepository(IpoDetail);
            const relationIpoLeadManagersRepo = connection.getRepository(RelationIpoLeadManagers);
            const relationIpoMarketMakersRepo = connection.getRepository(RelationIpoMarketMakers);

            const ipoDetailsQuery:any = await ipoRepo.createQueryBuilder('ipo')
            .leftJoinAndSelect('ipo.LotSizeId', 'LotSizeId')
            .leftJoinAndSelect('ipo.IpoDetail', 'IpoDetail')
            .leftJoinAndSelect('ipo.TimeLine', 'TimeLine')
            .leftJoinAndSelect('ipo.ValuationId','ValuationId')
            .leftJoinAndSelect('ipo.Reservation','Reservation')
            .leftJoinAndSelect('ipo.IpoSubscription','IpoSubscription')
            .leftJoinAndSelect('ipo.PromoterHoldings','PromoterHoldings')
            .leftJoinAndSelect('ipo.RelationIpoLeadManagers','RelationIpoLeadManagers')
            .leftJoinAndSelect('ipo.IPOGMPId','IPOGMPId')
            .leftJoinAndSelect('ipo.NoReservations','NoReservations')
            .where('ipo.IpoId = :IpoId', { IpoId: id })
            .orderBy('IPOGMPId.GmpId', 'DESC')
            .getOne();

            const findLeadManager = await relationIpoLeadManagersRepo.createQueryBuilder('lead')
                  .leftJoinAndSelect("lead.LeadManagerId","LeadManagerId")
                  .where('lead.IpoId = :IpoId', { IpoId: id })
                  .getMany()

            const leadManagerData = findLeadManager

            const findMarketMaker = await relationIpoMarketMakersRepo.createQueryBuilder('market')
                  .leftJoinAndSelect("market.MarketMakerId","MarketMakerId")
                  .where('market.IpoId = :IpoId', { IpoId: id })
                  .getMany()
            
            const marketMakerData = findMarketMaker        
            let registar = null
            if(ipoDetailsQuery?.IpoDetail !==null) {
                registar = await registarRepo.createQueryBuilder('details')
                .leftJoinAndSelect("details.RegistrarId","RegistrarId")
                .where('details.IpoDetailId = :IpoDetailId', { IpoDetailId: ipoDetailsQuery?.IpoDetail?.IpoDetailId })
                .getOne();
            }
            // console.log("===================> ipoDetailsQuery", ipoDetailsQuery?.NoReservations)
            
            const imageUrl = `/${logoPath}/${ipoDetailsQuery?.CompanyLogo}`
            const boaImage = `/${boaImagePath}/${ipoDetailsQuery?.IpoDetail?.BasicOfAllotment}`
            const anchorInvestorPdf = `/${anchorInvestor}/${ipoDetailsQuery?.IpoDetail?.AnchorListLink}`
            
            const ipoReservationTable = await getIpoReservation(id)

            let financialInformation = ipoDetailsQuery?.IpoDetail?.FinancialInformation || 'N/A';
            if (financialInformation !== 'N/A') {
                const $ = cheerio.load(financialInformation);
                $('table').addClass('table table-hover');
                financialInformation = $.html();
            } 
            const comapnyName = ipoDetailsQuery?.CompanyName
            const message = req.query.message;
            
            ipoDetailsQuery.isBeforeCutoffDate = global.isBeforeDate(ipoDetailsQuery?.TimeLine?.ListingDate);
            ipoDetailsQuery.isBeforeCutoffDate = global.isBeforeDate(ipoDetailsQuery?.TimeLine?.ListingDate);
            
            return res.render('ipoDetails/index',{
                comapnyName,
                ipoDetailsQuery,
                imageUrl,
                message,
                boaImage,
                anchorInvestorPdf, 
                financialInformation,
                ipoSubscriptionTable: ipoReservationTable,
                registar,
                leadManagerData,
                marketMakerData
            })
        } catch (error) {
            console.error(error)
            return
        }
    }

    async addIpoDetails(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const ipoId:any = req.body.id

            const connection = await dbUtils.getDefaultConnection();
            const timeLineRepo = connection.getRepository(TimeLine);
            const ipoRepo = connection.getRepository(Ipo);
            const ipoExists:any = await ipoRepo.findOne({
                where: {IpoId:ipoId},
            })
            if(!ipoExists) {
                return res.status(401).json({message:"Ipo not found"})
            }
            
            const createTimeLine = timeLineRepo.create({                
                IpoId:ipoExists.IpoId,
                StartDate:new Date(),
                EndDate:new Date('2024-11-11'),
            })
            console.log(createTimeLine)
            await timeLineRepo.save(createTimeLine)

            return res.status(200).json({ipoExists})
        } catch (error) {
            console.error(error)
            return
        }
    }

    async updateTimeLineDate(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const {
                TimelineId,
                StartDate,
                EndDate,
                AllotmentDate,
                RefundDate,
                CreditDate,
                ListingDate
            } = req.body;
    
            if (!TimelineId) {
                return res.status(400).send('TimelineId is required');
            }
    
            // Create an object with only non-empty fields
            const fieldsToUpdate: Partial<TimeLine> = {};
            if (StartDate) fieldsToUpdate.StartDate = StartDate;
            if (EndDate) fieldsToUpdate.EndDate = EndDate;
            if (AllotmentDate) fieldsToUpdate.AllotmentDate = AllotmentDate;
            if (RefundDate) fieldsToUpdate.RefundDate = RefundDate;
            if (CreditDate) fieldsToUpdate.CreditShareDate = CreditDate;
            if (ListingDate) fieldsToUpdate.ListingDate = ListingDate;
    
            // Check if there are any fields to update
            if (Object.keys(fieldsToUpdate).length === 0) {
                console.log('No valid fields to update')
            }
    
            // Update the record in the database
            const connection = await dbUtils.getDefaultConnection();
            const timeLineRepo = connection.getRepository(TimeLine);
            await timeLineRepo.update(TimelineId, fieldsToUpdate);
    
            return;
        } catch (error) {
            console.error('Error updating timeline:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async prospectuscontroller(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const { IpoDetailId, DRHP, RHP , IpoId } = req.body
            
            const updateRHP =  await ipoRepo.update(IpoDetailId, {DRHPLink:DRHP, RHPLink:RHP});
            return res.redirect(`/ipoDetail/get/${IpoId}`);

        } catch (error) {
            console.error('Error updating timeline:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async uploadLogo(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(Ipo);
            const { IpoId } = req.body
            const logo = req.file?.filename
            const ipo:any =  await ipoRepo.update(IpoId, {CompanyLogo:logo});
            // const imageUrl = `${req.protocol}://${req.get('host')}/${logoPath}/${ipo.CompanyLogo}`;
            // console.log("================",imageUrl)
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async uploadBoa(req: Request, res: Response, next: NextFunction) {
        debugger
        try {

            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const { IpoId, IpoDetailId } = req.body;
    
            if (!req.file) {
                throw new Error("No file uploaded");
            }
    
            const boaLogo = req.file?.filename;
    
            if (!boaLogo) {
                throw new Error("File name is undefined");
            }
    
            const ipo = await ipoRepo.findOneBy({ IpoId });
    
            if (!ipo) {
                throw new Error(`IPO with ID ${IpoId} not found`);
            }
    
            await ipoRepo.createQueryBuilder()
                .update(IpoDetail)
                .set({ BasicOfAllotment: boaLogo })
                .where("IpoId = :IpoId", { IpoId })
                .execute();
    
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async uploadAnchorInvestor(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const { IpoId, IpoDetailId } = req.body;
    
            if (!req.file) {
                throw new Error("No file uploaded");
            }
    
            const anchorListLinkPdf = req.file?.filename;
    
            if (!anchorListLinkPdf) {
                throw new Error("File name is undefined");
            }
    
            const ipo = await ipoRepo.findOneBy({ IpoId });
    
            if (!ipo) {
                throw new Error(`IPO with ID ${IpoId} not found`);
            }
    
            await ipoRepo.createQueryBuilder()
                .update(IpoDetail)
                .set({ AnchorListLink: anchorListLinkPdf })
                .where("IpoId = :IpoId", { IpoId })
                .execute();
    
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async detailsController(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ipoRepo = connection.getRepository(IpoDetail);
            const { 
                minimumPrice,
                maximumPrice,
                lotSize,
                totalIssueShares,
                totalIssuePrice,
                freshIssueShares,
                freshIssuePrice,
                ofsIssueShares,
                shareHoldingPreIssue,
                shareHoldingPostIssue,
                ofsIssuePrice,
                FaceValue,
                IpoDetailId,
                IpoId
             } = req.body;


            const updateResult = await ipoRepo.update(IpoDetailId, {
                MinimumPrice:minimumPrice,
                MaximumPrice:maximumPrice,
                LotSize:lotSize,
                TotalIssueShares:totalIssueShares,
                TotalIssuePrice:totalIssuePrice,
                FreshIssueShares:freshIssueShares,
                FreshIssuePrice:freshIssuePrice,
                OfsIssueShares:ofsIssueShares,
                OfsIssuePrice:ofsIssuePrice,
                ShareHoldingPreIssue:shareHoldingPreIssue,
                ShareHoldingPostIssue:shareHoldingPostIssue,
                FaceValue:FaceValue
            });

            return res.redirect(`/ipoDetail/get/${IpoId}`);

        } catch (error) {
            console.error('Error updating IPO details:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async updateLotSize(req: Request, res: Response, next: NextFunction) {
        debugger
        const connection = await dbUtils.getDefaultConnection();
        const lotSizeRepo = connection.getRepository(LotSize);
        try {
            const {
                RetailMinLot,
                RetailMinShare,
                RetailMaxLot,
                RetailMaxShare,
                ShniMinLot,
                ShniMinShare,
                ShniMaxLot,
                ShniMaxShare,
                BhniMinLot,
                BhniMinShare,
                LotSizeId,
                IpoId
            } = req.body;

            console.log(req.body)
    
            // // Create an object with only non-empty fields
            // const fieldsToUpdate: Partial<LotSize> = {};
            // if (RetailMaxLot) fieldsToUpdate.RetailMaxLot = RetailMaxLot;
            // if (RetailMaxShare) fieldsToUpdate.RetailMaxShare = RetailMaxShare;
            // if (RetailMinShare) fieldsToUpdate.RetailMinShare = RetailMinShare;
            // if (RetailMinLot) fieldsToUpdate.RetailMinLot = RetailMinLot;
            // if (ShniMinLot) fieldsToUpdate.ShniMinLot = ShniMinLot;
            // if (ShniMinShare) fieldsToUpdate.ShniMinShare = ShniMinShare;
            // if (ShniMaxLot) fieldsToUpdate.ShniMaxLot = ShniMaxLot;
            // if (ShniMaxShare) fieldsToUpdate.ShniMaxShare = ShniMaxShare;
            // if (BhniMinLot) fieldsToUpdate.BhniMinLot = BhniMinLot;
            // if (BhniMinShare) fieldsToUpdate.BhniMinShare = BhniMinShare;
    
            // Check if there are any fields to update
            // if (Object.keys(fieldsToUpdate).length === 0) {
            //     console.log('No valid fields to update')
            // }
    
             await lotSizeRepo.update(LotSizeId, {
                RetailMinLot:RetailMinLot,
                RetailMinShare:RetailMinShare,
                RetailMaxLot:RetailMaxLot,
                RetailMaxShare:RetailMaxShare,
                ShniMinLot:ShniMinLot,
                ShniMinShare:ShniMinShare,
                ShniMaxLot:ShniMaxLot,
                ShniMaxShare:ShniMaxShare,
                BhniMinLot:BhniMinLot,
                BhniMinShare:BhniMinShare,
             });
    
             return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async updatePromoterHoldings(req: Request, res: Response, next: NextFunction) {
        debugger
        const connection = await dbUtils.getDefaultConnection();
        const promoterHoldingsRepo = connection.getRepository(PromoterHoldings);
        try {
            const {
                PromoterHoldingId,
                PreIssue,
                PostIssue,
                PromoterNames,
                IpoId
            } = req.body;
    
             await promoterHoldingsRepo.update(PromoterHoldingId, {
                PreIssue:PreIssue,
                PostIssue:PostIssue,
                PromoterNames:PromoterNames,
             });
    
             return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async updateRegistar(req: Request, res: Response, next: NextFunction) {
        debugger
        const connection = await dbUtils.getDefaultConnection();
        const promoterHoldingsRepo = connection.getRepository(IpoDetail);
        try {
            const {
                IpoDetailId,
                RegistrarEmail,
                IpoId
            } = req.body;
    
             await promoterHoldingsRepo.update(IpoDetailId, {
                RegistrarEmail:RegistrarEmail
             });
    
             return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async updateLeadManager(req: Request, res: Response, next: NextFunction) {
        debugger
        const connection = await dbUtils.getDefaultConnection();
        const leadManagerRepo = connection.getRepository(LeadManager);
        try {
            const {
                LeadManagerId,
                ManagerName,
                IpoId
            } = req.body;
    
             await leadManagerRepo.update(LeadManagerId, {
                ManagerName:ManagerName
             });
    
             return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating Lead ManagerName:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async updateIpoSubscription(req: Request, res: Response, next: NextFunction) {
        debugger
        const connection = await dbUtils.getDefaultConnection();
        const ipoSubscriptionRepo = connection.getRepository(IpoSubscription);
        try {
            const {
                IpoId,
                IpoSubscriptionId,
                RetailSubscription,
                NiiSubscription,
                BniiSubscription,
                SniiSubscription,
                QibSubscription,
                EmployeeSubscription,
                ShareHolderSubscription,
                RetailApplication,
                NiiApplication,
                QibApplication,
                EmployeeApplication,
                ShareHolderApplication,
                BniiApplication,
                SniiApplication,
            } = req.body;
    
             await ipoSubscriptionRepo.update(IpoSubscriptionId, {
                RetailSubscription: RetailSubscription,
                NiiSubscription: NiiSubscription,
                BniiSubscription: BniiSubscription,
                SniiSubscription: SniiSubscription,
                QibSubscription: QibSubscription,
                EmployeeSubscription: EmployeeSubscription,
                ShareHolderSubscription: ShareHolderSubscription,
                RetailApplication: RetailApplication,
                NiiApplication: NiiApplication,
                QibApplication: QibApplication,
                EmployeeApplication: EmployeeApplication,
                ShareHolderApplication: ShareHolderApplication,
                BniiApplication: BniiApplication,
                SniiApplication: SniiApplication,
             });

             return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating Ipo Subscription:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async hardIpoGmpDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const relationIpoLeadManagersRepo = connection.getRepository(IPOGMP);

            const { GmpId, IpoId} = req.body
            const deleted = await relationIpoLeadManagersRepo.delete(GmpId)
            
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error(error)
            return
        }
    }

    async hardRelationIpoLeadManagersDelete(req: Request, res: Response, next: NextFunction) {
        debugger
        try {
            const connection = await dbUtils.getDefaultConnection();
            const relationIpoLeadManagersRepo = connection.getRepository(LeadManager);

            const { LeadManagerId, IpoId} = req.body
            const deleted = await relationIpoLeadManagersRepo.delete(LeadManagerId)
            
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error(error)
            return
        }
    }
    
    async deleteMarketMaker(req: Request, res: Response, next: NextFunction) {
        debugger
        const connection = await dbUtils.getDefaultConnection();
        const marketMakerRepo = connection.getRepository(MarketMaker);
        try {
            const {
                MarketMakerId,
                IpoId
            } = req.body;

            console.log(req.body)
    
             await marketMakerRepo.delete(MarketMakerId)
    
             return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating Lead ManagerName:', error);
            return res.status(500).send('Internal server error');
        }
    }

    async updateNoReservetion(req: Request, res: Response, next: NextFunction) {
        debugger
        const connection = await dbUtils.getDefaultConnection();
        const noReservationRepo = connection.getRepository(NoReservations);
        const ipoRepo = connection.getRepository(Ipo)
        console.log(req.body)
        try {
            const {
                NiiSharesOffer,
                NoReservationId,
                QibSharesOffer,
                RetailSharesOffer,
                IpoId
            } = req.body;
    
            const ipoExists:any = await noReservationRepo.createQueryBuilder('noReservation')
            .where('noReservation.IpoId = :IpoId', { IpoId: IpoId })
            .getOne();
    
            if(!ipoExists) {
                const saveData:any = noReservationRepo.create({
                    IpoId:IpoId,
                    NiiSharesOffer:NiiSharesOffer,
                    QibSharesOffer:QibSharesOffer,
                    RetailSharesOffer:RetailSharesOffer
                })
                const saved = await noReservationRepo.save(saveData)
                console.log(saved)
                return res.redirect(`/ipoDetail/get/${IpoId}`);
            } else {
                const update = await noReservationRepo.update(NoReservationId, {
                    NiiSharesOffer:NiiSharesOffer,
                    QibSharesOffer:QibSharesOffer,
                    RetailSharesOffer:RetailSharesOffer
                 });        
                 console.log(update)
                 return res.redirect(`/ipoDetail/get/${IpoId}`);
            }
        } catch (error) {
            console.error('Error updating timeline:', error);
            return res.status(500).send('Internal server error');
        }
    }

}

export default new IpoDetailController();

//saurabhdantani09@gmail.com Saurabh@123