import { CCard, CCardBody, CFormInput, CButton, CListGroup } from "@coreui/react";
import { useState } from "react";
import WViewer from "./WViewer";

const Workspace = () => {
  const [workSpaces, setWorkSpaces] = useState([]);
  const [wsId, setWsId] = useState("");
  const addWorkSpace = () => {
    if (!workSpaces.includes(wsId)) {
      console.log("ADDED");
      setWorkSpaces((prevWorkSpaces) => [...prevWorkSpaces, wsId]); // Use spread syntax to create a new array
    }
  };
  const removeWorkspace = (wsId) => {
    setWorkSpaces((prevWorkSpaces) => prevWorkSpaces.filter(_wsId => _wsId !== wsId));
  };
  return (
    <CCard className="customized p-3">
      <h3 className="mb-0 fw-bold">Workspace Details</h3>
      <div className="divider x" style={{ "--color": "#94a3b8" }}></div>
      <CCardBody>
        <CFormInput
          label="Workspace id"
          placeholder="Enter workspace id"
          name="wsid"
          id="wsid"
          value={wsId}
          onChange={(evt) => {
            setWsId(evt.target.value);
          }}
        />
      </CCardBody>
      <CButton onClick={addWorkSpace} disabled={wsId===""} className="ms-3 px-3 py-1 btn-info text-light w-fit">
        Add Tracker
      </CButton>
      <div className="divider x" style={{ "--color": "#94a3b8" }}></div>
      {workSpaces.map((id) => {
        return <WViewer key={id} wsId={id} intervalms={5000} onCancel={removeWorkspace} />;
      })}
    </CCard>
  );
};

export default Workspace;
