import json
from pymongo import MongoClient
import traceback
from typing import List, Dict, Union, Any
from utils import logger

LOG = logger.Log(__name__)

conf = json.load(open("conf/conf.json"))


class Database:
    myclient = MongoClient("mongodb://localhost:27017/")
    # myclient = MongoClient("mongodb://" + conf["server"]["ip"] + ":27017/")
    mydb = myclient["errorlogger"]

    # signatures = mydb["signatures"]
    # results = mydb["results"]
    signatures = mydb["signatures_test"]
    results = mydb["results_test"]
    # bugs = mydb["bugs-temp"]
    """
    {
        "signature_vector": "",
        payload,
        "bug_id":""
    }
    """

    def push_signature(self, signature):
        _ = "push_signature()"
        LOG.info(_, "Pushing signature to DB...")

        try:
            result = self.signatures.find()
            result = list(result)

            # generating sig id
            if len(result) == 0:
                sig_id = 1000
            else:
                result = self.signatures.find()
                sig_id = list(result.sort("sig_id", -1).limit(1))[0]["sig_id"] + 1

            LOG.debug(_, "Generated Signature ID - " + str(sig_id))

            ws_id = signature["payload"]["workspace_id"]
            del signature["payload"]["workspace_id"]

            # Insert data into the MongoDB collection
            result = self.signatures.insert_one(
                {"sig_id": sig_id, **signature, "workspace_id": ws_id}
            )
            result = self.signatures.find({"sig_id": sig_id})

            LOG.info(_, "Pushed signature to DB!")

            return result[0]

        except Exception as e:
            LOG.error(_, "Error while pushing signature to DB...")
            LOG.error(_, str(e))
            traceback.print_exc()
            raise e

    def get_signatures(self, query: Dict = {}, disable_fields: List[str] = []):
        _ = "get_signatures()"
        LOG.info(_, "Getting signatures from DB...")

        try:
            result = self.signatures.find(
                {**query}, {field: False for field in disable_fields}
            )
            result = list(result)

            LOG.debug(_, "Total signatures in DB - " + str(len(result)))
            LOG.info(_, "Collected signatures from DB!")

            return result

        except Exception as e:
            LOG.error(_, "Error while getting signatures from DB...")
            LOG.error(_, str(e))
            traceback.print_exc()
            raise e

    def get_signature(
        self,
        _id: Union[str, int],
    ) -> Union[Dict, None]:
        """Returns signature with matching signature or workspace id"""
        signature = self.signatures.find_one(
            {"$or": [{"sig_id": _id}, {"workspace_id": _id}]},
            {"_id": 0},
        )

        return signature

    def update_signature(self, _id: Union[str, int], fields: Dict[str, Any]) -> bool:
        res = self.signatures.update_one(
            {"$or": [{"_id": _id}, {"workspace_id": _id}, {"sig_id": _id}]},
            {"$set": fields},
        )
        print("update_signature", res.modified_count)
        return res.modified_count >= 0

    def update_signatures(self, query: Dict[str, Any], fields: Dict[str, Any]) -> bool:
        res = self.signatures.update_many(query, {"$set": fields})
        print("update_signatures", res.modified_count)
        return res.modified_count >= 0

    def push_result(self, fname, res, ws_id, sig_id):
        _ = "push_result()"
        LOG.info(_, "Pushing result to DB...")

        try:
            result = self.results.find()
            result = list(result)

            # generating res id
            if len(result) == 0:
                res_id = 1000
            else:
                result = self.results.find()
                res_id = list(result.sort("res_id", -1).limit(1))[0]["res_id"] + 1

            LOG.debug(_, "Generated Result ID - " + str(res_id))

            # Insert data into the MongoDB collection
            result = self.results.insert_one(
                {
                    "res_id": res_id,
                    "workspace_id": str(ws_id),
                    "filename": fname,
                    "sig_id": sig_id,
                    "result": res,
                }
            )
            result = self.results.find({"res_id": res_id})

            LOG.info(_, "Pushed result to DB!")

            return result[0]

        except Exception as e:
            LOG.error(_, "Error while pushing result to DB...")
            LOG.error(_, str(e))
            traceback.print_exc()
            raise e

    # def push_bug(self, ws_id: str, sig_id: str, bug_id: str, jira_link: str, **data) -> Union[Dict, List[Dict]]:
    #     _ = "push_bug()"
    #     LOG.info(_, "Pushing bug to database..")
    #     try:
    #         bug = self.bugs.find_one({"bug_id": bug_id})
    #         # if 1:n mapping -> TODO-[#discuss]: Mappings of signatures and bugs
    #         # num_bugs = self.bugs.count_documents({"bug_id": bug_id})
    #         if bug is not None:
    #             return bug

    #     except Exception as e:
    #         LOG.error(_, "Error while pushing result to DB...")
    #         LOG.error(_, str(e))
    #         traceback.print_exc()
    #         raise e

    def get_result(self, ws_id):
        _ = "get_result()"
        LOG.info(_, "Fetching result from DB...")
        LOG.debug(_, "Recieved workspace ID - " + str(ws_id))

        try:
            result = self.results.find_one({"workspace_id": ws_id}, {"_id": False})
            LOG.info(_, "Fetched result from DB!")
            filenames = self.signatures.find(
                {"sig_id": {"$in": [res["sig_id"] for res in result["result"]]}},
                {"payload.file_name": 1, "sig_id": 1, "_id": 0},
            ).to_list()
            result["result"] = [{**res, "filename": sig['payload']['file_name']} for res in result["result"] for sig in filenames if res["sig_id"] == sig["sig_id"]]

            return result

        except Exception as e:
            LOG.error(_, "Fetching result from DB failed!")
            LOG.error(_, str(e))
            traceback.print_exc()
            raise e
