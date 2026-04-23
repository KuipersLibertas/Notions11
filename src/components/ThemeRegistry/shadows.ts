import { alpha } from '@mui/material/styles';

const shadows = (
  themeMode = 'light',
): [
  'none',
  string, string, string, string, string,
  string, string, string, string, string,
  string, string, string, string, string,
  string, string, string, string, string,
  string, string, string, string,
] => {
  const rgb = themeMode === 'light' ? '15, 23, 42' : '0, 0, 0';

  return [
    'none',
    `0 1px 3px 0 rgba(${rgb}, 0.08), 0 1px 2px -1px rgba(${rgb}, 0.08)`,
    `0 4px 6px -1px rgba(${rgb}, 0.07), 0 2px 4px -2px rgba(${rgb}, 0.07)`,
    `0 10px 15px -3px rgba(${rgb}, 0.07), 0 4px 6px -4px rgba(${rgb}, 0.06)`,
    `0 20px 25px -5px rgba(${rgb}, 0.08), 0 8px 10px -6px rgba(${rgb}, 0.07)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
    `0 25px 50px -12px rgba(${rgb}, 0.18)`,
  ];
};

export default shadows;
