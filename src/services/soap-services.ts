import { soapConfig } from "../config/soap-config";
import axios from "axios";
import xml2js from "xml2js";

export class SOAPService {
  async validate(creatorID: number, followerID: number) {
    try {
      const response = await axios.post<string>(
        `http://${soapConfig.host}:${soapConfig.port}/api/follow`,
        `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                    <Body>
                        <checkStatus xmlns="http://service.spaces/">
                            <arg0 xmlns="">${creatorID}</arg0>
                            <arg1 xmlns="">${followerID}</arg1>
                            <arg2 xmlns="">${soapConfig.key}</arg2>
                        </checkStatus>
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
        xml["S:Envelope"]["S:Body"][0]["ns2:checkStatusResponse"][0].return[0];

      if (result === "REJECTED") {
        return false;
      } else if (result === "ACCEPTED") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}
