import { Sidebar } from "../../shared";
import { NavIcon, NavItem, NavLabel, SidebarContent } from "./AuthenticatedPage/styles";
import { ActionButtonProps } from "./EntityCRUD/types";

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

    return (
        <Sidebar 
          isOpen={actionSidebarIsOpen} 
          onClose={onSidebarClose} 
          position="bottom" 
          width="320px">
          <SidebarContent>
          <NavItem $collapsed={false} onClick={primaryActionButton?.onClick}>
            <NavIcon className="material-symbols-outlined">{primaryActionButton?.icon}</NavIcon>
            <NavLabel $collapsed={false}>{primaryActionButton?.label}</NavLabel>
          </NavItem>
          {secondaryActionButton && (
            <NavItem $collapsed={false} onClick={secondaryActionButton?.onClick}>
              <NavIcon className="material-symbols-outlined">{secondaryActionButton?.icon}</NavIcon>
              <NavLabel $collapsed={false}>{secondaryActionButton?.label}</NavLabel>
            </NavItem>
          )}
          </SidebarContent>
        </Sidebar>
    );
}