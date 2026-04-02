import React from 'react';

type IconProps = {
  width?: number,
  height?: number,
  color?: string,
}

export const DropboxIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>dropbox</title>
      <rect width="24" height="24" fill="none"/>
      <path fill={color} d="M12,14.56l4.35,3.6L18.2,17V18.3L12,22,5.82,18.3V17l1.86,1.21L12,14.56M7.68,2.5,12,6.09,16.32,2.5l6.18,4L18.23,9.94l4.27,3.42-6.18,4L12,13.78,7.68,17.39l-6.18-4L5.77,9.94,1.5,6.5l6.18-4M12,13.68l6.13-3.74L12,6.19,5.87,9.94Z"/>
    </svg>
  );
};

export const FacebookIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg width={width} height={height} viewBox="-6 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path style={{ fill: color }} d="m12.462.173v3.808h-2.265c-.079-.011-.171-.017-.264-.017-.542 0-1.036.203-1.411.538l.002-.002c-.275.384-.439.863-.439 1.381 0 .062.002.124.007.185v-.008 2.726h4.229l-.56 4.27h-3.663v10.946h-4.417v-10.947h-3.68v-4.269h3.68v-3.145c-.007-.102-.011-.222-.011-.342 0-1.478.575-2.822 1.513-3.82l-.003.003c.972-.92 2.288-1.485 3.735-1.485.09 0 .18.002.27.007h-.013c.118-.002.256-.003.395-.003 1.02 0 2.025.064 3.011.188l-.117-.012z"/>
    </svg>
  );
};

export const TwitterIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg fill={color} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
      <path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z"/>
    </svg>
  );
};

export const OpenFolderIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <path fill={color} d="M14 6v-2h-7l-1-2h-4l-1 2h-1v9.5l3-7.5z"></path>
      <path fill={color} d="M3.7 7l-3.2 8h12.8l2.5-8z"></path>
    </svg>
  );
};

export const LinkIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg fill={color} width={width} height={height} viewBox="0 0 24 24" data-name="Line Color" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5,19.5h0a3,3,0,0,1,0-4.24L6.76,13A3,3,0,0,1,11,13h0a3,3,0,0,1,0,4.24L8.74,19.5A3,3,0,0,1,4.5,19.5ZM17.24,11,20,8.24A3,3,0,0,0,20,4h0a3,3,0,0,0-4.24,0L13,6.76A3,3,0,0,0,13,11h0A3,3,0,0,0,17.24,11Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      <line x1="10" y1="14" x2="14" y2="10" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
    </svg>
  );
};

export const ChartIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg fill={color} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
      width={width} height={height} viewBox="0 0 20 20" enableBackground="new 0 0 20 20" xmlSpace="preserve">
      <path d="M19,20H1c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v17h17c0.6,0,1,0.4,1,1S19.6,20,19,20z"/>
      <rect x="4" y="12" width="3" height="4"/>
      <rect x="9" y="5" width="3" height="11"/>
      <rect x="14" y="9" width="3" height="7"/>
    </svg>
  );
};

export const FilesIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <path d="M12.497 0h-6.497v2.010h1v-1.010h5v4h4v8h-4.017v1h5.017v-9.818l-4.503-4.182zM13 1.832l2.335 2.168h-2.335v-2.168zM0 3v14h11v-9.818l-4.503-4.182h-6.497zM7 4.832l2.335 2.168h-2.335v-2.168zM1 16v-12h5v4h4v8h-9z" fill={color} />
    </svg>
  );
};

export const ExclamationIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <path fill={color} d="M6 0h4v4l-1 7h-2l-1-7z"></path>
      <path fill={color} d="M10 14c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"></path>
    </svg>
  );
};

export const ClockIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <path fill={color} d="M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM8 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>
      <path fill={color} d="M8 3h-1v6h5v-1h-4z"></path>
    </svg>
  );
};

export const ScissorsIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 24, height = 24, color = '#000' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d="M37.428 32l18.57-15.572c-1.052-1.857-2.48-2.645-4.25-2.645c-4.889 0-12.373 6.025-21.611 12.102l-1.664-1.395s-5.913-2.641-6.5-3.825a9.935 9.935 0 0 0 3.561-2.571c3.583-4.089 3.101-10.239-1.076-13.744C20.277.846 13.987 1.315 10.402 5.404C6.817 9.49 7.3 15.642 11.481 19.146c.453.383 1.734 1.163 1.821 1.211c5.332 2.807 8.301 4.938 9.953 6.39c.363.465 2.027 2.315 2.027 2.315a5.92 5.92 0 0 0-.873 1.097c-.396.616-.607 1.278-.573 1.973c.019.468.148.921.368 1.355c.013.027.03.055.045.082a6.063 6.063 0 0 0 1.033 1.371s-1.415 1.625-1.784 2.095c-1.595 1.452-4.587 3.657-10.196 6.608c-.087.048-1.368.828-1.821 1.211c-4.182 3.504-4.664 9.656-1.08 13.743c3.583 4.089 9.875 4.56 14.056 1.054c4.177-3.503 4.659-9.655 1.076-13.744a9.896 9.896 0 0 0-3.561-2.569c.587-1.187 6.5-3.825 6.5-3.825l1.662-1.393c9.234 6.077 16.725 12.1 21.615 12.1c1.768 0 3.197-.787 4.25-2.645L37.428 32M14.611 15.576a4.963 4.963 0 0 1-.555-7.11c1.85-2.112 5.104-2.358 7.269-.543a4.965 4.965 0 0 1 .555 7.107c-1.852 2.113-5.109 2.358-7.269.546m6.714 40.503c-2.164 1.814-5.419 1.567-7.269-.544a4.964 4.964 0 0 1 .555-7.111c2.16-1.811 5.415-1.567 7.269.548a4.965 4.965 0 0 1-.555 7.107m6.817-29.398l.339.284c-.532.341-1.072.68-1.613 1.018l-.144-.16a54.734 54.734 0 0 1-.344-.383l1.762-.759m.179 10.487l-1.779-.78c.07-.082.141-.161.202-.232l1.133-1.302l-1.222-1.224c-.657-.66-.959-1.261-.896-1.788c.076-.65.718-1.394 1.76-2.039c3.34-2.069 6.545-4.263 9.374-6.198c6.229-4.265 11.609-7.947 14.854-7.947c.506 0 1.064.079 1.616.508L28.321 37.168M51.75 48.344c-3.247 0-8.629-3.683-14.857-7.947a396.126 396.126 0 0 0-5.25-3.543l4.313-3.618l17.41 14.601c-.553.428-1.111.507-1.616.507" fill={color}></path>
      <path d="M30.876 30.551a1.947 1.947 0 0 0-2.698.259a1.844 1.844 0 0 0 .264 2.638a1.945 1.945 0 0 0 2.699-.258a1.849 1.849 0 0 0-.265-2.639" fill={color}></path>
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 12, height = 12, color = '#fff' } = props;

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={color}
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const Notions11Icon: React.FC<IconProps> = (props): JSX.Element => {
  const { width = 20, height = 20, color = '#000' } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 30 30" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M1.805 1.294l16.6-1.226c2.039-.175 2.563-.057 3.845.875l5.299 3.733c.874.642 1.165.817 1.165 1.516v20.473c0 1.283-.466 2.042-2.097 2.158L7.34 29.99c-1.224.058-1.807-.117-2.448-.934L.99 23.982c-.7-.934-.99-1.633-.99-2.45V3.334c0-1.049.466-1.924 1.805-2.04z" fill="#fff"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M18.405.068l-16.6 1.226C.466 1.41 0 2.285 0 3.334v18.198c0 .817.29 1.516.99 2.45l3.902 5.074c.641.817 1.224.992 2.448.934l19.277-1.167c1.63-.116 2.097-.875 2.097-2.158V6.192c0-.663-.262-.854-1.033-1.42a85.473 85.473 0 01-.133-.096L22.25.943c-1.282-.932-1.806-1.05-3.845-.875zM7.776 5.857c-1.574.106-1.931.13-2.825-.597L2.678 3.452c-.231-.234-.115-.526.467-.584l15.958-1.166c1.34-.117 2.038.35 2.562.758l2.737 1.983c.117.059.408.408.058.408l-16.48.992-.204.014zM5.941 26.49V9.11c0-.759.233-1.109.931-1.168L25.8 6.834c.642-.058.932.35.932 1.108v17.264c0 .759-.117 1.401-1.165 1.459l-18.113 1.05c-1.048.058-1.513-.291-1.513-1.225zm17.88-16.448c.116.525 0 1.05-.525 1.11l-.873.173v12.832c-.758.408-1.456.641-2.039.641-.932 0-1.165-.292-1.863-1.166l-5.709-8.982v8.69l1.806.409s0 1.05-1.457 1.05l-4.017.233c-.117-.234 0-.817.407-.933l1.049-.291v-11.49L9.144 12.2c-.117-.525.174-1.283.99-1.342l4.31-.29 5.94 9.098v-8.049l-1.514-.174c-.117-.643.349-1.11.931-1.167l4.02-.234z" fill="#000"></path>
    </svg>
  );
};










