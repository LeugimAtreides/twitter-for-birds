// TODO: Build out landing page with search and care options
import React from 'react';
import { SectionTitle, Toaster } from 'hw-react-components';
import { withTranslation } from 'react-i18next';
import Search from '../../components/Search/Search.jsx';
import Options from '../../components/Options/Options.tsx';
import appStyles from '../../containers/App/app.module.sass';
import * as SearchTheme from './themes/search.scss';

import styles from './findcare.module.sass';

const FindCare = ({ t }) => (
  <div className={appStyles.base}>
    <div className={styles.base}>
      <SectionTitle>
        What do you need care for?
      </SectionTitle>
      <p className={styles.subtitle}>
        Search a condition, specialty, physician or service you&apos;re looking for.
      </p>
      <Search {...{
        notify: Toaster.show,
        theme: SearchTheme,
        t,
        blockName: 'findCare-Search',
      }}
      />
      <Options />
    </div>
  </div>
);

export default withTranslation(['glossary', 'common'])(FindCare);
