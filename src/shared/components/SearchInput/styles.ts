import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const SearchInputWrap = styled.div`
  position: relative;
`;

export const MaterialIcon = styled.span`
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
  line-height: 1;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.muted};
  font-size: 20px;
  pointer-events: none;
`;

export const StyledSearchInput = styled.input`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  color: ${colors.white};
  font-size: 14px;
  border-radius: 8px;
  padding: 8px 16px 8px 40px;
  width: calc(100% - 56px);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: ${colors.muted2};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 1px ${colors.primary};
  }
`;

