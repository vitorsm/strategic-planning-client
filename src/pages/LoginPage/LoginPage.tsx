import React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { NavLink } from '../../components/NavLink';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { TextInput } from '../../components/TextInput';
import { useAuthenticate } from '../../hooks/useAuthenticate';
import { UnauthenticatedPage } from '../UnauthenticatedPage';
import {
  BottomNote,
  BottomNoteText,
  Divider,
  DividerLine,
  DividerText,
  Form,
  FormMessage,
  FormInner,
  FormPanel,
  Header,
  LayoutCard,
  Main,
  MaterialIcon,
  RowBetween,
  SsoGrid,
  VisualContent,
  VisualIconBox,
  VisualPanel,
  VisualSubtitle,
  VisualTitle,
  WelcomeSubtitle,
  WelcomeTitle,
} from './styles';

export const LoginPage = () => {
  const { authenticate, isLoading, error } = useAuthenticate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [didSucceed, setDidSucceed] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDidSucceed(false);
    try {
      await authenticate({ username, password });
      setDidSucceed(true);
    } catch {
      // `useAuthenticate` sets the user-facing error state.
    }
  };

  return (
    <UnauthenticatedPage>
      <Main>
        <LayoutCard>
          <VisualPanel aria-hidden="true">
            <VisualContent>
              <div>
                <VisualIconBox>
                  <MaterialIcon style={{ color: 'white', fontSize: 28 }}>insights</MaterialIcon>
                </VisualIconBox>
                <VisualTitle>Visualize your strategy.</VisualTitle>
                <VisualSubtitle>
                  Bring balance to your team&apos;s workflow and make engineering management work visible.
                </VisualSubtitle>
              </div>

            </VisualContent>
          </VisualPanel>

          <FormPanel>
            <FormInner>
              <Header>
                <WelcomeTitle>Welcome back</WelcomeTitle>
                <WelcomeSubtitle>Please enter your details to sign in.</WelcomeSubtitle>
              </Header>

              <Form onSubmit={onSubmit}>
                <TextInput
                  id="email"
                  name="username"
                  type="text"
                  label="Work Email"
                  icon="mail"
                  placeholder="name@company.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />

                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  icon="lock"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <RowBetween>
                  <Checkbox
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <NavLink href="#">Forgot password?</NavLink>
                </RowBetween>

                <PrimaryButton
                  variant="form"
                  type="submit"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  style={{ width: '100%', height: 48, fontSize: 16, boxShadow: '0 10px 30px rgba(19, 127, 236, 0.25)' }}
                >
                  {isLoading ? 'Logging in…' : 'Log In'}
                </PrimaryButton>

                {error ? <FormMessage $variant="error">{error}</FormMessage> : null}
                {!error && didSucceed ? <FormMessage $variant="success">Logged in.</FormMessage> : null}
              </Form>

              <Divider>
                <DividerLine />
                <DividerText>Or continue with</DividerText>
                <DividerLine />
              </Divider>

              <SsoGrid>
                <SecondaryButton
                  type="button"
                  icon={
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1V11.1Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                >
                  Google
                </SecondaryButton>

                <SecondaryButton
                  type="button"
                  icon={
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12C2 16.418 5.865 20 10.134 20C10.634 20 10.817 19.783 10.817 19.517C10.817 19.267 10.817 18.633 10.8 17.783C6.45 18.733 5.534 15.7 5.534 15.7C5.084 14.55 4.434 14.25 4.434 14.25C3.017 13.283 4.534 13.3 4.534 13.3C6.1 13.417 6.934 14.917 6.934 14.917C8.317 17.283 10.567 16.6 11.45 16.2C11.6 15.2 12 14.517 12.434 14.133C8.967 13.733 5.317 12.4 5.317 6.433C5.317 4.733 5.917 3.35 6.917 2.267C6.75 1.867 6.217 0.267 7.067 2.267C8.367 2.267 9.534 3.167 9.534 3.167C10.334 2.95 11.167 2.833 12.001 2.833C12.835 2.833 13.668 2.95 14.468 3.167C14.468 3.167 15.634 2.267 16.935 2.267C17.785 0.267 17.251 1.867 17.085 2.267C18.085 3.35 18.685 4.733 18.685 6.433C18.685 12.417 15.018 13.733 11.551 14.117C12.101 14.583 12.585 15.533 12.585 16.983C12.585 19.05 12.568 20 12.568 20C12.568 20 12.751 20 13.251 20C17.518 20 21.385 16.418 21.385 12C21.385 6.477 16.908 2 11.385 2H12Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                  }
                >
                  GitHub
                </SecondaryButton>
              </SsoGrid>

              <BottomNote>
                <BottomNoteText>
                  Don&apos;t have an account? <NavLink href="#">Sign up</NavLink>
                </BottomNoteText>
              </BottomNote>
            </FormInner>
          </FormPanel>
        </LayoutCard>
      </Main>
    </UnauthenticatedPage>
  );
};


