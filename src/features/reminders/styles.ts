import styled from 'styled-components';

export const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const RightColumn = styled.div`
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ActionCardText = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

