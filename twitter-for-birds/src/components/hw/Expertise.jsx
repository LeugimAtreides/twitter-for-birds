/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from './VideoPlayer';
import { sanitizeHTML } from '../../utils/strings'
import '../Provider/provider-profile.sass';

const Expertise = ({ provider }) => {
  const languages = provider.languages && provider.languages.map(language => <li key={language}>{language}</li>);


  const fellowship = () => {
    if (provider.education) {
      return provider.education.fellowship
        ? provider.education.fellowship.map(fellowship => (
          <dl key="fellowship">
            <dt>Fellowship</dt>
            <dd key={fellowship}>{`${fellowship.name ? `${fellowship.name}` : ''} ${fellowship.location ? `${fellowship.location}` : ''}`}</dd>
          </dl>
        ))
        : null;
    }
  };

  const residency = () => {
    if (provider.education) {
      return provider.education.residency
        ? provider.education.residency.map(residency => (
          <dl key="residency">
            <dt>Residency</dt>
            <dd key={residency}>{`${residency.name ? `${residency.name}` : ''} ${residency.location ? `${residency.location}` : ''}`}</dd>
          </dl>
        ))
        : null;
    }
  };

  const publications = () => (Array.isArray(provider.publications) ? provider.publications.map((publication, i) => (
    <dl key={i}>
      <dt dangerouslySetInnerHTML={{ __html: sanitizeHTML(publication) }} />
    </dl>
  )) : null);

  const licensures = () => (Array.isArray(provider.licensures) ? provider.licensures.map((licensure, i) => (
    <dl key={i}>
      <dt dangerouslySetInnerHTML={{ __html: sanitizeHTML(licensure) }} />
    </dl>
  )) : null);


  const professionalAffiliations = () => (Array.isArray(provider.professional_affiliations) ? provider.professional_affiliations.map((professional_affiliation, i) => (
    <dl key={i}>
      <dt dangerouslySetInnerHTML={{ __html: sanitizeHTML(professional_affiliation) }} />
    </dl>
  )) : null);

  const medSchool = () => {
    if (provider.education) {
      return provider.education.medicalSchool
        ? provider.education.medicalSchool.map(school => (
          <dl key="medSchool">
            <dt>Medical School</dt>
            <dd key={school}>{`${school.name} ${school.location ? `,${school.location}` : ''}`}</dd>
          </dl>
        ))
        : null;
    }
  };

  const boards = () => {
    if (provider.education) {
      return provider.education.boardCertification
        ? provider.education.boardCertification.map(board => (
          <dl key={board}>
            <dt>{board.name}</dt>
            <dd key={board}>{board.description}</dd>
          </dl>
        ))
        : null;
    }
  };

  return ( // .hwui-ProviderProfile__Expertise--section .column2
    <div className={`${Expertise.blockName}`}>
      {provider.videos
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>video</h2>
            </div>
            <div className="column2">
              <VideoPlayer service="youtube" video={`https://www.youtube.com/watch?v=${provider.videoLink[2]}`} />
            </div>
          </div>
        )}
      {provider.fullBiography
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>biography</h2>
            </div>
            <div className="column2">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(provider.fullBiography) }} />
            </div>
          </div>
        )}
      {provider.carePhilosophy
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>care philosophy</h2>
            </div>
            <div className="column2">
              <p dangerouslySetInnerHTML={{ __html: sanitizeHTML(provider.carePhilosophy) }} />
            </div>
          </div>
        )}
      {provider.personalInterests
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>personal interests</h2>
            </div>
            <div className="column2">
              <p dangerouslySetInnerHTML={{ __html: sanitizeHTML(provider.personalInterests) }} />
            </div>
          </div>
        )}
      {provider.languages
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>languages spoken</h2>
            </div>
            <div className="column2">
              <ul>
                {languages}
              </ul>
            </div>
          </div>
        )}
      {provider.education
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>education</h2>
            </div>
            <div className="column2">
              {fellowship()}
              {residency()}
              {medSchool()}
            </div>
          </div>
        )}
      {provider.education?.boardCertification && (
        <div className={`${Expertise.blockName}--section`}>
          <div className="column1">
            <h2>
              board
              <br />
              certifications
            </h2>
          </div>
          <div className="column2">
            {boards()}
          </div>
        </div>
      )}
      {provider.licensures
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>licensures</h2>
            </div>
            <div className="column2">
              {licensures()}
            </div>
          </div>
        )}
      {provider.publications
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>publications</h2>
            </div>
            <div className="column2">
              {publications()}
            </div>
          </div>
        )}
      {provider.professional_affiliations
        && (
          <div className={`${Expertise.blockName}--section`}>
            <div className="column1">
              <h2>professional affiliations</h2>
            </div>
            <div className="column2">
              {professionalAffiliations()}
            </div>
          </div>
        )}
    </div>
  );
};

Expertise.blockName = 'hwui-ProviderProfile__Expertise';
Expertise.propTypes = {
  provider: PropTypes.object.isRequired,
};
export default Expertise;
