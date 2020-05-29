import React from 'react';
import styles from './tile.module.sass';

type TileProps = {
  hasAccess: string,
  hasAccessContent: string,
  icon: string,
  title: string,
  description: string,
  url: string,
  launchModal: string
}

export const Tile: React.FC<TileProps> = ({
  title, description, url, icon
}) => {

  function clickHandler() {
    console.log('clicked icon url: ', url);
  }

  return (
    <div className={styles.wrapper}>
      <div role="button" tabIndex={-1} className={styles.button} onClick={clickHandler}>
        <img src={icon} alt="icon" className={styles.icon} />
        <h2 className={styles.description}>
          {title}
        </h2>
        <small>{description}</small>
      </div>
    </div>
  );
}

export default Tile
