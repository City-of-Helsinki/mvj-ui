import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-final-form";
import { createForm } from "final-form";
import { Row, Column } from "@/components/grid/Grid";
import Button from "@/components/button/Button";
import { ButtonColors } from "@/components/enums";
import FormField from "@/components/form/final-form/FormField";
import { FieldTypes } from "@/enums";
import Authorization from "@/components/authorization/Authorization";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { getFieldAttributes, isFieldAllowedToEdit } from "@/util/helpers";
import {
  LeaseStatisticReportPaths,
  LeaseStatisticReportTitles,
} from "@/leaseStatisticReport/enums";
import {
  getReportTypeOptions,
  getReportUrl,
  getPayload,
  getFields,
  getQueryParams,
  formatType,
} from "@/leaseStatisticReport/helpers";
import {
  fetchReportData,
  setOptions,
  sendReportToMail,
  fetchOptions,
  setPayload,
  fetchAttributes as fetchLeaseStatisticReportAttributes,
  fetchReports,
} from "@/leaseStatisticReport/actions";
import {
  getAttributes as getLeaseStatisticReportAttributes,
  getOptions,
  getIsFetchingOptions,
  getIsFetchingAttributes as getIsFetchingLeaseStatisticReportAttributes,
  getReports,
  getIsFetchingReports,
  getIsFetchingReportData,
  getIsSendingMail,
} from "@/leaseStatisticReport/selectors";
import type { Attributes, Reports } from "types";

const LeaseStatisticReportForm: React.FC = () => {
  const dispatch = useDispatch();

  const leaseStatisticReportAttributes: Attributes = useSelector(
    getLeaseStatisticReportAttributes,
  );
  const options = useSelector(getOptions);
  const isFetchingOptions = useSelector(getIsFetchingOptions);
  const isFetchingLeaseStatisticReportAttributes = useSelector(
    getIsFetchingLeaseStatisticReportAttributes,
  );
  const isFetchingReports = useSelector(getIsFetchingReports);
  const isFetchingReportData = useSelector(getIsFetchingReportData);
  const isSendingMail = useSelector(getIsSendingMail);
  const reports: Reports = useSelector(getReports);

  const formRef = useRef(
    createForm({
      onSubmit: () => {},
      initialValues: {},
    }),
  );

  const [formValues, setFormValues] = useState(
    () => formRef.current.getState().values,
  );
  const reportType = useMemo(
    () => formValues.report_type,
    [formValues.report_type],
  );
  const leaseStatisticReportMethods = useMemo(
    () => formValues.lease_statistic_report_methods,
    [formValues.lease_statistic_report_methods],
  );

  useEffect(() => {
    const unsubscribe = formRef.current.subscribe(
      (state) => {
        setFormValues(state.values);
      },
      { values: true },
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (
      !isFetchingLeaseStatisticReportAttributes &&
      !leaseStatisticReportAttributes &&
      !leaseStatisticReportMethods
    ) {
      dispatch(fetchLeaseStatisticReportAttributes());
    }
  }, [
    dispatch,
    isFetchingLeaseStatisticReportAttributes,
    leaseStatisticReportAttributes,
    leaseStatisticReportMethods,
  ]);

  useEffect(() => {
    if (!isFetchingReports && !reports) {
      dispatch(fetchReports());
    }
  }, [dispatch, isFetchingReports, reports]);

  const getReportData = () => {
    const url = getReportUrl(reports, reportType);
    const query = getQueryParams(formValues);
    const payload = getPayload(query, url, reportType);
    dispatch(fetchReportData(payload));
    dispatch(setOptions(options));
    dispatch(setPayload(payload));
  };

  const sendToMail = () => {
    const url = getReportUrl(reports, reportType);
    const query = getQueryParams(formValues);
    const payload = getPayload(query, url, reportType);
    dispatch(sendReportToMail(payload));
  };

  const ReportTypeChanged = (reportType: any) => {
    const url = getReportUrl(reports, reportType);
    dispatch(fetchOptions(url));
    resetAllOtherFields(reportType);
  };

  const resetAllOtherFields = (reportType: any) => {
    formRef.current.reset({
      report_type: reportType,
    });
  };

  if (isFetchingReports)
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );
  const reportTypeOptions = getReportTypeOptions(reports);
  const fields = getFields(options);
  const isAsync = !!(options && options.is_async);
  return (
    <Form form={formRef.current} onSubmit={formRef.current.submit}>
      {() => (
        <form>
          <Row>
            <Column small={12} large={12}>
              <Row>
                <Column large={3} medium={4} small={6}>
                  <Authorization
                    allow={isFieldAllowedToEdit(
                      leaseStatisticReportAttributes,
                      LeaseStatisticReportPaths.START_DATE,
                    )}
                  >
                    <FormField
                      fieldAttributes={getFieldAttributes(
                        leaseStatisticReportAttributes,
                        LeaseStatisticReportPaths.START_DATE,
                      )}
                      disableDirty
                      name="report_type"
                      overrideValues={{
                        fieldType: FieldTypes.CHOICE,
                        label: LeaseStatisticReportTitles.REPORT_TYPE,
                        options: reportTypeOptions,
                      }}
                      enableUiDataEdit
                      onChange={ReportTypeChanged}
                    />
                  </Authorization>
                </Column>
                {isFetchingOptions && (
                  <LoaderWrapper>
                    <Loader isLoading={true} />
                  </LoaderWrapper>
                )}
                {fields &&
                  !isFetchingOptions &&
                  Object.entries(fields).map(([key, value], index) => {
                    return (
                      <Column large={3} medium={4} small={6} key={index}>
                        <FormField
                          fieldAttributes={value}
                          overrideValues={{
                            fieldType: formatType(value),
                          }}
                          disableDirty
                          name={key}
                        />
                      </Column>
                    );
                  })}
                {!isAsync && fields && !isFetchingOptions && (
                  <Column
                    small={3}
                    style={{
                      margin: "10px 0",
                    }}
                  >
                    <Button
                      className={ButtonColors.SUCCESS}
                      disabled={isFetchingReportData}
                      text="Luo raportti"
                      onClick={getReportData}
                    />
                  </Column>
                )}
                {isAsync && (
                  <Column
                    small={3}
                    style={{
                      margin: "10px 0",
                    }}
                  >
                    <Button
                      className={ButtonColors.SUCCESS}
                      disabled={isSendingMail}
                      text="Lähetä sähköpostiin"
                      onClick={sendToMail}
                    />
                  </Column>
                )}
              </Row>
            </Column>
          </Row>
        </form>
      )}
    </Form>
  );
};

export default LeaseStatisticReportForm;
