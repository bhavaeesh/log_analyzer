from typing import List, Dict, Callable, Union
from re import Match, match, compile
from collections import Counter
from math import sqrt
from utils import logger
from random import randint
from pathlib import Path
import chardet
LOG = logger.Log(__name__)


def to_precision(num: float, dec: int):
    return float(f"{num:.{dec}f}")


def __split_lines__(text: str) -> List[str]:
    return text.strip().splitlines()


def __remove_dups__(data: List[Dict]) -> List:
    check_set = set()
    return [
        obj
        for obj in data
        if obj["text"] not in check_set and not check_set.add(obj["text"])
    ]

def file_reader_helper(filename: Path) -> List[str]:
    # Open the file in binary mode to read raw bytes
    with open(filename, 'rb') as f:
        raw_data = f.read()
    
    # Detect the encoding
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    
    # Open the file again using the detected encoding
    with open(filename, 'r', encoding=encoding, errors='ignore') as fs:
        return fs.readlines()

def extract_time_details(data: str) -> List:
    _ = "extract_time_details()"
    LOG.info(_, "Extracting time details")
    data = __split_lines__(data)
    LOG.debug(_, f"running split lines{len(data)}")

    sep_grps: Callable[[Union[Match[str]], None], Union[Dict, None]] = (
        lambda match_obj: (
            {
                "filename": match_obj.group(1),
                "timestamp": match_obj.group(2),
                "text": match_obj.group(3).strip(),
            }
            if match_obj is not None
            else None
        )
    )

    LOG.debug(_, "matching lines with regex pattern")
    pre_data = [
        matched
        for line in data
        if (matched := sep_grps(match(r"^\[(.+)\]\[(\d+)\](.+)", line)))
    ]

    LOG.debug(
        _,
        f"Number of None objs: {len([item for item in pre_data if item == None])}",
    )
    LOG.info(_, "Extracted time and text into objects")
    return __remove_dups__(pre_data)


def filter_negatives(json_list: List, threshold: float) -> List:
    """Filters logs eliminating any below threshold"""
    return [obj for obj in json_list if obj["negative"] >= threshold]



def generate_signature(json: List[dict]) -> Union[None, str]:
    """Creates signature from the generated json output"""
    return "\n".join([obj['msg'] for obj in json])


def generate_vector(text: str) -> Counter:
    """Generates count vector from the text"""
    WORDS = compile(r"\w+")
    return Counter(WORDS.findall(text))


def get_perfect_signature(results: List[Dict]) -> Union[Dict, None]:
    if not results:
        return None
    return max(results, key=lambda res: res["comp_index"])


def get_cosine(vector1: Counter, vector2: Counter):
    intersection = set(vector1.keys()) & set(vector2.keys())
    numerator = sum([vector1[x] * vector2[x] for x in intersection])

    sum1 = sum([vector1[x] ** 2 for x in list(vector1.keys())])
    sum2 = sum([vector2[x] ** 2 for x in list(vector2.keys())])
    denominator = sqrt(sum1) * sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        return float(numerator) / denominator


def __compare_vectors__(vector1, vector2):
    cosine = get_cosine(vector1, vector2)
    if cosine > 0.8:
        return True
    else:
        return False


def random_with_N_digits(n):
    range_start = 10 ** (n - 1)
    range_end = (10**n) - 1
    return randint(range_start, range_end)


IDPA_ISSUE_ID_GENERATOR: Callable[[], str] = lambda: f"IDPA-{random_with_N_digits(5)}"
