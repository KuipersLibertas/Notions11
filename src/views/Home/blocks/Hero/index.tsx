import React, { useState } from 'react';
import Container from '@/components/Container';

import {
  Box,
  Typography,
  Button,
  Link,
} from '@mui/material';
import {
  KeyboardDoubleArrowDown
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { IChooseLink } from '@/types';
import EnterLink from '@/views/CreateNewLink/blocks/EnterLink';
import GenerateUrlPwd from '@/views/CreateNewLink/blocks/GenerateUrlPwd';
import ChooseResult from '@/views/CreateNewLink/blocks/ChooseResult';

const Hero = (): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();

  const [step, setStep] = useState<number>(1);
  const [chooseLink, setChooseLink] = useState<IChooseLink>();

  const handleEnteredLink = (chooseLink: IChooseLink) => {
    if (!session?.user) {
      setChooseLink(chooseLink);
      setStep(2);
    }
  };

  const handleSave = (): void => {
    setStep(3);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: `linear-gradient(to bottom, ${alpha(
          theme.palette.background.paper,
          0,
        )}, ${alpha(theme.palette.alternate.main, 1)} 100%)`,
        backgroundRepeat: 'repeat-x',
        position: 'relative',
        minHeight: 'calc(100vh - 50px)'
      }}
    >
      <Box
        paddingTop={{ xs: '1.5rem', sm: '3rem', md: '6rem' }}
        paddingBottom={{ xs: '2rem' }}
      >
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box maxWidth={{ xs: 1, md: 830 }}>
            <Typography
              variant="h2"
              color="text.primary"
              gutterBottom
              textAlign="center"
              sx={{
                fontWeight: 700,
              }}
              data-aos="fade-right"
              data-aos-duration={600}
            >
              Password Protect Notion
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
              textAlign={'center'}
              data-aos="fade-left"
              data-aos-duration={600}
              data-aos-delay={100}
            >
              Paste Notion link to share it&apos;s content
            </Typography>            
            <Box
              display="flex"
              flexDirection="column"
              rowGap={2}
              alignItems="center"
              marginTop={4}
              data-aos="flip-left"
              data-aos-duration={600}
              data-aos-offset={100}
              data-aos-delay={300}
            >
              {!session?.user&&
              <>
                <Typography
                  variant="h6"
                  component="p"
                  textAlign="center"
                  sx={{ fontWeight: 300 }}
                  color="text.secondary"
                >
                  Try basic functions without signing up
                </Typography>
                <Box width={1}>
                  <Box>
                    {step === 1&&
                      <EnterLink onEntered={handleEnteredLink} />
                    }
                    {(chooseLink && step === 2)&&
                      <GenerateUrlPwd linkInfo={chooseLink} onSave={handleSave} />
                    }
                    {(chooseLink && step === 3)&&
                      <ChooseResult linkInfo={chooseLink} />
                    }
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  component="p"
                  textAlign="center"
                  sx={{
                    fontWeight: 300,
                    mt: 1,
                    color: 'text.secondary',
                    fontSize: { lg: '1rem' }
                  }}
                >
                  Or <Link href="/signup" className="link">Sign Up</Link> for more advanced features...
                </Typography>
              </>
              } 
              <Button
                component="a"
                sx={{
                  width: '4.3rem',
                  height: '4.3rem',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: 'primary.main',
                  borderRadius: '100%',
                  mt: 8,
                }}
                href="#compare-options"
              >
                <KeyboardDoubleArrowDown fontSize="large" />
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        position="absolute"
        bottom={0}
        component="svg"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 1920 100.1"
        sx={{
          width: '100%',
          marginBottom: theme.spacing(-1),
        }}
      >
        <path
          fill={theme.palette.background.paper}
          d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
        ></path>
      </Box>
    </Box>
  );
};

export default Hero;