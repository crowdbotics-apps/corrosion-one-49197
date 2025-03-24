import React from 'react';
import {DOTS, usePagination} from './usePagination';
import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import MDButton from "../../MDButton";
import MDBox from "../../MDBox";

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
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

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <MDBox ml={'auto'} sx={{height: 50}} display={'flex'}>
      <MDBox>
        <MDButton ml={'auto'} onClick={onPrevious} disabled={currentPage === 1}>
          <ArrowLeft sx={{color: '#666666', transform: 'scale(2.5)'}}/>
        </MDButton>
      </MDBox>


      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return <MDButton key={`id-page${index}`} sx={{color: '#666666'}}>&#8230;</MDButton>;
        }

        if (pageNumber === currentPage) {
          return (
            <MDBox ml={1} mr={1} key={`id-page-number-${index}`}>
              <MDButton
                iconOnly
                my={1}
                color={'secondary'}
                key={pageNumber + ''}
                onClick={() => null}
              >
                {pageNumber}
              </MDButton>
            </MDBox>

          );
        } else {
          return (
            <MDBox ml={1} mr={1} key={`id-page-number2-${index}`}>
            <MDButton
              iconOnly
              m={1}
              color={'secondary'}
              variant={'outlined'}
              key={pageNumber + ''}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </MDButton>
            </MDBox>
          );
        }


      })}
      <MDBox>
        <MDButton disabled={currentPage === lastPage} onClick={onNext}>
          <ArrowRight sx={{color: '#666666', transform: 'scale(2.5)'}}/>
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default Pagination;
