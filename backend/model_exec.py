from math import ceil
from typing import List, Tuple, Dict, Generator
from utils.logger import Log
from traceback import print_exc
from json import load
from transformers import (
    AutoTokenizer,
    TFRobertaForSequenceClassification,
    PreTrainedModel,
    PreTrainedTokenizer,
)
from tensorflow._api.v2.nn import softmax
from os.path import abspath, pardir, join
from transformers.modeling_tf_outputs import TFSequenceClassifierOutput
from tensorflow import Tensor
from pathlib import Path
from lib.processing import (
    extract_time_details,
    filter_negatives,
    to_precision,
    generate_signature,
    generate_vector,
    get_cosine,
    file_reader_helper
)
from lib import mongodb_adapter
from utils.workspace_handler import get_progress, update_progress
from json import load
import datefinder
import os

LOG = Log(__name__)
conf_path = abspath(join(__file__, pardir, "conf", "conf.json"))
garage_path = abspath(join(__file__, pardir, "garage"))

with open(conf_path, "r") as conf_file:
    conf = load(conf_file)


class Analyze:
    def __init__(self) -> None:
            self.model: PreTrainedModel
            self.tokenizer: PreTrainedTokenizer
            self.config: Dict | None = None
            self.num_batches: int = 0
            self.error_sequence: List[Dict] | None = None
            self.signature: str | None = None
            self.updated_signature: str | None = None
            self.top_results: List[Dict] = []
            self.new_sig_id: int = 0
            self.sig_file_path = ""

    def model_init(self, name: str) -> None:
            _ = "load()"
            LOG.info(_, "Loading model, tokenizer and configuration")
            try:

                self.tokenizer = AutoTokenizer.from_pretrained(name)
                self.model = TFRobertaForSequenceClassification.from_pretrained(name)
                self.config = self.model.config.to_dict()
                LOG.info(_, "Model, tokenizer, configuration loaded")
            except Exception as e:
                LOG.error(_, e)
                print_exc()
    
    def predict_batches(
        self, statements: List, batch_size: int = 256
    ) -> Generator[Tensor, None, None]:
        for i in range(0, len(statements), batch_size):
            batch = statements[i : i + batch_size]
            inputs = self.tokenizer(
                batch, padding="max_length", truncation=True, return_tensors="tf"
            )
            outputs: TFSequenceClassifierOutput = self.model(**inputs)
            yield outputs.logits

    @staticmethod
    def add_scores_into_sequence(
        json_seq: List, batch_scores: List, labels: Dict
    ) -> List[Dict]:
        _ = "extract_scores()"
        try:
            batch_scores = [
                [to_precision(x * 100, 3) for x in row] for row in batch_scores
            ]
            for out_obj, scores in zip(json_seq, batch_scores):
                out_obj["negative"] = scores[labels["negative"]]
                out_obj["neutral"] = scores[labels["neutral"]]
                out_obj["positive"] = scores[labels["positive"]]
            LOG.info(_, "Scores extracted")
            return json_seq
        except Exception as e:
            LOG.error(_, "Score extraction failed")
            LOG.error(_, str(e))
            print_exc()
    
    @staticmethod
    def __update_progress__(step: int, ws_id: str):
        _ = "__update_progress__()"
        try:

            progress = int(get_progress(ws_id))
            update_progress(ws_id, progress + step)

        except Exception as e:
            LOG.error(_, f"Failed to update progress")
            LOG.error(_, str(e))
            print_exc()


    def analyze(self, filename: Path, error_filename: Path, ws_id: str):
        _ = "analyze()"
        try:
            LOG.info(_, "Analysis started")
            # read configuration
            json_seq = [{"msg": line.strip()} for line in file_reader_helper(error_filename)]
            error_statements = [obj["msg"] for obj in json_seq]
            name = filename.stem
            # Meta data about analysis task
            self.num_batches = ceil(
                len(error_statements) / conf["curr_batch_size"]
            )
            LOG.info(_, f"Total batches: {self.num_batches}")
            batch_scores = []
            prog_step = (
                conf["prog_err_analyze"]
                - conf["prog_err_extract"]
            ) // self.num_batches

            # Start prediction on batches
            for batch, logits in enumerate(
                self.predict_batches(
                    error_statements, batch_size=conf["curr_batch_size"]
                )
            ):
                batch_scores.extend(softmax(logits, axis=1).numpy().tolist())
                Analyze.__update_progress__(prog_step, ws_id)
                LOG.info(
                    _, f"{name} - processed: {batch + 1}/{self.num_batches}"
                )

            scored_seq = Analyze.add_scores_into_sequence(
                json_seq, batch_scores, self.config.get("label2id")
            )
            self.error_sequence = filter_negatives(
                scored_seq, conf["negative_threshold"]
            )
            LOG.info(_, "Analysis completed")
            update_progress(ws_id, conf["prog_err_analyze"])

        except Exception as e:
            LOG.error(_, "Analysis failed")
            LOG.error(_, str(e))
            print_exc()


    def create_summary(self, filename: Path, ws_id: str):
        _ = "create_summary()"
        LOG.info(_, "Starting summary generation")
        try:
            if self.error_sequence is None:
                raise ValueError("Expected error_sequence to be str got None")
            
            file_name = filename.stem
            self.signature = generate_signature(self.error_sequence)

            self.sig_file_path = abspath(join(garage_path, ws_id, f"{file_name}_test_signature.txt"))
            with open(self.sig_file_path, "w", encoding="utf-8") as sig_file:
                sig_file.write(self.signature)

            update_progress(ws_id, conf["prog_err_summary"])
            LOG.info(_, "Summary generated")
        except Exception as e:
            LOG.error(_, "Summary generation failed")
            LOG.error(_, str(e))
            print_exc()

    def push_summary_to_db(self, filename: Path, ws_id: str):
        _ = "publish_to_db()"
        # Read the log lines from the input file
        with open(self.sig_file_path, 'r') as file:
            log_lines = file.readlines()

        # print(log_lines)
        if not log_lines:  # Better way to check if log_lines is empty
            raise ValueError("Log lines not present in signature file")

        # Loop through each line, find and remove the matched date strings, and store the updated lines
        updated_lines = []
        for line in log_lines:  # Correctly iterate over lines 
            matches = list(datefinder.find_dates(line, source=True))
            for match in matches:
                if match[1]:  # Check if the second item (date string) is present
                    line = line.replace(match[1], "").strip()
            updated_lines.append(line)

        print("Updated Line=>", updated_lines)
        # Join the updated lines
        updated_log = '\n'.join([line for line in updated_lines if line.strip() != ""])

        # Ensure the directory exists
        fileName = filename.stem
        summary_updated_path = abspath(join(garage_path, ws_id, f"{fileName}_updated_logs.txt"))
        os.makedirs(os.path.dirname(summary_updated_path), exist_ok=True)
        # Write the updated logs to the output file
        with open(summary_updated_path, "w", encoding="utf-8") as updated_file:
            updated_file.write(updated_log)
        
        up_file = open(summary_updated_path, "r")
        self.updated_signature = up_file.read()

        print(f"Updated logs have been saved to '{summary_updated_path}'.")

        try:
            if self.signature is None:
                raise ValueError("Expected siganture to be str got None")

            __current_sig_vector__ = generate_vector(self.updated_signature)
            db = mongodb_adapter.Database()
            self.new_sig_id = db.push_signature(
                {"text": self.signature, "utext":self.updated_signature, "payload": {**{}, "file_name":fileName, "workspace_id": ws_id}}
            )["sig_id"]
            all_signatures = db.get_signatures(
                query={"sig_id": {"$ne": self.new_sig_id}}, disable_fields=["_id"]
            )

            # Computing cosines on all signature in db
            results = []
            for sig_doc in all_signatures:
                if sig_doc.get("utext", None) != None:
                    __sig_vector__ = generate_vector(sig_doc["utext"])
                    cosine_val = to_precision(
                        get_cosine(__sig_vector__, __current_sig_vector__), 2
                    )
                    results.append(
                        {
                            "sig_id": sig_doc["sig_id"],
                            "comp_index": cosine_val,
                            "logfile_name": sig_doc["payload"]["file_name"]
                            # "logbundle_name": sig_doc["payload"]["logbundle_name"],
                            # "project": sig_doc["payload"]["project"],
                        }
                    )
            # Collecting the topmost matches
            self.top_results = sorted(
                results, key=lambda res: res["comp_index"], reverse=True
            )[: conf["num_signatures"]]

            db.push_result(fname= fileName, res=self.top_results, sig_id=self.new_sig_id, ws_id=ws_id)
            update_progress(ws_id, conf["prog_err_results"])
            LOG.info(_, "Published signature and results to db")
        except Exception as e:
            LOG.error(_, "Publishing signature and results failed")
            LOG.error(_, str(e))
            print_exc()

def main(filename: str, error_file_name: str, ws_id: str) -> Tuple[int, List[Dict]]:
    _ = "main()"
    LOG.info(_, "Starting analysis and summary process")
    try:
        model_exec = Analyze()
        # Load models
        model_exec.model_init(conf["model_name"])
        # Start analysis
        model_exec.analyze(filename=filename,
            error_filename=error_file_name,
            ws_id=ws_id,
        )
        model_exec.create_summary(filename=filename, ws_id=ws_id)
        LOG.info(_, "Analysis and summary process completed")
        model_exec.push_summary_to_db(filename=filename, ws_id=ws_id)
    except Exception as e:
        LOG.error(_, "Analysis and summary process failed")
        LOG.error(_, str(e))
        print_exc()