import React from 'react';
import PropTypes from 'prop-types';
import styles from './empty.module.sass';

const Empty = ({ title, sub }) => <div className={styles[Empty.blockName]}>
    <div className={styles[`${Empty.blockName}__image`]}>
        <h3 className={styles[`${Empty.blockName}__title`]}>{title}</h3>
        <p className={styles[`${Empty.blockName}__sub`]}>{sub}</p>
    </div>
</div>;

Empty.propTypes = {
    title: PropTypes.string,
    sub: PropTypes.string
};

Empty.defaultProps = {
    title: '',
    sub: ''
};

Empty.blockName = 'deaui-Empty';

export default Empty;
