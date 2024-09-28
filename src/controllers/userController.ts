import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";

class IpoDetailController {

    // async getIpoDetail(req: Request, res: Response, next: NextFunction) {        
    //     debugger
    //     try {
    //         const id:any = req.params.id
    //         const connection = await dbUtils.getDefaultConnection();
    //         const ipoRepo = connection.getRepository(Ipo)
    //         const registarRepo = connection.getRepository(IpoDetail);
    //         const relationIpoLeadManagersRepo = connection.getRepository(RelationIpoLeadManagers);
    //         const relationIpoMarketMakersRepo = connection.getRepository(RelationIpoMarketMakers);

    //         const ipoDetailsQuery:any = await ipoRepo.createQueryBuilder('ipo')
    //         .leftJoinAndSelect('ipo.LotSizeId', 'LotSizeId')
    //         .leftJoinAndSelect('ipo.IpoDetail', 'IpoDetail')
    //         .leftJoinAndSelect('ipo.TimeLine', 'TimeLine')
    //         .leftJoinAndSelect('ipo.ValuationId','ValuationId')
    //         .leftJoinAndSelect('ipo.Reservation','Reservation')
    //         .leftJoinAndSelect('ipo.IpoSubscription','IpoSubscription')
    //         .leftJoinAndSelect('ipo.PromoterHoldings','PromoterHoldings')
    //         .leftJoinAndSelect('ipo.RelationIpoLeadManagers','RelationIpoLeadManagers')
    //         .leftJoinAndSelect('ipo.IPOGMPId','IPOGMPId')
    //         .leftJoinAndSelect('ipo.NoReservations','NoReservations')
    //         .where('ipo.IpoId = :IpoId', { IpoId: id })
    //         .orderBy('IPOGMPId.GmpId', 'DESC')
    //         .getOne();

    //         const findLeadManager = await relationIpoLeadManagersRepo.createQueryBuilder('lead')
    //               .leftJoinAndSelect("lead.LeadManagerId","LeadManagerId")
    //               .where('lead.IpoId = :IpoId', { IpoId: id })
    //               .getMany()

    //         const leadManagerData = findLeadManager

    //         const findMarketMaker = await relationIpoMarketMakersRepo.createQueryBuilder('market')
    //               .leftJoinAndSelect("market.MarketMakerId","MarketMakerId")
    //               .where('market.IpoId = :IpoId', { IpoId: id })
    //               .getMany()
            
    //         const marketMakerData = findMarketMaker        
    //         let registar = null
    //         if(ipoDetailsQuery?.IpoDetail !==null) {
    //             registar = await registarRepo.createQueryBuilder('details')
    //             .leftJoinAndSelect("details.RegistrarId","RegistrarId")
    //             .where('details.IpoDetailId = :IpoDetailId', { IpoDetailId: ipoDetailsQuery?.IpoDetail?.IpoDetailId })
    //             .getOne();
    //         }
    //         // console.log("===================> ipoDetailsQuery", ipoDetailsQuery?.NoReservations)
            
    //         const imageUrl = `/${logoPath}/${ipoDetailsQuery?.CompanyLogo}`
    //         const boaImage = `/${boaImagePath}/${ipoDetailsQuery?.IpoDetail?.BasicOfAllotment}`
    //         const anchorInvestorPdf = `/${anchorInvestor}/${ipoDetailsQuery?.IpoDetail?.AnchorListLink}`
            
    //         const ipoReservationTable = await getIpoReservation(id)

    //         let financialInformation = ipoDetailsQuery?.IpoDetail?.FinancialInformation || 'N/A';
    //         if (financialInformation !== 'N/A') {
    //             const $ = cheerio.load(financialInformation);
    //             $('table').addClass('table table-hover');
    //             financialInformation = $.html();
    //         } 
    //         const comapnyName = ipoDetailsQuery?.CompanyName
    //         const message = req.query.message;
            
    //         ipoDetailsQuery.isBeforeCutoffDate = global.isBeforeDate(ipoDetailsQuery?.TimeLine?.ListingDate);
    //         ipoDetailsQuery.isBeforeCutoffDate = global.isBeforeDate(ipoDetailsQuery?.TimeLine?.ListingDate);
            
    //         return res.render('ipoDetails/index',{
    //             comapnyName,
    //             ipoDetailsQuery,
    //             imageUrl,
    //             message,
    //             boaImage,
    //             anchorInvestorPdf, 
    //             financialInformation,
    //             ipoSubscriptionTable: ipoReservationTable,
    //             registar,
    //             leadManagerData,
    //             marketMakerData
    //         })
    //     } catch (error) {
    //         console.error(error)
    //         return
    //     }
    // }

}

export default new IpoDetailController();