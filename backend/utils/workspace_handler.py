from utils import logger
import json
import os, stat, shutil, traceback
from datetime import datetime

LOG = logger.Log(__name__)
conf = json.load(open("conf/conf.json"))

def __get_date_time__():
    return str(datetime.now().strftime("%d_%m_%y_%H_%M_%S"))

def create_workspace(filename):
    _ = "create_workspace()"
    LOG.info(_, "Creating workspace...")

    workspace_id = f"{filename.replace('negative_', '')}_workspace_"+__get_date_time__()
    current_workspace = conf["workspace_path"]+workspace_id

    os.mkdir(current_workspace)
    # os.chmod(current_workspace, 777)
    os.chmod(current_workspace, stat.S_IWRITE)
    LOG.debug(_, "Created directory - " + current_workspace)
    # with open(current_workspace + "/error_statement.txt", 'w') as file:
    #     file.write("")
    # LOG.debug(_, "Created error_statement file in - " + current_workspace)
    with open(current_workspace + "/progress.txt", 'w') as file:
        file.write("0")
    LOG.debug(_, "Created progress file in - " + current_workspace)

    LOG.info(_, "Workspace created!")

    return workspace_id, current_workspace


def delete_workspace(workspace_id):
    _ = "delete_workspace()"
    LOG.info(_, "Deleting workspace...")
    LOG.debug("Received workspace id - " + str(workspace_id))

    current_workspace = conf["workspace_path"]+workspace_id

    try:
        shutil.rmtree(current_workspace)
        LOG.debug(_, "Deleted directory - " + current_workspace)
        LOG.info(_, "Deleted workspace!")

    except Exception as e:
        LOG.error(_,"Deleting workspace failed!")
        LOG.error(_,str(e))
        traceback.print_exc()

def update_progress(workspace_id, progress):
    _ = "update_progress()"
    LOG.info(_, "Updating workspace progess...")
    LOG.debug(_, "Received workspace id - " + str(workspace_id))

    current_workspace = conf["workspace_path"]+workspace_id

    try:
        with open(current_workspace+"/progress.txt", "w") as file:
            file.write(str(progress))
        LOG.info(_, "Updated workspace progess!")

    except Exception as e:
        LOG.error(_,"Updating workspace progess failed!")
        LOG.error(_,str(e))
        traceback.print_exc()
        raise e

def get_progress(workspace_id):
    _ = "get_progress()"
    LOG.info(_, "Getting workspace progess...")
    LOG.debug(_, "Received workspace id - " + str(workspace_id))

    current_workspace = conf["workspace_path"]+workspace_id

    try:
        with open(current_workspace+"/progress.txt", "r") as file:
            content = file.read()
            LOG.debug(_, "Progress - " + str(content))

            return content
        
    except Exception as e:
        LOG.error(_,"Getting workspace progess failed!")
        LOG.error(_,str(e))
        traceback.print_exc()
        raise e
