'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/shared/layouts/AdminLayout';
import MUIDataTable, { Responsive, SelectableRows } from 'mui-datatables';
import LoadingSpinner from '@/components/LoadingSpinner';

import {
  Box,
  Typography,
  Divider,
  Card,
  Button,
  TextField,
  TableRow,
  TableCell,
  IconButton,
  Chip,
} from '@mui/material';
import {
  FileCopy as FileCopyIcon,
  Search as SearchIcon,
  RestartAlt as RestartAltIcon,
  Face5
} from '@mui/icons-material';

import { IUserAnalytics } from '@/types';
import { toast } from 'react-toastify';
import { CustomToastOptions, UserLevel } from '@/utils/constants';

const initialColumns = [
  {
    name: 'No',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'User name',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'Email',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'Links',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'Downloads',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'Is Pro ?',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'Stripe ID',
    options: {
      filter: false,
      display: true,
    }
  }, 
  {
    name: 'Subscription ID',
    options: {
      filter: false,
      display: true,
    }
  }, 
  {
    name: 'Logo',
    options: {
      filter: false,
      display: true,
    }
  }, 
  {
    name: 'Action',
    options: {
      filter: false,
      display: true,
    }
  }
];

const ManageUsers = () => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [columns, setColumns] = useState(initialColumns);
  const [isLoadProcessing, setIsLoadProcessing] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userAnalyticsList, setUserAnalyticsList] = useState<IUserAnalytics[]>([]);
  const [curPage, setCurPage] = useState<number>(0);
  const [count, setCount] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(30);

  useEffect(() => {
    if (initiated) return;

    setInitiated(true);
    getUserAnalyticsList(curPage, rowPerPage);
  }, []);

  const options = {
    selectableRows: 'none' as SelectableRows,
    elevation: 0,
    confirmFilters: false,
    search: false,
    download: false,
    print: false,
    viewColumns: true,
    filter: false,
    // filterType: 'dropdown',
    responsive: 'vertical' as Responsive,
    // tableBodyHeight: '500px',
    searchPlaceHolder: 'User',
    serverSide: true,
    rowsPerPage: rowPerPage,
    count: count,
    page: curPage,
    rowsPerPageOptions: [30, 50, 100],
    onTableChange: (action: any, state: any): void => {
      // console.log(action, state);
      switch (action) {
        case 'changePage':
          changePage(state.page, state.rowsPerPage);
          break;
        case 'changeRowsPerPage':
          changePage(1, state.rowsPerPage);
          break;
      }
    },
    onViewColumnsChange: (changedColumn: string, action: string): void => {
      // console.log(changedColumn, action);
      const colIndex = columns.findIndex(v => v.name === changedColumn);
      if (colIndex < 0) return;

      columns[colIndex].options.display = action === 'add' ? true : false;
      setColumns([ ...columns ]);
    },

    customRowRender: (data: (string|number)[]): JSX.Element => {
      const [ no, userName, email, linkCount, downloadCount, isPro, stripeId, subscriptionId, logo ] = data;
     
      return (
        <TableRow key={no}>
          {columns[0].options.display&&
            <TableCell sx={{ width: '2%', p: '8px' }}>{no}</TableCell>
          }
          {columns[1].options.display&&
            <TableCell sx={{ width: '15%', wordBreak: 'break-all', p: '8px' }}>{userName}</TableCell>
          }
          {columns[2].options.display&&
            <TableCell sx={{ width: '20%', wordBreak: 'break-all', p: '8px' }}>{email}</TableCell>
          }
          {columns[3].options.display&&
            <TableCell sx={{ width: '2%', p: '8px' }}>{linkCount}</TableCell>
          }
          {columns[4].options.display&&
            <TableCell sx={{ width: '2%', p: '8px' }}>{downloadCount}</TableCell>
          }
          {columns[5].options.display&&
            <TableCell sx={{ width: '2%', p: '8px' }}>
              {isPro === UserLevel.Pro ? <Chip label="Pro" color="success" size="small" /> : <Chip variant="outlined" label="No" color="warning" size="small" />}
            </TableCell>
          }
          {columns[6].options.display&&
            <TableCell sx={{ width: '15%', wordBreak: 'break-all', p: '8px' }}>{stripeId}</TableCell>
          }
          {columns[7].options.display&&
            <TableCell sx={{ width: '15%', wordBreak: 'break-all', p: '8px' }}>{subscriptionId}</TableCell>
          }
          {columns[8].options.display&&
            <TableCell sx={{ width: '5%', p: '8px' }}>
              {logo
                ?
                <Box
                  component="img"
                  src={String(logo)}
                  width="50px"
                  height="50px"
                />
                : 
                <Face5
                  sx={{
                    width: '50px',
                    height: '50px',
                    opacity: '.5',
                  }}
                />
              }
            </TableCell>
          }
          {columns[9].options.display&&
            <TableCell sx={{ p: '8px' }}><IconButton size="small"><FileCopyIcon/></IconButton></TableCell>
          }
        </TableRow>
      );
    },
  };

  const changePage = (page: number, rowPerPage: number) => {
    getUserAnalyticsList(page, rowPerPage);
  };

  const getUserAnalyticsList = async (page: number, rowPerPage: number): Promise<void> => {
    if (isLoadProcessing) return;
    
    setIsLoadProcessing(true);
    try {
      const response = await fetch(
        '/api/gateway/user-analytics',
        {
          method: 'POST',
          body: JSON.stringify({ userName, page, rowPerPage })
        }
      );
      const json = await response.json();
      if (json.success) {
        const list = json.data.map((v: IUserAnalytics, index: number) => {
          return [json.page * json.rowPerPage + index + 1, v.user_name, v.user_email, v.link_count, v.download_count, v.is_pro, v.stripe_id, v.subscription_id, v.logo, ''];
        });
        
        setCount(json.count);
        setCurPage(json.page);
        setRowPerPage(json.rowPerPage);
        setUserAnalyticsList(list);
      } else {
        toast.error(json.message, CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsLoadProcessing(false);
    }
  };

  const handleReset = (): void => {
    setUserName('');
  };

  return (
    <AdminLayout>
      <Box mb="2rem">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Manage Users
        </Typography>
      </Box>
      <Divider />
      <Box mt={1}>
        <Card sx={{ bgcolor: 'background.paper', p: '2rem' }}>
          <Box>
            <Typography>Filter By:</Typography>
          </Box>
          <Box
            display="flex"
            rowGap="1rem"
            columnGap="1rem"
            flexDirection={{ xs: 'column', md: 'row' }}
          >
            <TextField
              label="User name:"
              variant="standard"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Box>
          <Box
            display="flex"
            columnGap="1rem"
            mt="1rem"
          >
            <Button variant="contained" onClick={() => getUserAnalyticsList(0, rowPerPage)}>
              <SearchIcon />
              Apply
            </Button>
            <Button variant="outlined" color="error" onClick={handleReset}>
              <RestartAltIcon />
              Reset
            </Button>
          </Box>
        </Card>
      </Box>
      <Box position="relative" mt={1}>
        {isLoadProcessing&& <LoadingSpinner />}
        {initiated&&
          <MUIDataTable
            title="Search Result"
            data={userAnalyticsList}
            columns={columns}
            options={options}
          />
        }
      </Box>
    </AdminLayout>
  );
};

export default ManageUsers;