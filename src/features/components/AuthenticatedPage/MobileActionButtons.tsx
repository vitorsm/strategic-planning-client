import { Sidebar } from "../../../shared";
import { NavIcon, NavItem, NavLabel, SidebarContent } from "./styles";
import { ActionButtonProps } from "../EntityCRUD/types";

interface MobileActionButtonsProps {
    primaryActionButton?: ActionButtonProps;
    secondaryActionButton?: ActionButtonProps;
    actionSidebarIsOpen: boolean;
    onSidebarClose: () => void;
}

export const MobileActionButtons = ({ 
    primaryActionButton, secondaryActionButton, actionSidebarIsOpen, onSidebarClose 
}: MobileActionButtonsProps) => {

    if (!primaryActionButton) {
        return null;
    }

    const onPrimaryActionClick = () => {
        primaryActionButton?.onClick();
        onSidebarClose();
    }

    const onSecondaryActionClick = () => {
        secondaryActionButton?.onClick();
        onSidebarClose();
    }

    return (
        <Sidebar
          isOpen={actionSidebarIsOpen} 
          onClose={onSidebarClose} 
          position="bottom" 
          width="320px">
          <SidebarContent>
            <NavItem $collapsed={false} onClick={onPrimaryActionClick}>
              <NavIcon className="material-symbols-outlined">{primaryActionButton?.icon}</NavIcon>
              <NavLabel $collapsed={false}>{primaryActionButton?.label}</NavLabel>
            </NavItem>
            {secondaryActionButton && (
              <NavItem $collapsed={false} onClick={onSecondaryActionClick}>
                <NavIcon className="material-symbols-outlined">{secondaryActionButton?.icon}</NavIcon>
                <NavLabel $collapsed={false}>{secondaryActionButton?.label}</NavLabel>
              </NavItem>
          )}
          </SidebarContent>
        </Sidebar>
    );
}