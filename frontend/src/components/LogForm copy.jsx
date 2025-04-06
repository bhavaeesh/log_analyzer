import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import timezones from "../constants/Timezones";
import { CCard, CCardBody, CForm, CFormInput, CButton, CFormSelect, CFormCheck, CRow, CCol } from "@coreui/react";

const LogForm = () => {
  const [uoms, setUoms] = useState([]);
  const [versions, setVersions] = useState([]);
  const generateFile = (content, fileName) => {
    const file = new Blob([content], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = URL.createObjectURL(file);
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    anchor.remove();
  };
  const getCompressionType = (path) => {
    const ext = path.match(/(?<=\.)\w+$/g);
    if (ext instanceof Array && ext.length > 0) {
      return ext[0];
    }
    return "";
  };
  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      logbundle_name: "",
      logbundle_path: "",
      project: "#",
      timezone: "#",
      nt_id: "",
      timeformat: "",
      status: "pass",
      log_bug: false,
      send_mail: false,
      description: "",
      compression_type: "",
      version: "#",
      customfield_13741: "#",
    },
    validate: (values) => {
      console.log("VALIDATE");
      const errors = {};
      if (values.logbundle_name === "") {
        errors.logbundle_name = "Required";
      }
      if (values.logbundle_path === "") {
        errors.logbundle_path = "Required";
      }
      if (values.project === "#") {
        errors.project = "Required";
      }
      if (values.timezone === "#") {
        errors.timezone = "Required";
      }
      if (values.nt_id === "") {
        errors.nt_id = "Required";
      }
      if (values.log_bug) {
        if (values.version == "#") {
          errors.version = "Required";
        }
        if (values.customfield_13741 == "#") {
          errors.customfield_13741 = "Required";
        }
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
      values.compression_type = getCompressionType(values.logbundle_path);
      axios
        .post("/analyse/logbundle", values)
        .then(({ data }) => {
          generateFile(`WORKSPACE_ID: ${data.id}\nLOGBUNDLE_NAME: ${values.logbundle_name}\nNT_ID: ${values.nt_id}`.trim(), `${data.id}.txt`);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  useEffect(() => {
    axios.get("/cache?field=versions&retrieve=id,name,key&search=dmas-5.1").then(({ data }) => {
      setVersions(data.versions);
    });
    axios.get("/cache?field=customfield_13741&retrieve=id,name,value&search=DP UoM Integrated").then(({ data }) => {
      setUoms(data.customfield_13741);
    });
  }, []);
  return (
    <CCard>
      <h1 className="fw-bold ms-4 mt-4">Submit Log Bundle</h1>
      <div className="divider x" style={{ "--color": "#94a3b8" }}></div>
      <CCardBody className="px-4 py-3">
        <CForm className="customized" onSubmit={handleSubmit} noValidate>
          <CRow>
            <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
              <CFormInput
                type="text"
                id="logbundle_name"
                label="Logbundle Name:"
                name="logbundle_name"
                placeholder="Enter the name of the log bundle"
                value={values.logbundle_name}
                onChange={handleChange}
                feedbackInvalid={errors.logbundle_name}
                invalid={errors.logbundle_name !== undefined}
              />
            </CCol>
            <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
              <CFormInput
                type="text"
                id="logbundle_path"
                label="Logbundle Path:"
                name="logbundle_path"
                value={values.logbundle_path}
                onChange={handleChange}
                placeholder="Enter the path of the log bundle"
                feedbackInvalid={errors.logbundle_path}
                invalid={errors.logbundle_path !== undefined}
              />
            </CCol>
          </CRow>
          <CRow className="mt-lg-3">
            <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
              <CFormSelect
                label="Project:"
                name="project"
                id="project"
                onChange={handleChange}
                value={values.project}
                feedbackInvalid={errors.project}
                invalid={errors.project !== undefined}>
                <option value="#">Select a project</option>
                <option value="12703">IDPA</option>
                <option value="12702">Power Protect Data Manager</option>
              </CFormSelect>
            </CCol>
            <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
              <CFormSelect
                label="Timezone:"
                name="timezone"
                id="timezone"
                onChange={handleChange}
                value={values.timezone}
                feedbackInvalid={errors.timezone}
                invalid={errors.timezone !== undefined}>
                <option value="#" disabled>
                  Select a timezone
                </option>
                {timezones.map((tz, idx) => {
                  return (
                    <option key={idx} value={tz.id}>
                      {tz.name}
                    </option>
                  );
                })}
              </CFormSelect>
            </CCol>
          </CRow>
          {values.log_bug ? (
            <CRow className="mt-lg-3">
              <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
                <CFormSelect
                  label="UoM Name:"
                  name="customfield_13741"
                  id="customfield_13741"
                  value={values.customfield_13741}
                  onChange={handleChange}
                  feedbackInvalid={errors.customfield_13741}
                  invalid={errors.customfield_13741 !== undefined}>
                  <option value="#" disabled>
                    Select a UoM
                  </option>
                  {uoms.map(({ value, id }, idx) => {
                    return (
                      <option key={idx} value={id}>
                        {value}
                      </option>
                    );
                  })}
                </CFormSelect>
              </CCol>
              <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
                <CFormSelect
                  label="Version:"
                  name="version"
                  id="version"
                  value={values.version}
                  onChange={handleChange}
                  feedbackInvalid={errors.version}
                  invalid={errors.version !== undefined}>
                  <option value="#" disabled>
                    Select a version
                  </option>
                  {versions.map(({ id, name }, idx) => {
                    return (
                      <option key={idx} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </CFormSelect>
              </CCol>
            </CRow>
          ) : (
            ""
          )}
          <CRow className="mt-lg-3">
            <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
              <CFormInput
                type="text"
                id="nameOfLogBundle"
                label="NT ID:"
                name="nt_id"
                placeholder="Enter your NT ID"
                feedbackInvalid={errors.nt_id}
                invalid={errors.nt_id !== undefined}
                value={values.nt_id}
                onChange={handleChange}
              />
            </CCol>
            <div className="col-12 col-lg-6 mt-2 mt-lg-0 d-flex flex-column">
              <span className="d-block form-label">Logbundle Status:</span>
              <div className="d-flex">
                <CFormCheck
                  type="radio"
                  id="status_pass"
                  name="status"
                  label="Pass"
                  value="pass"
                  onChange={handleChange}
                  checked={values.status === "pass"}
                />
                <CFormCheck
                  className="ms-4"
                  type="radio"
                  id="status_fail"
                  name="status"
                  label="Fail"
                  value="fail"
                  onChange={handleChange}
                  checked={values.status === "fail"}
                />
              </div>
            </div>
          </CRow>
          <CRow className="mt-lg-3">
            <div className="col-12 col-lg-6 mt-2 mt-lg-0 d-flex flex-column">
              <CFormCheck
                type="checkbox"
                id="log_bug"
                name="log_bug"
                label="Report bugs after identification"
                checked={values.log_bug}
                onChange={handleChange}
              />
              <CFormCheck
                type="checkbox"
                id="send_mail"
                name="send_mail"
                checked={values.send_mail}
                label="Send email notification"
                onChange={handleChange}
              />
            </div>
          </CRow>

          <CButton type="submit" className="my-3 btn-info text-light px-4 fs-7">
            Submit
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default LogForm;
