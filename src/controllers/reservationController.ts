import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Reservation } from "../models/Reservation";

class ReservationController {

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const connection = await dbUtils.getDefaultConnection();
            const ReservationRepo = connection.getRepository(Reservation);
            const {
                IpoId,
                ReservationId,
                AnchorInvestorSharesOffer,
                QibSharesOffer,
                NiiSharesOffer,
                BniiSharesOffer,
                SniiSharesOffer,
                RetailSharesOffer,
                TotalSharesOffer,
                MarketMakersSharesOffer,
                BniiMaximumAllotment,
                SniiMaximumAllotment,
                RetailMaximumAllotment,
                NiiMaximumAllotment
            } = req.body;
    
            const update = await ReservationRepo.update(ReservationId, {
                AnchorInvestorSharesOffer:AnchorInvestorSharesOffer,
                QibSharesOffer:QibSharesOffer,
                NiiSharesOffer:NiiSharesOffer,
                BniiSharesOffer:BniiSharesOffer,
                SniiSharesOffer:SniiSharesOffer,
                RetailSharesOffer:RetailSharesOffer,
                TotalSharesOffer:TotalSharesOffer,
                MarketMakersSharesOffer:MarketMakersSharesOffer,
                BniiMaximumAllotment:BniiMaximumAllotment,
                SniiMaximumAllotment:SniiMaximumAllotment,
                RetailMaximumAllotment:RetailMaximumAllotment,
                NiiMaximumAllotment:NiiMaximumAllotment
            });
    
            console.log(update)
            return res.redirect(`/ipoDetail/get/${IpoId}`);
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }
}

export default new ReservationController()