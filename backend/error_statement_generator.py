import re
import logging
import os
import time
from os.path import abspath, pardir, join
from pathlib import Path

# Configuration dictionary with the specified keywords and values
conf = {
    "err_statement_key_words": [
        "ERROR", "WARNING", "FAIL", "FAILED", "FATAL", "ABORT", "UNABLE", "CRASH",
        "EXCEPTION", "STACKTRACE", "PANIC", "DEADLOCK", "UNRECOVERABLE", "LEAK",
        "DENIED", "TIMEOUT", "RETRY", "OVERFLOW", "CORRUPT", "UNAVAILABLE", "CRITICAL",
        "DISCONNECT", "DROP", "UNAUTHORIZED", "VIOLATION", "REJECT", "UNEXPECTED",
        "HUNG", "STOP", "STOPPED", "SHUTDOWN", "DEGRADED", "NOT"
    ],
    "err_statement_key_values": ["404", "500", "501"]
}

# Configuring logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class LogAnalyzer:
    def __init__(self):
        self.timestamp_pattern = re.compile(r"\b\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}\.\d{3}\b")
        self.ip_pattern = re.compile(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?\b")

    def __check_negatives__(self, line):
        # Function to generate keyword pattern
        def keyword_pattern(keyword):
            return re.compile(
                r"\b" + re.escape(keyword) + r"\b|[\[\(\{]" + re.escape(keyword) + r"[\]\)\}]",
                re.IGNORECASE,
            )

        keywords_matched = False

        # Check for keyword-based negatives
        for kw in conf["err_statement_key_words"]:
            pattern = keyword_pattern(kw)
            if re.search(pattern, line):
                keywords_matched = True
                return True

        # Check for value-based negatives
        for val in conf["err_statement_key_values"]:
            value_pattern = re.compile(r"\b" + re.escape(str(val)) + r"\b", re.IGNORECASE)
            if re.search(value_pattern, line):
                if not keywords_matched and (self.timestamp_pattern.search(line) or self.ip_pattern.search(line)):
                    return False
                return True

        return False

    def analyze_log(self, log_file_path):
        negative_lines = []
        if not os.path.exists(log_file_path):
            logger.error(f"Log file {log_file_path} not found.")
            return negative_lines

        try:
            with open(log_file_path, "r", encoding="utf-8", errors="replace") as log_file:
                for line in log_file:
                    if self.__check_negatives__(line):
                        negative_lines.append(line)
            logger.info(f"Finished analyzing log file: {log_file_path}")
        except Exception as e:
            logger.error(f"Failed to read log file {log_file_path}. Error: {e}")

        return negative_lines

def process_single_log_file(log_file_path, ws_id, garage_path, analyzer):
    """Processes a single log file."""
    try:
        logger.info(f"Starting processing of log file: {log_file_path}")
        negative_lines = analyzer.analyze_log(log_file_path)

        # Ensure the directory exists
        file_name = Path(log_file_path).stem
        error_statement_path = abspath(join(garage_path, ws_id, "error_statement.txt"))
        os.makedirs(os.path.dirname(error_statement_path), exist_ok=True)

        # Write the Negative lines to the output file
        Negative_lines = ''.join(negative_lines)
        with open(error_statement_path, "w", encoding="utf-8") as updated_file:
            updated_file.write(Negative_lines)

        print(f"Negative lines have been saved to '{error_statement_path}'")
        logger.info(f"Negative lines written to {error_statement_path}")
    except Exception as e:
        logger.error(f"Error processing file {log_file_path}. Error: {e}")

def main(log_file_path, ws_id):
    """Main function to process a single log file."""
    analyzer = LogAnalyzer()

    # Profiling start time
    start_time = time.time()
    garage_path = abspath(join(__file__, pardir, "garage"))

    process_single_log_file(log_file_path, ws_id, garage_path, analyzer)

    # Profiling end time
    end_time = time.time()
    logger.info(f"Processing completed in {end_time - start_time:.2f} seconds")