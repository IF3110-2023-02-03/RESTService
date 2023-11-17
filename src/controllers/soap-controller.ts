import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { AuthRequest } from "../middlewares/authentication-middleware";
import { soapConfig } from "../config/soap-config";
import axios from "axios";
import xml2js from "xml2js";
import { Objects } from "../models/object-model";
import { Broadcast } from "../models/broadcast-model";

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
          `http://${soapConfig.host}:${soapConfig.port}/api/following`,
          `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
              <Body>
                  <confirmFollow xmlns="http://services.example.org/">
                      <arg0 xmlns="">${creatorID}</arg0>
                      <arg1 xmlns="">${followerID}</arg1>
                      <arg2 xmlns="">true</arg2>
                      <arg3 xmlns="">${soapConfig.key}</arg3>
                  </confirmFollow>
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
          xml["S:Envelope"]["S:Body"][0]["ns2:confirmFollowResponse"][0]
            .return[0];

        if (result === "Success") {
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
          `http://${soapConfig.host}:${soapConfig.port}/api/following`,
          `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <confirmFollow xmlns="http://services.example.org/">
                                <arg0 xmlns="">${creatorID}</arg0>
                                <arg1 xmlns="">${followerID}</arg1>
                                <arg2 xmlns="">false</arg2>
                                <arg3 xmlns="">${soapConfig.key}</arg3>
                            </confirmFollow>
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
          xml["S:Envelope"]["S:Body"][0]["ns2:confirmFollowResponse"][0]
            .return[0];

        
        if (result === "Success") {
          res.status(StatusCodes.OK).json({
            message: result,
          });
          return;
        }  else {
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
      const id = req.query?.id
      const filter = req.query?.filter || ""
      console.log(filter)
      let followData: FollowData[] = [];
      try {
        const response = await axios.post<string>(
          `http://${soapConfig.host}:${soapConfig.port}/api/following`,
          `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <getFollowersByID xmlns="http://services.example.org/">
                              <arg0 xmlns="">${id}</arg0>
                              <arg1 xmlns="">${page}</arg1>
                              <arg2 xmlns="">${pageSize}</arg2>
                              <arg3 xmlns="">${filter}</arg3>
                              <arg4 xmlns="">${soapConfig.key}</arg4>
                            </getFollowersByID>
                        </Body>
                    </Envelope>`,
          {
            headers: {
              "Content-Type": "text/xml",
            },
          }
        );
        const xml = await xml2js.parseStringPromise(response.data);
        const results =
        xml["S:Envelope"]["S:Body"][0]["ns2:getFollowersByIDResponse"][0]
        .return[0];
        console.log(xml["S:Envelope"]["S:Body"][0]["ns2:getFollowersByIDResponse"][0])

        if (!!results) {
          res.status(StatusCodes.OK).json({
            message: ReasonPhrases.OK,
            data: JSON.parse(results),
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

  indexPending() {
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
      const id = req.query?.id
      let followData: FollowData[] = [];
      try {
        const response = await axios.post<string>(
          `http://${soapConfig.host}:${soapConfig.port}/api/following`,
          `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
              <Body>
                  <getPendingFollowingsByID xmlns="http://services.example.org/">
                      <arg0 xmlns="">${id}</arg0>
                      <arg1 xmlns="">${page}</arg1>
                      <arg2 xmlns="">${pageSize}</arg2>
                      <arg3 xmlns="">${soapConfig.key}</arg3>
                  </getPendingFollowingsByID>
              </Body>
          </Envelope>`,
          {
            headers: {
              "Content-Type": "text/xml",
            },
          }
        );
        const xml = await xml2js.parseStringPromise(response.data);
        const results =
          xml["S:Envelope"]["S:Body"][0]["ns2:getPendingFollowingsByIDResponse"][0]
            .return[0];
        if (!!results) {
          res.status(StatusCodes.OK).json({
            message: ReasonPhrases.OK,
            data: JSON.parse(results),
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

  contents(){
    return async (req: Request, res: Response) => {
      const limit = req.body.perpage;
      const offset = (req.body.page-1)*limit;
      if(req.body.ids.length > 0){
        const objects = await Objects.createQueryBuilder("objects")
            .select()
            .where("objects.userUserID IN (:...ids)", { ids: req.body.ids })
            .limit(limit)
            .offset(offset)
            .getMany()
  
        const broadcasts = await Broadcast.createQueryBuilder("broadcast")
            .select()
            .where("broadcast.userUserID IN (:...ids)", { ids: req.body.ids })
            .orderBy("broadcast.post_date", 'DESC')
            .limit(limit)
            .offset(offset)
            .getMany()
        res.status(StatusCodes.OK).json({
            message: ReasonPhrases.OK,
            data: {objects,broadcasts}
        });
      }else{
        res.status(StatusCodes.OK).json({
          message: ReasonPhrases.OK,
          data: {objects: [],broadcasts: []}
        });
      }

    };
  }
}
