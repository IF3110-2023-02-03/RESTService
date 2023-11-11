import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { AuthRequest } from "../middlewares/authentication-middleware";
import { soapConfig } from "../config/soap-config";
import axios from "axios";
import xml2js from "xml2js";

interface FollowRequest {
  creatorID: number;
  followerID: number;
}

interface FollowData {
  creatorID: number;
  followerID: number;
  creatorName: string;
  followerName: string;
}

export class SoapController {
  accept() {
    return async (req: Request, res: Response) => {
      const { token } = req as AuthRequest;
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      // Parse request body
      const { creatorID, followerID }: FollowRequest = req.body;

      try {
        const response = await axios.post<string>(
          `http://${soapConfig.host}:${soapConfig.port}/api/follow`,
          `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <approveFollow xmlns="http://service.moments/">
                                <arg0 xmlns="">${creatorID}</arg0>
                                <arg1 xmlns="">${followerID}</arg1>
                                <arg2 xmlns="">${soapConfig.key}</arg2>
                            </approveFollow>
                        </Body>
                    </Envelope>`,
          {
            headers: {
              "Content-Type": "text/xml",
            },
          }
        );
        const xml = await xml2js.parseStringPromise(response.data);
        const result =
          xml["S:Envelope"]["S:Body"][0]["ns2:approveFollowResponse"][0]
            .return[0];

        if (result === "Follow not found") {
          res.status(StatusCodes.NOT_FOUND).json({
            message: result,
          });
          return;
        } else if (result === "Follow accepted") {
          res.status(StatusCodes.OK).json({
            message: result,
          });
          return;
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: result,
          });
          return;
        }
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
        return;
      }
    };
  }

  reject() {
    return async (req: Request, res: Response) => {
      const { token } = req as AuthRequest;
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      // Parse request body
      const { creatorID, followerID }: FollowRequest = req.body;

      try {
        const response = await axios.post<string>(
          `http://${soapConfig.host}:${soapConfig.port}/api/follow`,
          `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <rejectFollow xmlns="http://service.moments/">
                                <arg0 xmlns="">${creatorID}</arg0>
                                <arg1 xmlns="">${followerID}</arg1>
                                <arg2 xmlns="">${soapConfig.key}</arg2>
                            </rejectFollow>
                        </Body>
                    </Envelope>`,
          {
            headers: {
              "Content-Type": "text/xml",
            },
          }
        );
        const xml = await xml2js.parseStringPromise(response.data);
        const result =
          xml["S:Envelope"]["S:Body"][0]["ns2:rejectFollowResponse"][0]
            .return[0];

        if (result === "Follow not found") {
          res.status(StatusCodes.NOT_FOUND).json({
            message: result,
          });
          return;
        } else if (result === "Follow rejected") {
          res.status(StatusCodes.OK).json({
            message: result,
          });
          return;
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: result,
          });
          return;
        }
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
        return;
      }
    };
  }

  index() {
    return async (req: Request, res: Response) => {
      const { token } = req as AuthRequest;
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      const page = parseInt((req.query?.page || "1") as string);
      const pageSize = parseInt((req.query?.pageSize || "5") as string);
      let followData: FollowData[] = [];
      try {
        const response = await axios.post<string>(
          `http://${soapConfig.host}:${soapConfig.port}/api/follow`,
          `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <getAllReqFollow xmlns="http://service.moments/">
                                <arg0 xmlns="">${page}</arg0>
                                <arg1 xmlns="">${pageSize}</arg1>
                                <arg2 xmlns="">${soapConfig.key}</arg2>
                            </getAllReqFollow>
                        </Body>
                    </Envelope>`,
          {
            headers: {
              "Content-Type": "text/xml",
            },
          }
        );
        const xml = await xml2js.parseStringPromise(response.data);
        const pageCount =
          xml["S:Envelope"]["S:Body"][0]["ns2:getAllReqFollowResponse"][0]
            .return[0].pageCount[0];
        if (pageCount === "0") {
          res.status(StatusCodes.OK).json({
            message: "No follow request found",
            data: followData,
            pageCount: pageCount,
          });
          return;
        }
        const results =
          xml["S:Envelope"]["S:Body"][0]["ns2:getAllReqFollowResponse"][0]
            .return[0].data;

        if (!results) {
          res.status(StatusCodes.OK).json({
            message: ReasonPhrases.OK,
            data: [],
            totalPage: pageCount,
          });
          return;
        }

        results.forEach((result: any) => {
          followData.push({
            creatorID: result.creatorID[0],
            followerID: result.followerID[0],
            creatorName: result.creatorName[0],
            followerName: result.followerName[0],
          });
        });

        res.status(StatusCodes.OK).json({
          message: ReasonPhrases.OK,
          data: followData,
          totalPage: pageCount,
        });
        return;
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
        return;
      }
    };
  }
}
