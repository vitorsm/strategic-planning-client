import styled from 'styled-components';
import { colors } from '../../../../shared/styles/colors';

export const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;

  @media (min-width: 768px) {
    padding: 40px 24px;
  }
`;

export const LayoutCard = styled.section`
  width: 100%;
  max-width: 1000px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const VisualPanel = styled.aside`
  display: none;
  position: relative;
  flex: 1;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(135deg, rgba(19, 127, 236, 0.9) 0%, rgba(16, 25, 34, 0.95) 100%),
    url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEvLHe6O4W2LTINLqpvH5K2FNW5hBUJ5TylYeHLYYIWTad-iqtEcA7XmMJHIPAG0qsa5pWXsaUyYJlhof2BQpKI1zD3Putve-kiISzPL6zCTdxrtfxHuS5eH8FJFvtff_TJdvYXUI_Z5ydHtP25fK0WRO8bih_TMCmKC7TWN4IA-nRSDlAHgZEs-EmRigNabN9WTI5QbbSxK0TVNdEZSxmOI0Kyy5y5IJ2vZdBoLHLDMi2iXWjXZXAfxNVxL9ldMOu_lUlGVBjR_Lq');

  @media (min-width: 768px) {
    display: block;
  }
`;

export const VisualContent = styled.div`
  position: absolute;
  inset: 0;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const VisualIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

export const MaterialIcon = styled.span`
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
  line-height: 1;
`;

export const VisualTitle = styled.h1`
  margin: 0 0 16px 0;
  color: ${colors.white};
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

export const VisualSubtitle = styled.p`
  margin: 0;
  color: rgba(219, 234, 254, 0.95);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  max-width: 360px;
`;

export const SocialProofRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatars = styled.div`
  display: flex;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: 2px solid ${colors.primary};
  object-fit: cover;

  & + & {
    margin-left: -12px;
  }
`;

export const SocialProofText = styled.span`
  color: ${colors.white};
  font-size: 13px;
  font-weight: 600;
`;

export const FormPanel = styled.div`
  flex: 1;
  padding: 32px;
  background: ${colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 48px;
  }
`;

export const FormInner = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const Header = styled.div`
  margin-bottom: 28px;
`;

export const WelcomeTitle = styled.h2`
  margin: 0 0 8px 0;
  color: ${colors.text};
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

export const WelcomeSubtitle = styled.p`
  margin: 0;
  color: ${colors.muted};
  font-size: 15px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RowBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const TextLink = styled.a`
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: ${colors.primaryHover};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${colors.surface2};
`;

export const DividerText = styled.span`
  color: ${colors.muted};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const SsoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const BottomNote = styled.div`
  margin-top: 28px;
  text-align: center;
`;

export const BottomNoteText = styled.p`
  margin: 0;
  color: ${colors.muted};
  font-size: 13px;
`;

export const FormMessage = styled.p<{ $variant: 'error' | 'success' }>`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $variant }) => ($variant === 'error' ? colors.danger : colors.success)};
`;

