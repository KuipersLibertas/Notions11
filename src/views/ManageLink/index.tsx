'use client';

import React, { useState, useCallback } from 'react';
import CommonLayout from '@/views/shared/layouts/CommonLayout';
import Confirm from '@/modals/Confirm';
import EditLink from '@/modals/EditLink';
import Analytics from '@/modals/Analytics';
import LoadingSpinner from '@/components/LoadingSpinner';

import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dns as DnsIcon,
  CloudDownload as CloudDownloadIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { IFile, IPopupOptions, IServerLink } from '@/types';
import { toast } from 'react-toastify';
import { CustomToastOptions } from '@/utils/constants';
import { Notions11Icon } from '@/utils/icons';

type ManageLinkProps = {
  data: IServerLink[],
}

const ManageLink = ({ data }: ManageLinkProps): JSX.Element => {
  const theme = useTheme();
  const [confirmPopupOptions, setConfirmPopupOptions] = useState<IPopupOptions>({ id: 0, opened: false });
  const [editLinkPopupOptions, setEditLinkPopupOptions] = useState<IPopupOptions>({ linkInfo: null, opened: false });
  const [analyticsPopupOptions, setAnalyticsPopupOptions] = useState<IPopupOptions>({ linkInfo: null, opened: false });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [linkList, setLinkList] = useState<IServerLink[]>(data);

  const handleConfirmOk = async (): Promise<void> => {
    if (isProcessing) return;
    
    const linkId = confirmPopupOptions.id;
    setConfirmPopupOptions({ id: 0, opened: false });

    setIsProcessing(true);

    try {
      const response = await fetch(
        '/api/gateway/delete-link',
        {
          method: 'POST',
          body: JSON.stringify({ id: linkId })
        }
      );

      const json = await response.json();
      if (json.success) {
        toast.success('Successfully deleted', CustomToastOptions);

        const list = linkList.filter(v => v.id !== linkId);
        setLinkList(list);
      } else {
        toast.error(json.message, CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
    
  };

  const handleConfirmClose = useCallback((): void => {
    setConfirmPopupOptions({ id: 0, opened: false });
  }, []);

  const handleEditLinkSave = useCallback((link: IServerLink): void => {
    const list = linkList.map(v => {
      if (v.id === link.id) {
        return link;
      } else {
        return v;
      }
    });

    setLinkList(list);
    setEditLinkPopupOptions({ linkInfo: null, opened: false });
  }, []);

  const handleEditLinkClose = useCallback((): void => {
    setEditLinkPopupOptions({ linkInfo: null, opened: false });
  }, []);

  const handleAnalyticsClose = useCallback((): void => {
    setAnalyticsPopupOptions({ linkInfo: null, opened: false });
  }, []);

  const handleClipboardCopy = (text: string) => {
    navigator.clipboard.writeText(`${text}`);
    toast.success('Copied!', CustomToastOptions);
  };

  return (
    <CommonLayout title="Manage Links">
      {isProcessing&& <LoadingSpinner />}
      <Box
        display={{ xs: 'none', md: 'flex' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        borderBottom = {`1px solid ${theme.palette.common.gray}`}
        borderTop={{ xs: `1px solid ${theme.palette.common.gray}`, md: 'none' }}
        borderLeft={{ xs: `1px solid ${theme.palette.common.gray}`, md: 'none' }}
        borderRight={{ xs: `1px solid ${theme.palette.common.gray}`, md: 'none' }}
        p={1}
        columnGap={2}
        bgcolor="background.level1"
      >
        <Box width={{ xs: 1, md: '50%' }}>
          <Typography variant="subtitle2" fontWeight={500} color="text.secondary">Link</Typography>
        </Box>
        <Box width={{ xs: 1, md: '13%' }}>
          <Typography variant="subtitle2" fontWeight={500} color="text.secondary">Notions11 URL</Typography>
        </Box>
        <Box width={{ xs: 1, md: '13%' }}>
          <Typography variant="subtitle2" fontWeight={500} color="text.secondary">Password</Typography>
        </Box>
        <Box width={{ xs: 1, md: '2%' }} display="flex" justifyContent="center" color="text.secondary">
          <DnsIcon />
        </Box>
        <Box width={{ xs: 1, md: '2%' }} display="flex" justifyContent="center" color="text.secondary">
          <CloudDownloadIcon />
        </Box>
        <Box width={{ xs: 1, md: '2%' }} display="flex" justifyContent="center" color="text.secondary">
          <ScheduleIcon />
        </Box>
        <Box width={{ xs: 1, md: '15%' }} justifyContent="flex-end" color="text.secondary">
          <Typography variant="subtitle2" fontWeight={500} align="right">Actions</Typography>
        </Box>
      </Box>
      {linkList.map((link, index) =>
        <Box
          key={index}
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          borderBottom = {`1px solid ${theme.palette.common.gray}`}
          borderTop={{ xs: `1px solid ${theme.palette.common.gray}`, md: 'none' }}
          borderLeft={{ xs: `1px solid ${theme.palette.common.gray}`, md: 'none' }}
          borderRight={{ xs: `1px solid ${theme.palette.common.gray}`, md: 'none' }}
          px={1}
          alignItems="center"
          columnGap={2}
        >
          <Box width={{ xs: 1, md: '50%' }}>
            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {link.files.map((file: IFile, index: number) =>
                <p key={index}>{file.url}</p>
              )}
            </Typography>
          </Box>
          <Box width={{ xs: 1, md: '13%' }} display="flex" alignItems="center" columnGap={1}>
            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>notions11.com/{link.link}</Typography>
            <IconButton title="Copy" onClick={() => handleClipboardCopy(`${process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}/${link.link}`)}><ContentCopyIcon /></IconButton>
          </Box>
          <Box width={{ xs: 1, md: '13%' }} display="flex" alignItems="center">
            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>{link.password}</Typography>
            <IconButton title="Copy" onClick={() => handleClipboardCopy(link.password)}><ContentCopyIcon /></IconButton>
          </Box>
          <Box width={{ xs: 1, md: '2%' }} display="flex" justifyContent="center">
            <Notions11Icon />
          </Box>
          <Box width={{ xs: 1, md: '2%' }} display="flex" justifyContent="center">
            <Typography variant="subtitle1">{link.downloadCount}</Typography>
          </Box>
          <Box width={{ xs: 1, md: '2%' }} display="flex" justifyContent="center">
            {(link.expiryCount === 0 && !link.expiryOn?.length)&&
              <Typography variant="subtitle1" fontSize={30}>∞</Typography>
            }
            {(link.expiryCount > 0 || link.expiryOn)&&
              <Typography variant="subtitle1">{link.expiryOn}</Typography>
            }
          </Box>
          <Box width={{ xs: 1, md: '15%' }} display="flex" justifyContent="flex-end">
            <IconButton
              onClick={() => {
                setEditLinkPopupOptions({ linkInfo: link, opened: true });
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setAnalyticsPopupOptions({ linkInfo: link, opened: true });
              }}
            >
              <AnalyticsIcon />
            </IconButton>
            <IconButton
              href={`mailto:?subject=Here is a Notions11 link&body=%0A%0AHere is a link to download your file: ${process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}/${link.link} %0A%0A And here is the password: ${link.password} %0A%0A---%0ASent via Notions11 (${process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}), password protection for your Notions links.`}
              title="Share"
            >
              <ShareIcon />
            </IconButton>
            <IconButton target="_blank" href={`/${link.link}`}>
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setConfirmPopupOptions({ id: link.id, opened: true });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      {confirmPopupOptions.opened&&
        <Confirm
          opened={confirmPopupOptions.opened}
          onClose={handleConfirmClose}
          onOk={handleConfirmOk}
          message="Are you sure to delete this link ?"
        />
      }
      {editLinkPopupOptions.opened&&
        <EditLink
          opened={editLinkPopupOptions.opened}
          onClose={handleEditLinkClose}
          onSave={(link: IServerLink) => handleEditLinkSave(link)}
          linkInfo={editLinkPopupOptions.linkInfo!}
        />
      }
      {analyticsPopupOptions.opened&&
        <Analytics
          opened={analyticsPopupOptions.opened}
          onClose={handleAnalyticsClose}
          linkInfo={analyticsPopupOptions.linkInfo}
        />
      }
    </CommonLayout>
  );
};

export default ManageLink;