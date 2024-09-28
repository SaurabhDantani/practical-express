import global from "../utils/global";
import dbUtils from "../utils/db.utils";
import { IpoDetail } from "../models/IPODetail";
import { PromoterHoldings } from "../models/PromoterHolding";
import { Ipo } from "../models/Ipo";
import { Reservation } from "../models/Reservation";
import { LeadManager } from "../models/LeadManager";
import { MarketMaker } from "../models/MarketMaker";
import moment from 'moment';
import { IpoTypeEnum, TypeEnum } from "../utils/enumData";
import { constants } from "./constants";
import { Request, Response } from 'express';
// lot size start
export async function LotSizeInsertUpdate(
  IpoId: number,
  RetailMinLot: number,
  RetailMinShare: number,
  RetailMaxLot: number,
  RetailMaxShare: number,
  ShniMinLot: number,
  ShniMinShare: number,
  ShniMaxLot: number,
  ShniMaxShare: number,
  BhniMinLot: number,
  BhniMinShare: number,
  req?: Request,
  res?: Response
) {
  ;
  RetailMinLot = global.commaZeroCheck(RetailMinLot);
  RetailMinShare = global.commaZeroCheck(RetailMinShare);
  RetailMaxLot = global.commaZeroCheck(RetailMaxLot);
  RetailMaxShare = global.commaZeroCheck(RetailMaxShare);
  ShniMinLot = global.commaZeroCheck(ShniMinLot);
  ShniMinShare = global.commaZeroCheck(ShniMinShare);
  ShniMaxLot = global.commaZeroCheck(ShniMaxLot);
  ShniMaxShare = global.commaZeroCheck(ShniMaxShare);
  BhniMinLot = global.commaZeroCheck(BhniMinLot);
  BhniMinShare = global.commaZeroCheck(BhniMinShare);

  var sql = "SELECT * FROM LotSizes WHERE IpoId=" + IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql);
  try {
    if (result.length > 0) {
      await LotSizeUpdateData(
        IpoId,
        RetailMinLot,
        RetailMinShare,
        RetailMaxLot,
        RetailMaxShare,
        ShniMinLot,
        ShniMinShare,
        ShniMaxLot,
        ShniMaxShare,
        BhniMinLot,
        BhniMinShare
      );
    } else {
      console.log("Row was not found :( !");
      await LotSizeInsertData(
        IpoId,
        RetailMinLot,
        RetailMinShare,
        RetailMaxLot,
        RetailMaxShare,
        ShniMinLot,
        ShniMinShare,
        ShniMaxLot,
        ShniMaxShare,
        BhniMinLot,
        BhniMinShare
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function LotSizeInsertData(
  IpoId: number,
  RetailMinLot: number,
  RetailMinShare: number,
  RetailMaxLot: number,
  RetailMaxShare: number,
  ShniMinLot: number,
  ShniMinShare: number,
  ShniMaxLot: number,
  ShniMaxShare: number,
  BhniMinLot: number,
  BhniMinShare: number
) {
  ;
  const connection = await dbUtils.getDefaultConnection();
  if (RetailMinLot == 0) return;
  if (RetailMinLot == null) return;

  var sql =
    "INSERT INTO LotSizes (IpoId, RetailMinLot, RetailMinShare, RetailMaxLot, RetailMaxShare, ShniMinLot, ShniMinShare, ShniMaxLot, ShniMaxShare, BhniMinLot, BhniMinShare) VALUES (" +
    IpoId +
    ", " +
    RetailMinLot +
    ", " +
    RetailMinShare +
    ", " +
    RetailMaxLot +
    ", " +
    RetailMaxShare +
    ", " +
    ShniMinLot +
    ", " +
    ShniMinShare +
    ", " +
    ShniMaxLot +
    ", " +
    ShniMaxShare +
    ", " +
    BhniMinLot +
    ", " +
    BhniMinShare +
    ")";
  try {
    const result = await connection.query(sql);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

export async function LotSizeUpdateData(
  IpoId: number,
  RetailMinLot: number,
  RetailMinShare: number,
  RetailMaxLot: number,
  RetailMaxShare: number,
  ShniMinLot: number,
  ShniMinShare: number,
  ShniMaxLot: number,
  ShniMaxShare: number,
  BhniMinLot: number,
  BhniMinShare: number,
): Promise<{ success: boolean; message: string }> {
  if (RetailMinLot === 0 || RetailMinLot === null) return { success: false, message: "Invalid lot size" };

  const records = [
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
    IpoId,
  ];
  debugger
  const sql = `
        UPDATE LotSizes 
        SET RetailMinLot = ${RetailMinLot}, RetailMinShare = ${RetailMinShare}, RetailMaxLot = ${RetailMaxLot}, RetailMaxShare = ${RetailMaxShare},
            ShniMinLot = ${ShniMinLot}, ShniMinShare = ${ShniMinShare}, ShniMaxLot = ${ShniMaxLot}, ShniMaxShare = ${ShniMaxShare},
            BhniMinLot = ${BhniMinLot}, BhniMinShare = ${BhniMinShare} 
            WHERE IpoId = ${IpoId}`;

  const connection = await dbUtils.getDefaultConnection();
  try {
    const result = await connection.query(sql, records);
    console.log("update successfully sp", result);
    return { success: true, message: 'Lot Size data updated successfully!' };
  } catch (error) {
    console.error("Error updating LotSizes:", error);
    return { success: false, message: 'Failed to update Lot Size data.' };
  }
}
// lot size end

// ipo Details start
export async function DetailsInsertUpdate(
  IpoId: number,
  IpoType: number,
  FaceValue: number,
  MinimumPrice: number,
  MaximumPrice: number,
  LotSize: number,
  ShareHoldingPreIssue: number,
  ShareHoldingPostIssue: number,
  TotalIssueShares: number,
  TotalIssuePrice: string,
  FreshIssueShares: number,
  FreshIssuePrice: string,
  OfsIssueShares: number,
  OfsIssuePrice: any
) {
  ;
  // if (detail_data.toString().trim() == "") return;
  const connection = await dbUtils.getDefaultConnection();
  var sql = "SELECT * FROM IpoDetails WHERE IpoId=" + IpoId;
  const result = await connection.query(sql);

  try {
    if (result.length > 0) {
      console.log("Row was found!");
     const updateResult = DetailsUpdateData(
        IpoId,
        IpoType,
        FaceValue,
        MinimumPrice,
        MaximumPrice,
        LotSize,
        ShareHoldingPreIssue,
        ShareHoldingPostIssue,
        TotalIssueShares,
        TotalIssuePrice,
        FreshIssueShares,
        FreshIssuePrice,
        OfsIssueShares,
        OfsIssuePrice
      );
      return { status: 'updated', updateResult };
    } else {
      console.log("Row was not found :( !");
      const insertResult = DetailsInsertData(
        IpoId,
        IpoType,
        FaceValue,
        MinimumPrice,
        MaximumPrice,
        LotSize,
        ShareHoldingPreIssue,
        ShareHoldingPostIssue,
        TotalIssueShares,
        TotalIssuePrice,
        FreshIssueShares,
        FreshIssuePrice,
        OfsIssueShares,
        OfsIssuePrice
      );

      return { status: 'inserted', insertResult };
    }
  } catch (error) {
    console.log(error)
    return {status:'Database error'}
  }
}

async function DetailsInsertData(
  IpoId: number,
  IpoType: number,
  FaceValue: number,
  MinimumPrice: number,
  MaximumPrice: number,
  LotSize: number,
  ShareHoldingPreIssue: number,
  ShareHoldingPostIssue: number,
  TotalIssueShares: number,
  TotalIssuePrice: any,
  FreshIssueShares: number,
  FreshIssuePrice: any,
  OfsIssueShares: number,
  OfsIssuePrice: number
) {
  ;
  try {
    const connection = await dbUtils.getDefaultConnection();
    var sql = `INSERT INTO IpoDetails (
        IpoId, IpoType, FaceValue, MinimumPrice, MaximumPrice, LotSize, 
        ShareHoldingPreIssue, ShareHoldingPostIssue, TotalIssueShares, 
        TotalIssuePrice, FreshIssueShares, FreshIssuePrice, 
        OfsIssueShares, OfsIssuePrice
      ) VALUES (
        ${IpoId}, ${IpoType}, ${FaceValue}, ${MinimumPrice}, ${MaximumPrice}, ${LotSize}, 
        ${ShareHoldingPreIssue}, ${ShareHoldingPostIssue}, ${TotalIssueShares}, 
        '${TotalIssuePrice}', ${FreshIssueShares}, '${FreshIssuePrice}', 
        ${OfsIssueShares}, '${OfsIssuePrice}'
      )`;

    const result = await connection.query(sql);
    console.log("Insert successful:", result);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}
async function DetailsUpdateData(
  IpoId: number,
  IpoType: number,
  FaceValue: number,
  MinimumPrice: number,
  MaximumPrice: number,
  LotSize: number,
  ShareHoldingPreIssue: number,
  ShareHoldingPostIssue: number,
  TotalIssueShares: number,
  TotalIssuePrice: string,
  FreshIssueShares: number,
  FreshIssuePrice: string,
  OfsIssueShares: number,
  OfsIssuePrice: string
) {
  ;
  try {
    const connection = await dbUtils.getDefaultConnection();
    const ipoDetailsRepo = connection.getRepository(IpoDetail);
    // debugger
    const update = await ipoDetailsRepo
      .createQueryBuilder()
      .update(IpoDetail)
      .set({
        IpoType: IpoType,
        FaceValue: FaceValue,
        MinimumPrice: MinimumPrice,
        MaximumPrice: MaximumPrice,
        LotSize: LotSize,
        ShareHoldingPreIssue: ShareHoldingPreIssue,
        ShareHoldingPostIssue: ShareHoldingPostIssue,
        TotalIssueShares: TotalIssueShares,
        TotalIssuePrice: TotalIssuePrice,
        FreshIssueShares: FreshIssueShares,
        FreshIssuePrice: FreshIssuePrice,
        OfsIssueShares: OfsIssueShares,
        OfsIssuePrice: OfsIssuePrice,
      })
      .where("IpoId = :IpoId", { IpoId: IpoId })
      .execute();
    // console.log("IpoDetail update ------------>", update)
  } catch (err) {
    return console.error(err);
  }
}
// ipo Details end //

// ipo time line start //
export async function TimeLineInsertUpdate(
  IpoId: number,
  StartDate: string,
  EndDate: string,
  AllotmentDate: string,
  RefundDate: string,
  CreditShareDate: string,
  ListingDate: string
) {
  ;
  var sql = "SELECT * FROM TimeLines WHERE IpoId=" + IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql);
  try {
    if (result.length > 0) {
      await TimeLineUpdateData(
        IpoId,
        StartDate,
        EndDate,
        AllotmentDate,
        RefundDate,
        CreditShareDate,
        ListingDate
      );
    } else {
      console.log("Row was not found :( !)");
      await TimeLineInsertData(
        IpoId,
        StartDate,
        EndDate,
        AllotmentDate,
        RefundDate,
        CreditShareDate,
        ListingDate
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function TimeLineUpdateData(
  IpoId: number,
  StartDate: string,
  EndDate: string,
  AllotmentDate: string,
  RefundDate: string,
  CreditShareDate: string,
  ListingDate: string
) {
  ;
  if (StartDate == "") return;
  if (StartDate == null) return;
  const sql = `
  UPDATE TimeLines
  SET 
    StartDate = '${StartDate}', 
    EndDate = '${EndDate}', 
    AllotmentDate = '${AllotmentDate}', 
    RefundDate = '${RefundDate}', 
    CreditShareDate = '${CreditShareDate}', 
    ListingDate = '${ListingDate}'
  WHERE IpoId = ${IpoId}
`;

  const connection = await dbUtils.getDefaultConnection();
  try {
    const result = await connection.query(sql);
    console.log("update successfully sp", result);
  } catch (error) {
    console.error("Error updating timeLine:", error);
  }
}

async function TimeLineInsertData(
  IpoId: number,
  StartDate: string,
  EndDate: string,
  AllotmentDate: string,
  RefundDate: string,
  CreditShareDate: string,
  ListingDate: string
) {
  ;
  const connection = await dbUtils.getDefaultConnection();
  if (StartDate == "") return;
  if (StartDate == null) return;
  var sql = `INSERT INTO TimeLines (IpoId,StartDate,EndDate,AllotmentDate,RefundDate,CreditShareDate,ListingDate) VALUES ('${IpoId}', '${StartDate}', '${EndDate}', '${AllotmentDate}', '${RefundDate}', '${CreditShareDate}', '${ListingDate}')`;
  try {
    const result = await connection.query(sql);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

// ipo time line end //

// ipo valuation start //
export async function ValuationInsertUpdate(IpoId: number, values: any) {
  ;
  const connection = await dbUtils.getDefaultConnection();
  var sql = "SELECT * FROM Valuations WHERE IpoId=" + IpoId;
  const result = await connection.query(sql);

  try {
    if (result.length > 0) {
      console.log("Row was found!");
    } else {
      console.log("Row was not found :( !");
      InsertValuations(values);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function InsertValuations(values: any) {
  ;
  try {
    const connection = await dbUtils.getDefaultConnection();

    for (const [IpoId, StrKey, StrValue] of values) {
      const sql = `
          INSERT INTO Valuations (IpoId, StrKey, StrValue)
          VALUES (${IpoId}, '${StrKey}', '${StrValue}')
        `;
      await connection.query(sql);
    }
  } catch (error) {
    console.log(error);
  }
}
// ipo valuation end //

// ipo detailFinancialInfo start //
export async function DetailFinancialInfoInsertUpdate(
  IpoId: number,
  finacial_data: string
) {
  ;
  if (finacial_data.toString().trim() == "") return;

  var sql = "SELECT * FROM IpoDetails WHERE IpoId=" + IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql);

  try {
    if (result && result.length > 0) {
      console.log("Row was found!");
      DetailFinancialInfoUpdateData(IpoId, finacial_data.toString().trim());
    } else {
      console.log("Row was not found :( !");
      DetailFinancialInfoInsertData(IpoId, finacial_data.toString().trim());
    }
  } catch (error) {
    console.log(error);
  }
}
async function DetailFinancialInfoInsertData(
  IpoId: number,
  finacial_data: string
) {
  ;
  try {
    var sql =
      "INSERT INTO IpoDetails (IpoId, FinancialInformation) VALUES (" +
      IpoId +
      ', "' +
      finacial_data +
      '")';
    const connection = await dbUtils.getDefaultConnection();
    await connection.query(sql);
  } catch (error) {
    console.log(error);
  }
}
async function DetailFinancialInfoUpdateData(
  IpoId: number,
  finacial_data: string
) {
  ;
  try {
    const connection = await dbUtils.getDefaultConnection();
    const ipoDetailsRepo = connection.getRepository(IpoDetail);
    const update = await ipoDetailsRepo
      .createQueryBuilder()
      .update(IpoDetail)
      .set({
        FinancialInformation: finacial_data,
      })
      .where("IpoId = :IpoId", { IpoId: IpoId })
      .execute();

    console.log(update);
  } catch (error) {
    console.log(error);
  }
} 
// ipo detailFinancialInfo end //

// ipo detailObjectives start //
export async function DetailObjectivesInsertUpdate(
  IpoId: number,
  objective_data: any
) {
  if (objective_data.toString().trim() == "") return;

  var sql = "SELECT * FROM IpoDetails WHERE IpoId=" + IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql);

  try {
    if (result && result.length > 0) {
      console.log("Row was found!");
      DetailObjectivesUpdateData(IpoId, objective_data);
    } else {
      console.log("Row was not found :( !");
      DetailObjectivesInsertData(IpoId, objective_data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function DetailObjectivesInsertData(IpoId: number, objective_data: any) {
  try {
    var sql =
      "INSERT INTO IpoDetails (IpoId, objectives) VALUES (" +
      IpoId +
      ', "' +
      objective_data +
      '")';
    const connection = await dbUtils.getDefaultConnection();
    const objectivesRepo = await connection.getRepository(IpoDetail);
    // const saveIpo = objectivesRepo.create({
    //   IpoId:{IpoId:IpoId},
    //   Objectives:objective_data
    // })

    // const saved = await objectivesRepo.save(saveIpo)
    const result = await connection.query(sql);
    // console.log("check this from objectives ==============", result);
  } catch (error) {
    console.log(error);
  }
}

async function DetailObjectivesUpdateData(IpoId: number, objective_data: any) {
  try {
  
    const connection = await dbUtils.getDefaultConnection();
    const ipoDetailsRepo = connection.getRepository(IpoDetail)
    try {
      //   if (objective_data.length > 1000) {
      //     objective_data = objective_data.substring(0, 1000);
      // }
      const result = await ipoDetailsRepo.createQueryBuilder('ipo')
                    .update(IpoDetail)
                    .set({Objectives:objective_data})
                    .where("IpoId = :IpoId", { IpoId })
                    .execute();
    } catch (error) {
      console.error("Error updating timeLine:", error);
    }

  } catch (error) {
    console.log(error);
  }
}

// ipo detailObjectives end //

// ipo promotorHoldingInsertUpdate start //
export async function PromotorHoldingInsertUpdate(
  IpoId: number,
  pre_issue: any,
  post_issue: any
) {
  var sql = "SELECT * FROM PromoterHoldings WHERE IpoId=" + IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql);

  if (result && result.length > 0) {
    console.log("Row was found!");
    PromotorHoldingUpdateData(IpoId, pre_issue, post_issue);
  } else {
    console.log("Row was not found :( !");
    PromotorHoldingInsertData(IpoId, pre_issue, post_issue);
  }
}

async function PromotorHoldingInsertData(
  IpoId: any,
  PreIssue: any,
  PostIssue: any
) {
  ;
  try {
    const connection = await dbUtils.getDefaultConnection();
    const repo = connection.getRepository(PromoterHoldings);
  var sql = `INSERT INTO PromoterHoldings 
                         (IpoId,PreIssue,PostIssue) 
                          VALUES ('${IpoId}', '${PreIssue}', '${PostIssue}')`;
  const result = await connection.query(sql);

  } catch (error) {
    console.log(error);
  }
}

async function PromotorHoldingUpdateData(
  IpoId: number,
  pre_issue: any,
  post_issue: any
) {
  try {
    const connection = await dbUtils.getDefaultConnection();
    var sql = `UPDATE PromoterHoldings
                SET
                PreIssue = '${pre_issue}',
                PostIssue = '${post_issue}'
                WHERE IpoId = '${IpoId}'`;
    const result = await connection.query(sql);
  } catch (error) {
    console.log(error);
  }
}
// ipo ReservationInsertUpdate start //

// ipo shareOfferedInsertUpdate start //

export interface ShareOfferedEnumDataFields {
  IpoId: number;
  AnchorInvestorSharesOffer: number;
  MarketMakersSharesOffer: any;
  RetailSharesOffer: number;
  NiiSharesOffer: number;
  BniiSharesOffer: number;
  SniiSharesOffer: number;
  QibSharesOffer: number;
  EmployeeSharesOffer: number;
  ShareHolderSharesOffer: number;
  TotalSharesOffer: number;
  BniiMaximumAllotment: number;
  SniiMaximumAllotment: number;
  RetailMaximumAllotment: number;
  NiiMaximumAllotment:number;
}
export async function ReservationInsertUpdate(
  fields: ShareOfferedEnumDataFields
) {
  
  fields.AnchorInvestorSharesOffer = global.commaZeroCheck(
    fields.AnchorInvestorSharesOffer
  );
  fields.MarketMakersSharesOffer = global.commaZeroCheck(
    fields.MarketMakersSharesOffer
  );
  fields.RetailSharesOffer = global.commaZeroCheck(fields.RetailSharesOffer);
  fields.NiiSharesOffer = global.commaZeroCheck(fields.NiiSharesOffer);
  fields.BniiSharesOffer = global.commaZeroCheck(fields.BniiSharesOffer);
  fields.SniiSharesOffer = global.commaZeroCheck(fields.SniiSharesOffer);
  fields.QibSharesOffer = global.commaZeroCheck(fields.QibSharesOffer);
  fields.EmployeeSharesOffer = global.commaZeroCheck(
    fields.EmployeeSharesOffer
  );
  fields.ShareHolderSharesOffer = global.commaZeroCheck(
    fields.ShareHolderSharesOffer
  );
  fields.TotalSharesOffer = global.commaZeroCheck(fields.TotalSharesOffer);
  fields.BniiMaximumAllotment = global.commaZeroCheck(
    fields.BniiMaximumAllotment
  );
  fields.SniiMaximumAllotment = global.commaZeroCheck(
    fields.SniiMaximumAllotment
  );
  fields.RetailMaximumAllotment = global.commaZeroCheck(
    fields.RetailMaximumAllotment
  );

  fields.NiiMaximumAllotment = global.commaZeroCheck(
    fields.NiiMaximumAllotment
  );

  var sql = "SELECT * FROM Reservations WHERE IpoId=" + fields.IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql);

  try {
    // const existingShare = await shareOfferedRepository.findOne({ IpoId: fields.IpoId });

    if (result && result.length > 0) {
      await ReservationUpdateData(fields);
    } else {
      await ReservationInsertData(fields);
    }
  } catch (error) {
    console.error("Database error: ", error);
  }
}

async function ReservationInsertData(fields: ShareOfferedEnumDataFields) {
  try {
    if (fields.RetailSharesOffer === 0 || fields.RetailSharesOffer === null)
      return;
    const connection = await dbUtils.getDefaultConnection();

    var sql = `INSERT INTO Reservations 
             (
              IpoId,
              AnchorInvestorSharesOffer,
              MarketMakersSharesOffer,
              RetailSharesOffer,
              NiiSharesOffer,
              BniiSharesOffer,
              SniiSharesOffer,
              QibSharesOffer,
              EmployeeSharesOffer,
              ShareHolderSharesOffer,
              TotalSharesOffer,
              BniiMaximumAllotment,
              SniiMaximumAllotment,
              RetailMaximumAllotment,
              NiiMaximumAllotment		
              ) 
             VALUES (
                    ${fields.IpoId}, 
                    ${fields.AnchorInvestorSharesOffer}, 
                    ${fields.MarketMakersSharesOffer}, 
                    ${fields.RetailSharesOffer}, 
                    ${fields.NiiSharesOffer}, 
                    ${fields.BniiSharesOffer}, 
                    ${fields.SniiSharesOffer},
                    ${fields.QibSharesOffer},
                    ${fields.EmployeeSharesOffer},
                    ${fields.ShareHolderSharesOffer},
                    ${fields.TotalSharesOffer},
                    ${fields.BniiMaximumAllotment},
                    ${fields.SniiMaximumAllotment},
                    ${fields.RetailMaximumAllotment},
                    ${fields.NiiMaximumAllotment}
                    )`;
    const result = await connection.query(sql);
  } catch (error) {
    console.error("Error inserting data: ", error);
  }
}

async function ReservationUpdateData(fields: ShareOfferedEnumDataFields) {
  if (fields.RetailSharesOffer === 0 || fields.RetailSharesOffer === null) return;
  const connection = await dbUtils.getDefaultConnection();
  const reservationRepository = connection.getRepository(Reservation);

  
  try {
    const sql = `
    UPDATE Reservations
    SET 
      AnchorInvestorSharesOffer = ${fields.AnchorInvestorSharesOffer}, 
      MarketMakersSharesOffer = ${fields.MarketMakersSharesOffer}, 
      RetailSharesOffer = ${fields.RetailSharesOffer}, 
      NiiSharesOffer = ${fields.NiiSharesOffer}, 
      BniiSharesOffer = ${fields.BniiSharesOffer},
      SniiSharesOffer = ${fields.SniiSharesOffer},
      QibSharesOffer = ${fields.QibSharesOffer},
      EmployeeSharesOffer = ${fields.EmployeeSharesOffer},
      ShareHolderSharesOffer = ${fields.ShareHolderSharesOffer},
      TotalSharesOffer = ${fields.TotalSharesOffer},
      BniiMaximumAllotment = ${fields.BniiMaximumAllotment},
      SniiMaximumAllotment = ${fields.SniiMaximumAllotment},
      RetailMaximumAllotment = ${fields.RetailMaximumAllotment},
      NiiMaximumAllotment = ${fields.NiiMaximumAllotment}
    WHERE IpoId = ${fields.IpoId}  `;

  const result = connection.query(sql)
  //  const update =  await reservationRepository.update(
  //     fields.IpoId, {
  //     AnchorInvestorSharesOffer:fields.AnchorInvestorSharesOffer,
  //     MarketMakersSharesOffer:fields.MarketMakersSharesOffer,
  //     RetailSharesOffer: fields.RetailSharesOffer,
  //     NiiSharesOffer: fields.NiiSharesOffer,
  //     BniiSharesOffer: fields.BniiSharesOffer,
  //     SniiSharesOffer: fields.SniiSharesOffer,
  //     QibSharesOffer: fields.QibSharesOffer,
  //     EmployeeSharesOffer: fields.EmployeeSharesOffer,
  //     ShareHolderSharesOffer: fields.ShareHolderSharesOffer,
  //     TotalSharesOffer: fields.TotalSharesOffer,
  //     BniiMaximumAllotment: fields.BniiMaximumAllotment,
  //     SniiMaximumAllotment: fields.SniiMaximumAllotment,
  //     RetailMaximumAllotment: fields.RetailMaximumAllotment,
  //     NiiMaximumAllotment:fields.NiiMaximumAllotment
  //   });
  
    console.log(result)
  } catch (error) {
    console.error('Error updating data: ', error);
  }
}
// ipo ReservationInsertUpdate end //


// ipo CompanyAddressInsertUpdate start //
export async function CompanyAddressInsertUpdate(IpoId:number, address_data:any){

  if (address_data.toString().trim() == "") return;

  var sql = "SELECT * FROM IpoDetails WHERE IpoId="+IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql);
  if (result && result.length > 0 ) {
    console.log('Row was found!');
    CompanyAddressUpdateData(IpoId, address_data);
} else {
    console.log('Row was not found :( !');
    CompanyAddressInsertData(IpoId, address_data);
}
}

async function CompanyAddressInsertData(IpoId:number, address_data:any)
{
  try {
    var sql = 'INSERT INTO IpoDetails (IpoId, CompanyAddress) VALUES ('+IpoId+', "'+address_data+'")';  
    const connection = await dbUtils.getDefaultConnection();
    connection.query(sql)
  } catch (error) {
    console.log(error)
  }
}

async function CompanyAddressUpdateData(IpoId:number, address_data:any)
{
  try {
    var sql = `UPDATE IpoDetails 
    SET 
     CompanyAddress = '${address_data}'
     WHERE IpoId = ${IpoId}`;  
  const connection = await dbUtils.getDefaultConnection();
  connection.query(sql) 
  } catch (error) {
    console.log(error)
  }
}
// ipo CompanyAddressInsertUpdate end //

// ipo checkRegistrarData start //
export async function checkRegistrarData(IpoId:number, registerName:any)
{
  
    var sql = "SELECT * FROM Registrars WHERE RegistrarName LIKE '%"+registerName+"%'";
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)
    try {
      if (result && result.length > 0 ) {
        console.log('Row was found!');
        updateRegistrarData(IpoId, result[0].RegistrarId, result[0].RegistrarIpoEmail);
    } else {
        console.log('Row was not found :( !');
    }
    console.log(result)
    } catch (error) {
      console.log(error)
    }
}

async function updateRegistrarData(IpoId:number, registrarId:any,RegistrarIpoEmail:any)
{
  
  try {
    var sql = ""
    if(RegistrarIpoEmail == null ) {
      sql = `UPDATE IpoDetails 
      SET RegistrarId = ${registrarId}      
      WHERE IpoId = ${IpoId}`;
      
    } else {
      sql = `UPDATE IpoDetails 
                  SET RegistrarId = ${registrarId},
                  RegistrarEmail = '${RegistrarIpoEmail}'
                  WHERE IpoId = ${IpoId}`;
    }
                
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)
  } catch (error) {
    console.log(error)
  }
}
// ipo checkRegistrarData end //

// ipo checkLeadManagerData start //

export async function checkLeadManagerData(IpoId:number, leadManagerName:any)
{
    var sql = "SELECT * FROM LeadManagers WHERE ManagerName LIKE '%"+leadManagerName+"%'";
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)

    try {
          if (result && result.length > 0 ) {
              console.log('Row was found!');
              insertRelationIpoLeadManagersData(IpoId, result[0].LeadManagerId);
          } 
          else {
              console.log('Row was not found :( !');
              insertLeadManagersData(IpoId, leadManagerName)
          }
    } catch (error) {
      console.log(error)
    }
}

export async function deleteRelationIpoLeadManagersData(IpoId:number)
{
    var sql = `DELETE From RelationIpoLeadManagers
               WHERE IpoId = ${IpoId} `;
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)
}

async function insertRelationIpoLeadManagersData(IpoId:number, leadManagerId:number)
{
    var sql = `INSERT INTO RelationIpoLeadManagers 
               (LeadManagerId , IpoId) VALUES (${leadManagerId}, ${IpoId})`;
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)
}

async function insertLeadManagersData(IpoId:number,managerName:any)
{
  debugger
  try {
    const connection = await dbUtils.getDefaultConnection();
    const repo = connection.getRepository(LeadManager)
    const save = repo.create({
      ManagerName:managerName
    })
    const data = await repo.save(save)

    if(data) {
      insertRelationIpoLeadManagersData(IpoId, data.LeadManagerId);
    }
  } catch (error) {
    console.log(error)
  }
}

// ipo checkLeadManagerData end //

// ipo checkMarketMakerData start //
export async function deleteRelationIpoMarketMakersData(IpoId:number)
{
    var sql = `DELETE From RelationIpoMarketMakers
               WHERE IpoId = ${IpoId} `;
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)
}

export async function checkMarketMakerData(IpoId:number, marketMakerName:any)
{
    var sql = "SELECT * FROM MarketMakers WHERE MarketMakerName LIKE '%"+marketMakerName+"%'";
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)

    try {
          if (result && result.length > 0 ) {
              console.log('Row was found!');
              insertRelationIpoMarketMakersData(IpoId, result[0].MarketMakerId);
          } 
          else {
              console.log('Row was not found :( ! )');
              insertMarketMakersData(IpoId,marketMakerName)
          }
    } catch (error) {
      console.log(error)
    }
}

async function insertRelationIpoMarketMakersData(IpoId:number, marketMakerId:number)
{
    var sql = `INSERT INTO RelationIpoMarketMakers 
               (MarketMakerId , IpoId) VALUES (${marketMakerId}, ${IpoId})`;
    const connection = await dbUtils.getDefaultConnection();
    const result = await connection.query(sql)
}

async function insertMarketMakersData(IpoId:number,marketMakerName:any)
{
  debugger
  try {
    const connection = await dbUtils.getDefaultConnection();
    const repo = connection.getRepository(MarketMaker)
    const save = repo.create({
      MarketMakerName:marketMakerName
    })
    const data = await repo.save(save)

    if(data) {
      insertRelationIpoMarketMakersData(IpoId, data.MarketMakerId);
    }
  } catch (error) {
    console.log(error)
  }
}
// ipo checkMarketMakerData end //

// ipo gmpInsertUpdate start //
export async function gmpInsertUpdate(IpoId:number, GMPPrice:any, Sub2SaudaRate:any, LastUpdate:any, GMPDate:any){
  if (LastUpdate.trim() == "") return;
  var sql = `SELECT * FROM IPOGMPs WHERE IpoId = ${IpoId} AND GMPDate = '${GMPDate}'`
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql)

    if (result && result.length > 0 ) {
      console.log('Row was found!');
      gmpUpdateData(IpoId, GMPPrice, Sub2SaudaRate, LastUpdate, GMPDate);
  } else {
      console.log('Row was not found :( ! )');
      gmpInsertData(IpoId, GMPPrice, Sub2SaudaRate, LastUpdate, GMPDate);
  }
}

async function gmpInsertData(IpoId:number, GMPPrice:any, Sub2SaudaRate:any, LastUpdate:any, GMPDate:any)
{
  const connection = await dbUtils.getDefaultConnection();
  var sql = `INSERT INTO IPOGMPs 
              (IpoId, GMPDate, GMPPrice, Sub2SaudaRate, LastUpdate) 
              VALUES (
                ${IpoId}, 
                '${GMPDate}', 
                ${GMPPrice}, 
                '${Sub2SaudaRate}', 
                '${LastUpdate}'
                )`;  
    const result = await connection.query(sql)

}

async function gmpUpdateData(IpoId:number, GMPPrice:any, Sub2SaudaRate:any, LastUpdate:any, GMPDate:any)
{
  var sql = `UPDATE IPOGMPs 
              SET 
              GMPPrice = ${GMPPrice}, 
              Sub2SaudaRate = '${Sub2SaudaRate}', 
              LastUpdate = '${LastUpdate}' 
              WHERE IpoId  = ${IpoId} AND LastUpdate = '${LastUpdate}'
            `;
            
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql)


}
// ipo gmpInsertUpdate end //

// ipo subscriptionInsertUpdate start //

export interface subscriptionFields {
  IpoId: number;
  SniiSubscription: number;
  SniiApplication: number;
  ShareHolderSubscription: number;
  ShareHolderApplication: number;
  RetailSubscription: number;
  RetailApplication: number;
  QibSubscription: number;
  QibApplication: number;
  NiiSubscription: number;
  NiiApplication: number;
  LastUpdate: any;
  EmployeeSubscription: number;
  EmployeeApplication: number;
  BniiSubscription: number;
  BniiApplication: number;
}
export async function subscriptionInsertUpdate(fields:subscriptionFields){

  fields.RetailSubscription = global.commaZeroCheck(fields.RetailSubscription);
  fields.NiiSubscription = global.commaZeroCheck(fields.NiiSubscription);
  fields.QibSubscription = global.commaZeroCheck(fields.QibSubscription);
  fields.BniiSubscription = global.commaZeroCheck(fields.BniiSubscription);
  fields.SniiSubscription = global.commaZeroCheck(fields.SniiSubscription);
  fields.EmployeeSubscription = global.commaZeroCheck(fields.EmployeeSubscription);
  fields.ShareHolderSubscription = global.commaZeroCheck(fields.ShareHolderSubscription);

  fields.RetailApplication = global.commaZeroCheck(fields.RetailApplication);
  fields.NiiApplication = global.commaZeroCheck(fields.NiiApplication);
  fields.QibApplication = global.commaZeroCheck(fields.QibApplication);
  fields.EmployeeApplication = global.commaZeroCheck(fields.EmployeeApplication);
  fields.ShareHolderApplication = global.commaZeroCheck(fields.ShareHolderApplication);
  fields.SniiApplication = global.commaZeroCheck(fields.SniiApplication);
  fields.BniiApplication = global.commaZeroCheck(fields.BniiApplication);


  var sql = "SELECT * FROM IpoSubscriptions WHERE IpoId="+fields.IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql)

  if (result && result.length > 0) {
      console.log('Row was found!');
      subscriptionUpdateData(fields);
  } else {
      console.log('Row was not found :( ! )');
      subscriptionInsertData(fields);
  }
}

async function subscriptionInsertData(fields:subscriptionFields)
{
  if (fields.RetailSubscription == 0) return;
  if (fields.RetailSubscription == null) return;

  const connection = await dbUtils.getDefaultConnection();
  var updateTime = fields.LastUpdate;
  if (updateTime == null){
      updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  
  debugger
  var sql = `INSERT INTO IpoSubscriptions
              (
                IpoId,
                SniiSubscription,
                SniiApplication,
                ShareHolderSubscription,
                ShareHolderApplication,
                RetailSubscription,
                RetailApplication,
                QibSubscription,
                QibApplication,
                NiiSubscription,
                NiiApplication,
                EmployeeSubscription,
                EmployeeApplication,
                BniiSubscription,
                BniiApplication,
                LastUpdate
              ) 
              VALUES (
                ${fields.IpoId},
                ${fields.SniiSubscription},
                ${fields.SniiApplication},
                ${fields.ShareHolderSubscription},
                ${fields.ShareHolderApplication},
                ${fields.RetailSubscription},
                ${fields.RetailApplication},
                ${fields.QibSubscription},
                ${fields.QibApplication},
                ${fields.NiiSubscription},
                ${fields.NiiApplication},                
                ${fields.EmployeeSubscription},
                ${fields.EmployeeApplication},
                ${fields.BniiSubscription},
                ${fields.BniiApplication},
                '${fields.LastUpdate}'
              )`;
  const result = await connection.query(sql)
}

async function subscriptionUpdateData(fields:subscriptionFields)
{
  if (fields.RetailSubscription == 0) return;
  if (fields.RetailSubscription == null) return;

  const connection = await dbUtils.getDefaultConnection();
  
  var updateTime = fields.LastUpdate;
  if (updateTime == null){
      updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  }

  debugger
  var sql = `UPDATE IpoSubscriptions SET 
              RetailSubscription = ${fields.RetailSubscription}, 
              QibSubscription = ${fields.QibSubscription}, 
              NiiSubscription = ${fields.NiiSubscription}, 
              BniiSubscription = ${fields.BniiSubscription},
              SniiSubscription =${fields.SniiSubscription},
              EmployeeSubscription = ${fields.EmployeeSubscription},
              ShareHolderSubscription = ${fields.ShareHolderSubscription},
              RetailApplication = ${fields.RetailApplication},
              NiiApplication = ${fields.NiiApplication},
              QibApplication = ${fields.QibApplication},
              EmployeeApplication = ${fields.EmployeeApplication}, 
              ShareHolderApplication = ${fields.ShareHolderApplication}, 
              BniiApplication = ${fields.BniiApplication}, 
              SniiApplication = ${fields.SniiApplication},               
              LastUpdate = '${fields.LastUpdate}'
              WHERE IpoId = ${fields.IpoId}
              `;  


  const result = await connection.query(sql)
  // connection.query(sql,records, function (err, result) {  
  //     if (err) throw err;  
  //     console.log("1 record updated");  
  //     });  
}

// ipo subscriptionInsertUpdate end //

export async function noReservationsInsertUpdate(IpoId:number, RetailQuota:number, Type:number, IpoType:any){
// debugger
  let qib:any = ""
  let retail:any = ""
  let hni:any = ""
  if(Type == TypeEnum.Mainbord) {
    
    if(IpoType == IpoTypeEnum.BOOK_BUILT_ISSUE) {
      
      if(RetailQuota == 1) {
        retail = constants.CON_RETAIL_35;
        qib = constants.CON_QIB_50;
        hni = constants.CON_HNI_15;
      } else {
        retail = constants.CON_RETAIL_10;
        qib = constants.CON_QIB_75;
        hni = constants.CON_HNI_15;
      }
    } else {
      retail = constants.CON_RETAIL_50;
      hni = constants.CON_HNI_50;
    }

  } else {

    if(IpoType == IpoTypeEnum.BOOK_BUILT_ISSUE) {
      
      if(RetailQuota == 1) {
        retail = constants.CON_RETAIL_35;
        qib = constants.CON_QIB_50;
        hni = constants.CON_HNI_15;
      } else {
        retail = constants.CON_RETAIL_10;
        qib = constants.CON_QIB_75;
        hni = constants.CON_HNI_15;
      }
    } else {
      retail = constants.CON_RETAIL_50;
      hni = constants.CON_HNI_50;
    }
  }

  var sql = "SELECT * FROM NoReservations WHERE IpoId="+IpoId;
  const connection = await dbUtils.getDefaultConnection();
  const result = await connection.query(sql)

  if (result && result.length > 0) {
      console.log('Row was found!');
      noReservationsUpdateData(IpoId,retail,hni,qib);
  } else {
      console.log('Row was not found :( ! )');
      noReservationsInsertData(IpoId,retail,hni,qib);
  }
}

async function noReservationsInsertData(IpoId:number, retail:string, hni:string, qib:string)
{
  const connection = await dbUtils.getDefaultConnection();
  var sql = `INSERT INTO NoReservations (IpoId,RetailSharesOffer,NiiSharesOffer,QibSharesOffer) 
              VALUES (${IpoId},'${retail}', '${hni}','${qib}') `;
  const result = await connection.query(sql)
}

async function noReservationsUpdateData(IpoId:number, retail:string, hni:string, qib:string)
{
  const connection = await dbUtils.getDefaultConnection();

  var sql = `UPDATE NoReservations SET 
              RetailSharesOffer = '${retail}',
              NiiSharesOffer = '${hni}',
              QibSharesOffer = '${qib}'
              WHERE IpoId = ${IpoId}
              `; 
  const result = await connection.query(sql)
}