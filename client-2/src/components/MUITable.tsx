import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Column {
  field: string;
  headerName: string;
  flex?: number;
  valueGetter?: (params: any) => any;
}

interface MUITableProps {
  columns: Column[];
  data: Array<{ [key: string]: any }>;
}

const MUITable: React.FC<MUITableProps> = ({ columns, data }) => {
  console.log('MUITable data:', data); // Log the data being passed to the component

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} style={{ flex: column.flex }}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {column.valueGetter ? column.valueGetter(row) : row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MUITable;
