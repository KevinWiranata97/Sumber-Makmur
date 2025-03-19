import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif', // Change this to your desired font
  },
});

interface Column {
  field: string;
  headerName: string;
  flex?: number;
  valueGetter?: (params: any) => any;
}

interface MUITableProps {
  columns: Column[];
  data: Array<{ [key: string]: any }>;
  rowCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MUITable: React.FC<MUITableProps> = ({ columns, data, rowCount, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} style={{ flex: column.flex, color: '#707070', fontSize: '16px', fontWeight: 600 }}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.field}style={{ flex: column.flex, fontSize: '13px', fontWeight: 300 }}>
                    {column.valueGetter ? column.valueGetter(row) : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rowCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </ThemeProvider>
  );
};

export default MUITable;
