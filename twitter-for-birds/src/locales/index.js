import englishGlossary from './english/glossary.json';
import englishCommon from './english/common.json';

const languages = {
  english: {
    common: englishCommon,
    glossary: englishGlossary,
  },
};

export default {
  english: { ...languages.english },
};
