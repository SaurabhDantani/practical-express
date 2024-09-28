import dbUtils from "../utils/db.utils";
import { Ipo } from "../models/Ipo";
import { IpoTypeEnum, TypeEnum } from "../utils/enumData";
import { ConstantsIpoSubscription } from "../utils/constant";

async function SubscriptionTimeCalculation(ShareOffered: any, ShareBid: any): Promise<number> {
    const ShareOfferedInt = parseInt(ShareOffered);
    const ShareBidInt = parseInt(ShareBid);
    const subscriptionTimeCal = ShareBidInt / ShareOfferedInt;
    return Number(subscriptionTimeCal.toFixed(2));
}

async function TotalAmountCroreCalculation(ShareBid: any, MaximumPrice: any): Promise<number> {
    const MaximumPriceInt = parseInt(MaximumPrice);
    const ShareBidInt = parseInt(ShareBid);
    const totalAmountCrore = (MaximumPriceInt * ShareBidInt) / 10000000; // CR
    return Number(totalAmountCrore.toFixed(2));
}


export async function getIpoReservation(id:any) {
    debugger
    try {
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo);
        
        const query: any = await ipoRepo.createQueryBuilder('ipo')
            .leftJoinAndSelect('ipo.Reservation', 'Reservation')
            .leftJoinAndSelect('ipo.IpoSubscription', 'IpoSubscription')
            .leftJoinAndSelect('ipo.IpoDetail', 'IpoDetail')
            .where('ipo.IpoId = :IpoId', { IpoId: id })
            .getOne();

        if (!query) {
            return console.log("IPO not found")
            // return res.status(404).json({ message: "IPO not found" });
        }

        // Helper function to create subscription view models
        const createSubscriptionViewModel = async (
            name: string,
            shareOffered: number,
            shareBid: number,
            maximumPrice: number
        ) => {
            const subscriptionTimes = await SubscriptionTimeCalculation(shareOffered, shareBid);
            const totalAmount = await TotalAmountCroreCalculation(shareBid, maximumPrice);
            return {
                Name: name,
                ShareOffered: shareOffered,
                ShareBid: shareBid,
                Subscriptiontimes: subscriptionTimes,
                TotalAmount: totalAmount
            };
        };

        const ipoDetails = query.IpoDetail;
        const ipoSubscriptions = query.IpoSubscription;
        const reservation = query.Reservation;

        const objectList: any[] = [];

        // Check Type and IpoType to create different view models
        if (query.Type === TypeEnum.Mainbord) {
            
            if (ipoDetails.IpoType === IpoTypeEnum.BOOK_BUILT_ISSUE) {
                if (reservation.AnchorInvestorSharesOffer) {
                    const anchor = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.ANCHOR,
                        reservation.AnchorInvestorSharesOffer,
                        reservation.AnchorInvestorSharesOffer,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(anchor);
                }
                if (reservation.QibSharesOffer) {
                    const qib = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.QIB,
                        reservation.QibSharesOffer,
                        ipoSubscriptions.QibSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(qib);
                }
                if (reservation.NiiSharesOffer) {
                    const nii = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.HNI,
                        reservation.NiiSharesOffer,
                        ipoSubscriptions.NiiSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(nii);
                }
                if (reservation.BniiSharesOffer) {
                    const bnii = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.B_HNI_10L,
                        reservation.BniiSharesOffer,
                        ipoSubscriptions.BniiSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(bnii);
                }
                if (reservation.SniiSharesOffer) {
                    const snii = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.S_HNI_10L,
                        reservation.SniiSharesOffer,
                        ipoSubscriptions.SniiSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(snii);
                }
                if (reservation.RetailSharesOffer) {
                    const retail = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.RETAIL,
                        reservation.RetailSharesOffer,
                        ipoSubscriptions.RetailSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(retail);
                }
                if (reservation.TotalSharesOffer) {
                    console.log(typeof(reservation.QibSharesOffer, reservation.NiiSharesOffer))
                    const total = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.TOTAL,
                        reservation.QibSharesOffer + reservation.NiiSharesOffer + reservation.RetailSharesOffer,
                        parseInt(ipoSubscriptions.QibSubscription) + parseInt(ipoSubscriptions.NiiSubscription) + parseInt(ipoSubscriptions.RetailSubscription),
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(total);
                }
            } else {
                if (reservation.NiiSharesOffer) {
                    const nii = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.HNI,
                        reservation.NiiSharesOffer,
                        ipoSubscriptions.NiiSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(nii);
                }
                if (reservation.RetailSharesOffer) {
                    const retail = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.RETAIL,
                        reservation.RetailSharesOffer,
                        ipoSubscriptions.RetailSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(retail);
                }
                if (reservation.TotalSharesOffer) {
                    console.log(typeof(reservation.QibSharesOffer, reservation.NiiSharesOffer))
                    const total = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.TOTAL,
                        reservation.NiiSharesOffer + reservation.RetailSharesOffer,
                        parseInt(ipoSubscriptions.NiiSubscription) + parseInt(ipoSubscriptions.RetailSubscription),
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(total);
                }
            }
        } else {
            
            if (ipoDetails.IpoType === IpoTypeEnum.BOOK_BUILT_ISSUE) {
                if (reservation.AnchorInvestorSharesOffer) {
                    const anchor = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.ANCHOR,
                        reservation.AnchorInvestorSharesOffer,
                        reservation.AnchorInvestorSharesOffer,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(anchor);
                }
                if (reservation.MarketMakersSharesOffer) {
                    const marketMaker = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.MARKET_MAKER,
                        reservation.MarketMakersSharesOffer,
                        reservation.MarketMakersSharesOffer,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(marketMaker);
                }
                if (reservation.QibSharesOffer) {
                    const qib = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.QIB,
                        reservation.QibSharesOffer,
                        ipoSubscriptions.QibSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(qib);
                }
                if (reservation.NiiSharesOffer) {
                    const nii = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.HNI,
                        reservation.NiiSharesOffer,
                        ipoSubscriptions.NiiSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(nii);
                }
                if (reservation.RetailSharesOffer) {
                    const retail = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.RETAIL,
                        reservation.RetailSharesOffer,
                        ipoSubscriptions.RetailSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(retail);
                }
                if (reservation.TotalSharesOffer) {
                    console.log(typeof(reservation.QibSharesOffer, reservation.NiiSharesOffer))
                    const total = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.TOTAL,
                        reservation.QibSharesOffer + reservation.NiiSharesOffer + reservation.RetailSharesOffer,
                        parseInt(ipoSubscriptions.QibSubscription) + parseInt(ipoSubscriptions.NiiSubscription) + parseInt(ipoSubscriptions.RetailSubscription),
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(total);
                }
            } else {
                if (reservation.MarketMakersSharesOffer) {
                    const marketMaker = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.MARKET_MAKER,
                        reservation.MarketMakersSharesOffer,
                        reservation.MarketMakersSharesOffer,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(marketMaker);
                }
                if (reservation.NiiSharesOffer) {
                    const nii = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.HNI,
                        reservation.NiiSharesOffer,
                        ipoSubscriptions.NiiSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(nii);
                }
                if (reservation.RetailSharesOffer) {
                    const retail = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.RETAIL,
                        reservation.RetailSharesOffer,
                        ipoSubscriptions.RetailSubscription,
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(retail);
                }
                if (reservation.TotalSharesOffer) {
                    const total = await createSubscriptionViewModel(
                        ConstantsIpoSubscription.TOTAL,
                        reservation.NiiSharesOffer + reservation.RetailSharesOffer,
                        parseInt(ipoSubscriptions.NiiSubscription) + parseInt(ipoSubscriptions.RetailSubscription),
                        ipoDetails.MaximumPrice
                    );
                    objectList.push(total);
                }
            }
        }
        console.log(objectList.length)
        return objectList

    } catch (error) {
        console.error('Error fetching IPO subscriptions:', error.message);
    }
}
