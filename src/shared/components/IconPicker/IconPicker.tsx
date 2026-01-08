import React, { useState, useMemo } from 'react';
import { Icon } from '../Icon';
import {
    Overlay,
    PickerContainer,
    PickerHeader,
    PickerTitle,
    CloseButton,
    SearchWrapper,
    SearchInputContainer,
    SearchIcon,
    SearchInput,
    IconsContainer,
    CategoryTitle,
    IconsGrid,
    IconItem,
    NoResults,
    NoResultsText,
    SelectedPreview,
    PreviewIcon,
    PreviewInfo,
    PreviewLabel,
    PreviewName,
    SelectButton,
} from './styles';

// Material Symbols icons organized by category
const ICON_CATEGORIES: Record<string, string[]> = {
    'Common': [
        'home', 'search', 'settings', 'menu', 'close', 'add', 'remove', 'edit', 'delete',
        'check', 'check_circle', 'cancel', 'info', 'warning', 'error', 'help', 'visibility',
        'visibility_off', 'refresh', 'sync', 'done', 'done_all', 'clear', 'arrow_back',
        'arrow_forward', 'expand_more', 'expand_less', 'more_vert', 'more_horiz',
    ],
    'Development': [
        'bug_report', 'code', 'terminal', 'integration_instructions', 'data_object', 'api',
        'developer_mode', 'build', 'construction', 'engineering', 'memory', 'storage',
        'cloud', 'cloud_upload', 'cloud_download', 'database', 'dns', 'hub', 'lan',
        'security', 'lock', 'lock_open', 'key', 'vpn_key', 'admin_panel_settings',
    ],
    'Project Management': [
        'task', 'task_alt', 'assignment', 'assignment_turned_in', 'checklist', 'fact_check',
        'pending_actions', 'rule', 'playlist_add_check', 'rocket_launch', 'flag', 'bookmark',
        'label', 'category', 'folder', 'folder_open', 'topic', 'inventory_2', 'archive',
        'source', 'deployed_code', 'layers', 'stacks', 'view_kanban',
    ],
    'Communication': [
        'chat', 'chat_bubble', 'forum', 'comment', 'feedback', 'rate_review', 'mail',
        'email', 'send', 'inbox', 'notifications', 'notifications_active', 'campaign',
        'announcement', 'record_voice_over', 'call', 'video_call', 'meeting_room',
        'groups', 'group', 'person', 'people', 'contacts', 'contact_page',
    ],
    'Time & Calendar': [
        'schedule', 'access_time', 'timer', 'hourglass_empty', 'hourglass_full', 'update',
        'history', 'restore', 'event', 'calendar_today', 'calendar_month', 'date_range',
        'today', 'event_available', 'event_busy', 'alarm', 'alarm_on', 'snooze',
        'timelapse', 'avg_pace', 'speed', 'slow_motion_video',
    ],
    'Analytics & Charts': [
        'analytics', 'insights', 'trending_up', 'trending_down', 'trending_flat', 'leaderboard',
        'bar_chart', 'pie_chart', 'show_chart', 'timeline', 'query_stats', 'monitoring',
        'assessment', 'donut_large', 'ssid_chart', 'stacked_line_chart', 'area_chart',
        'data_exploration', 'auto_graph', 'waterfall_chart', 'candlestick_chart',
    ],
    'Business': [
        'business', 'business_center', 'work', 'corporate_fare', 'apartment', 'domain',
        'store', 'storefront', 'shopping_cart', 'payments', 'account_balance', 'attach_money',
        'monetization_on', 'savings', 'credit_card', 'receipt', 'request_quote', 'paid',
        'currency_exchange', 'price_check', 'sell', 'local_offer',
    ],
    'Files & Documents': [
        'description', 'article', 'draft', 'note', 'note_add', 'sticky_note_2', 'post_add',
        'file_copy', 'file_present', 'upload_file', 'download', 'attach_file', 'link',
        'content_copy', 'content_paste', 'content_cut', 'save', 'save_as', 'print',
        'picture_as_pdf', 'table_chart', 'grid_view', 'view_list',
    ],
    'Status & Progress': [
        'check_circle', 'cancel', 'error', 'warning', 'info', 'help', 'pending', 'autorenew',
        'published_with_changes', 'unpublished', 'verified', 'new_releases', 'fiber_new',
        'star', 'star_half', 'star_outline', 'grade', 'thumb_up', 'thumb_down',
        'recommend', 'not_interested', 'block', 'do_not_disturb',
    ],
    'Actions': [
        'play_arrow', 'pause', 'stop', 'skip_next', 'skip_previous', 'fast_forward',
        'fast_rewind', 'replay', 'loop', 'shuffle', 'repeat', 'power_settings_new',
        'restart_alt', 'undo', 'redo', 'open_in_new', 'launch', 'exit_to_app',
        'fullscreen', 'fullscreen_exit', 'zoom_in', 'zoom_out',
    ],
    'Objects': [
        'lightbulb', 'emoji_objects', 'psychology', 'neurology', 'science', 'biotech',
        'rocket', 'satellite_alt', 'public', 'language', 'translate', 'extension',
        'widgets', 'apps', 'dashboard', 'space_dashboard', 'grid_on', 'view_module',
        'workspaces', 'view_in_ar', 'token', 'fingerprint',
    ],
    'Symbols': [
        'favorite', 'favorite_border', 'bolt', 'flash_on', 'auto_awesome', 'spark',
        'whatshot', 'local_fire_department', 'water_drop', 'air', 'eco', 'park',
        'nature', 'forest', 'grass', 'pets', 'cruelty_free', 'mood', 'sentiment_satisfied',
        'sentiment_dissatisfied', 'face', 'celebration', 'military_tech',
    ],
};

export interface IconPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void;
    selectedIcon?: string;
    previewColor?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedIcon = '',
    previewColor,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSelectedIcon, setTempSelectedIcon] = useState(selectedIcon);

    // Filter icons based on search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) {
            return ICON_CATEGORIES;
        }

        const query = searchQuery.toLowerCase();
        const filtered: Record<string, string[]> = {};

        Object.entries(ICON_CATEGORIES).forEach(([category, icons]) => {
            const matchingIcons = icons.filter(icon =>
                icon.toLowerCase().includes(query)
            );
            if (matchingIcons.length > 0) {
                filtered[category] = matchingIcons;
            }
        });

        return filtered;
    }, [searchQuery]);

    const hasResults = Object.keys(filteredCategories).length > 0;

    const handleIconClick = (iconName: string) => {
        setTempSelectedIcon(iconName);
    };

    const handleSelect = () => {
        onSelect(tempSelectedIcon);
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Reset temp selection when opening
    React.useEffect(() => {
        if (isOpen) {
            setTempSelectedIcon(selectedIcon);
            setSearchQuery('');
        }
    }, [isOpen, selectedIcon]);

    if (!isOpen) return null;

    return (
        <Overlay onClick={handleOverlayClick}>
            <PickerContainer role="dialog" aria-labelledby="icon-picker-title">
                <PickerHeader>
                    <PickerTitle id="icon-picker-title">Select Icon</PickerTitle>
                    <CloseButton onClick={onClose} aria-label="Close">
                        <Icon name="close" />
                    </CloseButton>
                </PickerHeader>

                <SearchWrapper>
                    <SearchInputContainer>
                        <SearchIcon className="material-symbols-outlined">search</SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Search icons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </SearchInputContainer>
                </SearchWrapper>

                <IconsContainer>
                    {hasResults ? (
                        Object.entries(filteredCategories).map(([category, icons]) => (
                            <div key={category}>
                                <CategoryTitle>{category}</CategoryTitle>
                                <IconsGrid>
                                    {icons.map((iconName) => (
                                        <IconItem
                                            key={iconName}
                                            type="button"
                                            $selected={tempSelectedIcon === iconName}
                                            onClick={() => handleIconClick(iconName)}
                                            aria-label={iconName}
                                            title={iconName}
                                        >
                                            <Icon name={iconName} />
                                        </IconItem>
                                    ))}
                                </IconsGrid>
                            </div>
                        ))
                    ) : (
                        <NoResults>
                            <span className="material-symbols-outlined">search_off</span>
                            <NoResultsText>No icons found for "{searchQuery}"</NoResultsText>
                        </NoResults>
                    )}
                </IconsContainer>

                {tempSelectedIcon && (
                    <SelectedPreview>
                        <PreviewIcon $color={previewColor}>
                            <Icon name={tempSelectedIcon} />
                        </PreviewIcon>
                        <PreviewInfo>
                            <PreviewLabel>Selected icon</PreviewLabel>
                            <PreviewName>{tempSelectedIcon}</PreviewName>
                        </PreviewInfo>
                        <SelectButton onClick={handleSelect}>
                            Select
                        </SelectButton>
                    </SelectedPreview>
                )}
            </PickerContainer>
        </Overlay>
    );
};

