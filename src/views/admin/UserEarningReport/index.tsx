'use client';

import React, { useContext, useState, useEffect } from 'react';
import AdminLayout from '@/views/shared/layouts/AdminLayout';
import ApplicationContext from '@/contexts/ApplicationContext';
import moment, { Moment } from 'moment';
import LoadingSpinner from '@/components/LoadingSpinner';
import MUIDataTable, { Responsive, SelectableRows } from 'mui-datatables';

import {
  Box,
  Typography,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { IEarningLink, IUser } from '@/types';
import { PaymentStatus } from '@/utils/constants';


const initialColumns = [
  { 
    name: 'passdrop_url', 
    label: 'URL',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'price',
    label: 'Price',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'count',
    label: 'Downloads',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'total',
    label: 'Collected',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'fee',
    label: 'Fees',
    options: {
      filter: false,
      display: true,
    }
  },
];

const UserEarningReport = ({ userList }: { userList: IUser[] }): JSX.Element => {
  const theme = useTheme();

  const { authenticated } = useContext(ApplicationContext);
  const { data: session } = useSession();

  const [period, setPeriod] = useState<string>('2');
  const [isLoadProcessing, setIsLoadProcessing] = useState<boolean>(false);
  const [dateList] = useState(Array.from(new Array(3), (_, k: number) => {
    return moment().subtract(k + 1, 'month');
  }));
  const [userId, setUserId] = useState<string>('');
  const [earningLinkList, setEarningLinkList] = useState<IEarningLink[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalFee, setTotalFee] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    getList(userId, period);
  }, []);

  const options = {
    selectableRows: 'none' as SelectableRows,
    confirmFilters: false,
    search: false,
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    // filterType: 'dropdown',
    responsive: 'vertical' as Responsive,
    tableBodyHeight: '300px',
    searchPlaceHolder: 'User',
    serverSide: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30],
    onViewColumnsChange: (changedColumn: string, action: string): void => {
      const colIndex = columns.findIndex(v => v.name === changedColumn);
      if (colIndex < 0) return;

      columns[colIndex].options.display = action === 'add' ? true : false;
      setColumns([ ...columns ]);
    },
  };

  const handlePeriodChange = (e: SelectChangeEvent): void => {
    setPeriod(e.target.value);
    getList(userId, e.target.value);
  };

  const handleUserChange = (e: SelectChangeEvent): void => {
    setUserId(e.target.value);
    getList(e.target.value, period);
  };

  const getList = async (userId?: string, period?: string): Promise<void> => {
    if (!userId || !period) return;

    setIsLoadProcessing(true);
    try {
      const response = await fetch(
        '/api/gateway/get-earning-link-list',
        {
          method: 'POST',
          body: JSON.stringify({userId: parseInt(userId, 10), period: period})
        }
      );
      const json = await response.json();
      const list: IEarningLink[] = json.data.map((v: IEarningLink) => ({
        ...v,
        fee: v.total * 0.1 + 0.30
      }));
      setEarningLinkList(list);

      const totalAmount = list.reduce((acc, cur: IEarningLink) => cur.total + acc, 0);
      const totalFee = list.reduce((acc, cur: IEarningLink) => cur.fee! + acc, 0);
      const totalPaid = list.reduce((acc, cur: IEarningLink) => acc + (cur.status === PaymentStatus.Done ? cur.total - cur.fee! : 0), 0);
      
      setTotalAmount(totalAmount);
      setTotalFee(totalFee);
      setTotalPaid(totalPaid);

    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoadProcessing(false);
    }
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
          User Earning Report
        </Typography>
      </Box>
      <Divider />
      <Box py="2rem" px="1rem" width={1}>
        <Box>
          <Typography variant="h6">Payment Report</Typography>
          <Box
            display="flex"
            columnGap={1}
            alignItems="center"
            mt={1}
          >
            <Typography
              variant="subtitle2"
              component="label"
              color="text.secondary"
            >
              User Name:
            </Typography>
            <Typography
              variant="subtitle1"
              component="label"
            >
              {authenticated&& session?.user.user_name}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Select User</InputLabel>
              <Select
                value={userId}
                onChange={(e) => handleUserChange(e)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {userList.map((user: IUser, index: number) =>
                  <MenuItem key={index} value={user.id}>{user.user_name}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={period}
                onChange={(e) => handlePeriodChange(e)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'1'}>Current Unpaid</MenuItem>
                <MenuItem value={'2'}>All Time</MenuItem>
                {dateList.map((v: Moment, k: number) =>
                  <MenuItem key={k} value={v.format('YYYY-MM')}>{v.format('MMMM YYYY')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box position="relative" mt={1}>
          {isLoadProcessing&& <LoadingSpinner />}
          <Box>
            {authenticated&&
              <MUIDataTable
                title={undefined}
                data={earningLinkList}
                columns={columns}
                options={options}
              />
            }
          </Box>
        </Box>
        <Grid container justifyContent="flex-end" mt="1rem">
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              sx={{ borderBottom: `1px solid ${theme.palette.common.gray}` }}
              py={1}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700 }}           
              >
                Total
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ borderBottom: `1px solid ${theme.palette.common.gray}` }}
              bgcolor="background.level1"
              p={1}
            >
              <Typography
                component="label"
                variant="subtitle2"
                color="text.secondary"
              >
                Total Collected:
              </Typography>
              <Typography
                variant="subtitle1"                
              >
                {`$${totalAmount}`}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ borderBottom: `1px solid ${theme.palette.common.gray}` }}
              p={1}
            >
              <Typography
                component="label"
                variant="subtitle2"
                color="text.secondary"
              >
                Total Fees:
              </Typography>
              <Typography
                variant="subtitle1"                
              >
                {`$${totalFee}`}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ borderBottom: `1px solid ${theme.palette.common.gray}` }}
              bgcolor="background.level1"
              p={1}
            >
              <Typography
                component="label"
                variant="subtitle2"
                color="text.secondary"
              >
                Total Paid Out (date of payment):
              </Typography>
              <Typography
                variant="subtitle1"                
              >
                {`$${totalPaid}`}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ borderBottom: `1px solid ${theme.palette.common.gray}` }}
              p={1}
            >
              <Typography
                component="label"
                variant="subtitle2"
                color="text.secondary"
              >
                Outstanding:
              </Typography>
              <Typography
                variant="subtitle1"                
              >
                {`$${totalAmount - totalFee - totalPaid}`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default UserEarningReport;