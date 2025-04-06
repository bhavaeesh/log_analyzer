import { useState, useEffect, useRef } from "react";
import { CButton, CCallout, CProgress, CProgressBar, CRow, CCol, CCloseButton } from "@coreui/react";
import axios from "axios";

const WViewer = ({ wsId, onCancel, intervals, intervalms }) => {
  const interval = useRef();
  const signal = useRef();
  const [wsInfo, setWsInfo] = useState({
    wsID: wsId,
    progress: 0,
    started: false,
    completed: false,
    result: undefined,
  });
  const generateFile = (content, fileName) => {
    const file = new Blob([content], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = URL.createObjectURL(file);
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    anchor.remove();
  };
  const initiateDownload = () => {
    axios
      .get(`/signatures/${wsInfo.wsID}`, {
        signal: signal.current,
      })
      .then(({ data }) => {
        console.log(data);
        generateFile(data.txt, `${wsInfo.wsID}_signature.txt`)
      })
    
  };
  const getResults = () => {
    axios
      .get(`/result/${wsInfo.wsID}`, {
        signal: signal.current,
      })
      .then(({ data }) => {
        console.log(data);
        setWsInfo((info) => ({ ...info, result: data }));
      })
      .catch((err) => {
        console.log(err);
        setWsInfo((info) => {
          return { ...info, wsID: wsId, progress: 0, started: false, result: undefined };
        });
      });
  };

  const hitProgress = () => {
    axios
      .get(`/progress/${wsInfo.wsID}`, {
        signal: signal.current,
      })
      .then(({ data }) => {
        const currProg = parseFloat(data.progress);
        if (currProg === 100) {
          console.log("COMPLETE CLEARED", interval.current);
          clearInterval(interval.current);
          setWsInfo((info) => {
            return { ...info, progress: currProg, completed: true };
          });
        }
        setWsInfo((info) => {
          return { ...info, progress: currProg };
        });
      })
      .catch((err) => {
        console.log(err);
        console.log("CATCH CLEARED", interval.current);
        clearInterval(interval.current);
        setWsInfo((info) => {
          return { ...info, wsID: wsId, progress: 0, started: false };
        });
      });
  };

  useEffect(() => {
    const intervalTime = intervals !== undefined ? intervals * 1000 : intervalms;
    const controller = new AbortController();
    signal.current = controller.signal;
    if (!wsInfo.started) {
      interval.current = setInterval(hitProgress, intervalTime);
      console.log("CREATED", interval.current);
      setWsInfo((info) => ({
        ...info,
        wsID: wsId,
        started: true,
      }));
    }

    return () => {
      console.log("RUNNING CLEANUP");

      console.log("ABORT CALLED");
      controller.abort();
      console.log("CLEANUP CLEARED", interval.current);
      clearInterval(interval.current);
      setWsInfo((info) => {
        return { ...info, wsID: wsId, progress: 0, started: false };
      });
    };
  }, [wsId]);

  return (
    <CCallout className="position-relative" color="info rounded-0">
      <h5>Workspace ID: {wsInfo.wsID} </h5>
      <CCloseButton className="position-absolute close-absolute" onClick={() => (onCancel ? onCancel(wsId) : "")} />
      <CRow>
        <CCol className="col-12 col-lg-6">
          <div className="progress-container">
            <span className="progress-text position-absolute">{wsInfo.progress}</span>
            <CProgress color="info" height={5}>
              <CProgressBar value={wsInfo.progress}></CProgressBar>
            </CProgress>
          </div>
          <CButton onClick={getResults} disabled={!wsInfo.completed} className="mt-3 btn-info text-light" type="button">
            View Results
          </CButton>
          <CButton onClick={initiateDownload} disabled={!wsInfo.completed} className="mt-3 ms-1 btn-info text-light" type="button">Error Statement</CButton>
        </CCol>
        {wsInfo.completed && wsInfo.result !== undefined ? (
          <CCol className="col-12 col-lg-6 mt-3 mt-lg-2">
            <h5 className="fw-bold">Log File Name: {wsInfo.result?.filename}</h5>
            <h5 className="fw-bold">Top matches with</h5>
            <div className="my-2">
              {wsInfo.result?.result?.map(({ filename, comp_index }, idx) => {
                return (
                  <h5 key={idx} className="signature d-flex">
                    <span className="file_name">{filename}</span>
                    <span className={`ms-auto index ${comp_index > 0.5 ? 'high' : 'low'}`}>{comp_index * 100}</span>
                  </h5>
                );
              })}
            </div>
          </CCol>
        ) : (
          ""
        )}
      </CRow>
    </CCallout>
  );
};

export default WViewer;
