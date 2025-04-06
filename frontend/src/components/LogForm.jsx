import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { CCard, CCardBody, CForm, CFormInput, CButton, CRow, CCol } from "@coreui/react";

const LogForm = () => {
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
      log_file_name: "",
      input_file: ""
    },
    validate: (values) => {
      console.log("VALIDATE");
      const errors = {};
      if (values.log_file_name === "") {
        errors.log_file_name = "Required";
      }
      if (values.input_file === "") {
        errors.input_file = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
      values.compression_type = getCompressionType(values.input_file);
      axios
        .post("/analyse/logbundle", values)
        .then(({ data }) => {
          generateFile(`WORKSPACE_ID: ${data.id}\nLOG_FILE_NAME: ${values.log_file_name}`.trim(), `${data.id}.txt`);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <CCard>
      <h1 className="fw-bold ms-4 mt-4">Submit Log File</h1>
      <div className="divider x" style={{ "--color": "#94a3b8" }}></div>
      <CCardBody className="px-4 py-3">
        <CForm className="customized" onSubmit={handleSubmit} noValidate>
          <CRow>
            <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
              <CFormInput
                type="text"
                id="log_file_name"
                label="Log File Name:"
                name="log_file_name"
                placeholder="Enter the name of the log file"
                value={values.log_file_name}
                onChange={handleChange}
                feedbackInvalid={errors.log_file_name}
                invalid={errors.log_file_name !== undefined}
              />
            </CCol>
            <CCol className="col-12 col-lg-6 mt-2 mt-lg-0">
              <CFormInput
                type="text"
                id="input_file"
                label="Input File:"
                name="input_file"
                value={values.input_file}
                onChange={handleChange}
                placeholder="Enter the input file path"
                feedbackInvalid={errors.input_file}
                invalid={errors.input_file !== undefined}
              />
            </CCol>
          </CRow>
          <div className="d-flex justify-content-center">
            <CButton type="submit" className="my-3 btn-info text-light px-4 fs-7">
              Submit
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default LogForm;
