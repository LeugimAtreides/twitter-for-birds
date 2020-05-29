import React from 'react';
import { SectionTitle } from 'hw-react-components';
import Cookies from 'js-cookie';
import Tile from '../Tile/Tile';
import eCareIcon from '../../assets/img/e-care.svg';
import LabTestIcon from '../../assets/img/lab-test.svg';
import UrgentCareIcon from '../../assets/img/urgent-care.svg';
import useFeatures from '../../connector-hooks/useFeatures/useFeatures.jsx';
import styles from './options.module.sass';
import { attribute, featureProps } from './types'

const featureInfo: any = {
  eCare: {
    icon: eCareIcon,
    route: '/ecare',
  },
  Lab: {
    icon: LabTestIcon,
    route: '/lab-test',
  },
  'Urgent Care': {
    icon: UrgentCareIcon,
    route: '/urget-care',
  },
};

const Options: React.FC = () => {
  const phrId = Cookies.get('phr_id');
  const { features } = useFeatures(phrId);

  function renderFeatures() {
    const filteredFeatures = features.data.filter((feature: featureProps) => Object.keys(featureInfo).includes(feature.feature_type));
    return filteredFeatures.map((feature: featureProps): any => {
      const attributes = feature.attributes.reduce((acc: any, attr: attribute) => {
        acc[attr.name] = attr.name === 'url' ? featureInfo[feature.feature_type].route : attr.value;
        return acc;
      }, { icon: featureInfo[feature.feature_type].icon });

      return (
        <Tile
          hasAccess="true"
          hasAccessContent=""
          key={feature.feature_id}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...attributes}
        />
      );
    });
  }

  return (
    <div>
      <SectionTitle>
        Care Options
      </SectionTitle>
      <div className={styles.base}>
        {!features?.meta?.loading && !features?.meta?.error && features?.data && renderFeatures()}
      </div>
    </div>
  );
}

export default Options
