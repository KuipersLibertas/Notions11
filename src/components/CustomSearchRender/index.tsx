import React from 'react';

import {
  Grow,
  TextField,
  IconButton,
  Box,
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';

type CustomSearchRenderProps = {
  onSearch: (text: string) => void,
  onHide: () => void,
  searchText: string,
  options: any
}

class CustomSearchRender extends React.Component<CustomSearchRenderProps> {
  handleUserNameChange = (text: string) => {
    this.props.onSearch(text);
  };

  handleUrlChange = (text: string) => {
    this.props.onSearch(text);
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown = (event: any) => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  render() {
    const { options, onHide, searchText } = this.props;

    return (
      <Grow appear in={true} timeout={300}>
        <Box
          display="flex"
          alignItems="center"
          columnGap={1}
        >
          <TextField
            placeholder="Keyword:"
            value={searchText || ''}
            onChange={(e) => this.handleUserNameChange(e.target.value)}
            InputProps={{
              'aria-label': options.textLabels.toolbar.search,
              style: {
                height: '2rem',
              }
            }}
          />
          <IconButton onClick={onHide}>
            <ClearIcon />
          </IconButton>
        </Box>
      </Grow>
    );
  }
}

export default CustomSearchRender;
