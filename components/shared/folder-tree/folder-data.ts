export type FolderItem = {
  assetName: string;
  documentId: string;
  id?: string;
  type: "file" | "folder";
  content?: string;
  items?: FolderItem[];
};

export interface FileType {
  DocumentId: string;
  customMetadata: {
    assetId: string;
    ticker: string;
    docType: string;
    identityId: string;
  };
  documentMetadata: {
    contentHash: {
      type: string;
      value: string;
    };
    name: string;
  };
  id: string;
  processMetadata: {
    hash: string;
    hashAlgorithm: string;
    instrumentation: {
      blob: {
        endTimeStamp: string;
        startTimeStamp: string;
        totalTimeTakenInMillisecond: string;
      };
      hash: {
        endTimeStamp: string;
        startTimeStamp: string;
        totalTimeTakenInMillisecond: string;
      };
      headers: {
        Accept: string;
        "Accept-Encoding": string;
        "Accept-Language": string;
        Host: string;
        "Max-Forwards": string;
        Referer: string;
        "User-Agent": string;
        Origin: string;
        "sec-ch-ua": string;
        "sec-ch-ua-mobile": string;
        "X-Forwarded-For": string;
        "api-version": string;
        "sec-ch-ua-platform": string;
        "sec-fetch-site": string;
        "sec-fetch-mode": string;
        "sec-fetch-dest": string;
        priority: string;
        "X-Subscription-Id": string;
        "X-User-Email": string;
        "X-Product-Name": string;
        "X-ARR-LOG-ID": string;
        "CLIENT-IP": string;
        "DISGUISED-HOST": string;
        "X-SITE-DEPLOYMENT-ID": string;
        "WAS-DEFAULT-HOSTNAME": string;
        "X-Forwarded-Proto": string;
        "X-AppService-Proto": string;
        "X-ARR-SSL": string;
        "X-Forwarded-TlsVersion": string;
        "X-Original-URL": string;
        "X-WAWS-Unencoded-URL": string;
        "Content-Length": string;
        "Content-Type": string;
      };
      trackingId: string;
    };
    systemMetadata: {
      Id: string;
      Name: string;
      DisplayName: string;
      Path: string;
      LastModified: string;
      Size: number;
      MediaType: string;
      IsFolder: boolean;
      ETag: string;
      FileLocator: string;
      LastModifiedBy: string | null;
    };
  };
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: number;
}
