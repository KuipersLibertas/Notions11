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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableRow,
  TableCell,
  IconButton,
  SelectChangeEvent,
  Chip,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  AttachMoney as AttachMoneyIcon,
  Search as SearchIcon,
  FileCopy as FileCopyIcon,
  RestartAlt as RestartAltIcon,  
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { CustomToastOptions, UserLevel } from '@/utils/constants';
import { ILinkReport } from '@/types';

const initialColumns = [
  { 
    name: 'sno',
    label: 'Si.No', 
    options: {
      filter: false,
      display: true,
    }
  },
  // {
  //   name: 'id',
  //   label: 'User ID',
  //   options: {
  //     filter: false,
  //     display: true,
  //   }
  // },
  {
    name: 'user_name',
    label: 'User name',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'user_email',
    label: 'Email',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'passdrop_url',
    label: 'Passdropit URL',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'period_download_count',
    label: 'Day',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'total_download_count',
    label: 'Total',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'is_pro',
    label: 'Is Pro ?',
    options: {
      filter: false,
      display: true,
    }
  },
  {
    name: 'expiry',
    label: 'Expiry',
    options: {
      filter: false,
      display: true,
    }
  }, 
  {
    label: 'Features',
    name: 'feature',
    options: {
      filter: false,
      display: true,
    }
  }
];

const google30Days = 'https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/report/content-pages/a41608328w71115524p73336754/_u.dateOption=last30days&explorer-table.plotKeys=%5B%5D&_r.drilldown=analytics.pagePath:~2Fdownload~2Fgo~2F';
const googleSearch = 'https://www.google.com/search?q=notions11.com/';
const adsense30Days = 'https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/report/content-publisher-pages/a41608328w71115524p73336754/_u.dateOption=last30days&explorer-table.plotKeys=%5B%5D&_r.drilldown=analytics.pagePath:~2Fdownload~2Fgo~2F';

const LinkReport = () => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [columns, setColumns] = useState(initialColumns);
  const [period, setPeriod] = useState<string>('1');
  const [userName, setUserName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isLoadProcessing, setIsLoadProcessing] = useState<boolean>(false);
  const [linkReportList, setLinkReportList] = useState<ILinkReport[]>([]);

  useEffect(() => {
    if (initiated) return;

    setInitiated(true);
    getLinkReportList();
  }, []);

  const getLinkReportList = async (): Promise<void> => {
    if (isLoadProcessing) return;

    setIsLoadProcessing(true);
    try {
      const response = await fetch(
        '/api/gateway/link-report',
        {
          method: 'POST',
          body: JSON.stringify({
            period,
            userName,
            url
          })
        }
      );
      const json = await response.json();
      console.log(json);
      if (json.success) {
        const list = json.data.map((v: ILinkReport, index: number) => {
          return [index + 1, v.user_name, v.user_email, v.passdrop_url, v.period_download_count, v.total_download_count, v.is_pro, ''];
        });
        setLinkReportList(list);
      } else {
        toast.error(json.message, CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsLoadProcessing(false);
    }
  };

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
    serverSide: false,
    rowsPerPage: 50,
    rowsPerPageOptions: [50, 100, 150],
    // onTableChange: (action: any, state: any): void => {
    //   console.log(action);
    //   console.dir(state);
    // },
    onViewColumnsChange: (changedColumn: string, action: string): void => {
      console.log(changedColumn, action);
      const colIndex = columns.findIndex(v => v.name === changedColumn);
      if (colIndex < 0) return;

      columns[colIndex].options.display = action === 'add' ? true : false;
      setColumns([ ...columns ]);
    },

    customRowRender: (data: (string|number)[]) => {
      const [ no, userName, email, url, dailyCount, totalCount, isPro, isExpired ] = data;
     
      return (
        <TableRow key={no}>
          {columns[0].options.display&&
            <TableCell sx={{ width: '2%' }}>{no}</TableCell>
          }
          {/* {columns[1].options.display&&
            <TableCell sx={{ width: '2%' }}>{userId}</TableCell>
          } */}
          {columns[1].options.display&&
            <TableCell sx={{ width: '15%', wordBreak: 'break-all' }}>{userName?? '-'}</TableCell>
          }
          {columns[2].options.display&&
            <TableCell sx={{ width: '20%', wordBreak: 'break-all' }}>{email?? '-'}</TableCell>
          }
          {columns[3].options.display&&
            <TableCell sx={{ width: '50%', wordBreak: 'break-all' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ width: '50%' }}>{url}</Typography>
                <Box>
                  <IconButton
                    size="small"
                    href={`${google30Days}${url}`}
                    target="_blank"
                  >
                    <AnalyticsIcon/>
                  </IconButton>
                  <IconButton
                    size="small"
                    href={`${adsense30Days}${url}`}
                    target="_blank"
                  >
                    <AttachMoneyIcon/>
                  </IconButton>
                  <IconButton
                    size="small"
                    href={`${googleSearch}${url}`}
                    target="_blank"
                  >
                    <SearchIcon/>
                  </IconButton>
                </Box>
              </Box>
            </TableCell>
          }
          {columns[4].options.display&&
            <TableCell sx={{ width: '2%' }}>{dailyCount}</TableCell>
          }
          {columns[5].options.display&&
            <TableCell sx={{ width: '2%' }}>{totalCount}</TableCell>
          }
          {columns[6].options.display&&
            <TableCell sx={{ width: '2%' }}>
              {isPro === UserLevel.Pro ? <Chip label="Pro" color="success" size="small" /> : <Chip variant="outlined" label="No" color="warning" size="small" />}
            </TableCell>
          }
          {columns[7].options.display&&
            <TableCell sx={{ width: '5%' }}>{isExpired}</TableCell>
          }
          {columns[8].options.display&&
            <TableCell><IconButton size="small"><FileCopyIcon/></IconButton></TableCell>
          }
        </TableRow>
      );
    },
  };

  const handlePeriodChange = (e: SelectChangeEvent) => {
    setPeriod(e.target.value);
  };

  const handleReset = (): void => {
    setUserName('');
    setPeriod('1');
    setUrl('');
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
          Link Report
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
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Period</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Period"
                value={period}
                onChange={(e) => handlePeriodChange(e)}
              >
                <MenuItem value={'1'}>24hr Downloads</MenuItem>
                <MenuItem value={'2'}>7 Day Downloads</MenuItem>
                <MenuItem value={'3'}>30 Day Downloads</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="User name:"
              variant="standard"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} />
            <TextField
              label="Passdroit Url:"
              variant="standard"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>
          <Box
            display="flex"
            columnGap="1rem"
            mt="1rem"
          >
            <Button variant="contained" onClick={getLinkReportList}>
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
            data={linkReportList}
            columns={columns}
            options={options}
          />
        }
      </Box>
    </AdminLayout>
  );
};

export default LinkReport;