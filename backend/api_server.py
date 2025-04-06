from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from flask import Flask, Blueprint, jsonify, request, Response
import logging
import json
import traceback, subprocess
from utils import workspace_handler 
from lib import mongodb_adapter
from threading import Thread


## API SERVER

# API server setup
app = Flask(__name__)
cors = CORS(app)

app.config["CORS_HEADERS"] = "Content-Type"

# API Server logging
handler = logging.FileHandler("logs/API_server.log")  # Create the file logger
app.logger.addHandler(handler)  # Add it to the built-in logger
app.logger.setLevel(logging.DEBUG)

logger1 = logging.getLogger("werkzeug")  # grabs underlying WSGI logger
handler1 = logging.FileHandler(
    "logs/API_server.log"
)  # creates handler for the log file
logger1.addHandler(handler1)

######################################
###############  APIS  ###############
######################################


# API to analyse logbundle
@app.route("/analyse/logbundle", methods=["POST"])
def analyse_log_bundle():
    try:

        payload = request.get_json()
        ws_id, path = workspace_handler.create_workspace(payload["log_file_name"])

        def __run_workspace__(ws_path, _id):
            try:
                json_object = json.dumps(payload, indent=4)
                with open(ws_path + "/payload.json", "w") as outfile:
                    outfile.write(json_object)

                stdout = open(ws_path + "/stdout.log", "w")
                stderr = open(ws_path + "/stderr.log", "w")

                # HIT MAIN WITH PATH AND ID
                process = subprocess.Popen(
                    ["python", "main.py", str(_id), payload["input_file"] , ws_path], stdout=stdout, stderr=stderr
                )
                process.wait()

                stdout.close()
                stderr.close()

                if stderr.closed:
                    # uncomment for future use
                    # workspace_handler.delete_workspace(_id)
                    print("deleted workspace")
            except Exception as e:
                print(e.with_traceback())

        Thread(target=__run_workspace__, args=(path, ws_id)).start()

        res = {"id": str(ws_id)}

        return Response(json.dumps(res), status=200, mimetype="application/json")

    except Exception as e:
        traceback.print_exc()
        app.logger.error(json.dumps({"Internal Server Error": f"{e}"}))
        return Response(
            json.dumps({"Internal Server Error": f"{e}"}),
            status=500,
            mimetype="application/json",
        )


# API to get workspace progress
@app.route("/progress/<string:ws_id>", methods=["GET"])
def get_workspace_progress(ws_id):
    try:

        progress = workspace_handler.get_progress(ws_id)

        res = {"progress": str(progress)}

        return Response(json.dumps(res), status=200, mimetype="application/json")
    except FileNotFoundError as e:
        db = mongodb_adapter.Database()
        res = db.get_result(ws_id)
        if res is not None:
            return Response(
                json.dumps({"progress": 100}), status=200, mimetype="application/json"
            )
        else:
            raise e
    except Exception as e:
        traceback.print_exc()
        app.logger.error(json.dumps({"Internal Server Error": f"{e}"}))
        return Response(
            json.dumps({"Internal Server Error": f"{e}"}),
            status=500,
            mimetype="application/json",
        )


# API to get workspace result
@app.route("/result/<string:ws_id>", methods=["GET"])
def get_workspace_result(ws_id):
    try:

        db = mongodb_adapter.Database()
        res = db.get_result(ws_id)
        signature = db.get_signature(ws_id)
        if res is not None and signature is not None:
            res["filename"] = signature["payload"]["file_name"]

        return Response(json.dumps(res), status=200, mimetype="application/json")

    except Exception as e:
        traceback.print_exc()
        app.logger.error(json.dumps({"Internal Server Error": f"{e}"}))
        return Response(
            json.dumps({"Internal Server Error": f"{e}"}),
            status=500,
            mimetype="application/json",
        )


@app.route("/signatures/<string:ws_id>", methods=["GET", "POST"])
def get_signature(ws_id: str) -> Response:
    try:
        db = mongodb_adapter.Database()
        signature = db.get_signature(ws_id)
        # del signature["text"]
        # print(json.dumps(signature, indent=4))
        return Response(json.dumps({"txt": signature["text"]}))
    except Exception as e:
        traceback.print_exc()
        app.logger.error(json.dumps({"Internal Server Error": f"{e}"}))
        return Response(
            json.dumps({"Internal Server Error": f"{e}"}),
            status=500,
            mimetype="application/json",
        )
    





if __name__ == "__main__":
    app.run(host="0.0.0.0", port="9090", debug=True, threaded=True)