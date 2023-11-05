import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DataTable from 'react-data-table-component';
import { FaTrash } from 'react-icons/fa';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useConfirmContext from '~/hooks/hookContext/useConfirmContext';

function TableBase(
  {
    maDanhMuc,
    uniquekey,
    columns,
    data,
    title,
    onChangePage,
    onChangeRowsPerPage,
    onRowClicked,
    onSelectedRowsChange,
    progressPending = false,
    paginationTotalRows,
    paginationPerPage = 20,
    fixedHeaderScrollHeight,
    loadData = () => {},
    isDeleted = false,
    isOpenDm,
  },
  ref
) {
  const theme = useTheme();
  const { asyncDelete } = useApisContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const confirmContext = useConfirmContext();

  // handle selected row change
  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    onSelectedRowsChange?.(selectedRows);
  };
  // handle delete row
  const handleDeleteRow = async () => {
    if (selectedRows && selectedRows.length > 0) {
      const dataPost = {
        uniqueValues: selectedRows.map((item) => item[uniquekey]),
      };
      const resp = await asyncDelete(maDanhMuc, dataPost);
      if (!resp?.message) {
        handleSelectedRowsChange({ selectedRows: [] });
        setToggleCleared(!toggleCleared);
        loadData();
      }
    } else {
      return;
    }
  };

  // render delete button
  const renderDeleteButton = () => {
    return (
      <Tooltip placement="top" title="Chuyển vào thùng rác" arrow>
        <IconButton
          ref={ref}
          sx={{
            backgroundColor: 'error.main',
            color: 'whitish.pureWhite',
            borderRadius: '4px',
            '&:hover': { backgroundColor: 'error.main' },
          }}
          onClick={() =>
            confirmContext({
              title: 'Xác nhận',
              onConfirm: handleDeleteRow,
              content: (
                <Box sx={{ padding: '0 10px' }}>
                  <Typography sx={{ fontSize: '14px', textAlign: 'center' }}>
                    Bạn có chắc muốn xóa <b>{selectedRows.length}</b> {title} đã
                    chọn không ?
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      textAlign: 'center',
                      fontStyle: 'italic',
                      color: 'primary.main',
                      marginTop: '10px',
                    }}
                  >
                    Lưu ý: sau khi đồng ý, {title} sẽ bị xóa vĩnh viễn
                  </Typography>
                </Box>
              ),
            })
          }
        >
          <FaTrash fontSize="14px" />
        </IconButton>
      </Tooltip>
    );
  };

  useEffect(() => {
    handleSelectedRowsChange({ selectedRows: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maDanhMuc]);

  return (
    <>
      <Box sx={{ position: 'fixed', top: 0, left: 0, visibility: 'hidden' }}>
        {renderDeleteButton()}
      </Box>
      <DataTable
        fixedHeader
        fixedHeaderScrollHeight={fixedHeaderScrollHeight}
        persistTableHead
        noContextMenu
        columns={columns}
        data={data}
        pointerOnHover
        highlightOnHover
        striped
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onRowClicked={onRowClicked}
        selectableRows
        clearSelectedRows={toggleCleared}
        onSelectedRowsChange={handleSelectedRowsChange}
        responsive
        pagination
        paginationServer
        paginationTotalRows={paginationTotalRows}
        paginationPerPage={paginationPerPage}
        paginationDefaultPage={1}
        paginationRowsPerPageOptions={[20, 50, 100, 500]}
        paginationComponentOptions={{
          rowsPerPageText: 'Dòng trên bảng',
          rangeSeparatorText: 'trên',
        }}
        progressPending={progressPending}
        progressComponent={
          <Box
            sx={{
              width: '100%',
              height: '100px',
              paddingTop: '20px',
              textAlign: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        }
        noDataComponent={
          <Typography
            sx={{ fontSize: '13px', textAlign: 'center', padding: '20px 0' }}
          >
            {title ? `Không có ${title}` : 'Không có dữ liệu'}
          </Typography>
        }
        customStyles={{
          headCells: {
            style: {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.whitish.pureWhite,
            },
          },
        }}
      />
    </>
  );
}

export default forwardRef(TableBase);
