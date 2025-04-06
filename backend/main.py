import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
from transformers import logging
from tensorflow import get_logger
from warnings import filterwarnings
from pathlib import Path
import model_exec
from utils import workspace_handler
import error_statement_generator
from os.path import abspath, pardir, join
from pathlib import Path
import sys

get_logger().setLevel("ERROR")
logging.set_verbosity_error()
filterwarnings("ignore")


def main(args):
    # path = "./input/container_1445144423722_0023_01_000001.log"
    # file_name = Path(path).stem
    # ws_id, ws_path = workspace_handler.create_workspace(file_name)
    # workspace_handler
    # with open() as log_file:

    ws_id = args[0]
    path = args[1]
    file_name = Path(path).stem
    ws_path = args[2]


    error_statement_generator.main(Path(path), ws_id=ws_id)

    error_path = abspath(join(ws_path,"error_statement.txt"))

    model_exec.main(Path(file_name), Path(error_path), ws_id=ws_id)

    # print(ws_id, ws_path)

if __name__ == "__main__":
    print(sys.argv)
    main(sys.argv[1:])
