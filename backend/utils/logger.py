import logging
import json

conf = json.load(open("conf/conf.json"))

logger = logging.getLogger(__name__)  
# logger.setLevel(logging.WARNING)
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler("logs/logmodule.log")
formatter = logging.Formatter('%(asctime)s : %(levelname)s : %(message)s')
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)

class Log():
    file = ""
    def __init__(self, file): 
        self.file = file

    def info(self, method, m): 
        logger.info(str(self.file)+"::"+str(method)+" -> "+str(m))

    def debug(self, method, m): 
        if conf["enable_debug_log"]:
            logger.debug(str(self.file)+"::"+str(method)+" -> "+str(m)) 

    def error(self, method, m): 
        logger.error(str(self.file)+"::"+str(method)+" -> "+str(m))
