import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ThemeProvider } from 'styled-components';

const Sidebar = ({
    isOpen,
    children,
    blockName,
    theme,
}) => {
    const classes = classNames({
        [blockName]: true,
        [`${blockName}__filters--side`]: true,
        [`${blockName}__filters--open`]: isOpen
    });

    return (
        <ThemeProvider theme={theme}>
            <div className={classes}>
                {children}
            </div>
        </ThemeProvider>
    )
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool,
    children: PropTypes.node,
    blockName: PropTypes.string.isRequired,
    theme: PropTypes.any,
};

Sidebar.defaultProps = {
    isOpen: false,
    children: [],
    blockName: '',
    theme: {},
};

export default Sidebar;