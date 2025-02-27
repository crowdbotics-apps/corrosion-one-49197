import React from 'react';
import MDBox from "../MDBox";
import {usePagination} from "./usePagination";
import Icon from "@mui/material/Icon";
import MDTypography from "../MDTypography";
import MDPagination from "../MDPagination";
import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "../MDInput";

export const PaginationCustom = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    startPage,
    endPage,
    setPageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange?.length < 2 || paginationRange === undefined) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  const setEntriesPerPage = (value) => setPageSize(value);

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <MDBox mt={2} sx={{height: 50}} display={'flex'}>
      <MDBox>
        <MDPagination
          item
          onClick={onPrevious}
          disabled={currentPage === 1}
          sx={{
            backgroundColor: "#1E1E1E",
            borderColor: "#282828",
            borderRadius: "2px",
            borderWidth: "1px",
            marginX: "0px",
            height: "44px",
            width: "44px",
          }}
        >
          <Icon sx={{fontWeight: "bold"}}>chevron_left</Icon>
        </MDPagination>
      </MDBox>
      <MDBox
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "44px",
          minWidth: "140px",
          backgroundColor: "#1E1E1E",
          borderColor: "#282828",
          borderWidth: "0px",
          borderBottomWidth: "1px",
          borderTopWidth: "1px",
          borderStyle: "solid"
        }}
      >
        <MDTypography
          sx={{
            fontSize: "14px",
            color: "#F1F1F1",
            textAlign: "center",
            fontFamily: "OpenSans",
          }}
        >
          {startPage} - {endPage} of {totalCount}
        </MDTypography>
      </MDBox>
      <MDBox>
        <MDPagination
          item
          onClick={onNext}
          disabled={currentPage === lastPage}
          sx={{
            backgroundColor: "#1E1E1E",
            borderColor: "#282828",
            borderRadius: "2px",
            borderWidth: "1px",
            marginX: "0px",
            height: "44px",
            width: "44px",
          }}
        >
          <Icon sx={{fontWeight: "bold"}}>chevron_right</Icon>
        </MDPagination>
      </MDBox>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" ml={"20px"} mb={1}>
        <MDBox display="flex" alignItems="center">
          <Autocomplete
            disableClearable
            value={pageSize.toString()}
            options={["5", "10", "15", "20", "25"]}
            onChange={(event, value) => {
              setEntriesPerPage(parseInt(value));
              onPageChange(1)
            }}
            size="small"
            sx={{
              width: "60px",
              height: "44px",
            }}
            renderInput={(params) => <MDInput {...params} sx={{
              width: "60px",
              height: "44px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#1E1E1E",
              borderColor: "#282828",
              borderWidth: "1px",
              borderRadius: "2px",
              borderStyle: "solid",
              ".MuiOutlinedInput-input": {
                color: "#F1F1F1",
                fontSize: "14px",
                fontFamily: "OpenSans",
              },
            }}/>}
          />
          <MDTypography variant="caption" ml={"10px"}
                        sx={{
                          color: "#F1F1F1",
                          fontSize: "12px",
                          fontFamily: "OpenSans"
                        }}>
            Items per page
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};

